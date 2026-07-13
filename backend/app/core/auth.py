"""
Authentication dependencies for FastAPI route protection.

Provides placeholder dependency functions for JWT-based authentication.
Actual implementation will be added when auth endpoints are built.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.security import decode_access_token

from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User

# ---------------------------------------------------------------------------
# OAuth2 Scheme
# ---------------------------------------------------------------------------

# The tokenUrl should point to the future login endpoint.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# ---------------------------------------------------------------------------
# Dependencies
# ---------------------------------------------------------------------------

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to extract and validate the current user from a JWT token.

    Args:
        token: JWT token extracted from the Authorization header.
        db: Database session.

    Returns:
        The User ORM model object.

    Raises:
        HTTPException: 401 if the token is invalid or expired.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    try:
        user_id_int = int(user_id)
    except ValueError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id_int).first()
    if user is None:
        raise credentials_exception

    return user
