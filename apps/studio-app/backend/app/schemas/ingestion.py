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


class NodeCandidatesResponse(BaseModel):
    """Combined latest run + staged candidates + counts for an isolated PDF node."""

    model_config = ConfigDict(extra="forbid")

    case_id: UUID
    source_node_id: UUID
    latest_run: ExtractionRunResponse | None = None
    candidates: list[ExtractedCandidateResponse]
    counts: dict[str, int]


class ValidateCandidatesRequest(BaseModel):
    """Validate one-by-one, merge, reject, or bulk select-all candidates."""

    model_config = ConfigDict(extra="forbid")

    action: Literal["validate", "merge", "reject"]
    candidate_ids: list[UUID] = Field(default_factory=list, max_length=500)
    select_all: bool = False
    target_layer: LayerId | None = None
    reason: str = Field(default="", max_length=1000)


class ValidateCandidatesResponse(BaseModel):
    """Outcome of validating/merging/rejecting staged candidates."""

    model_config = ConfigDict(extra="forbid")

    action: str
    processed_count: int
    created_nodes: list[NodeResponse]
    created_edges: list[EdgeResponse]
    updated_candidates: list[ExtractedCandidateResponse]
    pending_remaining: int
