"""
Database configuration and session management.

Provides:
- SQLAlchemy engine and session factory.
- Declarative base for ORM models.
- Dependency-injectable session generator for FastAPI routes.
"""

from collections.abc import Generator
from typing import Any

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------

# SQLite requires `check_same_thread=False` to allow FastAPI's async
# request handling to share the connection across threads.
connect_args: dict[str, Any] = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    echo=(settings.ENVIRONMENT == "development"),  # SQL logging in dev
)

# ---------------------------------------------------------------------------
# Session Factory
# ---------------------------------------------------------------------------

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


# ---------------------------------------------------------------------------
# Declarative Base
# ---------------------------------------------------------------------------

class Base(DeclarativeBase):
    """
    SQLAlchemy declarative base class.

    All ORM models should inherit from this base.
    """
    pass


# ---------------------------------------------------------------------------
# Table Initialization
# ---------------------------------------------------------------------------

def init_db() -> None:
    """
    Create all database tables from registered ORM models.

    This should be called once during application startup. It is safe to
    call multiple times — existing tables will not be recreated.
    """
    # Import models package to ensure all models are registered with Base
    import app.models  # noqa: F401
    Base.metadata.create_all(bind=engine)

    # Seed default user if not exists
    from app.models.user import User
    from app.core.security import hash_password
    db = SessionLocal()
    try:
        admin_email = "lingesh@procureflow.ai"
        existing = db.query(User).filter(User.email == admin_email).first()
        if not existing:
            default_admin = User(
                email=admin_email,
                hashed_password=hash_password("password123"),
                full_name="Lingesh",
                is_active=True,
                is_superuser=True
            )
            db.add(default_admin)
            db.commit()
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Dependency Injection
# ---------------------------------------------------------------------------

def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session.

    Yields a SQLAlchemy session and ensures it is closed after the
    request completes, even if an exception occurs.

    Usage::

        @router.get("/items")
        def list_items(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
