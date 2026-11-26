"""Pydantic schemas for graph edges."""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EdgeCreate(BaseModel):
    """Payload to create a new directed edge."""

    type: str = Field(..., description="Canonical or investigator-defined relation type")
    source_id: UUID = Field(..., description="Source node UUID")
    target_id: UUID = Field(..., description="Target node UUID")
    layer: str = Field(
        default="VERIFIED",
        description="Target evidence layer (defaults to VERIFIED / 100%)",
    )
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    allow_custom_relation: bool = Field(
        default=False,
        description="Allow investigator-defined transverse relation outside strict ontology pairs",
    )
    properties: dict[str, Any] = Field(default_factory=dict)


class EdgeUpdate(BaseModel):
    """Payload to update an existing graph edge (type, layer, confidence, properties)."""

    type: str | None = Field(default=None, description="Updated relation type")
    layer: str | None = Field(default=None, description="Updated evidence layer")
    confidence: float | None = Field(default=None, ge=0.0, le=1.0)
    properties: dict[str, Any] | None = Field(default=None)
    allow_custom_relation: bool = Field(
        default=False,
        description="Allow investigator-defined transverse relation outside strict ontology pairs",
    )
    reason: str = Field(default="", max_length=1000)


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
