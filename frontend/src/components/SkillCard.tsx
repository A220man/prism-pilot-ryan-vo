import { Skill } from '../types/skill';

interface SkillCardProps {
  skill: Skill;
  onClick?: () => void;
}

export function SkillCard({ skill, onClick }: SkillCardProps) {
  return (
    <div
      className="skill-card"
      onClick={onClick}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#fff',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          e.currentTarget.style.borderColor = '#d1d5db';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>
          {skill.display_name}
        </h3>
        <span
          className="badge"
          style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            backgroundColor: '#e0e7ff',
            color: '#3730a3',
            borderRadius: '9999px',
            fontWeight: 500,
          }}
        >
          {skill.category}
        </span>
      </div>

      {skill.subcategory && (
        <span
          style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            backgroundColor: '#f3f4f6',
            padding: '0.125rem 0.375rem',
            borderRadius: '4px',
            marginRight: '0.5rem',
          }}
        >
          {skill.subcategory}
        </span>
      )}

      <p style={{ marginTop: '0.75rem', color: '#4b5563', fontSize: '0.875rem', lineHeight: 1.5 }}>
        {skill.description}
      </p>

      {skill.tags.length > 0 && (
        <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {skill.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.7rem',
                color: '#6b7280',
                backgroundColor: '#f9fafb',
                padding: '0.125rem 0.375rem',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
              }}
            >
              {tag}
            </span>
          ))}
          {skill.tags.length > 5 && (
            <span
              style={{
                fontSize: '0.7rem',
                color: '#9ca3af',
                backgroundColor: '#f9fafb',
                padding: '0.125rem 0.375rem',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
              }}
            >
              +{skill.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#9ca3af', display: 'flex', gap: '1rem' }}>
        <span>v{skill.version}</span>
        {skill.author && <span>by {skill.author}</span>}
      </div>
    </div>
  );
}

