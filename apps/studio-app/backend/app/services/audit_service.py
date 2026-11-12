"""Audit service with append-only SHA-256 Merkle-style hash chaining."""

from __future__ import annotations

import hashlib
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

from app.schemas.graph import AuditLogResponse, AuditVerificationResult

logger = logging.getLogger(__name__)


def compute_entry_hash(
    prev_hash: str,
    action: str,
    actor_id: str,
    entity_type: str,
    entity_id: uuid.UUID,
    before_state: dict[str, Any] | None,
    after_state: dict[str, Any] | None,
    reason: str,
    timestamp: str,
) -> str:
    """Compute deterministic SHA-256 hash over canonical audit fields."""
    canonical = {
        "prev_hash": prev_hash,
        "action": action,
        "actor_id": actor_id,
        "entity_type": entity_type,
        "entity_id": str(entity_id),
        "before_state": before_state,
        "after_state": after_state,
        "reason": reason,
        "timestamp": timestamp,
    }
    raw_bytes = json.dumps(canonical, sort_keys=True).encode("utf-8")
    return hashlib.sha256(raw_bytes).hexdigest()


async def log_audit_event(
    engine: AsyncEngine,
    case_id: uuid.UUID,
    actor_id: str,
    action: str,
    entity_type: str,
    entity_id: uuid.UUID,
    before_state: dict[str, Any] | None = None,
    after_state: dict[str, Any] | None = None,
    reason: str = "",
) -> AuditLogResponse:
    """Append a cryptographically chained audit log entry."""
    async with engine.begin() as conn:
        # Fetch the most recent hash for this case
        res = await conn.execute(
            text(
                "SELECT hash FROM audit_logs WHERE case_id = :case_id "
                "ORDER BY timestamp DESC, id DESC LIMIT 1;"
            ),
            {"case_id": case_id},
        )
        prev_row = res.fetchone()
        prev_hash = prev_row[0] if prev_row else ("0" * 64)

        audit_id = uuid.uuid4()
        now_dt = datetime.now(timezone.utc)
        iso_timestamp = now_dt.isoformat()
        entry_hash = compute_entry_hash(
            prev_hash=prev_hash,
            action=action,
            actor_id=actor_id,
            entity_type=entity_type,
            entity_id=entity_id,
            before_state=before_state,
            after_state=after_state,
            reason=reason,
            timestamp=iso_timestamp,
        )

        await conn.execute(
            text(
                """
                INSERT INTO audit_logs (
                    id, case_id, actor_id, action, entity_type, entity_id,
                    before_state, after_state, reason, timestamp, prev_hash, hash
                ) VALUES (
                    :id, :case_id, :actor_id, :action, :entity_type, :entity_id,
                    CAST(:before_state AS JSONB), CAST(:after_state AS JSONB),
                    :reason, :timestamp, :prev_hash, :hash
                );
                """
            ),
            {
                "id": audit_id,
                "case_id": case_id,
                "actor_id": actor_id,
                "action": action,
                "entity_type": entity_type,
                "entity_id": entity_id,
                "before_state": json.dumps(before_state) if before_state else None,
                "after_state": json.dumps(after_state) if after_state else None,
                "reason": reason,
                "timestamp": now_dt,
                "prev_hash": prev_hash,
                "hash": entry_hash,
            },
        )

    return AuditLogResponse(
        id=audit_id,
        case_id=case_id,
        actor_id=actor_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        before_state=before_state,
        after_state=after_state,
        reason=reason,
        timestamp=iso_timestamp,
        prev_hash=prev_hash,
        hash=entry_hash,
    )


async def verify_audit_chain(engine: AsyncEngine, case_id: uuid.UUID) -> AuditVerificationResult:
    """Verify integrity of the audit hash chain from genesis to head."""
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT id, actor_id, action, entity_type, entity_id, "
                "before_state, after_state, reason, timestamp, prev_hash, hash "
                "FROM audit_logs WHERE case_id = :case_id "
                "ORDER BY timestamp ASC, id ASC;"
            ),
            {"case_id": case_id},
        )
        rows = res.fetchall()

    if not rows:
        return AuditVerificationResult(
            is_valid=True,
            total_entries=0,
            message="Audit chain is empty",
        )

    expected_prev = "0" * 64
    for idx, row in enumerate(rows):
        (
            _id,
            actor_id,
            action,
            entity_type,
            entity_id,
            before_state,
            after_state,
            reason,
            ts,
            prev_hash,
            recorded_hash,
        ) = row

        # 1. Verify prev_hash link
        if prev_hash != expected_prev:
            return AuditVerificationResult(
                is_valid=False,
                total_entries=len(rows),
                first_tampered_index=idx,
                message=f"Broken prev_hash chain link at index {idx}",
            )

        # 2. Recompute hash
        recomputed = compute_entry_hash(
            prev_hash=prev_hash,
            action=action,
            actor_id=actor_id,
            entity_type=entity_type,
            entity_id=entity_id,
            before_state=before_state,
            after_state=after_state,
            reason=reason,
            timestamp=ts.isoformat() if hasattr(ts, "isoformat") else str(ts),
        )

        if recomputed != recorded_hash:
            return AuditVerificationResult(
                is_valid=False,
                total_entries=len(rows),
                first_tampered_index=idx,
                message=f"Tampered content detected at index {idx}",
            )

        expected_prev = recorded_hash

    return AuditVerificationResult(
        is_valid=True,
        total_entries=len(rows),
        message="Audit chain cryptographic integrity verified: 100% authentic",
    )
