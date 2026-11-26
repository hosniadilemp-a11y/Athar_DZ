"""Phase 2A manual static PDF & HTML upload, extraction, and isolated candidate validation API."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, File, Form, UploadFile
from neo4j import AsyncDriver
from sqlalchemy.ext.asyncio import AsyncEngine

from app.api.v1.cases import get_actor_id
from app.db.session import get_neo4j_driver, get_pg_engine
from app.schemas.ingestion import (
    EvidenceUploadResponse,
    ExtractPdfRequest,
    NodeCandidatesResponse,
    ValidateCandidatesRequest,
    ValidateCandidatesResponse,
)
from app.services.ingestion_service import (
    advance_evidence_stage,
    get_node_candidates,
    start_evidence_extraction,
    upload_evidence_file,
    validate_candidates,
)

router = APIRouter(prefix="/cases/{case_id}/ingestion", tags=["ingestion"])


@router.post("/nodes/{node_id}/upload", response_model=EvidenceUploadResponse, status_code=201)
async def upload_evidence_endpoint(
    case_id: uuid.UUID,
    node_id: uuid.UUID,
    file: UploadFile = File(...),
    client_sha256: str | None = Form(default=None),
    engine: AsyncEngine = Depends(get_pg_engine),
    neo4j_driver: AsyncDriver = Depends(get_neo4j_driver),
    actor_id: str = Depends(get_actor_id),
) -> EvidenceUploadResponse:
    """Seal an uploaded raw PDF or static HTML file locally and attach metadata to the node."""
    raw_bytes = await file.read()
    return await upload_evidence_file(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        node_id=node_id,
        filename=file.filename or "evidence.bin",
        file_bytes=raw_bytes,
        actor_id=actor_id,
        client_sha256=client_sha256,
        content_type=file.content_type,
    )


@router.post("/nodes/{node_id}/extract", response_model=NodeCandidatesResponse)
async def extract_evidence_endpoint(
    case_id: uuid.UUID,
    node_id: uuid.UUID,
    payload: ExtractPdfRequest,
    engine: AsyncEngine = Depends(get_pg_engine),
    neo4j_driver: AsyncDriver = Depends(get_neo4j_driver),
    actor_id: str = Depends(get_actor_id),
) -> NodeCandidatesResponse:
    """Manually run Mode 1 (quick) or Mode 2 Stage 1 (step_by_step) on an uploaded PDF or HTML."""
    return await start_evidence_extraction(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        node_id=node_id,
        mode=payload.mode,
        selected_tools=payload.selected_tools,
        actor_id=actor_id,
    )


@router.post("/runs/{run_id}/next-stage", response_model=NodeCandidatesResponse)
async def next_stage_endpoint(
    case_id: uuid.UUID,
    run_id: uuid.UUID,
    engine: AsyncEngine = Depends(get_pg_engine),
    neo4j_driver: AsyncDriver = Depends(get_neo4j_driver),
    actor_id: str = Depends(get_actor_id),
) -> NodeCandidatesResponse:
    """Manually advance a Mode 2 extraction run to the next human-gated stage."""
    return await advance_evidence_stage(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        run_id=run_id,
        actor_id=actor_id,
    )


@router.get("/nodes/{node_id}/candidates", response_model=NodeCandidatesResponse)
async def get_candidates_endpoint(
    case_id: uuid.UUID,
    node_id: uuid.UUID,
    engine: AsyncEngine = Depends(get_pg_engine),
) -> NodeCandidatesResponse:
    """Fetch the latest extraction run and all staged candidates for an evidence node."""
    return await get_node_candidates(
        engine=engine,
        case_id=case_id,
        source_node_id=node_id,
    )


@router.post("/nodes/{node_id}/candidates/validate", response_model=ValidateCandidatesResponse)
async def validate_candidates_endpoint(
    case_id: uuid.UUID,
    node_id: uuid.UUID,
    payload: ValidateCandidatesRequest,
    engine: AsyncEngine = Depends(get_pg_engine),
    neo4j_driver: AsyncDriver = Depends(get_neo4j_driver),
    actor_id: str = Depends(get_actor_id),
) -> ValidateCandidatesResponse:
    """Validate one-by-one, merge, reject, or select-all bulk validate staged candidates."""
    return await validate_candidates(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        source_node_id=node_id,
        payload=payload,
        actor_id=actor_id,
    )
