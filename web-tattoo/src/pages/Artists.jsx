import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiInstagram, FiStar } from 'react-icons/fi';
import { useStudioMcp } from '../context/StudioMcpContext';
import { resolveBackendUrl } from '../services/api';
import './Artists.css';

const GOLD = '#D4AA5A';
const FONT = '"DM Sans", Inter, system-ui, sans-serif';

export default function Artists() {
  const { artists, isLoading } = useStudioMcp();

  return (
    <div className="artists-page">
      <section className="artists-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 680 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD, marginBottom: 20, fontFamily: FONT }}>
              <span style={{ display: 'block', width: 28, height: 1, background: GOLD }} />
              Artistas
            </div>
            <h1 style={{ fontFamily: FONT, fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.025em', color: '#fff', margin: '0 0 20px', maxWidth: '14ch' }}>
              Artistas del estudio con perfil, red y trabajos reales.
            </h1>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', fontFamily: FONT, maxWidth: 620 }}>
              Esta vista muestra solo lo importante: foto, nombre, handle, rating real y acceso al detalle.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="artists-grid-wrap">
        <div className="container">
          <div className="artists-grid">
            {artists.map((artist, index) => (
              <motion.article
                key={artist.id}
                className="artists-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="artists-card__image">
                  {artist.avatarUrl || artist.image ? (
                    <img src={resolveBackendUrl(artist.avatarUrl || artist.image)} alt={artist.displayName || artist.name} />
                  ) : (
                    <div className="artists-card__fallback">{(artist.displayName || artist.name || 'A').charAt(0)}</div>
                  )}
                </div>

                <div className="artists-card__body">
                  <h2>{artist.displayName || artist.name}</h2>
                  <p className="artists-card__handle">
                    <FiInstagram size={14} />
                    {artist.handle || artist.social_handle || '@skinarttattooshop1'}
                  </p>

                  <div className="artists-card__rating">
                    <FiStar size={15} />
                    <span>{Number(artist.rating || 0).toFixed(1)}</span>
                    <small>{Number(artist.reviewCount || artist.reviews || 0)} reseñas</small>
                  </div>

                  <Link to={`/artists/${artist.id}`} className="artists-card__button">
                    Ver detalle <FiArrowRight size={15} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {isLoading && <p className="artists-loading">Sincronizando artistas...</p>}
        </div>
      </section>
    </div>
  );
}
