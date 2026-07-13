"""
Vendor service — CRUD operations for the Vendor model.
"""

import logging

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.vendor import Vendor
from app.schemas.vendor import VendorCreate, VendorUpdate

logger = logging.getLogger(__name__)


def get_vendors(
    db: Session,
    skip: int = 0,
    limit: int = 100,
) -> list[Vendor]:
    """
    Retrieve a paginated list of vendors.

    Args:
        db: Database session.
        skip: Number of records to skip.
        limit: Maximum number of records to return.

    Returns:
        List of Vendor ORM instances.
    """
    return db.query(Vendor).offset(skip).limit(limit).all()


def get_vendor(db: Session, vendor_id: int) -> Vendor:
    """
    Retrieve a single vendor by ID.

    Args:
        db: Database session.
        vendor_id: The vendor's primary key.

    Returns:
        The Vendor ORM instance.

    Raises:
        HTTPException: 404 if the vendor is not found.
    """
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if vendor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vendor with id {vendor_id} not found",
        )
    return vendor


def create_vendor(db: Session, vendor_in: VendorCreate) -> Vendor:
    """
    Create a new vendor.

    Args:
        db: Database session.
        vendor_in: Validated vendor creation data.

    Returns:
        The newly created Vendor ORM instance.

    Raises:
        HTTPException: 409 if a vendor with the same email already exists.
    """
    if vendor_in.email:
        existing = db.query(Vendor).filter(Vendor.email == vendor_in.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Vendor with email '{vendor_in.email}' already exists",
            )

    db_vendor = Vendor(**vendor_in.model_dump())
    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)
    logger.info("Created vendor id=%s name='%s'", db_vendor.id, db_vendor.name)
    return db_vendor


def update_vendor(db: Session, vendor_id: int, vendor_in: VendorUpdate) -> Vendor:
    """
    Update an existing vendor.

    Args:
        db: Database session.
        vendor_id: The vendor's primary key.
        vendor_in: Validated vendor update data (partial).

    Returns:
        The updated Vendor ORM instance.

    Raises:
        HTTPException: 404 if the vendor is not found.
    """
    db_vendor = get_vendor(db, vendor_id)
    update_data = vendor_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_vendor, field, value)
    db.commit()
    db.refresh(db_vendor)
    logger.info("Updated vendor id=%s", db_vendor.id)
    return db_vendor


def delete_vendor(db: Session, vendor_id: int) -> Vendor:
    """
    Delete a vendor by ID.

    Args:
        db: Database session.
        vendor_id: The vendor's primary key.

    Returns:
        The deleted Vendor ORM instance (before flush).

    Raises:
        HTTPException: 404 if the vendor is not found.
    """
    db_vendor = get_vendor(db, vendor_id)
    db.delete(db_vendor)
    db.commit()
    logger.info("Deleted vendor id=%s", vendor_id)
    return db_vendor
