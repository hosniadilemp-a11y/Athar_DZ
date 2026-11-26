"""Integration tests for Graph API endpoints (Milestone 1C)."""

import uuid

import pytest
from httpx import ASGITransport, AsyncClient

from app.db.seed import seed_candy_wheels
from app.main import app


@pytest.fixture(autouse=True)
async def setup_seed() -> None:
    """Ensure database has the fresh 100-node case before API tests run."""
    await seed_candy_wheels(force=True)


@pytest.mark.asyncio
async def test_list_and_get_cases() -> None:
    """Test case listing and fetching single case by ID."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/cases")
        assert res.status_code == 200
        cases = res.json()
        assert len(cases) >= 1

        seed_cases = [c for c in cases if "CANDY" in c["code"] or "ATHAR" in c["code"]]
        assert len(seed_cases) >= 1
        case_item = seed_cases[0]
        assert "id" in case_item
        case_id = case_item["id"]

        # Fetch by ID
        res_single = await client.get(f"/api/v1/cases/{case_id}")
        assert res_single.status_code == 200
        single = res_single.json()
        assert single["id"] == case_id
        assert single["nodes_count"] == 100
        assert single["edges_count"] == 129


@pytest.mark.asyncio
async def test_create_case() -> None:
    """Test creating a new judicial case."""
    transport = ASGITransport(app=app)
    unique_code = f"TEST-CASE-{uuid.uuid4().hex[:6].upper()}"
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post(
            "/api/v1/cases",
            json={
                "code": unique_code,
                "title": "Affaire de Test API",
                "description": "Dossier créé automatiquement pour test d'API",
            },
        )
        assert res.status_code == 201
        data = res.json()
        assert data["code"] == unique_code
        assert data["title"] == "Affaire de Test API"


@pytest.mark.asyncio
async def test_graph_read_full_and_impact() -> None:
    """Test graph reading with and without impact filter."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Get case ID
        res_cases = await client.get("/api/v1/cases")
        seed_cases = [c for c in res_cases.json() if "CANDY" in c["code"] or "ATHAR" in c["code"]]
        case_id = seed_cases[0]["id"]

        # 1. Full graph
        res_full = await client.get(f"/api/v1/cases/{case_id}/graph?impact_only=false")
        assert res_full.status_code == 200
        graph_full = res_full.json()
        assert graph_full["is_impact_view"] is False
        assert len(graph_full["nodes"]) == 100
        assert len(graph_full["edges"]) == 129
        assert graph_full["total_case_nodes"] == 100
        assert graph_full["total_case_edges"] == 129

        # 2. Impact view
        res_impact = await client.get(f"/api/v1/cases/{case_id}/graph?impact_only=true")
        assert res_impact.status_code == 200
        graph_impact = res_impact.json()
        assert graph_impact["is_impact_view"] is True
        assert 10 <= len(graph_impact["nodes"]) <= 60
        assert graph_impact["total_case_nodes"] == 100


