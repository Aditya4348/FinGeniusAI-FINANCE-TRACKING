from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api.v1 import api_v1_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API untuk Aplikasi Manajemen Keuangan FinGenius AI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Konfigurasi Middleware CORS (mengizinkan koneksi dari Expo Mobile & Web)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrasi Router API Versi 1
app.include_router(api_v1_router)


@app.get("/", tags=["Health Check"])
def read_root():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "environment": settings.ENVIRONMENT,
        "docs": "/docs",
    }


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
