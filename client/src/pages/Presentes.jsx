import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function Modal({ presente, onClose, onConfirm }) {
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function handleConfirm() {
    if (!nome.trim()) { setErr('Por favor, informe seu nome.'); return }
    setLoading(true)
    setErr('')
    try {
      const res = await fetch(`${API}/api/presentes/${presente.id}/escolher`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao escolher presente')
      onConfirm()
    } catch (e) {
      setErr(e.message)
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        backgroundColor: 'rgba(26,51,82,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '1.25rem',
        padding: '2rem',
        maxWidth: 420,
        width: '100%',
        boxShadow: '0 20px 60px rgba(74,142,201,0.3)',
        border: '1px solid #b8d5f0',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎁</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1e4d8c', fontSize: '1.6rem' }}>
            Quero dar este presente
          </h2>
          <p style={{ color: '#5a7fa8', fontWeight: 300, fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {presente.nome}
          </p>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#1e4d8c', fontWeight: 300, fontSize: '0.875rem' }}>
            Seu nome
          </label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Como você quer ser identificado(a)?"
            autoFocus
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
            }}
            onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          />
          {err && <p style={{ color: '#c0645a', fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: 300 }}>{err}</p>}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '0.75rem', border: '1.5px solid #b8d5f0',
              borderRadius: '999px', backgroundColor: '#fff', color: '#5a7fa8',
              cursor: 'pointer', fontFamily: "'Lato', sans-serif", fontWeight: 300,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{
              flex: 2, padding: '0.75rem', border: 'none',
              borderRadius: '999px', backgroundColor: loading ? '#a8c4e0' : '#4a8ec9',
              color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem',
              letterSpacing: '0.04em',
            }}
          >
            {loading ? 'Confirmando...' : 'Confirmar Presente'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Card({ presente, onEscolher }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '1.25rem',
        overflow: 'hidden',
        border: `1px solid ${presente.escolhido ? '#a8c4e0' : '#b8d5f0'}`,
        boxShadow: hovered && !presente.escolhido
          ? '0 12px 32px rgba(74,142,201,0.22)'
          : '0 2px 12px rgba(74,142,201,0.1)',
        transition: 'box-shadow 0.3s, transform 0.3s',
        transform: hovered && !presente.escolhido ? 'translateY(-4px)' : 'none',
        opacity: presente.escolhido ? 0.8 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', backgroundColor: '#ddeef8' }}>
        <img
          src={presente.foto_url || 'https://via.placeholder.com/400x200?text=Presente'}
          alt={presente.nome}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
          onMouseEnter={e => { if (!presente.escolhido) e.target.style.transform = 'scale(1.05)' }}
          onMouseLeave={e => e.target.style.transform = ''}
        />
        <div style={{
          position: 'absolute', top: '0.75rem', right: '0.75rem',
          backgroundColor: presente.escolhido ? '#4a8ec9' : '#4abf8a',
          color: '#fff',
          padding: '0.25rem 0.75rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontFamily: "'Lato', sans-serif",
          fontWeight: 400,
          letterSpacing: '0.05em',
        }}>
          {presente.escolhido ? 'Já escolhido' : 'Disponível'}
        </div>
      </div>

      <div style={{ padding: '1.25rem' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', color: '#1a3352', marginBottom: '0.4rem' }}>
          {presente.nome}
        </h3>
        <p style={{ color: '#4a8ec9', fontWeight: 400, fontSize: '1.1rem', marginBottom: '1rem' }}>
          {Number(presente.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {presente.link_compra && (
            <a
              href={presente.link_compra}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.5rem 1rem',
                border: '1.5px solid #b8d5f0',
                borderRadius: '999px',
                color: '#5a7fa8',
                fontSize: '0.8rem',
                textDecoration: 'none',
                fontFamily: "'Lato', sans-serif",
                fontWeight: 300,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.target.style.backgroundColor = '#ddeef8'; e.target.style.borderColor = '#4a8ec9' }}
              onMouseLeave={e => { e.target.style.backgroundColor = ''; e.target.style.borderColor = '#b8d5f0' }}
            >
              Ver produto ↗
            </a>
          )}
          <button
            disabled={presente.escolhido}
            onClick={() => onEscolher(presente)}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '999px',
              backgroundColor: presente.escolhido ? '#cce0f2' : '#4a8ec9',
              color: presente.escolhido ? '#7090b0' : '#fff',
              fontSize: '0.85rem',
              fontFamily: "'Cormorant Garamond', serif",
              cursor: presente.escolhido ? 'not-allowed' : 'pointer',
              letterSpacing: '0.03em',
              transition: 'all 0.2s',
            }}
          >
            {presente.escolhido ? 'Já escolhido' : 'Quero dar este presente'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Presentes() {
  const [presentes, setPresentes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalPresente, setModalPresente] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  async function load() {
    try {
      const res = await fetch(`${API}/api/presentes`)
      const data = await res.json()
      setPresentes(data)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function handleEscolher(presente) {
    setModalPresente(presente)
  }

  function handleConfirm() {
    setModalPresente(null)
    setSuccessMsg('Presente escolhido! Obrigado pela sua generosidade 🎉')
    load()
    setTimeout(() => setSuccessMsg(''), 4000)
  }

  const disponiveis = presentes.filter(p => !p.escolhido).length

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ color: '#4a8ec9', fontSize: '1.5rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>★ ★ ★</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.5rem', color: '#1e4d8c', marginBottom: '0.5rem' }}>
          Lista de Presentes
        </h1>
        <p style={{ color: '#5a7fa8', fontWeight: 300 }}>
          {loading ? 'Carregando...' : `${disponiveis} presente${disponiveis !== 1 ? 's' : ''} disponível${disponiveis !== 1 ? 'is' : ''}`}
        </p>
      </div>

      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #b8d5f0',
        borderRadius: '1.25rem',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        maxWidth: 680,
        margin: '0 auto 2rem',
        textAlign: 'center',
        boxShadow: '0 2px 12px rgba(74,142,201,0.08)',
      }}>
        <p style={{ color: '#1a3352', fontWeight: 300, lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>
          Separamos com muito carinho alguns links de presentes que gostaríamos de ganhar. Tem opções de R$30 até R$600, para que você possa escolher.
        </p>
        <p style={{ color: '#1a3352', fontWeight: 300, lineHeight: 1.8, fontSize: '0.95rem', margin: '0.75rem 0 0' }}>
          Caso escolha algum item dos links, pedimos que marque para evitarmos presentes repetidos. Fique livre também para se inspirar e lembrando que o mais importante para nós é a sua presença e o carinho de comemorar esse dia ao nosso lado ❤️
        </p>
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: '#ddeef8', border: '1px solid #b8d5f0', borderRadius: '0.75rem',
          padding: '0.85rem 1.25rem', textAlign: 'center', marginBottom: '1.5rem',
          color: '#1e4d8c', fontWeight: 300,
        }}>
          {successMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#5a7fa8' }}>Carregando presentes...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}>
          {presentes.map(p => (
            <Card key={p.id} presente={p} onEscolher={handleEscolher} />
          ))}
        </div>
      )}

      {modalPresente && (
        <Modal
          presente={modalPresente}
          onClose={() => setModalPresente(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
