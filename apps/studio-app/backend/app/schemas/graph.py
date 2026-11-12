"""Pydantic schemas for full graph views and expansion."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.edge import EdgeResponse
from app.schemas.node import NodeResponse


class GraphResponse(BaseModel):
    """Subgraph response for case board rendering."""

    case_id: UUID
    nodes: list[NodeResponse]
    edges: list[EdgeResponse]
    is_impact_view: bool
    total_case_nodes: int
    total_case_edges: int


class ExpandRequest(BaseModel):
    """Request payload to expand neighbors from selected nodes."""

    node_ids: list[UUID] = Field(..., min_length=1, max_length=50)
    hops: int = Field(default=1, ge=1, le=2, description="Neighborhood depth (1 or 2)")


class AuditLogResponse(BaseModel):
    """Cryptographic audit ledger item."""

    id: UUID
    case_id: UUID
    actor_id: str
    action: str
    entity_type: str
    entity_id: UUID
    before_state: dict[str, Any] | None = None
    after_state: dict[str, Any] | None = None
    reason: str
    timestamp: str
    prev_hash: str
    hash: str


class AuditVerificationResult(BaseModel):
    """Integrity verification report across the audit log hash chain."""

    is_valid: bool
    total_entries: int
    first_tampered_index: int | None = None
    message: str
