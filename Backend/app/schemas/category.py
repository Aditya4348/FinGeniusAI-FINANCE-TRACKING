from uuid import UUID
from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field, ConfigDict


CategoryType = Literal["expense", "income"]


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Nama kategori, misal: Makanan & Minuman")
    type: CategoryType = Field(..., description="Tipe kategori: expense (pengeluaran) atau income (pemasukan)")
    icon: str = Field("coffee", max_length=50, description="Nama icon (Feather/Ionicons)")
    color: str = Field("#F59E0B", max_length=20, description="Kode warna hex ikon")
    bg_color: str = Field("#FFFBEB", max_length=20, description="Kode warna hex latar badge")


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    icon: str | None = None
    color: str | None = None
    bg_color: str | None = None


class CategoryResponse(CategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID | None = None
    is_locked: bool = False
    created_at: datetime
    updated_at: datetime

    @property
    def is_system_default(self) -> bool:
        return self.user_id is None
