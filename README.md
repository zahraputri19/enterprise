# E-commerce Microservices

Proyek ini adalah contoh aplikasi e-commerce berbasis microservices. Dokumentasi ini mencakup arsitektur keseluruhan layanan, cara menjalankan serta menguji backend (`product-service`, `cart-service`, `order-service`, `review-service`), dan antarmuka frontend (`ecommerce-ui`).

## Isi repository

| Service | Teknologi | Alamat lokal | Keterangan |
| --- | --- | --- | --- |
| `product-service` | Node.js, Express, MySQL | `http://localhost:3000` | Katalog & stok produk (Docker Compose root) |
| `cart-service` | Laravel, PostgreSQL | `http://localhost:3001` | Keranjang belanja (Docker Compose root) |
| **`order-service`** | **Laravel 13, MySQL** | **`http://localhost:3003`** | **Checkout & transaksi order (Docker Compose root)** |
| **`review-service`** | **Python (Flask), MongoDB** | **`http://localhost:3002`** | **Ulasan & rating produk (Compose terpisah)** |
| **`ecommerce-ui`** | **React, Vite** | **`http://localhost:5173`** | **Frontend UI & agregasi data di sisi client** |

Docker Compose di root menjalankan tiga backend pertama beserta database masing-masing. Order service berkomunikasi dengan cart dan product service melalui jaringan Docker internal, sedangkan `review-service` dijalankan dari direktorinya sendiri dan dihubungkan ke jaringan Docker internal tersebut.

## Prasyarat

- Git
- Docker Desktop atau Docker Engine dengan Docker Compose
- Node.js 20+ dan npm (untuk menjalankan `ecommerce-ui`)
- Untuk menjalankan test PHP di komputer lokal: PHP 8.3+ dan Composer

## Clone dan jalankan backend

```bash
git clone [https://github.com/zahraputri19/enterprise.git](https://github.com/zahraputri19/enterprise.git)
cd enterprise
docker compose up -d --build