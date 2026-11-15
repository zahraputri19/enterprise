// src/components/ProductCard.jsx
// Satu kartu produk di halaman daftar.
import { useState } from 'react' // // [TAMBAHAN UI] State lokal untuk status tombol tambah keranjang
import { Link } from 'react-router-dom'
import { addToCart } from '../api/cartApi' // // [TAMBAHAN UI] Memakai fungsi addToCart bawaan yang sudah ada
import { formatRupiah } from '../utils/format'
import { getProductVisual } from '../utils/productVisual'
import StarRating from './StarRating'

export default function ProductCard({ product, userId }) {
  const { id, name, price, stock, rating } = product
  const visual = getProductVisual(name) // // [TAMBAHAN UI] Ambil ikon sesuai nama barang

  // // [TAMBAHAN UI] State untuk loading & notifikasi singkat saat ikon keranjang diklik
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [favorite, setFavorite] = useState(false)

  // // [TAMBAHAN UI] Handler klik tombol ikon keranjang langsung dari kartu produk
  async function handleQuickAdd() {
    setAdding(true)
    try {
      await addToCart(userId, Number(id), 1)
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      alert('Gagal menambahkan produk ke keranjang.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <article className="card">
      <div className="card-thumb">
        <Link to={`/products/${id}`} className="card-image-link" aria-label={`Lihat detail ${name}`}>
          <span className="card-icon" aria-hidden="true">{visual.icon}</span>
        </Link>
        <span className="card-tag">{visual.tag}</span>
        <button
          type="button"
          className={`favorite-button${favorite ? ' is-favorite' : ''}`}
          aria-label={favorite ? `Hapus ${name} dari favorit` : `Tambahkan ${name} ke favorit`}
          aria-pressed={favorite}
          onClick={() => setFavorite((current) => !current)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 8.8c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.6 4.6 0 0 1 8.8-1.9 4.6 4.6 0 0 1 8.8 1.9Z" />
          </svg>
        </button>
      </div>

      <div className="card-body">
        <h3>
          <Link to={`/products/${id}`}>{name}</Link>
        </h3>
        <p className="price">{formatRupiah(price)}</p>
        {rating ? (
          <StarRating average={rating.average_rating} total={rating.total_reviews} />
        ) : (
          <span className="muted rating-unavailable">Rating belum tersedia</span>
        )}
        <p className="muted stock-label">{stock > 0 ? `Stok tersedia: ${stock}` : 'Stok habis'}</p>
      </div>

      <div className="card-footer">
        <button
          type="button"
          className={`btn-cart ${added ? 'btn-cart-added' : ''}`}
          disabled={adding || stock <= 0}
          onClick={handleQuickAdd}
          title="Masukkan 1 item ke keranjang"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span>{adding ? 'Menambahkan...' : added ? '✓ Ditambahkan' : 'Tambah ke keranjang'}</span>
        </button>
      </div>
    </article>
  )
}