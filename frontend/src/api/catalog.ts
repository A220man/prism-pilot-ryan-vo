import { Skill, SkillListResponse, SkillImportResponse } from '../types/skill';

const API_BASE = '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
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
  async listSkills(params?: {
    page?: number;
    page_size?: number;
    category?: string;
    subcategory?: string;
    search?: string;
  }): Promise<SkillListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.page_size) searchParams.set('page_size', String(params.page_size));
    if (params?.category) searchParams.set('category', params.category);
    if (params?.subcategory) searchParams.set('subcategory', params.subcategory);
    if (params?.search) searchParams.set('search', params.search);

    const query = searchParams.toString();
    return fetchJson<SkillListResponse>(`${API_BASE}/catalog/skills${query ? `?${query}` : ''}`);
  },

  async getSkill(id: number): Promise<Skill> {
    return fetchJson<Skill>(`${API_BASE}/catalog/skills/${id}`);
  },

  async getSkillByName(name: string): Promise<Skill> {
    return fetchJson<Skill>(`${API_BASE}/catalog/skills/name/${encodeURIComponent(name)}`);
  },

  async createSkill(skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill> {
    return fetchJson<Skill>(`${API_BASE}/catalog/skills`, {
      method: 'POST',
      body: JSON.stringify(skill),
    });
  },

  async updateSkill(id: number, skill: Partial<Skill>): Promise<Skill> {
    return fetchJson<Skill>(`${API_BASE}/catalog/skills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(skill),
    });
  },

  async deleteSkill(id: number): Promise<void> {
    await fetch(`${API_BASE}/catalog/skills/${id}`, { method: 'DELETE' });
  },

  async importSkills(skills: Omit<Skill, 'id' | 'created_at' | 'updated_at'>[]): Promise<SkillImportResponse> {
    return fetchJson<SkillImportResponse>(`${API_BASE}/catalog/import`, {
      method: 'POST',
      body: JSON.stringify({ skills }),
    });
  },

  async getCategories(): Promise<string[]> {
    return fetchJson<string[]>(`${API_BASE}/catalog/categories`);
  },

  async getSubcategories(category?: string): Promise<string[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return fetchJson<string[]>(`${API_BASE}/catalog/subcategories${query}`);
  },
};

