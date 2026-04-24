import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiFileText, FiMessageSquare, FiShield } from 'react-icons/fi';
import { useAuthStore } from '../context/store';
import './Portal.css';

const portalCards = [
  {
    title: 'Cotizacion en revision',
    description: 'El equipo de secretaria revisa referencias, tamano y complejidad antes de confirmar.',
    icon: FiFileText,
    badge: 'Pendiente de aprobacion',
  },
  {
    title: 'Siguiente contacto',
    description: 'Recibiras respuesta para agenda, deposito y observaciones directamente en tu portal.',
    icon: FiClock,
    badge: '24 h estimadas',
  },
  {
    title: 'Seguimiento dedicado',
    description: 'Mantienes visibles tus datos, historial de citas y recomendaciones post tattoo.',
    icon: FiShield,
    badge: 'Portal activo',
  },
];

export default function Portal() {
  const user = useAuthStore((state) => state.user);
  const secretaryUrl = import.meta.env.VITE_SECRETARY_URL || '/web';

  return (
    <div className="portal-page">
      <section className="portal-hero">
        <div className="container">
          <motion.div
            className="portal-hero-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="eyebrow">Portal del cliente</span>
            <h1>{user?.name ? `Hola, ${user.name}.` : 'Hola.'} Tu proyecto ya tiene su base lista.</h1>
            <p>
              Este espacio deja el registro y el login preparados para usuarios portal de Odoo.
              Aqui puedes concentrar solicitudes, citas y seguimiento mientras secretaria trabaja
              la parte operativa por detras.
            </p>

            <div className="portal-hero-actions">
              <Link to="/contact" className="btn btn-primary">
                Enviar referencia para cotizar <FiArrowRight />
              </Link>
              <a href={secretaryUrl} className="btn btn-secondary">
                Area secretaria
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="portal-overview">
        <div className="container portal-grid">
          {portalCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                className="portal-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="portal-card-top">
                  <span className="portal-icon">
                    <Icon size={18} />
                  </span>
                  <span className="portal-badge">{card.badge}</span>
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="portal-timeline">
        <div className="container">
          <div className="page-card">
            <span className="eyebrow">Flujo sugerido</span>
            <h2>Como queda organizado el recorrido</h2>
            <div className="portal-steps">
              <div>
                <strong>1. Registro portal</strong>
                <p>El cliente crea cuenta y entra sin recibir permisos internos.</p>
              </div>
              <div>
                <strong>2. Envio de idea</strong>
                <p>Comparte referencia, zona del cuerpo, estilo y presupuesto estimado.</p>
              </div>
              <div>
                <strong>3. Revision secretaria</strong>
                <p>El rol interno valida la cotizacion y prepara la agenda.</p>
              </div>
              <div>
                <strong>4. Confirmacion</strong>
                <p>El portal muestra respuesta, fecha tentativa y pasos siguientes.</p>
              </div>
            </div>

            <div className="portal-note">
              <FiMessageSquare size={18} />
              <span>
                Si luego quieres, el siguiente paso natural es conectar aqui tus modelos reales de
                citas, cotizaciones y pedidos desde Odoo.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
