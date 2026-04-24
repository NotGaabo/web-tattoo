import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';
import './Footer.css';

/**
 * Componente Footer - Información de contacto y enlaces
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Información de la empresa */}
          <div className="footer-section">
            <h4>TATTOO STUDIO</h4>
            <p>Tu estudio de tatuajes de confianza. Diseños únicos y profesionales.</p>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" aria-label="Facebook"><FiFacebook /></a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="footer-section">
            <h5>Enlaces Rápidos</h5>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/products">Productos</Link></li>
              <li><Link to="/services">Servicios</Link></li>
              <li><Link to="/contact">Contacto</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="footer-section">
            <h5>Contacto</h5>
            <div className="contact-info">
              <div className="contact-item">
                <FiMapPin />
                <span>Calle Principal 123, Ciudad</span>
              </div>
              <div className="contact-item">
                <FiPhone />
                <span>+34 666 777 888</span>
              </div>
              <div className="contact-item">
                <FiMail />
                <span>info@tattoostudio.com</span>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="footer-section">
            <h5>Horarios</h5>
            <ul>
              <li>Lunes - Viernes: 10:00 - 20:00</li>
              <li>Sábado: 11:00 - 21:00</li>
              <li>Domingo: Cerrado</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Tattoo Studio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
