import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut, FiMenu, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import { useAuthStore, useCartStore, useUIStore } from '../context/store';
import odooAuthService from '../services/odooAuth';
import './Header.css';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const toggleCart = useUIStore((state) => state.toggleCart);
  const showNotification = useUIStore((state) => state.showNotification);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearSession = useAuthStore((state) => state.clearSession);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navItems = [
    { to: '/', label: 'Inicio' },
    { to: '/products', label: 'Aftercare' },
    { to: '/services', label: 'Servicios' },
    { to: '/artists', label: 'Artistas' },
    { to: '/contact', label: 'Contacto' },
  ];

  const handleLogout = async () => {
    try {
      await odooAuthService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      clearSession();
      showNotification('Sesion cerrada.', 'info');
      setMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <span className="logo-mark">IH</span>
          <div className="logo-copy">
            <span className="logo-text">Ink House</span>
            <small>Portal & studio</small>
          </div>
        </Link>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link to="/portal" className="header-chip" onClick={() => setMenuOpen(false)}>
                <FiUser size={16} />
                <span>{user?.name?.split(' ')[0] || 'Portal'}</span>
              </Link>
              <button type="button" className="icon-btn" onClick={handleLogout} aria-label="Cerrar sesion">
                <FiLogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/auth" className="header-auth-link" onClick={() => setMenuOpen(false)}>
              Login / Registro
            </Link>
          )}

          <button className="icon-btn cart-btn" onClick={toggleCart} aria-label="Carrito de compras">
            <FiShoppingCart size={20} />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </button>

          <button
            className="icon-btn menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
