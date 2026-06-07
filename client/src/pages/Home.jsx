import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export default function Home({ setTab }) {
  const [width, setWidth] = useState(null)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ color: '#4a8ec9', fontSize: '1.5rem', letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
          ★ ★ ★
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', color: '#1e4d8c', marginBottom: '0.5rem' }}>
          Convite
        </h1>
        <p style={{ color: '#5a7fa8', fontWeight: 300, fontSize: '1rem', letterSpacing: '0.1em' }}>
          Com amor, esperamos você neste momento especial
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2.5rem',
      }}>
        <div
          ref={el => { if (el && !width) setWidth(el.getBoundingClientRect().width) }}
          style={{
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(74,142,201,0.18)',
            border: '1px solid #b8d5f0',
            maxWidth: 500,
            width: '100%',
          }}
        >
          <Document file="/convite.pdf" loading="">
            <Page
              pageNumber={1}
              width={width || 500}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#5a7fa8', marginBottom: '1.5rem', fontWeight: 300, fontSize: '1.05rem' }}>
          Você vai conseguir comparecer?
        </p>
        <button
          onClick={() => setTab('rsvp')}
          style={{
            backgroundColor: '#4a8ec9',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '0.85rem 2.5rem',
            fontSize: '1rem',
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(74,142,201,0.35)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(74,142,201,0.45)' }}
          onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '0 4px 16px rgba(74,142,201,0.35)' }}
        >
          Confirmar Presença →
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem', color: '#a8c4e0', fontSize: '1.2rem', letterSpacing: '0.5em' }}>
        ★ ★ ★
      </div>
    </div>
  )
}
