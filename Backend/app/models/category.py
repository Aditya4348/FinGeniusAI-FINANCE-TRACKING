import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    # user_id bernilai NULL jika ini adalah kategori default sistem
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=True, 
        index=True
    )

    name: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. "Makanan & Minuman"
    type: Mapped[str] = mapped_column(String(20), nullable=False) # expense / income
    icon: Mapped[str] = mapped_column(String(50), default="coffee", nullable=False)
    color: Mapped[str] = mapped_column(String(20), default="#F59E0B", nullable=False)
    bg_color: Mapped[str] = mapped_column(String(20), default="#FFFBEB", nullable=False)
    is_locked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False) # True jika tidak boleh dihapus

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
    user: Mapped["User | None"] = relationship("User", back_populates="categories")
    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", 
        back_populates="category"
    )
    mapping_rules: Mapped[list["AIMappingRule"]] = relationship(
        "AIMappingRule", 
        back_populates="category", 
        cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Category id={self.id} name={self.name} type={self.type}>"
