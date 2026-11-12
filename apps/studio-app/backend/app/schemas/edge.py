"""Pydantic schemas for graph edges."""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EdgeCreate(BaseModel):
    """Payload to create a new directed edge."""

    type: str = Field(..., description="Canonical relation type from registry")
    source_id: UUID = Field(..., description="Source node UUID")
    target_id: UUID = Field(..., description="Target node UUID")
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    properties: dict[str, Any] = Field(default_factory=dict)


class EdgeResponse(BaseModel):
    """Full edge representation."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    case_id: UUID
    type: str
    source_id: UUID
    target_id: UUID
    layer: str
    confidence: float
    provenance: str
    properties: dict[str, Any]
    created_at: datetime
    updated_at: datetime
