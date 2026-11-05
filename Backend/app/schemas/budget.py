from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict


BudgetStatus = Literal["safe", "warning", "overbudget"]


class BudgetSettingBase(BaseModel):
    is_limit_enabled: bool = Field(True, description="Status aktif batas anggaran harian")
    daily_limit_amount: Decimal = Field(Decimal("100000.00"), ge=Decimal("0.00"), description="Batas pengeluaran harian")
    warn_at_80: bool = Field(True, description="Notifikasi saat pengeluaran mencapai 80%")
    warn_at_100: bool = Field(True, description="Notifikasi saat pengeluaran mencapai 100%")
    strict_mode: bool = Field(False, description="Mode ketat (mencegah transaksi jika overbudget)")


class BudgetSettingUpdate(BaseModel):
    is_limit_enabled: bool | None = None
    daily_limit_amount: Decimal | None = Field(None, ge=Decimal("0.00"))
    warn_at_80: bool | None = None
    warn_at_100: bool | None = None
    strict_mode: bool | None = None


class BudgetSettingResponse(BudgetSettingBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime


class DailyBudgetStatusResponse(BaseModel):
    is_limit_enabled: bool
    daily_limit: Decimal
    spent_today: Decimal
    remaining_today: Decimal
    percentage_used: float = Field(..., ge=0.0, description="Persentase pemakaian hari ini (0-100+)")
    status: BudgetStatus = Field("safe", description="Status keamanan: safe (hijau), warning (kuning), overbudget (merah)")
    days_until_next_payday: int = Field(..., ge=0, description="Jumlah hari tersisa menuju gajian berikutnya")
    recommended_daily_budget: Decimal | None = Field(None, description="Saran jatah harian dinamis berdasarkan sisa aset")
