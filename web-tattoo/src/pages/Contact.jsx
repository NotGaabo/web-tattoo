import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiSend } from 'react-icons/fi';
import { useAuthStore, useUIStore } from '../context/store';
import { contactRequestService } from '../services/api';
import './Contact.css';

const GOLD = '#D4AA5A';
const FONT = 'Inter, system-ui, sans-serif';

export default function Contact() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const showNotification = useUIStore((state) => state.showNotification);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      showNotification('Debes iniciar sesion para enviar una consulta.', 'warning');
      navigate('/auth');
    }
  }, [isAuthenticated, navigate, showNotification]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      showNotification('Completa asunto y mensaje.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await contactRequestService.create({
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      if (response?.whatsapp_url) {
        window.open(response.whatsapp_url, '_blank', 'noopener,noreferrer');
      }

      showNotification('Consulta registrada y lista para enviar por WhatsApp.', 'success');
      setFormData({ subject: '', message: '' });
    } catch (error) {
      showNotification(error.response?.data?.message || error.message || 'No se pudo enviar la consulta.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <motion.div
        className="contact-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD, marginBottom: 20, fontFamily: FONT }}>
            <span style={{ display: 'block', width: 28, height: 1, background: GOLD }} />
            Contacto
          </div>
          <h1 style={{ fontFamily: FONT, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.025em', color: '#fff', margin: '0 0 20px', maxWidth: '14ch' }}>
            Envianos tu mensaje y lo dejamos listo para WhatsApp.
          </h1>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', fontFamily: FONT, maxWidth: 660 }}>
            Tu nombre y correo ya salen de tu sesion. Solo completa el asunto y tu mensaje.
          </p>
        </div>
      </motion.div>

      <div className="container contact-container contact-container--single">
        <motion.div
          className="contact-form-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="contact-user-chip">
            <FiMessageSquare size={16} />
            <span>{user?.name || 'Cliente'} {user?.email ? `· ${user.email}` : ''}</span>
          </div>

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="subject">Asunto</label>
              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={(event) => setFormData((current) => ({ ...current, subject: event.target.value }))}
                placeholder="Ej. Cotizacion de manga, dudas sobre cicatrizacion..."
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                placeholder="Cuéntanos lo que necesitas."
                disabled={isSubmitting}
                maxLength={1000}
              />
              <span className="char-count">{formData.message.length}/1000</span>
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Preparando mensaje...' : 'Guardar y abrir WhatsApp'} <FiSend />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
