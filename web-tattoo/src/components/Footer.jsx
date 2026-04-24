import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { useStudioMcp } from '../context/StudioMcpContext';

const GOLD = '#D4AA5A';
const MUTED = 'rgba(255,255,255,0.38)';
const FONT = 'Inter, system-ui, sans-serif';

const label = {
  fontFamily: FONT,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.26em',
  textTransform: 'uppercase',
  color: GOLD,
  marginBottom: 18,
  display: 'block',
};

const linkStyle = {
  fontFamily: FONT,
  fontSize: 14,
  color: MUTED,
  textDecoration: 'none',
  lineHeight: 1.5,
  transition: 'color 0.18s',
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const secretaryUrl = import.meta.env.VITE_SECRETARY_URL || '/web';
  const { studio, artists } = useStudioMcp();

  return (
    <footer
      style={{
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
        background: '#060606',
        fontFamily: FONT,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>

        {/* ── Grid principal ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.7fr 0.85fr 0.95fr',
            gap: 48,
            padding: '72px 0 60px',
          }}
        >

          {/* Col 1 — Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'block', width: 24, height: '0.5px', background: GOLD }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: GOLD, fontFamily: FONT }}>
                Skin Art Tattoo
              </span>
            </div>

            {/* Tagline */}
            <h4
              style={{
                margin: 0,
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.35,
                letterSpacing: '-0.01em',
                textTransform: 'none',
                color: 'rgba(255,255,255,0.88)',
                maxWidth: 300,
              }}
            >
              {studio.name} mezcla look editorial, agenda conectada y un feed listo para convertir.
            </h4>

            {/* Descripción */}
            <p
              style={{
                margin: 0,
                fontFamily: FONT,
                fontSize: 13,
                lineHeight: 1.72,
                color: MUTED,
                maxWidth: 300,
                textTransform: 'none',
              }}
            >
              {studio.accentLine} El frontend ahora consume una capa MCP para artistas, galería y citas sin romper la base actual.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {[
                { href: studio.instagramUrl, icon: <FaInstagram size={15} />, label: 'Instagram' },
                { href: studio.instagramUrl, icon: <FaXTwitter size={14} />, label: 'X' },
                { href: studio.instagramUrl, icon: <FaFacebookF size={14} />, label: 'Facebook' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: 9999,
                    border: '0.5px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    transition: 'border-color 0.18s, color 0.18s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,170,90,0.5)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Navegación */}
          <div>
            <span style={label}>Navegación</span>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { to: '/', text: 'Inicio', internal: true },
                { to: '/auth?mode=register', text: 'Registro portal', internal: true },
                { to: '/portal', text: 'Portal cliente', internal: true },
                { to: '/services', text: 'Servicios', internal: true },
                { to: secretaryUrl, text: 'Área secretaría', internal: false },
              ].map((item) => (
                <li key={item.text}>
                  {item.internal ? (
                    <Link
                      to={item.to}
                      style={linkStyle}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = MUTED}
                    >
                      {item.text}
                    </Link>
                  ) : (
                    <a
                      href={item.to}
                      style={linkStyle}
                      onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                      onMouseLeave={e => e.currentTarget.style.color = MUTED}
                    >
                      {item.text}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contacto */}
          <div>
            <span style={label}>Contacto</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: <FiMapPin size={13} />, text: 'Av. Ink District 123, Santa Cruz' },
                { icon: <FiPhone size={13} />, text: studio.phone },
                { icon: <FiMail size={13} />, text: 'hola@skinarttattoo.studio' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: GOLD, flexShrink: 0, marginTop: 1 }}>{row.icon}</span>
                  <span style={{ fontFamily: FONT, fontSize: 13, color: MUTED, lineHeight: 1.55 }}>
                    {row.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4 — Ritmo del estudio */}
          <div>
            <span style={label}>Ritmo del estudio</span>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                studio.hours,
                `${artists.length} artistas activos en el feed`,
                'Revisión de citas en menos de 24 h',
              ].map((item, i) => (
                <li key={i} style={{ fontFamily: FONT, fontSize: 13, color: MUTED, lineHeight: 1.55 }}>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={studio.instagramUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 22,
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
                textDecoration: 'none',
                transition: 'color 0.18s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
            >
              Abrir Instagram <FiArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          style={{
            borderTop: '0.5px solid rgba(255,255,255,0.07)',
            padding: '20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ margin: 0, fontFamily: FONT, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
            © {currentYear} {studio.name}. Frontend premium conectado a portal, galería y agenda.
          </p>
          <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>
            SAT Studio
          </span>
        </div>
      </div>
    </footer>
  );
}