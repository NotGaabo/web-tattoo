import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiInstagram, FiMapPin, FiStar } from 'react-icons/fi';
import { resolveBackendUrl, tattooArtistService } from '../services/api';
import { useUIStore } from '../context/store';
import './ArtistDetail.css';

export default function ArtistDetail() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const showNotification = useUIStore((state) => state.showNotification);
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadArtist = async () => {
      setLoading(true);
      try {
        const response = await tattooArtistService.getProfile(artistId);
        if (active) {
          setArtist(response?.data || response || null);
        }
      } catch (error) {
        if (active) {
          showNotification('No se pudo cargar el tatuador', 'error');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadArtist();

    return () => {
      active = false;
    };
  }, [artistId, showNotification]);

  if (loading) {
    return <div className="artist-detail-page"><div className="artist-detail-shell">Cargando tatuador...</div></div>;
  }

  if (!artist) {
    return <div className="artist-detail-page"><div className="artist-detail-shell">Tatuador no encontrado</div></div>;
  }

  return (
    <div className="artist-detail-page">
      <div className="artist-detail-shell">
        <button type="button" className="artist-back-btn" onClick={() => navigate('/artists')}>
          <FiArrowLeft /> Volver
        </button>

        <section className="artist-detail-hero">
          <div className="artist-photo-wrap">
            {artist.image ? (
              <img src={resolveBackendUrl(artist.image)} alt={artist.name} className="artist-photo" />
            ) : (
              <div className="artist-photo artist-photo-fallback">{artist.name?.charAt(0) || 'A'}</div>
            )}
          </div>
          <div className="artist-detail-copy">
            <span className="artist-eyebrow">Perfil del tatuador</span>
            <h1>{artist.name}</h1>
            <p className="artist-specialization">{artist.specialization}</p>
            <p className="artist-bio">{artist.biography}</p>
            <div className="artist-stats">
              <div><strong>{artist.years_of_experience || 0}</strong><span>Años</span></div>
              <div><strong>{Number(artist.rating || 0).toFixed(1)}</strong><span>Rating</span></div>
              <div><strong>{artist.reviewCount || 0}</strong><span>Reseñas</span></div>
            </div>
            <div className="artist-actions">
              <Link to={`/appointment?artistId=${artist.id}`} className="artist-primary-btn">
                Agendar cita <FiCalendar />
              </Link>
              <a href={artist.socialUrl || `https://instagram.com`} target="_blank" rel="noreferrer" className="artist-secondary-btn">
                Instagram <FiInstagram />
              </a>
            </div>
          </div>
        </section>

        <section className="artist-section">
          <h2>Skills</h2>
          <div className="artist-tags">
            {(artist.skills || []).map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </section>

        <section className="artist-section">
          <h2>Trabajos realizados</h2>
          <div className="artist-portfolio-grid">
            {(artist.portfolio || []).length ? (artist.portfolio.map((piece) => (
              <article key={piece.id} className="artist-work-card">
                {piece.url ? (
                  <img src={resolveBackendUrl(piece.url)} alt={piece.title} />
                ) : (
                  <div className="artist-work-fallback">Tattoo</div>
                )}
                <div className="artist-work-meta">
                  <strong>{piece.title || 'Trabajo'}</strong>
                  <span>{piece.type || artist.specialization}</span>
                  <p>{piece.description || 'Trabajo relacionado al estilo del artista.'}</p>
                </div>
              </article>
            ))) : (
              <p className="artist-empty">Todavía no hay trabajos subidos para este tatuador.</p>
            )}
          </div>
        </section>

        <section className="artist-section">
          <h2>Ubicación y contacto</h2>
          <div className="artist-contact-card">
            <p><FiMapPin /> {artist.location || 'Studio principal'}</p>
            <p><FiStar /> {artist.total_completed_appointments || 0} sesiones completadas</p>
          </div>
        </section>
      </div>
    </div>
  );
}
