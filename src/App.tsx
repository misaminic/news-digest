import './App.css'
import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav style={{ backgroundColor: '#1e293b', borderBottom: '2px solid #475569' }}>
      <div className="max-w-6xl mx-auto" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link
            to="/"
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#cbd5e1',
              textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
            onMouseLeave={e => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Home
          </Link>
          <Link
            to="/preferences"
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#cbd5e1',
              textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
            onMouseLeave={e => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Preferences
          </Link>
          <Link
            to="/digest"
            style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#cbd5e1',
              textDecoration: 'none',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
            onMouseLeave={e => (e.currentTarget.style.color = '#cbd5e1')}
          >
            Digest
          </Link>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default App
