"""Node CRUD and tool proposals endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from neo4j import AsyncDriver
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

from app.api.v1.cases import get_actor_id
from app.db.session import get_neo4j_driver, get_pg_engine
from app.schemas.node import NodeCreate, NodeLayerChange, NodeResponse, ToolProposal
from app.services.graph_service import (
    change_node_layer,
    create_node,
    get_tool_proposals,
)

router = APIRouter(prefix="/cases/{case_id}/nodes", tags=["nodes"])


@router.post("", response_model=NodeResponse, status_code=201)
async def create_node_endpoint(
    case_id: uuid.UUID,
    payload: NodeCreate,
    engine: AsyncEngine = Depends(get_pg_engine),
    neo4j_driver: AsyncDriver = Depends(get_neo4j_driver),
    actor_id: str = Depends(get_actor_id),
) -> NodeResponse:
    """Create a new manual entity node."""
    return await create_node(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        payload=payload,
        actor_id=actor_id,
    )


@router.put("/{node_id}/layer", response_model=NodeResponse)
async def change_node_layer_endpoint(
    case_id: uuid.UUID,
    node_id: uuid.UUID,
    payload: NodeLayerChange,
    engine: AsyncEngine = Depends(get_pg_engine),
    neo4j_driver: AsyncDriver = Depends(get_neo4j_driver),
    actor_id: str = Depends(get_actor_id),
) -> NodeResponse:
    """Migrate node layer with required judicial justification."""
    return await change_node_layer(
        engine=engine,
        neo4j_driver=neo4j_driver,
        case_id=case_id,
        node_id=node_id,
        new_layer=payload.new_layer,
        reason=payload.reason,
        actor_id=actor_id,
    )


@router.get("/{node_id}/tools", response_model=list[ToolProposal])
async def get_node_tools_endpoint(
    case_id: uuid.UUID,
    node_id: uuid.UUID,
    engine: AsyncEngine = Depends(get_pg_engine),
) -> list[ToolProposal]:
    """Retrieve specialized investigative tools suggested for this node type."""
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT type FROM nodes WHERE id = :id AND case_id = :cid AND deleted_at IS NULL;"
            ),
            {"id": node_id, "cid": case_id},
        )
        row = res.fetchone()

    node_type = row[0] if row else "unknown"
    return get_tool_proposals(node_type)
