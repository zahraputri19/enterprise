// src/pages/ProductListPage.jsx
// Halaman daftar produk: data produk dari product-service, rating dari review-service.
import { useState } from 'react'
import { getProductsWithRating } from '../api/aggregate'
import AsyncView from '../components/AsyncView'
import ProductCard from '../components/ProductCard'
import { useAsync } from '../hooks/useAsync'
import { getProductVisual } from '../utils/productVisual'

// // [TAMBAHAN UI] Menerima prop userId dari App.jsx
export default function ProductListPage({ userId, search = '', onSearchChange }) {
  const { loading, data, error, reload } = useAsync(getProductsWithRating)
  const [category, setCategory] = useState('Semua')
  const [sort, setSort] = useState('recommended')

  const categories = ['Semua', ...new Set((data || []).map((product) => getProductVisual(product.name).tag))]
  const products = (data || [])
    .filter((product) => product.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((product) => category === 'Semua' || getProductVisual(product.name).tag === category)
    .sort((a, b) => {
      if (sort === 'price-low') return Number(a.price) - Number(b.price)
      if (sort === 'price-high') return Number(b.price) - Number(a.price)
      if (sort === 'rating') return Number(b.rating?.average_rating || 0) - Number(a.rating?.average_rating || 0)
      return 0
    })

  return (
    <section className="storefront">
      <section className="hero" aria-label="Promo pilihan Toko Online Zahra">
        <div className="hero-copy">
          <span className="hero-kicker">PILIHAN MINGGU INI</span>
          <h1>Upgrade harimu dengan pilihan terbaik</h1>
          <p>Temukan perangkat favorit dengan harga spesial, hanya di Toko Online Zahra.</p>
          <a className="hero-button" href="#products">Belanja sekarang <span aria-hidden="true">→</span></a>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-orbit hero-orbit-one" />
          <span className="hero-orbit hero-orbit-two" />
          <span className="hero-product">🎧</span>
          <span className="hero-spark hero-spark-one">✦</span>
          <span className="hero-spark hero-spark-two">✦</span>
        </div>
      </section>

      <section id="categories" className="catalog" aria-label="Daftar produk">
        <div className="catalog-tools">
          <div className="category-list" aria-label="Filter kategori">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={`filter-chip${category === item ? ' selected' : ''}`}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
                {item === 'Semua' && <span className="filter-icon" aria-hidden="true">⌄</span>}
              </button>
            ))}
          </div>
          <label className="sort-control">
            <span>Urutkan</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="recommended">Rekomendasi</option>
              <option value="price-low">Harga terendah</option>
              <option value="price-high">Harga tertinggi</option>
              <option value="rating">Rating tertinggi</option>
            </select>
          </label>
        </div>

        <div className="section-heading" id="products">
          <div>
            <p className="section-eyebrow">KURASI KHUSUS UNTUKMU</p>
            <h2>Produk pilihan</h2>
          </div>
          {!loading && !error && <span className="product-count">{products.length} produk</span>}
        </div>

        <AsyncView loading={loading} error={error} onRetry={reload}>
          {data && products.length > 0 && (
            <div className="grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} userId={userId} />
              ))}
            </div>
          )}
          {data && products.length === 0 && (
            <div className="empty-products">
              <span aria-hidden="true">⌕</span>
              <h3>Produk belum ditemukan</h3>
              <p>Coba kata kunci atau kategori lain.</p>
              <button
                type="button"
                onClick={() => {
                  setCategory('Semua')
                  onSearchChange('')
                }}
              >
                Hapus filter
              </button>
            </div>
          )}
        </AsyncView>
      </section>
    </section>
  )
}