import bcrypt


def password_hash(password: str) -> str:
    """
    Fungsi untuk melakukan hashing password menggunakan bcrypt.
    """
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")