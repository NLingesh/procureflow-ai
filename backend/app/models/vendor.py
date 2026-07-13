"""
Vendor ORM model.

Defines the `vendors` table schema. Business logic and CRUD will be
implemented in a later phase.
"""

from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Vendor(Base):
    """Vendor / supplier model."""

    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    status = Column(String(50), default="active", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships
    purchase_orders = relationship("PurchaseOrder", back_populates="vendor", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="vendor", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Vendor(id={self.id}, name='{self.name}')>"
