import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { useStudioMcp } from '../context/StudioMcpContext';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const secretaryUrl = import.meta.env.VITE_SECRETARY_URL || '/web';
  const { studio, artists } = useStudioMcp();

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <div className="site-footer__eyebrow">
              <span className="site-footer__eyebrow-line" />
              <span>Skin Art Tattoo</span>
            </div>

            <h4 className="site-footer__title">
              {studio.name} mezcla look editorial, agenda conectada y un feed listo para convertir.
            </h4>

            <p className="site-footer__copy">
              {studio.accentLine} El frontend ahora consume una capa MCP para artistas, galeria y citas sin romper la base actual.
            </p>

            <div className="site-footer__socials">
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
                  className="site-footer__social-link"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="site-footer__column">
            <span className="site-footer__label">Navegacion</span>
            <ul className="site-footer__list">
              {[
                { to: '/', text: 'Inicio', internal: true },
                { to: '/auth?mode=register', text: 'Registro', internal: true },
                { to: '/services', text: 'Servicios', internal: true },

              ].map((item) => (
                <li key={item.text}>
                  {item.internal ? (
                    <Link to={item.to} className="site-footer__link">
                      {item.text}
                    </Link>
                  ) : (
                    <a href={item.to} className="site-footer__link">
                      {item.text}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer__column">
            <span className="site-footer__label">Contacto</span>
            <div className="site-footer__contact">
              {[
                { icon: <FiMapPin size={13} />, text: studio.address || 'Escribenos para compartirte la direccion del estudio.' },
                { icon: <FiPhone size={13} />, text: studio.phone },
                { icon: <FiMail size={13} />, text: 'hola@skinarttattoo.studio' },
              ].map((row, i) => (
                <div key={i} className="site-footer__contact-row">
                  <span className="site-footer__contact-icon">{row.icon}</span>
                  <span className="site-footer__contact-text">{row.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="site-footer__column">
            <span className="site-footer__label">Ritmo del estudio</span>
            <ul className="site-footer__list">
              {[studio.hours, `${artists.length} artistas activos en el feed`, 'Revision de citas en menos de 24 h'].map((item, i) => (
                <li key={i} className="site-footer__meta">
                  {item}
                </li>
              ))}
            </ul>

            <a href={studio.instagramUrl} target="_blank" rel="noreferrer" className="site-footer__instagram">
              Abrir Instagram <FiArrowUpRight size={13} />
            </a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__bottom-copy">
            &copy; {currentYear} {studio.name}. Web conectada a galeria, agenda y gestion interna.
          </p>
          <span className="site-footer__bottom-mark">SAT Studio</span>
        </div>
      </div>
    </footer>
  );
}
