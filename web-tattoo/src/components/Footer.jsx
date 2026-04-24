import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const secretaryUrl = import.meta.env.VITE_SECRETARY_URL || '/web';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <span className="eyebrow">Ink House</span>
            <h4>Arte con aguja, portal para clientes y operativa conectada a Odoo.</h4>
            <p>
              Un estudio pensado para convertir cotizaciones, reservas y seguimiento en una
              experiencia mas limpia y mas potente.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="X"><FaXTwitter /></a>
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            </div>
          </div>

          <div className="footer-section">
            <h5>Navegacion</h5>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/auth?mode=register">Registro portal</Link></li>
              <li><Link to="/portal">Portal cliente</Link></li>
              <li><Link to="/services">Servicios</Link></li>
              <li><a href={secretaryUrl}>Area secretaria</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h5>Contacto</h5>
            <div className="contact-info">
              <div className="contact-item">
                <FiMapPin />
                <span>Av. Ink District 123, Santa Cruz</span>
              </div>
              <div className="contact-item">
                <FiPhone />
                <span>+591 700 000 00</span>
              </div>
              <div className="contact-item">
                <FiMail />
                <span>portal@inkhouse.studio</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h5>Ritmo del estudio</h5>
            <ul>
              <li>Lunes a Viernes: 10:00 - 20:00</li>
              <li>Sabado: 11:00 - 21:00</li>
              <li>Revision de cotizaciones: 24 horas</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Ink House. Frontend listo para portal, cotizaciones y estilo tattoo.</p>
        </div>
      </div>
    </footer>
  );
}
