from uuid import UUID
from datetime import datetime
from decimal import Decimal
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict


class AITextParseRequest(BaseModel):
    text: str = Field(
        ..., 
        min_length=2, 
        max_length=500, 
        description="Teks natural pencatatan, contoh: 'Beli kopi di starbucks 45rb pake gopay'"
    )


class AITextParseResponse(BaseModel):
    title: str = Field(..., description="Judul/nama pengeluaran yang diekstrak")
    amount: Decimal = Field(..., description="Nominal uang yang terdeteksi")
    type: Literal["expense", "income"] = Field("expense", description="Tipe transaksi")
    suggested_category_id: UUID | None = None
    suggested_category_name: str | None = None
    suggested_wallet_id: UUID | None = None
    suggested_wallet_name: str | None = None
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Tingkat akurasi prediksi AI (0-1)")


class ReceiptItem(BaseModel):
    name: str = Field(..., description="Nama item belanja pada struk")
    quantity: int = Field(1, ge=1, description="Jumlah barang")
    price: Decimal = Field(..., description="Harga total per baris item")


class AIReceiptScanResponse(BaseModel):
    merchant_name: str | None = Field(None, description="Nama toko / merchant (contoh: Indomaret, Alfamart)")
    total_amount: Decimal = Field(..., description="Total nominal belanja pada nota")
    transaction_date: datetime | None = Field(None, description="Tanggal transaksi yang tertera pada nota")
    items: list[ReceiptItem] = Field(default_factory=list, description="Daftar rincian belanja")
    suggested_category_id: UUID | None = None
    suggested_category_name: str | None = None
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    raw_text: str | None = Field(None, description="Teks hasil OCR mentah (opsional)")


class AIMappingRuleBase(BaseModel):
    keyword: str = Field(..., min_length=1, max_length=100, description="Kata kunci, misal: kopi, indomaret, bensin")
    category_id: UUID = Field(..., description="ID kategori target pemetaan")
    type: Literal["expense", "income"] = Field("expense", description="Tipe kategori")


class AIMappingRuleCreate(AIMappingRuleBase):
    pass


class AIMappingRuleUpdate(BaseModel):
    keyword: str | None = Field(None, min_length=1, max_length=100)
    category_id: UUID | None = None
    type: Literal["expense", "income"] | None = None


class AIMappingRuleResponse(AIMappingRuleBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    category_name: str | None = None
    category_icon: str | None = None
    category_color: str | None = None
    created_at: datetime
    updated_at: datetime
