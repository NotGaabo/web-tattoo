// ── ArtistCard ──────────────────────────────────────────────────────────────
function ArtistCard({ artist, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        background: '#111',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 320,
        position: 'relative',
      }}
    >
      {/* Imagen / fondo degradado del artista */}
      <div style={{
        height: 180,
        background: artist.gradient || 'linear-gradient(135deg, #8B6914 0%, #1a1a1a 100%)',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Especialidad + años arriba */}
        <div style={{
          position: 'absolute', top: 14, left: 14, right: 14,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)' }}>
            {artist.specialty}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>
            {artist.years} años
          </span>
        </div>
      </div>

      {/* Info inferior */}
      <div style={{ padding: '20px 20px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {artist.name}
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#D4AA5A', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            @{artist.handle}
          </p>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {artist.tags?.map((tag) => (
            <span key={tag} style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.06)',
              border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 4,
              padding: '3px 8px',
            }}>
              {tag}
            </span>
          ))}
        </div>

        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, flexGrow: 1 }}>
          {artist.bio}
        </p>

        {/* Footer: rating + cabina */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <FiArrowUpRight size={11} style={{ color: '#D4AA5A' }} />
            {artist.rating} · {artist.reviews} reseñas
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
            {artist.room}
          </span>
        </div>
      </div>
    </motion.div>
  );
}