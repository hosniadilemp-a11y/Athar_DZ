"""Edge creation, update, and deletion endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query
from neo4j import AsyncDriver
from sqlalchemy.ext.asyncio import AsyncEngine

from app.api.v1.cases import get_actor_id
from app.db.session import get_neo4j_driver, get_pg_engine
from app.schemas.edge import EdgeCreate, EdgeResponse, EdgeUpdate
from app.services.graph_service import create_edge, delete_edge, update_edge

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


@router.patch("/{edge_id}", response_model=EdgeResponse)
async def update_edge_endpoint(
    case_id: uuid.UUID,
    edge_id: uuid.UUID,
    payload: EdgeUpdate,
    engine: AsyncEngine = Depends(get_pg_engine),
    neo4j_driver: AsyncDriver = Depends(get_neo4j_driver),
    actor_id: str = Depends(get_actor_id),
) -> EdgeResponse:
    """Update an existing edge's type, confidence, layer, or properties."""
    return await update_edge(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        edge_id=edge_id,
        payload=payload,
        actor_id=actor_id,
    )


@router.delete("/{edge_id}")
async def delete_edge_endpoint(
    case_id: uuid.UUID,
    edge_id: uuid.UUID,
    reason: str = Query(default="", max_length=1000),
    engine: AsyncEngine = Depends(get_pg_engine),
    neo4j_driver: AsyncDriver = Depends(get_neo4j_driver),
    actor_id: str = Depends(get_actor_id),
) -> dict[str, str]:
    """Soft-delete an edge in PostgreSQL, remove it from Neo4j, and log ISO 27037 audit."""
    return await delete_edge(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        edge_id=edge_id,
        actor_id=actor_id,
        reason=reason,
    )
