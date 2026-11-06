# 🔐 Roadmap & Rencana Pengembangan Fitur Autentikasi (Auth)
**Proyek:** FinGenius AI / APP_FINANCE  
**Terakhir Diperbarui:** November 2026

Dokumen ini mencatat status implementasi modul autentikasi saat ini serta rencana pengembangan fitur autentikasi dan keamanan tingkat lanjut di masa mendatang.

---

## 📌 Status Fitur Saat Ini

| Fitur | Status Backend | Status Mobile UI | Keterangan |
|---|:---:|:---:|---|
| **Registrasi Akun Baru** | ✅ Selesai | ✅ Selesai | Validasi email/username unik, hash bcrypt, auto-init daily budget. |
| **Login Fleksibel (Email/Username/No. HP)** | ✅ Selesai | ✅ Selesai | Mendukung input identifier fleksibel (email, username, nomor HP). |
| **Ambil Data Profil Pengguna (`/auth/me`)** | ✅ Selesai | ✅ Selesai | Menggunakan Bearer Token via TanStack Query. |
| **Perbarui Profil (`PUT /auth/me`)** | ✅ Selesai | ✅ Selesai | Update nama, username, HP, pekerjaan, payday, format saldo, avatar. |
| **Proteksi Rute (Auth Guard Terpusat)** | ✅ Selesai | ✅ Selesai | Cegah akses rute tanpa login, anti-flicker, reverse guard tamu. |
| **Penyimpanan Sesi & Auto 401 Redirect** | ✅ Selesai | ✅ Selesai | Token disimpan di `AsyncStorage`, interceptor 401 me-reset sesi otomatis. |
| **Hapus Akun Permanen (Delete Account)** | ✅ Selesai | ✅ Selesai | Dedicated page rincian dampak, konfirmasi password, cascading delete. |

---

## 🚀 Rencana Pengembangan Mendatang (Future Auth Roadmap)

### 1. 🔑 UI Ubah Kata Sandi (*Change Password*)
* **Kesiapan Backend:** ✅ Sudah siap (`PUT /api/v1/auth/change-password`).
* **Kebutuhan Pengembangan:**
  - Tambahkan tombol menu *"Ubah Kata Sandi"* di `MobileApps/src/app/ProfilePage/AccountSettings.tsx`.
  - Buat modal dialog dengan 3 kolom isian:
    1. Kata sandi saat ini (*current password*).
    2. Kata sandi baru (*new password*, min. 8 karakter).
    3. Konfirmasi kata sandi baru (*confirm password*).
  - Hubungkan ke `authService.changePassword(payload)` dan tampilkan feedback toast sukses atau error validasi jika sandi lama tidak cocok.

---

### 2. 📩 Fitur Lupa Kata Sandi (*Forgot & Reset Password*)
* **Tujuan:** Mengaktifkan tombol *"Lupa kata sandi?"* pada halaman login agar pengguna yang lupa password dapat memulihkan akunnya.
* **Kebutuhan Pengembangan:**
  - **Backend:**
    - Endpoint request reset token / OTP (`POST /api/v1/auth/forgot-password`).
    - Layanan pengiriman email (SMTP / SendGrid / Resend) atau OTP WhatsApp.
    - Endpoint verifikasi token & pembaruan password baru (`POST /api/v1/auth/reset-password`).
  - **MobileApps:**
    - Halaman / modal baru: Masukkan email terdaftar.
    - Halaman input kode OTP 6-digit.
    - Halaman buat kata sandi baru.

---

### 4. 👆 Autentikasi Biometrik (*Fingerprint / Face ID*)
* **Tujuan:** Meningkatkan kenyamanan dan keamanan aplikasi perbankan/finansial pribadi.
* **Kebutuhan Pengembangan:**
  - Pasang dependensi Expo: `npx expo install expo-local-authentication`.
  - Simpan preferensi pengguna *"Aktifkan Biometrik"* di `AccountSettings.tsx`.
  - Tampilkan pop-up sensor sidik jari atau Face ID saat aplikasi kembali dibuka dari latar belakang (*app resume*).

---

### 5. 🌐 Social Login (Google Sign-In / OAuth2)
* **Tujuan:** Mempermudah pengguna mendaftar dan masuk tanpa perlu mengingat kata sandi.
* **Kebutuhan Pengembangan:**
  - Integrasi Google Sign-In SDK di Expo (`expo-auth-session` atau `@react-native-google-signin/google-signin`).
  - Backend endpoint `POST /api/v1/auth/google` untuk memverifikasi Google ID Token dari client dan membuat akun jika belum terdaftar.

---

### 6. 🔄 Refresh Token & Rotasi Sesi
* **Tujuan:** Standar keamanan token JWT jangka pendek (*short-lived access token*).
* **Kebutuhan Pengembangan:**
  - Token akses berumur 15–30 menit.
  - Refresh token berumur 30 hari yang disimpan aman (misal `expo-secure-store`).
  - Axios interceptor otomatis memanggil `POST /auth/refresh` saat access token kadaluarsa tanpa mengganggu aktivitas pengguna.
