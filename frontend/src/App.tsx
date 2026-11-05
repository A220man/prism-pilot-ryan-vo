import { useState, useEffect } from 'react';
import { SkillList } from './components/SkillList';

type View = 'health' | 'catalog';

interface HealthResponse {
  status: string;
  service: string;
}

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('health');

  useEffect(() => {
    async function fetchHealth() {
      try {
        setLoading(true);
        const res = await fetch('/api/v1/healthz');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setHealth(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
  }, []);

  const navigation = [
    { id: 'health' as View, label: 'Health' },
    { id: 'catalog' as View, label: 'Catalog' },
  ];

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <div className="loading">Loading health check…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '4rem' }}>
        <div className="error">Failed to load health: {error}</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', minHeight: '100vh' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
              Prism Pilot
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Local agent-first control plane for AI/ML skill discovery, validation, and planning
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: view === item.id ? '#fff' : '#374151',
                  backgroundColor: view === item.id ? '#3b82f6' : '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (view !== item.id) e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  if (view !== item.id) e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main>
        {view === 'health' && (
          <div style={{ maxWidth: '800px' }}>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>System Health</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span
                  className="badge"
                  style={{
                    fontSize: '0.875rem',
                    padding: '0.375rem 0.75rem',
                    backgroundColor: health?.status === 'ok' ? '#dcfce7' : '#fef2f2',
                    color: health?.status === 'ok' ? '#166534' : '#991b1b',
                    borderRadius: '9999px',
                    fontWeight: 500,
                  }}
                >
                  {health?.status ?? 'unknown'}
                </span>
                <span style={{ color: '#6b7280' }}>{health?.service ?? 'prism-pilot'}</span>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                Backend API responding. Frontend ↔ backend connectivity verified.
              </p>
            </div>

            <div className="card" style={{ maxWidth: '600px' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }}>Quick Actions</h2>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setView('catalog')}
                  style={{
                    padding: '0.625rem 1.25rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#fff',
                    backgroundColor: '#3b82f6',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Browse Skills Catalog
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'catalog' && (
          <div style={{ maxWidth: '1200px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Skills Catalog</h2>
              <p style={{ color: '#6b7280' }}>Discover and explore 2,600+ agentic skills for AI/ML workflows.</p>
            </div>
            <SkillList />
          </div>
        )}
      </main>

      <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', color: '#9ca3af', fontSize: '0.875rem' }}>
        <p>Prism Pilot — Ryan Vo | AI & Machine Learning</p>
        <p>MIT © Ryan Vo {`ryandtvo@gmail.com`}</p>
      </footer>
    </div>
  );
}

export default App;
