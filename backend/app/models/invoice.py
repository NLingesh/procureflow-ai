"""
Invoice ORM model.

Defines the `invoices` table schema. Business logic and CRUD
will be implemented in a later phase.
"""

from sqlalchemy import Column, Float, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Invoice(Base):
    """Invoice model."""

    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    invoice_number = Column(String(100), unique=True, nullable=False, index=True)
    vendor_id = Column(
        Integer, ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False, index=True
    )
    purchase_order_id = Column(
        Integer, ForeignKey("purchase_orders.id", ondelete="SET NULL"), nullable=True, index=True
    )
    amount = Column(Float, default=0.0, nullable=False)
    status = Column(String(50), default="pending", nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    vendor = relationship("Vendor", back_populates="invoices")
    purchase_order = relationship("PurchaseOrder", back_populates="invoices")

    def __repr__(self) -> str:
        return f"<Invoice(id={self.id}, invoice_number='{self.invoice_number}')>"
