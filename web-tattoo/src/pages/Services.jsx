import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useUIStore } from '../context/store';
import { serviceService } from '../services/api';
import './Services.css';

const GOLD = '#D4AA5A';
const FONT = 'Inter, system-ui, sans-serif';
const WHATSAPP_NUMBER = '18494606390';

/**
 * Página de servicios de tatuaje
 */
export default function Services() {
  const showNotification = useUIStore(state => state.showNotification);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar servicios de la API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await serviceService.getAll();
        const servicesList = response?.data || response || [];
        setServices(Array.isArray(servicesList) ? servicesList : []);
        setError(null);
      } catch (err) {
        console.error('Error loading services:', err);
        setError('No pudimos cargar los servicios. Por favor intenta más tarde.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSchedule = (service) => {
    showNotification(`Redirigiendo a WhatsApp para agendar "${service.name}"`, 'info');
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, me interesa el servicio "${service.name}" y quiero cotizarlo.`)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="services-page">
      <motion.div
        className="services-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD, marginBottom: 20, fontFamily: FONT }}>
            <span style={{ display: 'block', width: 28, height: 1, background: GOLD }} />
            Servicios
          </div>
          <h1 style={{ fontFamily: FONT, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.025em', textTransform: 'none', color: '#fff', margin: '0 0 20px', maxWidth: '16ch' }}>
            Servicios del estudio para cotizar contigo por WhatsApp.
          </h1>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', fontFamily: FONT, maxWidth: 660 }}>
            Aqui ves lo que ofrecemos de forma general. El precio y los detalles finales se definen cuando hablas con nosotros y agendas la cita.
          </p>
        </div>
      </motion.div>

      <div className="container">
        <motion.section
          className="service-types-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 style={{ fontFamily: FONT, fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em', textTransform: 'none', color: '#fff' }}>Servicios disponibles</h2>
          <div className="service-types-grid service-types-grid-compact">
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
                <p>Cargando servicios...</p>
              </div>
            ) : error ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
                <p>{error}</p>
              </div>
            ) : !services.length ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
                <p>No hay servicios disponibles ahora mismo.</p>
              </div>
            ) : (
              services.map((service, index) => (
                <motion.div
                  key={service.id}
                  className="service-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                  whileHover={{ y: -3 }}
                >
                  <div className="service-card-header">
                    <h3>{service.name}</h3>
                  </div>

                  <motion.button
                    className="btn btn-primary service-card-button"
                    onClick={() => handleSchedule(service)}
                    whileTap={{ scale: 0.95 }}
                  >
                    Consultar <FiArrowRight />
                  </motion.button>
                </motion.div>
              ))
            )}
          </div>
        </motion.section>

        <motion.section
          className="process-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 style={{ fontFamily: FONT, fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em', textTransform: 'none', color: '#fff' }}>Como se trabaja</h2>
          <div className="process-steps">
            {[
              { number: '1', title: 'Consulta', description: 'Nos cuentas tu idea y el servicio que te interesa.' },
              { number: '2', title: 'Cotizacion', description: 'Definimos alcance, precio y fecha por WhatsApp.' },
              { number: '3', title: 'Cita', description: 'Reservas con el tatuador y el dia que mejor te funcione.' },
              { number: '4', title: 'Sesion', description: 'Realizamos el trabajo con los detalles ya acordados.' },
              { number: '5', title: 'Seguimiento', description: 'Te dejamos recomendaciones y soporte posterior.' }
            ].map((step, index) => (
              <motion.div
                key={step.number}
                className="process-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="step-number">{step.number}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
