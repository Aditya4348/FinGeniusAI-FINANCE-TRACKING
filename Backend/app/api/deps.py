import uuid
from typing import Annotated, Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_token
from app.models.user import User
from app.schemas.user import TokenPayload

# Skema OAuth2 Password Bearer yang otomatis membaca header Authorization: Bearer <token>
# dan mengarahkan Swagger UI ke endpoint login jika token belum ada.
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login",
    description="Masukkan access token JWT dengan format: Bearer <token>",
)

# Type alias untuk mempermudah dependency injection sesi database
DbSession = Annotated[Session, Depends(get_db)]
TokenDep = Annotated[str, Depends(reusable_oauth2)]


def get_current_user(
    db: DbSession,
    token: TokenDep,
) -> User:
    """
    Dependency FastAPI untuk mengautentikasi pengguna:
    1. Mengekstrak dan memvalidasi token JWT dari header Authorization.
    2. Mengambil data user yang aktif dari database berdasarkan subject (user_id).
    3. Melempar HTTPException 401 jika token tidak valid/kadaluarsa atau user tidak ditemukan.
    4. Melempar HTTPException 400 jika user berstatus non-aktif.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Kredensial autentikasi tidak valid atau sudah kadaluarsa",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        token_payload: TokenPayload = verify_token(token)
        if not token_payload.sub:
            raise credentials_exception
        user_uuid = uuid.UUID(token_payload.sub)
    except (ValueError, AttributeError):
        raise credentials_exception

    user = db.query(User).filter(User.id == user_uuid).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pengguna tidak ditemukan",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Akun pengguna ini sedang tidak aktif",
        )

    return user


# Type alias praktis untuk digunakan di route handler, misal:
# @router.get("/me")
# def get_profile(current_user: CurrentUser): ...
CurrentUser = Annotated[User, Depends(get_current_user)]
