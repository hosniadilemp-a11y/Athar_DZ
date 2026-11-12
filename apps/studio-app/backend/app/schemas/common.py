"""Standard error and pagination envelopes."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    """Detailed error object."""

    code: str = Field(..., description="Error code identifier")
    message: str = Field(..., description="Human-readable error description")
    details: dict[str, Any] | list[Any] | None = Field(
        default=None, description="Optional diagnostic details"
    )


class ErrorResponse(BaseModel):
    """Canonical error response envelope."""

    error: ErrorDetail
