"""Integration tests for Neo4j and PostgreSQL schema initialization."""

import pytest
from neo4j import AsyncGraphDatabase
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import get_settings
from app.db.neo4j_schema import init_neo4j_schema
from app.db.postgres_schema import init_postgres_schema


@pytest.mark.asyncio
async def test_init_neo4j_schema_idempotent() -> None:
    """Should create Neo4j constraints and indexes without error on multiple calls."""
    settings = get_settings()
    driver = AsyncGraphDatabase.driver(
        settings.neo4j_uri,
        auth=(settings.neo4j_user, settings.neo4j_password),
    )

    try:
        applied_first = await init_neo4j_schema(driver)
        assert len(applied_first) >= 6

        # Second call must be idempotent
        applied_second = await init_neo4j_schema(driver)
        assert len(applied_second) == len(applied_first)
    finally:
        await driver.close()


@pytest.mark.asyncio
async def test_init_postgres_schema_idempotent() -> None:
    """Should create PostgreSQL tables and indexes and remain idempotent."""
    settings = get_settings()
    engine = create_async_engine(settings.postgres_dsn)

    try:
        applied = await init_postgres_schema(engine)
        assert len(applied) >= 5

        # Verify tables exist in public schema
        async with engine.connect() as conn:
            result = await conn.execute(
                text(
                    "SELECT table_name FROM information_schema.tables "
                    "WHERE table_schema = 'public' ORDER BY table_name;"
                )
            )
            tables = {row[0] for row in result.fetchall()}
            expected_tables = {"cases", "nodes", "edges", "audit_logs", "telecom_cdrs"}
            assert expected_tables.issubset(tables)

        # Second run must execute cleanly without error
        applied_again = await init_postgres_schema(engine)
        assert len(applied_again) == len(applied)
    finally:
        await engine.dispose()
