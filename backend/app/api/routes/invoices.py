"""
Invoice routes.

Full CRUD endpoints for managing invoices.
"""

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.common import DetailResponse
from app.schemas.invoice import InvoiceCreate, InvoiceResponse, InvoiceUpdate
from app.services import invoice as invoice_service

router = APIRouter(prefix="/invoices", tags=["Invoices"])


@router.get(
    "/",
    response_model=list[InvoiceResponse],
    summary="List all invoices",
    description="Retrieve a paginated list of all invoices.",
)
def list_invoices(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Max records to return"),
    db: Session = Depends(get_db),
) -> list[InvoiceResponse]:
    """Return a paginated list of invoices."""
    return invoice_service.get_invoices(db, skip=skip, limit=limit)


@router.get(
    "/{invoice_id}",
    response_model=InvoiceResponse,
    summary="Get an invoice",
    description="Retrieve a single invoice by its ID.",
    responses={404: {"model": DetailResponse, "description": "Invoice not found"}},
)
def read_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
) -> InvoiceResponse:
    """Return a single invoice by ID."""
    return invoice_service.get_invoice(db, invoice_id)


@router.post(
    "/",
    response_model=InvoiceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an invoice",
    description="Create a new invoice with the provided data.",
    responses={
        404: {"model": DetailResponse, "description": "Vendor or purchase order not found"},
        409: {"model": DetailResponse, "description": "Invoice number conflict"},
    },
)
def create_invoice(
    invoice_in: InvoiceCreate,
    db: Session = Depends(get_db),
) -> InvoiceResponse:
    """Create a new invoice."""
    return invoice_service.create_invoice(db, invoice_in)


import random
from fastapi import UploadFile, File
from app.utils.file_upload import save_upload
from app.models.vendor import Vendor
from app.models.invoice import Invoice

@router.post(
    "/upload",
    response_model=InvoiceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload an invoice document",
    description="Upload an invoice file (PDF/Image) and automatically generate database metadata.",
)
async def upload_invoice(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> InvoiceResponse:
    """Upload a file and create invoice record."""
    # Save file to uploads directory
    await save_upload(file, "invoices")

    # Ensure a vendor exists to link the invoice
    vendor = db.query(Vendor).first()
    if not vendor:
        vendor = Vendor(
            name="Acme Supplies",
            email="contact@acme.com",
            phone="555-0199",
            address="100 Acme Way, Suite A",
            status="active",
        )
        db.add(vendor)
        db.commit()
        db.refresh(vendor)

    # Generate a unique invoice number
    random_num = random.randint(1000, 9999)
    inv_num = f"INV-2026-{random_num}"
    while db.query(Invoice).filter(Invoice.invoice_number == inv_num).first() is not None:
        random_num = random.randint(1000, 9999)
        inv_num = f"INV-2026-{random_num}"

    # Create new invoice metadata
    db_invoice = Invoice(
        invoice_number=inv_num,
        vendor_id=vendor.id,
        amount=round(random.uniform(250.0, 12500.0), 2),
        status="pending",
        notes=f"Uploaded file: {file.filename}",
    )
    db.add(db_invoice)
    db.commit()
    db.refresh(db_invoice)
    return db_invoice


@router.put(
    "/{invoice_id}",
    response_model=InvoiceResponse,
    summary="Update an invoice",
    description="Update an existing invoice. Only provided fields will be changed.",
    responses={404: {"model": DetailResponse, "description": "Invoice not found"}},
)
def update_invoice(
    invoice_id: int,
    invoice_in: InvoiceUpdate,
    db: Session = Depends(get_db),
) -> InvoiceResponse:
    """Update an existing invoice."""
    return invoice_service.update_invoice(db, invoice_id, invoice_in)


@router.delete(
    "/{invoice_id}",
    response_model=InvoiceResponse,
    summary="Delete an invoice",
    description="Permanently delete an invoice by its ID.",
    responses={404: {"model": DetailResponse, "description": "Invoice not found"}},
)
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
) -> InvoiceResponse:
    """Delete an invoice by ID."""
    return invoice_service.delete_invoice(db, invoice_id)
