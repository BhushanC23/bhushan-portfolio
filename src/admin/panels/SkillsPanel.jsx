import { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Plus, X, Check, Wrench, Sparkles, Code2, Database, Cpu, Terminal } from 'lucide-react';

const CATEGORY_META = {
  frontend: { label: 'Frontend & UX', icon: '⚡', color: '#d4ff3d' },
  backend: { label: 'Backend & APIs', icon: '🔧', color: '#94a3b8' },
  database: { label: 'Databases & Cloud', icon: '🗄️', color: '#c9a84c' },
  aiml: { label: 'AI / ML & LLMs', icon: '🤖', color: '#e0b4ff' },
  tools: { label: 'Tools & DevOps', icon: '🛠', color: '#86efac' },
  specialties: { label: 'Specialties & WebXR', icon: '✨', color: '#f9a8d4' },
};

export default function SkillsPanel() {
  const { skills, saveItem } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState('frontend');
  const [newSkillText, setNewSkillText] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const currentCategorySkills = (skills && skills[activeCategory]) || [];

  const handleAddSkill = async (e) => {
    if (e) e.preventDefault();
    const tag = newSkillText.trim();
    if (!tag) return;

    if (currentCategorySkills.includes(tag)) {
      showToast(`"${tag}" already exists in this category`);
      return;
    }

    const updated = {
      ...skills,
      [activeCategory]: [...currentCategorySkills, tag],
    };

    await saveItem('skills', updated);
    setNewSkillText('');
    showToast(`Added "${tag}" to ${CATEGORY_META[activeCategory]?.label || activeCategory}`);
  };

  const handleRemoveSkill = async (tagToRemove) => {
    const updated = {
      ...skills,
      [activeCategory]: currentCategorySkills.filter(t => t !== tagToRemove),
    };

    await saveItem('skills', updated);
    showToast(`Removed "${tagToRemove}"`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
          padding: '0.9rem 1.4rem', background: '#0e2415', border: '1px solid #22c55e', borderRadius: '12px',
          color: '#86efac', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <Check size={16} />
          {toast}
        </div>
      )}

      {/* Header Bar */}
      <div style={{
        background: '#0d0d12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
      }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.35rem 0' }}>
          Skills Matrix &amp; Marquee Ticker
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
          Click tags to remove. Adding tags updates the interactive category tab cards and endless marquee on live site.
        </span>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
        {Object.entries(CATEGORY_META).map(([key, meta]) => {
          const isActive = activeCategory === key;
          const count = (skills && skills[key] ? skills[key].length : 0);

          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              style={{
                padding: '0.65rem 1.15rem',
                borderRadius: '12px',
                border: `1px solid ${isActive ? meta.color : 'rgba(255, 255, 255, 0.08)'}`,
                background: isActive ? `${meta.color}15` : 'rgba(255, 255, 255, 0.02)',
                color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
              <span style={{
                background: isActive ? meta.color : 'rgba(255, 255, 255, 0.1)',
                color: isActive ? '#000' : 'rgba(255, 255, 255, 0.5)',
                fontSize: '10px',
                padding: '0.1rem 0.45rem',
                borderRadius: '100px',
                fontWeight: 800,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Category Manager Canvas */}
      <div style={{
        background: '#0d0d12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '2rem',
      }}>
        {/* Add Skill Input Form */}
        <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', maxWidth: '500px' }}>
          <input
            type="text"
            value={newSkillText}
            onChange={e => setNewSkillText(e.target.value)}
            placeholder={`Add new ${CATEGORY_META[activeCategory]?.label} skill (e.g. Next.js)...`}
            style={{
              flex: 1,
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              background: '#060608',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.8rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: '#d4ff3d',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Plus size={15} strokeWidth={3} />
            Add
          </button>
        </form>

        {/* Chips List */}
        <div>
          <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '1rem' }}>
            Current Active Tags ({currentCategorySkills.length})
          </span>

          {currentCategorySkills.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontStyle: 'italic' }}>
              No skills listed in this category yet. Type above to add.
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {currentCategorySkills.map(tag => (
                <div
                  key={tag}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(tag)}
                    title="Remove tag"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.35)',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: '50%',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)'}
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
