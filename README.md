# 🦉 Noctua Coffee — Artisan Coffee Shop Web App

Noctua Coffee adalah sebuah aplikasi web kedai kopi premium (*artisan coffee shop*) yang dibangun dengan menggunakan **Node.js**, **Express.js**, dan database. Aplikasi ini dirancang dengan estetika modern bergaya gelap (*dark mode*) yang mewah, dilengkapi dengan ornamen *glassmorphism* dan micro-animation untuk memberikan pengalaman pengguna yang sangat premium.

Aplikasi ini mencakup halaman utama interaktif untuk pelanggan (menjelajah menu, memesan dari meja/takeaway, menghubungi tim) serta panel dashboard admin yang aman untuk mengelola pesanan masuk, memanipulasi menu (CRUD), dan mengelola pesan kontak.

---

## 🌟 Alasan Mengembangkan Web Ini

Aplikasi web Noctua Coffee dikembangkan atas dasar beberapa alasan utama:
1. **Digitalisasi Pemesanan di Kafe**: Mempermudah proses pemesanan bagi pelanggan secara langsung dari meja mereka melalui perangkat *mobile* masing-masing (*dine-in* maupun *takeaway*) tanpa harus mengantre lama di kasir.
2. **Manajemen Operasional yang Efisien**: Menyediakan alat kelola (*Admin Dashboard*) bagi staf kafe untuk memantau status pesanan (baru, diproses, selesai, batal) secara *real-time* serta melakukan pembaruan menu secara instan.
3. **Eksplorasi Konsep Estetika Premium & PWA**: Merancang aplikasi web yang memiliki kinerja cepat, responsif, ramah seluler, dan mendukung *Progressive Web App* (PWA) agar dapat diinstal di ponsel pintar pengguna.
4. **Pembelajaran Full-Stack Web**: Sebagai proyek implementasi pengembangan web full-stack menggunakan JavaScript di sisi server (Node.js & Express) dan basis data lokal/embedded (NeDB) tanpa memerlukan konfigurasi server database yang kompleks.

---

## 🚀 Fitur Utama

Aplikasi ini dibagi menjadi dua bagian utama: **Halaman Pelanggan (Customer Interface)** dan **Panel Admin (Admin Dashboard)**.

### 1. Halaman Pelanggan (Customer Front-end)
*   **Landing Page Interaktif**: Desain estetik modern gelap (*dark theme*) dengan info jam operasional dinamis (otomatis mendeteksi status buka/tutup kafe).
*   **Menu & Kategori**: Filter menu interaktif (Espresso, Milk-based, Cold Brew, Non-Coffee, Food) dengan visualisasi yang menarik dan efek transisi halus.
*   **Keranjang Belanja & Pemesanan Mandiri**:
    *   Sistem keranjang belanja *client-side* dinamis.
    *   Formulir pemesanan dengan input nama, nomor meja (atau takeaway), dan metode pembayaran (Cash atau QRIS).
    *   Pembuatan ID Invoice unik premium otomatis (contoh: `NC-2026-X839`).
*   **Formulir Kontak**: Halaman khusus untuk pelanggan mengirimkan pesan, saran, atau masukan ke manajemen.
*   **Dukungan PWA (Progressive Web App)**: Dilengkapi dengan berkas `manifest.json` dan *Service Worker* sehingga aplikasi dapat diinstal langsung ke layar utama *smartphone* pengguna.

### 2. Panel Admin (Admin Dashboard)
*   **Autentikasi Staf Keamanan**: Sistem login berbasis sesi (*cookie-based session*) untuk mencegah akses tidak sah ke dashboard admin.
*   **Manajemen Pesanan (Order Management)**:
    *   Melihat daftar pesanan masuk dengan rincian invoice, nama pelanggan, nomor meja, item yang dipesan, metode pembayaran, total bayar, dan waktu pemesanan.
    *   Memperbarui status pesanan (*baru*, *diproses*, *selesai*, *batal*) secara langsung.
    *   Menghapus data pesanan.
*   **Manajemen Menu (CRUD Menu)**:
    *   Menambahkan menu baru (nama, kategori, harga, deskripsi, gambar).
    *   Mengubah data menu yang sudah ada (termasuk status ketersediaan menu).
    *   Menghapus menu dari database.
*   **Manajemen Pesan Kontak**:
    *   Membaca pesan masuk dari pelanggan.
    *   Menandai pesan yang sudah dibaca.
    *   Menghapus pesan kontak.

---

## 🛠️ Teknologi yang Digunakan

