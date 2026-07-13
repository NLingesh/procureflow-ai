"""
Authentication routes.

Implements signup, login, get current user, and logout.
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


class UserRegister(BaseModel):
    """Registration request payload."""
    name: str | None = None
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """Login request payload."""
    email: EmailStr
    password: str


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
def register(
    user_in: UserRegister,
    db: Session = Depends(get_db),
) -> User:
    """Create a new user account."""
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_user = User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        full_name=user_in.name or user_in.email.split("@")[0].capitalize(),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and retrieve token",
)
def login(
    credentials: UserLogin,
    db: Session = Depends(get_db),
) -> dict:
    """Authenticate credentials and return a JWT access token."""
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account",
        )

    # Sub contains string representation of user's ID
    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user details",
)
def get_me(
    current_user: User = Depends(get_current_user),
) -> User:
    """Return the authenticated user's profile."""
    return current_user


class MessageResponse(BaseModel):
    message: str


class ChangePasswordRequest(BaseModel):
    """Change password request payload."""
    old_password: str
    new_password: str


@router.post(
    "/change-password",
    response_model=MessageResponse,
    summary="Change user password",
)
def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> MessageResponse:
    """Change password for current user."""
    if not verify_password(payload.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password",
        )
    current_user.hashed_password = hash_password(payload.new_password)
    db.commit()
    return MessageResponse(message="Password successfully changed")


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout user",
)
def logout() -> MessageResponse:
    """Clear authorization session context (handled client-side by clearing localStorage)."""
    return MessageResponse(message="Successfully logged out")
