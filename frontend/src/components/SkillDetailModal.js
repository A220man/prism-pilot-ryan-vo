import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SkillDetailModal({ skill, isOpen, onClose }) {
    if (!isOpen || !skill)
        return null;
    return (_jsx("div", { className: "modal-overlay", "data-testid": "modal-overlay", onClick: onClose, style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
        }, children: _jsxs("div", { className: "modal-content", onClick: (e) => e.stopPropagation(), style: {
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }, children: [_jsxs("div", { children: [_jsx("h2", { style: { fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }, children: skill.display_name }), _jsxs("p", { style: { color: '#6b7280', fontSize: '0.875rem' }, children: ["ID: ", skill.id, " \u2022 Version: ", skill.version] })] }), _jsx("button", { onClick: onClose, style: {
                                padding: '0.375rem',
                                backgroundColor: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#9ca3af',
                                fontSize: '1.5rem',
                                lineHeight: 1,
                            }, "aria-label": "Close", children: "\u00D7" })] }), _jsxs("div", { style: { marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }, children: [_jsx("span", { style: {
                                padding: '0.25rem 0.75rem',
                                backgroundColor: '#dbeafe',
                                color: '#1e40af',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                            }, children: skill.category }), skill.subcategory && (_jsx("span", { style: {
                                padding: '0.25rem 0.75rem',
                                backgroundColor: '#f3f4f6',
                                color: '#374151',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                            }, children: skill.subcategory }))] }), _jsxs("div", { style: { marginBottom: '1.5rem' }, children: [_jsx("h3", { style: { fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }, children: "Description" }), _jsx("p", { style: { color: '#4b5563', lineHeight: 1.6 }, children: skill.description })] }), skill.tags.length > 0 && (_jsxs("div", { style: { marginBottom: '1.5rem' }, children: [_jsx("h3", { style: { fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }, children: "Tags" }), _jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }, children: skill.tags.map((tag) => (_jsx("span", { style: {
                                    padding: '0.25rem 0.625rem',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                }, children: tag }, tag))) })] })), skill.author && (_jsx("div", { style: { marginBottom: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }, children: _jsxs("span", { children: [_jsx("strong", { children: "Author:" }), " ", skill.author] }) })), skill.source_url && (_jsx("div", { style: { marginBottom: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }, children: _jsxs("span", { children: [_jsx("strong", { children: "Source:" }), _jsx("a", { href: skill.source_url, target: "_blank", rel: "noopener noreferrer", style: { color: '#3b82f6', marginLeft: '0.5rem' }, children: skill.source_url })] }) })), skill.license && (_jsxs("div", { style: { marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }, children: [_jsx("strong", { children: "License:" }), " ", skill.license] })), _jsxs("div", { style: { marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#9ca3af' }, children: [_jsxs("span", { children: ["Created: ", new Date(skill.created_at).toLocaleDateString()] }), _jsxs("span", { children: ["Updated: ", new Date(skill.updated_at).toLocaleDateString()] })] })] }) }));
}
