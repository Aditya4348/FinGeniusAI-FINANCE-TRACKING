from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict


TransactionType = Literal["expense", "income", "transfer"]
TransactionSource = Literal["manual", "ai_scan", "voice"]


class TransactionBase(BaseModel):
    amount: Decimal = Field(..., gt=Decimal("0.00"), description="Nominal transaksi uang")
    type: TransactionType = Field("expense", description="Tipe transaksi: expense, income, transfer")
    title: str = Field(..., min_length=1, max_length=255, description="Judul / nama transaksi")
    note: str | None = Field(None, max_length=500, description="Catatan detail tambahan")
    transaction_date: datetime | None = Field(None, description="Waktu transaksi dilakukan (default: sekarang)")
    source: TransactionSource = Field("manual", description="Sumber pencatatan: manual, ai_scan, voice")


class TransactionCreate(TransactionBase):
    wallet_id: UUID = Field(..., description="ID dompet yang digunakan")
    category_id: UUID | None = Field(None, description="ID kategori (opsional untuk transfer)")


class TransactionUpdate(BaseModel):
    wallet_id: UUID | None = None
    category_id: UUID | None = None
    amount: Decimal | None = Field(None, gt=Decimal("0.00"))
    type: TransactionType | None = None
    title: str | None = Field(None, min_length=1, max_length=255)
    note: str | None = None
    transaction_date: datetime | None = None


class TransactionResponse(TransactionBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    wallet_id: UUID
    category_id: UUID | None = None
    transaction_date: datetime
    created_at: datetime
    updated_at: datetime

    # Informasi display tambahan untuk mempermudah render UI Mobile
    wallet_name: str | None = None
    category_name: str | None = None
    category_icon: str | None = None
    category_color: str | None = None
    category_bg: str | None = None


class TransactionFilter(BaseModel):
    start_date: datetime | None = None
    end_date: datetime | None = None
    type: TransactionType | None = None
    wallet_id: UUID | None = None
    category_id: UUID | None = None
    limit: int = Field(50, ge=1, le=100)
    offset: int = Field(0, ge=0)


class TransactionSummaryResponse(BaseModel):
    total_income: Decimal
    total_expense: Decimal
    net_cash_flow: Decimal
    transaction_count: int
    period_start: datetime | None = None
    period_end: datetime | None = None
