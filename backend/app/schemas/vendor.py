"""
Vendor Pydantic schemas for request/response validation.
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class VendorBase(BaseModel):
    """Shared fields for vendor create/update operations."""
    name: str = Field(..., min_length=1, max_length=255, description="Vendor company name")
    email: EmailStr | None = Field(None, description="Vendor contact email")
    phone: str | None = Field(None, max_length=50, description="Vendor phone number")
    address: str | None = Field(None, description="Vendor physical address")


class VendorCreate(VendorBase):
    """Schema for creating a new vendor."""
    pass


class VendorUpdate(BaseModel):
    """Schema for updating an existing vendor. All fields are optional."""
    name: str | None = Field(None, min_length=1, max_length=255, description="Vendor company name")
    email: EmailStr | None = Field(None, description="Vendor contact email")
    phone: str | None = Field(None, max_length=50, description="Vendor phone number")
    address: str | None = Field(None, description="Vendor physical address")
    status: str | None = Field(None, max_length=50, description="Vendor status (active/inactive)")


class VendorResponse(VendorBase):
    """Schema for vendor responses."""
    id: int
    status: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
