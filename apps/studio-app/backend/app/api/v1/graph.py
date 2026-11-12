"""Graph retrieval and neighborhood expansion endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query
from neo4j import AsyncDriver
from sqlalchemy.ext.asyncio import AsyncEngine

from app.db.session import get_neo4j_driver, get_pg_engine
from app.schemas.graph import ExpandRequest, GraphResponse
from app.services.graph_service import expand_graph, get_case_graph

router = APIRouter(prefix="/cases/{case_id}/graph", tags=["graph"])


@router.get("", response_model=GraphResponse)
async def get_graph_endpoint(
    case_id: uuid.UUID,
    impact_only: bool = Query(default=False, description="Filter to critical impact entities"),
    engine: AsyncEngine = Depends(get_pg_engine),
) -> GraphResponse:
    """Retrieve full case graph or impact-filtered subgraph."""
    return await get_case_graph(engine, case_id, impact_only=impact_only)


@router.post("/expand", response_model=GraphResponse)
async def expand_graph_endpoint(
    case_id: uuid.UUID,
    payload: ExpandRequest,
    engine: AsyncEngine = Depends(get_pg_engine),
    neo4j_driver: AsyncDriver = Depends(get_neo4j_driver),
) -> GraphResponse:
    """Expand graph from selected nodes by 1 or 2 hops."""
    return await expand_graph(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        node_ids=payload.node_ids,
        hops=payload.hops,
    )
