import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore, useUIStore } from '../context/store';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import './Header.css';

/**
 * Componente Header - Navegación principal
 * Incluye logo, menú y carrito de compras
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItems = useCartStore(state => state.items);
  const toggleCart = useUIStore(state => state.toggleCart);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="container header-content">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-text">TATTOO STUDIO</span>
        </Link>

        {/* Menú - Desktop */}
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>Productos</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Servicios</Link>
          <Link to="/artists" onClick={() => setMenuOpen(false)}>Tatuadores</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contacto</Link>
        </nav>

        {/* Carrito y Menú Móvil */}
        <div className="header-actions">
          <button 
            className="cart-btn"
            onClick={toggleCart}
            aria-label="Carrito de compras"
          >
            <FiShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>

          {/* Botón menú móvil */}
          <button 
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
