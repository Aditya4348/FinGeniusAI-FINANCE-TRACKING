import os
from dotenv import load_dotenv
from app.core.config import settings
from sqlalchemy import URL, create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    required_settings = ("DB_USER", "DB_PASSWORD", "DB_HOST", "DB_NAME")
    missing_settings = [name for name in required_settings if os.getenv(name) is None]
    if missing_settings:
        raise ValueError(
            "Database configuration is incomplete. Set DATABASE_URL or provide: "
            + ", ".join(missing_settings)
        )

# Buat engine database
engine = create_engine(
    settings.DATABASE_URL,
    echo=False,
    pool_pre_ping=True
)

# Pembuatan Session local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# buat class Base untuk deklarasi model
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# buat fungsi untuk test koneksi database
def test_connection():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    print("Koneksi database berhasil!")
        
if __name__ == "__main__":
    test_connection()