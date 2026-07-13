"""
File upload utilities.

Provides validation and storage helpers for uploaded files (e.g., invoices).
"""

import logging
import os
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

logger = logging.getLogger(__name__)


def validate_upload(file: UploadFile) -> None:
    """
    Validate an uploaded file's extension and size.

    Args:
        file: The uploaded file from a FastAPI endpoint.

    Raises:
        HTTPException: 400 if the file type is not allowed.
        HTTPException: 413 if the file exceeds the maximum size.
    """
    # Check extension
    if file.filename:
        ext = Path(file.filename).suffix.lower()
        if ext not in settings.allowed_extensions:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"File type '{ext}' is not allowed. "
                    f"Allowed: {', '.join(sorted(settings.allowed_extensions))}"
                ),
            )

    # Check size (read content length from spooled file)
    file.file.seek(0, 2)  # Seek to end
    file_size = file.file.tell()
    file.file.seek(0)  # Reset to beginning

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file_size > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size ({file_size} bytes) exceeds maximum of {settings.MAX_UPLOAD_SIZE_MB} MB",
        )


async def save_upload(file: UploadFile, subdir: str = "") -> str:
    """
    Save an uploaded file to the uploads directory.

    Args:
        file: The uploaded file.
        subdir: Optional subdirectory within uploads (e.g., ``"invoices"``).

    Returns:
        The relative path to the saved file (from project root).

    Raises:
        HTTPException: 500 if the file could not be saved.
    """
    validate_upload(file)

    # Build target directory
    upload_path = Path(settings.UPLOAD_DIR) / subdir
    upload_path.mkdir(parents=True, exist_ok=True)

    # Generate a unique filename
    ext = Path(file.filename).suffix.lower() if file.filename else ""
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = upload_path / unique_name

    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        logger.info("Saved upload: %s (%d bytes)", file_path, len(content))
    except Exception as exc:
        logger.error("Failed to save upload: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save uploaded file",
        ) from exc

    return str(file_path)


def ensure_upload_dir() -> None:
    """Create the uploads directory if it does not exist."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    logger.info("Upload directory ready: %s", settings.UPLOAD_DIR)
