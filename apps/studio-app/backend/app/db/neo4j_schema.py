"""Neo4j schema constraints and indexes initialization for Athar."""

from __future__ import annotations

import logging
from typing import Sequence

from neo4j import AsyncDriver, AsyncGraphDatabase

from app.core.config import get_settings

logger = logging.getLogger(__name__)

NEO4J_DDL_STATEMENTS: Sequence[str] = (
    # Constraints
    "CREATE CONSTRAINT c_node_id IF NOT EXISTS FOR (n:Node) REQUIRE n.id IS UNIQUE",
    "CREATE CONSTRAINT c_case_id IF NOT EXISTS FOR (c:Case) REQUIRE c.id IS UNIQUE",
    # Indexes for fast lookup by case, ontology type, and layer
    "CREATE INDEX idx_node_case IF NOT EXISTS FOR (n:Node) ON (n.case_id)",
    "CREATE INDEX idx_node_type IF NOT EXISTS FOR (n:Node) ON (n.type)",
    "CREATE INDEX idx_node_layer IF NOT EXISTS FOR (n:Node) ON (n.layer)",
    "CREATE INDEX idx_node_label IF NOT EXISTS FOR (n:Node) ON (n.label)",
)


async def init_neo4j_schema(driver: AsyncDriver | None = None) -> list[str]:
    """Execute all schema constraints and index DDLs on the Neo4j instance."""
    settings = get_settings()
    created_driver = False
    if driver is None:
        driver = AsyncGraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_user, settings.neo4j_password),
        )
        created_driver = True

    applied: list[str] = []
    try:
        async with driver.session() as session:
            for statement in NEO4J_DDL_STATEMENTS:
                await session.run(statement)
                applied.append(statement)
                logger.info("Applied Neo4j DDL: %s", statement)
    finally:
        if created_driver:
            await driver.close()

    return applied
