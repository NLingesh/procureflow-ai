"""
Purchase order routes.

Full CRUD endpoints for managing purchase orders.
"""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.common import DetailResponse
from app.schemas.purchase_order import (
    PurchaseOrderCreate,
    PurchaseOrderResponse,
    PurchaseOrderUpdate,
)
from app.services import purchase_order as po_service

router = APIRouter(prefix="/purchase-orders", tags=["Purchase Orders"])


@router.get(
    "/",
    response_model=list[PurchaseOrderResponse],
    summary="List all purchase orders",
    description="Retrieve a paginated list of all purchase orders.",
)
def list_purchase_orders(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Max records to return"),
    db: Session = Depends(get_db),
) -> list[PurchaseOrderResponse]:
    """Return a paginated list of purchase orders."""
    return po_service.get_purchase_orders(db, skip=skip, limit=limit)


@router.get(
    "/{po_id}",
    response_model=PurchaseOrderResponse,
    summary="Get a purchase order",
    description="Retrieve a single purchase order by its ID.",
    responses={404: {"model": DetailResponse, "description": "Purchase order not found"}},
)
def read_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
) -> PurchaseOrderResponse:
    """Return a single purchase order by ID."""
    return po_service.get_purchase_order(db, po_id)


@router.post(
    "/",
    response_model=PurchaseOrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a purchase order",
    description="Create a new purchase order with the provided data.",
    responses={
        404: {"model": DetailResponse, "description": "Vendor not found"},
        409: {"model": DetailResponse, "description": "Order number conflict"},
    },
)
def create_purchase_order(
    po_in: PurchaseOrderCreate,
    db: Session = Depends(get_db),
) -> PurchaseOrderResponse:
    """Create a new purchase order."""
    return po_service.create_purchase_order(db, po_in)


@router.put(
    "/{po_id}",
    response_model=PurchaseOrderResponse,
    summary="Update a purchase order",
    description="Update an existing purchase order. Only provided fields will be changed.",
    responses={404: {"model": DetailResponse, "description": "Purchase order not found"}},
)
def update_purchase_order(
    po_id: int,
    po_in: PurchaseOrderUpdate,
    db: Session = Depends(get_db),
) -> PurchaseOrderResponse:
    """Update an existing purchase order."""
    return po_service.update_purchase_order(db, po_id, po_in)


@router.delete(
    "/{po_id}",
    response_model=PurchaseOrderResponse,
    summary="Delete a purchase order",
    description="Permanently delete a purchase order by its ID.",
    responses={404: {"model": DetailResponse, "description": "Purchase order not found"}},
)
def delete_purchase_order(
    po_id: int,
    db: Session = Depends(get_db),
) -> PurchaseOrderResponse:
    """Delete a purchase order by ID."""
    return po_service.delete_purchase_order(db, po_id)
