import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SkillCard({ skill, onClick }) {
    return (_jsxs("div", { className: "skill-card", onClick: onClick, style: {
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: '#fff',
            cursor: onClick ? 'pointer' : 'default',
            transition: 'box-shadow 0.2s, border-color 0.2s',
        }, onMouseEnter: (e) => {
            if (onClick) {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#d1d5db';
            }
        }, onMouseLeave: (e) => {
            if (onClick) {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
            }
        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }, children: [_jsx("h3", { style: { fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }, children: skill.display_name }), _jsx("span", { className: "badge", style: {
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#e0e7ff',
                            color: '#3730a3',
                            borderRadius: '9999px',
                            fontWeight: 500,
                        }, children: skill.category })] }), skill.subcategory && (_jsx("span", { style: {
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    backgroundColor: '#f3f4f6',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '4px',
                    marginRight: '0.5rem',
                }, children: skill.subcategory })), _jsx("p", { style: { marginTop: '0.75rem', color: '#4b5563', fontSize: '0.875rem', lineHeight: 1.5 }, children: skill.description }), skill.tags.length > 0 && (_jsxs("div", { style: { marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }, children: [skill.tags.slice(0, 5).map((tag) => (_jsx("span", { style: {
                            fontSize: '0.7rem',
                            color: '#6b7280',
                            backgroundColor: '#f9fafb',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '4px',
                            border: '1px solid #e5e7eb',
                        }, children: tag }, tag))), skill.tags.length > 5 && (_jsxs("span", { style: {
                            fontSize: '0.7rem',
                            color: '#9ca3af',
                            backgroundColor: '#f9fafb',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '4px',
                            border: '1px solid #e5e7eb',
                        }, children: ["+", skill.tags.length - 5, " more"] }))] })), _jsxs("div", { style: { marginTop: '0.75rem', fontSize: '0.75rem', color: '#9ca3af', display: 'flex', gap: '1rem' }, children: [_jsxs("span", { children: ["v", skill.version] }), skill.author && _jsxs("span", { children: ["by ", skill.author] })] })] }));
}
