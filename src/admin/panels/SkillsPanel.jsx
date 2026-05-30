import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Plus, X, Save } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { category: 'frontend', label: 'Frontend', icon: '⚡' },
  { category: 'backend', label: 'Backend', icon: '🔧' },
  { category: 'database', label: 'Database', icon: '🗄️' },
  { category: 'aiml', label: 'AI / ML', icon: '🤖' },
  { category: 'tools', label: 'Tools & DevOps', icon: '🛠️' },
  { category: 'specialties', label: 'Specialties', icon: '✨' },
];

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
      padding: '0.85rem 1.25rem',
      background: type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
      border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
      borderRadius: '12px',
      color: type === 'success' ? '#86efac' : '#fca5a5',
      fontSize: '0.88rem', fontFamily: 'var(--font-body)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      animation: 'slideUp 0.3s ease',
    }}>
      {message}
    </div>
  );
}

function CategoryCard({ cat, skillsMap, onUpdate }) {
  const items = skillsMap[cat.category] || [];
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const addSkill = async () => {
    const skill = newSkill.trim();
    if (!skill || items.includes(skill)) return;
    const updated = [...items, skill];
    setSaving(true);
    await onUpdate(cat.category, updated);
    setNewSkill('');
    setSaving(false);
  };

  const removeSkill = async (skill) => {
    const updated = items.filter(s => s !== skill);
    await onUpdate(cat.category, updated);
  };

  return (
    <div style={{
      background: 'rgba(13,26,28,0.6)',
      border: '1px solid rgba(45,212,191,0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '1.4rem' }}>{cat.icon}</span>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--teal-accent)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          {cat.label}
        </h3>
        <span style={{ marginLeft: 'auto', color: 'rgba(240,244,244,0.3)', fontSize: '0.78rem' }}>
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Skill chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1.25rem', minHeight: '36px' }}>
        {items.map((skill, i) => (
          <div key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.28rem 0.7rem',
            background: 'rgba(45,212,191,0.07)',
            border: '1px solid rgba(45,212,191,0.18)',
            borderRadius: '20px',
          }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(240,244,244,0.75)', fontFamily: 'var(--font-body)' }}>{skill}</span>
            <button
              onClick={() => removeSkill(skill)}
              style={{ background: 'none', border: 'none', color: 'rgba(240,244,244,0.3)', cursor: 'pointer', padding: '0 1px', display: 'flex', alignItems: 'center', lineHeight: 1 }}
              title="Remove skill"
            >
              <X size={11} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <span style={{ color: 'rgba(240,244,244,0.2)', fontSize: '0.8rem' }}>No skills yet</span>
        )}
      </div>

      {/* Add new skill input */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={newSkill}
          onChange={e => setNewSkill(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSkill()}
          placeholder={`Add to ${cat.label}…`}
          style={{
            flex: 1, padding: '0.6rem 0.9rem',
            background: 'rgba(7,13,14,0.5)',
            border: '1px solid rgba(45,212,191,0.12)',
            borderRadius: '8px', color: '#fff',
            fontSize: '0.83rem', fontFamily: 'var(--font-body)', outline: 'none',
          }}
        />
        <button
          onClick={addSkill}
          disabled={!newSkill.trim() || saving}
          style={{ padding: '0.6rem 0.9rem', background: 'rgba(45,212,191,0.8)', border: 'none', borderRadius: '8px', color: '#070d0e', cursor: !newSkill.trim() ? 'not-allowed' : 'pointer', opacity: !newSkill.trim() ? 0.4 : 1, display: 'flex', alignItems: 'center' }}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

export default function SkillsPanel() {
  const [skillsMap, setSkillsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      showToast('Supabase not configured', 'error');
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from('skills').select('*');
    if (error) { showToast(error.message, 'error'); }
    else {
      const map = {};
      (data || []).forEach(row => { map[row.category] = row.items || []; });
      setSkillsMap(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpdate = async (category, items) => {
    // Upsert — insert or update based on category
    const { error } = await supabase
      .from('skills')
      .upsert({ category, items }, { onConflict: 'category' });
    if (error) { showToast(error.message, 'error'); return; }
    setSkillsMap(prev => ({ ...prev, [category]: items }));
    showToast('Skills updated!');
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>Skills</h2>
        <p style={{ color: 'rgba(240,244,244,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Add or remove skills per category. Changes reflect live on the portfolio.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,244,244,0.3)' }}>Loading skills…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {DEFAULT_CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.category}
              cat={cat}
              skillsMap={skillsMap}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      <Toast message={toast.message} type={toast.type} />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        input::placeholder { color: rgba(240,244,244,0.2); }
      `}</style>
    </div>
  );
}
