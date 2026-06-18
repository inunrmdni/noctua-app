// ============================================================
// 🦉 NOCTUA COFFEE — DATABASE CONFIGURATION & SEEDING (db.js)
// ============================================================

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// ── NeDB UTILS COMPATIBILITY FIX ───────────────────────────
// NeDB menggunakan fungsi util bawaan Node.js yang sudah deprecated pada versi terbaru.
// Kode di bawah memperbaiki kompatibilitas agar NeDB dapat berjalan mulus tanpa error.
const util = require("util");
if (!util.isDate) {
  util.isDate = function (d) {
    return Object.prototype.toString.call(d) === "[object Date]";
  };
}
if (!util.isArray) {
  util.isArray = Array.isArray;
}
if (!util.isRegExp) {
  util.isRegExp = function (re) {
    return Object.prototype.toString.call(re) === "[object RegExp]";
  };
}

// Impor modul NeDB
const Datastore = require("nedb");

// ── [1] INISIALISASI DATABASE & FILE PENYIMPANAN ───────────
// Mendeklarasikan 4 tabel utama berbasis file lokal (.db)
const db = {
  menu: new Datastore({
    filename: path.join(__dirname, "menu.db"),
    autoload: true, // Otomatis memuat file saat database diinisiasi
  }),
  contacts: new Datastore({
    filename: path.join(__dirname, "contacts.db"),
    autoload: true,
  }),
  users: new Datastore({
    filename: path.join(__dirname, "users.db"),
    autoload: true,
  }),
  orders: new Datastore({
    filename: path.join(__dirname, "orders.db"),
    autoload: true,
  }),
};

// ── [2] CONFIGURASI AUTO-INDEXING ───────────────────────────
// Meningkatkan performa pencarian database pada kolom-kolom penting
db.menu.ensureIndex({ fieldName: "category" });
db.contacts.ensureIndex({ fieldName: "createdAt" });
db.users.ensureIndex({ fieldName: "username", unique: true }); // Username admin harus unik
db.orders.ensureIndex({ fieldName: "createdAt" });

// ── [3] DATA AWAL MENU (DATABASE SEEDING) ───────────────────
// Daftar menu default yang akan dimasukkan ke database jika database masih kosong
const seedMenu = [
  {
    name: "Noctua Espresso",
    category: "espresso",
    price: 28000,
    desc: "Single origin Ethiopia Yirgacheffe, nuansa dark chocolate",
    img: "/images/menu-espresso.jpg",
    fallback: "☕",
    tersedia: true,
  },
  {
    name: "Midnight Americano",
    category: "espresso",
    price: 32000,
    desc: "Double shot, diseduh panjang, smoky dan bold",
    img: "/images/menu-americano.jpg",
    fallback: "🌑",
    tersedia: true,
  },
  {
    name: "Owl Latte",
    category: "milk",
    price: 38000,
    desc: "Microfoam lembut dengan campuran espresso signature kami",
    img: "/images/menu-latte.jpg",
    fallback: "🦉",
    tersedia: true,
  },
  {
    name: "Cappuccino Madu",
    category: "milk",
    price: 40000,
    desc: "Madu hutan liar, susu oat, taburan kayu manis",
    img: "/images/menu-cappuccino.jpg",
    fallback: "🍯",
    tersedia: true,
  },
  {
    name: "Cold Brew Eclipse",
    category: "cold",
    price: 42000,
    desc: "Diseduh dingin 18 jam, disajikan di atas es wijen hitam",
    img: "/images/menu-coldbrew.jpg",
    fallback: "🌘",
    tersedia: true,
  },
  {
    name: "Salted Caramel Flash",
    category: "cold",
    price: 45000,
    desc: "Nitro cold brew dengan karamel garam rumahan",
    img: "/images/menu-salted.jpg",
    fallback: "⚡",
    tersedia: true,
  },
  {
    name: "Lunar Matcha",
    category: "nonCoffee",
    price: 38000,
    desc: "Matcha ceremonial grade, oat milk, sirup gula merah",
    img: "/images/menu-matcha.jpg",
    fallback: "🌿",
    tersedia: true,
  },
  {
    name: "Dark Cacao",
    category: "nonCoffee",
    price: 35000,
    desc: "Cokelat hitam Valrhona 70%, susu almond hangat",
    img: "/images/menu-cacao.jpg",
    fallback: "🍫",
    tersedia: true,
  },
  {
    name: "Croissant Noir",
    category: "food",
    price: 32000,
    desc: "Croissant arang dengan isian dark chocolate",
    img: "/images/menu-croissant.jpg",
    fallback: "🥐",
    tersedia: true,
  },
  {
    name: "Tiramisu Jar",
    category: "food",
    price: 45000,
    desc: "Klasik Italia, ladyfinger direndam espresso",
    img: "/images/menu-tiramisu.jpg",
    fallback: "🍮",
    tersedia: true,
  },
];

// Algoritma Seeding Menu: Memeriksa dan mengisi tabel menu jika kosong
db.menu.count({}, (err, count) => {
  if (count === 0) {
    const now = new Date().toISOString();
    // Tambahkan timestamp pembuatan awal pada data seed
    const withTimestamp = seedMenu.map((item) => ({
      ...item,
      createdAt: now,
      updatedAt: now,
    }));
    
    db.menu.insert(withTimestamp, (err) => {
      if (!err) {
        console.log(
          "✅ Database menu berhasil di-seed dengan",
          seedMenu.length,
          "item default."
        );
      }
    });
  }
});

// ── [4] DATA AWAL ADMIN (ADMIN SEEDING) ─────────────────────
// Membuat pengguna admin default agar panel dashboard dapat langsung diakses
db.users.count({}, (err, count) => {
  if (count === 0) {
    db.users.insert({
      username: "admin",
      password: "admin123", // Di produksi, pastikan gunakan enkripsi bcrypt/argon2!
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    console.log(
      "✅ Akun Admin default dibuat → username: admin | password: admin123"
    );
  }
});

module.exports = db;
