import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
function App() {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
    if (loading) {
        return (_jsx("div", { className: "container", style: { paddingTop: '4rem' }, children: _jsx("div", { className: "loading", children: "Loading health check\\u2026" }) }));
    }
    if (error) {
        return (_jsx("div", { className: "container", style: { paddingTop: '4rem' }, children: _jsxs("div", { className: "error", children: ["Failed to load health: ", error] }) }));
    }
    return (_jsxs("div", { className: "container", style: { paddingTop: '4rem', paddingBottom: '4rem' }, children: [_jsxs("header", { style: { marginBottom: '2rem' }, children: [_jsx("h1", { style: { fontSize: '2.5rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }, children: "Prism Pilot" }), _jsx("p", { style: { color: '#6b7280', fontSize: '1.125rem' }, children: "Local agent-first control plane for AI/ML skill discovery, validation, and planning" })] }), _jsxs("div", { className: "card", style: { maxWidth: '600px' }, children: [_jsx("h2", { style: { fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }, children: "System Health" }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }, children: [_jsx("span", { className: "badge", children: health?.status ?? 'unknown' }), _jsx("span", { style: { color: '#6b7280' }, children: health?.service ?? 'prism-pilot' })] }), _jsx("p", { style: { marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }, children: "Backend API responding. Frontend \\u2194 backend connectivity verified." })] }), _jsxs("footer", { style: { marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', color: '#9ca3af', fontSize: '0.875rem' }, children: [_jsx("p", { children: "Prism Pilot \\u2014 Ryan Vo | AI & Machine Learning" }), _jsxs("p", { children: ["MIT \\u00a9 Ryan Vo ", `ryandtvo@gmail.com`] })] })] }));
}
export default App;
