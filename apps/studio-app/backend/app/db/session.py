"""Database engines and driver singletons."""

from __future__ import annotations

from typing import AsyncIterator

from neo4j import AsyncDriver, AsyncGraphDatabase
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import get_settings

_engine: AsyncEngine | None = None


def get_pg_engine() -> AsyncEngine:
    """Return AsyncEngine with NullPool to prevent event loop connection leaks."""
    global _engine
    if _engine is None:
        settings = get_settings()
        _engine = create_async_engine(settings.postgres_dsn, poolclass=NullPool)
    return _engine


async def get_neo4j_driver() -> AsyncIterator[AsyncDriver]:
    """Yield Neo4j AsyncDriver per request and cleanly close sockets on teardown."""
    settings = get_settings()
    driver = AsyncGraphDatabase.driver(
        settings.neo4j_uri,
        auth=(settings.neo4j_user, settings.neo4j_password),
    )
    try:
        yield driver
    finally:
        await driver.close()


