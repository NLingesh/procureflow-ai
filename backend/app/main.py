"""
ProcureFlow AI — FastAPI Application Factory.

This is the main entry point for the FastAPI application. It configures:
- Application metadata (title, version, description)
- Lifespan events (startup / shutdown)
- CORS middleware
- Global exception handling
- API router
- Root and health-check endpoints
- Swagger / ReDoc documentation
"""

import logging
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine, init_db
from app.core.logging import setup_logging
from app.api.api import api_router
from app.schemas.common import HealthResponse, MessageResponse
from app.utils.file_upload import ensure_upload_dir

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Lifespan (replaces deprecated @app.on_event)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager.

    Startup:
        - Configure structured logging
        - Create database tables
        - Ensure uploads directory exists

    Shutdown:
        - Dispose the SQLAlchemy engine connection pool
    """
    # ── Startup ──────────────────────────────────────────────────────────
    setup_logging()
    logger.info("Starting %s v%s (%s)", settings.APP_NAME, settings.APP_VERSION, settings.ENVIRONMENT)

    init_db()
    logger.info("Database tables initialized")

    ensure_upload_dir()

    logger.info("Application startup complete")

    yield

    # ── Shutdown ─────────────────────────────────────────────────────────
    engine.dispose()
    logger.info("Database connections disposed — shutdown complete")


# ---------------------------------------------------------------------------
# Application Factory
# ---------------------------------------------------------------------------

def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application instance.

    Returns:
        A fully configured FastAPI application.
    """
    application = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=(
            "🚀 ProcureFlow AI — An AI-powered procurement platform.\n\n"
            "Manage vendors, purchase orders, invoices, and gain "
            "AI-driven insights to optimize your procurement workflow."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # ------------------------------------------------------------------
    # CORS Middleware
    # ------------------------------------------------------------------
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ------------------------------------------------------------------
    # Routers
    # ------------------------------------------------------------------
    application.include_router(api_router)

    # ------------------------------------------------------------------
    # Global Exception Handler
    # ------------------------------------------------------------------
    @application.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Catch-all handler for unhandled exceptions — returns clean JSON."""
        logger.error(
            "Unhandled exception on %s %s: %s",
            request.method,
            request.url.path,
            exc,
            exc_info=True,
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": "Internal server error"},
        )

    return application


# Create the application instance
app = create_application()


# ---------------------------------------------------------------------------
# Root & Health Endpoints
# ---------------------------------------------------------------------------

@app.get(
    "/",
    tags=["Root"],
    response_model=MessageResponse,
    summary="Root endpoint",
    description="Returns a welcome message confirming the API is running.",
)
async def root() -> MessageResponse:
    """Root endpoint — confirms the backend is operational."""
    return MessageResponse(message="ProcureFlow AI Backend Running")


@app.get(
    "/health",
    tags=["Health"],
    response_model=HealthResponse,
    summary="Health check",
    description="Returns the current health status of the API.",
)
async def health_check() -> HealthResponse:
    """Health check endpoint for monitoring and load balancers."""
    return HealthResponse(status="healthy")
