"""
Vendor management routes.

Full CRUD endpoints for managing vendors / suppliers.
"""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.common import DetailResponse
from app.schemas.vendor import VendorCreate, VendorResponse, VendorUpdate
from app.services import vendor as vendor_service

router = APIRouter(prefix="/vendors", tags=["Vendors"])


@router.get(
    "/",
    response_model=list[VendorResponse],
    summary="List all vendors",
    description="Retrieve a paginated list of all vendors.",
)
def list_vendors(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Max records to return"),
    db: Session = Depends(get_db),
) -> list[VendorResponse]:
    """Return a paginated list of vendors."""
    return vendor_service.get_vendors(db, skip=skip, limit=limit)


@router.get(
    "/{vendor_id}",
    response_model=VendorResponse,
    summary="Get a vendor",
    description="Retrieve a single vendor by its ID.",
    responses={404: {"model": DetailResponse, "description": "Vendor not found"}},
)
def read_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
) -> VendorResponse:
    """Return a single vendor by ID."""
    return vendor_service.get_vendor(db, vendor_id)


@router.post(
    "/",
    response_model=VendorResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a vendor",
    description="Create a new vendor with the provided data.",
    responses={409: {"model": DetailResponse, "description": "Email conflict"}},
)
def create_vendor(
    vendor_in: VendorCreate,
    db: Session = Depends(get_db),
) -> VendorResponse:
    """Create a new vendor."""
    return vendor_service.create_vendor(db, vendor_in)


@router.put(
    "/{vendor_id}",
    response_model=VendorResponse,
    summary="Update a vendor",
    description="Update an existing vendor. Only provided fields will be changed.",
    responses={404: {"model": DetailResponse, "description": "Vendor not found"}},
)
def update_vendor(
    vendor_id: int,
    vendor_in: VendorUpdate,
    db: Session = Depends(get_db),
) -> VendorResponse:
    """Update an existing vendor."""
    return vendor_service.update_vendor(db, vendor_id, vendor_in)


@router.delete(
    "/{vendor_id}",
    response_model=VendorResponse,
    summary="Delete a vendor",
    description="Permanently delete a vendor by its ID.",
    responses={404: {"model": DetailResponse, "description": "Vendor not found"}},
)
def delete_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
) -> VendorResponse:
    """Delete a vendor by ID."""
    return vendor_service.delete_vendor(db, vendor_id)
