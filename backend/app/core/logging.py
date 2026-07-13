"""
Structured logging configuration.

Provides a reusable logging setup that can be initialized once at
application startup and used across all modules.
"""

import logging
import sys

from app.core.config import settings


def setup_logging() -> None:
    """
    Configure the root logger with a structured format.

    Call this once during application startup. All modules can then
    use ``logging.getLogger(__name__)`` to get a properly configured logger.
    """
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)

    # Define a structured log format
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)

    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(log_level)

    # Remove existing handlers to avoid duplicates on reload
    root_logger.handlers.clear()
    root_logger.addHandler(console_handler)

    # Quieten noisy libraries
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(
        logging.INFO if settings.DEBUG else logging.WARNING
    )


def get_logger(name: str) -> logging.Logger:
    """
    Get a named logger.

    Args:
        name: Logger name, typically ``__name__``.

    Returns:
        A configured Logger instance.
    """
    return logging.getLogger(name)
