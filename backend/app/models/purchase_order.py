"""
Purchase Order ORM model.

Defines the `purchase_orders` table schema. Business logic and CRUD
will be implemented in a later phase.
"""

from sqlalchemy import Column, Float, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class PurchaseOrder(Base):
    """Purchase order model."""

    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_number = Column(String(100), unique=True, nullable=False, index=True)
    vendor_id = Column(
        Integer, ForeignKey("vendors.id", ondelete="CASCADE"), nullable=False, index=True
    )
    total_amount = Column(Float, default=0.0, nullable=False)
    status = Column(String(50), default="draft", nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    vendor = relationship("Vendor", back_populates="purchase_orders")
    invoices = relationship("Invoice", back_populates="purchase_order")

    def __repr__(self) -> str:
        return f"<PurchaseOrder(id={self.id}, order_number='{self.order_number}')>"
