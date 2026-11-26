"""Service layer for Phase 2A manual static PDF upload, extraction, and validation."""

from __future__ import annotations

import hashlib
import json
import logging
import tempfile
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import HTTPException
from neo4j import AsyncDriver
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

from app.core.config import get_settings
from app.domain.registry import NODE_TYPES, LayerId, validate_relation
from app.schemas.edge import EdgeCreate, EdgeResponse
from app.schemas.ingestion import (
    CandidateUpdateRequest,
    CaseIngestionSummaryResponse,
    EvidenceUploadResponse,
    ExtractedCandidateResponse,
    ExtractedRelationResponse,
    ExtractionRunResponse,
    NodeCandidatesResponse,
    RelationUpdateRequest,
    ValidateCandidatesRequest,
    ValidateCandidatesResponse,
    ValidateRelationsRequest,
    ValidateRelationsResponse,
)
from app.schemas.node import NodeCreate, NodeResponse
from app.services.audit_service import log_audit_event
from app.services.extraction.common_extractors import (
    ExtractedCandidateItem,
    ExtractedRelationItem,
)
from app.services.extraction.html_extractor import (
    extract_html_metadata,
    extract_html_mode1_quick,
    extract_html_mode2_stage,
)
from app.services.extraction.pdf_extractor import (
    extract_mode1_quick,
    extract_mode2_stage,
    extract_pdf_metadata,
)
from app.services.graph_service import create_edge, create_node, get_case

logger = logging.getLogger(__name__)

MAX_EVIDENCE_BYTES = 25 * 1024 * 1024  # 25 MB safety cap
MAX_PDF_BYTES = MAX_EVIDENCE_BYTES


def _resolve_upload_root() -> Path:
    configured = Path(get_settings().upload_dir)
    try:
        configured.mkdir(parents=True, exist_ok=True)
        return configured
    except OSError:
        fallback = Path(tempfile.gettempdir()) / "athar_uploads"
        fallback.mkdir(parents=True, exist_ok=True)
        return fallback


def _sanitize_filename(raw: str) -> str:
    base = (raw or "document.pdf").replace("\\", "/").split("/")[-1]
    cleaned = "".join(ch for ch in base if ord(ch) >= 32 and ch not in '<>:"|?*').strip()
    return (cleaned or "document.pdf")[:180]


def _parse_jsonb(val: Any, default: Any) -> Any:
    if val is None:
        return default
    if isinstance(val, (dict, list)):
        return val
    return json.loads(str(val))


async def _ensure_evidence_node(
    engine: AsyncEngine, case_id: uuid.UUID, node_id: uuid.UUID
) -> tuple[str, dict[str, Any]]:
    await get_case(engine, case_id)
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT type, properties FROM nodes "
                "WHERE id = :nid AND case_id = :cid AND deleted_at IS NULL;"
            ),
            {"nid": node_id, "cid": case_id},
        )
        row = res.fetchone()
    if not row:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "NODE_NOT_FOUND",
                "message": f"Evidence node '{node_id}' not found in case '{case_id}'",
            },
        )
    return str(row[0]), _parse_jsonb(row[1], {})


async def _merge_node_properties(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    node_id: uuid.UUID,
    updates: dict[str, Any],
) -> None:
    async with engine.begin() as conn:
        res = await conn.execute(
            text("SELECT properties FROM nodes WHERE id = :nid AND case_id = :cid;"),
            {"nid": node_id, "cid": case_id},
        )
        row = res.fetchone()
        if not row:
            return
        props = _parse_jsonb(row[0], {})
        props.update(updates)
        await conn.execute(
            text(
                "UPDATE nodes SET properties = CAST(:props AS JSONB), "
                "updated_at = CURRENT_TIMESTAMP WHERE id = :nid AND case_id = :cid;"
            ),
            {"props": json.dumps(props), "nid": node_id, "cid": case_id},
        )

    scalar_props = {
        k: v
        for k, v in updates.items()
        if isinstance(v, (str, int, float, bool)) or v is None
    }
    if scalar_props:
        async with neo4j_driver.session() as session:
            await session.run(
                "MATCH (n:Node {id: $nid, case_id: $cid}) SET n += $props",
                {"nid": str(node_id), "cid": str(case_id), "props": scalar_props},
            )


def _resolve_evidence_kind(filename: str, content_type: str | None) -> str:
    lower_name = (filename or "").lower()
    lower_ct = (content_type or "").lower().split(";")[0].strip()
    if lower_name.endswith(".pdf") or lower_ct == "application/pdf":
        return "pdf"
    if lower_name.endswith((".html", ".htm")) or lower_ct == "text/html":
        return "html"
    raise HTTPException(
        status_code=400,
        detail={
            "code": "UNSUPPORTED_EVIDENCE_FORMAT",
            "message": "Only PDF (.pdf) and static HTML (.html/.htm) files are supported.",
        },
    )


async def upload_evidence_file(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    node_id: uuid.UUID,
    filename: str,
    file_bytes: bytes,
    actor_id: str,
    client_sha256: str | None = None,
    content_type: str | None = None,
) -> EvidenceUploadResponse:
    """Seal an uploaded PDF or static HTML file locally and attach verified metadata."""
    await _ensure_evidence_node(engine, case_id, node_id)

    kind = _resolve_evidence_kind(filename, content_type)

    if not file_bytes or len(file_bytes) > MAX_EVIDENCE_BYTES:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_FILE_SIZE",
                "message": "Evidence file must be non-empty and under 25 MB.",
            },
        )

    if kind == "pdf":
        if not file_bytes.lstrip()[:8].startswith(b"%PDF-"):
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "INVALID_PDF_MAGIC",
                    "message": "Uploaded file does not have a valid %PDF- header.",
                },
            )
        mime_type = "application/pdf"
        ext = "pdf"
        try:
            meta = extract_pdf_metadata(file_bytes).to_dict()
        except Exception as exc:
            raise HTTPException(
                status_code=400,
                detail={"code": "CORRUPT_PDF", "message": f"Unable to parse PDF: {exc}"},
            ) from exc
    else:
        if file_bytes.lstrip()[:8].startswith(b"%PDF-") or b"\x00" in file_bytes[:4096]:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "INVALID_HTML_CONTENT",
                    "message": "Uploaded HTML file appears to contain binary or PDF content.",
                },
            )
        mime_type = "text/html"
        ext = "html"
        try:
            meta = extract_html_metadata(file_bytes).to_dict()
        except Exception as exc:
            raise HTTPException(
                status_code=400,
                detail={"code": "CORRUPT_HTML", "message": f"Unable to parse HTML: {exc}"},
            ) from exc

    server_sha = hashlib.sha256(file_bytes).hexdigest()
    clean_name = _sanitize_filename(filename)

    case_dir = _resolve_upload_root() / str(case_id)
    case_dir.mkdir(parents=True, exist_ok=True)
    storage_path = case_dir / f"{server_sha}.{ext}"
    if not storage_path.exists():
        storage_path.write_bytes(file_bytes)

    evidence_id = uuid.uuid4()
    async with engine.begin() as conn:
        res = await conn.execute(
            text(
                """
                INSERT INTO evidence_files (
                    id, case_id, node_id, original_filename, mime_type, byte_size,
                    sha256, storage_path, metadata_json, blackboard_sync_status
                ) VALUES (
                    :id, :cid, :nid, :fname, :mtype, :bsize,
                    :sha, :spath, CAST(:meta AS JSONB), 'NOT_PUBLISHED'
                )
                ON CONFLICT (case_id, node_id) DO UPDATE SET
                    original_filename = EXCLUDED.original_filename,
                    mime_type = EXCLUDED.mime_type,
                    byte_size = EXCLUDED.byte_size,
                    sha256 = EXCLUDED.sha256,
                    storage_path = EXCLUDED.storage_path,
                    metadata_json = EXCLUDED.metadata_json
                RETURNING id;
                """
            ),
            {
                "id": evidence_id,
                "cid": case_id,
                "nid": node_id,
                "fname": clean_name,
                "mtype": mime_type,
                "bsize": len(file_bytes),
                "sha": server_sha,
                "spath": str(storage_path),
                "meta": json.dumps(meta),
            },
        )
        row = res.fetchone()
        if row:
            evidence_id = row[0]

    sha_matches = bool(client_sha256 and client_sha256.lower() == server_sha.lower())
    meta_prop_key = "pdf_metadata" if kind == "pdf" else "html_metadata"
    await _merge_node_properties(
        engine,
        neo4j_driver,
        case_id,
        node_id,
        {
            "evidence_file_id": str(evidence_id),
            "server_sha256": server_sha,
            "sha256_verified": sha_matches or client_sha256 is None,
            "evidence_metadata": meta,
            meta_prop_key: meta,
            "blackboard_sync_status": "NOT_PUBLISHED",
        },
    )

    await log_audit_event(
        engine=engine,
        case_id=case_id,
        actor_id=actor_id,
        action="INGEST_FILE_SEALED",
        entity_type="node",
        entity_id=node_id,
        after_state={
            "filename": clean_name,
            "mime_type": mime_type,
            "sha256": server_sha,
            "byte_size": len(file_bytes),
        },
        reason=f"Local static {kind.upper()} ingestion and SHA-256 sealing (Phase 2A)",
    )

    return EvidenceUploadResponse(
        evidence_file_id=evidence_id,
        case_id=case_id,
        node_id=node_id,
        original_filename=clean_name,
        mime_type=mime_type,
        byte_size=len(file_bytes),
        sha256=server_sha,
        blackboard_sync_status="NOT_PUBLISHED",
        metadata=meta,
    )


