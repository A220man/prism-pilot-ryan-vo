import { useState, useEffect } from 'react'

interface HealthResponse {
  status: string
  service: string
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHealth() {
      try {
        setLoading(true)
        const res = await fetch('/api/v1/healthz')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setHealth(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchHealth()
  }, [])

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <div className="loading">Loading health check\u2026</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <div className="error">Failed to load health: {error}</div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
          Prism Pilot
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          Local agent-first control plane for AI/ML skill discovery, validation, and planning
        </p>
      </header>

      <div className="card" style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>System Health</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span className="badge">{health?.status ?? 'unknown'}</span>
          <span style={{ color: '#6b7280' }}>{health?.service ?? 'prism-pilot'}</span>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Backend API responding. Frontend \u2194 backend connectivity verified.
        </p>
      </div>

      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', color: '#9ca3af', fontSize: '0.875rem' }}>
        <p>Prism Pilot \u2014 Ryan Vo | AI & Machine Learning</p>
        <p>MIT \u00a9 Ryan Vo {`ryandtvo@gmail.com`}</p>
      </footer>
    </div>
  )
}

export default App