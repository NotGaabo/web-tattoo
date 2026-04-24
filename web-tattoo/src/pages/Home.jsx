import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import './Home.css';

/**
 * Página de inicio
 */
export default function Home() {
  // Animación variantes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <motion.div
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants}>
              TATTOO STUDIO
            </motion.h1>
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Diseños únicos que cuentan tu historia
            </motion.p>
            <motion.div className="hero-actions" variants={itemVariants}>
              <Link to="/services" className="btn btn-primary">
                Agendar Cita
              </Link>
              <Link to="/products" className="btn btn-secondary">
                Ver Productos
              </Link>
            </motion.div>
          </motion.div>
          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Placeholder para imagen hero */}
            <div className="image-placeholder">
              <span>Tu Tattoo Aquí</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <motion.div
              className="about-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>Sobre Nosotros</h2>
              <p>
                Somos un estudio profesional de tatuajes con más de 15 años de experiencia.
                Nuestro equipo de tatuadores expertos está comprometido con crear diseños únicos
                y personalizados que reflejen tu personalidad y estilo.
              </p>
              <p>
                Utilizamos equipos de última generación y seguimos los más altos estándares de higiene
                para garantizar tu seguridad y comodidad.
              </p>
              <Link to="/contact" className="btn btn-gold">
                Contacta con Nosotros <FiArrowRight />
              </Link>
            </motion.div>

            <motion.div
              className="about-features"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {[
                { number: '500+', label: 'Tatuajes Completados' },
                { number: '15+', label: 'Años de Experiencia' },
                { number: '5', label: 'Artistas Profesionales' },
                { number: '100%', label: 'Satisfacción Garantizada' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  whileHover={{ y: -5 }}
                >
                  <h3>{stat.number}</h3>
                  <p>{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Nuestros Servicios
          </motion.h2>

          <div className="services-grid">
            {[
              {
                title: 'Tatuajes Nuevos',
                description: 'Diseños personalizados adaptados a tu visión',
                icon: '✨'
              },
              {
                title: 'Covers',
                description: 'Transforma un tatuaje anterior con nuevo arte',
                icon: '🔄'
              },
              {
                title: 'Retoques',
                description: 'Revitaliza y perfecciona tus tatuajes existentes',
                icon: '🎨'
              },
              {
                title: 'Modificaciones',
                description: 'Personalización y ajustes de diseños previos',
                icon: '⚡'
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="services-cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/services" className="btn btn-primary">
              Ver Todos los Servicios
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="products-preview">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Productos Recomendados
          </motion.h2>

          <p className="section-subtitle">
            Cuidados y suplementos esenciales para tus tatuajes
          </p>

          <div className="products-preview-grid">
            {[
              {
                name: 'Cream Aftercare',
                price: 24.99,
                image: '🧴'
              },
              {
                name: 'Protective Balm',
                price: 19.99,
                image: '💚'
              },
              {
                name: 'Healing Lotion',
                price: 21.99,
                image: '🧴'
              }
            ].map((product, index) => (
              <motion.div
                key={index}
                className="product-preview-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="product-preview-image">{product.image}</div>
                <h4>{product.name}</h4>
                <p className="price">${product.price}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="products-cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="btn btn-secondary">
              Explorar Tienda
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
