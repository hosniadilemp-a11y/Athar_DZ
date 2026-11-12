"""Audit verification endpoints."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncEngine

from app.db.session import get_pg_engine
from app.schemas.graph import AuditVerificationResult
from app.services.audit_service import verify_audit_chain

router = APIRouter(prefix="/cases/{case_id}/audit", tags=["audit"])


@router.get("/verify", response_model=AuditVerificationResult)
async def verify_audit_chain_endpoint(
    case_id: uuid.UUID,
    engine: AsyncEngine = Depends(get_pg_engine),
) -> AuditVerificationResult:
    """Verify cryptographic hash integrity of the case audit log."""
    return await verify_audit_chain(engine, case_id)
