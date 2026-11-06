from fastapi import APIRouter, status

from app.api.deps import DbSession, CurrentUser
from app.core.security import create_access_token
from app.schemas.user import (
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
    UserUpdateProfile,
    UserChangePassword,
)
from app.service.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentikasi"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Daftar akun baru",
)
def register(payload: UserRegister, db: DbSession):
    """
    Endpoint untuk mendaftar akun pengguna baru:
    - Memvalidasi keunikan email dan username.
    - Mengenkripsi password dengan bcrypt.
    - Menginisialisasi pengaturan batas harian default.
    - Mengembalikan JWT token dan data profil (langsung login).
    """
    new_user = AuthService.register(db, payload)
    access_token = create_access_token(subject=new_user.id)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login ke akun",
)
def login(payload: UserLogin, db: DbSession):
    """
    Endpoint untuk login ke akun pengguna:
    - **email**: Email terdaftar.
    - **password**: Kata sandi pengguna.

    Mengembalikan JWT access token dan informasi profil pengguna jika berhasil.
    """
    return AuthService.login(db, payload)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Ambil data profil pengguna yang sedang login",
)
def get_current_user_profile(current_user: CurrentUser):
    """
    Mengambil data profil pengguna aktif yang terotentikasi melalui header:
    `Authorization: Bearer <token>`
    """
    return current_user


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Perbarui data profil pengguna",
)
def update_profile(
    payload: UserUpdateProfile,
    current_user: CurrentUser,
    db: DbSession,
):
    """
    Memperbarui informasi profil pengguna yang sedang login (nama, pekerjaan, payday, avatar, dll).
    """
    return AuthService.update_profile(db, current_user, payload)


@router.put(
    "/change-password",
    summary="Ganti kata sandi pengguna",
)
def change_password(
    payload: UserChangePassword,
    current_user: CurrentUser,
    db: DbSession,
):
    """
    Mengubah kata sandi pengguna dengan memverifikasi kata sandi lama terlebih dahulu.
    """
    AuthService.change_password(db, current_user, payload)
    return {"message": "Kata sandi berhasil diperbarui"}