async def upload_evidence_pdf(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    node_id: uuid.UUID,
    filename: str,
    pdf_bytes: bytes,
    actor_id: str,
    client_sha256: str | None = None,
) -> EvidenceUploadResponse:
    """Backward-compatible wrapper for PDF upload."""
    return await upload_evidence_file(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        node_id=node_id,
        filename=filename,
        file_bytes=pdf_bytes,
        actor_id=actor_id,
        client_sha256=client_sha256,
        content_type="application/pdf",
    )


def _normalize_match_token(raw: str) -> str:
    """Compact token for resilient DB duplicate matching (strips spaces and punctuation)."""
    s = raw.strip().lower()
    if s.startswith("rip "):
        s = s[4:].strip()
    return "".join(ch for ch in s if ch.isalnum() or ch in ("+", "@", "."))


async def _find_existing_case_node_matches(
    engine: AsyncEngine, case_id: uuid.UUID
) -> dict[str, uuid.UUID]:
    """Build normalized lookup map of existing active case nodes for deduplication hints."""
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT id, label, properties FROM nodes "
                "WHERE case_id = :cid AND deleted_at IS NULL;"
            ),
            {"cid": case_id},
        )
        rows = res.fetchall()

    lookup: dict[str, uuid.UUID] = {}

    def register(val: object, nid: uuid.UUID) -> None:
        if not isinstance(val, str):
            return
        cleaned = val.strip().lower()
        if not cleaned:
            return
        lookup.setdefault(cleaned, nid)
        compact = _normalize_match_token(cleaned)
        if compact and len(compact) >= 4:
            lookup.setdefault(compact, nid)

    for nid, label, props_raw in rows:
        register(label, nid)
        props = _parse_jsonb(props_raw, {})
        for k in (
            "numero_e164",
            "msisdn",
            "numero",
            "rip",
            "numero_rip_rib",
            "ccp",
            "email",
            "adresse_email",
            "url",
            "url_site",
            "url_profil",
            "nom_domaine",
            "handle",
            "identifiant",
            "identifiant_compte",
            "identifiant_unique",
            "immatriculation",
            "plaque",
            "imei",
            "ip_address",
            "adresse_ip",
            "raison_sociale",
            "nom_fr",
            "code_gab",
        ):
            register(props.get(k), nid)
    return lookup


async def _persist_stage_candidates(
    engine: AsyncEngine,
    case_id: uuid.UUID,
    run_id: uuid.UUID,
    source_node_id: uuid.UUID,
    candidates: list[ExtractedCandidateItem],
) -> int:
    """Insert staged candidates avoiding duplicate (entity_type, normalized_value) for this node."""
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT entity_type, lower(normalized_value) FROM extracted_candidates "
                "WHERE case_id = :cid AND source_node_id = :nid;"
            ),
            {"cid": case_id, "nid": source_node_id},
        )
        existing_keys = {(str(r[0]), str(r[1])) for r in res.fetchall()}

    match_map = await _find_existing_case_node_matches(engine, case_id)
    inserted = 0

    async with engine.begin() as conn:
        for item in candidates:
            dedup_key = (item.entity_type, item.normalized_value.lower())
            if dedup_key in existing_keys:
                continue
            existing_keys.add(dedup_key)
            matched_id = (
                match_map.get(item.normalized_value.lower())
                or match_map.get(_normalize_match_token(item.normalized_value))
                or match_map.get(item.label.lower())
                or match_map.get(_normalize_match_token(item.label))
            )
            if matched_id == source_node_id:
                matched_id = None

            await conn.execute(
                text(
                    """
                    INSERT INTO extracted_candidates (
                        id, case_id, run_id, source_node_id, entity_type,
                        suggested_layer, label, normalized_value, attributes_json,
                        confidence, extractor_tool, stage_number, source_page,
                        source_locator, quote_snippet, matched_existing_node_id,
                        validation_status, blackboard_sync_status
                    ) VALUES (
                        :id, :cid, :rid, :nid, :etype,
                        :slayer, :lbl, :nval, CAST(:attrs AS JSONB),
                        :conf, :tool, :stage, :page,
                        :locator, :quote, :matched,
                        'PENDING', 'NOT_PUBLISHED'
                    );
                    """
                ),
                {
                    "id": uuid.uuid4(),
                    "cid": case_id,
                    "rid": run_id,
                    "nid": source_node_id,
                    "etype": item.entity_type,
                    "slayer": item.suggested_layer,
                    "lbl": item.label,
                    "nval": item.normalized_value,
                    "attrs": json.dumps(item.attributes),
                    "conf": item.confidence,
                    "tool": item.extractor_tool,
                    "stage": item.stage_number,
                    "page": item.source_page,
                    "locator": item.source_locator,
                    "quote": item.quote_snippet,
                    "matched": matched_id,
                },
            )
            inserted += 1
    return inserted


async def _count_pending_candidates(
    engine: AsyncEngine, case_id: uuid.UUID, source_node_id: uuid.UUID
) -> int:
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT count(*) FROM extracted_candidates "
                "WHERE case_id = :cid AND source_node_id = :nid AND validation_status = 'PENDING';"
            ),
            {"cid": case_id, "nid": source_node_id},
        )
        return int(res.scalar() or 0)


async def _count_pending_relations(
    engine: AsyncEngine, case_id: uuid.UUID, source_node_id: uuid.UUID
) -> int:
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT count(*) FROM extracted_relation_candidates "
                "WHERE case_id = :cid AND source_node_id = :nid AND validation_status = 'PENDING';"
            ),
            {"cid": case_id, "nid": source_node_id},
        )
        return int(res.scalar() or 0)


async def _persist_stage_relations(
    engine: AsyncEngine,
    case_id: uuid.UUID,
    run_id: uuid.UUID,
    source_node_id: uuid.UUID,
    relations: list[ExtractedRelationItem],
) -> int:
    """Persist staged semantic relation candidates linking staged entity candidates."""
    if not relations:
        return 0

    async with engine.connect() as conn:
        cand_res = await conn.execute(
            text(
                "SELECT id, entity_type, lower(normalized_value), validation_status "
                "FROM extracted_candidates WHERE case_id = :cid AND source_node_id = :nid;"
            ),
            {"cid": case_id, "nid": source_node_id},
        )
        cand_map: dict[tuple[str, str], uuid.UUID] = {}
        for cid, etype, nval, status in cand_res.fetchall():
            if str(status) == "REJECTED":
                continue
            cand_map[(str(etype), str(nval))] = cid

        rel_res = await conn.execute(
            text(
                "SELECT relation_type, source_candidate_id, target_candidate_id "
                "FROM extracted_relation_candidates "
                "WHERE case_id = :cid AND source_node_id = :nid;"
            ),
            {"cid": case_id, "nid": source_node_id},
        )
        existing_rels = {(str(r[0]), r[1], r[2]) for r in rel_res.fetchall()}

    inserted = 0
    async with engine.begin() as conn:
        for rel in relations:
            src_cid = cand_map.get((rel.source_entity_type, rel.source_normalized_value.lower()))
            tgt_cid = cand_map.get((rel.target_entity_type, rel.target_normalized_value.lower()))
            if src_cid is None or tgt_cid is None or src_cid == tgt_cid:
                continue
            dedup_key = (rel.relation_type, src_cid, tgt_cid)
            if dedup_key in existing_rels:
                continue
            existing_rels.add(dedup_key)

            await conn.execute(
                text(
                    """
                    INSERT INTO extracted_relation_candidates (
                        id, case_id, run_id, source_node_id, relation_type,
                        source_entity_type, source_normalized_value,
                        target_entity_type, target_normalized_value,
                        source_candidate_id, target_candidate_id,
                        suggested_layer, attributes_json, confidence,
                        extractor_tool, stage_number, source_page,
                        source_locator, quote_snippet, validation_status,
                        blackboard_sync_status
                    ) VALUES (
                        :id, :cid, :rid, :nid, :rtype,
                        :stype, :sval,
                        :ttype, :tval,
                        :scid, :tcid,
                        :slayer, CAST(:attrs AS JSONB), :conf,
                        :tool, :stage, :page,
                        :locator, :quote, 'PENDING',
                        'NOT_PUBLISHED'
                    );
                    """
                ),
                {
                    "id": uuid.uuid4(),
                    "cid": case_id,
                    "rid": run_id,
                    "nid": source_node_id,
                    "rtype": rel.relation_type,
                    "stype": rel.source_entity_type,
                    "sval": rel.source_normalized_value,
                    "ttype": rel.target_entity_type,
                    "tval": rel.target_normalized_value,
                    "scid": src_cid,
                    "tcid": tgt_cid,
                    "slayer": rel.suggested_layer,
                    "attrs": json.dumps(rel.attributes),
                    "conf": rel.confidence,
                    "tool": rel.extractor_tool,
                    "stage": rel.stage_number,
                    "page": rel.source_page,
                    "locator": rel.source_locator,
                    "quote": rel.quote_snippet,
                },
            )
            inserted += 1
    return inserted


