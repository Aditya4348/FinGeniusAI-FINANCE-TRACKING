from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from pydantic import BaseModel


# Definisi payload Token
class TokenPayload(BaseModel):
    user_id: str
    exp: int  # Expiration time in seconds since epoch
    iat: int  # Issued at time in seconds since epoch

# Helper untuk hashing password dengan bcrypt
def password_hash(password: str) -> str:
    """
    Fungsi untuk melakukan hashing password menggunakan bcrypt.
    """
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

# Helper untuk memverifikasi password yang di-hash
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Fungsi untuk memverifikasi password yang di-hash menggunakan bcrypt.
    """
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


# Helper untuk Membuat token akses (misalnya JWT) dan memverifikasinya
def create_access_token(
    user_id: str,
    secret_key: str,
    expires_delta_minutes: int = 15,
    algorithm: str = "HS256",
) -> str:
    """Create a JWT access token with UTC-based issue and expiration times."""
    if not user_id.strip():
        raise ValueError("user_id must not be empty")
    if not secret_key.strip():
        raise ValueError("secret_key must not be empty")
    if expires_delta_minutes <= 0:
        raise ValueError("expires_delta_minutes must be greater than zero")

    issued_at = datetime.now(timezone.utc)
    payload = TokenPayload(
        user_id=user_id,
        exp=int((issued_at + timedelta(minutes=expires_delta_minutes)).timestamp()),
        iat=int(issued_at.timestamp()),
    )

    return jwt.encode(payload.model_dump(), secret_key, algorithm=algorithm)
