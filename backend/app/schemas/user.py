"""
User Pydantic schemas for request/response validation.

Future-ready schemas for when authentication is implemented.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    """Schema for creating a new user."""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, max_length=128, description="User password")
    full_name: str | None = Field(None, max_length=255, description="User full name")


class UserResponse(BaseModel):
    """Schema for user responses (excludes password)."""
    id: int
    email: str
    full_name: str | None = None
    is_active: bool
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"
