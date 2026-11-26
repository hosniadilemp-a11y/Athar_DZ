"""Integration tests for Phase 2A PDF upload, Mode 1/2 extraction, and isolated validation."""

from __future__ import annotations

import hashlib
import uuid
from pathlib import Path

import pytest
from httpx import ASGITransport, AsyncClient

from app.db.postgres_schema import init_postgres_schema
from app.main import app


def _load_sample_pdf(name: str = "01_pv_plainte_escroquerie.pdf") -> bytes:
    container_mount = Path("/app/tests/fixtures/pdf_samples") / name
    if container_mount.exists():
        return container_mount.read_bytes()
    repo_path = (
        Path(__file__).resolve().parents[4]
        / "doc"
        / "examples"
        / "option_b_synthetic_samples"
        / "pdf"
        / name
    )
    return repo_path.read_bytes()


def _load_sample_html(name: str = "02_page_phishing_baridimob.html") -> bytes:
    container_mount = Path("/app/tests/fixtures/html_samples") / name
    if container_mount.exists():
        return container_mount.read_bytes()
    repo_path = (
        Path(__file__).resolve().parents[4]
        / "doc"
        / "examples"
        / "option_b_synthetic_samples"
        / "html"
        / name
    )
    return repo_path.read_bytes()


@pytest.mark.asyncio
async def test_pdf_ingestion_mode2_and_isolated_validation() -> None:
    """Full lifecycle: upload PDF -> Mode 2 stages 1..3 -> single, merge, reject, select_all."""
    await init_postgres_schema()
    pdf_bytes = _load_sample_pdf("01_pv_plainte_escroquerie.pdf")
    sha256 = hashlib.sha256(pdf_bytes).hexdigest()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Create two isolated cases
        case_res = await client.post(
            "/api/v1/cases",
            json={
                "code": f"INGEST-2A-{uuid.uuid4().hex[:6]}",
                "title": "Test Ingestion PDF Phase 2A",
                "description": "Verification workflow isole",
            },
        )
        assert case_res.status_code == 201
        case_id = case_res.json()["id"]

        other_case_res = await client.post(
            "/api/v1/cases",
            json={
                "code": f"INGEST-OTHER-{uuid.uuid4().hex[:6]}",
                "title": "Autre Dossier Isole",
                "description": "Verification isolation case_id",
            },
        )
        assert other_case_res.status_code == 201
        other_case_id = other_case_res.json()["id"]

        # Create an existing phone node in case_id to test deduplication / merge hint
        existing_phone_res = await client.post(
            f"/api/v1/cases/{case_id}/nodes",
            json={
                "type": "telephone",
                "label": "+2135550101",
                "properties": {"numero_e164": "+2135550101"},
            },
        )
        assert existing_phone_res.status_code == 201
        existing_phone_id = existing_phone_res.json()["id"]

        # Create raw PDF node (adds ONLY the PDF node to graph)
        pdf_node_res = await client.post(
            f"/api/v1/cases/{case_id}/nodes",
            json={
                "type": "document_judiciaire",
                "label": "01_pv_plainte_escroquerie.pdf",
                "properties": {"is_raw_evidence": True, "client_sha256": sha256},
            },
        )
        assert pdf_node_res.status_code == 201
        pdf_node_id = pdf_node_res.json()["id"]

        # Upload PDF bytes
        up_res = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{pdf_node_id}/upload",
            files={"file": ("01_pv_plainte_escroquerie.pdf", pdf_bytes, "application/pdf")},
            data={"client_sha256": sha256},
        )
        assert up_res.status_code == 201
        up_data = up_res.json()
        assert up_data["sha256"] == sha256
        assert up_data["blackboard_sync_status"] == "NOT_PUBLISHED"

        # Verify cross-case isolation blocks access from other_case_id
        cross_res = await client.get(
            f"/api/v1/cases/{other_case_id}/ingestion/nodes/{pdf_node_id}/candidates"
        )
        assert cross_res.status_code == 404

        # Start Mode 2 Stage 1 (step_by_step)
        m2_s1 = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{pdf_node_id}/extract",
            json={"mode": "step_by_step", "selected_tools": ["pymupdf", "arabic-ner"]},
        )
        assert m2_s1.status_code == 200
        run_data = m2_s1.json()["latest_run"]
        assert run_data["status"] == "WAITING_HUMAN"
        assert run_data["current_stage"] == 1
        run_id = run_data["id"]

        # Advance Mode 2 -> Stage 2
        m2_s2 = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/runs/{run_id}/next-stage"
        )
        assert m2_s2.status_code == 200
        assert m2_s2.json()["latest_run"]["current_stage"] == 2
        assert m2_s2.json()["latest_run"]["status"] == "WAITING_HUMAN"

        # Advance Mode 2 -> Stage 3
        m2_s3 = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/runs/{run_id}/next-stage"
        )
        assert m2_s3.status_code == 200
        s3_payload = m2_s3.json()
        assert s3_payload["latest_run"]["current_stage"] == 3
        assert s3_payload["latest_run"]["status"] == "COMPLETED"
        candidates = s3_payload["candidates"]
        assert len(candidates) >= 8

        # Graph MUST NOT contain staged entities yet (only existing_phone + pdf_node)
        graph_before = await client.get(f"/api/v1/cases/{case_id}/graph?impact_only=false")
        assert graph_before.status_code == 200
        assert graph_before.json()["total_case_nodes"] == 2

        # 1. Merge the matched phone candidate
        matched_phone = next(
            c
            for c in candidates
            if c["entity_type"] == "telephone" and c["matched_existing_node_id"]
        )
        assert matched_phone["matched_existing_node_id"] == existing_phone_id
        merge_res = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{pdf_node_id}/candidates/validate",
            json={"action": "merge", "candidate_ids": [matched_phone["id"]]},
        )
        assert merge_res.status_code == 200
        assert merge_res.json()["processed_count"] == 1
        assert merge_res.json()["created_edges"][0]["type"] == "EXTRAIT_DE"

        # 2. Validate one candidate individually (and confirm never VERIFIED automatically)
        wilaya_or_email = next(
            c for c in candidates if c["entity_type"] in {"wilaya", "adresse_email"}
        )
        single_res = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{pdf_node_id}/candidates/validate",
            json={"action": "validate", "candidate_ids": [wilaya_or_email["id"]]},
        )
        assert single_res.status_code == 200
        created_node = single_res.json()["created_nodes"][0]
        assert created_node["layer"] != "VERIFIED"
        updated_cand = single_res.json()["updated_candidates"][0]
        assert updated_cand["blackboard_sync_status"] == "READY_FOR_BLACKBOARD"

        # 3. Reject one candidate
        to_reject = next(
            c
            for c in candidates
            if c["id"] not in {matched_phone["id"], wilaya_or_email["id"]}
        )
        reject_res = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{pdf_node_id}/candidates/validate",
            json={"action": "reject", "candidate_ids": [to_reject["id"]]},
        )
        assert reject_res.status_code == 200
        assert reject_res.json()["updated_candidates"][0]["validation_status"] == "REJECTED"

        # 4. Bulk select_all remaining pending candidates
        bulk_res = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{pdf_node_id}/candidates/validate",
            json={"action": "validate", "select_all": True},
        )
        assert bulk_res.status_code == 200
        assert bulk_res.json()["pending_remaining"] == 0
        assert bulk_res.json()["processed_count"] >= 5
        for n in bulk_res.json()["created_nodes"]:
            assert n["layer"] != "VERIFIED"

        # 5. Audit chain must remain cryptographically valid
        audit_res = await client.get(f"/api/v1/cases/{case_id}/audit/verify")
        assert audit_res.status_code == 200
        assert audit_res.json()["is_valid"] is True


