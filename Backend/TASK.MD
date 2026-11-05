# 📋 Roadmap & Task Tracker Backend (FastAPI + PostgreSQL)
Proyek: **FinGenius AI / APP_FINANCE**

Dokumen ini adalah panduan kerja langkah demi langkah untuk membangun backend dari awal hingga siap diintegrasikan dengan aplikasi mobile (**`MobileApps`**).

---

## 🧭 Alur Pengerjaan (Workflow Overview)

```
[1. Models & DB] ➔ [2. Alembic Migration] ➔ [3. Pydantic Schemas] ➔ [4. Auth & Security] ➔ [5. Service Layer & AI] ➔ [6. API Endpoints] ➔ [7. Connect Mobile]
```

---

## ✅ FASE 1: Database & Model (Tahap Saat Ini)
Fokus: Menyiapkan struktur tabel dan mengeksekusi skema ke PostgreSQL.

- [x] **1.1. Pembuatan Model SQLAlchemy 2.0**:
  - [x] `User` (`app/models/user.py`): Profil user, payday, preferensi finansial.
  - [x] `Wallet` (`app/models/wallet.py`): Akun bank, e-wallet, dompet tunai.
  - [x] `Category` (`app/models/category.py`): Kategori pengeluaran/pemasukan.
  - [x] `Transaction` (`app/models/transaction.py`): Pencatatan arus kas uang.
  - [x] `BudgetSetting` (`app/models/budget.py`): Batas pengeluaran harian & strict mode.
  - [x] `AIMappingRule` (`app/models/ai_mapping.py`): Aturan kamus mapping kata kunci AI.
  - [x] Ekspor seluruh model di `app/models/__init__.py`.
  - [x] Hubungkan metadata model ke `alembic/env.py`.

- [x] **1.2. Eksekusi Migrasi Database (Alembic)**:
  - [x] Jalankan generator migrasi:
    ```bash
    alembic revision --autogenerate -m "create initial tables"
    ```
  - [x] Jalankan migrasi ke PostgreSQL:
    ```bash
    alembic upgrade head
    ```
  - [x] Buat file script seeder awal (`app/db/seed.py`) untuk mengisi kategori bawaan sistem (*Makanan, Transportasi, Gaji, dll*).

---

## 📦 FASE 2: Skema Validasi Data (Pydantic Schemas / DTO)
Fokus: Menentukan format JSON data masuk (Request) dan data keluar (Response) untuk MobileApps.

- [x] **2.1. Schemas User (`app/schemas/user.py`)**:
  - `UserRegister`: email, password, name, username.
  - `UserLogin`: email, password.
  - `UserUpdateProfile`: job, payday, currency, balance_format, avatar_url.
  - `UserChangePassword`: current_password, new_password.
  - `UserResponse`: Data profil publik (tanpa `hashed_password`).
  - `TokenResponse`: `access_token`, `token_type`, `user`.

- [x] **2.2. Schemas Wallet (`app/schemas/wallet.py`)**:
  - `WalletCreate`: name, type, balance, account_number, icon, color_primary, color_secondary.
  - `WalletUpdate`: name, balance, icon, dll.
  - `WalletTopUp` & `WalletTransfer`: nominal dan catatan transfer.
  - `WalletResponse` & `WalletSummaryResponse`: Data dompet lengkap & akumulasi total aset.

- [x] **2.3. Schemas Category (`app/schemas/category.py`)**:
  - `CategoryCreate`: name, type, icon, color, bg_color.
  - `CategoryUpdate`: name, icon, color, bg_color.
  - `CategoryResponse`: id, name, type, icon, color, bg_color, is_locked, is_system_default.

- [x] **2.4. Schemas Transaction (`app/schemas/transaction.py`)**:
  - `TransactionCreate`: wallet_id, category_id, amount, type, title, note, transaction_date, source.
  - `TransactionUpdate`: perbarui field transaksi.
  - `TransactionFilter`: filter tanggal, category, wallet, tipe transaksi, pagination.
  - `TransactionResponse`: Data transaksi beserta rincian display dompet & kategori.
  - `TransactionSummaryResponse`: Statistik cash flow (total income, expense, net).

- [x] **2.5. Schemas Budget & AI (`app/schemas/budget.py` & `app/schemas/ai.py`)**:
  - `BudgetSettingBase` & `BudgetSettingUpdate`: konfigurasi saklar & nominal limit harian.
  - `DailyBudgetStatusResponse`: limit harian, nominal terpakai hari ini, sisa nominal, persentase pemakaian, status safe/warning/overbudget, sisa hari menuju payday.
  - `AITextParseRequest` & `AITextParseResponse`: parsing teks natural language.
  - `AIReceiptScanResponse`: hasil ekstraksi OCR AI struk (merchant, items, amount, saran kategori).
  - `AIMappingRuleCreate`, `Update`, & `Response`: kamus pemetaan kata kunci AI.

