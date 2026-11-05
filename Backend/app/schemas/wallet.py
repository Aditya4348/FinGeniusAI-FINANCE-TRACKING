from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict


WalletType = Literal["Bank", "E-Wallet", "Cash", "Investment", "Other"]


class WalletBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Nama dompet/rekening, misal: BCA Utama")
    type: WalletType = Field("Bank", description="Tipe rekening: Bank, E-Wallet, Cash, dll")
    account_number: str | None = Field(None, max_length=50, description="Nomor rekening atau nomor HP")
    icon: str = Field("credit-card", max_length=50, description="Ikon dompet untuk UI")
    color_primary: str = Field("#005AAA", max_length=20, description="Warna gradient primer")
    color_secondary: str = Field("#003B73", max_length=20, description="Warna gradient sekunder")


class WalletCreate(WalletBase):
    balance: Decimal = Field(Decimal("0.00"), ge=Decimal("0.00"), description="Saldo awal dompet")


class WalletUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    type: WalletType | None = None
    account_number: str | None = None
    icon: str | None = None
    color_primary: str | None = None
    color_secondary: str | None = None
    is_active: bool | None = None


class WalletTopUp(BaseModel):
    amount: Decimal = Field(..., gt=Decimal("0.00"), description="Nominal top up (harus lebih besar dari 0)")
    note: str | None = Field(None, max_length=255, description="Catatan top-up")


class WalletTransfer(BaseModel):
    from_wallet_id: UUID = Field(..., description="ID dompet asal")
    to_wallet_id: UUID = Field(..., description="ID dompet tujuan")
    amount: Decimal = Field(..., gt=Decimal("0.00"), description="Nominal transfer")
    note: str | None = Field(None, max_length=255, description="Catatan transfer")


class WalletResponse(WalletBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    balance: Decimal
    is_active: bool
    created_at: datetime
    updated_at: datetime


class WalletSummaryResponse(BaseModel):
    total_balance: Decimal
    total_wallets: int
    wallets: list[WalletResponse]
