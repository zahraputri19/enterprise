# Product Service

## Menjalankan service

Dari folder root proyek (`D:\Project1`), jalankan:

```bash
docker compose up --build
```

API tersedia di `http://localhost:3000`. Health check dapat diperiksa melalui
`GET /health`.

> Data awal hanya dimasukkan ketika volume MySQL dibuat untuk pertama kali.
> Untuk menginisialisasi ulang data, hentikan service lalu jalankan
> `docker compose down -v` sebelum `docker compose up --build`.

## Endpoint

Semua request body menggunakan JSON:

- `GET /products` mengambil semua product.
- `GET /products/:id` mengambil satu product.
- `POST /products` membuat product. Body:
  `{"name":"Keyboard","description":"Mechanical","price":150000,"stock":10}`
- `PUT /products/:id` mengganti data product. Body menggunakan format yang sama
  seperti POST.
- `DELETE /products/:id` menghapus product.

`name`, `price`, dan `stock` wajib diisi. `price` harus berupa angka minimal
0, sedangkan `stock` harus berupa bilangan bulat minimal 0.

## Pengujian dengan Insomnia

1. Buat workspace baru dan environment (opsional) dengan variabel
   `base_url` bernilai `http://localhost:3000`.
2. Buat request `GET {{ _.base_url }}/products/1`, lalu klik **Send**.
3. Buat request `POST {{ _.base_url }}/products`, pilih **Body > JSON**, isi
   payload contoh di atas, lalu klik **Send**. Simpan ID dari response.
4. Buat request `PUT {{ _.base_url }}/products/{id}`, gunakan JSON payload
   yang sudah diperbarui, lalu klik **Send**.
5. Buat request `DELETE {{ _.base_url }}/products/{id}`, lalu klik **Send**.
6. Pastikan response masing-masing menunjukkan status `200` atau `201`, dan
   uji juga ID yang tidak ada untuk memastikan response `404`.

Untuk membagikan hasil pengujian, klik menu workspace atau nama workspace,
pilih **Export**, pilih workspace/request yang ingin dibagikan, lalu simpan
file ekspor `.json`. Bagikan file tersebut melalui media yang aman. Penerima
dapat memilih **Import** di Insomnia dan membuka file itu. Jangan memasukkan
password database, token, atau secret ke dalam export.
