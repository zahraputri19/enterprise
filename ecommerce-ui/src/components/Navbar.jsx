// src/components/Navbar.jsx
// Menu navigasi dan pemilih user. Belum ada login, jadi user dipilih manual.
import { NavLink } from 'react-router-dom'

const USERS = [1, 2, 3, 4, 5]

export default function Navbar({ userId, onUserChange, search, onSearchChange }) {
  return (
    <>
      <header className="navbar">
        <NavLink to="/" end className="brand" aria-label="Toko Online Zahra, beranda">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none">
              <path d="M7 11h18l-1.6 16H8.6L7 11Z" fill="currentColor" />
              <path d="M12 12V9a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <path d="m12 18 2.5 2.5L20 15" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <strong>Toko Online Zahra</strong>
        </NavLink>

        <nav className="main-nav" aria-label="Navigasi utama">
          <a href="#categories">Kategori <span aria-hidden="true">⌄</span></a>
          <a href="#products">Promo</a>
          <a href="#products">Produk terbaru</a>
          <a href="#products">Jelajahi</a>
        </nav>

        <label className="search-box">
          <span className="sr-only">Cari produk</span>
          <input
            type="search"
            placeholder="Cari produk..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </label>

        <label className="user">
          <span className="user-icon" aria-hidden="true">♙</span>
          <span className="user-label">Akun</span>
          <select
            aria-label="Pilih user"
            value={userId}
            onChange={(event) => onUserChange(Number(event.target.value))}
          >
            {USERS.map((id) => (
              <option key={id} value={id}>
                User {id}
              </option>
            ))}
          </select>
        </label>
        <NavLink to="/cart" className="cart-link" aria-label="Keranjang">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 4h2l2.2 11.1a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="20" r="1.2" fill="currentColor" />
            <circle cx="18" cy="20" r="1.2" fill="currentColor" />
          </svg>
          <span>Keranjang</span>
        </NavLink>
      </header>
    </>
  )
}