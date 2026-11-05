import { useState, useEffect } from 'react';
import { Skill, SkillListResponse } from '../types/skill';
import { catalogApi } from '../api/catalog';
import { SkillCard } from './SkillCard';

interface SkillListProps {
  initialCategory?: string;
  initialSearch?: string;
}

export function SkillList({ initialCategory, initialSearch }: SkillListProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await catalogApi.getCategories();
      setCategories(data);
    } catch {
      // Silently fail for categories
    }
  };

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: SkillListResponse = await catalogApi.listSkills({
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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [pagination.page, filters]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  if (loading && skills.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
        Loading skills…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
        <p>Error: {error}</p>
        <button
          onClick={fetchSkills}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: '#374151' }}>
            Search
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search skills…"
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              outline: 'none',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
          />
        </div>

        <div style={{ minWidth: '180px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: '#374151' }}>
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              outline: 'none',
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={{ minWidth: '180px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.375rem', color: '#374151' }}>
            Subcategory
          </label>
          <select
            value={filters.subcategory}
            onChange={(e) => handleFilterChange('subcategory', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              outline: 'none',
            }}
          >
            <option value="">All Subcategories</option>
          </select>
        </div>
      </div>

      {skills.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
          No skills found. Try adjusting your filters.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}

      {pagination.total_pages > 1 && (
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: pagination.page <= 1 ? '#f3f4f6' : '#3b82f6',
              color: pagination.page <= 1 ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Previous
          </button>

          <span style={{ color: '#6b7280' }}>
            Page {pagination.page} of {pagination.total_pages} ({pagination.total} total)
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.total_pages}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: pagination.page >= pagination.total_pages ? '#f3f4f6' : '#3b82f6',
              color: pagination.page >= pagination.total_pages ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: pagination.page >= pagination.total_pages ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