*   **Runtime Environment**: Node.js
*   **Web Framework**: Express.js
*   **Database**: NeDB (Embedded NoSQL database yang ramah portabilitas)
*   **Middleware**: Morgan (logging), Cookie-Parser (manajemen sesi), Express Static
*   **Front-end**: HTML5, Vanilla CSS3 (Custom HSL colors, CSS Variables), Modern Vanilla JavaScript (Fetch API, Intersection Observer)
*   **PWA**: Web App Manifest & Service Worker

---

## 👨‍💻 Pembagian Tugas & Tim Pengembang

Proyek ini dibagi secara terstruktur untuk 4 anggota tim demi menjamin integrasi frontend, backend, database, dan aspek pendukung berjalan maksimal:

1. **Moh. Hafiz Mahfud (202451107)** — *Pendahuluan & Tampilan Visual (Frontend / UI)*
   * **Fokus**: Menjelaskan konsep, desain visual, dan interaktivitas halaman pelanggan.
   * **Tugas**:
     * Merancang konsep estetika gelap (*dark luxury aesthetic*) menggunakan Vanilla CSS (`public/css/style.css`).
     * Membuat efek interaktif client-side menggunakan Vanilla JS (`public/js/main.js`) seperti filter kategori menu dan animasi saat scroll (*scroll reveal*).
     * Mengonfigurasi dan menguji fitur PWA (*Progressive Web App*) melalui `public/manifest.json` dan `public/service-worker.js`.

2. **Muhammad Ainun (202451108)** — *Core Server & Sistem Routing (Backend Dasar)*
   * **Fokus**: Menjelaskan mesin utama aplikasi dan sistem penyajian halaman web.
   * **Tugas**:
     * Melakukan setup server Node.js dengan Express.js serta konfigurasi port (`app.js`).
     * Mengatur middleware dasar (seperti `morgan`, `express.json()`, dan static file serving).
     * Membuat sistem *Page Routing* statis untuk melayani halaman HTML (Beranda, Menu, Tentang Kami, Lokasi) dari folder `public`.
     * Menjelaskan arsitektur *Client-Side Rendering* (CSR) yang digunakan web ini untuk memuat data menu secara dinamis melalui Fetch API.

3. **M. Zikri (202451081)** — *REST API & Manajemen Data (Backend Lanjut)*
   * **Fokus**: Menjelaskan jalur komunikasi data dan fitur fungsional.
   * **Tugas**:
     * Mengonfigurasi database tertanam NeDB (`database/db.js`) untuk memuat data menu secara otomatis (*seeding*), data pesanan, dan pesan kontak.
     * Membuat API Endpoint (`routes/api.js`) untuk transaksi menu (CRUD), pengiriman pesanan (`POST /api/orders`), dan pengecekan status buka/tutup toko (`GET /api/status`).
     * Mengintegrasikan proses pengiriman form pesan pelanggan (kontak) ke database backend.

4. **Moh. Khusnul Ibad (202451105)** — *Panel Admin, Konfigurasi & Kesimpulan*
   * **Fokus**: Menjelaskan dashboard administrasi staf kafe, otorisasi, penanganan error, dan dependensi proyek.
   * **Tugas**:
     * Mengelola Panel Admin (`public/admin.html`), sistem autentikasi sesi berbasis cookie (`adminSession`), dan dashboard pemantauan pesanan staf kafe.
     * Mengatur file konfigurasi dan dependensi (`package.json`) seperti `cookie-parser`, `lowdb`/`nedb`, `nodemon`, dan `morgan`.
     * Membuat penanganan halaman tidak ditemukan (custom 404 error page melalui `public/404.html`).
     * Menyusun dokumentasi akhir proyek (README.md) dan merangkum kesimpulan efisiensi performa aplikasi.

---

## 📦 Petunjuk Penggunaan (Cara Menjalankan)

### Prasyarat
Pastikan Anda sudah menginstal **Node.js** di komputer Anda.

### Langkah-Langkah Menjalankan Proyek
1.  **Instalasi Dependensi**:
    Buka terminal di direktori proyek ini dan jalankan perintah:
    ```bash
    npm install
    ```

2.  **Menjalankan Mode Pengembangan (Development)**:
    Untuk menjalankan server dengan auto-reload menggunakan `nodemon`:
    ```bash
    npm run dev
    ```

3.  **Menjalankan Mode Produksi (Production)**:
    Untuk menjalankan server secara standar:
    ```bash
    npm start
    ```

4.  **Akses Aplikasi**:
    *   **Aplikasi Utama (Pelanggan)**: Buka [http://localhost:3000](http://localhost:3000) di browser Anda.
    *   **Dashboard Admin**: Buka [http://localhost:3000/admin](http://localhost:3000/admin).
        *   **Username**: `admin`
        *   **Password**: `admin123`
