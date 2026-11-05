const API_BASE = '/api/v1';
async function fetchJson(url, options) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return response.json();
}
export const catalogApi = {
    async listSkills(params) {
        const searchParams = new URLSearchParams();
        if (params?.page)
            searchParams.set('page', String(params.page));
        if (params?.page_size)
            searchParams.set('page_size', String(params.page_size));
        if (params?.category)
            searchParams.set('category', params.category);
        if (params?.subcategory)
            searchParams.set('subcategory', params.subcategory);
        if (params?.search)
            searchParams.set('search', params.search);
        const query = searchParams.toString();
        return fetchJson(`${API_BASE}/catalog/skills${query ? `?${query}` : ''}`);
    },
    async getSkill(id) {
        return fetchJson(`${API_BASE}/catalog/skills/${id}`);
    },
    async getSkillByName(name) {
        return fetchJson(`${API_BASE}/catalog/skills/name/${encodeURIComponent(name)}`);
    },
    async createSkill(skill) {
        return fetchJson(`${API_BASE}/catalog/skills`, {
            method: 'POST',
            body: JSON.stringify(skill),
        });
    },
    async updateSkill(id, skill) {
        return fetchJson(`${API_BASE}/catalog/skills/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(skill),
        });
    },
    async deleteSkill(id) {
        await fetch(`${API_BASE}/catalog/skills/${id}`, { method: 'DELETE' });
    },
    async importSkills(skills) {
        return fetchJson(`${API_BASE}/catalog/import`, {
            method: 'POST',
            body: JSON.stringify({ skills }),
        });
    },
    async getCategories() {
        return fetchJson(`${API_BASE}/catalog/categories`);
    },
    async getSubcategories(category) {
        const query = category ? `?category=${encodeURIComponent(category)}` : '';
        return fetchJson(`${API_BASE}/catalog/subcategories${query}`);
    },
};
