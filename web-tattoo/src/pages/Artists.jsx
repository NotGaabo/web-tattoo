import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiInstagram, FiMapPin, FiStar } from 'react-icons/fi';
import { useStudioMcp } from '../context/StudioMcpContext';
import { resolveBackendUrl } from '../services/api';

const GOLD = '#D4AA5A';
const FONT = 'Inter, system-ui, sans-serif';
const MUTED = 'rgba(255,255,255,0.4)';

function PortfolioCard({ piece }) {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '0.5px solid rgba(255,255,255,0.08)',
        position: 'relative',
        aspectRatio: '1 / 1',
        background: '#111',
      }}
    >
      {piece.imageUrl ? (
        <img
          src={resolveBackendUrl(piece.imageUrl)}
          alt={piece.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${piece.tone}`}
          style={{ position: 'absolute', inset: 0 }}
        />
      )}
      {/* Overlay inferior */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)',
        }}
      />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 10px 11px' }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#fff', fontFamily: FONT, textTransform: 'none', letterSpacing: 0, lineHeight: 1.2 }}>
          {piece.badge}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 9, color: 'rgba(255,255,255,0.5)', fontFamily: FONT, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          {piece.title}
        </p>
      </div>
    </div>
  );
}

export default function Artists() {
  const { artists, studio, isLoading } = useStudioMcp();

  return (
    <div style={{ background: '#080808', color: '#E8E8E8', minHeight: '100vh' }}>

      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '0.5px solid rgba(255,255,255,0.07)',
          padding: '80px 40px 72px',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 50% 60% at 5% 50%, rgba(212,170,90,0.1) 0%, transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 640 }}>

            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: GOLD, marginBottom: 20, fontFamily: FONT }}>
              <span style={{ display: 'block', width: 28, height: 1, background: GOLD }} />
              Roster del estudio
            </div>

            {/* H1 — Inter, no Bebas */}
            <h1
              style={{
                fontFamily: FONT,
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.025em',
                textTransform: 'none',
                color: '#fff',
                margin: '0 0 20px',
                maxWidth: '14ch',
              }}
            >
              Artistas con identidad clara, handles legibles y mejor portfolio.
            </h1>

            <p style={{ margin: '0 0 32px', fontSize: 16, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', fontFamily: FONT, maxWidth: 520 }}>
              Esta vista consume una capa MCP con artistas, piezas y disponibilidad para una estructura más premium.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a
                href={studio.instagramUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  borderRadius: 9999, border: '0.5px solid rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)', padding: '7px 18px',
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontFamily: FONT,
                }}
              >
                Abrir Instagram <FiInstagram size={13} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Grid artistas ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {artists.map((artist, index) => {
            return (
              <motion.article
                key={artist.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
                whileHover={{ y: -6 }}
                style={{
                  borderRadius: 28,
                  overflow: 'hidden',
                  border: '0.5px solid rgba(255,255,255,0.07)',
                  background: '#0f0f0f',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                {/* Header con gradiente */}
                <div
                  className={`bg-gradient-to-br ${artist.tone}`}
                  style={{ position: 'relative', minHeight: 240, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 22, overflow: 'hidden' }}
                >
                  {artist.avatarUrl ? (
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${resolveBackendUrl(artist.avatarUrl)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  ) : null}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)' }} />

                  {/* Fila superior */}
                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', fontFamily: FONT }}>
                      {artist.specialization}
                    </span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: FONT, letterSpacing: '0.1em' }}>
                      {artist.experienceLabel}
                    </span>
                  </div>

                  {/* Info inferior */}
                  <div style={{ position: 'relative' }}>
                    <p style={{ margin: '0 0 2px', fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: FONT, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                      {artist.legalName || 'Artista residente'}
                    </p>
                    <h2
                      style={{
                        margin: '0 0 4px',
                        fontFamily: FONT,
                        fontSize: 28,
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        textTransform: 'none',
                        color: '#fff',
                        lineHeight: 1.1,
                      }}
                    >
                      {artist.displayName}
                    </h2>
                    <p style={{ margin: '0 0 14px', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontFamily: FONT }}>
                      {artist.handle}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {artist.skills.map((skill) => (
                        <span key={skill} style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.1)', border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '3px 9px', fontFamily: FONT }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cuerpo */}
                <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>

                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: MUTED, fontFamily: FONT, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {artist.biography}
                  </p>

                  {/* Rating + location */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED, fontFamily: FONT }}>
                      <FiStar size={11} style={{ color: GOLD }} />
                      {artist.rating.toFixed(1)} · {artist.reviewCount} reviews
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: MUTED, fontFamily: FONT }}>
                      <FiMapPin size={11} />
                      {artist.location}
                    </span>
                  </div>

                  {/* Mini portfolio */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {artist.portfolio.slice(0, 3).map((piece) => (
                      <PortfolioCard key={piece.id} piece={piece} />
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/artists/${artist.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      borderRadius: 9999, background: GOLD,
                      padding: '13px 20px',
                      fontFamily: FONT, fontSize: 12, fontWeight: 700,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: '#0a0a0a', border: 'none', cursor: 'pointer',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    Ver detalle del tatuador <FiArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        {isLoading && (
          <p style={{ marginTop: 24, fontSize: 13, color: MUTED, fontFamily: FONT }}>
            Sincronizando artistas desde la capa MCP...
          </p>
        )}
      </div>

    </div>
  );
}
