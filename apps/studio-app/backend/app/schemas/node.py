"""Pydantic schemas for graph nodes."""

from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.domain.registry import LayerId


class NodeCreate(BaseModel):
    """Payload to create a new node."""

    type: str = Field(..., description="Ontology node type key from registry")
    label: str = Field(..., min_length=1, max_length=255, description="Node display label")
    confidence: float = Field(default=1.0, ge=0.0, le=1.0, description="Confidence score")
    properties: dict[str, Any] = Field(default_factory=dict, description="Metadata attributes")
    latitude: float | None = Field(default=None, ge=-90.0, le=90.0)
    longitude: float | None = Field(default=None, ge=-180.0, le=180.0)


class NodeUpdate(BaseModel):
    """Payload to update an existing node."""

    label: str | None = Field(default=None, min_length=1, max_length=255)
    confidence: float | None = Field(default=None, ge=0.0, le=1.0)
    properties: dict[str, Any] | None = None
    latitude: float | None = Field(default=None, ge=-90.0, le=90.0)
    longitude: float | None = Field(default=None, ge=-180.0, le=180.0)
    reason: str = Field(default="", description="Reason for update (required if node is VERIFIED)")


class NodeLayerChange(BaseModel):
    """Payload to change the operational layer of a node."""

    new_layer: LayerId = Field(..., description="Target layer")
    reason: str = Field(
        ...,
        min_length=5,
        max_length=1000,
        description="Mandatory judicial justification for layer migration",
    )


class NodeResponse(BaseModel):
    """Full node representation."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    case_id: UUID
    type: str
    layer: str
    label: str
    confidence: float
    provenance: str
    properties: dict[str, Any]
    latitude: float | None = None
    longitude: float | None = None
    icon: str
    created_at: datetime
    updated_at: datetime


class ToolProposal(BaseModel):
    """Specialized investigative tool proposal suggested for this node type."""

    id: str
    name_fr: str
    name_ar: str
    name_en: str
    category: str
    description_fr: str
    phase: int
    is_active: bool
