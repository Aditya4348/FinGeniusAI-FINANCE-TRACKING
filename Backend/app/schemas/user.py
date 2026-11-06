import re
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator, model_validator


class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100, description="Nama lengkap pengguna")
    username: str = Field(..., min_length=3, max_length=50, description="Username unik")
    phone: str | None = Field(None, max_length=30, description="Nomor telepon pengguna")
    job: str | None = Field(None, max_length=100, description="Bidang pekerjaan")
    payday: int = Field(25, ge=1, le=31, description="Tanggal siklus gajian (1-31)")
    currency: str = Field("IDR", max_length=10, description="Mata uang akun")
    balance_format: bool = Field(True, description="Format tampilan saldo (True: lengkap, False: sensor)")

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(r"^[a-z0-9_.-]+$", v):
            raise ValueError("Username hanya boleh mengandung huruf kecil, angka, titik (.), strip (-), atau underscore (_)")
        return v


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100, description="Kata sandi minimal 8 karakter")
    name: str = Field(..., min_length=2, max_length=100)
    username: str = Field(..., min_length=3, max_length=50)
    phone: str | None = None
    job: str | None = None
    payday: int = Field(25, ge=1, le=31)

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        v = v.strip().lower()
        if not re.match(r"^[a-z0-9_.-]+$", v):
            raise ValueError("Username hanya boleh mengandung huruf kecil, angka, titik, strip, atau underscore")
        return v


class UserLogin(BaseModel):
    identifier: str | None = Field(None, description="Email, username, atau nomor handphone")
    email: str | None = Field(None, description="Kompatibilitas input jika form mengirimkan key email")
    password: str = Field(..., min_length=1, description="Kata sandi pengguna")

    @model_validator(mode="after")
    def resolve_identifier(self) -> "UserLogin":
        target = self.identifier or self.email
        if not target or not target.strip():
            raise ValueError("Email, username, atau nomor telepon wajib diisi")
        self.identifier = target.strip()
        return self


class UserUpdateProfile(BaseModel):
    name: str | None = Field(None, min_length=2, max_length=100)
    username: str | None = Field(None, min_length=3, max_length=50)
    phone: str | None = None
    job: str | None = None
    payday: int | None = Field(None, ge=1, le=31)
    currency: str | None = None
    balance_format: bool | None = None
    avatar_url: str | None = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str | None) -> str | None:
        if v is not None:
            v = v.strip().lower()
            if not re.match(r"^[a-z0-9_.-]+$", v):
                raise ValueError("Username hanya boleh mengandung huruf kecil, angka, titik, strip, atau underscore")
        return v

class DeleteUserRequest(BaseModel):
    password: str = Field(..., min_length=8, max_length=100, description="Kata sandi pengguna untuk konfirmasi penghapusan akun")
    

class UserChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=100)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    name: str
    username: str
    phone: str | None = None
    job: str | None = None
    avatar_url: str | None = None
    payday: int
    currency: str
    balance_format: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenPayload(BaseModel):
    sub: str | None = None
    exp: int | None = None