async def _load_evidence_bytes_for_node(
    engine: AsyncEngine, case_id: uuid.UUID, node_id: uuid.UUID
) -> tuple[bytes, str]:
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT storage_path, mime_type FROM evidence_files "
                "WHERE case_id = :cid AND node_id = :nid;"
            ),
            {"cid": case_id, "nid": node_id},
        )
        row = res.fetchone()
    if not row:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "EVIDENCE_FILE_NOT_UPLOADED",
                "message": "Evidence file must be uploaded before running extraction.",
            },
        )
    path = Path(str(row[0]))
    mime_type = str(row[1] or "application/pdf")
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail={
                "code": "EVIDENCE_FILE_MISSING_ON_DISK",
                "message": "Sealed evidence binary is missing from local upload storage.",
            },
        )
    return path.read_bytes(), mime_type


def _row_to_run(row: Any) -> ExtractionRunResponse:
    return ExtractionRunResponse(
        id=row[0],
        case_id=row[1],
        source_node_id=row[2],
        mode=str(row[3]),
        current_stage=int(row[4]),
        total_stages=int(row[5]),
        status=str(row[6]),
        selected_tools=list(_parse_jsonb(row[7], [])),
        summary=dict(_parse_jsonb(row[8], {})),
        started_at=row[9],
        completed_at=row[10],
    )


def _row_to_candidate(row: Any) -> ExtractedCandidateResponse:
    return ExtractedCandidateResponse(
        id=row[0],
        case_id=row[1],
        run_id=row[2],
        source_node_id=row[3],
        entity_type=str(row[4]),
        suggested_layer=str(row[5]),
        label=str(row[6]),
        normalized_value=str(row[7]),
        attributes=dict(_parse_jsonb(row[8], {})),
        confidence=float(row[9]),
        extractor_tool=str(row[10]),
        stage_number=int(row[11]),
        source_page=int(row[12]),
        source_locator=str(row[13] or ""),
        quote_snippet=str(row[14]),
        matched_existing_node_id=row[15],
        validation_status=str(row[16]),
        promoted_node_id=row[17],
        validated_by=row[18],
        validated_at=row[19],
        blackboard_sync_status=str(row[20]),
    )


def _run_extractor_for_mime(
    file_bytes: bytes, mime_type: str, mode: str, stage: int
) -> tuple[Any, str]:
    is_html = mime_type.lower() == "text/html"
    if is_html:
        html_out = (
            extract_html_mode1_quick(file_bytes)
            if mode == "quick"
            else extract_html_mode2_stage(file_bytes, stage=stage)
        )
        return html_out, "html"
    pdf_out = (
        extract_mode1_quick(file_bytes)
        if mode == "quick"
        else extract_mode2_stage(file_bytes, stage=stage)
    )
    return pdf_out, "pdf"


async def start_evidence_extraction(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    node_id: uuid.UUID,
    mode: str,
    selected_tools: list[str],
    actor_id: str,
) -> NodeCandidatesResponse:
    """Run Mode 1 (quick) or Mode 2 Stage 1 (step_by_step) manually on PDF or HTML."""
    await _ensure_evidence_node(engine, case_id, node_id)
    file_bytes, mime_type = await _load_evidence_bytes_for_node(engine, case_id, node_id)

    run_id = uuid.uuid4()
    output, kind = _run_extractor_for_mime(file_bytes, mime_type, mode, stage=1)
    if mode == "quick":
        total_stages = 1
        status = "COMPLETED"
        progress = 100
        stage_label = f"Extraction rapide terminée ({len(output.candidates)} candidat(s))"
        inv_status = "saturated"
        completed_at: datetime | None = datetime.now(timezone.utc)
    else:
        total_stages = 3
        status = "WAITING_HUMAN"
        progress = 33
        stage_label = (
            "Étape 1/3 terminée (DOM, Traceurs & Images) — en attente"
            if kind == "html"
            else "Étape 1/3 terminée (Métadonnées & Images) — en attente"
        )
        inv_status = "active_investigation"
        completed_at = None

    async with engine.begin() as conn:
        await conn.execute(
            text(
                """
                INSERT INTO extraction_runs (
                    id, case_id, source_node_id, mode, current_stage, total_stages,
                    status, selected_tools, summary_json, completed_at
                ) VALUES (
                    :id, :cid, :nid, :mode, :cstage, :tstage,
                    :status, CAST(:tools AS JSONB), CAST(:summary AS JSONB), :comp
                );
                """
            ),
            {
                "id": run_id,
                "cid": case_id,
                "nid": node_id,
                "mode": mode,
                "cstage": 1,
                "tstage": total_stages,
                "status": status,
                "tools": json.dumps(selected_tools),
                "summary": json.dumps(output.summary),
                "comp": completed_at,
            },
        )

    await _persist_stage_candidates(engine, case_id, run_id, node_id, output.candidates)
    await _persist_stage_relations(engine, case_id, run_id, node_id, output.relations)
    pending_count = await _count_pending_candidates(engine, case_id, node_id)
    pending_rel_count = await _count_pending_relations(engine, case_id, node_id)

    meta_dict = output.metadata.to_dict()
    if output.summary.get("extracted_locations"):
        meta_dict["extracted_locations"] = output.summary["extracted_locations"]
    meta_prop_key = "html_metadata" if kind == "html" else "pdf_metadata"
    await _merge_node_properties(
        engine,
        neo4j_driver,
        case_id,
        node_id,
        {
            "investigation_status": inv_status,
            "analysis_mode": mode,
            "analysis_progress": progress,
            "analysis_stage": stage_label,
            "pending_candidates_count": pending_count,
            "pending_relations_count": pending_rel_count,
            "evidence_metadata": meta_dict,
            meta_prop_key: meta_dict,
        },
    )

    await log_audit_event(
        engine=engine,
        case_id=case_id,
        actor_id=actor_id,
        action="HTML_EXTRACTION_RUN" if kind == "html" else "PDF_EXTRACTION_RUN",
        entity_type="node",
        entity_id=node_id,
        after_state={
            "run_id": str(run_id),
            "mode": mode,
            "stage": 1,
            "kind": kind,
            "staged_candidates": len(output.candidates),
        },
        reason=f"Manual static {kind.upper()} extraction ({mode}, stage 1)",
    )

    return await get_node_candidates(engine, case_id, node_id)


start_pdf_extraction = start_evidence_extraction