---

## 🔐 FASE 3: Keamanan & Autentikasi (JWT & Bcrypt)
Fokus: Login aman, enkripsi password, dan proteksi endpoint.

- [ ] **3.1. Security Utility (`app/core/security.py`)**:
  - Fungsi `hash_password(password: str) -> str`.
  - Fungsi `verify_password(plain_password: str, hashed_password: str) -> bool`.
  - Fungsi `create_access_token(data: dict, expires_delta: timedelta | None) -> str`.
  - Fungsi `verify_token(token: str) -> dict`.

- [ ] **3.2. Authentication Dependency (`app/api/deps.py`)**:
  - Fungsi `get_current_user`: Membaca header `Authorization: Bearer <token>`, memvalidasi token, dan mengambil data user aktif dari DB.

---

## 🧠 FASE 4: Business Logic (Service Layer)
Fokus: Logika hitungan finansial dan komunikasi dengan Gemini AI.

- [ ] **4.1. `AuthService` (`app/service/auth_service.py`)**:
  - Validasi email kembar saat register.
  - Verifikasi password saat login dan cetak JWT.

- [ ] **4.2. `WalletService` (`app/service/wallet_service.py`)**:
  - Kalkulasi total aset user (akumulasi seluruh saldo dompet aktif).
  - Update saldo dompet saat transaksi dibuat/dihapus.

- [ ] **4.3. `TransactionService` (`app/service/transaction_service.py`)**:
  - Buat transaksi baru -> otomatis sesuaikan saldo di `Wallet`.
  - Ambil riwayat transaksi dengan pagination dan filter bulanan berdasarkan `payday`.

- [ ] **4.4. `BudgetService` (`app/service/budget_service.py`)**:
  - Hitung batas pengeluaran hari ini vs transaksi harian aktual.
  - Kalkulasi sisa hari menuju gajian berikutnya (`payday`).

- [ ] **4.5. `AIService` (`app/service/ai_service.py`)**:
  - Menggunakan library `google-genai` (Gemini API).
  - Parsing input teks natural (contoh: *"makan soto 20rb bayar pake bca"*).
  - OCR Scan nota/struk belanja menjadi format JSON terstruktur.

---

## 🌐 FASE 5: Pembuatan Endpoint HTTP (API Routers v1)
Fokus: Menyediakan URL API yang dapat diakses oleh MobileApps.

- [ ] **5.1. Router Auth**:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`

- [ ] **5.2. Router Wallets**:
  - `GET /api/v1/wallets`
  - `POST /api/v1/wallets`
  - `PUT /api/v1/wallets/{id}`
  - `POST /api/v1/wallets/{id}/topup`

- [ ] **5.3. Router Categories**:
  - `GET /api/v1/categories`
  - `POST /api/v1/categories`
  - `DELETE /api/v1/categories/{id}`

- [ ] **5.4. Router Transactions**:
  - `GET /api/v1/transactions`
  - `POST /api/v1/transactions`
  - `GET /api/v1/transactions/summary` (Data statistik untuk grafik analitik)

- [ ] **5.5. Router AI & Mapping**:
  - `POST /api/v1/ai/parse-text`
  - `POST /api/v1/ai/scan-receipt`
  - `GET /api/v1/ai/mapping-rules`

- [ ] **5.6. Main App Setup (`app/main.py`)**:
  - Daftarkan semua router v1.
  - Pasang middleware **CORS** (`CORSMiddleware`) agar request dari aplikasi Expo diizinkan.

---

## 📱 FASE 6: Integrasi ke MobileApps
Fokus: Mengganti mock data di frontend dengan pemanggilan API nyata.

- [ ] **6.1. API Client Setup**:
  - Buat helper API (Axios / Fetch) dengan base URL backend (misal: `http://10.0.2.2:8000` untuk Android emulator atau IP LAN).
  - Interceptor untuk menyisipkan header `Authorization: Bearer <token>`.

- [ ] **6.2. Integrasi Login & Register**:
  - Ganti dummy login `aditya@fingeniusai.com` dengan pemanggilan ke `/api/v1/auth/login`.
  - Simpan JWT token di `AsyncStorage` / `expo-secure-store`.

- [ ] **6.3. Hubungkan Dashboard & Transaksi**:
  - Tampilkan saldo dompet nyata dari `/api/v1/wallets`.
  - Hubungkan form pencatatan (`ai-input.tsx`) ke `/api/v1/transactions`.
  - Hubungkan kamera scanner ke `/api/v1/ai/scan-receipt`.
