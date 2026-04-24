import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiInstagram,
  FiMapPin,
  FiShield,
  FiStar,
} from 'react-icons/fi';
import { useStudioMcp } from '../context/StudioMcpContext';

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
        borderRadius: 24,
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
          padding: '18px 18px 20px',
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
            {g.artistHandle}
          </span>
        </div>

        {/* Nombre artista */}
        <h3
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            fontFamily: 'Inter, system-ui, sans-serif',
            textTransform: 'none',
          }}
        >
          {g.artistName}
        </h3>

        {/* Título sesión */}
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 12,
            color: 'rgba(255,255,255,0.45)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {g.title}
        </p>
      </div>
    </motion.article>
  );
}

/* ─── Artist card ─── */
function ArtistCard({ artist, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -6 }}
      style={{
        borderRadius: 24,
        overflow: 'hidden',
        background: '#0f0f0f',
        border: '0.5px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      {/* Parte superior: gradiente con especialidad + años + nombre */}
      <div
        style={{ position: 'relative', minHeight: 210, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 22, overflow: 'hidden' }}
      >
        {/* Fondo degradado via clase Tailwind */}
        <div className={`absolute inset-0 bg-gradient-to-br ${artist.tone}`} />
        {/* Overlay oscuro para legibilidad */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.72) 100%)',
          }}
        />

        {/* Fila superior: especialización + experiencia */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {artist.specialization}
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {artist.experienceLabel}
          </span>
        </div>

        {/* Nombre + handle + skills */}
        <div style={{ position: 'relative' }}>
          <h3
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              fontFamily: 'Inter, system-ui, sans-serif',
              textTransform: 'none',
            }}
          >
            {artist.displayName}
          </h3>
          <p
            style={{
              margin: '5px 0 12px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {artist.handle}
          </p>

          {/* Skills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {artist.skills?.map((skill) => (
              <span
                key={skill}
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.75)',
                  background: 'rgba(255,255,255,0.1)',
                  border: '0.5px solid rgba(255,255,255,0.15)',
                  borderRadius: 6,
                  padding: '3px 9px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Parte inferior: bio + rating + location */}
      <div
        style={{
          padding: '18px 22px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          flex: 1,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.45)',
            fontFamily: 'Inter, system-ui, sans-serif',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {artist.biography}
        </p>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 12,
            borderTop: '0.5px solid rgba(255,255,255,0.07)',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            <FiStar size={11} style={{ color: '#D4AA5A', flexShrink: 0 }} />
            {artist.rating?.toFixed(1)} · {artist.reviewCount} reseñas
          </span>
          <span
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {artist.location}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── Highlight bubble ─── */
function HighlightBubble({ item: h, index }) {
  return (
    <div className="group flex w-44 flex-col items-center rounded-[26px] border border-white/[0.08] bg-white/[0.03] p-5 text-center transition hover:-translate-y-1.5 hover:border-[#D4AA5A]/40 cursor-pointer">
      <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br ${h.tone}`}>
        <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-black/80 text-sm font-bold uppercase tracking-[0.2em] text-[#C8C8C8]"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>
      <h4 className="mb-1 font-semibold text-white"
        style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, textTransform: 'none', letterSpacing: 0 }}>
        {h.label}
      </h4>
      <p className="mb-0 text-xs text-white/45 leading-relaxed">{h.caption}</p>
    </div>
  );
}
/* ─── Booking slot ─── */
function BookingSlot({ slot, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      style={{
        borderRadius: 24,
        border: '0.5px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        padding: '22px 22px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        transition: 'border-color 0.2s',
      }}
    >
      {/* Badge slot */}
      <span
        style={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          borderRadius: 9999,
          border: '0.5px solid rgba(212,170,90,0.4)',
          background: 'rgba(212,170,90,0.12)',
          padding: '4px 12px',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: '#D4AA5A',
          fontFamily: 'Inter, system-ui, sans-serif',
          marginBottom: 14,
        }}
      >
        Slot {index + 1}
      </span>

      {/* Nombre */}
      <h3
        style={{
          margin: '0 0 4px',
          fontSize: 22,
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          fontFamily: 'Inter, system-ui, sans-serif',
          textTransform: 'none',
        }}
      >
        {slot.artistName}
      </h3>

      {/* Handle */}
      <p
        style={{
          margin: '0 0 16px',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        {slot.artistHandle}
      </p>

      {/* Info rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {[
          { label: slot.artistSpecialization },
          { label: slot.nextSlot },
          { label: slot.responseTime },
        ].map((row, i) => (
          <p
            key={i}
            style={{
              margin: 0,
              fontSize: 13,
              color: i === 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.35)',
              fontFamily: 'Inter, system-ui, sans-serif',
              lineHeight: 1.5,
            }}
          >
            {row.label}
          </p>
        ))}
      </div>

      {/* Botón — texto negro visible sobre dorado */}
      <Link
        to="/contact"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          borderRadius: 9999,
          background: '#D4AA5A',
          padding: '11px 20px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#0a0a0a',
          textDecoration: 'none',
          fontFamily: 'Inter, system-ui, sans-serif',
          marginTop: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        Reservar con {slot.artistName} <FiArrowRight size={12} />
      </Link>
    </motion.div>
  );
}

/* ════════════════════
   HOME
════════════════════ */
export default function Home() {
  const { studio, artists, gallery, highlights, appointmentSlots, source, isLoading } = useStudioMcp();
  const featuredArtists = artists.slice(0, 3);
  const leadArtist = artists[0];

  const headingStyle = {
    fontFamily: 'Inter, system-ui, sans-serif',
    textTransform: 'none',
    letterSpacing: '-0.02em',
  };

  return (
    <div className="home-page" style={{ background: '#080808', color: '#E8E8E8' }}>

      {/* ══ HERO ══ */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '10px 40px 80px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 10% 20%, rgba(212,170,90,0.13) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 85% 15%, rgba(255,255,255,0.06) 0%, transparent 50%), linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,170,90,0.6), transparent)' }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 60, alignItems: 'center' }}>

          {/* LEFT */}
          <motion.div variants={container} initial="hidden" animate="visible">

            <motion.div variants={itemAnim} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4AA5A', marginBottom: 24, fontFamily: 'Inter, system-ui, sans-serif' }}>
              <span style={{ display: 'block', width: 28, height: 1, background: '#D4AA5A' }} />
              {studio.handle} · estilo editorial
            </motion.div>

            <motion.h1
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
              Arte en la piel.{' '}
              <span style={{ color: '#D4AA5A' }}>Premium</span>{' '}
              desde el primer scroll.
            </motion.h1>

            <motion.p
              variants={itemAnim}
              style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, lineHeight: 1.78, color: 'rgba(255,255,255,0.55)', maxWidth: 480, marginBottom: 32 }}
            >
              {studio.accentLine || 'Rediseñamos la home para que se sienta Instagram-first: héroe cinemático, grid de galería, stories horizontales y CTAs claros para reservar.'}
            </motion.p>

            <motion.div variants={itemAnim} style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 40 }}>
              <a
                href="#booking"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, background: '#D4AA5A', padding: '13px 28px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0a0a0a', textDecoration: 'none', fontFamily: 'Inter, system-ui, sans-serif', transition: 'opacity .2s' }}
              >
                Reservar cita <FiArrowRight size={14} />
              </a>
              <a
                href={studio.instagramUrl}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, border: '1px solid rgba(255,255,255,0.18)', padding: '13px 28px', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', fontFamily: 'Inter, system-ui, sans-serif', transition: 'border-color .2s' }}
              >
                Ver Instagram <FiInstagram size={14} />
              </a>
            </motion.div>

            <motion.div variants={itemAnim} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
              {[
                { label: 'Feed',     value: `${gallery.length} piezas`,   desc: 'Grid editorial con hover y overlay.' },
                { label: 'Artistas', value: `${artists.length} perfiles`,  desc: 'Sincronizados por la capa MCP.' },
                { label: 'Estado',   value: source === 'live' ? 'Live' : 'Fallback', desc: isLoading ? 'Sincronizando...' : 'Sin romper la lógica actual.' },
              ].map((s) => (
                <div key={s.label} style={{ borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', padding: '18px 16px' }}>
                  <span style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#D4AA5A', marginBottom: 8, fontFamily: 'Inter, system-ui, sans-serif' }}>{s.label}</span>
                  <strong style={{ display: 'block', fontSize: 20, fontWeight: 700, color: '#C8C8C8', fontFamily: 'Inter, system-ui, sans-serif', textTransform: 'none', letterSpacing: '-0.01em', marginBottom: 4 }}>{s.value}</strong>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, system-ui, sans-serif' }}>{s.desc}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 34, border: '0.5px solid rgba(255,255,255,0.08)', background: 'linear-gradient(145deg, rgba(18,18,18,0.96), rgba(4,4,4,0.93))', padding: 22, boxShadow: '0 40px 90px rgba(0,0,0,0.5)' }}>
              <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 90% 10%, rgba(212,170,90,0.12) 0%, transparent 60%)' }} />

              <div style={{ position: 'relative', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 18, border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', padding: '14px 16px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#D4AA5A', marginBottom: 4, fontFamily: 'Inter, system-ui, sans-serif' }}>Dirección visual</span>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, system-ui, sans-serif' }}>{studio.accentLine}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 36, width: 60, borderRadius: 10, border: '0.5px solid rgba(212,170,90,0.35)', background: 'rgba(212,170,90,0.15)', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#D4AA5A', fontFamily: 'Inter, system-ui, sans-serif' }}>SAT</div>
              </div>

              {leadArtist && (
                <div style={{ position: 'relative', marginBottom: 16, overflow: 'hidden', borderRadius: 26, border: '0.5px solid rgba(255,255,255,0.1)', padding: 24, minHeight: 190, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: `linear-gradient(135deg, #1a0a08 0%, #0d1208 50%, #10081a 100%)` }}>
                  <div style={{ pointerEvents: 'none', position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.75) 100%)' }} />
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ borderRadius: 9999, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', padding: '5px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>Featured artist</span>
                    <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, system-ui, sans-serif' }}>{leadArtist.handle}</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <p style={{ margin: '0 0 6px', fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, system-ui, sans-serif' }}>{leadArtist.specialization}</p>
                    <h2 style={{ ...headingStyle, margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: '#fff' }}>{leadArtist.displayName}</h2>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.72)', maxWidth: 280, fontFamily: 'Inter, system-ui, sans-serif' }}>{leadArtist.biography}</p>
                  </div>
                </div>
              )}

              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {appointmentSlots.slice(0, 2).map((slot) => (
                  <div key={slot.id} style={{ borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, color: 'rgba(255,255,255,0.55)' }}>
                      <FiCalendar size={13} />
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D4AA5A', fontFamily: 'Inter, system-ui, sans-serif' }}>{slot.deposit}</span>
                    </div>
                    <h3 style={{ ...headingStyle, margin: '0 0 2px', fontSize: 16, fontWeight: 600, color: '#fff' }}>{slot.artistName}</h3>
                    <p style={{ margin: '0 0 5px', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, system-ui, sans-serif' }}>{slot.artistSpecialization}</p>
                    <p style={{ margin: 0, fontSize: 12, color: '#C8C8C8', fontFamily: 'Inter, system-ui, sans-serif' }}>{slot.nextSlot}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ GALLERY ══ */}
      <section id="gallery" style={{ padding: '100px 40px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            style={{ marginBottom: 56, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}
          >
            <div style={{ maxWidth: 560 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4AA5A', marginBottom: 20, fontFamily: 'Inter, system-ui, sans-serif' }}>
                <span style={{ display: 'block', width: 28, height: 1, background: '#D4AA5A' }} />
                Galería tipo Instagram
              </div>
              <h2 style={{ ...headingStyle, fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 800, color: '#fff', marginBottom: 14, lineHeight: 1.08 }}>
                Grid con presencia visual, overlay y zoom suave.
              </h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                La galería funciona como feed: cuadros limpios, composición densa y etiquetas por artista para que el usuario entienda el estilo sin entrar a otra vista.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { icon: <FiMapPin size={12} />, label: 'Studio feed' },
                { icon: <FiShield size={12} />, label: 'Curado por estilo' },
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {gallery.map((g, i) => (
              <GalleryTile key={g.id} item={g} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ HIGHLIGHTS ══ */}
      <section id="highlights" style={{ padding: '100px 40px', borderTop: '0.5px solid rgba(255,255,255,0.06)', borderBottom: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '0.85fr 1.15fr', gap: 60, alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4AA5A', marginBottom: 20, fontFamily: 'Inter, system-ui, sans-serif' }}>
              <span style={{ display: 'block', width: 28, height: 1, background: '#D4AA5A' }} />
              Destacados · stories
            </div>
            <h2 style={{ ...headingStyle, fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 700, color: '#fff', marginBottom: 14, lineHeight: 1.12 }}>
              Historias horizontales para estilos, consultas y sesiones recientes.
            </h2>
            <p style={{ margin: '0 0 28px', fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Tomamos la lógica de destacados de Instagram y la convertimos en una franja scrollable con círculos y labels claros.
            </p>
            <Link to="/artists" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, border: '1px solid rgba(255,255,255,0.15)', padding: '12px 26px', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', fontFamily: 'Inter, system-ui, sans-serif' }}>
              Explorar artistas <FiArrowRight size={14} />
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }}
            style={{ overflowX: 'auto', paddingBottom: 12 }}>
            <div style={{ display: 'flex', gap: 14, minWidth: 'max-content' }}>
              {highlights.map((h, i) => <HighlightBubble key={h.id} item={h} index={i} />)}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ ARTISTS ══ */}
      <section id="artists" style={{ padding: '100px 40px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            style={{ marginBottom: 48, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}
          >
            <div style={{ maxWidth: 560 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4AA5A', marginBottom: 20, fontFamily: 'Inter, system-ui, sans-serif' }}>
                <span style={{ display: 'block', width: 28, height: 1, background: '#D4AA5A' }} />
                Artistas
              </div>
              <h2 style={{ ...headingStyle, fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 800, color: '#fff', marginBottom: 14, lineHeight: 1.08 }}>
                Nombres con handle, cards con personalidad y mejor lectura de especialidades.
              </h2>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, system-ui, sans-serif' }}>
                Cards más limpias, más premium y listas para conectar con redes sociales.
              </p>
            </div>
            <Link
              to="/artists"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 9999, border: '1px solid rgba(255,255,255,0.18)', padding: '13px 28px', fontSize: 12, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'Inter, system-ui, sans-serif' }}
            >
              Ver roster completo <FiArrowRight size={14} />
            </Link>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {featuredArtists.map((artist, i) => (
              <ArtistCard key={artist.id} artist={artist} index={i} />
            ))}
          </div>
        </div>
      </section>

   {/* ══ BOOKING ══ */}
<section id="booking" style={{ padding: '100px 40px', borderTop: '0.5px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
  <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 60, alignItems: 'start' }}>

    {/* Columna izquierda */}
    <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4AA5A', marginBottom: 20, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <span style={{ display: 'block', width: 28, height: 1, background: '#D4AA5A' }} />
        Reservas y citas
      </div>
      <h2 style={{ ...headingStyle, fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 800, color: '#fff', marginBottom: 14, lineHeight: 1.1 }}>
        CTA claro, agenda visible y señales de confianza desde el hero hasta el cierre.
      </h2>
      <p style={{ margin: '0 0 32px', fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, system-ui, sans-serif' }}>
        La capa MCP deja listos artistas, galería y disponibilidad para que el sitio crezca con datos reales sin rehacer la arquitectura.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { icon: <FiClock size={14} />, title: 'Horario', desc: studio.hours },
          { icon: <FiShield size={14} />, title: 'Base estable', desc: 'Refactor visual con Tailwind y motion sin afectar rutas, auth ni carrito.' },
          { icon: <FiMapPin size={14} />, title: 'Ubicación', desc: studio.address },
        ].map((row) => (
          <div
            key={row.title}
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
    </motion.div>

    {/* Grid de slots */}
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
    >
      {appointmentSlots.map((slot, i) => (
        <BookingSlot key={slot.id} slot={slot} index={i} />
      ))}
    </motion.div>
  </div>
</section> 

    </div>
  );
}