@pytest.mark.asyncio
async def test_pdf_ingestion_mode1_quick() -> None:
    """Mode 1 quick runs in single pass without polluting the graph."""
    await init_postgres_schema()
    pdf_bytes = _load_sample_pdf("04_rapport_osint_domaine_cyber.pdf")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        case_res = await client.post(
            "/api/v1/cases",
            json={
                "code": f"INGEST-M1-{uuid.uuid4().hex[:6]}",
                "title": "Test Mode 1 PDF",
                "description": "Quick mode check",
            },
        )
        case_id = case_res.json()["id"]
        node_res = await client.post(
            f"/api/v1/cases/{case_id}/nodes",
            json={"type": "scelle_numerique", "label": "04_rapport_osint_domaine_cyber.pdf"},
        )
        node_id = node_res.json()["id"]

        up_res = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{node_id}/upload",
            files={"file": ("04_rapport_osint_domaine_cyber.pdf", pdf_bytes, "application/pdf")},
        )
        assert up_res.status_code == 201

        ext_res = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{node_id}/extract",
            json={"mode": "quick", "selected_tools": ["pymupdf"]},
        )
        assert ext_res.status_code == 200
        data = ext_res.json()
        assert data["latest_run"]["status"] == "COMPLETED"
        assert data["latest_run"]["total_stages"] == 1
        assert data["counts"]["pending"] >= 8


