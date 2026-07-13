"""
Application configuration management.

Loads settings from environment variables with sensible defaults.
Uses pydantic-settings for type-safe configuration.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    Attributes:
        APP_NAME: Display name of the application.
        APP_VERSION: Current application version.
        ENVIRONMENT: Runtime environment (development, staging, production).
        DATABASE_URL: SQLAlchemy-compatible database connection string.
        SECRET_KEY: Secret key used for JWT signing and encryption.
        ACCESS_TOKEN_EXPIRE_MINUTES: JWT access token lifetime in minutes.
        ALGORITHM: JWT signing algorithm.
        BACKEND_CORS_ORIGINS: Comma-separated list of allowed CORS origins.
    """

    APP_NAME: str = "ProcureFlow AI"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "sqlite:///./procureflow.db"

    # Security / JWT
    SECRET_KEY: str = "change-this-to-a-secure-random-string-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    # CORS
    BACKEND_CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://localhost:8000"

    # File Uploads
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_UPLOAD_EXTENSIONS: str = ".pdf,.png,.jpg,.jpeg,.xlsx,.csv"

    # Logging
    LOG_LEVEL: str = "INFO"
    DEBUG: bool = False

    @property
    def allowed_extensions(self) -> set[str]:
        """Parse comma-separated allowed extensions into a set."""
        return {
            ext.strip().lower()
            for ext in self.ALLOWED_UPLOAD_EXTENSIONS.split(",")
            if ext.strip()
        }

    @property
    def cors_origins(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [
            origin.strip()
            for origin in self.BACKEND_CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


# Singleton settings instance
settings = Settings()
