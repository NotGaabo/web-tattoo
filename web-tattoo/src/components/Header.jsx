import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiArrowUpRight, FiLogOut, FiMenu, FiShoppingCart, FiUser, FiX } from 'react-icons/fi';
import { useAuthStore, useCartStore, useUIStore } from '../context/store';
import { useStudioMcp } from '../context/StudioMcpContext';
import odooAuthService from '../services/odooAuth';

const GOLD = '#D4AA5A';
const FONT = 'Inter, system-ui, sans-serif';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const toggleCart = useUIStore((state) => state.toggleCart);
  const showNotification = useUIStore((state) => state.showNotification);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearSession = useAuthStore((state) => state.clearSession);
  const { studio } = useStudioMcp();
  const sessionPath = user?.role === 'portal' ? '/portal' : '/gestion';
  const sessionLabel = user?.role === 'portal' ? 'Portal' : 'Gestion';

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const navItems = [
    { to: '/', label: 'Inicio' },
    { to: '/products', label: 'Tienda' },
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

  const iconBtn = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 9999,
    border: '0.5px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.55)',
    cursor: 'pointer',
    transition: 'border-color 0.18s, color 0.18s',
    flexShrink: 0,
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        background: 'rgba(5,5,5,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 68,
          gap: 32,
        }}
      >

        {/* ── Logo ── */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 9999,
              border: '0.5px solid rgba(212,170,90,0.3)',
              background: 'linear-gradient(135deg, rgba(212,170,90,0.2) 0%, rgba(255,255,255,0.06) 100%)',
              flexShrink: 0,
            }}
          >
            <img src="/skin-art-symbol.svg" alt="Skin Art Tattoo" style={{ width: 22, height: 22, objectFit: 'contain' }} />
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.92)',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {studio.name}
            </span>
            <span
              style={{
                fontFamily: FONT,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.28)',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Portal + agenda premium
            </span>
          </div>
        </Link>

        {/* ── Nav desktop ── */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            flex: 1,
            justifyContent: 'center',
          }}
          className="hidden md:flex"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: isActive ? GOLD : 'rgba(255,255,255,0.45)',
                transition: 'color 0.18s',
                whiteSpace: 'nowrap',
              })}
              onMouseEnter={e => { if (!e.currentTarget.dataset.active) e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
              onMouseLeave={e => { if (!e.currentTarget.dataset.active) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {/* CTA Reservar */}
          <Link
            to="/appointment"
            className="hidden md:inline-flex"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              borderRadius: 9999,
              border: `0.5px solid rgba(212,170,90,0.45)`,
              background: 'rgba(212,170,90,0.1)',
              padding: '8px 16px',
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: GOLD,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'border-color 0.18s, background 0.18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.background = 'rgba(212,170,90,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,170,90,0.45)'; e.currentTarget.style.background = 'rgba(212,170,90,0.1)'; }}
          >
            Reservar cita <FiArrowUpRight size={13} />
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <>
              <Link
                to={sessionPath}
                className="hidden md:inline-flex"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  borderRadius: 9999,
                  border: '0.5px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '8px 14px',
                  fontFamily: FONT,
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  transition: 'color 0.18s',
                }}
                onClick={() => setMenuOpen(false)}
              >
                <FiUser size={14} />
                {user?.name?.split(' ')[0] || sessionLabel}
              </Link>
              <button
                type="button"
                style={{ ...iconBtn, background: 'none', border: '0.5px solid rgba(255,255,255,0.08)' }}
                onClick={handleLogout}
                aria-label="Cerrar sesion"
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,170,90,0.4)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
              >
                <FiLogOut size={16} />
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="hidden md:inline-flex"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 9999,
                border: '0.5px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                padding: '8px 16px',
                fontFamily: FONT,
                fontSize: 12,
                color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'color 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
              onClick={() => setMenuOpen(false)}
            >
              Login / Registro
            </Link>
          )}

          {/* Carrito */}
          <button
            style={{ ...iconBtn, position: 'relative' }}
            onClick={toggleCart}
            aria-label="Carrito de compras"
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,170,90,0.4)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
          >
            <FiShoppingCart size={17} />
            {cartItemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 18,
                  height: 18,
                  borderRadius: 9999,
                  background: GOLD,
                  fontSize: 9,
                  fontWeight: 800,
                  color: '#0a0a0a',
                  fontFamily: FONT,
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Hamburger mobile */}
          <button
            className="md:hidden"
            style={iconBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,170,90,0.4)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div
          style={{
            margin: '0 16px 12px',
            borderRadius: 20,
            border: '0.5px solid rgba(255,255,255,0.08)',
            background: 'rgba(10,10,10,0.97)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: isActive ? GOLD : 'rgba(255,255,255,0.55)',
              })}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
          <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.07)' }} />
          <Link
            to="/appointment"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: GOLD,
              textDecoration: 'none',
            }}
            onClick={() => setMenuOpen(false)}
          >
            Reservar cita <FiArrowUpRight size={13} />
          </Link>
        </div>
      )}
    </header>
  );
}
