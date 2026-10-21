import { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Plus, Pencil, Trash2, X, Check, Award, Star, ExternalLink, Calendar } from 'lucide-react';

const DEFAULT_ACH = {
  title: '',
  org: '',
  year: '2025',
  badge: '🥇',
  description: '',
  featured: false,
  link: '',
};

const BADGE_PRESETS = ['🥇', '🎓', '🤖', '🏢', '☁️', '⚡', '🏆', '🚀', '⭐'];

export default function AchievementsPanel() {
  const { achievements, saveItem, deleteItem } = usePortfolioData();
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingItem({ ...DEFAULT_ACH });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem({
      ...item,
      title: item.title || '',
      org: item.org || item.desc || '',
      year: item.year || '2025',
      badge: item.badge || item.icon || '🏆',
      description: item.description || item.desc || '',
      featured: !!item.featured,
      link: item.link || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item, e) => {
    e.stopPropagation();
    const name = item.title;
    if (window.confirm(`Delete recognition entry "${name}"?`)) {
      await deleteItem('achievements', item.id);
      showToast(`Deleted "${name}"`);
    }
  };

  const handleToggleFeatured = async (item, e) => {
    e.stopPropagation();
    const updated = { ...item, featured: !item.featured };
    await saveItem('achievements', updated);
    showToast(`Updated "${item.title}"`);
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingItem.title.trim()) {
      alert('Please enter a title');
      return;
    }

    const payload = {
      ...editingItem,
      title: editingItem.title.trim(),
      org: editingItem.org.trim(),
      desc: editingItem.org.trim(),
      year: editingItem.year.trim(),
      badge: editingItem.badge,
      icon: editingItem.badge,
      description: editingItem.description.trim(),
      featured: !!editingItem.featured,
      link: editingItem.link.trim(),
    };

    await saveItem('achievements', payload);
    setIsModalOpen(false);
    showToast(editingItem.id ? `Updated "${payload.title}"` : `Added "${payload.title}"`);
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
            Achievements, Laurels &amp; Certifications
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            Rendered in the interactive Bento Grid. Featured item takes primary 2-column span.
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
          + Add Recognition
        </button>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.25rem',
      }}>
        {(achievements || []).map((item, idx) => {
          const badge = item.badge || item.icon || '🏆';
          const title = item.title;
          const org = item.org || item.desc;
          const isFeatured = item.featured || idx === 0;

          return (
            <div
              key={item.id || idx}
              style={{
                background: '#0d0d12',
                border: `1px solid ${isFeatured ? 'rgba(201, 168, 76, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>{badge}</span>
                  <button
                    onClick={(e) => handleToggleFeatured(item, e)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      color: isFeatured ? '#eab308' : 'rgba(255, 255, 255, 0.25)',
                    }}
                  >
                    <Star size={16} fill={isFeatured ? '#eab308' : 'none'} />
                  </button>
                </div>

                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 0.4rem 0' }}>
                  {title}
                </h4>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.82rem', color: '#c9a84c', fontWeight: 600 }}>
                  {org}
                </p>
                {item.description && item.description !== org && (
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                )}
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '0.85rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                  {item.year || 'Certified'}
                </span>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    style={{
                      padding: '0.35rem 0.7rem', borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.3rem',
                    }}
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(item, e)}
                    style={{
                      padding: '0.35rem 0.6rem', borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                      color: '#f87171', fontSize: '0.75rem', cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
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
            borderRadius: '24px', padding: '2.25rem', width: '100%', maxWidth: '540px',
            boxShadow: '0 30px 90px rgba(0,0,0,0.9)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                {editingItem.id ? 'Edit Recognition' : 'Add Recognition'}
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
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                  Badge Icon
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {BADGE_PRESETS.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, badge: b })}
                      style={{
                        padding: '0.4rem 0.6rem', borderRadius: '8px',
                        border: editingItem.badge === b ? '1px solid #d4ff3d' : '1px solid rgba(255,255,255,0.1)',
                        background: editingItem.badge === b ? 'rgba(212,255,61,0.15)' : 'rgba(255,255,255,0.02)',
                        fontSize: '1.2rem', cursor: 'pointer',
                      }}
                    >
                      {b}
                    </button>
                  ))}
                  <input
                    type="text"
                    value={editingItem.badge}
                    onChange={e => setEditingItem({ ...editingItem, badge: e.target.value })}
                    style={{
                      width: '60px', padding: '0.4rem', textAlign: 'center',
                      borderRadius: '8px', background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', fontSize: '1.1rem', outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                  Title / Honor *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. National Rank 52 — NEC 2025"
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                    background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    Issuing Organization / Program
                  </label>
                  <input
                    type="text"
                    value={editingItem.org}
                    onChange={e => setEditingItem({ ...editingItem, org: e.target.value })}
                    placeholder="e.g. IIT Bombay E-Cell"
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                      background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    Year
                  </label>
                  <input
                    type="text"
                    value={editingItem.year}
                    onChange={e => setEditingItem({ ...editingItem, year: e.target.value })}
                    placeholder="2025"
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                      background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                  Verification Link (Optional)
                </label>
                <input
                  type="url"
                  value={editingItem.link}
                  onChange={e => setEditingItem({ ...editingItem, link: e.target.value })}
                  placeholder="https://forage.com/verify/..."
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                    background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box', outline: 'none',
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
                  id="achFeaturedSwitch"
                  checked={editingItem.featured}
                  onChange={e => setEditingItem({ ...editingItem, featured: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#c9a84c', cursor: 'pointer' }}
                />
                <label htmlFor="achFeaturedSwitch" style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                  Feature this Award as Primary Bento Card (Gold Border)
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
                  Save Recognition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
