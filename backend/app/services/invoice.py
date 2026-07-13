"""
Invoice service — CRUD operations for the Invoice model.
"""

import logging

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.invoice import Invoice
from app.models.purchase_order import PurchaseOrder
from app.models.vendor import Vendor
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate

logger = logging.getLogger(__name__)


def get_invoices(
    db: Session,
    skip: int = 0,
    limit: int = 100,
) -> list[Invoice]:
    """
    Retrieve a paginated list of invoices.

    Args:
        db: Database session.
        skip: Number of records to skip.
        limit: Maximum number of records to return.

    Returns:
        List of Invoice ORM instances.
    """
    return db.query(Invoice).offset(skip).limit(limit).all()


def get_invoice(db: Session, invoice_id: int) -> Invoice:
    """
    Retrieve a single invoice by ID.

    Args:
        db: Database session.
        invoice_id: The invoice's primary key.

    Returns:
        The Invoice ORM instance.

    Raises:
        HTTPException: 404 if the invoice is not found.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if invoice is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Invoice with id {invoice_id} not found",
        )
    return invoice


def create_invoice(db: Session, invoice_in: InvoiceCreate) -> Invoice:
    """
    Create a new invoice.

    Args:
        db: Database session.
        invoice_in: Validated invoice creation data.

    Returns:
        The newly created Invoice ORM instance.

    Raises:
        HTTPException: 404 if the referenced vendor or purchase order does not exist.
        HTTPException: 409 if the invoice number already exists.
    """
    # Validate vendor exists
    vendor = db.query(Vendor).filter(Vendor.id == invoice_in.vendor_id).first()
    if vendor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vendor with id {invoice_in.vendor_id} not found",
        )

    # Validate purchase order exists (if provided)
    if invoice_in.purchase_order_id:
        po = db.query(PurchaseOrder).filter(
            PurchaseOrder.id == invoice_in.purchase_order_id
        ).first()
        if po is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Purchase order with id {invoice_in.purchase_order_id} not found",
            )

    # Check for duplicate invoice number
    existing = db.query(Invoice).filter(
        Invoice.invoice_number == invoice_in.invoice_number
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Invoice with number '{invoice_in.invoice_number}' already exists",
        )

    db_invoice = Invoice(**invoice_in.model_dump())
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    logger.info("Created invoice id=%s number='%s'", db_invoice.id, db_invoice.invoice_number)
    return db_invoice


def update_invoice(
    db: Session, invoice_id: int, invoice_in: InvoiceUpdate
) -> Invoice:
    """
    Update an existing invoice.

    Args:
        db: Database session.
        invoice_id: The invoice's primary key.
        invoice_in: Validated invoice update data (partial).

    Returns:
        The updated Invoice ORM instance.

    Raises:
        HTTPException: 404 if the invoice is not found.
    """
    db_invoice = get_invoice(db, invoice_id)
    update_data = invoice_in.model_dump(exclude_unset=True)

    # If vendor_id is being updated, validate the new vendor exists
    if "vendor_id" in update_data:
        vendor = db.query(Vendor).filter(Vendor.id == update_data["vendor_id"]).first()
        if vendor is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Vendor with id {update_data['vendor_id']} not found",
            )

    for field, value in update_data.items():
        setattr(db_invoice, field, value)
    db.commit()
    db.refresh(db_invoice)
    logger.info("Updated invoice id=%s", db_invoice.id)
    return db_invoice


def delete_invoice(db: Session, invoice_id: int) -> Invoice:
    """
    Delete an invoice by ID.

    Args:
        db: Database session.
        invoice_id: The invoice's primary key.

    Returns:
        The deleted Invoice ORM instance (before flush).

    Raises:
        HTTPException: 404 if the invoice is not found.
    """
    db_invoice = get_invoice(db, invoice_id)
    db.delete(db_invoice)
    db.commit()
    logger.info("Deleted invoice id=%s", invoice_id)
    return db_invoice
