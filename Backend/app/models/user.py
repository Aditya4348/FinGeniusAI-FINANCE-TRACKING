import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    # Primary Key menggunakan UUID v4
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )

    # Kredensial & Autentikasi
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)

    # Profil Pengguna
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    job: Mapped[str | None] = mapped_column(String(100), nullable=True)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Preferensi Finansial (selaras dengan MobileApps)
    payday: Mapped[int] = mapped_column(Integer, default=25, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="IDR", nullable=False)
    balance_format: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False) # True: lengkap, False: sensor

    # Status & Timestamps
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

    # Relasi ke model lain (One-to-Many & One-to-One)
    wallets: Mapped[list["Wallet"]] = relationship("Wallet", back_populates="user", cascade="all, delete-orphan")
    transactions: Mapped[list["Transaction"]] = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    categories: Mapped[list["Category"]] = relationship("Category", back_populates="user", cascade="all, delete-orphan")
    budget_setting: Mapped["BudgetSetting | None"] = relationship("BudgetSetting", back_populates="user", uselist=False, cascade="all, delete-orphan")
    ai_mapping_rules: Mapped[list["AIMappingRule"]] = relationship("AIMappingRule", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} username={self.username}>"
