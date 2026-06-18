// ============================================================
// 🦉 NOCTUA COFFEE — API ROUTES & DATABASE MANAGER (BACKEND)
// ============================================================

const express = require("express");
const router = express.Router();
const db = require("../database/db");

// ── UTILITY FUNCTIONS (RESPONS STANDARD) ────────────────────

// Mengembalikan respons sukses dengan status code dan payload data
const ok = (res, data, status = 200) =>
  res.status(status).json({ sukses: true, ...data });

// Mengembalikan respons gagal dengan status code dan pesan kesalahan
const err = (res, pesan, status = 500) =>
  res.status(status).json({ sukses: false, pesan });

// ════════════════════════════════════════════════════════════
// ☕ [1] MENU CRUD ENDPOINTS
// ════════════════════════════════════════════════════════════

/**
 * 📥 GET /api/menu
 * Mengambil semua daftar menu. Bisa difilter berdasarkan query ?category=nama_kategori
 */
router.get("/menu", (req, res) => {
  const query = req.query.category ? { category: req.query.category } : {};
  
  db.menu
    .find(query)
    .sort({ category: 1, name: 1 }) // Urutkan kategori & alfabet nama
    .exec((e, docs) => {
      if (e) return err(res, "Gagal mengambil data menu");
      ok(res, { jumlah: docs.length, data: docs });
    });
});

/**
 * 🔍 GET /api/menu/:id
 * Mengambil informasi detail satu item menu berdasarkan ID
 */
router.get("/menu/:id", (req, res) => {
  db.menu.findOne({ _id: req.params.id }, (e, doc) => {
    if (e) return err(res, "Gagal mengambil data");
    if (!doc) return err(res, "Menu tidak ditemukan", 404);
    ok(res, { data: doc });
  });
});

/**
 * ➕ POST /api/menu
 * Menambahkan item menu baru ke database (Memerlukan otorisasi admin di frontend)
 */
router.post("/menu", (req, res) => {
  const { name, category, price, desc, img, fallback } = req.body;
  
  // Validasi input wajib
  if (!name || !category || !price) {
    return err(res, "name, category, dan price wajib diisi", 400);
  }

  const item = {
    name,
    category,
    price: Number(price),
    desc: desc || "",
    img: img || "",
    fallback: fallback || "☕",
    tersedia: true, // Menu baru otomatis berstatus tersedia
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.menu.insert(item, (e, doc) => {
    if (e) {
      console.error("❌ Error inserting menu:", e);
      return err(res, `Gagal menyimpan menu: ${e.message || e}`);
    }
    ok(res, { pesan: "Menu berhasil ditambahkan", data: doc }, 201);
  });
});

/**
 * ✏️ PUT /api/menu/:id
 * Memperbarui data item menu yang sudah ada berdasarkan ID
 */
router.put("/menu/:id", (req, res) => {
  const { name, category, price, desc, img, fallback, tersedia } = req.body;
  const set = { updatedAt: new Date().toISOString() };

  // Hanya perbarui kolom yang dikirimkan oleh klien (Patch-like PUT)
  if (name !== undefined) set.name = name;
  if (category !== undefined) set.category = category;
  if (price !== undefined) set.price = Number(price);
  if (desc !== undefined) set.desc = desc;
  if (img !== undefined) set.img = img;
  if (fallback !== undefined) set.fallback = fallback;
  if (tersedia !== undefined) set.tersedia = tersedia;

  db.menu.update({ _id: req.params.id }, { $set: set }, {}, (e, n) => {
    if (e) return err(res, "Gagal mengupdate menu");
    if (n === 0) return err(res, "Menu tidak ditemukan", 404);
    
    // Kembalikan data menu terbaru setelah berhasil diupdate
    db.menu.findOne({ _id: req.params.id }, (e2, doc) =>
      ok(res, { pesan: "Menu berhasil diupdate", data: doc }),
    );
  });
});

/**
 * 🗑️ DELETE /api/menu/:id
 * Menghapus item menu tertentu dari database berdasarkan ID
 */
router.delete("/menu/:id", (req, res) => {
  db.menu.remove({ _id: req.params.id }, {}, (e, n) => {
    if (e) return err(res, "Gagal menghapus menu");
    if (n === 0) return err(res, "Menu tidak ditemukan", 404);
    ok(res, { pesan: "Menu berhasil dihapus" });
  });
});

// ════════════════════════════════════════════════════════════
// 📬 [2] KONTAK & FEEDBACK ENDPOINTS
// ════════════════════════════════════════════════════════════

/**
 * 📥 GET /api/contacts
 * Mengambil semua daftar pesan masuk (Diurutkan dari terbaru)
 */
router.get("/contacts", (req, res) => {
  db.contacts
    .find({})
    .sort({ createdAt: -1 })
    .exec((e, docs) => {
      if (e) return err(res, "Gagal mengambil pesan");
      ok(res, { jumlah: docs.length, data: docs });
    });
});

/**
 * ✉️ POST /api/contacts
 * Mengirim pesan masukan/kontak baru dari formulir pelanggan
 */
router.post("/contacts", (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return err(res, "Semua kolom wajib diisi", 400);
  }

  const pesan = {
    name,
    email,
    message,
    sudahDibaca: false, // Pesan baru berstatus belum dibaca
    createdAt: new Date().toISOString(),
  };

  db.contacts.insert(pesan, (e, doc) => {
    if (e) return err(res, "Gagal menyimpan pesan");
    ok(
      res,
      {
        pesan: `Terima kasih, ${name}! Kami akan segera menghubungi kamu.`,
        data: doc,
      },
      201,
    );
  });
});

