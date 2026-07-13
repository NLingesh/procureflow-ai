"""
Central API router.

Aggregates all route modules under the `/api` prefix.
New route modules should be registered here.
"""

from fastapi import APIRouter

from app.api.routes import (
    auth,
    vendors,
    purchase_orders,
    invoices,
    dashboard,
    analytics,
)

# ---------------------------------------------------------------------------
# Main API Router
# ---------------------------------------------------------------------------

api_router = APIRouter(prefix="/api")

# Register all sub-routers
api_router.include_router(auth.router)
api_router.include_router(vendors.router)
api_router.include_router(purchase_orders.router)
api_router.include_router(invoices.router)
api_router.include_router(dashboard.router)
api_router.include_router(analytics.router)
