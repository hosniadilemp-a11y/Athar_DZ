"""Social Network Analysis (SNA) REST API endpoints."""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncEngine

from app.core.config import get_settings
from app.db.session import get_pg_engine
from app.domain.sna_registry import SNA_REGISTRY, SnaAlgorithmMetadata
from app.schemas.sna import SnaResultResponse, SnaRunRequest
from app.services.sna.service import execute_sna_algorithm

router = APIRouter(prefix="/cases/{case_id}/sna", tags=["sna"])


def get_actor_id(x_actor_id: Annotated[str | None, Header()] = None) -> str:
    """Return authenticated actor or configured development default."""
    return x_actor_id or get_settings().actor_id


@router.get("", response_model=list[SnaAlgorithmMetadata])
async def list_sna_algorithms() -> list[SnaAlgorithmMetadata]:
    """List the 16 registered SNA graph algorithms with parameter schemas and metadata."""
    return list(SNA_REGISTRY.values())


@router.post("/{algo}", response_model=SnaResultResponse)
async def run_sna_algorithm_endpoint(
    case_id: uuid.UUID,
    algo: str,
    payload: SnaRunRequest = SnaRunRequest(),
    engine: AsyncEngine = Depends(get_pg_engine),
    actor_id: str = Depends(get_actor_id),
) -> SnaResultResponse:
    """Execute a registered SNA algorithm on the case graph snapshot."""
    return await execute_sna_algorithm(
        engine=engine,
        case_id=case_id,
        algorithm_key=algo,
        params=payload.params,
        actor_id=actor_id,
    )
