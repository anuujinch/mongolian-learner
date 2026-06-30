const PATTERN = `url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5C518' fill-opacity='0.12'%3E%3Cpolygon points='16,2 30,16 16,30 2,16'/%3E%3Cpolygon points='16,8 24,16 16,24 8,16'/%3E%3C/g%3E%3C/svg%3E")`

export default function Nav({ page, setPage }) {
  return (
    <nav style={{
      background: `var(--primary)`,
      backgroundImage: PATTERN,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 24px rgba(1,63,122,0.35)',
    }}>
      <div style={{
        maxWidth: 860,
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 62,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38,
            background: 'var(--gold)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 800,
            color: 'var(--primary)',
            boxShadow: '0 2px 8px rgba(245,197,24,0.4)',
            flexShrink: 0,
          }}>М</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.1, letterSpacing: '0.03em' }}>
              Монгол Хэл
            </div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.65rem', letterSpacing: '0.12em', fontWeight: 600 }}>
              MONGOLIAN DICTIONARY
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: 24 }}>
          {[
            { id: 'search',  label: '🔍 Dictionary' },
            { id: 'reading', label: '📖 Reading Room' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                padding: '7px 16px',
                borderRadius: 20,
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
                background: page === id ? 'var(--gold)' : 'transparent',
                color:      page === id ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                boxShadow:  page === id ? '0 2px 8px rgba(245,197,24,0.35)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
