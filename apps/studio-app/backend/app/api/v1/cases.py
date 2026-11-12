"""Cases REST endpoints."""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Header
from neo4j import AsyncDriver
from sqlalchemy.ext.asyncio import AsyncEngine

from app.core.config import get_settings
from app.db.session import get_neo4j_driver, get_pg_engine
from app.schemas.case import CaseCreate, CaseResponse
from app.services.graph_service import create_case, get_case, list_cases

router = APIRouter(prefix="/cases", tags=["cases"])


def get_actor_id(x_actor_id: Annotated[str | None, Header()] = None) -> str:
    """Return authenticated actor or configured development default."""
    return x_actor_id or get_settings().actor_id


@router.get("", response_model=list[CaseResponse])
async def list_cases_endpoint(
    engine: AsyncEngine = Depends(get_pg_engine),
) -> list[CaseResponse]:
    """List all investigation cases."""
    return await list_cases(engine)


@router.post("", response_model=CaseResponse, status_code=201)
async def create_case_endpoint(
    payload: CaseCreate,
    engine: AsyncEngine = Depends(get_pg_engine),
    neo4j_driver: AsyncDriver = Depends(get_neo4j_driver),
    actor_id: str = Depends(get_actor_id),
) -> CaseResponse:
    """Create a new judicial case."""
    return await create_case(engine, neo4j_driver, payload, actor_id)


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case_endpoint(
    case_id: uuid.UUID,
    engine: AsyncEngine = Depends(get_pg_engine),
) -> CaseResponse:
    """Retrieve case by UUID."""
    return await get_case(engine, case_id)
