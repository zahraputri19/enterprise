# Order Service

Order service adalah Laravel 13 microservice yang menangani checkout dan status order. Service menggunakan MySQL untuk menyimpan order dan order items, serta HTTP untuk berkomunikasi dengan cart service dan product service.

## Menjalankan melalui Docker Compose

Jalankan perintah dari root repository:

```bash
docker compose up -d --build
docker compose exec order-service php artisan migrate --force
```

Compose juga menjalankan product service dan cart service, yang dibutuhkan untuk checkout. Order API tersedia di `http://localhost:3003`; port MySQL order database dari host adalah `3307`.

Health check:

```bash
curl http://localhost:3003/api/health
```

Untuk instruksi clone repository dan langkah uji end-to-end checkout, lihat [README utama](../README.md#fokus-order-service).

## Endpoint

| Method | Endpoint | Keterangan |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `POST` | `/api/orders` | Membuat order dari cart user; body: `{"user_id":1}` |
| `GET` | `/api/orders/{id}` | Mengambil order dan item |
| `GET` | `/api/orders/user/{userId}` | Mengambil daftar order user |
| `GET` | `/api/orders/user/{userId}?status=PENDING` | Filter status `PENDING` atau `PAID` |
| `PATCH` | `/api/orders/{id}/pay` | Membayar order yang masih `PENDING` |

Order baru berstatus `PENDING`. Checkout memvalidasi stok dan harga melalui product service, menyimpan order dan item dalam transaksi database, lalu meminta cart service mengosongkan cart. Order yang sudah bukan `PENDING` tidak dapat dibayar lagi.

## Test

Untuk menjalankan test Laravel secara lokal, gunakan PHP 8.3+ dan Composer. Dari folder ini:

```bash
composer install
composer test
```

Test menggunakan SQLite in-memory. Test yang tersedia masih berupa smoke test dasar; uji integrasi checkout dapat dilakukan dengan langkah pada README utama.
