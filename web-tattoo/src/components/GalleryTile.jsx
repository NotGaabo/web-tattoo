// ── GalleryTile ──────────────────────────────────────────────────────────────
function GalleryTile({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover="hover"
      style={{ borderRadius: 18, overflow: 'hidden', position: 'relative', aspectRatio: '1 / 1', cursor: 'pointer', background: '#111' }}
    >
      {/* Imagen / fondo */}
      <motion.div
        variants={{ hover: { scale: 1.06 } }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'absolute', inset: 0,
          background: item.gradient || 'linear-gradient(135deg, #8B6914 0%, #1a1a1a 100%)',
        }}
      />

      {/* Overlay degradado inferior */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)',
      }} />

      {/* Info inferior */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#D4AA5A' }}>
            {item.tag}
          </span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            @{item.handle}
          </span>
        </div>
        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {item.artistName}
        </h3>
        <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          {item.sessionLabel}
        </p>
      </div>
    </motion.div>
  );
}