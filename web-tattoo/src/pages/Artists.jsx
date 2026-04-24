import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin } from 'react-icons/fi';
import ReviewForm from '../components/ReviewForm';
import './Artists.css';

/**
 * Página de tatuadores
 */
export default function Artists() {
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Datos de ejemplo
  const mockArtists = [
    {
      id: 1,
      name: 'Carlos Martínez',
      specialty: 'Realismo en Blanco y Negro',
      image: '👨‍🎨',
      rating: 4.9,
      reviewCount: 145,
      experience: '12 años',
      location: 'Local Principal',
      skills: ['Realismo', 'Retrato', 'Blanco y Negro'],
      portfolio: ['🖼️', '🖼️', '🖼️', '🖼️'],
      description: 'Experto en tatuajes realistas con increíbles detalles. Mi pasión es crear obras de arte en la piel.'
    },
    {
      id: 2,
      name: 'Luna González',
      specialty: 'Tatuajes Minimalistas',
      image: '👩‍🎨',
      rating: 4.8,
      reviewCount: 98,
      experience: '8 años',
      location: 'Local Principal',
      skills: ['Minimalista', 'Geométrico', 'Líneas'],
      portfolio: ['🖼️', '🖼️', '🖼️', '🖼️'],
      description: 'Creo diseños simples pero impactantes que hablan por sí solos. Menos es más.'
    },
    {
      id: 3,
      name: 'David Silva',
      specialty: 'Tradicional y Neo-Tradicional',
      image: '👨‍🎨',
      rating: 4.7,
      reviewCount: 112,
      experience: '10 años',
      location: 'Local Principal',
      skills: ['Tradicional', 'Neo-Tradicional', 'Color'],
      portfolio: ['🖼️', '🖼️', '🖼️', '🖼️'],
      description: 'Especialista en tatuajes clásicos con un toque moderno. Colores vibrantes y líneas precisas.'
    },
    {
      id: 4,
      name: 'Sofia Ruiz',
      specialty: 'Acuarela y Fantasía',
      image: '👩‍🎨',
      rating: 4.9,
      reviewCount: 156,
      experience: '9 años',
      location: 'Local Principal',
      skills: ['Acuarela', 'Fantasía', 'Color Abstracto'],
      portfolio: ['🖼️', '🖼️', '🖼️', '🖼️'],
      description: 'Creo tatuajes que parecen pinturas acuareladas. Cada pieza es una obra de arte única.'
    },
    {
      id: 5,
      name: 'Javier López',
      specialty: 'Biomecánica y Ciencia Ficción',
      image: '👨‍🎨',
      rating: 4.6,
      reviewCount: 87,
      experience: '11 años',
      location: 'Local Principal',
      skills: ['Biomecánica', 'Ciencia Ficción', 'Realismo'],
      portfolio: ['🖼️', '🖼️', '🖼️', '🖼️'],
      description: 'Especialista en diseños futuristas y biomecánicos. Mi arte desafía la realidad.'
    }
  ];

  const handleReviewSubmit = (reviewData) => {
    console.log('Reseña enviada:', reviewData);
    // Aquí iría la lógica para enviar la reseña a la API
  };

  return (
    <div className="artists-page">
      {/* Header */}
      <motion.div
        className="artists-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container">
          <h1>Nuestros Artistas</h1>
          <p>Conoce a los talentosos profesionales detrás de cada tatuaje</p>
        </div>
      </motion.div>

      <div className="container">
        {/* Grid de artistas */}
        <motion.div
          className="artists-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {mockArtists.map((artist, index) => (
            <motion.div
              key={artist.id}
              className="artist-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedArtist(artist)}
            >
              {/* Imagen */}
              <div className="artist-image">
                <span className="image-emoji">{artist.image}</span>
              </div>

              {/* Info */}
              <div className="artist-info">
                <h3>{artist.name}</h3>
                <p className="specialty">{artist.specialty}</p>
                
                {/* Rating */}
                <div className="artist-rating">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={14}
                      className={i < Math.round(artist.rating) ? 'filled' : ''}
                    />
                  ))}
                  <span>{artist.rating} ({artist.reviewCount})</span>
                </div>

                {/* Experience */}
                <div className="experience">
                  <FiMapPin size={14} />
                  <span>{artist.experience}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal de detalles del artista */}
        {selectedArtist && (
          <motion.div
            className="artist-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArtist(null)}
          >
            <motion.div
              className="artist-modal"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="modal-close"
                onClick={() => setSelectedArtist(null)}
              >
                ✕
              </button>

              {/* Contenido */}
              <div className="modal-content">
                {/* Image + Info */}
                <div className="modal-header">
                  <div className="modal-artist-image">
                    <span className="image-emoji">{selectedArtist.image}</span>
                  </div>
                  <div className="modal-artist-info">
                    <h2>{selectedArtist.name}</h2>
                    <p className="specialty">{selectedArtist.specialty}</p>
                    <div className="artist-stats">
                      <div className="stat">
                        <strong>{selectedArtist.experience}</strong>
                        <span>Experiencia</span>
                      </div>
                      <div className="stat">
                        <strong>{selectedArtist.reviewCount}+</strong>
                        <span>Trabajos</span>
                      </div>
                    </div>
                    <div className="artist-rating-large">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          size={18}
                          className={i < Math.round(selectedArtist.rating) ? 'filled' : ''}
                        />
                      ))}
                      <span>{selectedArtist.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="modal-section">
                  <p className="artist-bio">{selectedArtist.description}</p>
                </div>

                {/* Skills */}
                <div className="modal-section">
                  <h4>Especialidades</h4>
                  <div className="skills">
                    {selectedArtist.skills.map((skill, i) => (
                      <span key={i} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Portfolio */}
                <div className="modal-section">
                  <h4>Portafolio</h4>
                  <div className="portfolio-grid">
                    {selectedArtist.portfolio.map((item, i) => (
                      <div key={i} className="portfolio-item">{item}</div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="modal-actions">
                  <motion.button
                    className="btn btn-primary"
                    onClick={() => setShowReviewForm(true)}
                    whileTap={{ scale: 0.95 }}
                  >
                    Dejar Reseña
                  </motion.button>
                  <motion.button
                    className="btn btn-secondary"
                    whileTap={{ scale: 0.95 }}
                  >
                    Ver Disponibilidad
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Review Form Modal */}
        {showReviewForm && selectedArtist && (
          <ReviewForm
            itemId={selectedArtist.id}
            itemType="artist"
            onSubmit={handleReviewSubmit}
            onClose={() => setShowReviewForm(false)}
          />
        )}
      </div>
    </div>
  );
}
