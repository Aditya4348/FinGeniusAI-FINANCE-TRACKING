from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.models.budget import BudgetSetting
from app.schemas.user import (
    DeleteUserRequest,
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
    UserUpdateProfile,
    UserChangePassword,
)


class AuthService:
    """Service Layer untuk seluruh logika autentikasi dan profil user."""

    @staticmethod
    def register(db: Session, user_in: UserRegister) -> User:
        # 1. Cek apakah email sudah terdaftar
        existing_email = db.query(User).filter(User.email == user_in.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email sudah terdaftar. Silakan gunakan email lain atau masuk.",
            )

        # 2. Cek apakah username sudah digunakan
        existing_username = db.query(User).filter(User.username == user_in.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username sudah digunakan. Silakan pilih username lain.",
            )

        # 3. Buat User baru dengan password terenkripsi bcrypt
        new_user = User(
            email=user_in.email,
            hashed_password=hash_password(user_in.password),
            name=user_in.name,
            username=user_in.username,
            phone=user_in.phone,
            job=user_in.job,
            payday=user_in.payday,
            currency="IDR",
            balance_format=True,
            is_active=True,
        )
        db.add(new_user)
        db.flush()

        # 4. Inisialisasi otomatis batas anggaran harian awal (Rp 100.000)
        default_budget = BudgetSetting(
            user_id=new_user.id,
            is_limit_enabled=True,
            daily_limit_amount=100000.00,
            warn_at_80=True,
            warn_at_100=True,
            strict_mode=False,
        )
        db.add(default_budget)

        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def login(db: Session, credentials: UserLogin) -> TokenResponse:
        # 1. Cari user secara fleksibel berdasarkan email, username, atau nomor telepon
        ident = (credentials.identifier or credentials.email or "").strip()
        clean_phone = ident.replace(" ", "").replace("-", "")

        user = db.query(User).filter(
            or_(
                User.email == ident.lower(),
                User.username == ident.lower(),
                User.phone == ident,
                User.phone == clean_phone,
            )
        ).first()

        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email, username, nomor HP, atau kata sandi tidak valid",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # 2. Pastikan akun berstatus aktif
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Akun pengguna ini sedang dinonaktifkan",
            )

        # 3. Buat JWT Access Token
        access_token = create_access_token(subject=user.id)

        # 4. Kembalikan token beserta informasi user profil
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )

    @staticmethod
    def update_profile(db: Session, user: User, profile_in: UserUpdateProfile) -> User:
        """Memperbarui informasi profil pengguna."""
        update_data = profile_in.model_dump(exclude_unset=True)

        if "username" in update_data and update_data["username"] != user.username:
            existing = db.query(User).filter(User.username == update_data["username"]).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username sudah digunakan oleh akun lain",
                )

        for field, value in update_data.items():
            setattr(user, field, value)

        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def change_password(db: Session, user: User, password_in: UserChangePassword) -> None:
        """Mengganti kata sandi pengguna."""
        if not verify_password(password_in.current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Kata sandi saat ini tidak cocok",
            )

        user.hashed_password = hash_password(password_in.new_password)
        db.commit()
        
    @staticmethod
    def delete_account(db: Session, user: User, payload: DeleteUserRequest) -> None:
        # Masukan password untuk konfirmasi penghapusan akun
        if not verify_password(payload.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Kata sandi tidak cocok. Tidak dapat menghapus akun.",
            )
        
        """Menghapus akun pengguna beserta data terkait."""
        db.delete(user)
        db.commit()