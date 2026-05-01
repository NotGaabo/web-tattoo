import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';
import { useUIStore } from '../context/store';
import './Contact.css';

/**
 * Página de contacto
 */
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showNotification = useUIStore(state => state.showNotification);
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '18097147813';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación
    if (!formData.name || !formData.email || !formData.message) {
      showNotification('Por favor, completa todos los campos requeridos', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const message = [
        'Hola, quiero enviar una consulta desde la web.',
        '',
        `Nombre: ${formData.name}`,
        `Correo: ${formData.email}`,
        `Telefono: ${formData.phone || 'No indicado'}`,
        `Asunto: ${formData.subject || 'Sin asunto'}`,
        '',
        'Mensaje:',
        formData.message,
      ].join('\n');

      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      
      showNotification('Abrimos WhatsApp con tu mensaje listo para enviar.', 'success');
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      showNotification('Error al enviar el mensaje', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <h1>Contacto</h1>
          <p>¿Preguntas? Estamos aquí para ayudarte</p>
        </div>
      </motion.div>

      <div className="container contact-container">
        {/* Información de contacto */}
        <motion.div
          className="contact-info-section"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Información de Contacto</h2>

          {/* Ubicación */}
          <motion.div
            className="contact-item"
            whileHover={{ x: 5 }}
          >
            <div className="contact-icon">
              <FiMapPin size={24} />
            </div>
            <div className="contact-details">
              <h4>Ubicación</h4>
              <p>Calle Principal 123</p>
              <p>28001 Madrid, España</p>
            </div>
          </motion.div>

          {/* Teléfono */}
          <motion.div
            className="contact-item"
            whileHover={{ x: 5 }}
          >
            <div className="contact-icon">
              <FiPhone size={24} />
            </div>
            <div className="contact-details">
              <h4>Teléfono</h4>
              <p>+34 666 777 888</p>
              <p>Lunes a Viernes: 10:00 - 20:00</p>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div
            className="contact-item"
            whileHover={{ x: 5 }}
          >
            <div className="contact-icon">
              <FiMail size={24} />
            </div>
            <div className="contact-details">
              <h4>Email</h4>
              <p>info@tattoostudio.com</p>
              <p>Respuesta en 24 horas</p>
            </div>
          </motion.div>

          {/* Horarios */}
          <motion.div
            className="contact-item"
            whileHover={{ x: 5 }}
          >
            <div className="contact-icon">
              <FiClock size={24} />
            </div>
            <div className="contact-details">
              <h4>Horarios</h4>
              <p>Lunes - Viernes: 10:00 - 20:00</p>
              <p>Sábado: 11:00 - 21:00</p>
              <p>Domingo: Cerrado</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Formulario */}
        <motion.div
          className="contact-form-section"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2>Envíanos un Mensaje</h2>

          <form onSubmit={handleSubmit} className="contact-form">
            {/* Nombre */}
            <div className="form-group">
              <label htmlFor="name">Nombre *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                disabled={isSubmitting}
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                disabled={isSubmitting}
              />
            </div>

            {/* Teléfono */}
            <div className="form-group">
              <label htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+34 666 777 888"
                disabled={isSubmitting}
              />
            </div>

            {/* Asunto */}
            <div className="form-group">
              <label htmlFor="subject">Asunto</label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="¿De qué se trata?"
                disabled={isSubmitting}
              />
            </div>

            {/* Mensaje */}
            <div className="form-group">
              <label htmlFor="message">Mensaje *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tu mensaje..."
                disabled={isSubmitting}
                maxLength={1000}
              />
              <span className="char-count">{formData.message.length}/1000</span>
            </div>

            {/* Botón */}
            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Mapa (placeholder) */}
      <motion.div
        className="map-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="container">
          <h2>Encuéntranos</h2>
          <div className="map-placeholder">
            <p>📍 Ubicación del estudio en el mapa</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
