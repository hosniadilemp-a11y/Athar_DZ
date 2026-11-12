"""Health endpoint unit tests."""

from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_ok() -> None:
    """Health returns 200 when all data-tier services report ok."""
    ok_status = {"status": "ok", "detail": "connected"}
    with (
        patch("app.db.health.check_neo4j", new=AsyncMock(return_value=ok_status)),
        patch("app.db.health.check_postgres", new=AsyncMock(return_value=ok_status)),
        patch("app.db.health.check_redis", new=AsyncMock(return_value=ok_status)),
    ):
        response = client.get("/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ok"
    assert payload["app_name"] == "Athar"
    assert set(payload["services"].keys()) == {"neo4j", "postgres", "redis"}


def test_health_degraded_returns_503() -> None:
    """Health returns 503 when any data-tier service is unreachable."""
    ok_status = {"status": "ok", "detail": "connected"}
    err_status = {"status": "error", "detail": "unreachable"}
    with (
        patch("app.db.health.check_neo4j", new=AsyncMock(return_value=ok_status)),
        patch("app.db.health.check_postgres", new=AsyncMock(return_value=err_status)),
        patch("app.db.health.check_redis", new=AsyncMock(return_value=ok_status)),
    ):
        response = client.get("/health")
    assert response.status_code == 503
    payload = response.json()
    assert payload["status"] == "degraded"
    assert payload["services"]["postgres"]["status"] == "error"