/**
 * 👁️ PUT /api/contacts/:id/baca
 * Menandai pesan masuk tertentu sebagai "Sudah Dibaca" oleh admin
 */
router.put("/contacts/:id/baca", (req, res) => {
  db.contacts.update(
    { _id: req.params.id },
    { $set: { sudahDibaca: true } },
    {},
    (e, n) => {
      if (e || n === 0) return err(res, "Pesan tidak ditemukan", 404);
      ok(res, { pesan: "Ditandai sudah dibaca" });
    },
  );
});

/**
 * 🗑️ DELETE /api/contacts/:id
 * Menghapus pesan masuk tertentu dari database berdasarkan ID
 */
router.delete("/contacts/:id", (req, res) => {
  db.contacts.remove({ _id: req.params.id }, {}, (e, n) => {
    if (e || n === 0) return err(res, "Pesan tidak ditemukan", 404);
    ok(res, { pesan: "Pesan berhasil dihapus" });
  });
});

// ════════════════════════════════════════════════════════════
// 🛍️ [3] ORDER / PESANAN ENDPOINTS
// ════════════════════════════════════════════════════════════

/**
 * 📥 GET /api/orders
 * Mengambil seluruh data pesanan masuk (Diurutkan dari pesanan terbaru)
 */
router.get("/orders", (req, res) => {
  db.orders
    .find({})
    .sort({ createdAt: -1 })
    .exec((e, docs) => {
      if (e) return err(res, "Gagal mengambil data pesanan");
      ok(res, { jumlah: docs.length, data: docs });
    });
});

/**
 * 🛒 POST /api/orders
 * Membuat transaksi pesanan baru dari pelanggan
 */
router.post("/orders", (req, res) => {
  const { customerName, tableNumber, items, paymentMethod, total } = req.body;
  
  if (!items || items.length === 0 || !paymentMethod || !total) {
    return err(res, "Data pesanan tidak lengkap", 400);
  }

  // Membuat ID Invoice premium otomatis (Contoh: NC-2026-8942)
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const invoiceId = `NC-${new Date().getFullYear()}-${randNum}`;

  const order = {
    invoiceId,
    customerName: customerName || "Pelanggan Umum",
    tableNumber: tableNumber || "Takeaway",
    items, // Struktur array: [{ menuId, name, price, qty }]
    paymentMethod, // Metode bayar: QRIS atau Cash
    total: Number(total),
    status: "baru", // Status awal: baru, diproses, selesai, batal
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders.insert(order, (e, doc) => {
    if (e) return err(res, "Gagal membuat pesanan");
    ok(res, { pesan: "Pesanan berhasil dikirim", data: doc }, 201);
  });
});

/**
 * ⚙️ PUT /api/orders/:id/status
 * Memperbarui status pesanan (misal: memproses pesanan, selesai, atau membatalkannya)
 */
router.put("/orders/:id/status", (req, res) => {
  const { status } = req.body;
  if (!status) return err(res, "Status wajib diisi", 400);

  db.orders.update(
    { _id: req.params.id },
    { $set: { status, updatedAt: new Date().toISOString() } },
    {},
    (e, n) => {
      if (e) return err(res, "Gagal memperbarui status pesanan");
      if (n === 0) return err(res, "Pesanan tidak ditemukan", 404);
      ok(res, { pesan: "Status pesanan berhasil diperbarui" });
    }
  );
});

/**
 * 🗑️ DELETE /api/orders/:id
 * Menghapus data transaksi pesanan tertentu berdasarkan ID
 */
router.delete("/orders/:id", (req, res) => {
  db.orders.remove({ _id: req.params.id }, {}, (e, n) => {
    if (e) return err(res, "Gagal menghapus pesanan");
    if (n === 0) return err(res, "Pesanan tidak ditemukan", 404);
    ok(res, { pesan: "Pesanan berhasil dihapus" });
  });
});

// ════════════════════════════════════════════════════════════
// 🔌 [4] STATUS TOKO ENDPOINT
// ════════════════════════════════════════════════════════════

/**
 * 🏪 GET /api/status
 * Mengecek apakah toko saat ini buka atau tutup berdasarkan waktu real-time server
 */
router.get("/status", (req, res) => {
  const jam = new Date().getHours();
  const buka = jam >= 7 && jam < 22; // Buka dari jam 07.00 sampai jam 22.00
  
  ok(res, {
    buka,
    message: buka
      ? "Kami sedang buka! ☕"
      : "Kami sudah tutup. Sampai besok jam 07.00.",
    jam_operasional: "07.00 – 22.00 (Senin–Minggu)",
  });
});

module.exports = router;