async def advance_evidence_stage(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    run_id: uuid.UUID,
    actor_id: str,
) -> NodeCandidatesResponse:
    """Advance a Mode 2 extraction run from Stage 1->2 or 2->3."""
    await get_case(engine, case_id)
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT id, case_id, source_node_id, mode, current_stage, total_stages, "
                "status, selected_tools, summary_json, started_at, completed_at "
                "FROM extraction_runs WHERE id = :rid AND case_id = :cid;"
            ),
            {"rid": run_id, "cid": case_id},
        )
        run_row = res.fetchone()

    if not run_row:
        raise HTTPException(
            status_code=404,
            detail={"code": "EXTRACTION_RUN_NOT_FOUND", "message": "Extraction run not found."},
        )

    source_node_id: uuid.UUID = run_row[2]
    current_stage = int(run_row[4])
    total_stages = int(run_row[5])
    if run_row[3] != "step_by_step" or current_stage >= total_stages:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "NO_NEXT_STAGE",
                "message": "Extraction run is already completed or does not support stages.",
            },
        )

    next_stage = current_stage + 1
    file_bytes, mime_type = await _load_evidence_bytes_for_node(engine, case_id, source_node_id)
    output, kind = _run_extractor_for_mime(file_bytes, mime_type, "step_by_step", stage=next_stage)

    await _persist_stage_candidates(engine, case_id, run_id, source_node_id, output.candidates)
    await _persist_stage_relations(engine, case_id, run_id, source_node_id, output.relations)
    pending_count = await _count_pending_candidates(engine, case_id, source_node_id)
    pending_rel_count = await _count_pending_relations(engine, case_id, source_node_id)

    is_done = next_stage >= total_stages
    new_status = "COMPLETED" if is_done else "WAITING_HUMAN"
    completed_at = datetime.now(timezone.utc) if is_done else None
    progress = 100 if is_done else 66
    stage_label = (
        f"Analyse étape par étape terminée ({pending_count} candidat(s) en attente)"
        if is_done
        else (
            "Étape 2/3 terminée (JSON-LD, Tableaux & Identifiants) — en attente"
            if kind == "html"
            else "Étape 2/3 terminée (Texte, Tableaux & Identifiants) — en attente"
        )
    )
    inv_status = "saturated" if is_done else "active_investigation"

    async with engine.begin() as conn:
        await conn.execute(
            text(
                "UPDATE extraction_runs SET current_stage = :stage, status = :status, "
                "summary_json = CAST(:summary AS JSONB), completed_at = :comp "
                "WHERE id = :rid AND case_id = :cid;"
            ),
            {
                "stage": next_stage,
                "status": new_status,
                "summary": json.dumps(output.summary),
                "comp": completed_at,
                "rid": run_id,
                "cid": case_id,
            },
        )

    await _merge_node_properties(
        engine,
        neo4j_driver,
        case_id,
        source_node_id,
        {
            "investigation_status": inv_status,
            "analysis_progress": progress,
            "analysis_stage": stage_label,
            "pending_candidates_count": pending_count,
            "pending_relations_count": pending_rel_count,
        },
    )

    await log_audit_event(
        engine=engine,
        case_id=case_id,
        actor_id=actor_id,
        action="HTML_EXTRACTION_STAGE" if kind == "html" else "PDF_EXTRACTION_STAGE",
        entity_type="node",
        entity_id=source_node_id,
        after_state={
            "run_id": str(run_id),
            "stage": next_stage,
            "kind": kind,
            "staged_candidates": len(output.candidates),
        },
        reason=f"Manual advance to {kind.upper()} Mode 2 stage {next_stage}",
    )

    return await get_node_candidates(engine, case_id, source_node_id)


advance_pdf_extraction_stage = advance_evidence_stage


def _row_to_relation(row: Any, labels_by_id: dict[uuid.UUID, str]) -> ExtractedRelationResponse:
    src_cid = row[9]
    tgt_cid = row[10]
    return ExtractedRelationResponse(
        id=row[0],
        case_id=row[1],
        run_id=row[2],
        source_node_id=row[3],
        relation_type=str(row[4]),
        source_entity_type=str(row[5]),
        source_normalized_value=str(row[6]),
        target_entity_type=str(row[7]),
        target_normalized_value=str(row[8]),
        source_candidate_id=src_cid,
        target_candidate_id=tgt_cid,
        source_label=labels_by_id.get(src_cid, str(row[6])),
        target_label=labels_by_id.get(tgt_cid, str(row[8])),
        suggested_layer=str(row[11]),
        attributes=dict(_parse_jsonb(row[12], {})),
        confidence=float(row[13]),
        extractor_tool=str(row[14]),
        stage_number=int(row[15]),
        source_page=int(row[16]),
        source_locator=str(row[17] or ""),
        quote_snippet=str(row[18]),
        validation_status=str(row[19]),
        promoted_edge_id=row[20],
        validated_by=row[21],
        validated_at=row[22],
        blackboard_sync_status=str(row[23]),
    )


async def get_node_candidates(
    engine: AsyncEngine, case_id: uuid.UUID, source_node_id: uuid.UUID
) -> NodeCandidatesResponse:
    """Return latest extraction run and all staged entity & relation candidates for a node."""
    await _ensure_evidence_node(engine, case_id, source_node_id)

    async with engine.connect() as conn:
        run_res = await conn.execute(
            text(
                "SELECT id, case_id, source_node_id, mode, current_stage, total_stages, "
                "status, selected_tools, summary_json, started_at, completed_at "
                "FROM extraction_runs WHERE case_id = :cid AND source_node_id = :nid "
                "ORDER BY started_at DESC LIMIT 1;"
            ),
            {"cid": case_id, "nid": source_node_id},
        )
        run_row = run_res.fetchone()

        cand_res = await conn.execute(
            text(
                "SELECT id, case_id, run_id, source_node_id, entity_type, suggested_layer, "
                "label, normalized_value, attributes_json, confidence, extractor_tool, "
                "stage_number, source_page, source_locator, quote_snippet, "
                "matched_existing_node_id, validation_status, promoted_node_id, "
                "validated_by, validated_at, blackboard_sync_status "
                "FROM extracted_candidates WHERE case_id = :cid AND source_node_id = :nid "
                "ORDER BY stage_number ASC, source_page ASC, created_at ASC;"
            ),
            {"cid": case_id, "nid": source_node_id},
        )
        cand_rows = cand_res.fetchall()

        rel_res = await conn.execute(
            text(
                "SELECT id, case_id, run_id, source_node_id, relation_type, "
                "source_entity_type, source_normalized_value, target_entity_type, "
                "target_normalized_value, source_candidate_id, target_candidate_id, "
                "suggested_layer, attributes_json, confidence, extractor_tool, "
                "stage_number, source_page, source_locator, quote_snippet, "
                "validation_status, promoted_edge_id, validated_by, validated_at, "
                "blackboard_sync_status "
                "FROM extracted_relation_candidates "
                "WHERE case_id = :cid AND source_node_id = :nid "
                "ORDER BY stage_number ASC, source_page ASC, created_at ASC;"
            ),
            {"cid": case_id, "nid": source_node_id},
        )
        rel_rows = rel_res.fetchall()

    candidates = [_row_to_candidate(r) for r in cand_rows]
    labels_by_id = {c.id: c.label for c in candidates}
    relations = [_row_to_relation(r, labels_by_id) for r in rel_rows]

    counts = {"pending": 0, "validated": 0, "merged": 0, "rejected": 0, "total": len(candidates)}
    for c in candidates:
        key = c.validation_status.lower()
        if key in counts:
            counts[key] += 1

    rel_counts = {"pending": 0, "validated": 0, "rejected": 0, "total": len(relations)}
    for rel in relations:
        rkey = rel.validation_status.lower()
        if rkey in rel_counts:
            rel_counts[rkey] += 1

    return NodeCandidatesResponse(
        case_id=case_id,
        source_node_id=source_node_id,
        latest_run=_row_to_run(run_row) if run_row else None,
        candidates=candidates,
        counts=counts,
        relations=relations,
        relation_counts=rel_counts,
    )


async def get_case_ingestion_summary(
    engine: AsyncEngine, case_id: uuid.UUID
) -> CaseIngestionSummaryResponse:
    """Return all latest extraction runs and staged candidates/relations across an active case."""
    await get_case(engine, case_id)

    async with engine.connect() as conn:
        run_res = await conn.execute(
            text(
                "SELECT DISTINCT ON (r.source_node_id) "
                "r.id, r.case_id, r.source_node_id, r.mode, r.current_stage, r.total_stages, "
                "r.status, r.selected_tools, r.summary_json, r.started_at, r.completed_at "
                "FROM extraction_runs r "
                "JOIN nodes n ON n.id = r.source_node_id AND n.case_id = r.case_id "
                "WHERE r.case_id = :cid AND n.deleted_at IS NULL "
                "ORDER BY r.source_node_id, r.started_at DESC;"
            ),
            {"cid": case_id},
        )
        run_rows = run_res.fetchall()

        cand_res = await conn.execute(
            text(
                "SELECT c.id, c.case_id, c.run_id, c.source_node_id, c.entity_type, "
                "c.suggested_layer, "
                "c.label, c.normalized_value, c.attributes_json, c.confidence, c.extractor_tool, "
                "c.stage_number, c.source_page, c.source_locator, c.quote_snippet, "
                "c.matched_existing_node_id, c.validation_status, c.promoted_node_id, "
                "c.validated_by, c.validated_at, c.blackboard_sync_status "
                "FROM extracted_candidates c "
                "JOIN nodes n ON n.id = c.source_node_id AND n.case_id = c.case_id "
                "WHERE c.case_id = :cid AND n.deleted_at IS NULL "
                "ORDER BY c.stage_number ASC, c.source_page ASC, c.created_at ASC;"
            ),
            {"cid": case_id},
        )
        cand_rows = cand_res.fetchall()

        rel_res = await conn.execute(
            text(
                "SELECT r.id, r.case_id, r.run_id, r.source_node_id, r.relation_type, "
                "r.source_entity_type, r.source_normalized_value, r.target_entity_type, "
                "r.target_normalized_value, r.source_candidate_id, r.target_candidate_id, "
                "r.suggested_layer, r.attributes_json, r.confidence, r.extractor_tool, "
                "r.stage_number, r.source_page, r.source_locator, r.quote_snippet, "
                "r.validation_status, r.promoted_edge_id, r.validated_by, r.validated_at, "
                "r.blackboard_sync_status "
                "FROM extracted_relation_candidates r "
                "JOIN nodes n ON n.id = r.source_node_id AND n.case_id = r.case_id "
                "WHERE r.case_id = :cid AND n.deleted_at IS NULL "
                "ORDER BY r.stage_number ASC, r.source_page ASC, r.created_at ASC;"
            ),
            {"cid": case_id},
        )
        rel_rows = rel_res.fetchall()

    runs_by_node: dict[str, ExtractionRunResponse] = {}
    for row in run_rows:
        run_obj = _row_to_run(row)
        runs_by_node[str(run_obj.source_node_id)] = run_obj

    candidates_by_node: dict[str, list[ExtractedCandidateResponse]] = {}
    labels_by_id: dict[uuid.UUID, str] = {}
    for row in cand_rows:
        cand_obj = _row_to_candidate(row)
        labels_by_id[cand_obj.id] = cand_obj.label
        candidates_by_node.setdefault(str(cand_obj.source_node_id), []).append(cand_obj)

    relations_by_node: dict[str, list[ExtractedRelationResponse]] = {}
    for row in rel_rows:
        rel_obj = _row_to_relation(row, labels_by_id)
        relations_by_node.setdefault(str(rel_obj.source_node_id), []).append(rel_obj)

    return CaseIngestionSummaryResponse(
        case_id=case_id,
        runs_by_node_id=runs_by_node,
        candidates_by_node_id=candidates_by_node,
        relations_by_node_id=relations_by_node,
    )


