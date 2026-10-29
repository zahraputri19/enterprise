# Order Service (Microservices Architecture)

`order-service` adalah microservice berbasis **Laravel 11** yang menangani alur transaksi checkout, pembuatan pesanan, verifikasi stok produk, serta kalkulasi total harga secara konsisten. Service ini terintegrasi dengan `cart-service` dan `product-service` menggunakan HTTP Client.

---

## 🛠️ Arsitektur & Teknologi

* **Framework**: Laravel 11
* **Database**: MySQL (`orderdb`)
* **Containerization**: Docker & Docker Compose
* **Port HTTP**: `3003` (Container mapping ke port internal `8000`)
* **Port Database**: `3307` (MySQL)

---

## 🚀 Alur Transaksi Checkout

1. Client mengirim request `POST /api/orders` dengan `user_id`.
2. Service menghubungi `cart-service` untuk mengambil item keranjang user.
3. Service menghubungi `product-service` untuk memverifikasi harga dan ketersediaan stok setiap barang.
4. Jika stok mencukupi, order dan order items akan dibuat dalam transaksi database (`DB::transaction`).
5. Service meminta `cart-service` untuk mengosongkan keranjang user setelah order berhasil disimpan.

---

## 📌 Endpoint API

| Method | Endpoint | Deskripsi | Status Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Membuat pesanan baru (Checkout) | `201 Created` |
| `GET` | `/api/orders/{id}` | Mengambil detail pesanan berdasarkan ID | `200 OK` / `404` |
| `GET` | `/api/orders/user/{userId}` | Mengambil daftar pesanan milik user (Support query parameter `?status=PENDING`) | `200 OK` |
| `PATCH` | `/api/orders/{id}/pay` | Mengubah status pesanan PENDING menjadi PAID | `200 OK` / `409` |
| `GET` | `/api/health` | Health check endpoint | `200 OK` |

---

## ⚙️ Cara Menjalankan Service (Docker)

1. Pastikan Docker Desktop sudah aktif.
2. Jalankan perintah berikut dari root project:
   ```bash
   docker compose up -d --build order-service order-db