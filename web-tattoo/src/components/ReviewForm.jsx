import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiX } from 'react-icons/fi';
import { useUIStore } from '../context/store';
import './ReviewForm.css';

/**
 * Componente ReviewForm - Formulario para dejar reseñas
 * @param {string} itemId - ID del producto/servicio
 * @param {string} itemType - Tipo de item ('product' o 'service')
 * @param {Function} onSubmit - Callback cuando se envía la reseña
 */
export default function ReviewForm({ itemId, itemType, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showNotification = useUIStore(state => state.showNotification);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      showNotification('Por favor, selecciona una calificación', 'warning');
      return;
    }

    if (!comment.trim() || !name.trim()) {
      showNotification('Por favor, completa todos los campos', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        itemId,
        itemType,
        rating,
        comment,
        name,
        date: new Date().toISOString()
      };

      if (onSubmit) {
        await onSubmit(reviewData);
      }

      showNotification('Reseña enviada correctamente', 'success');
      setRating(0);
      setComment('');
      setName('');
      
      if (onClose) {
        setTimeout(onClose, 500);
      }
    } catch (error) {
      showNotification('Error al enviar la reseña', 'error');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="review-form-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="review-form-modal"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="review-form-header">
          <h3>Comparte tu experiencia</h3>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            <FiX />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="review-form">
          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="name">Tu nombre</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre (opcional)"
              disabled={isSubmitting}
            />
          </div>

          {/* Rating */}
          <div className="form-group">
            <label>Calificación</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  <FiStar size={32} />
                </motion.button>
              ))}
            </div>
            {rating > 0 && <span className="rating-label">{rating} de 5 estrellas</span>}
          </div>

          {/* Comentario */}
          <div className="form-group">
            <label htmlFor="comment">Tu comentario</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos tu experiencia..."
              disabled={isSubmitting}
              maxLength={500}
            />
            <span className="char-count">{comment.length}/500</span>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <motion.button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              Cancelar
            </motion.button>
            <motion.button
              type="submit"
              className="btn btn-primary"
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