async def _create_extrait_de_edge_if_absent(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    extracted_node_id: uuid.UUID,
    extracted_node_type: str,
    source_pdf_id: uuid.UUID,
    source_pdf_type: str,
    actor_id: str,
    edge_layer: str,
    confidence: float,
    props: dict[str, Any],
) -> EdgeResponse | None:
    async with engine.connect() as conn:
        existing = await conn.execute(
            text(
                "SELECT id FROM edges WHERE case_id = :cid AND source_id = :src "
                "AND target_id = :tgt AND type = 'EXTRAIT_DE' AND deleted_at IS NULL;"
            ),
            {"cid": case_id, "src": extracted_node_id, "tgt": source_pdf_id},
        )
        if existing.fetchone():
            return None

    is_canonical_ok, _ = validate_relation(extracted_node_type, "EXTRAIT_DE", source_pdf_type)
    # D20: Provenance edge linking a validated entity back to its dragged source evidence
    # is automatically 100% validated (VERIFIED, confidence=1.0).
    return await create_edge(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        payload=EdgeCreate(
            type="EXTRAIT_DE",
            source_id=extracted_node_id,
            target_id=source_pdf_id,
            layer=LayerId.VERIFIED.value,
            confidence=1.0,
            allow_custom_relation=not is_canonical_ok,
            properties=props,
        ),
        actor_id=actor_id,
    )


async def _promote_relation_to_graph_edge(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    source_evidence_node_id: uuid.UUID,
    rel: ExtractedRelationResponse,
    src_graph_id: uuid.UUID,
    src_graph_type: str,
    tgt_graph_id: uuid.UUID,
    tgt_graph_type: str,
    effective_layer: LayerId,
    actor_id: str,
    now: datetime,
    created_edges: list[EdgeResponse],
) -> None:
    """Create canonical graph edge (if absent) and mark staged relation VALIDATED."""
    async with engine.connect() as conn:
        dup_res = await conn.execute(
            text(
                "SELECT id FROM edges WHERE case_id = :cid AND source_id = :src "
                "AND target_id = :tgt AND type = :rtype AND deleted_at IS NULL;"
            ),
            {
                "cid": case_id,
                "src": src_graph_id,
                "tgt": tgt_graph_id,
                "rtype": rel.relation_type,
            },
        )
        existing_edge = dup_res.fetchone()

    if existing_edge:
        promoted_edge_id: uuid.UUID = existing_edge[0]
    else:
        is_canon_ok, _ = validate_relation(src_graph_type, rel.relation_type, tgt_graph_type)
        edge = await create_edge(
            engine=engine,
            neo4j_driver=neo4j_driver,
            case_id=case_id,
            payload=EdgeCreate(
                type=rel.relation_type,
                source_id=src_graph_id,
                target_id=tgt_graph_id,
                layer=effective_layer.value,
                confidence=rel.confidence,
                allow_custom_relation=not is_canon_ok,
                properties={
                    **rel.attributes,
                    "source_evidence_node_id": str(source_evidence_node_id),
                    "extractor_tool": rel.extractor_tool,
                    "source_page": rel.source_page,
                    "source_locator": rel.source_locator,
                    "quote_snippet": rel.quote_snippet,
                    "blackboard_sync_status": "READY_FOR_BLACKBOARD",
                },
            ),
            actor_id=actor_id,
        )
        created_edges.append(edge)
        promoted_edge_id = edge.id

    async with engine.begin() as conn:
        await conn.execute(
            text(
                "UPDATE extracted_relation_candidates SET validation_status = 'VALIDATED', "
                "promoted_edge_id = :peid, validated_by = :actor, validated_at = :now, "
                "blackboard_sync_status = 'READY_FOR_BLACKBOARD' "
                "WHERE id = :rid AND case_id = :cid;"
            ),
            {
                "peid": promoted_edge_id,
                "actor": actor_id,
                "now": now,
                "rid": rel.id,
                "cid": case_id,
            },
        )


