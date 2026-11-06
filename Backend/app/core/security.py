from datetime import datetime, timedelta, timezone
from typing import Any
import bcrypt
import jwt
from pydantic import BaseModel

from app.core.config import settings
from app.schemas.user import TokenPayload


def hash_password(password: str) -> str:
    """Melakukan hashing password menggunakan bcrypt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


# Alias untuk fleksibilitas penamaan
password_hash = hash_password


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Memverifikasi plain password dengan hashed password."""
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


def create_access_token(
    subject: str | Any,
    expires_delta: timedelta | None = None,
) -> str:
    """Membuat JWT access token dengan subject (user_id) dan expiration UTC."""
    issued_at = datetime.now(timezone.utc)

    if expires_delta:
        expire = issued_at + expires_delta
    else:
        expire = issued_at + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": str(subject),
        "iat": int(issued_at.timestamp()),
        "exp": int(expire.timestamp()),
    }

    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str) -> TokenPayload:
    """Memverifikasi dan mendecode JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        return TokenPayload(**payload)
    except jwt.PyJWTError:
        raise ValueError("Invalid or expired token")
