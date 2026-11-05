"""
seed.py - Script Seeder Database FinGenius AI

Script ini bertugas mengisi data awal (seeding) ke PostgreSQL:
1. Kategori Bawaan Sistem (System Default Categories)
2. Akun Pengguna Demo (aditya@fingeniusai.com / Password123)
3. Dompet Awal (BCA, Bank Jago, GoPay, Tunai)
4. Pengaturan Batas Anggaran Harian (Daily Budget)
5. Contoh Riwayat Transaksi (selaras dengan UI Mobile)
6. Kamus Pemetaan AI Awal (Keyword Mapping Rules)

Cara menjalankan:
  python seed.py
"""

import sys
from decimal import Decimal
from datetime import datetime
from app.core import security

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.wallet import Wallet
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.budget import BudgetSetting
from app.models.ai_mapping import AIMappingRule

# Daftar Kategori Bawaan Sistem (selaras dengan MobileApps)
SYSTEM_CATEGORIES = [
    # Pengeluaran (Expense)
    {
        "name": "Makanan & Minuman",
        "type": "expense",
        "icon": "coffee",
        "color": "#F59E0B",
        "bg_color": "#FFFBEB",
        "is_locked": True,
    },
    {
        "name": "Transportasi",
        "type": "expense",
        "icon": "navigation",
        "color": "#3B82F6",
        "bg_color": "#EFF6FF",
        "is_locked": True,
    },
    {
        "name": "Tagihan & Cicilan",
        "type": "expense",
        "icon": "file-text",
        "color": "#EF4444",
        "bg_color": "#FEF2F2",
        "is_locked": True,
    },
    {
        "name": "Belanja Bulanan",
        "type": "expense",
        "icon": "shopping-cart",
        "color": "#10B981",
        "bg_color": "#F0FDF4",
        "is_locked": False,
    },
    {
        "name": "Hiburan",
        "type": "expense",
        "icon": "tv",
        "color": "#8B5CF6",
        "bg_color": "#F3E8FF",
        "is_locked": False,
    },
    {
        "name": "Kopi & Nongkrong",
        "type": "expense",
        "icon": "smile",
        "color": "#A855F7",
        "bg_color": "#FAF5FF",
        "is_locked": False,
    },
    # Pemasukan (Income)
    {
        "name": "Gaji Pokok",
        "type": "income",
        "icon": "briefcase",
        "color": "#10B981",
        "bg_color": "#F0FDF4",
        "is_locked": True,
    },
    {
        "name": "Investasi & Bunga",
        "type": "income",
        "icon": "trending-up",
        "color": "#3B82F6",
        "bg_color": "#EFF6FF",
        "is_locked": True,
    },
    {
        "name": "Hadiah / Bonus",
        "type": "income",
        "icon": "gift",
        "color": "#F59E0B",
        "bg_color": "#FFFBEB",
        "is_locked": False,
    },
]


def seed_categories(db) -> dict[str, Category]:
    """Mengisi kategori sistem bawaan jika belum ada."""
    print("🌱 [1/4] Memeriksa & mengisi Kategori Sistem Bawaan...")
    category_map = {}

    for cat_data in SYSTEM_CATEGORIES:
        existing = (
            db.query(Category)
            .filter(
                Category.user_id.is_(None),
                Category.name == cat_data["name"],
                Category.type == cat_data["type"],
            )
            .first()
        )

        if not existing:
            cat = Category(
                user_id=None,  # None menandakan kategori default sistem
                name=cat_data["name"],
                type=cat_data["type"],
                icon=cat_data["icon"],
                color=cat_data["color"],
                bg_color=cat_data["bg_color"],
                is_locked=cat_data["is_locked"],
            )
            db.add(cat)
            db.flush()
            category_map[cat.name] = cat
            print(f"   ➕ Kategori ditambahkan: {cat.name} ({cat.type})")
        else:
            category_map[existing.name] = existing

    db.commit()
    return category_map


