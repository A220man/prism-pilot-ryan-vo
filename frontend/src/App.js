import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { SkillList } from './components/SkillList';
function App() {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('health');
    useEffect(() => {
        async function fetchHealth() {
            try {
                setLoading(true);
                const res = await fetch('/api/v1/healthz');
                if (!res.ok)
                    throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                setHealth(data);
            }
            catch (e) {
                setError(e instanceof Error ? e.message : 'Unknown error');
            }
            finally {
                setLoading(false);
            }
        }
        fetchHealth();
    }, []);
    const navigation = [
        { id: 'health', label: 'Health' },
        { id: 'catalog', label: 'Catalog' },
    ];
    if (loading) {
        return (_jsx("div", { className: "container", style: { paddingTop: '4rem' }, children: _jsx("div", { className: "loading", children: "Loading health check\u2026" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "container", style: { paddingTop: '4rem' }, children: _jsxs("div", { className: "error", children: ["Failed to load health: ", error] }) }));
    }
    return (_jsxs("div", { className: "container", style: { paddingTop: '2rem', paddingBottom: '4rem', minHeight: '100vh' }, children: [_jsx("header", { style: { marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1.5rem' }, children: _jsxs("nav", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }, children: [_jsxs("div", { children: [_jsx("h1", { style: { fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }, children: "Prism Pilot" }), _jsx("p", { style: { color: '#6b7280', fontSize: '1rem' }, children: "Local agent-first control plane for AI/ML skill discovery, validation, and planning" })] }), _jsx("div", { style: { display: 'flex', gap: '0.5rem' }, children: navigation.map((item) => (_jsx("button", { onClick: () => setView(item.id), style: {
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: view === item.id ? '#fff' : '#374151',
                                    backgroundColor: view === item.id ? '#3b82f6' : '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.15s',
                                }, onMouseEnter: (e) => {
                                    if (view !== item.id)
                                        e.currentTarget.style.backgroundColor = '#e5e7eb';
                                }, onMouseLeave: (e) => {
                                    if (view !== item.id)
                                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                                }, children: item.label }, item.id))) })] }) }), _jsxs("main", { children: [view === 'health' && (_jsxs("div", { style: { maxWidth: '800px' }, children: [_jsxs("div", { className: "card", style: { marginBottom: '1.5rem' }, children: [_jsx("h2", { style: { fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }, children: "System Health" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }, children: [_jsx("span", { className: "badge", style: {
                                                    fontSize: '0.875rem',
                                                    padding: '0.375rem 0.75rem',
                                                    backgroundColor: health?.status === 'ok' ? '#dcfce7' : '#fef2f2',
                                                    color: health?.status === 'ok' ? '#166534' : '#991b1b',
                                                    borderRadius: '9999px',
                                                    fontWeight: 500,
                                                }, children: health?.status ?? 'unknown' }), _jsx("span", { style: { color: '#6b7280' }, children: health?.service ?? 'prism-pilot' })] }), _jsx("p", { style: { marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }, children: "Backend API responding. Frontend \u2194 backend connectivity verified." })] }), _jsxs("div", { className: "card", style: { maxWidth: '600px' }, children: [_jsx("h2", { style: { fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: '#111827' }, children: "Quick Actions" }), _jsx("div", { style: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }, children: _jsx("button", { onClick: () => setView('catalog'), style: {
                                                padding: '0.625rem 1.25rem',
                                                fontSize: '0.875rem',
                                                fontWeight: 500,
                                                color: '#fff',
                                                backgroundColor: '#3b82f6',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                            }, children: "Browse Skills Catalog" }) })] })] })), view === 'catalog' && (_jsxs("div", { style: { maxWidth: '1200px' }, children: [_jsxs("div", { style: { marginBottom: '1.5rem' }, children: [_jsx("h2", { style: { fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }, children: "Skills Catalog" }), _jsx("p", { style: { color: '#6b7280' }, children: "Discover and explore 2,600+ agentic skills for AI/ML workflows." })] }), _jsx(SkillList, {})] }))] }), _jsxs("footer", { style: { marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', color: '#9ca3af', fontSize: '0.875rem' }, children: [_jsx("p", { children: "Prism Pilot \u2014 Ryan Vo | AI & Machine Learning" }), _jsxs("p", { children: ["MIT \u00A9 Ryan Vo ", `ryandtvo@gmail.com`] })] })] }));
}
export default App;
