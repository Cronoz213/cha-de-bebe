import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.875rem',
  border: '1.5px solid #f3d5d5',
  borderRadius: '0.5rem',
  fontSize: '0.9rem',
  fontFamily: "'Lato', sans-serif",
  fontWeight: 300,
  color: '#4a3535',
  backgroundColor: '#fdf8f4',
  outline: 'none',
  boxSizing: 'border-box',
}

const btnPrimary = {
  backgroundColor: '#c49ea0',
  color: '#fff',
  border: 'none',
  borderRadius: '999px',
  padding: '0.6rem 1.5rem',
  cursor: 'pointer',
  fontFamily: "'Lato', sans-serif",
  fontWeight: 300,
  fontSize: '0.875rem',
}

const btnDanger = {
  backgroundColor: '#fff',
  color: '#c0645a',
  border: '1.5px solid #f3d5d5',
  borderRadius: '999px',
  padding: '0.4rem 1rem',
  cursor: 'pointer',
  fontFamily: "'Lato', sans-serif",
  fontWeight: 300,
  fontSize: '0.8rem',
}

function PresenteForm({ initial, onSave, onCancel, authPassword }) {
  const [form, setForm] = useState(initial || { nome: '', valor: '', link_compra: '', foto_url: '' })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [err, setErr] = useState('')
  const [preview, setPreview] = useState(initial?.foto_url || '')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleFotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setErr('')
    try {
      const data = new FormData()
      data.append('foto', file)
      const res = await fetch(`${API}/api/admin/upload`, {
        method: 'POST',
        headers: { 'x-admin-token': authPassword },
        body: data,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Erro ao enviar imagem')
      set('foto_url', json.url)
      setPreview(json.url)
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.nome.trim() || !form.valor) { setErr('Nome e valor são obrigatórios'); return }
    setLoading(true)
    setErr('')
    try {
      await onSave({ ...form, valor: parseFloat(form.valor) })
    } catch (ex) {
      setErr(ex.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#9c7878', display: 'block', marginBottom: '0.3rem' }}>Nome *</label>
          <input style={inputStyle} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome do presente" />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#9c7878', display: 'block', marginBottom: '0.3rem' }}>Valor (R$) *</label>
          <input style={inputStyle} type="number" step="0.01" value={form.valor} onChange={e => set('valor', e.target.value)} placeholder="0.00" />
        </div>
      </div>
      <div>
        <label style={{ fontSize: '0.8rem', color: '#9c7878', display: 'block', marginBottom: '0.3rem' }}>Link de Compra</label>
        <input style={inputStyle} value={form.link_compra} onChange={e => set('link_compra', e.target.value)} placeholder="https://..." />
      </div>
      <div>
        <label style={{ fontSize: '0.8rem', color: '#9c7878', display: 'block', marginBottom: '0.3rem' }}>
          Foto do Presente {uploading && <span style={{ color: '#c49ea0' }}>— enviando...</span>}
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '0.5rem', border: '1.5px solid #f3d5d5', flexShrink: 0 }}
            />
          )}
          <label style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.55rem 1rem', borderRadius: '999px', cursor: 'pointer',
            border: '1.5px solid #f3d5d5', backgroundColor: '#fdf8f4',
            color: '#9c7878', fontSize: '0.875rem', fontWeight: 300,
          }}>
            {preview ? 'Trocar imagem' : 'Escolher imagem'}
            <input type="file" accept="image/*" onChange={handleFotoChange} style={{ display: 'none' }} />
          </label>
          {preview && (
            <button type="button" onClick={() => { set('foto_url', ''); setPreview('') }} style={{ ...btnDanger, fontSize: '0.75rem' }}>
              Remover
            </button>
          )}
        </div>
      </div>
      {err && <p style={{ color: '#c0645a', fontSize: '0.8rem', fontWeight: 300 }}>{err}</p>}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        {onCancel && <button type="button" onClick={onCancel} style={{ ...btnDanger, color: '#9c7878' }}>Cancelar</button>}
        <button type="submit" disabled={loading || uploading} style={btnPrimary}>
          {loading ? 'Salvando...' : (initial?.id ? 'Salvar Alterações' : 'Adicionar Presente')}
        </button>
      </div>
    </form>
  )
}

