import { Skill } from '../types/skill';

interface SkillDetailModalProps {
  skill: Skill | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SkillDetailModal({ skill, isOpen, onClose }: SkillDetailModalProps) {
  if (!isOpen || !skill) return null;

  return (
    <div
      className="modal-overlay"
      data-testid="modal-overlay"
      onClick={onClose}
      style={{
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
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111827', marginBottom: '0.25rem' }}>
              {skill.display_name}
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>ID: {skill.id} • Version: {skill.version}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.375rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              fontSize: '1.5rem',
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            {skill.category}
          </span>
          {skill.subcategory && (
            <span
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              {skill.subcategory}
            </span>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Description</h3>
          <p style={{ color: '#4b5563', lineHeight: 1.6 }}>{skill.description}</p>
        </div>

        {skill.tags.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Tags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '0.25rem 0.625rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {skill.author && (
          <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <span><strong>Author:</strong> {skill.author}</span>
          </div>
        )}

        {skill.source_url && (
          <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <span>
              <strong>Source:</strong>
              <a href={skill.source_url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', marginLeft: '0.5rem' }}>
                {skill.source_url}
              </a>
            </span>
          </div>
        )}

        {skill.license && (
          <div style={{ marginBottom: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
            <strong>License:</strong> {skill.license}
          </div>
        )}

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#9ca3af' }}>
          <span>Created: {new Date(skill.created_at).toLocaleDateString()}</span>
          <span>Updated: {new Date(skill.updated_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
