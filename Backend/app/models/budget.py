import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Boolean, Numeric, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class BudgetSetting(Base):
    __tablename__ = "budget_settings"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        unique=True, 
        nullable=False, 
        index=True
    )

    is_limit_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    daily_limit_amount: Mapped[Decimal] = mapped_column(Numeric(15, 2), default=Decimal("100000.00"), nullable=False)
    warn_at_80: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    warn_at_100: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    strict_mode: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

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

    # Relasi (One-to-One dengan User)
    user: Mapped["User"] = relationship("User", back_populates="budget_setting")

    def __repr__(self) -> str:
        return f"<BudgetSetting id={self.id} user_id={self.user_id} daily_limit={self.daily_limit_amount}>"
