# E-commerce Microservices

Proyek ini adalah contoh aplikasi e-commerce berbasis microservices. Dokumentasi ini menyoroti **order-service** dan cara menjalankan serta mengujinya setelah repository di-clone.

## Isi repository

| Service | Teknologi | Alamat lokal |
| --- | --- | --- |
| `product-service` | Node.js, Express, MySQL | `http://localhost:3000` |
| `cart-service` | Laravel, PostgreSQL | `http://localhost:3001` |
| **`order-service`** | **Laravel 13, MySQL** | **`http://localhost:3003`** |
| `ecommerce-ui` | React, Vite | Belum termasuk dalam Docker Compose |
| `review-service` | Python | Belum termasuk dalam Docker Compose |

Docker Compose di root menjalankan tiga backend di tabel serta database masing-masing. Order service berkomunikasi dengan cart dan product service melalui jaringan Docker internal.

## Prasyarat

- Git
- Docker Desktop atau Docker Engine dengan Docker Compose
- Untuk menjalankan test PHP di komputer lokal: PHP 8.3+ dan Composer

## Clone dan jalankan backend

```bash
git clone https://github.com/zahraputri19/enterprise.git
cd enterprise
docker compose up -d --build
```

Jika repository bersifat private, pastikan akun GitHub Anda memiliki akses sebelum melakukan clone.

Order service menunggu database siap, tetapi migrasi tabel order perlu dijalankan satu kali:

```bash
docker compose exec order-service php artisan migrate --force
```

Periksa status service:

```bash
curl http://localhost:3003/api/health
```

Respons yang diharapkan:

```json
{"status":"ok","service":"order-service"}
```

Port lokal:

| Service | Port |
| --- | ---: |
| Product API | `3000` |
| Cart API | `3001` |
| Order API | `3003` |
| Cart database (PostgreSQL) | `5432` |
| Order database (MySQL) | `3307` |

## Fokus: order-service

Order service menangani checkout dengan mengambil isi cart, memvalidasi produk dan stok melalui product service, menghitung total, menyimpan order beserta item dalam transaksi database, lalu meminta cart service mengosongkan cart. Order baru berstatus `PENDING`.

### Endpoint

Semua endpoint order menggunakan prefix `/api`.

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/orders` | Checkout cart dan membuat order |
| `GET` | `/api/orders/{id}` | Mengambil order dan item berdasarkan ID |
| `GET` | `/api/orders/user/{userId}` | Mengambil daftar order user |
| `GET` | `/api/orders/user/{userId}?status=PENDING` | Memfilter order dengan status `PENDING` atau `PAID` |
| `PATCH` | `/api/orders/{id}/pay` | Mengubah order `PENDING` menjadi `PAID` |

Checkout membutuhkan cart berisi produk yang tersedia. Untuk mencoba alur lengkap dari awal, jalankan request berikut secara berurutan menggunakan terminal, curl, atau Insomnia.

Di Windows PowerShell, gunakan `curl.exe` sebagai pengganti `curl` pada contoh berikut agar tidak memanggil alias PowerShell.

**1. Pastikan product service merespons:**

```bash
curl http://localhost:3000/products/1
```

**2. Tambahkan produk pertama ke cart** (user `1`, produk `1`, jumlah `2`):

```bash
curl -X POST http://localhost:3001/api/carts \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"product_id":1,"quantity":2}'
```

**3. Checkout:**

```bash
curl -X POST http://localhost:3003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"user_id":1}'
```

Simpan `data.id` dari respons untuk request berikutnya. Order menyimpan snapshot nama dan harga produk saat checkout; harga total dihitung dari harga produk terkini dikali jumlah.

**4. Lihat detail, daftar, dan bayar order:**

```bash
curl http://localhost:3003/api/orders/1
curl "http://localhost:3003/api/orders/user/1?status=PENDING"
curl -X PATCH http://localhost:3003/api/orders/1/pay
```

Ganti `1` pada URL dengan ID order yang dikembalikan saat checkout. Checkout sukses mengembalikan HTTP `201`; pembayaran sukses mengembalikan HTTP `200`. Payload checkout wajib menyertakan `user_id`. Cart kosong atau stok tidak mencukupi menghasilkan konflik; ID order yang tidak ada menghasilkan `404`.

## Menjalankan automated test order-service

Test Laravel berjalan dengan SQLite in-memory sesuai konfigurasi PHPUnit, sehingga tidak memerlukan database Docker. Dari root repository:

```bash
cd order-service
composer install
composer test
```

Test yang tersedia saat ini adalah test dasar Laravel (smoke test), belum mencakup test otomatis untuk alur checkout, pembayaran, atau integrasi HTTP antarlayanan. Gunakan langkah curl di atas untuk mencoba alur integrasi secara manual setelah Docker Compose aktif.

## Menghentikan service

```bash
docker compose down
```

Data database disimpan dalam Docker volumes dan tetap ada setelah perintah tersebut. Untuk menghapus data lokal beserta volumes:

```bash
docker compose down -v
```

Perintah `down -v` menghapus data database development lokal. Jangan jalankan jika data tersebut ingin dipertahankan.
