"""Pydantic schemas for Social Network Analysis (SNA)."""

from __future__ import annotations

import uuid
from typing import Any

from pydantic import BaseModel, Field


class SnaRunRequest(BaseModel):
    params: dict[str, Any] = Field(default_factory=dict)


class SnaNodeMetric(BaseModel):
    node_id: uuid.UUID
    node_label: str
    node_type: str
    layer: str
    value: float | int | str | dict[str, Any] | list[Any]


class SuggestedEdge(BaseModel):
    source_id: uuid.UUID
    target_id: uuid.UUID
    source_label: str
    target_label: str
    type: str = "LIKELY_COLLABORATOR"
    layer: str = "HYPOTHESIS"
    score: float
    confidence: float


class SnaResultResponse(BaseModel):
    algorithm_key: str
    algorithm_name: str
    category: str
    execution_time_ms: float
    parameters_used: dict[str, Any]
    method_disclaimer: str = (
        "Résultat analytique exploratoire (hypothèse d'enquête). "
        "Ne constitue pas une preuve légale sans corroboration humaine."
    )
    summary: dict[str, Any] = Field(default_factory=dict)
    node_metrics: list[SnaNodeMetric] = Field(default_factory=list)
    suggested_edges: list[SuggestedEdge] = Field(default_factory=list)
    subgraph_nodes: list[uuid.UUID] = Field(default_factory=list)
    subgraph_edges: list[uuid.UUID] = Field(default_factory=list)
    skipped_nodes_count: int = 0
