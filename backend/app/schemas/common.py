"""
Common response schemas used across the API.
"""

from pydantic import BaseModel


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str


class HealthResponse(BaseModel):
    """Health check response."""
    status: str


class DetailResponse(BaseModel):
    """Error detail response (matches FastAPI's HTTPException format)."""
    detail: str
