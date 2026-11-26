"""Pydantic schemas for Phase 2A manual static PDF ingestion & candidate validation."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.domain.registry import LayerId
from app.schemas.edge import EdgeResponse
from app.schemas.node import NodeResponse


class EvidenceUploadResponse(BaseModel):
    """Response returned after sealing an uploaded PDF locally."""

    model_config = ConfigDict(extra="forbid")

    evidence_file_id: UUID
    case_id: UUID
    node_id: UUID
    original_filename: str
    mime_type: str
    byte_size: int
    sha256: str
    blackboard_sync_status: str
    metadata: dict[str, Any]


class ExtractPdfRequest(BaseModel):
    """Payload to start manual Mode 1 or Mode 2 static PDF extraction."""

    model_config = ConfigDict(extra="forbid")

    mode: Literal["quick", "step_by_step"]
    selected_tools: list[str] = Field(default_factory=list, max_length=32)


class ExtractionRunResponse(BaseModel):
    """Status of a PDF extraction run."""

    model_config = ConfigDict(extra="forbid")

    id: UUID
    case_id: UUID
    source_node_id: UUID
    mode: str
    current_stage: int
    total_stages: int
    status: str
    selected_tools: list[str]
    summary: dict[str, Any]
    started_at: datetime
    completed_at: datetime | None = None


class ExtractedCandidateResponse(BaseModel):
    """A staged extracted entity awaiting isolated human review."""

    model_config = ConfigDict(extra="forbid")

    id: UUID
    case_id: UUID
    run_id: UUID
    source_node_id: UUID
    entity_type: str
    suggested_layer: str
    label: str
    normalized_value: str
    attributes: dict[str, Any]
    confidence: float
    extractor_tool: str
    stage_number: int
    source_page: int
    source_locator: str = ""
    quote_snippet: str
    matched_existing_node_id: UUID | None = None
    validation_status: str
    promoted_node_id: UUID | None = None
    validated_by: str | None = None
    validated_at: datetime | None = None
    blackboard_sync_status: str


class ExtractedRelationResponse(BaseModel):
    """A staged semantic relation candidate between extracted entities."""

    model_config = ConfigDict(extra="forbid")

    id: UUID
    case_id: UUID
    run_id: UUID
    source_node_id: UUID
    relation_type: str
    source_entity_type: str
    source_normalized_value: str
    target_entity_type: str
    target_normalized_value: str
    source_candidate_id: UUID | None = None
    target_candidate_id: UUID | None = None
    source_label: str = ""
    target_label: str = ""
    suggested_layer: str
    attributes: dict[str, Any]
    confidence: float
    extractor_tool: str
    stage_number: int
    source_page: int
    source_locator: str = ""
    quote_snippet: str
    validation_status: str
    promoted_edge_id: UUID | None = None
    validated_by: str | None = None
    validated_at: datetime | None = None
    blackboard_sync_status: str


class NodeCandidatesResponse(BaseModel):
    """Combined latest run + staged entity & relation candidates for an evidence node."""

    model_config = ConfigDict(extra="forbid")

    case_id: UUID
    source_node_id: UUID
    latest_run: ExtractionRunResponse | None = None
    candidates: list[ExtractedCandidateResponse]
    counts: dict[str, int]
    relations: list[ExtractedRelationResponse] = Field(default_factory=list)
    relation_counts: dict[str, int] = Field(default_factory=dict)


class RelationUpdateRequest(BaseModel):
    """Update a staged PENDING relation candidate before validation (type, direction, layer)."""

    model_config = ConfigDict(extra="forbid")

    relation_type: str | None = Field(default=None, min_length=1, max_length=64)
    suggested_layer: LayerId | None = None
    confidence: float | None = Field(default=None, ge=0.0, le=1.0)
    swap_direction: bool = False
    allow_custom_relation: bool = False
    attributes: dict[str, Any] | None = None


class ValidateRelationsRequest(BaseModel):
    """Validate or reject one, a subset, or all staged semantic relation candidates."""

    model_config = ConfigDict(extra="forbid")

    action: Literal["validate", "reject"]
    relation_ids: list[UUID] = Field(default_factory=list, max_length=500)
    select_all: bool = False
    target_layer: LayerId | None = None
    reason: str = Field(default="", max_length=1000)


class ValidateRelationsResponse(BaseModel):
    """Outcome of validating or rejecting staged semantic relation candidates."""

    model_config = ConfigDict(extra="forbid")

    action: str
    processed_count: int
    created_nodes: list[NodeResponse]
    created_edges: list[EdgeResponse]
    updated_relations: list[ExtractedRelationResponse]
    pending_relations_remaining: int


class ValidateCandidatesRequest(BaseModel):
    """Validate one-by-one, merge, reject, or bulk select-all candidates."""

    model_config = ConfigDict(extra="forbid")

    action: Literal["validate", "merge", "reject"]
    candidate_ids: list[UUID] = Field(default_factory=list, max_length=500)
    select_all: bool = False
    target_layer: LayerId | None = None
    reason: str = Field(default="", max_length=1000)


class CandidateUpdateRequest(BaseModel):
    """Update editable fields of a staged PENDING candidate before validation."""

    model_config = ConfigDict(extra="forbid")

    label: str | None = Field(default=None, min_length=1, max_length=300)
    entity_type: str | None = Field(default=None, min_length=1, max_length=64)
    suggested_layer: LayerId | None = None
    confidence: float | None = Field(default=None, ge=0.0, le=1.0)
    normalized_value: str | None = Field(default=None, max_length=300)
    attributes: dict[str, Any] | None = None


class ValidateCandidatesResponse(BaseModel):
    """Outcome of validating/merging/rejecting staged candidates."""

    model_config = ConfigDict(extra="forbid")

    action: str
    processed_count: int
    created_nodes: list[NodeResponse]
    created_edges: list[EdgeResponse]
    updated_candidates: list[ExtractedCandidateResponse]
    pending_remaining: int


class CaseIngestionSummaryResponse(BaseModel):
    """Case-wide extraction runs, entity candidates, and semantic relation candidates by node."""

    model_config = ConfigDict(extra="forbid")

    case_id: UUID
    runs_by_node_id: dict[str, ExtractionRunResponse] = Field(default_factory=dict)
    candidates_by_node_id: dict[str, list[ExtractedCandidateResponse]] = Field(default_factory=dict)
    relations_by_node_id: dict[str, list[ExtractedRelationResponse]] = Field(default_factory=dict)
