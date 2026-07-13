"""
Purchase Order Pydantic schemas for request/response validation.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class PurchaseOrderBase(BaseModel):
    """Shared fields for purchase order create/update operations."""
    order_number: str = Field(..., min_length=1, max_length=100, description="Unique order number")
    vendor_id: int = Field(..., gt=0, description="ID of the associated vendor")
    total_amount: float = Field(0.0, ge=0, description="Total order amount")
    notes: str | None = Field(None, description="Additional notes")


class PurchaseOrderCreate(PurchaseOrderBase):
    """Schema for creating a new purchase order."""
    pass


class PurchaseOrderUpdate(BaseModel):
    """Schema for updating an existing purchase order. All fields are optional."""
    order_number: str | None = Field(None, min_length=1, max_length=100, description="Unique order number")
    vendor_id: int | None = Field(None, gt=0, description="ID of the associated vendor")
    total_amount: float | None = Field(None, ge=0, description="Total order amount")
    status: str | None = Field(None, max_length=50, description="Order status (draft/approved/completed/cancelled)")
    notes: str | None = Field(None, description="Additional notes")


class PurchaseOrderResponse(PurchaseOrderBase):
    """Schema for purchase order responses."""
    id: int
    status: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