function LoginScreen({ onLogin }) {
  const [senha, setSenha] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao autenticar')
      sessionStorage.setItem('admin_token', data.token)
      onLogin(data.token)
    } catch (ex) {
      setErr(ex.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fdf8f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '1.25rem', padding: '2.5rem', maxWidth: 380, width: '100%', border: '1px solid #f3d5d5', boxShadow: '0 8px 32px rgba(196,158,160,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔑</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8a5f62', fontSize: '2rem' }}>Área Admin</h1>
          <p style={{ color: '#9c7878', fontWeight: 300, fontSize: '0.875rem', marginTop: '0.25rem' }}>Acesso restrito</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#9c7878', display: 'block', marginBottom: '0.4rem' }}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
              autoFocus
            />
          </div>
          {err && <p style={{ color: '#c0645a', fontSize: '0.8rem' }}>{err}</p>}
          <button type="submit" disabled={loading} style={{ ...btnPrimary, padding: '0.75rem', borderRadius: '999px' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Admin({ onBack }) {
  const [auth, setAuth] = useState(() => sessionStorage.getItem('admin_token'))
  const [tab, setTab] = useState('convidados')
  const [rsvps, setRsvps] = useState([])
  const [presentes, setPresentes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const headers = { 'Content-Type': 'application/json', 'x-admin-token': auth }

  async function loadRsvps() {
    const res = await fetch(`${API}/api/admin/rsvp`, { headers })
    setRsvps(await res.json())
  }

  async function loadPresentes() {
    const res = await fetch(`${API}/api/admin/presentes`, { headers })
    setPresentes(await res.json())
  }

  useEffect(() => {
    if (!auth) return
    setLoading(true)
    Promise.all([loadRsvps(), loadPresentes()]).finally(() => setLoading(false))
  }, [auth])

  async function handleAdd(form) {
    const res = await fetch(`${API}/api/admin/presentes`, {
      method: 'POST', headers, body: JSON.stringify(form),
    })
    if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
    await loadPresentes()
    setShowForm(false)
    flash('Presente adicionado!')
  }

  async function handleEdit(form) {
    const res = await fetch(`${API}/api/admin/presentes/${editando.id}`, {
      method: 'PUT', headers, body: JSON.stringify(form),
    })
    if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
    await loadPresentes()
    setEditando(null)
    flash('Presente atualizado!')
  }

  async function handleDelete(id) {
    if (!confirm('Excluir este presente?')) return
    await fetch(`${API}/api/admin/presentes/${id}`, { method: 'DELETE', headers })
    await loadPresentes()
    flash('Presente excluído.')
  }

  function flash(m) { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  if (!auth) return <LoginScreen onLogin={setAuth} />

  const confirmados = rsvps.filter(r => r.vai_comparecer === 1).length

  const sectionStyle = {
    backgroundColor: '#fff',
    borderRadius: '1rem',
    border: '1px solid #f3d5d5',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 12px rgba(196,158,160,0.08)',
  }

  const thStyle = { textAlign: 'left', padding: '0.5rem 0.75rem', color: '#9c7878', fontSize: '0.75rem', fontWeight: 300, letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid #f3d5d5' }
  const tdStyle = { padding: '0.6rem 0.75rem', fontSize: '0.875rem', fontWeight: 300, borderBottom: '1px solid #fdf8f4', color: '#4a3535' }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fdf8f4' }}>
      {/* Top bar */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #f3d5d5', padding: '0 1rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9c7878', fontSize: '0.875rem' }}>
              ← Voltar ao site
            </button>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8a5f62', fontSize: '1.2rem' }}>
              Painel Admin
            </span>
          </div>
          <button onClick={async () => {
            await fetch(`${API}/api/admin/logout`, { method: 'POST', headers: { 'x-admin-token': auth } })
            sessionStorage.removeItem('admin_token')
            setAuth(null)
          }} style={{ ...btnDanger, fontSize: '0.75rem' }}>Sair</button>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {['convidados', 'presentes'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.5rem 1.25rem', border: 'none', borderRadius: '999px', cursor: 'pointer',
              backgroundColor: tab === t ? '#c49ea0' : '#fff',
              color: tab === t ? '#fff' : '#9c7878',
              fontFamily: "'Lato', sans-serif", fontWeight: 300, fontSize: '0.875rem',
              border: tab === t ? 'none' : '1px solid #f3d5d5',
            }}>
              {t === 'convidados' ? 'Convidados' : 'Presentes'}
            </button>
          ))}
        </div>

        {msg && (
          <div style={{ backgroundColor: '#fae8e8', border: '1px solid #f3d5d5', borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#8a5f62', fontWeight: 300, fontSize: '0.875rem' }}>
            {msg}
          </div>
        )}

        {loading && <p style={{ color: '#9c7878', fontWeight: 300 }}>Carregando...</p>}

        {/* CONVIDADOS */}
        {!loading && tab === 'convidados' && (
          <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8a5f62', fontSize: '1.5rem' }}>
                Confirmações de Presença
              </h2>
              <span style={{ backgroundColor: '#fae8e8', color: '#c49ea0', borderRadius: '999px', padding: '0.3rem 1rem', fontSize: '0.875rem' }}>
                {confirmados} confirmado{confirmados !== 1 ? 's' : ''}
              </span>
            </div>
            {rsvps.length === 0 ? (
              <p style={{ color: '#9c7878', fontWeight: 300 }}>Nenhuma confirmação ainda.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Nome</th>
                      <th style={thStyle}>Presença</th>
                      <th style={thStyle}>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.map(r => (
                      <tr key={r.id}>
                        <td style={tdStyle}>{r.nome}</td>
                        <td style={tdStyle}>
                          <span style={{
                            color: r.vai_comparecer ? '#5a9c6e' : '#c0645a',
                            backgroundColor: r.vai_comparecer ? '#eef7f1' : '#fdf0ef',
                            padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem',
                          }}>
                            {r.vai_comparecer ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, color: '#9c7878', fontSize: '0.8rem' }}>
                          {new Date(r.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PRESENTES */}
        {!loading && tab === 'presentes' && (
          <div>
            <div style={sectionStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8a5f62', fontSize: '1.5rem' }}>
                  Lista de Presentes
                </h2>
                <button onClick={() => { setShowForm(true); setEditando(null) }} style={btnPrimary}>
                  + Adicionar Presente
                </button>
              </div>

              {showForm && !editando && (
                <div style={{ backgroundColor: '#fdf8f4', borderRadius: '0.75rem', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid #f3d5d5' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", color: '#8a5f62', marginBottom: '1rem', fontSize: '1.2rem' }}>
                    Novo Presente
                  </h3>
                  <PresenteForm onSave={handleAdd} onCancel={() => setShowForm(false)} authPassword={auth} />
                </div>
              )}

              {presentes.length === 0 ? (
                <p style={{ color: '#9c7878', fontWeight: 300 }}>Nenhum presente cadastrado.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Nome</th>
                        <th style={thStyle}>Valor</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Quem escolheu</th>
                        <th style={thStyle}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {presentes.map(p => (
                        <>
                          <tr key={p.id}>
                            <td style={tdStyle}>{p.nome}</td>
                            <td style={tdStyle}>{Number(p.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                            <td style={tdStyle}>
                              <span style={{
                                color: p.escolhido_por ? '#c49ea0' : '#5a9c6e',
                                backgroundColor: p.escolhido_por ? '#fae8e8' : '#eef7f1',
                                padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem',
                              }}>
                                {p.escolhido_por ? 'Escolhido' : 'Disponível'}
                              </span>
                            </td>
                            <td style={{ ...tdStyle, color: '#9c7878' }}>{p.escolhido_por || '—'}</td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button onClick={() => { setEditando(p); setShowForm(false) }} style={{ ...btnDanger, color: '#8a5f62' }}>Editar</button>
                                <button onClick={() => handleDelete(p.id)} style={btnDanger}>Excluir</button>
                              </div>
                            </td>
                          </tr>
                          {editando?.id === p.id && (
                            <tr key={`edit-${p.id}`}>
                              <td colSpan={5} style={{ padding: '0.75rem', backgroundColor: '#fdf8f4' }}>
                                <PresenteForm
                                  initial={{ nome: p.nome, valor: p.valor, link_compra: p.link_compra || '', foto_url: p.foto_url || '' }}
                                  onSave={handleEdit}
                                  onCancel={() => setEditando(null)}
                                  authPassword={auth}
                                />
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
