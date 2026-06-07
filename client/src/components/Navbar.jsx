const tabs = [
  { id: 'home',        label: 'Início' },
  { id: 'rsvp',        label: 'Confirmação' },
  { id: 'presentes',   label: 'Presentes' },
  { id: 'localizacao', label: 'Localização' },
]

export default function Navbar({ tab, setTab }) {
  return (
    <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #b8d5f0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          padding: '1rem 0',
        }}>
          <div
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#1e4d8c', cursor: 'pointer', letterSpacing: '0.05em' }}
            onClick={() => setTab('home')}
          >
            ⭐ Chá de Bebê
          </div>
          <nav style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: tab === t.id ? 400 : 300,
                  fontSize: '0.875rem',
                  padding: '0.4rem 0.9rem',
                  border: 'none',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: tab === t.id ? '#4a8ec9' : 'transparent',
                  color: tab === t.id ? '#fff' : '#1e4d8c',
                  letterSpacing: '0.03em',
                }}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
