import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiLogOut, FiMenu, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import { useAuthStore, useCartStore, useUIStore } from '../context/store';
import { useStudioMcp } from '../context/StudioMcpContext';
import odooAuthService from '../services/odooAuth';
import './Header.css';

const GOLD = '#D4AA5A';
const FONT = 'Inter, system-ui, sans-serif';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const toggleCart = useUIStore((state) => state.toggleCart);
  const showNotification = useUIStore((state) => state.showNotification);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { studio } = useStudioMcp();
  const isPortalUser = user?.role === 'portal' || user?.is_portal;

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navItems = [
    { to: '/', label: 'Inicio' },
    { to: '/products', label: 'Aftercare' },
    { to: '/services', label: 'Servicios' },
    { to: '/artists', label: 'Artistas' },
    { to: '/contact', label: 'Contacto' },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

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

  const iconBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
    borderRadius: 9999,
    border: '0.5px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.55)',
    cursor: 'pointer',
    transition: 'border-color 0.18s, color 0.18s, background 0.18s',
    flexShrink: 0,
  };

  const mobileLinkStyle = ({ isActive }) => ({
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    color: isActive ? GOLD : 'rgba(255,255,255,0.72)',
    padding: '14px 0',
    borderBottom: '0.5px solid rgba(255,255,255,0.07)',
  });

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__left">
            <button
              type="button"
              className="site-header__menu-toggle"
              style={iconBtn}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,170,90,0.4)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
              }}
            >
              {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>

            <Link to="/" className="site-header__brand">
              <span className="site-header__brand-mark">
                <img src="/skin-art-symbol.svg" alt="Skin Art Tattoo" style={{ width: 22, height: 22, objectFit: 'contain' }} />
              </span>
              <span className="site-header__brand-name">{studio.name}</span>
            </Link>
          </div>

          <nav className="site-header__nav" aria-label="Navegacion principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="site-header__nav-link"
                style={({ isActive }) => ({
                  fontFamily: FONT,
                  color: isActive ? GOLD : 'rgba(255,255,255,0.45)',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="site-header__actions">
            <Link to="/appointment" className="site-header__reserve">
              Reservar cita <FiArrowUpRight size={13} />
            </Link>

            {isAuthenticated ? (
              <>
                {isPortalUser ? (
                  <span className="site-header__portal" aria-disabled="true">
                    <FiUser size={14} />
                    {user?.name?.split(' ')[0] || 'Portal'}
                  </span>
                ) : (
                  <Link to="/gestion" className="site-header__portal">
                    <FiUser size={14} />
                    {user?.name?.split(' ')[0] || 'Gestion'}
                  </Link>
                )}
                <button
                  type="button"
                  style={{ ...iconBtn, background: 'none', border: '0.5px solid rgba(255,255,255,0.08)' }}
                  onClick={handleLogout}
                  aria-label="Cerrar sesion"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(212,170,90,0.4)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                  }}
                >
                  <FiLogOut size={16} />
                </button>
              </>
            ) : (
              <Link to="/auth" className="site-header__auth-link">
                Login / Registro
              </Link>
            )}

            <button
              type="button"
              className="site-header__cart"
              style={{ ...iconBtn, position: 'relative' }}
              onClick={toggleCart}
              aria-label="Carrito de compras"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,170,90,0.4)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
              }}
            >
              <FiShoppingCart size={17} />
              {cartItemCount > 0 && (
                <span className="site-header__cart-badge">{cartItemCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={`site-drawer-backdrop ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(false)} />

      <aside
        id="mobile-nav-drawer"
        className={`site-drawer ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="site-drawer__header">
          <Link to="/" className="site-drawer__brand" onClick={() => setMenuOpen(false)}>
            <span className="site-header__brand-mark">
              <img src="/skin-art-symbol.svg" alt="Skin Art Tattoo" style={{ width: 22, height: 22, objectFit: 'contain' }} />
            </span>
            <span className="site-header__brand-name">{studio.name}</span>
          </Link>
          <button
            type="button"
            style={iconBtn}
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menu"
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="site-drawer__nav" aria-label="Menu movil">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} style={mobileLinkStyle}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-drawer__footer">
          <Link to="/appointment" className="site-drawer__cta" onClick={() => setMenuOpen(false)}>
            Reservar cita <FiArrowUpRight size={14} />
          </Link>

          {isAuthenticated ? (
            <>
              {isPortalUser ? (
                <span className="site-drawer__secondary" aria-disabled="true">
                  <FiUser size={15} />
                  {user?.name?.split(' ')[0] || 'Portal'}
                </span>
              ) : (
                <Link to="/gestion" className="site-drawer__secondary" onClick={() => setMenuOpen(false)}>
                  <FiUser size={15} />
                  {user?.name?.split(' ')[0] || 'Gestion'}
                </Link>
              )}
              <button type="button" className="site-drawer__secondary" onClick={handleLogout}>
                <FiLogOut size={15} />
                Cerrar sesion
              </button>
            </>
          ) : (
            <Link to="/auth" className="site-drawer__secondary" onClick={() => setMenuOpen(false)}>
              <FiUser size={15} />
              Login / Registro
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