def seed_demo_user(db, category_map: dict[str, Category]):
    """Mengisi akun demo Aditya Alfitodinova beserta dompet dan transaksinya."""
    print("\n🌱 [2/4] Memeriksa & mengisi Akun Demo Pengguna...")
    demo_email = "aditya@fingeniusai.com"

    user = db.query(User).filter(User.email == demo_email).first()
    if user:
        print(f"   ℹ️  Akun demo '{demo_email}' sudah ada (ID: {user.id}). Melewati pembuatan user.")
        return user

    # 1. Buat User Demo
    user = User(
        email=demo_email,
        hashed_password=security.password_hash("Password123"),
        name="Aditya Alfitodinova",
        username="aditya.alfitodinova",
        phone="081288889999",
        job="Software Engineer / Tech",
        payday=25,
        currency="IDR",
        balance_format=True,
        is_active=True,
    )
    db.add(user)
    db.flush()
    print(f"   ✅ User dibuat: {user.name} ({user.email})")

    # 2. Buat Pengaturan Anggaran Harian (Daily Budget)
    print("\n🌱 [3/4] Mengisi Pengaturan Anggaran & Dompet Demo...")
    budget_setting = BudgetSetting(
        user_id=user.id,
        is_limit_enabled=True,
        daily_limit_amount=Decimal("100000.00"),
        warn_at_80=True,
        warn_at_100=True,
        strict_mode=False,
    )
    db.add(budget_setting)

    # 3. Buat Multi-Dompet (Wallets)
    wallets_data = [
        {
            "name": "BCA Utama",
            "type": "Bank",
            "balance": Decimal("14568600.00"),
            "account_number": "**** 8821",
            "icon": "credit-card",
            "color_primary": "#005AAA",
            "color_secondary": "#003B73",
        },
        {
            "name": "Bank Jago",
            "type": "Bank",
            "balance": Decimal("8420000.00"),
            "account_number": "**** 4022",
            "icon": "credit-card",
            "color_primary": "#F97316",
            "color_secondary": "#C2410C",
        },
        {
            "name": "GoPay",
            "type": "E-Wallet",
            "balance": Decimal("1250500.00"),
            "account_number": "+62 812 ****",
            "icon": "smartphone",
            "color_primary": "#00AED6",
            "color_secondary": "#007C99",
        },
        {
            "name": "Tunai",
            "type": "Cash",
            "balance": Decimal("850000.00"),
            "account_number": "Dompet Fisik",
            "icon": "dollar-sign",
            "color_primary": "#10B981",
            "color_secondary": "#047857",
        },
    ]

    wallet_map = {}
    for w in wallets_data:
        wallet = Wallet(
            user_id=user.id,
            name=w["name"],
            type=w["type"],
            balance=w["balance"],
            account_number=w["account_number"],
            icon=w["icon"],
            color_primary=w["color_primary"],
            color_secondary=w["color_secondary"],
            is_active=True,
        )
        db.add(wallet)
        db.flush()
        wallet_map[wallet.name] = wallet
        print(f"   💳 Dompet dibuat: {wallet.name} (Saldo: Rp {wallet.balance:,.2f})")

    # 4. Buat Riwayat Transaksi Demo (selaras dengan MobileApps)
    transactions_data = [
        {
            "title": "Bibit Reksadana",
            "amount": Decimal("500000.00"),
            "type": "expense",
            "wallet": wallet_map.get("BCA Utama"),
            "category": category_map.get("Investasi & Bunga"),
            "note": "Top-up reksadana pasar uang",
            "source": "manual",
        },
        {
            "title": "Netflix Subscription",
            "amount": Decimal("186000.00"),
            "type": "expense",
            "wallet": wallet_map.get("GoPay"),
            "category": category_map.get("Hiburan"),
            "note": "Paket premium bulanan",
            "source": "manual",
        },
        {
            "title": "Transfer dari Budi Santoso",
            "amount": Decimal("150000.00"),
            "type": "income",
            "wallet": wallet_map.get("BCA Utama"),
            "category": category_map.get("Hadiah / Bonus"),
            "note": "Pelunasan makan siang bareng",
            "source": "manual",
        },
        {
            "title": "Indomaret - Belanja Harian",
            "amount": Decimal("75000.00"),
            "type": "expense",
            "wallet": wallet_map.get("Tunai"),
            "category": category_map.get("Belanja Bulanan"),
            "note": "Sabun, roti, dan air mineral",
            "source": "ai_scan",
        },
    ]

    for tx in transactions_data:
        if tx["wallet"] and tx["category"]:
            t = Transaction(
                user_id=user.id,
                wallet_id=tx["wallet"].id,
                category_id=tx["category"].id,
                amount=tx["amount"],
                type=tx["type"],
                title=tx["title"],
                note=tx["note"],
                source=tx["source"],
            )
            db.add(t)

    # 5. Buat Kamus Pemetaan AI Awal (AI Mapping Rules)
    print("\n🌱 [4/4] Mengisi Kamus Pemetaan AI (AI Mapping Rules)...")
    ai_rules = [
        ("kopi", "Makanan & Minuman", "expense"),
        ("starbucks", "Makanan & Minuman", "expense"),
        ("indomaret", "Belanja Bulanan", "expense"),
        ("alfamart", "Belanja Bulanan", "expense"),
        ("bensin", "Transportasi", "expense"),
        ("gojek", "Transportasi", "expense"),
        ("netflix", "Hiburan", "expense"),
        ("gaji", "Gaji Pokok", "income"),
    ]

    for keyword, cat_name, rule_type in ai_rules:
        target_cat = category_map.get(cat_name)
        if target_cat:
            rule = AIMappingRule(
                user_id=user.id,
                category_id=target_cat.id,
                keyword=keyword,
                type=rule_type,
            )
            db.add(rule)
            print(f"   🤖 Aturan AI: '{keyword}' ➔ {cat_name}")

    db.commit()
    print("\n🎉 Seeding selesai dengan sempurna!")
    return user


def main():
    print("=" * 60)
    print("🚀 MEMULAI SEEDER DATABASE FINGENIUS AI")
    print("=" * 60)

    db = SessionLocal()
    try:
        category_map = seed_categories(db)
        seed_demo_user(db, category_map)
    except Exception as e:
        db.rollback()
        print(f"\n❌ Terjadi kesalahan saat seeding: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