@pytest.mark.asyncio
async def test_html_ingestion_mode2_and_isolated_validation() -> None:
    """Full HTML lifecycle: upload -> Mode 2 stages 1..3 -> validate C2/APK -> audit verify."""
    await init_postgres_schema()
    html_bytes = _load_sample_html("02_page_phishing_baridimob.html")
    sha256 = hashlib.sha256(html_bytes).hexdigest()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        case_res = await client.post(
            "/api/v1/cases",
            json={
                "code": f"INGEST-HTML-{uuid.uuid4().hex[:6]}",
                "title": "Test Ingestion HTML Phase 2A",
                "description": "Verification workflow HTML isole",
            },
        )
        assert case_res.status_code == 201
        case_id = case_res.json()["id"]

        html_node_res = await client.post(
            f"/api/v1/cases/{case_id}/nodes",
            json={
                "type": "scelle_numerique",
                "label": "02_page_phishing_baridimob.html",
                "properties": {"is_raw_evidence": True, "client_sha256": sha256},
            },
        )
        assert html_node_res.status_code == 201
        html_node_id = html_node_res.json()["id"]

        # Reject binary/PDF bytes masquerading as HTML
        bad_res = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{html_node_id}/upload",
            files={"file": ("spoof.html", b"%PDF-1.4\nfake", "text/html")},
        )
        assert bad_res.status_code == 400

        # Upload genuine static HTML
        up_res = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{html_node_id}/upload",
            files={"file": ("02_page_phishing_baridimob.html", html_bytes, "text/html")},
            data={"client_sha256": sha256},
        )
        assert up_res.status_code == 201
        assert up_res.json()["mime_type"] == "text/html"
        assert up_res.json()["sha256"] == sha256

        # Run Mode 2 Stage 1 -> 2 -> 3
        s1 = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{html_node_id}/extract",
            json={"mode": "step_by_step", "selected_tools": ["beautifulsoup4"]},
        )
        assert s1.status_code == 200
        run_id = s1.json()["latest_run"]["id"]
        assert s1.json()["latest_run"]["status"] == "WAITING_HUMAN"

        s2 = await client.post(f"/api/v1/cases/{case_id}/ingestion/runs/{run_id}/next-stage")
        assert s2.status_code == 200
        assert s2.json()["latest_run"]["current_stage"] == 2

        s3 = await client.post(f"/api/v1/cases/{case_id}/ingestion/runs/{run_id}/next-stage")
        assert s3.status_code == 200
        assert s3.json()["latest_run"]["status"] == "COMPLETED"
        candidates = s3.json()["candidates"]
        assert any(c["entity_type"] == "serveur_c2" for c in candidates)
        assert any(c["entity_type"] == "fichier_apk" for c in candidates)
        assert any(c["source_locator"] for c in candidates)

        # Graph must still only have the HTML scelle_numerique node
        graph_before = await client.get(f"/api/v1/cases/{case_id}/graph?impact_only=false")
        assert graph_before.json()["total_case_nodes"] == 1

        # Select-all validate -> creates canonical nodes + EXTRAIT_DE edges
        bulk_res = await client.post(
            f"/api/v1/cases/{case_id}/ingestion/nodes/{html_node_id}/candidates/validate",
            json={"action": "validate", "select_all": True},
        )
        assert bulk_res.status_code == 200
        assert bulk_res.json()["pending_remaining"] == 0
        assert all(e["type"] == "EXTRAIT_DE" for e in bulk_res.json()["created_edges"])
        assert all(n["layer"] != "VERIFIED" for n in bulk_res.json()["created_nodes"])

        audit_res = await client.get(f"/api/v1/cases/{case_id}/audit/verify")
        assert audit_res.status_code == 200
        assert audit_res.json()["is_valid"] is True
