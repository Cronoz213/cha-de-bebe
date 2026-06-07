const MAPS_URL = `https://www.google.com/maps/place/17%C2%B033'28.0%22S+50%C2%B037'15.8%22W/@-17.5577869,-50.6236381,17z/data=!3m1!4b1!4m4!3m3!8m2!3d-17.5577869!4d-50.6210632?hl=pt-BR`
const MAPS_EMBED = `https://www.google.com/maps?q=-17.5577869,-50.6210632&output=embed`

export default function Localizacao() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2.5rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ color: '#4a8ec9', fontSize: '1.5rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>★ ★ ★</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#1e4d8c', marginBottom: '0.5rem' }}>
          Localização
        </h1>
        <p style={{ color: '#5a7fa8', fontWeight: 300 }}>Onde acontecerá a celebração</p>
      </div>

      {/* Address Card */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '1.25rem',
        padding: '2rem',
        border: '1px solid #b8d5f0',
        boxShadow: '0 4px 24px rgba(74,142,201,0.12)',
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📍</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1e4d8c', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
          Endereço
        </h2>

        {/* Endereço clicável */}
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            textDecoration: 'none',
            marginBottom: '1.5rem',
            cursor: 'pointer',
          }}
        >
          <p style={{
            color: '#1a3352',
            fontWeight: 600,
            lineHeight: 1.7,
            fontSize: '1.15rem',
            marginBottom: '0.25rem',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = '#4a8ec9'}
            onMouseLeave={e => e.target.style.color = '#1a3352'}
          >
            Clubinho das Irmãs
          </p>
          <p style={{
            color: '#5a7fa8',
            fontWeight: 300,
            fontSize: '0.9rem',
            borderBottom: '1px dashed #b8d5f0',
            paddingBottom: '0.5rem',
            marginBottom: '0.4rem',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = '#4a8ec9'}
            onMouseLeave={e => e.target.style.color = '#5a7fa8'}
          >
            17°33'28.0"S 50°37'15.8"W
          </p>
          <p style={{
            color: '#5a7fa8',
            fontWeight: 300,
            fontSize: '0.95rem',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => e.target.style.color = '#4a8ec9'}
            onMouseLeave={e => e.target.style.color = '#5a7fa8'}
          >
            Clique para abrir no Google Maps ↗
          </p>
        </a>

        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            backgroundColor: '#4a8ec9',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '0.75rem 2rem',
            fontSize: '0.95rem',
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: '0.04em',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(74,142,201,0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(74,142,201,0.4)' }}
          onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '0 4px 16px rgba(74,142,201,0.3)' }}
        >
          Abrir no Google Maps ↗
        </a>
      </div>

      {/* Map Embed */}
      <div style={{
        borderRadius: '1.25rem',
        overflow: 'hidden',
        border: '1px solid #b8d5f0',
        boxShadow: '0 4px 24px rgba(74,142,201,0.12)',
      }}>
        <iframe
          src={MAPS_EMBED}
          title="Mapa do evento"
          width="100%"
          height="360"
          style={{ border: 'none', display: 'block' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Extra info */}
      <div style={{
        marginTop: '1.5rem',
        backgroundColor: '#ddeef8',
        borderRadius: '1rem',
        padding: '1.25rem 1.5rem',
        border: '1px solid #b8d5f0',
        display: 'flex',
        gap: '1rem',
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '1.5rem' }}>🕐</span>
        <div>
          <p style={{ color: '#1e4d8c', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            Horário do Evento
          </p>
          <p style={{ color: '#5a7fa8', fontWeight: 300, fontSize: '0.9rem' }}>
            Domingo, 19 de Julho de 2026 · a partir das 14h00
          </p>
        </div>
      </div>
    </div>
  )
}
