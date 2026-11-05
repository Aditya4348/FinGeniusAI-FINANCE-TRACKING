import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class AIMappingRule(Base):
    __tablename__ = "ai_mapping_rules"

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
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("categories.id", ondelete="CASCADE"), 
        nullable=False, 
        index=True
    )

    keyword: Mapped[str] = mapped_column(String(100), nullable=False, index=True) # e.g. "kopi", "indomaret", "starbucks"
    type: Mapped[str] = mapped_column(String(20), default="expense", nullable=False) # expense / income

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
    user: Mapped["User"] = relationship("User", back_populates="ai_mapping_rules")
    category: Mapped["Category"] = relationship("Category", back_populates="mapping_rules")

    def __repr__(self) -> str:
        return f"<AIMappingRule id={self.id} keyword={self.keyword} category_id={self.category_id}>"
