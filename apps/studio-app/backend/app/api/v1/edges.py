"""Edge creation endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from neo4j import AsyncDriver
from sqlalchemy.ext.asyncio import AsyncEngine

from app.api.v1.cases import get_actor_id
from app.db.session import get_neo4j_driver, get_pg_engine
from app.schemas.edge import EdgeCreate, EdgeResponse
from app.services.graph_service import create_edge

router = APIRouter(prefix="/cases/{case_id}/edges", tags=["edges"])


@router.post("", response_model=EdgeResponse, status_code=201)
async def create_edge_endpoint(
    case_id: uuid.UUID,
    payload: EdgeCreate,
    engine: AsyncEngine = Depends(get_pg_engine),
    neo4j_driver: AsyncDriver = Depends(get_neo4j_driver),
    actor_id: str = Depends(get_actor_id),
) -> EdgeResponse:
    """Create a validated directed edge between two existing nodes."""
    return await create_edge(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        payload=payload,
        actor_id=actor_id,
    )
