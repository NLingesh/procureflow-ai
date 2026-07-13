"""
Dashboard routes.

Provides summary, revenue chart, and recent activity endpoints.
"""

from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.invoice import Invoice
from app.models.purchase_order import PurchaseOrder
from app.models.vendor import Vendor

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


class DashboardSummaryResponse(BaseModel):
    """Dashboard summary with entity counts and financial totals."""
    total_vendors: int
    total_purchase_orders: int
    total_invoices: int
    total_po_amount: float
    total_invoice_amount: float
    pending_invoices: int
    active_vendors_count: int
    pending_vendors_count: int
    inactive_vendors_count: int


class RevenueData(BaseModel):
    """Monthly revenue data item."""
    month: str
    revenue: float


class PurchaseVolumeData(BaseModel):
    """Monthly purchase orders volume item."""
    month: str
    orders: int


class ActivityResponse(BaseModel):
    """Recent activity item."""
    text: str
    time: str
    type: str  # 'invoice', 'po', 'vendor'


@router.get(
    "",
    response_model=DashboardSummaryResponse,
    summary="Dashboard summary overview",
)
def get_dashboard_summary(
    db: Session = Depends(get_db),
) -> DashboardSummaryResponse:
    """Return dashboard summary with counts and financial totals."""
    total_vendors = db.query(Vendor).count()
    total_purchase_orders = db.query(PurchaseOrder).count()
    total_invoices = db.query(Invoice).count()

    total_po_amount = (
        db.query(func.coalesce(func.sum(PurchaseOrder.total_amount), 0.0)).scalar()
    )
    total_invoice_amount = (
        db.query(func.coalesce(func.sum(Invoice.amount), 0.0)).scalar()
    )
    pending_invoices = (
        db.query(Invoice).filter(Invoice.status == "pending").count()
    )

    active_vendors_count = db.query(Vendor).filter(Vendor.status == "active").count()
    pending_vendors_count = db.query(Vendor).filter(Vendor.status == "pending").count()
    inactive_vendors_count = db.query(Vendor).filter(Vendor.status == "inactive").count()

    return DashboardSummaryResponse(
        total_vendors=total_vendors,
        total_purchase_orders=total_purchase_orders,
        total_invoices=total_invoices,
        total_po_amount=total_po_amount,
        total_invoice_amount=total_invoice_amount,
        pending_invoices=pending_invoices,
        active_vendors_count=active_vendors_count,
        pending_vendors_count=pending_vendors_count,
        inactive_vendors_count=inactive_vendors_count,
    )


@router.get(
    "/revenue",
    response_model=list[RevenueData],
    summary="Monthly revenue chart data",
)
def get_revenue_chart(
    db: Session = Depends(get_db),
) -> list[RevenueData]:
    """Retrieve monthly aggregated invoice amounts for the last 6 months."""
    invoices = db.query(Invoice).all()
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    monthly_totals = {m: 0.0 for m in months}

    for inv in invoices:
        if inv.created_at:
            m_name = inv.created_at.strftime("%b")
            if m_name in monthly_totals:
                monthly_totals[m_name] += inv.amount

    # Default list of months to show on chart
    active_months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    # We want to return a list of monthly revenue
    return [
        RevenueData(month=m, revenue=round(monthly_totals[m], 2))
        for m in active_months
    ]


@router.get(
    "/po-volume",
    response_model=list[PurchaseVolumeData],
    summary="Monthly purchase orders volume",
)
def get_po_volume(
    db: Session = Depends(get_db),
) -> list[PurchaseVolumeData]:
    """Retrieve monthly purchase order counts for the last 6 months."""
    pos = db.query(PurchaseOrder).all()
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    monthly_counts = {m: 0 for m in months}

    for po in pos:
        if po.created_at:
            m_name = po.created_at.strftime("%b")
            if m_name in monthly_counts:
                monthly_counts[m_name] += 1

    active_months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return [
        PurchaseVolumeData(month=m, orders=monthly_counts[m])
        for m in active_months
    ]


@router.get(
    "/activity",
    response_model=list[ActivityResponse],
    summary="Recent activities feed",
)
def get_recent_activity(
    db: Session = Depends(get_db),
) -> list[ActivityResponse]:
    """Return a combined feed of recent vendors, POs, and invoices."""
    activities = []

    # Get last 5 vendors
    vendors = db.query(Vendor).order_by(Vendor.created_at.desc()).limit(5).all()
    for v in vendors:
        activities.append({
            "text": f"New vendor '{v.name}' registered",
            "time": v.created_at.strftime("%Y-%m-%d %H:%M") if v.created_at else "Just now",
            "type": "vendor",
            "dt": v.created_at
        })

    # Get last 5 POs
    pos = db.query(PurchaseOrder).order_by(PurchaseOrder.created_at.desc()).limit(5).all()
    for po in pos:
        activities.append({
            "text": f"Purchase Order {po.order_number} submitted for review ({po.status})",
            "time": po.created_at.strftime("%Y-%m-%d %H:%M") if po.created_at else "Just now",
            "type": "po",
            "dt": po.created_at
        })

    # Get last 5 Invoices
    invoices = db.query(Invoice).order_by(Invoice.created_at.desc()).limit(5).all()
    for inv in invoices:
        activities.append({
            "text": f"Invoice {inv.invoice_number} processed with status '{inv.status}'",
            "time": inv.created_at.strftime("%Y-%m-%d %H:%M") if inv.created_at else "Just now",
            "type": "invoice",
            "dt": inv.created_at
        })

    # Sort activities by datetime desc
    activities.sort(key=lambda x: x["dt"] if x["dt"] else datetime.min, reverse=True)

    return [
        ActivityResponse(text=a["text"], time=a["time"], type=a["type"])
        for a in activities[:10]
    ]
