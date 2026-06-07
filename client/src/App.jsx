import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import RSVP from './pages/RSVP'
import Presentes from './pages/Presentes'
import Localizacao from './pages/Localizacao'
import Admin from './pages/Admin'

export default function App() {
  const [tab, setTab] = useState('home')

  if (tab === 'admin') {
    return <Admin onBack={() => setTab('home')} />
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#eef6fd', display: 'flex', flexDirection: 'column' }}>
      <Navbar tab={tab} setTab={setTab} />
      <main style={{ flex: 1 }}>
        {tab === 'home'        && <Home setTab={setTab} />}
        {tab === 'rsvp'        && <RSVP />}
        {tab === 'presentes'   && <Presentes />}
        {tab === 'localizacao' && <Localizacao />}
      </main>
      <footer style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid #b8d5f0' }}>
        <p style={{ color: '#8ab0d5', fontSize: '0.75rem', fontWeight: 300 }}>
          Feito com amor ★
          {' · '}
          <button
            onClick={() => setTab('admin')}
            style={{ background: 'none', border: 'none', color: '#8ab0d5', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 300 }}
          >
            Admin
          </button>
        </p>
      </footer>
    </div>
  )
}