async def validate_candidates(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    source_node_id: uuid.UUID,
    payload: ValidateCandidatesRequest,
    actor_id: str,
) -> ValidateCandidatesResponse:
    """Validate one-by-one, merge, reject, or select-all bulk validate candidates."""
    source_node_type, _ = await _ensure_evidence_node(engine, case_id, source_node_id)

    if not payload.select_all and not payload.candidate_ids:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "NO_CANDIDATES_SELECTED",
                "message": "Provide candidate_ids or set select_all=true.",
            },
        )

    async with engine.connect() as conn:
        mime_res = await conn.execute(
            text("SELECT mime_type FROM evidence_files WHERE case_id = :cid AND node_id = :nid;"),
            {"cid": case_id, "nid": source_node_id},
        )
        mime_row = mime_res.fetchone()
        evidence_mime = str(mime_row[0]) if mime_row else "application/pdf"
        if payload.select_all:
            res = await conn.execute(
                text(
                    "SELECT id, case_id, run_id, source_node_id, entity_type, suggested_layer, "
                    "label, normalized_value, attributes_json, confidence, extractor_tool, "
                    "stage_number, source_page, source_locator, quote_snippet, "
                    "matched_existing_node_id, validation_status, promoted_node_id, "
                    "validated_by, validated_at, blackboard_sync_status "
                    "FROM extracted_candidates WHERE case_id = :cid AND source_node_id = :nid "
                    "AND validation_status = 'PENDING';"
                ),
                {"cid": case_id, "nid": source_node_id},
            )
        else:
            res = await conn.execute(
                text(
                    "SELECT id, case_id, run_id, source_node_id, entity_type, suggested_layer, "
                    "label, normalized_value, attributes_json, confidence, extractor_tool, "
                    "stage_number, source_page, source_locator, quote_snippet, "
                    "matched_existing_node_id, validation_status, promoted_node_id, "
                    "validated_by, validated_at, blackboard_sync_status "
                    "FROM extracted_candidates WHERE case_id = :cid AND source_node_id = :nid "
                    "AND id = ANY(:ids);"
                ),
                {"cid": case_id, "nid": source_node_id, "ids": payload.candidate_ids},
            )
        rows = res.fetchall()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "CANDIDATES_NOT_FOUND",
                "message": "No matching pending candidates found for this node.",
            },
        )

    created_nodes: list[NodeResponse] = []
    created_edges: list[EdgeResponse] = []
    updated_ids: list[uuid.UUID] = []
    now = datetime.now(timezone.utc)

    for row in rows:
        cand = _row_to_candidate(row)
        if cand.validation_status != "PENDING":
            continue

        if payload.action == "reject":
            async with engine.begin() as conn:
                await conn.execute(
                    text(
                        "UPDATE extracted_candidates SET validation_status = 'REJECTED', "
                        "validated_by = :actor, validated_at = :now "
                        "WHERE id = :cid_row AND case_id = :cid;"
                    ),
                    {"actor": actor_id, "now": now, "cid_row": cand.id, "cid": case_id},
                )
                await conn.execute(
                    text(
                        "UPDATE extracted_relation_candidates SET validation_status = 'REJECTED', "
                        "validated_by = :actor, validated_at = :now "
                        "WHERE case_id = :cid AND validation_status = 'PENDING' "
                        "AND (source_candidate_id = :cid_row OR target_candidate_id = :cid_row);"
                    ),
                    {"actor": actor_id, "now": now, "cid_row": cand.id, "cid": case_id},
                )
            updated_ids.append(cand.id)
            continue

        if payload.action == "merge":
            if cand.matched_existing_node_id is None:
                raise HTTPException(
                    status_code=400,
                    detail={
                        "code": "NO_MATCHED_NODE_FOR_MERGE",
                        "message": f"Candidate '{cand.label}' has no matched existing node.",
                    },
                )
            async with engine.connect() as conn:
                m_res = await conn.execute(
                    text(
                        "SELECT type, layer FROM nodes "
                        "WHERE id = :mid AND case_id = :cid AND deleted_at IS NULL;"
                    ),
                    {"mid": cand.matched_existing_node_id, "cid": case_id},
                )
                m_row = m_res.fetchone()
            if not m_row:
                raise HTTPException(
                    status_code=404,
                    detail={"code": "MATCHED_NODE_NOT_FOUND", "message": "Matched node missing."},
                )

            edge = await _create_extrait_de_edge_if_absent(
                engine, neo4j_driver, case_id,
                cand.matched_existing_node_id, str(m_row[0]),
                source_node_id, source_node_type,
                actor_id, LayerId.VERIFIED.value, 1.0,
                {
                    "extractor_tool": cand.extractor_tool,
                    "source_page": cand.source_page,
                    "source_locator": cand.source_locator,
                    "quote_snippet": cand.quote_snippet,
                },
            )
            if edge:
                created_edges.append(edge)

            async with engine.begin() as conn:
                await conn.execute(
                    text(
                        "UPDATE extracted_candidates SET validation_status = 'MERGED', "
                        "promoted_node_id = :pid, validated_by = :actor, validated_at = :now, "
                        "blackboard_sync_status = 'READY_FOR_BLACKBOARD' "
                        "WHERE id = :cid_row AND case_id = :cid;"
                    ),
                    {
                        "pid": cand.matched_existing_node_id,
                        "actor": actor_id,
                        "now": now,
                        "cid_row": cand.id,
                        "cid": case_id,
                    },
                )
            updated_ids.append(cand.id)
            continue

        # Action == "validate"
        if payload.target_layer is not None:
            effective_layer = payload.target_layer
        elif cand.confidence >= 1.0:
            effective_layer = LayerId.VERIFIED
        else:
            effective_layer = LayerId(cand.suggested_layer)

        provenance_prefix = "HTML_STATIC" if evidence_mime == "text/html" else "PDF_STATIC"
        node_props = {
            **cand.attributes,
            "source_evidence_node_id": str(source_node_id),
            "source_pdf_node_id": str(source_node_id),
            "extractor_tool": cand.extractor_tool,
            "source_page": cand.source_page,
            "source_locator": cand.source_locator,
            "quote_snippet": cand.quote_snippet,
            "blackboard_sync_status": "READY_FOR_BLACKBOARD",
        }
        new_node = await create_node(
            engine=engine,
            neo4j_driver=neo4j_driver,
            case_id=case_id,
            payload=NodeCreate(
                type=cand.entity_type,
                label=cand.label,
                confidence=(
                    cand.confidence if cand.attributes.get("confidence_user_modified") else 1.0
                ),
                properties=node_props,
            ),
            actor_id=actor_id,
            layer_override=effective_layer,
            provenance_override=f"{provenance_prefix}:{cand.extractor_tool}",
        )
        created_nodes.append(new_node)

        edge = await _create_extrait_de_edge_if_absent(
            engine, neo4j_driver, case_id,
            new_node.id, new_node.type,
            source_node_id, source_node_type,
            actor_id, LayerId.VERIFIED.value, 1.0,
            {
                "extractor_tool": cand.extractor_tool,
                "source_page": cand.source_page,
                "source_locator": cand.source_locator,
                "quote_snippet": cand.quote_snippet,
            },
        )
        if edge:
            created_edges.append(edge)

        async with engine.begin() as conn:
            await conn.execute(
                text(
                    "UPDATE extracted_candidates SET validation_status = 'VALIDATED', "
                    "promoted_node_id = :pid, validated_by = :actor, validated_at = :now, "
                    "blackboard_sync_status = 'READY_FOR_BLACKBOARD' "
                    "WHERE id = :cid_row AND case_id = :cid;"
                ),
                {
                    "pid": new_node.id,
                    "actor": actor_id,
                    "now": now,
                    "cid_row": cand.id,
                    "cid": case_id,
                },
            )
        updated_ids.append(cand.id)

    pending_remaining = await _count_pending_candidates(engine, case_id, source_node_id)
    pending_rel_remaining = await _count_pending_relations(engine, case_id, source_node_id)
    await _merge_node_properties(
        engine,
        neo4j_driver,
        case_id,
        source_node_id,
        {
            "pending_candidates_count": pending_remaining,
            "pending_relations_count": pending_rel_remaining,
        },
    )

    if updated_ids:
        await log_audit_event(
            engine=engine,
            case_id=case_id,
            actor_id=actor_id,
            action="VALIDATE_EXTRACTED_ENTITY",
            entity_type="node",
            entity_id=source_node_id,
            after_state={
                "action": payload.action,
                "processed_count": len(updated_ids),
                "created_node_ids": [str(n.id) for n in created_nodes],
                "pending_remaining": pending_remaining,
            },
            reason=payload.reason or f"Human {payload.action} of extracted PDF candidates",
        )

    latest = await get_node_candidates(engine, case_id, source_node_id)
    updated_set = set(updated_ids)
    updated_candidates = [c for c in latest.candidates if c.id in updated_set]

    return ValidateCandidatesResponse(
        action=payload.action,
        processed_count=len(updated_ids),
        created_nodes=created_nodes,
        created_edges=created_edges,
        updated_candidates=updated_candidates,
        pending_remaining=pending_remaining,
    )


async def update_extracted_candidate(
    engine: AsyncEngine,
    case_id: uuid.UUID,
    candidate_id: uuid.UUID,
    payload: CandidateUpdateRequest,
    actor_id: str,
) -> NodeCandidatesResponse:
    """Edit staged candidate fields (label, type, layer, confidence, attrs) before validation."""
    await get_case(engine, case_id)

    if payload.entity_type is not None and payload.entity_type not in NODE_TYPES:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_ENTITY_TYPE",
                "message": f"Unknown ontology entity type: {payload.entity_type}",
            },
        )

    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT source_node_id, entity_type, suggested_layer, label, normalized_value, "
                "attributes_json, confidence, validation_status "
                "FROM extracted_candidates WHERE id = :cid AND case_id = :case_id;"
            ),
            {"cid": candidate_id, "case_id": case_id},
        )
        row = res.fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail={"code": "CANDIDATE_NOT_FOUND", "message": "Candidate not found."},
        )
    if str(row[7]) != "PENDING":
        raise HTTPException(
            status_code=400,
            detail={
                "code": "CANDIDATE_NOT_PENDING",
                "message": "Only PENDING candidates can be edited.",
            },
        )

    source_node_id: uuid.UUID = row[0]
    next_type = payload.entity_type if payload.entity_type is not None else str(row[1])
    existing_attrs = dict(row[5] or {}) if isinstance(row[5], dict) else {}
    next_attrs = dict(payload.attributes) if payload.attributes is not None else existing_attrs
    next_conf = float(payload.confidence) if payload.confidence is not None else float(row[6])
    if payload.suggested_layer is not None:
        next_layer = payload.suggested_layer.value
    elif payload.confidence is not None and next_conf >= 1.0:
        next_layer = LayerId.VERIFIED.value
    else:
        next_layer = str(row[2])
    next_label = payload.label.strip() if payload.label is not None else str(row[3])
    if not next_label:
        next_label = str(row[3])
    next_norm = (
        payload.normalized_value.strip()
        if payload.normalized_value is not None
        else (next_label if payload.label is not None else str(row[4]))
    )

    match_lookup = await _find_existing_case_node_matches(engine, case_id)
    matched_id = (
        match_lookup.get(_normalize_match_token(next_norm))
        or match_lookup.get(_normalize_match_token(next_label))
    )
    if matched_id == source_node_id:
        matched_id = None

    async with engine.begin() as conn:
        await conn.execute(
            text(
                "UPDATE extracted_candidates SET entity_type = :etype, suggested_layer = :layer, "
                "label = :label, normalized_value = :norm, "
                "attributes_json = CAST(:attrs AS JSONB), "
                "confidence = :conf, matched_existing_node_id = :matched "
                "WHERE id = :cid AND case_id = :case_id;"
            ),
            {
                "etype": next_type,
                "layer": next_layer,
                "label": next_label,
                "norm": next_norm,
                "attrs": json.dumps(next_attrs),
                "conf": next_conf,
                "matched": matched_id,
                "cid": candidate_id,
                "case_id": case_id,
            },
        )
        # Keep endpoint metadata synchronized in staged PENDING relations
        await conn.execute(
            text(
                "UPDATE extracted_relation_candidates "
                "SET source_entity_type = :etype, source_normalized_value = :norm "
                "WHERE case_id = :case_id AND source_candidate_id = :cid "
                "AND validation_status = 'PENDING';"
            ),
            {"etype": next_type, "norm": next_norm, "case_id": case_id, "cid": candidate_id},
        )
        await conn.execute(
            text(
                "UPDATE extracted_relation_candidates "
                "SET target_entity_type = :etype, target_normalized_value = :norm "
                "WHERE case_id = :case_id AND target_candidate_id = :cid "
                "AND validation_status = 'PENDING';"
            ),
            {"etype": next_type, "norm": next_norm, "case_id": case_id, "cid": candidate_id},
        )

    await log_audit_event(
        engine=engine,
        case_id=case_id,
        actor_id=actor_id,
        action="CANDIDATE_UPDATED",
        entity_type="candidate",
        entity_id=candidate_id,
        after_state={
            "entity_type": next_type,
            "suggested_layer": next_layer,
            "label": next_label,
            "confidence": next_conf,
            "attributes": next_attrs,
        },
        reason="Investigator edited extracted candidate metadata prior to validation",
    )

    return await get_node_candidates(engine, case_id, source_node_id)


