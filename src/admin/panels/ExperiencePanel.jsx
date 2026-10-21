import { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Plus, Pencil, Trash2, X, Check, Briefcase, Calendar, MapPin, Star } from 'lucide-react';

const DEFAULT_EXP = {
  role: '',
  company: '',
  duration: '',
  current: false,
  description: '',
  type: 'On-site',
};

export default function ExperiencePanel() {
  const { experience, saveItem, deleteItem } = usePortfolioData();
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem({ ...DEFAULT_EXP });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem({
      ...item,
      role: item.role || item.title || '',
      company: item.company || '',
      duration: item.duration || item.period || '',
      current: !!(item.current || item.isCurrent),
      description: item.description || '',
      type: item.type || 'On-site',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item, e) => {
    e.stopPropagation();
    const name = item.role || item.title || item.company;
    if (window.confirm(`Delete experience entry "${name}"?`)) {
      await deleteItem('experience', item.id);
      showToast(`Deleted "${name}"`);
    }
  };

  const handleToggleCurrent = async (item, e) => {
    e.stopPropagation();
    const updated = {
      ...item,
      current: !item.current,
      isCurrent: !item.current,
    };
    await saveItem('experience', updated);
    showToast(`Updated status for "${item.role || item.company}"`);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingItem.role.trim() || !editingItem.company.trim()) {
      alert('Please enter both Role and Company.');
      return;
    }

    const payload = {
      ...editingItem,
      role: editingItem.role.trim(),
      title: editingItem.role.trim(),
      company: editingItem.company.trim(),
      duration: editingItem.duration.trim(),
      period: editingItem.duration.trim(),
      current: !!editingItem.current,
      isCurrent: !!editingItem.current,
      description: editingItem.description.trim(),
      type: editingItem.type,
    };

    await saveItem('experience', payload);
    setIsModalOpen(false);
    showToast(editingItem.id ? `Updated role "${payload.role}"` : `Added role "${payload.role}"`);
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

      {/* Header bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#0d0d12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
      }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Experience &amp; Career Milestones
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            Timeline items render with real-time pulsing indicators on the live site.
          </span>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1.4rem', borderRadius: '12px', border: 'none',
            background: '#d4ff3d', color: '#000', fontWeight: 800, fontSize: '0.85rem',
            letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          <Plus size={16} strokeWidth={3} />
          + Add Role
        </button>
      </div>

      {/* Timeline items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(experience || []).map((item, idx) => {
          const role = item.role || item.title;
          const company = item.company;
          const duration = item.duration || item.period;
          const isCurrent = item.current || item.isCurrent;

          return (
            <div
              key={item.id || idx}
              style={{
                background: '#0d0d12',
                border: `1px solid ${isCurrent ? 'rgba(212, 255, 61, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    {role}
                  </h4>
                  <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                    @ {company}
                  </span>

                  {isCurrent && (
                    <span style={{
                      padding: '0.15rem 0.6rem',
                      borderRadius: '100px',
                      background: 'rgba(212, 255, 61, 0.15)',
                      border: '1px solid #d4ff3d',
                      fontSize: '9px',
                      fontWeight: 800,
                      color: '#d4ff3d',
                      textTransform: 'uppercase',
                      letterSpacing: '0.12em',
                    }}>
                      Current Active Role
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.85rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={13} /> {duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={13} /> {item.type || 'On-site'}
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={(e) => handleToggleCurrent(item, e)}
                  title="Toggle Current Status"
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    border: `1px solid ${isCurrent ? '#d4ff3d' : 'rgba(255,255,255,0.1)'}`,
                    background: isCurrent ? 'rgba(212,255,61,0.1)' : 'rgba(255,255,255,0.02)',
                    color: isCurrent ? '#d4ff3d' : 'rgba(255,255,255,0.5)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {isCurrent ? 'Active ✓' : 'Mark Current'}
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <Pencil size={12} />
                  Edit
                </button>

                <button
                  onClick={(e) => handleDelete(item, e)}
                  style={{
                    padding: '0.4rem 0.65rem',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
        }}>
          <div style={{
            background: '#0d0d12', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '24px', padding: '2.25rem', width: '100%', maxWidth: '580px',
            boxShadow: '0 30px 90px rgba(0,0,0,0.9)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {editingItem.id ? 'Edit Experience Entry' : 'Add Experience Entry'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.role}
                    onChange={e => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="e.g. LLM Post-Training Intern"
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                      background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.company}
                    onChange={e => setEditingItem({ ...editingItem, company: e.target.value })}
                    placeholder="e.g. Ethara AI"
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                      background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    Duration / Period
                  </label>
                  <input
                    type="text"
                    value={editingItem.duration}
                    onChange={e => setEditingItem({ ...editingItem, duration: e.target.value })}
                    placeholder="e.g. Apr 2026 – Jun 2026"
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                      background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    Location Type
                  </label>
                  <select
                    value={editingItem.type}
                    onChange={e => setEditingItem({ ...editingItem, type: e.target.value })}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                      background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#d4ff3d', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none',
                    }}
                  >
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                  Description &amp; Highlights
                </label>
                <textarea
                  rows={4}
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Detail responsibilities, achievements, and technical contributions..."
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                    background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none', lineHeight: 1.5,
                  }}
                />
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <input
                  type="checkbox"
                  id="currentSwitch"
                  checked={editingItem.current}
                  onChange={e => setEditingItem({ ...editingItem, current: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#d4ff3d', cursor: 'pointer' }}
                />
                <label htmlFor="currentSwitch" style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                  This is my current active role (Adds pulsing green status on public portfolio)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.75rem 1.4rem', borderRadius: '12px', background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)', color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.6rem', borderRadius: '12px', background: '#d4ff3d',
                    border: 'none', color: '#000', fontWeight: 800, fontSize: '0.85rem',
                    letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer',
                  }}
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
