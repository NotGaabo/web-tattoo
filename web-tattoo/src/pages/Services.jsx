import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiDroplet } from 'react-icons/fi';
import { useUIStore } from '../context/store';
import { serviceService } from '../services/api';
import './Services.css';

/**
 * Página de servicios de tatuaje
 */
export default function Services() {
  const showNotification = useUIStore(state => state.showNotification);
  const [selectedCategory, setSelectedCategory] = useState('small');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar servicios de la API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await serviceService.getAll();
        
        // Manejar diferentes formatos de respuesta
        const servicesList = response?.data || response || [];
        const formattedServices = Array.isArray(servicesList) 
          ? servicesList.map(service => ({
              ...service,
              colors: service.colorsName ? [service.colorsName] : ['Negro'],
              estimatedTime: service.estimatedTime || '1 hora'
            }))
          : [];
        
        setServices(formattedServices);
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

  const serviceTypes = [
    {
      type: 'new',
      title: 'Tatuaje Nuevo',
      description: 'Crea tu diseño ideal desde cero'
    },
    {
      type: 'cover',
      title: 'Cover',
      description: 'Transforma un tatuaje anterior'
    },
    {
      type: 'modification',
      title: 'Modificación',
      description: 'Personaliza un tatuaje existente'
    },
    {
      type: 'touch',
      title: 'Retoque',
      description: 'Revitaliza tu tatuaje'
    }
  ];

  const handleSchedule = (service) => {
    showNotification(`Redirigiendo a WhatsApp para agendar "${service.name}"`, 'info');
    // En producción, esto abriría WhatsApp con un mensaje preformulado
    window.open(
      `https://wa.me/34666777888?text=Hola! Me gustaría agendar: ${service.name}`,
      '_blank'
    );
  };

  // Filtrar servicios por categoría
  const currentServices = services.filter(s => s.type === selectedCategory);

  return (
    <div className="services-page">
      {/* Header */}
      <motion.div
        className="services-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <h1>Nuestros Servicios</h1>
          <p>Diseños únicos adaptados a tu estilo y presupuesto</p>
        </div>
      </motion.div>

      <div className="container">
        {/* Service Types */}
        <motion.section
          className="service-types-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Tipos de Servicio</h2>
          <div className="service-types-grid">
            {serviceTypes.map((service, index) => (
              <motion.div
                key={service.type}
                className="service-type-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="service-type-icon">✨</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Categorías de tamaño */}
        <motion.section
          className="size-categories-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2>Categorías por Tamaño</h2>
          
          {/* Botones de categoría */}
          <div className="category-tabs">
            {['small', 'medium', 'large'].map(category => (
              <motion.button
                key={category}
                className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
                whileTap={{ scale: 0.95 }}
              >
                {category === 'small' && '📍 Pequeño'}
                {category === 'medium' && '📌 Mediano'}
                {category === 'large' && '📍 Grande'}
              </motion.button>
            ))}
          </div>

          {/* Grid de servicios */}
          <motion.div
            className="services-grid"
            layout
          >
            {loading ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
                <p>Cargando servicios...</p>
              </div>
            ) : error ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
                <p>{error}</p>
              </div>
            ) : currentServices.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 20px' }}>
                <p>No hay servicios disponibles en esta categoría.</p>
              </div>
            ) : (
              currentServices.map((service) => (
                <motion.div
                  key={service.id}
                  className="service-card"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -8 }}
                >
                  {/* Header */}
                  <div className="service-card-header">
                    <h3>{service.name}</h3>
                    <span className="service-price">${service.price}</span>
                  </div>

                  {/* Descripción */}
                  <p className="service-description">{service.description}</p>

                  {/* Detalles */}
                  <div className="service-details">
                    <div className="detail-item">
                      <FiClock size={18} />
                      <span>{service.estimatedTime}</span>
                    </div>
                    <div className="detail-item">
                      <FiDroplet size={18} />
                      <span>{service.colors.join(', ')}</span>
                    </div>
                  </div>

                  {/* Botón */}
                  <motion.button
                    className="btn btn-primary"
                    onClick={() => handleSchedule(service)}
                    whileTap={{ scale: 0.95 }}
                    style={{ width: '100%' }}
                  >
                    Agendar <FiArrowRight />
                  </motion.button>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.section>

        {/* Process Section */}
        <motion.section
          className="process-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2>Nuestro Proceso</h2>
          <div className="process-steps">
            {[
              { number: '1', title: 'Consulta', description: 'Habla con nuestro artista sobre tu idea' },
              { number: '2', title: 'Diseño', description: 'Creamos un diseño personalizado para ti' },
              { number: '3', title: 'Preparación', description: 'Preparamos el área y discutimos detalles' },
              { number: '4', title: 'Tatuaje', description: 'Realizamos el tatuaje con máxima precisión' },
              { number: '5', title: 'Cuidado', description: 'Te proporcionamos instrucciones de cuidado' }
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
