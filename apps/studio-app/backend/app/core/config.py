"""Application settings loaded from environment variables."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Single source of configuration for Athar backend."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Athar"
    app_env: str = "development"
    actor_id: str = "opj-benali-unauthenticated"
    cors_origin: str = "http://127.0.0.1:5173,http://localhost:5173"

    @property
    def cors_origins_list(self) -> list[str]:
        """Return list of allowed CORS origins, supporting both localhost and 127.0.0.1."""
        origins = [orig.strip() for orig in self.cors_origin.split(",") if orig.strip()]
        expanded: set[str] = set(origins)
        for o in origins:
            if "127.0.0.1" in o:
                expanded.add(o.replace("127.0.0.1", "localhost"))
            elif "localhost" in o:
                expanded.add(o.replace("localhost", "127.0.0.1"))
        return sorted(list(expanded))

    postgres_host: str = "postgres"
    postgres_port: int = 5432
    postgres_db: str = "athar_db"
    postgres_user: str = "athar_user"
    postgres_password: str = "change_me_pg_secret"

    neo4j_uri: str = "bolt://neo4j:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "change_me_neo4j_secret"

    redis_host: str = "redis"
    redis_port: int = 6379
    redis_password: str = "change_me_redis_secret"

    @property
    def postgres_dsn(self) -> str:
        """Async SQLAlchemy DSN for PostgreSQL."""
        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def redis_url(self) -> str:
        """Redis connection URL."""
        return f"redis://:{self.redis_password}@{self.redis_host}:{self.redis_port}/0"


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance."""
    return Settings()
