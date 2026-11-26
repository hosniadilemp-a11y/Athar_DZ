"""Pydantic schemas for case management."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CaseCreate(BaseModel):
    """Payload to create a new case."""

    code: str = Field(..., min_length=3, max_length=64, description="Unique case code identifier")
    title: str = Field(..., min_length=3, max_length=255, description="Case title")
    description: str = Field(default="", max_length=2000, description="Brief narrative summary")
    unit_name: str = Field(default="", max_length=255, description="Investigating unit / brigade")
    magistrate_name: str = Field(default="", max_length=255, description="Instructing magistrate")
    jurisdiction: str = Field(default="", max_length=255, description="Competent court / parquet")
    wilaya: str = Field(default="", max_length=128, description="Primary territorial wilaya")


class CaseUpdate(BaseModel):
    """Payload to update an existing case."""

    title: str | None = Field(default=None, min_length=3, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    status: str | None = Field(default=None, max_length=32)
    unit_name: str | None = Field(default=None, max_length=255)
    magistrate_name: str | None = Field(default=None, max_length=255)
    jurisdiction: str | None = Field(default=None, max_length=255)
    wilaya: str | None = Field(default=None, max_length=128)


class CaseResponse(BaseModel):
    """Case representation returned by API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    code: str
    title: str
    description: str
    status: str
    unit_name: str = ""
    magistrate_name: str = ""
    jurisdiction: str = ""
    wilaya: str = ""
    created_at: datetime
    updated_at: datetime
    nodes_count: int = 0
    edges_count: int = 0


class CaseListResponse(BaseModel):
    """List of cases with pagination total."""

    cases: list[CaseResponse]
    total: int
