"""PostgreSQL / TimescaleDB schema tables and initialization for Athar."""

from __future__ import annotations

import logging
from typing import Sequence

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from app.core.config import get_settings

logger = logging.getLogger(__name__)

POSTGRES_DDL_STATEMENTS: Sequence[str] = (
    # 1. Cases table
    """
    CREATE TABLE IF NOT EXISTS cases (
        id UUID PRIMARY KEY,
        code VARCHAR(64) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    """,
    # 2. Nodes table
    """
    CREATE TABLE IF NOT EXISTS nodes (
        id UUID PRIMARY KEY,
        case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        type VARCHAR(64) NOT NULL,
        layer VARCHAR(32) NOT NULL,
        label VARCHAR(255) NOT NULL,
        confidence DOUBLE PRECISION DEFAULT 1.0,
        provenance VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
        properties JSONB NOT NULL DEFAULT '{}'::jsonb,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMPTZ
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_nodes_case ON nodes(case_id);",
    "CREATE INDEX IF NOT EXISTS idx_nodes_type ON nodes(type);",
    "CREATE INDEX IF NOT EXISTS idx_nodes_layer ON nodes(layer);",
    (
        "CREATE INDEX IF NOT EXISTS idx_nodes_gps ON nodes(latitude, longitude) "
        "WHERE latitude IS NOT NULL;"
    ),
    # 3. Edges table
    """
    CREATE TABLE IF NOT EXISTS edges (
        id UUID PRIMARY KEY,
        case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        type VARCHAR(64) NOT NULL,
        source_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
        target_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
        layer VARCHAR(32) NOT NULL,
        confidence DOUBLE PRECISION DEFAULT 1.0,
        provenance VARCHAR(64) NOT NULL DEFAULT 'SYSTEM',
        properties JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMPTZ
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_edges_case ON edges(case_id);",
    "CREATE INDEX IF NOT EXISTS idx_edges_source ON edges(source_id);",
    "CREATE INDEX IF NOT EXISTS idx_edges_target ON edges(target_id);",
    "CREATE INDEX IF NOT EXISTS idx_edges_type ON edges(type);",
    # 4. Audit ledger (Append-only cryptographic hash chain)
    """
    CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY,
        case_id UUID NOT NULL,
        actor_id VARCHAR(128) NOT NULL,
        action VARCHAR(64) NOT NULL,
        entity_type VARCHAR(64) NOT NULL,
        entity_id UUID NOT NULL,
        before_state JSONB,
        after_state JSONB,
        reason TEXT DEFAULT '',
        timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        prev_hash VARCHAR(64) NOT NULL,
        hash VARCHAR(64) NOT NULL
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_audit_case ON audit_logs(case_id);",
    "CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);",
    # 5. Telecom CDRs time-series table
    """
    CREATE TABLE IF NOT EXISTS telecom_cdrs (
        id UUID PRIMARY KEY,
        case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        calling_number VARCHAR(32) NOT NULL,
        called_number VARCHAR(32) NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL,
        duration_seconds INT NOT NULL DEFAULT 0,
        bts_cell_id VARCHAR(64),
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION
    );
    """,
    "CREATE INDEX IF NOT EXISTS idx_cdrs_case_time ON telecom_cdrs(case_id, timestamp DESC);",
    # 6. Evidence files metadata & local pre-WORM staging (Blackboard-ready Phase 2A)
    """
    CREATE TABLE IF NOT EXISTS evidence_files (
        id UUID PRIMARY KEY,
        case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
        original_filename VARCHAR(255) NOT NULL,
        mime_type VARCHAR(128) NOT NULL DEFAULT 'application/pdf',
        byte_size BIGINT NOT NULL,
        sha256 VARCHAR(64) NOT NULL,
        storage_path TEXT NOT NULL,
        metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
        blackboard_sync_status VARCHAR(32) NOT NULL DEFAULT 'NOT_PUBLISHED',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(case_id, node_id)
    );
    """,
    (
        "CREATE INDEX IF NOT EXISTS idx_evidence_files_case_node "
        "ON evidence_files(case_id, node_id);"
    ),
    (
        "CREATE INDEX IF NOT EXISTS idx_evidence_files_bb_sync "
        "ON evidence_files(blackboard_sync_status);"
    ),
    # 7. Extraction runs (Mode 1 quick & Mode 2 step-by-step)
    """
    CREATE TABLE IF NOT EXISTS extraction_runs (
        id UUID PRIMARY KEY,
        case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        source_node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
        mode VARCHAR(32) NOT NULL,
        current_stage INT NOT NULL DEFAULT 0,
        total_stages INT NOT NULL DEFAULT 1,
        status VARCHAR(32) NOT NULL,
        selected_tools JSONB NOT NULL DEFAULT '[]'::jsonb,
        summary_json JSONB NOT NULL DEFAULT '{}'::jsonb,
        started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMPTZ
    );
    """,
    (
        "CREATE INDEX IF NOT EXISTS idx_extraction_runs_case_node "
        "ON extraction_runs(case_id, source_node_id);"
    ),
    # 8. Staged extracted candidate entities (isolated validation + Blackboard-ready)
    """
    CREATE TABLE IF NOT EXISTS extracted_candidates (
        id UUID PRIMARY KEY,
        case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
        run_id UUID NOT NULL REFERENCES extraction_runs(id) ON DELETE CASCADE,
        source_node_id UUID NOT NULL REFERENCES nodes(id) ON DELETE CASCADE,
        entity_type VARCHAR(64) NOT NULL,
        suggested_layer VARCHAR(32) NOT NULL,
        label VARCHAR(255) NOT NULL,
        normalized_value VARCHAR(512) NOT NULL,
        attributes_json JSONB NOT NULL DEFAULT '{}'::jsonb,
        confidence DOUBLE PRECISION NOT NULL DEFAULT 0.85,
        extractor_tool VARCHAR(128) NOT NULL,
        stage_number INT NOT NULL DEFAULT 1,
        source_page INT NOT NULL DEFAULT 1,
        source_locator VARCHAR(128) NOT NULL DEFAULT '',
        quote_snippet TEXT NOT NULL DEFAULT '',
        matched_existing_node_id UUID,
        validation_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
        promoted_node_id UUID,
        validated_by VARCHAR(128),
        validated_at TIMESTAMPTZ,
        blackboard_sync_status VARCHAR(32) NOT NULL DEFAULT 'NOT_PUBLISHED',
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    """,
    (
        "ALTER TABLE extracted_candidates "
        "ADD COLUMN IF NOT EXISTS source_locator VARCHAR(128) NOT NULL DEFAULT '';"
    ),
    (
        "CREATE INDEX IF NOT EXISTS idx_candidates_case_node "
        "ON extracted_candidates(case_id, source_node_id);"
    ),
    "CREATE INDEX IF NOT EXISTS idx_candidates_run ON extracted_candidates(run_id);",
    "CREATE INDEX IF NOT EXISTS idx_candidates_status ON extracted_candidates(validation_status);",
    (
        "CREATE INDEX IF NOT EXISTS idx_candidates_bb_sync "
        "ON extracted_candidates(blackboard_sync_status);"
    ),
)


async def init_postgres_schema(engine: AsyncEngine | None = None) -> list[str]:
    """Execute all schema creation DDLs on PostgreSQL."""
    settings = get_settings()
    created_engine = False
    if engine is None:
        engine = create_async_engine(settings.postgres_dsn)
        created_engine = True

    applied: list[str] = []
    try:
        async with engine.begin() as conn:
            for ddl in POSTGRES_DDL_STATEMENTS:
                await conn.execute(text(ddl))
                applied.append(ddl.strip().split("\n")[0])
                logger.info("Applied PostgreSQL DDL: %s", ddl.strip().split("\n")[0])
    finally:
        if created_engine:
            await engine.dispose()

    return applied
