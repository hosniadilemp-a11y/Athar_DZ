"""Ontological Registry API router (Milestone 1B/1C)."""

from typing import Any

from fastapi import APIRouter

from app.domain.registry import export_registry_dict

router = APIRouter(prefix="/registry", tags=["Registry"])


@router.get("", response_model=None)
async def get_registry() -> dict[str, Any]:
    """Return the complete 37 node types, 47 relations, and 5 layers registry."""
    return export_registry_dict()
