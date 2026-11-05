import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { catalogApi } from '../api/catalog';
import { SkillCard } from './SkillCard';
export function SkillList({ initialCategory, initialSearch }) {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        page_size: 20,
        total_pages: 0,
    });
    const [filters, setFilters] = useState({
        category: initialCategory || '',
        subcategory: '',
        search: initialSearch || '',
    });
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, []);
    const fetchCategories = async () => {
        try {
            const data = await catalogApi.getCategories();
            setCategories(data);
        }
        catch {
            // Silently fail for categories
        }
    };
    const fetchSkills = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await catalogApi.listSkills({
                page: pagination.page,
                page_size: pagination.page_size,
                category: filters.category || undefined,
                subcategory: filters.subcategory || undefined,
                search: filters.search || undefined,
            });
            setSkills(data.items);
            setPagination({
                total: data.total,
                page: data.page,
                page_size: data.page_size,
                total_pages: data.total_pages,
            });
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load skills');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSkills();
    }, [pagination.page, filters]);
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPagination((prev) => ({ ...prev, page: 1 }));
    };
    const handlePageChange = (page) => {
        setPagination((prev) => ({ ...prev, page }));
    };
    if (loading && skills.length === 0) {
        return (_jsx("div", { style: { padding: '2rem', textAlign: 'center', color: '#6b7280' }, children: "Loading skills\u2026" }));
    }
    if (error) {
        return (_jsxs("div", { style: { padding: '2rem', textAlign: 'center', color: '#ef4444' }, children: [_jsxs("p", { children: ["Error: ", error] }), _jsx("button", { onClick: fetchSkills, style: {
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }, children: "Retry" })] }));
    }
    return (_jsxs("div", { children: [_jsxs("div", { style: { marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }, children: [_jsxs("div", { style: { flex: 1, minWidth: '200px' }, children: [_jsx("label", { style: { display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: '#374151' }, children: "Search" }), _jsx("input", { type: "text", value: filters.search, onChange: (e) => handleFilterChange('search', e.target.value), placeholder: "Search skills\u2026", style: {
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                }, onFocus: (e) => { e.currentTarget.style.borderColor = '#3b82f6'; }, onBlur: (e) => { e.currentTarget.style.borderColor = '#d1d5db'; } })] }), _jsxs("div", { style: { minWidth: '180px' }, children: [_jsx("label", { style: { display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: '#374151' }, children: "Category" }), _jsxs("select", { value: filters.category, onChange: (e) => handleFilterChange('category', e.target.value), style: {
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'white',
                                    outline: 'none',
                                }, children: [_jsx("option", { value: "", children: "All Categories" }), categories.map((cat) => (_jsx("option", { value: cat, children: cat }, cat)))] })] }), _jsxs("div", { style: { minWidth: '180px' }, children: [_jsx("label", { style: { display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: '#374151' }, children: "Subcategory" }), _jsx("select", { value: filters.subcategory, onChange: (e) => handleFilterChange('subcategory', e.target.value), style: {
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'white',
                                    outline: 'none',
                                }, children: _jsx("option", { value: "", children: "All Subcategories" }) })] })] }), skills.length === 0 ? (_jsx("div", { style: { padding: '3rem', textAlign: 'center', color: '#6b7280' }, children: "No skills found. Try adjusting your filters." })) : (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }, children: skills.map((skill) => (_jsx(SkillCard, { skill: skill }, skill.id))) })), pagination.total_pages > 1 && (_jsxs("div", { style: { marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }, children: [_jsx("button", { onClick: () => handlePageChange(pagination.page - 1), disabled: pagination.page <= 1, style: {
                            padding: '0.5rem 1rem',
                            backgroundColor: pagination.page <= 1 ? '#f3f4f6' : '#3b82f6',
                            color: pagination.page <= 1 ? '#9ca3af' : 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                        }, children: "Previous" }), _jsxs("span", { style: { color: '#6b7280' }, children: ["Page ", pagination.page, " of ", pagination.total_pages, " (", pagination.total, " total)"] }), _jsx("button", { onClick: () => handlePageChange(pagination.page + 1), disabled: pagination.page >= pagination.total_pages, style: {
                            padding: '0.5rem 1rem',
                            backgroundColor: pagination.page >= pagination.total_pages ? '#f3f4f6' : '#3b82f6',
                            color: pagination.page >= pagination.total_pages ? '#9ca3af' : 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: pagination.page >= pagination.total_pages ? 'not-allowed' : 'pointer',
                        }, children: "Next" })] }))] }));
}
