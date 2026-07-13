"""
Invoice Pydantic schemas for request/response validation.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class InvoiceBase(BaseModel):
    """Shared fields for invoice create/update operations."""
    invoice_number: str = Field(..., min_length=1, max_length=100, description="Unique invoice number")
    vendor_id: int = Field(..., gt=0, description="ID of the associated vendor")
    purchase_order_id: int | None = Field(None, gt=0, description="ID of the linked purchase order")
    amount: float = Field(0.0, ge=0, description="Invoice amount")
    notes: str | None = Field(None, description="Additional notes")


class InvoiceCreate(InvoiceBase):
    """Schema for creating a new invoice."""
    pass


class InvoiceUpdate(BaseModel):
    """Schema for updating an existing invoice. All fields are optional."""
    invoice_number: str | None = Field(None, min_length=1, max_length=100, description="Unique invoice number")
    vendor_id: int | None = Field(None, gt=0, description="ID of the associated vendor")
    purchase_order_id: int | None = Field(None, gt=0, description="ID of the linked purchase order")
    amount: float | None = Field(None, ge=0, description="Invoice amount")
    status: str | None = Field(None, max_length=50, description="Invoice status (pending/paid/overdue/cancelled)")
    notes: str | None = Field(None, description="Additional notes")


class InvoiceResponse(InvoiceBase):
    """Schema for invoice responses."""
    id: int
    status: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
