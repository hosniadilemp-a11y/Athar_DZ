"""SNA Service layer: loads graph snapshot and runs pure algorithms in worker threads."""

from __future__ import annotations

import asyncio
import time
import uuid
from typing import Any

from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

from app.domain.sna_registry import SNA_REGISTRY
from app.schemas.sna import SnaResultResponse
from app.services.audit_service import log_audit_event
from app.services.sna.algorithms import ALGORITHM_DISPATCHER


async def execute_sna_algorithm(
    engine: AsyncEngine,
    case_id: uuid.UUID,
    algorithm_key: str,
    params: dict[str, Any],
    actor_id: str,
) -> SnaResultResponse:
    """Execute requested SNA algorithm on the case graph snapshot."""
    # 1. Allowlist validation
    if algorithm_key not in SNA_REGISTRY:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "SNA_ALGORITHM_NOT_FOUND",
                "message": f"Algorithm '{algorithm_key}' is not registered in the SNA allowlist",
            },
        )

    # 2. Case existence check
    async with engine.connect() as conn:
        c_res = await conn.execute(text("SELECT id FROM cases WHERE id = :id;"), {"id": case_id})
        if not c_res.fetchone():
            raise HTTPException(
                status_code=404,
                detail={"code": "CASE_NOT_FOUND", "message": f"Case '{case_id}' does not exist"},
            )

        # 3. Load snapshot of non-deleted nodes and edges
        n_res = await conn.execute(
            text(
                """
                SELECT id, type, layer, label, confidence, provenance, properties,
                       latitude, longitude, created_at, updated_at
                FROM nodes
                WHERE case_id = :case_id AND deleted_at IS NULL
                ORDER BY id ASC;
                """
            ),
            {"case_id": case_id},
        )
        nodes = [
            {
                "id": r[0],
                "type": r[1],
                "layer": r[2],
                "label": r[3],
                "confidence": r[4],
                "provenance": r[5],
                "properties": r[6],
                "latitude": r[7],
                "longitude": r[8],
                "created_at": r[9].isoformat() if r[9] else None,
                "updated_at": r[10].isoformat() if r[10] else None,
            }
            for r in n_res.fetchall()
        ]

        e_res = await conn.execute(
            text(
                """
                SELECT id, type, source_id, target_id, layer, confidence, provenance,
                       properties, created_at, updated_at
                FROM edges
                WHERE case_id = :case_id AND deleted_at IS NULL
                ORDER BY id ASC;
                """
            ),
            {"case_id": case_id},
        )
        edges = [
            {
                "id": r[0],
                "type": r[1],
                "source_id": r[2],
                "target_id": r[3],
                "layer": r[4],
                "confidence": r[5],
                "provenance": r[6],
                "properties": r[7],
                "created_at": r[8].isoformat() if r[8] else None,
                "updated_at": r[9].isoformat() if r[9] else None,
            }
            for r in e_res.fetchall()
        ]

    # 4. Run in thread pool to prevent blocking the async event loop
    algo_fn = ALGORITHM_DISPATCHER[algorithm_key]
    t0 = time.perf_counter()

    try:
        result: SnaResultResponse = await asyncio.to_thread(algo_fn, nodes, edges, params)
    except ValueError as val_err:
        raise HTTPException(
            status_code=400,
            detail={"code": "SNA_PARAM_ERROR", "message": str(val_err)},
        ) from val_err
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={"code": "SNA_EXECUTION_ERROR", "message": f"Computation failure: {exc}"},
        ) from exc

    t1 = time.perf_counter()
    result.execution_time_ms = round((t1 - t0) * 1000.0, 2)

    # 5. Forensic audit logging
    await log_audit_event(
        engine=engine,
        case_id=case_id,
        actor_id=actor_id,
        action="SNA_RUN",
        entity_type="sna_algorithm",
        entity_id=case_id,
        before_state={"algorithm": algorithm_key, "params": params},
        after_state={"summary": result.summary, "time_ms": result.execution_time_ms},
        reason=f"Exécution algorithmique SNA : {result.algorithm_name}",
    )

    return result
