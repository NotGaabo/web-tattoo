import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiClock,
  FiInstagram,
  FiMapPin,
  FiShield,
} from 'react-icons/fi';
import { useStudioMcp } from '../context/StudioMcpContext';
import './Home.css';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const itemAnim = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};


/* ─── Gallery tile ─── */
function GalleryTile({ item: g, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover="hover"
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        aspectRatio: '1 / 1',
        cursor: 'pointer',
        background: '#111',
        border: '0.5px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Fondo: imagen o gradiente */}
      <motion.div
        variants={{ hover: { scale: 1.07 } }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          ...(g.imageUrl
            ? { backgroundImage: `url(${g.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}),
        }}
      >
        {/* Clase Tailwind del tone como fondo si no hay imagen */}
        {!g.imageUrl && (
          <div className={`absolute inset-0 bg-gradient-to-br ${g.tone}`} />
        )}
      </motion.div>

      {/* Overlay inferior */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 45%, transparent 100%)',
        }}
      />

      {/* Contenido inferior */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 16px 18px',
        }}
      >
        {/* Tag + handle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#D4AA5A',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {g.style}
          </span>
 
        </div>

        {/* Nombre de la pieza */}
        <h3
          style={{
            margin: 0,
            fontSize: 19,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            fontFamily: 'Inter, system-ui, sans-serif',
            textTransform: 'none',
          }}
        >
          {g.pieceTitle || g.title}
        </h3>

        {/* Autor de la pieza */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            marginTop: 6,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {g.artistName}
          </span>
          {g.artistHandle ? (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.34)',
                fontFamily: 'Inter, system-ui, sans-serif',
                textTransform: 'none',
              }}
            >
              {g.artistHandle}
            </span>
          ) : null}
        </div>

        {g.description ? (
          <p
            style={{
              margin: '8px 0 0',
              fontSize: 12,
              lineHeight: 1.45,
              color: 'rgba(255,255,255,0.62)',
              fontFamily: 'Inter, system-ui, sans-serif',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {g.description}
          </p>
        ) : null}
      </div>
    </motion.article>
  );
}

/* ════════════════════
   HOME
════════════════════ */
export default function Home() {
  const { studio, artists, gallery } = useStudioMcp();

  const headingStyle = {
    fontFamily: 'Inter, system-ui, sans-serif',
    textTransform: 'none',
    letterSpacing: '-0.02em',
  };

  return (
    <div className="home-page" style={{ background: '#080808', color: '#E8E8E8' }}>

      {/* ══ HERO ══ */}
      <section className="home-hero-section" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '10px 40px 80px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 10% 20%, rgba(212,170,90,0.13) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 15%, rgba(255,255,255,0.06) 0%, transparent 50%), linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,170,90,0.6), transparent)' }} />

        <div className="home-hero-layout" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 920, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: 60, alignItems: 'center' }}>

          <motion.div className="home-hero-copy" variants={container} initial="hidden" animate="visible">

            <motion.div className="home-eyebrow" variants={itemAnim} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4AA5A', marginBottom: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
              <span style={{ display: 'block', width: 28, height: 1, background: '#D4AA5A' }} />
              {studio.handle} · estudio de tatuajes
            </motion.div>

            <motion.h1
              className="home-hero-title"
              variants={itemAnim}
              style={{
                ...headingStyle,
                fontSize: 'clamp(32px, 4vw, 52px)',
                fontWeight: 700,
                lineHeight: 1.1,
                color: '#fff',
                marginBottom: 24,
                maxWidth: '11ch',
              }}
            >
              Tatuajes hechos con calma,{' '}
              <span style={{ color: '#D4AA5A' }}>detalle</span>{' '}
              y buen criterio.
            </motion.h1>

            <motion.p
              className="home-hero-text"
              variants={itemAnim}
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, lineHeight: 1.78, color: 'rgba(255,255,255,0.55)', maxWidth: 480, marginBottom: 32 }}
            >
              Diseños personalizados, artistas con estilos definidos y un proceso claro para que llegues con confianza a tu próxima sesión.
            </motion.p>

            <motion.div className="home-hero-actions-modern" variants={itemAnim} style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 40 }}>
              <a
                href={studio.instagramUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, border: '1px solid rgba(255,255,255,0.18)', padding: '13px 28px', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', fontFamily: 'Inter, system-ui, sans-serif', transition: 'border-color .2s' }}
              >
                Ver Instagram <FiInstagram size={14} />
              </a>
            </motion.div>

            <motion.div className="home-hero-stats" variants={itemAnim} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Galería', value: `${gallery.length} piezas`, desc: 'Trabajos recientes del estudio.' },
                { label: 'Artistas', value: `${artists.length} perfiles`, desc: 'Elige el estilo que va contigo.' },
                { label: 'Reservas', value: 'Abiertas', desc: 'Agenda tu consulta o sesión.' },
              ].map((s) => (
                <div key={s.label} style={{ borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', padding: '18px 16px' }}>
                  <span style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#D4AA5A', marginBottom: 8, fontFamily: 'Inter, system-ui, sans-serif' }}>{s.label}</span>
                  <strong style={{ display: 'block', fontSize: 20, fontWeight: 700, color: '#C8C8C8', fontFamily: 'Inter, system-ui, sans-serif', textTransform: 'none', letterSpacing: '-0.01em', marginBottom: 4 }}>{s.value}</strong>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, system-ui, sans-serif' }}>{s.desc}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      {gallery.length > 0 ? (
        <section className="home-section" id="gallery" style={{ padding: '100px 40px', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              className="home-gallery-header"
              style={{ marginBottom: 56, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}
            >
              <div style={{ maxWidth: 560 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4AA5A', marginBottom: 20, fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <span style={{ display: 'block', width: 28, height: 1, background: '#D4AA5A' }} />
                  Galeria de tatuajes
                </div>
                <h2 style={{ ...headingStyle, fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 800, color: '#fff', marginBottom: 14, lineHeight: 1.08 }}>
                  Mira trabajos reales antes de elegir tu proxima pieza.
                </h2>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  Explora estilos, tecnicas y piezas recientes realizadas por nuestros artistas.
                </p>
              </div>
              <div className="home-gallery-tags" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                  { icon: <FiMapPin size={12} />, label: 'Piezas recientes' },
                  { icon: <FiShield size={12} />, label: 'Trabajos del estudio' },
                ].map((t) => (
                  <span
                    key={t.label}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 9999, border: '0.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', padding: '8px 16px', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, system-ui, sans-serif' }}
                  >
                    {t.icon} {t.label}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="home-gallery-grid">
              {gallery.map((galleryItem, index) => (
                <GalleryTile key={galleryItem.id} item={galleryItem} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

   {/* ══ BOOKING ══ */}
<section className="home-section" id="booking" style={{ padding: '100px 40px', borderTop: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
  <div style={{ maxWidth: 1200, margin: '0 auto' }}>
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="home-booking-card"
      style={{
        borderRadius: 30,
        border: '0.5px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        padding: '38px 34px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4AA5A', marginBottom: 20, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <span style={{ display: 'block', width: 28, height: 1, background: '#D4AA5A' }} />
        Reservas y citas
      </div>

      <div className="home-booking-content" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)', gap: 28, alignItems: 'start' }}>
        <div className="home-booking-copy">
          <span
            style={{
              display: 'inline-flex',
              borderRadius: 9999,
              border: '0.5px solid rgba(212,170,90,0.4)',
              background: 'rgba(212,170,90,0.12)',
              padding: '5px 12px',
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#D4AA5A',
              fontFamily: 'Inter, system-ui, sans-serif',
              marginBottom: 18,
            }}
          >
            Agenda abierta
          </span>

          <h2 style={{ ...headingStyle, fontSize: 'clamp(26px, 3vw, 42px)', fontWeight: 800, color: '#fff', marginBottom: 14, lineHeight: 1.08 }}>
            Reserva tu cita y llega con todo claro desde el primer mensaje.
          </h2>

          <p
            style={{
              margin: '0 0 28px',
              fontSize: 15,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'Inter, system-ui, sans-serif',
              maxWidth: 620,
            }}
          >
            Cuéntanos tu idea y te guiamos con el estilo, la disponibilidad y los detalles para agendar tu sesión, sin repetir artistas ni llenar el inicio con información duplicada.
          </p>

          <Link
            to="/appointment"
            className="home-booking-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 9999,
              background: '#D4AA5A',
              padding: '13px 24px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#0a0a0a',
              textDecoration: 'none',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            Reservar cita <FiArrowRight size={14} />
          </Link>
        </div>

        <div className="home-booking-info" style={{ display: 'grid', gap: 12 }}>
          {[
            { icon: <FiClock size={14} />, title: 'Horario', desc: studio.hours },
            { icon: <FiShield size={14} />, title: 'Acompañamiento', desc: 'Orientación antes, durante y después de tu sesión.' },
            { icon: <FiMapPin size={14} />, title: 'Ubicación', desc: studio.address || 'Escríbenos para compartirte la dirección del estudio.' },
            { icon: <FiArrowRight size={14} />, title: 'Proceso', desc: 'Comparte tu idea, revisamos disponibilidad y confirmas tu cita.' },
          ].map((row) => (
            <div
              key={row.title}
              className="home-booking-info-card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                borderRadius: 18,
                border: '0.5px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.03)',
                padding: '14px 18px',
              }}
            >
              <span style={{ color: '#D4AA5A', marginTop: 1, flexShrink: 0 }}>{row.icon}</span>
              <div>
                <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {row.title}
                </p>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {row.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  </div>
</section> 

    </div>
  );
}
