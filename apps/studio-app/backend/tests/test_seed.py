"""Integration test for the idempotent seed loader (Milestone 1B).

Verifies that the 100-node Candy Wheels dataset is completely loaded into
both PostgreSQL and Neo4j, and that subsequent executions produce zero duplicates.
"""

import pytest
from neo4j import AsyncGraphDatabase
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import get_settings
from app.db.seed import seed_candy_wheels


@pytest.mark.asyncio
async def test_seed_candy_wheels_idempotent() -> None:
    """Test first seed execution, database state assertions, and second run idempotence."""
    settings = get_settings()

    # 1. First execution
    result_first = await seed_candy_wheels(force=True)
    assert result_first["status"] == "seeded"
    assert result_first["nodes_count"] == 100
    assert result_first["edges_count"] == 129
    case_id = result_first["case_id"]

    # 2. Verify PostgreSQL data
    pg_engine = create_async_engine(settings.postgres_dsn)
    try:
        async with pg_engine.connect() as conn:
            # Case check
            res_case = await conn.execute(
                text("SELECT code, title FROM cases WHERE id = :id;"),
                {"id": case_id},
            )
            case_row = res_case.fetchone()
            assert case_row is not None
            assert "CANDY" in case_row[0]

            # Nodes count check
            res_nodes = await conn.execute(
                text("SELECT count(*) FROM nodes WHERE case_id = :case_id;"),
                {"case_id": case_id},
            )
            nodes_count = res_nodes.scalar_one()
            assert nodes_count == 100

            # Edges count check
            res_edges = await conn.execute(
                text("SELECT count(*) FROM edges WHERE case_id = :case_id;"),
                {"case_id": case_id},
            )
            edges_count = res_edges.scalar_one()
            assert edges_count == 129

            # Audit log check
            res_audit = await conn.execute(
                text("SELECT action, hash FROM audit_logs WHERE case_id = :case_id;"),
                {"case_id": case_id},
            )
            audit_row = res_audit.fetchone()
            assert audit_row is not None
            assert audit_row[0] == "SEED_CASE"
            assert len(audit_row[1]) == 64  # SHA-256
    finally:
        await pg_engine.dispose()

    # 3. Verify Neo4j data
    driver = AsyncGraphDatabase.driver(
        settings.neo4j_uri,
        auth=(settings.neo4j_user, settings.neo4j_password),
    )
    try:
        async with driver.session() as session:
            # Node count
            r_nodes = await session.run(
                "MATCH (n:Node {case_id: $case_id}) RETURN count(n) AS cnt;",
                {"case_id": case_id},
            )
            record_nodes = await r_nodes.single()
            assert record_nodes is not None
            assert record_nodes["cnt"] == 100

            # Edge count
            r_edges = await session.run(
                "MATCH ()-[r {case_id: $case_id}]->() RETURN count(r) AS cnt;",
                {"case_id": case_id},
            )
            record_edges = await r_edges.single()
            assert record_edges is not None
            assert record_edges["cnt"] == 129
    finally:
        await driver.close()

    # 4. Second execution (without force) - Must detect existing case and NOT duplicate
    result_second = await seed_candy_wheels(force=False)
    assert result_second["status"] == "already_seeded"
    assert result_second["nodes_count"] == 100
    assert result_second["edges_count"] == 129

    # Re-verify counts in PostgreSQL
    pg_engine = create_async_engine(settings.postgres_dsn)
    try:
        async with pg_engine.connect() as conn:
            res_nodes_after = await conn.execute(
                text("SELECT count(*) FROM nodes WHERE case_id = :case_id;"),
                {"case_id": case_id},
            )
            assert res_nodes_after.scalar_one() == 100

            res_edges_after = await conn.execute(
                text("SELECT count(*) FROM edges WHERE case_id = :case_id;"),
                {"case_id": case_id},
            )
            assert res_edges_after.scalar_one() == 129
    finally:
        await pg_engine.dispose()
