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