@pytest.mark.asyncio
async def test_graph_expand() -> None:
    """Test 1-hop neighborhood expansion from a starting node."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res_cases = await client.get("/api/v1/cases")
        seed_cases = [c for c in res_cases.json() if "CANDY" in c["code"] or "ATHAR" in c["code"]]
        case_id = seed_cases[0]["id"]

        # Grab a node from full graph
        res_graph = await client.get(f"/api/v1/cases/{case_id}/graph")
        nodes = res_graph.json()["nodes"]
        start_node_id = nodes[0]["id"]

        # Expand 1 hop
        res_exp = await client.post(
            f"/api/v1/cases/{case_id}/graph/expand",
            json={"node_ids": [start_node_id], "hops": 1},
        )
        assert res_exp.status_code == 200
        exp_data = res_exp.json()
        assert len(exp_data["nodes"]) >= 1


@pytest.mark.asyncio
async def test_node_and_edge_crud() -> None:
    """Test manual node creation, ontology-validated edge creation, and layer change."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res_cases = await client.get("/api/v1/cases")
        seed_cases = [c for c in res_cases.json() if "CANDY" in c["code"] or "ATHAR" in c["code"]]
        case_id = seed_cases[0]["id"]

        # 1. Create a person node
        res_n1 = await client.post(
            f"/api/v1/cases/{case_id}/nodes",
            json={
                "type": "personne",
                "label": "Suspect Test Manuel",
                "confidence": 0.9,
                "properties": {"role": "suspect"},
                "latitude": 36.75,
                "longitude": 3.05,
            },
        )
        assert res_n1.status_code == 201
        n1 = res_n1.json()
        assert n1["type"] == "personne"
        assert n1["layer"] == "HYPOTHESIS"
        node1_id = n1["id"]

        # 2. Create a phone node
        res_n2 = await client.post(
            f"/api/v1/cases/{case_id}/nodes",
            json={
                "type": "telephone",
                "label": "+213 555 01 99 99",
                "properties": {"operator": "Mobilis"},
            },
        )
        assert res_n2.status_code == 201
        n2 = res_n2.json()
        node2_id = n2["id"]

        # 2b. Create a node with explicit VERIFIED layer override
        res_n3 = await client.post(
            f"/api/v1/cases/{case_id}/nodes",
            json={
                "type": "document_judiciaire",
                "label": "PV Scellé Direct 100%",
                "layer": "VERIFIED",
                "confidence": 1.0,
            },
        )
        assert res_n3.status_code == 201
        assert res_n3.json()["layer"] == "VERIFIED"

        # 3. Create valid relation: personne -> UTILISE_TELEPHONE -> telephone
        res_edge = await client.post(
            f"/api/v1/cases/{case_id}/edges",
            json={
                "type": "UTILISE_TELEPHONE",
                "source_id": node1_id,
                "target_id": node2_id,
            },
        )
        assert res_edge.status_code == 201
        edge = res_edge.json()
        assert edge["type"] == "UTILISE_TELEPHONE"
        assert edge["layer"] == "VERIFIED"
        assert edge["confidence"] == pytest.approx(1.0)
        edge_id = edge["id"]

        # 3b. Update edge (layer, confidence, custom relation, props) & verify
        res_patch_edge = await client.patch(
            f"/api/v1/cases/{case_id}/edges/{edge_id}",
            json={
                "type": "CONTACTE_PAR",
                "layer": "FLOWS",
                "confidence": 0.77,
                "allow_custom_relation": True,
                "properties": {"source_note": "Recoupement CDR Fictif"},
                "reason": "Mise à jour relation analytique",
            },
        )
        assert res_patch_edge.status_code == 200
        patched_edge = res_patch_edge.json()
        assert patched_edge["type"] == "CONTACTE_PAR"
        assert patched_edge["layer"] == "FLOWS"
        assert patched_edge["confidence"] == pytest.approx(0.77)
        assert patched_edge["properties"]["source_note"] == "Recoupement CDR Fictif"

        # 4. Try invalid relation: telephone -> DIRIGE_ENTREPRISE -> personne (Must fail 400)
        res_invalid_edge = await client.post(
            f"/api/v1/cases/{case_id}/edges",
            json={
                "type": "DIRIGE_ENTREPRISE",
                "source_id": node2_id,
                "target_id": node1_id,
            },
        )
        assert res_invalid_edge.status_code == 400
        err = res_invalid_edge.json()
        assert "error" in err
        assert err["error"]["code"] == "INVALID_RELATION_FOR_NODES"

        # 4b. Delete edge -> removed from active graph & subsequent DELETE returns 404
        res_del_edge = await client.delete(
            f"/api/v1/cases/{case_id}/edges/{edge_id}?reason=Suppression+doublon"
        )
        assert res_del_edge.status_code == 200
        assert res_del_edge.json()["status"] == "deleted"
        assert res_del_edge.json()["edge_id"] == edge_id

        res_graph_after_del = await client.get(
            f"/api/v1/cases/{case_id}/graph?impact_only=false"
        )
        assert res_graph_after_del.status_code == 200
        assert all(e["id"] != edge_id for e in res_graph_after_del.json()["edges"])

        res_del_again = await client.delete(f"/api/v1/cases/{case_id}/edges/{edge_id}")
        assert res_del_again.status_code == 404

        # 5. Layer change with justification
        res_layer = await client.put(
            f"/api/v1/cases/{case_id}/nodes/{node1_id}/layer",
            json={
                "new_layer": "VERIFIED",
                "reason": "Identification formelle par PV d'audition n° 2026/089",
            },
        )
        assert res_layer.status_code == 200
        updated_n1 = res_layer.json()
        assert updated_n1["layer"] == "VERIFIED"

        # 6. Direct layer change without manual justification succeeds immediately (Decision D19)
        res_direct_layer = await client.put(
            f"/api/v1/cases/{case_id}/nodes/{node1_id}/layer",
            json={
                "new_layer": "OSINT_RAW",
                "reason": "",
            },
        )
        assert res_direct_layer.status_code == 200
        assert res_direct_layer.json()["layer"] == "OSINT_RAW"

        # 7. Tool proposals for node
        res_tools = await client.get(f"/api/v1/cases/{case_id}/nodes/{node2_id}/tools")
        assert res_tools.status_code == 200
        tools = res_tools.json()
        assert len(tools) >= 1
        assert any("BTS" in t["name_fr"] or "CDR" in t["name_fr"] for t in tools)


@pytest.mark.asyncio
async def test_audit_verification_endpoint() -> None:
    """Test that the audit chain is verified as cryptographically intact."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res_cases = await client.get("/api/v1/cases")
        seed_cases = [c for c in res_cases.json() if "CANDY" in c["code"] or "ATHAR" in c["code"]]
        case_id = seed_cases[0]["id"]

        res_audit = await client.get(f"/api/v1/cases/{case_id}/audit/verify")
        assert res_audit.status_code == 200
        verification = res_audit.json()
        assert verification["is_valid"] is True
        assert verification["total_entries"] >= 1
        assert "100% authentic" in verification["message"]


@pytest.mark.asyncio
async def test_get_registry_endpoint() -> None:
    """Test that /api/v1/registry returns 37 node types, 50 relations, and 5 layers."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/v1/registry")
        assert res.status_code == 200
        reg = res.json()
        assert len(reg["layers"]) == 5
        assert len(reg["node_types"]) == 37
        assert len(reg["relation_types"]) == 50
        assert reg["metadata"]["gps_enabled_count"] == 8
