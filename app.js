// ============================================================
// 🦉 NOCTUA COFFEE — CORE SERVER ENTRY POINT (app.js)
// ============================================================

const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// ── [1] SESSION STORE (IN-MEMORY SESSION) ──────────────────
// Menyimpan token login admin aktif secara sementara di memori server
const sessions = {};
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // Kadaluarsa sesi dalam 24 jam

// ── [2] GLOBAL MIDDLEWARES ─────────────────────────────────
app.use(morgan("dev")); // Logging HTTP requests ke konsol terminal
app.use(express.json()); // Parsing format request body JSON
app.use(express.urlencoded({ extended: true })); // Parsing format request URL-encoded
app.use(cookieParser()); // Parsing cookie header data
// Disable browser caching for static files (development mode)
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});
app.use(express.static(path.join(__dirname, "public"))); // static file server (CSS, JS, Images, HTML)


// ── [3] AUTHENTICATION MIDDLEWARE ──────────────────────────
// Melakukan pengecekan cookie adminSession pada setiap request
app.use((req, res, next) => {
  const sessionId = req.cookies.adminSession;
  
  if (sessionId && sessions[sessionId]) {
    const session = sessions[sessionId];
    
    // Periksa apakah sesi belum kadaluarsa
    if (Date.now() - session.createdAt < SESSION_TIMEOUT) {
      req.user = session.user; // Lampirkan data user login ke objek request
    } else {
      delete sessions[sessionId]; // Hapus sesi yang kadaluarsa
      res.clearCookie("adminSession");
    }
  }
  next();
});

// ── [4] AUTHORIZATION MIDDLEWARE ───────────────────────────
// Middleware pembatas akses halaman sensitif (Hanya untuk Admin login)
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/admin-login.html"); // Alihkan ke halaman login jika belum terautentikasi
  }
  next();
};

// ── [5] API ROUTING REGISTRATION ───────────────────────────
// Mengalihkan rute /api ke pengendali router API khusus
app.use("/api", require("./routes/api"));

// ── [6] ADMIN AUTHENTICATION API ───────────────────────────
const db = require("./database/db");

// Algoritma Login Admin
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res
      .status(400)
      .json({ sukses: false, pesan: "Username dan password wajib diisi" });
  }

  // Cari kecocokan data pengguna di basis data NeDB
  db.users.findOne({ username }, (err, user) => {
    if (err || !user || user.password !== password) {
      return res
        .status(401)
        .json({ sukses: false, pesan: "Username atau password salah" });
    }

    // Pembuatan ID Sesi acak unik
    const sessionId = Math.random().toString(36).substr(2, 9);
    sessions[sessionId] = {
      user: { id: user._id, username: user.username, role: user.role },
      createdAt: Date.now(),
    };

    // Pasangkan cookie sesi aman ke browser klien
    res.cookie("adminSession", sessionId, {
      httpOnly: true, // Mencegah akses cookie via javascript client-side (keamanan XSS)
      maxAge: SESSION_TIMEOUT,
      path: "/",
    });

    res.json({ sukses: true, pesan: "Login berhasil", sessionId });
  });
});

// Algoritma Logout Admin
app.post("/api/logout", (req, res) => {
  const sessionId = req.cookies.adminSession;
  if (sessionId) {
    delete sessions[sessionId]; // Hapus token dari memori server
  }
  res.clearCookie("adminSession"); // Hapus cookie di browser klien
  res.json({ sukses: true, pesan: "Logout berhasil" });
});

// Mengecek status login user aktif saat ini
app.get("/api/user", (req, res) => {
  if (req.user) {
    res.json({ sukses: true, user: req.user });
  } else {
    res.json({ sukses: false, pesan: "Tidak ada user yang login" });
  }
});

// ── [7] PAGE ROUTING (STATIC FILE SHARING) ──────────────────
// Menyajikan file HTML berdasarkan alamat URL yang diakses
const send = (file) => (req, res) =>
  res.sendFile(path.join(__dirname, "public", file));

app.get("/", send("index.html")); // Beranda pelanggan
app.get("/menu", send("menu.html")); // Halaman menu & pemesanan
app.get("/about", send("about.html")); // Cerita toko
app.get("/contact", send("contact.html")); // Lokasi & formulir feedback
app.get("/admin-login.html", send("admin-login.html")); // Form masuk admin

// Rute Dashboard Admin (dilindungi oleh middleware pembatas akses requireAdmin)
app.get("/admin", requireAdmin, send("admin.html"));

// ── [8] ERROR HANDLING (CUSTOM 404 ROUTE) ──────────────────
// Menangani URL tak dikenal dengan mengembalikan halaman 404 error
app.use((req, res) =>
  res.status(404).sendFile(path.join(__dirname, "public", "404.html")),
);

// ── [9] SERVER INITIALIZATION ──────────────────────────────
app.listen(PORT, () => {
  console.log(`\n☕  Noctua Coffee siap di http://localhost:${PORT}`);
  console.log(`🔧  Admin Panel  → http://localhost:${PORT}/admin`);
  console.log(`🔌  API Menu     → http://localhost:${PORT}/api/menu`);
  console.log(`   Tekan Ctrl+C untuk menghentikan server\n`);
});

module.exports = app;
