"""
Analytics routes.

AI-powered analytics endpoints for procurement insights.
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.invoice import Invoice
from app.models.purchase_order import PurchaseOrder

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# ---------------------------------------------------------------------------
# Response Schemas (analytics-specific)
# ---------------------------------------------------------------------------

class SpendingAnalyticsResponse(BaseModel):
    """Spending analytics summary."""
    total_po_spending: float
    total_invoice_spending: float
    average_po_amount: float
    average_invoice_amount: float
    orders_by_status: dict[str, int]
    invoices_by_status: dict[str, int]


class PlaceholderResponse(BaseModel):
    """Placeholder for future analytics features."""
    message: str


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get(
    "/spending",
    response_model=SpendingAnalyticsResponse,
    summary="Spending analytics",
    description="Returns spending summary across purchase orders and invoices, grouped by status.",
)
def get_spending_analytics(
    db: Session = Depends(get_db),
) -> SpendingAnalyticsResponse:
    """Return spending analytics from POs and invoices."""
    total_po = db.query(func.coalesce(func.sum(PurchaseOrder.total_amount), 0.0)).scalar()
    total_inv = db.query(func.coalesce(func.sum(Invoice.amount), 0.0)).scalar()
    avg_po = db.query(func.coalesce(func.avg(PurchaseOrder.total_amount), 0.0)).scalar()
    avg_inv = db.query(func.coalesce(func.avg(Invoice.amount), 0.0)).scalar()

    # Group by status
    po_status_rows = (
        db.query(PurchaseOrder.status, func.count(PurchaseOrder.id))
        .group_by(PurchaseOrder.status)
        .all()
    )
    inv_status_rows = (
        db.query(Invoice.status, func.count(Invoice.id))
        .group_by(Invoice.status)
        .all()
    )

    return SpendingAnalyticsResponse(
        total_po_spending=total_po,
        total_invoice_spending=total_inv,
        average_po_amount=round(avg_po, 2),
        average_invoice_amount=round(avg_inv, 2),
        orders_by_status={row[0]: row[1] for row in po_status_rows},
        invoices_by_status={row[0]: row[1] for row in inv_status_rows},
    )


@router.get(
    "/vendor-performance",
    response_model=PlaceholderResponse,
    summary="Vendor performance",
    description="Vendor performance analytics. Will be expanded in a future phase.",
)
def get_vendor_performance() -> PlaceholderResponse:
    """Return vendor performance placeholder."""
    return PlaceholderResponse(
        message="Vendor performance analytics will be available in a future release."
    )


@router.get(
    "/ai-insights",
    response_model=PlaceholderResponse,
    summary="AI insights",
    description="AI-driven procurement insights. Will be expanded in a future phase.",
)
def get_ai_insights() -> PlaceholderResponse:
    """Return AI insights placeholder."""
    return PlaceholderResponse(
        message="AI-driven insights will be available in a future release."
    )
