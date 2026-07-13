"""
Purchase Order service — CRUD operations for the PurchaseOrder model.
"""

import logging

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.purchase_order import PurchaseOrder
from app.models.vendor import Vendor
from app.schemas.purchase_order import PurchaseOrderCreate, PurchaseOrderUpdate

logger = logging.getLogger(__name__)


def get_purchase_orders(
    db: Session,
    skip: int = 0,
    limit: int = 100,
) -> list[PurchaseOrder]:
    """
    Retrieve a paginated list of purchase orders.

    Args:
        db: Database session.
        skip: Number of records to skip.
        limit: Maximum number of records to return.

    Returns:
        List of PurchaseOrder ORM instances.
    """
    return db.query(PurchaseOrder).offset(skip).limit(limit).all()


def get_purchase_order(db: Session, po_id: int) -> PurchaseOrder:
    """
    Retrieve a single purchase order by ID.

    Args:
        db: Database session.
        po_id: The purchase order's primary key.

    Returns:
        The PurchaseOrder ORM instance.

    Raises:
        HTTPException: 404 if the purchase order is not found.
    """
    po = db.query(PurchaseOrder).filter(PurchaseOrder.id == po_id).first()
    if po is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Purchase order with id {po_id} not found",
        )
    return po


def create_purchase_order(db: Session, po_in: PurchaseOrderCreate) -> PurchaseOrder:
    """
    Create a new purchase order.

    Args:
        db: Database session.
        po_in: Validated purchase order creation data.

    Returns:
        The newly created PurchaseOrder ORM instance.

    Raises:
        HTTPException: 404 if the referenced vendor does not exist.
        HTTPException: 409 if the order number already exists.
    """
    # Validate vendor exists
    vendor = db.query(Vendor).filter(Vendor.id == po_in.vendor_id).first()
    if vendor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vendor with id {po_in.vendor_id} not found",
        )

    # Check for duplicate order number
    existing = db.query(PurchaseOrder).filter(
        PurchaseOrder.order_number == po_in.order_number
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Purchase order with number '{po_in.order_number}' already exists",
        )

    db_po = PurchaseOrder(**po_in.model_dump())
    db.add(db_po)
    db.commit()
    db.refresh(db_po)
    logger.info("Created purchase order id=%s number='%s'", db_po.id, db_po.order_number)
    return db_po


def update_purchase_order(
    db: Session, po_id: int, po_in: PurchaseOrderUpdate
) -> PurchaseOrder:
    """
    Update an existing purchase order.

    Args:
        db: Database session.
        po_id: The purchase order's primary key.
        po_in: Validated purchase order update data (partial).

    Returns:
        The updated PurchaseOrder ORM instance.

    Raises:
        HTTPException: 404 if the purchase order is not found.
    """
    db_po = get_purchase_order(db, po_id)
    update_data = po_in.model_dump(exclude_unset=True)

    # If vendor_id is being updated, validate the new vendor exists
    if "vendor_id" in update_data:
        vendor = db.query(Vendor).filter(Vendor.id == update_data["vendor_id"]).first()
        if vendor is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Vendor with id {update_data['vendor_id']} not found",
            )

    for field, value in update_data.items():
        setattr(db_po, field, value)
    db.commit()
    db.refresh(db_po)
    logger.info("Updated purchase order id=%s", db_po.id)
    return db_po


def delete_purchase_order(db: Session, po_id: int) -> PurchaseOrder:
    """
    Delete a purchase order by ID.

    Args:
        db: Database session.
        po_id: The purchase order's primary key.

    Returns:
        The deleted PurchaseOrder ORM instance (before flush).

    Raises:
        HTTPException: 404 if the purchase order is not found.
    """
    db_po = get_purchase_order(db, po_id)
    db.delete(db_po)
    db.commit()
    logger.info("Deleted purchase order id=%s", po_id)
    return db_po
