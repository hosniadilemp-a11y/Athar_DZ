"""Health check probes for Neo4j, PostgreSQL (PostGIS/TimescaleDB), and Redis."""

from typing import TypedDict

import asyncpg
import redis.asyncio as aioredis
from neo4j import AsyncGraphDatabase

from app.core.config import Settings


class ServiceHealth(TypedDict):
    """Health status for an individual data-tier service."""

    status: str
    detail: str


class HealthReport(TypedDict):
    """Aggregate health response."""

    status: str
    app_name: str
    services: dict[str, ServiceHealth]


async def check_neo4j(settings: Settings) -> ServiceHealth:
    """Verify Neo4j Bolt connectivity."""
    driver = AsyncGraphDatabase.driver(
        settings.neo4j_uri,
        auth=(settings.neo4j_user, settings.neo4j_password),
        connection_timeout=3.0,
    )
    try:
        await driver.verify_connectivity()
        return {"status": "ok", "detail": "connected"}
    except Exception:
        return {"status": "error", "detail": "unreachable"}
    finally:
        await driver.close()


async def check_postgres(settings: Settings) -> ServiceHealth:
    """Verify PostgreSQL connectivity."""
    conn: asyncpg.Connection | None = None
    try:
        conn = await asyncpg.connect(
            host=settings.postgres_host,
            port=settings.postgres_port,
            user=settings.postgres_user,
            password=settings.postgres_password,
            database=settings.postgres_db,
            timeout=3.0,
        )
        await conn.fetchval("SELECT 1")
        return {"status": "ok", "detail": "connected"}
    except Exception:
        return {"status": "error", "detail": "unreachable"}
    finally:
        if conn is not None:
            await conn.close()


async def check_redis(settings: Settings) -> ServiceHealth:
    """Verify Redis connectivity."""
    client = aioredis.Redis(
        host=settings.redis_host,
        port=settings.redis_port,
        password=settings.redis_password,
        socket_timeout=3.0,
    )
    try:
        pong = await client.ping()
        return {"status": "ok" if pong else "error", "detail": "connected" if pong else "no_pong"}
    except Exception:
        return {"status": "error", "detail": "unreachable"}
    finally:
        await client.aclose()


async def gather_health(settings: Settings) -> HealthReport:
    """Run all data-tier health probes and return aggregate status."""
    neo4j_res = await check_neo4j(settings)
    pg_res = await check_postgres(settings)
    redis_res = await check_redis(settings)

    services: dict[str, ServiceHealth] = {
        "neo4j": neo4j_res,
        "postgres": pg_res,
        "redis": redis_res,
    }
    all_ok = all(item["status"] == "ok" for item in services.values())
    return {
        "status": "ok" if all_ok else "degraded",
        "app_name": settings.app_name,
        "services": services,
    }
