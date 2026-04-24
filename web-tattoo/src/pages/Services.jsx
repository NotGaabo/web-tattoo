import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiPalette } from 'react-icons/fi';
import { useUIStore } from '../context/store';
import './Services.css';

/**
 * Página de servicios de tatuaje
 */
export default function Services() {
  const showNotification = useUIStore(state => state.showNotification);
  const [selectedCategory, setSelectedCategory] = useState('small');

  // Datos de ejemplo
  const mockServices = {
    small: [
      {
        id: 1,
        name: 'Pequeño Tatuaje',
        price: 80,
        estimatedTime: '30-45 min',
        colors: ['Negro', 'Gris'],
        description: 'Tatuajes pequeños (hasta 5cm²). Perfecto para primeras tatuajes o diseños simples.'
      },
      {
        id: 2,
        name: 'Micro Tatuaje',
        price: 50,
        estimatedTime: '15-30 min',
        colors: ['Negro'],
        description: 'Tatuajes muy pequeños y delicados. Ideal para discretos y minimalistas.'
      }
    ],
    medium: [
      {
        id: 3,
        name: 'Tatuaje Mediano',
        price: 150,
        estimatedTime: '1.5-2.5 horas',
        colors: ['Negro', 'Gris', 'Color'],
        description: 'Tatuajes medianos (5-20cm²). Gran variedad de diseños y estilos.'
      },
      {
        id: 4,
        name: 'Tatuaje Medio Coloreado',
        price: 200,
        estimatedTime: '2-3 horas',
        colors: ['Todos'],
        description: 'Diseños en color con excelentes detalles y sombreados.'
      }
    ],
    large: [
      {
        id: 5,
        name: 'Tatuaje Grande',
        price: 300,
        estimatedTime: '3-5 horas',
        colors: ['Negro', 'Gris', 'Color'],
        description: 'Tatuajes grandes con mucho detalle. Requiere múltiples sesiones.'
      },
      {
        id: 6,
        name: 'Pieza Completa de Brazo',
        price: 500,
        estimatedTime: '5-8 horas',
        colors: ['Todos'],
        description: 'Diseños que cubren todo el brazo. Proyecto personalizado de larga duración.'
      }
    ]
  };

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

  const currentServices = mockServices[selectedCategory] || [];

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
            {currentServices.map((service) => (
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
                    <FiPalette size={18} />
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
            ))}
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