async def update_extracted_relation(
    engine: AsyncEngine,
    case_id: uuid.UUID,
    relation_id: uuid.UUID,
    payload: RelationUpdateRequest,
    actor_id: str,
) -> NodeCandidatesResponse:
    """Edit staged PENDING relation candidate (type, direction, layer, confidence, attrs)."""
    await get_case(engine, case_id)

    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT source_node_id, relation_type, source_entity_type, "
                "source_normalized_value, target_entity_type, target_normalized_value, "
                "source_candidate_id, target_candidate_id, suggested_layer, "
                "attributes_json, confidence, validation_status "
                "FROM extracted_relation_candidates WHERE id = :rid AND case_id = :cid;"
            ),
            {"rid": relation_id, "cid": case_id},
        )
        row = res.fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "RELATION_CANDIDATE_NOT_FOUND",
                "message": "Relation candidate not found.",
            },
        )
    if str(row[11]) != "PENDING":
        raise HTTPException(
            status_code=400,
            detail={
                "code": "RELATION_CANDIDATE_NOT_PENDING",
                "message": "Only PENDING relation candidates can be edited.",
            },
        )

    source_node_id: uuid.UUID = row[0]
    src_etype = str(row[2])
    src_val = str(row[3])
    tgt_etype = str(row[4])
    tgt_val = str(row[5])
    src_cid = row[6]
    tgt_cid = row[7]
    if payload.swap_direction:
        src_etype, tgt_etype = tgt_etype, src_etype
        src_val, tgt_val = tgt_val, src_val
        src_cid, tgt_cid = tgt_cid, src_cid

    next_rtype = payload.relation_type.strip() if payload.relation_type else str(row[1])
    if not payload.allow_custom_relation:
        is_ok, reason = validate_relation(src_etype, next_rtype, tgt_etype)
        if not is_ok:
            raise HTTPException(
                status_code=400,
                detail={"code": "INVALID_RELATION_FOR_NODES", "message": reason},
            )

    existing_attrs = _parse_jsonb(row[9], {})
    next_attrs = dict(payload.attributes) if payload.attributes is not None else existing_attrs
    next_conf = float(payload.confidence) if payload.confidence is not None else float(row[10])
    if payload.suggested_layer is not None:
        next_layer = payload.suggested_layer.value
    elif payload.confidence is not None and next_conf >= 1.0:
        next_layer = LayerId.VERIFIED.value
    else:
        next_layer = str(row[8])

    async with engine.begin() as conn:
        await conn.execute(
            text(
                "UPDATE extracted_relation_candidates SET relation_type = :rtype, "
                "source_entity_type = :stype, source_normalized_value = :sval, "
                "target_entity_type = :ttype, target_normalized_value = :tval, "
                "source_candidate_id = :scid, target_candidate_id = :tcid, "
                "suggested_layer = :layer, attributes_json = CAST(:attrs AS JSONB), "
                "confidence = :conf WHERE id = :rid AND case_id = :cid;"
            ),
            {
                "rtype": next_rtype,
                "stype": src_etype,
                "sval": src_val,
                "ttype": tgt_etype,
                "tval": tgt_val,
                "scid": src_cid,
                "tcid": tgt_cid,
                "layer": next_layer,
                "attrs": json.dumps(next_attrs),
                "conf": next_conf,
                "rid": relation_id,
                "cid": case_id,
            },
        )

    await log_audit_event(
        engine=engine,
        case_id=case_id,
        actor_id=actor_id,
        action="RELATION_CANDIDATE_UPDATED",
        entity_type="relation_candidate",
        entity_id=relation_id,
        after_state={
            "relation_type": next_rtype,
            "source_entity_type": src_etype,
            "target_entity_type": tgt_etype,
            "suggested_layer": next_layer,
            "confidence": next_conf,
        },
        reason="Investigator edited staged relation candidate prior to validation",
    )

    return await get_node_candidates(engine, case_id, source_node_id)


async def delete_extracted_relation(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    relation_id: uuid.UUID,
    actor_id: str,
) -> NodeCandidatesResponse:
    """Delete a staged relation candidate before validation."""
    await get_case(engine, case_id)
    async with engine.begin() as conn:
        res = await conn.execute(
            text(
                "DELETE FROM extracted_relation_candidates "
                "WHERE id = :rid AND case_id = :cid RETURNING source_node_id, relation_type;"
            ),
            {"rid": relation_id, "cid": case_id},
        )
        row = res.fetchone()
    if not row:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "RELATION_CANDIDATE_NOT_FOUND",
                "message": "Relation candidate not found.",
            },
        )

    source_node_id: uuid.UUID = row[0]
    pending_rel = await _count_pending_relations(engine, case_id, source_node_id)
    await _merge_node_properties(
        engine,
        neo4j_driver,
        case_id,
        source_node_id,
        {"pending_relations_count": pending_rel},
    )
    await log_audit_event(
        engine=engine,
        case_id=case_id,
        actor_id=actor_id,
        action="RELATION_CANDIDATE_DELETED",
        entity_type="relation_candidate",
        entity_id=relation_id,
        before_state={"relation_type": str(row[1])},
        after_state={"deleted": True},
        reason="Investigator deleted staged relation candidate",
    )
    return await get_node_candidates(engine, case_id, source_node_id)


