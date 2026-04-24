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
        to={`/appointment?artistId=${slot.artistId}`}
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
