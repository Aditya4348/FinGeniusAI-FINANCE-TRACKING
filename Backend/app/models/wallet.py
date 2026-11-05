import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Boolean, Numeric, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Wallet(Base):
    __tablename__ = "wallets"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False, 
        index=True
    )

    # Identitas Dompet / Rekening
    name: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "BCA Utama", "Bank Jago", "GoPay", "Tunai"
    type: Mapped[str] = mapped_column(String(50), default="Bank", nullable=False) # Bank, E-Wallet, Cash
    balance: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("0.00"), nullable=False)
    account_number: Mapped[str | None] = mapped_column(String(50), nullable=True) # e.g. "**** 8821"

    # Styling UI (MobileApps)
    icon: Mapped[str] = mapped_column(String(50), default="credit-card", nullable=False)
    color_primary: Mapped[str] = mapped_column(String(20), default="#005AAA", nullable=False)
    color_secondary: Mapped[str] = mapped_column(String(20), default="#003B73", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now(), 
        nullable=False
    )

    # Relasi
    user: Mapped["User"] = relationship("User", back_populates="wallets")
    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", 
        back_populates="wallet", 
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Wallet id={self.id} name={self.name} balance={self.balance}>"
