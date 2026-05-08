import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiInstagram, FiStar } from 'react-icons/fi';
import ReviewForm from '../components/ReviewForm';
import { resolveBackendUrl, reviewService, tattooArtistService } from '../services/api';
import { useAuthStore, useUIStore } from '../context/store';
import './ArtistDetail.css';

export default function ArtistDetail() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const showNotification = useUIStore((state) => state.showNotification);
  const [artist, setArtist] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const isPortalUser = user?.role === 'portal' || user?.is_portal;

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const response = await reviewService.getByItem(artistId, 'artist');
      setReviews(response?.data || response || []);
      setHasReviewed(Boolean(response?.meta?.has_reviewed));
    } catch (error) {
      setReviews([]);
      setHasReviewed(false);
    } finally {
      setLoadingReviews(false);
    }
  };

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
    loadReviews();

    return () => {
      active = false;
    };
  }, [artistId, showNotification]);

  const handleReviewSubmit = async (reviewData) => {
    await reviewService.create(reviewData);
    await Promise.all([loadReviews(), tattooArtistService.getProfile(artistId).then((response) => {
      setArtist(response?.data || response || null);
    })]);
    setIsReviewOpen(false);
  };

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
            <p className="artist-specialization">{artist.specialization || 'Tatuador del estudio'}</p>
            {artist.social_handle ? <p className="artist-handle">{artist.social_handle}</p> : null}
            <div className="artist-rating-line">
              <FiStar size={16} />
              <strong>{Number(artist.rating || 0).toFixed(1)}</strong>
              <span>{Number(artist.reviewCount || 0)} reseñas</span>
            </div>
            <p className="artist-bio">{artist.biography}</p>
            <div className="artist-actions">
              <Link to={`/appointment?artistId=${artist.id}`} className="artist-primary-btn">
                Agendar cita <FiCalendar />
              </Link>
              {isPortalUser ? (
                <button
                  type="button"
                  className="artist-secondary-btn"
                  onClick={() => setIsReviewOpen(true)}
                  disabled={hasReviewed}
                  aria-disabled={hasReviewed}
                  title={hasReviewed ? 'Ya calificaste a este tatuador.' : 'Calificar tatuador'}
                >
                  {hasReviewed ? 'Ya calificaste' : 'Calificar tatuador'} <FiStar />
                </button>
              ) : null}
              <a href={artist.social_handle ? `https://instagram.com/${artist.social_handle.replace('@', '')}` : `https://instagram.com`} target="_blank" rel="noreferrer" className="artist-secondary-btn">
                Instagram <FiInstagram />
              </a>
            </div>
          </div>
        </section>

        <section className="artist-section">
          <div className="artist-section-head">
            <h2>Reseñas</h2>
            <span>{Number(artist.reviewCount || reviews.length || 0)} opiniones</span>
          </div>
          {loadingReviews ? (
            <p className="artist-empty">Cargando reseñas...</p>
          ) : reviews.length ? (
            <div className="artist-reviews-grid">
              {reviews.map((review) => (
                <article key={review.id} className="artist-review-card">
                  <div className="artist-review-top">
                    <strong>{review.customerName || 'Cliente'}</strong>
                    <span>{review.date || ''}</span>
                  </div>
                  <div className="artist-review-stars" aria-label={`${review.rating} de 5 estrellas`}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar key={star} className={star <= Number(review.rating || 0) ? 'filled' : ''} />
                    ))}
                  </div>
                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="artist-empty">Todavía no hay reseñas para este tatuador.</p>
          )}
        </section>

        <section className="artist-section">
          <h2>Trabajos realizados</h2>
          <div className="artist-portfolio-grid">
            {((artist.gallery || artist.portfolio) || []).length ? (((artist.gallery || artist.portfolio) || []).map((piece) => (
              <article key={piece.id} className="artist-work-card">
                {(piece.url || piece.image) ? (
                  <img src={resolveBackendUrl(piece.url || piece.image)} alt={piece.title || piece.name} />
                ) : (
                  <div className="artist-work-fallback">Tattoo</div>
                )}
                <div className="artist-work-meta">
                  <strong>{piece.title || piece.name || 'Trabajo'}</strong>
                  <span>{piece.type || artist.specialization}</span>
                  <p>{piece.description || 'Trabajo relacionado al estilo del artista.'}</p>
                </div>
              </article>
            ))) : (
              <p className="artist-empty">Todavía no hay trabajos subidos para este tatuador.</p>
            )}
          </div>
        </section>

        {isReviewOpen ? (
          <ReviewForm
            itemId={artist.id}
            itemType="artist"
            onSubmit={handleReviewSubmit}
            onClose={() => setIsReviewOpen(false)}
            userName={user?.name || ''}
            hideNameField
          />
        ) : null}

      </div>
    </div>
  );
}
