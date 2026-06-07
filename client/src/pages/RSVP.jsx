import { useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function RSVP() {
  const [nome, setNome] = useState('')
  const [vaiComparecer, setVaiComparecer] = useState(null)
  const [status, setStatus] = useState(null) // 'success' | 'error'
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!nome.trim()) { setMsg('Por favor, informe seu nome.'); setStatus('error'); return }
    if (vaiComparecer === null) { setMsg('Por favor, confirme sua presença.'); setStatus('error'); return }
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch(`${API}/api/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim(), vai_comparecer: vaiComparecer }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar')
      setStatus('success')
      setMsg(vaiComparecer ? '🎉 Oba! Estamos te esperando com muito amor!' : 'Recebemos sua resposta. Sentiremos sua falta!')
      setNome('')
      setVaiComparecer(null)
    } catch (err) {
      setStatus('error')
      setMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  const radioStyle = (val) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.85rem 1.25rem',
    borderRadius: '0.75rem',
    border: `2px solid ${vaiComparecer === val ? '#4a8ec9' : '#b8d5f0'}`,
    backgroundColor: vaiComparecer === val ? '#ddeef8' : '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: "'Lato', sans-serif",
    fontWeight: vaiComparecer === val ? 400 : 300,
    color: '#1a3352',
    fontSize: '1rem',
  })

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '2.5rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ color: '#4a8ec9', fontSize: '1.5rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>★ ★ ★</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#1e4d8c', marginBottom: '0.5rem' }}>
          Confirmação de Presença
        </h1>
        <p style={{ color: '#5a7fa8', fontWeight: 300 }}>Sua presença é muito importante para nós</p>
      </div>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '1.25rem',
        padding: '2rem',
        boxShadow: '0 4px 24px rgba(74,142,201,0.12)',
        border: '1px solid #b8d5f0',
      }}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1e4d8c', fontSize: '1.8rem', marginBottom: '0.75rem' }}>
              Recebido!
            </h2>
            <p style={{ color: '#5a7fa8', fontWeight: 300, marginBottom: '1.5rem' }}>{msg}</p>
            <button
              onClick={() => setStatus(null)}
              style={{ color: '#4a8ec9', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 300, textDecoration: 'underline' }}
            >
              Enviar outra resposta
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e4d8c', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                Nome completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Seu nome"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1.5px solid #b8d5f0',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 300,
                  color: '#1a3352',
                  backgroundColor: '#eef6fd',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#4a8ec9'}
                onBlur={e => e.target.style.borderColor = '#b8d5f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', color: '#1e4d8c', fontWeight: 300, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                Confirmação de presença
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={radioStyle(true)} onClick={() => setVaiComparecer(true)}>
                  <input type="radio" name="presenca" style={{ display: 'none' }} />
                  <span style={{ color: vaiComparecer === true ? '#4a8ec9' : '#8ab0d5', fontSize: '1.2rem' }}>✓</span>
                  Sim, vou comparecer!
                </label>
                <label style={radioStyle(false)} onClick={() => setVaiComparecer(false)}>
                  <input type="radio" name="presenca" style={{ display: 'none' }} />
                  <span style={{ color: vaiComparecer === false ? '#4a8ec9' : '#8ab0d5', fontSize: '1.2rem' }}>✗</span>
                  Não poderei ir
                </label>
              </div>
            </div>

            {status === 'error' && (
              <p style={{ color: '#c0645a', fontSize: '0.875rem', fontWeight: 300 }}>{msg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#a8c4e0' : '#4a8ec9',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '0.85rem',
                fontSize: '1rem',
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: '0.05em',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Enviando...' : 'Confirmar'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