async def _ensure_candidate_promoted_node(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    source_evidence_node_id: uuid.UUID,
    source_evidence_node_type: str,
    evidence_mime: str,
    candidate_id: uuid.UUID,
    actor_id: str,
    created_nodes: list[NodeResponse],
    created_edges: list[EdgeResponse],
) -> tuple[uuid.UUID, str]:
    """Return promoted graph node (id, type) for a candidate, promoting if still PENDING."""
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT id, case_id, run_id, source_node_id, entity_type, suggested_layer, "
                "label, normalized_value, attributes_json, confidence, extractor_tool, "
                "stage_number, source_page, source_locator, quote_snippet, "
                "matched_existing_node_id, validation_status, promoted_node_id, "
                "validated_by, validated_at, blackboard_sync_status "
                "FROM extracted_candidates WHERE id = :cid_row AND case_id = :cid;"
            ),
            {"cid_row": candidate_id, "cid": case_id},
        )
        row = res.fetchone()
    if not row:
        raise HTTPException(
            status_code=404,
            detail={"code": "CANDIDATE_NOT_FOUND", "message": "Endpoint entity candidate missing."},
        )
    cand = _row_to_candidate(row)
    if cand.promoted_node_id is not None:
        return cand.promoted_node_id, cand.entity_type

    now = datetime.now(timezone.utc)
    if cand.matched_existing_node_id is not None:
        async with engine.connect() as conn:
            m_res = await conn.execute(
                text(
                    "SELECT type, layer FROM nodes "
                    "WHERE id = :mid AND case_id = :cid AND deleted_at IS NULL;"
                ),
                {"mid": cand.matched_existing_node_id, "cid": case_id},
            )
            m_row = m_res.fetchone()
        if m_row:
            edge = await _create_extrait_de_edge_if_absent(
                engine, neo4j_driver, case_id,
                cand.matched_existing_node_id, str(m_row[0]),
                source_evidence_node_id, source_evidence_node_type,
                actor_id, LayerId.VERIFIED.value, 1.0,
                {
                    "extractor_tool": cand.extractor_tool,
                    "source_page": cand.source_page,
                    "source_locator": cand.source_locator,
                    "quote_snippet": cand.quote_snippet,
                },
            )
            if edge:
                created_edges.append(edge)
            async with engine.begin() as conn:
                await conn.execute(
                    text(
                        "UPDATE extracted_candidates SET validation_status = 'MERGED', "
                        "promoted_node_id = :pid, validated_by = :actor, validated_at = :now, "
                        "blackboard_sync_status = 'READY_FOR_BLACKBOARD' "
                        "WHERE id = :cid_row AND case_id = :cid;"
                    ),
                    {
                        "pid": cand.matched_existing_node_id,
                        "actor": actor_id,
                        "now": now,
                        "cid_row": cand.id,
                        "cid": case_id,
                    },
                )
            return cand.matched_existing_node_id, str(m_row[0])

    effective_layer = (
        LayerId.VERIFIED
        if cand.confidence >= 1.0
        else LayerId(cand.suggested_layer)
    )
    provenance_prefix = "HTML_STATIC" if evidence_mime == "text/html" else "PDF_STATIC"
    node_props = {
        **cand.attributes,
        "source_evidence_node_id": str(source_evidence_node_id),
        "source_pdf_node_id": str(source_evidence_node_id),
        "extractor_tool": cand.extractor_tool,
        "source_page": cand.source_page,
        "source_locator": cand.source_locator,
        "quote_snippet": cand.quote_snippet,
        "blackboard_sync_status": "READY_FOR_BLACKBOARD",
    }
    new_node = await create_node(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        payload=NodeCreate(
            type=cand.entity_type,
            label=cand.label,
            confidence=(
                cand.confidence if cand.attributes.get("confidence_user_modified") else 1.0
            ),
            properties=node_props,
        ),
        actor_id=actor_id,
        layer_override=effective_layer,
        provenance_override=f"{provenance_prefix}:{cand.extractor_tool}",
    )
    created_nodes.append(new_node)

    ext_edge = await _create_extrait_de_edge_if_absent(
        engine, neo4j_driver, case_id,
        new_node.id, new_node.type,
        source_evidence_node_id, source_evidence_node_type,
        actor_id, LayerId.VERIFIED.value, 1.0,
        {
            "extractor_tool": cand.extractor_tool,
            "source_page": cand.source_page,
            "source_locator": cand.source_locator,
            "quote_snippet": cand.quote_snippet,
        },
    )
    if ext_edge:
        created_edges.append(ext_edge)

    async with engine.begin() as conn:
        await conn.execute(
            text(
                "UPDATE extracted_candidates SET validation_status = 'VALIDATED', "
                "promoted_node_id = :pid, validated_by = :actor, validated_at = :now, "
                "blackboard_sync_status = 'READY_FOR_BLACKBOARD' "
                "WHERE id = :cid_row AND case_id = :cid;"
            ),
            {
                "pid": new_node.id,
                "actor": actor_id,
                "now": now,
                "cid_row": cand.id,
                "cid": case_id,
            },
        )
    return new_node.id, new_node.type


async def validate_relations(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    source_node_id: uuid.UUID,
    payload: ValidateRelationsRequest,
    actor_id: str,
) -> ValidateRelationsResponse:
    """Validate or reject staged semantic relation candidates (auto-promoting endpoints)."""
    source_node_type, _ = await _ensure_evidence_node(engine, case_id, source_node_id)

    if not payload.select_all and not payload.relation_ids:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "NO_RELATIONS_SELECTED",
                "message": "Provide relation_ids or set select_all=true.",
            },
        )

    async with engine.connect() as conn:
        mime_res = await conn.execute(
            text("SELECT mime_type FROM evidence_files WHERE case_id = :cid AND node_id = :nid;"),
            {"cid": case_id, "nid": source_node_id},
        )
        mime_row = mime_res.fetchone()
        evidence_mime = str(mime_row[0]) if mime_row else "application/pdf"

        if payload.select_all:
            res = await conn.execute(
                text(
                    "SELECT id, case_id, run_id, source_node_id, relation_type, "
                    "source_entity_type, source_normalized_value, target_entity_type, "
                    "target_normalized_value, source_candidate_id, target_candidate_id, "
                    "suggested_layer, attributes_json, confidence, extractor_tool, "
                    "stage_number, source_page, source_locator, quote_snippet, "
                    "validation_status, promoted_edge_id, validated_by, validated_at, "
                    "blackboard_sync_status "
                    "FROM extracted_relation_candidates "
                    "WHERE case_id = :cid AND source_node_id = :nid "
                    "AND validation_status = 'PENDING';"
                ),
                {"cid": case_id, "nid": source_node_id},
            )
        else:
            res = await conn.execute(
                text(
                    "SELECT id, case_id, run_id, source_node_id, relation_type, "
                    "source_entity_type, source_normalized_value, target_entity_type, "
                    "target_normalized_value, source_candidate_id, target_candidate_id, "
                    "suggested_layer, attributes_json, confidence, extractor_tool, "
                    "stage_number, source_page, source_locator, quote_snippet, "
                    "validation_status, promoted_edge_id, validated_by, validated_at, "
                    "blackboard_sync_status "
                    "FROM extracted_relation_candidates "
                    "WHERE case_id = :cid AND source_node_id = :nid AND id = ANY(:ids);"
                ),
                {"cid": case_id, "nid": source_node_id, "ids": payload.relation_ids},
            )
        rows = res.fetchall()

    if not rows:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "RELATIONS_NOT_FOUND",
                "message": "No matching pending relation candidates found.",
            },
        )

    created_nodes: list[NodeResponse] = []
    created_edges: list[EdgeResponse] = []
    updated_ids: list[uuid.UUID] = []
    now = datetime.now(timezone.utc)

    for row in rows:
        rel = _row_to_relation(row, {})
        if rel.validation_status != "PENDING":
            continue

        if payload.action == "reject":
            async with engine.begin() as conn:
                await conn.execute(
                    text(
                        "UPDATE extracted_relation_candidates SET validation_status = 'REJECTED', "
                        "validated_by = :actor, validated_at = :now "
                        "WHERE id = :rid AND case_id = :cid;"
                    ),
                    {"actor": actor_id, "now": now, "rid": rel.id, "cid": case_id},
                )
            updated_ids.append(rel.id)
            continue

        if rel.source_candidate_id is None or rel.target_candidate_id is None:
            continue

        src_graph_id, src_graph_type = await _ensure_candidate_promoted_node(
            engine, neo4j_driver, case_id, source_node_id, source_node_type,
            evidence_mime, rel.source_candidate_id, actor_id, created_nodes, created_edges,
        )
        tgt_graph_id, tgt_graph_type = await _ensure_candidate_promoted_node(
            engine, neo4j_driver, case_id, source_node_id, source_node_type,
            evidence_mime, rel.target_candidate_id, actor_id, created_nodes, created_edges,
        )

        effective_layer = payload.target_layer or (
            LayerId.VERIFIED if rel.confidence >= 1.0 else LayerId(rel.suggested_layer)
        )

        await _promote_relation_to_graph_edge(
            engine=engine,
            neo4j_driver=neo4j_driver,
            case_id=case_id,
            source_evidence_node_id=source_node_id,
            rel=rel,
            src_graph_id=src_graph_id,
            src_graph_type=src_graph_type,
            tgt_graph_id=tgt_graph_id,
            tgt_graph_type=tgt_graph_type,
            effective_layer=effective_layer,
            actor_id=actor_id,
            now=now,
            created_edges=created_edges,
        )
        updated_ids.append(rel.id)

    pending_cand_rem = await _count_pending_candidates(engine, case_id, source_node_id)
    pending_rel_rem = await _count_pending_relations(engine, case_id, source_node_id)
    await _merge_node_properties(
        engine,
        neo4j_driver,
        case_id,
        source_node_id,
        {
            "pending_candidates_count": pending_cand_rem,
            "pending_relations_count": pending_rel_rem,
        },
    )

    if updated_ids:
        await log_audit_event(
            engine=engine,
            case_id=case_id,
            actor_id=actor_id,
            action="VALIDATE_EXTRACTED_RELATION",
            entity_type="node",
            entity_id=source_node_id,
            after_state={
                "action": payload.action,
                "processed_count": len(updated_ids),
                "created_edge_ids": [str(e.id) for e in created_edges],
                "pending_relations_remaining": pending_rel_rem,
            },
            reason=payload.reason or f"Human {payload.action} of extracted relations",
        )

    latest = await get_node_candidates(engine, case_id, source_node_id)
    updated_set = set(updated_ids)
    updated_relations = [r for r in latest.relations if r.id in updated_set]

    return ValidateRelationsResponse(
        action=payload.action,
        processed_count=len(updated_ids),
        created_nodes=created_nodes,
        created_edges=created_edges,
        updated_relations=updated_relations,
        pending_relations_remaining=pending_rel_rem,
    )
