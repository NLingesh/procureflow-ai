"""
Security utilities for password hashing and JWT token management.

This module provides helper functions only. Authentication endpoints
(login, register) will be implemented in a later phase.
"""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
import bcrypt

from app.core.config import settings

# ---------------------------------------------------------------------------
# Password Hashing
# ---------------------------------------------------------------------------


def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt.

    Args:
        password: The plaintext password to hash.

    Returns:
        The bcrypt-hashed password string.
    """
    passwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(passwd_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against a bcrypt hash.

    Args:
        plain_password: The plaintext password to verify.
        hashed_password: The stored bcrypt hash.

    Returns:
        True if the password matches, False otherwise.
    """
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )
    except Exception:
        return False


# ---------------------------------------------------------------------------
# JWT Token Management
# ---------------------------------------------------------------------------

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a signed JWT access token.

    Args:
        data: Payload data to encode in the token (e.g., {"sub": user_id}).
        expires_delta: Optional custom expiration time. Defaults to the
                       value from application settings.

    Returns:
        The encoded JWT string.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta
        or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def decode_access_token(token: str) -> dict | None:
    """
    Decode and validate a JWT access token.

    Args:
        token: The JWT string to decode.

    Returns:
        The decoded payload dictionary, or None if the token is invalid.
    """
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except JWTError:
        return None
