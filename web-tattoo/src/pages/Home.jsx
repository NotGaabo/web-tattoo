import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiFeather, FiShield, FiUser } from 'react-icons/fi';
import './Home.css';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <motion.div
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span className="eyebrow" variants={itemVariants}>Ink House Studio</motion.span>
            <motion.h1 variants={itemVariants}>
              Tinta fina, portal serio y una vibra que si parece tattoo.
            </motion.h1>
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Armamos una home mas cinematica, con acceso portal para clientes y un recorrido listo
              para que secretaria gestione cotizaciones por detras.
            </motion.p>
            <motion.div className="hero-actions" variants={itemVariants}>
              <Link to="/auth?mode=register" className="btn btn-primary">
                Crear portal
              </Link>
              <Link to="/services" className="btn btn-secondary">
                Ver servicios
              </Link>
            </motion.div>
            <motion.div className="hero-metrics" variants={itemVariants}>
              <div>
                <strong>Portal</strong>
                <span>Registro y login conectado a Odoo</span>
              </div>
              <div>
                <strong>Secretaria</strong>
                <span>Espacio separado para cotizaciones y agenda</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="hero-artwork">
              <div className="hero-orbit hero-orbit-one" />
              <div className="hero-orbit hero-orbit-two" />
              <div className="hero-panel">
                <span>Fine line</span>
                <span>Blackwork</span>
                <span>Custom flash</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
              <span className="eyebrow">Concepto</span>
              <h2>La web ya no se siente generica: entra con pulso, textura y caracter.</h2>
              <p>
                La direccion visual mezcla negro profundo, cobre quemado y fondos con atmosfera de
                estudio. La idea es que el cliente sienta tinta, oficio y proceso desde el primer scroll.
              </p>
              <p>
                Encima, el acceso portal queda planteado sin tocar el backend base de Odoo: login,
                registro y seguimiento preparado para crecer con cotizaciones reales despues.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Enviar idea del tattoo <FiArrowRight />
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
                { number: 'Portal', label: 'Usuarios de cliente sin permisos internos', icon: <FiUser /> },
                { number: '24 h', label: 'Ventana sugerida para revisar cotizaciones', icon: <FiClock /> },
                { number: 'Ink', label: 'Look editorial inspirado en tattoo studios', icon: <FiFeather /> },
                { number: 'Safe', label: 'Base lista para crecer con workflows en Odoo', icon: <FiShield /> },
              ].map((stat, index) => (
                <motion.div key={index} className="feature-card" whileHover={{ y: -5 }}>
                  <span className="feature-icon">{stat.icon}</span>
                  <h3>{stat.number}</h3>
                  <p>{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="services-preview">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Como se organiza el estudio
          </motion.h2>

          <div className="services-grid">
            {[
              {
                title: 'Registro Portal',
                description: 'El cliente crea cuenta y entra con una experiencia limpia y clara.',
                icon: '01',
              },
              {
                title: 'Cotizacion Curada',
                description: 'Secretaria revisa estilo, tamano, referencia y ventana de agenda.',
                icon: '02',
              },
              {
                title: 'Artista Correcto',
                description: 'Cada solicitud se enruta al perfil ideal segun tecnica y vibe.',
                icon: '03',
              },
              {
                title: 'Seguimiento',
                description: 'Portal, aftercare y proximos pasos visibles para el cliente.',
                icon: '04',
              },
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
            <Link to="/portal" className="btn btn-primary">
              Ver portal cliente
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="products-preview">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Aftercare y seleccion curada
          </motion.h2>

          <p className="section-subtitle">
            Una tienda mas pulida para vender cuidado posterior, kits y esenciales del estudio.
          </p>

          <div className="products-preview-grid">
            {[
              { name: 'Aftercare Ritual', price: 24.99, image: 'INK' },
              { name: 'Protective Balm', price: 19.99, image: 'BALM' },
              { name: 'Healing Lotion', price: 21.99, image: 'CARE' },
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
              Explorar tienda
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
