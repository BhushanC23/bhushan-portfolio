import { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Check, Sparkles, Image, FileText, User, Layers } from 'lucide-react';

export default function HeroBioPanel() {
  const { heroText, about, saveItem } = usePortfolioData();
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'bio' | 'stats'
  const [toast, setToast] = useState(null);

  // Local state for Hero phases
  const [phases, setPhases] = useState(() => heroText || []);

  // Local state for About
  const [aboutForm, setAboutForm] = useState(() => ({
    bio: about?.bio || '',
    photo_url: about?.photo_url || '/bhushan-photo.jpg',
    resume_url: about?.resume_url || '/Bhushan_Chaturbhuj_Resume.pdf',
    stats: about?.stats || [
      { value: 3, suffix: '+', label: 'Years Building' },
      { value: 10, suffix: '+', label: 'Projects Shipped' },
      { value: 12, suffix: '+', label: 'Technologies Used' },
      { value: 6, suffix: '+', label: 'Interactive Web Apps' },
    ],
  }));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleHeroPhaseChange = (idx, field, val) => {
    const updated = [...phases];
    updated[idx] = { ...updated[idx], [field]: val };
    setPhases(updated);
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    await saveItem('hero_text', phases);
    showToast('Hero text phases updated successfully!');
  };

  const handleSaveBio = async (e) => {
    e.preventDefault();
    await saveItem('about', aboutForm);
    showToast('About biography and media updated!');
  };

  const handleStatChange = (idx, field, val) => {
    const updatedStats = [...aboutForm.stats];
    updatedStats[idx] = { ...updatedStats[idx], [field]: val };
    setAboutForm({ ...aboutForm, stats: updatedStats });
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

      {/* Sub Tabs */}
      <div style={{
        display: 'flex',
        background: '#0d0d12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '6px',
        width: 'fit-content',
        gap: '4px',
      }}>
        <button
          onClick={() => setActiveTab('hero')}
          style={{
            padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none',
            background: activeTab === 'hero' ? '#d4ff3d' : 'transparent',
            color: activeTab === 'hero' ? '#000' : 'rgba(255,255,255,0.6)',
            fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.45rem',
          }}
        >
          <Layers size={14} />
          Hero 4-Phases
        </button>

        <button
          onClick={() => setActiveTab('bio')}
          style={{
            padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none',
            background: activeTab === 'bio' ? '#d4ff3d' : 'transparent',
            color: activeTab === 'bio' ? '#000' : 'rgba(255,255,255,0.6)',
            fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.45rem',
          }}
        >
          <User size={14} />
          Bio &amp; Media
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          style={{
            padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none',
            background: activeTab === 'stats' ? '#d4ff3d' : 'transparent',
            color: activeTab === 'stats' ? '#000' : 'rgba(255,255,255,0.6)',
            fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.45rem',
          }}
        >
          <Sparkles size={14} />
          Milestone Stats
        </button>
      </div>

      {/* Hero Phases Studio */}
      {activeTab === 'hero' && (
        <form onSubmit={handleSaveHero} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            background: '#0d0d12', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.75rem',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
              Hero Scrubbing Text Phases (Frames 045–240)
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
              These 4 text overlays render on top of the 240-frame scrub canvas during the lock zone [0.32, 0.58].
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {phases.map((phase, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#060608',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <span style={{
                      padding: '0.15rem 0.5rem', borderRadius: '6px',
                      background: 'rgba(212, 255, 61, 0.1)', color: '#d4ff3d',
                      fontSize: '10px', fontWeight: 800,
                    }}>
                      PHASE {idx + 1}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                      {idx === 0 ? 'Intro Statement' : idx === 1 ? 'Stack Highlight' : idx === 2 ? 'Vision Statement' : 'Outro Headline'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.35rem' }}>
                        Headline Line 1
                      </label>
                      <input
                        type="text"
                        value={phase.title || ''}
                        onChange={e => handleHeroPhaseChange(idx, 'title', e.target.value)}
                        style={{
                          width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px',
                          background: '#0d0d12', border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff', fontSize: '0.82rem', outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.35rem' }}>
                        Headline Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={phase.title2 || ''}
                        onChange={e => handleHeroPhaseChange(idx, 'title2', e.target.value)}
                        style={{
                          width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px',
                          background: '#0d0d12', border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff', fontSize: '0.82rem', outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.35rem' }}>
                        Subtitle / Descriptor
                      </label>
                      <input
                        type="text"
                        value={phase.subtitle || ''}
                        onChange={e => handleHeroPhaseChange(idx, 'subtitle', e.target.value)}
                        style={{
                          width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px',
                          background: '#0d0d12', border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff', fontSize: '0.82rem', outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.35rem' }}>
                        Tag Badge (Pill)
                      </label>
                      <input
                        type="text"
                        value={phase.tag || ''}
                        onChange={e => handleHeroPhaseChange(idx, 'tag', e.target.value)}
                        placeholder="Available for work ✦"
                        style={{
                          width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px',
                          background: '#0d0d12', border: '1px solid rgba(255,255,255,0.1)',
                          color: '#d4ff3d', fontSize: '0.82rem', outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.8rem 1.8rem', borderRadius: '12px', border: 'none',
                  background: '#d4ff3d', color: '#000', fontWeight: 800, fontSize: '0.85rem',
                  letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(212, 255, 61, 0.25)',
                }}
              >
                Save Hero Phases
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Bio & Media Studio */}
      {activeTab === 'bio' && (
        <form onSubmit={handleSaveBio} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            background: '#0d0d12', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.75rem',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 1.25rem 0' }}>
              About Section Biography &amp; Media Assets
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                  Biography Copy (HTML markup supported for bold/color tags)
                </label>
                <textarea
                  rows={6}
                  value={aboutForm.bio}
                  onChange={e => setAboutForm({ ...aboutForm, bio: e.target.value })}
                  style={{
                    width: '100%', padding: '0.85rem 1rem', borderRadius: '12px',
                    background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: '0.88rem', lineHeight: 1.6, outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    Profile Photo URL
                  </label>
                  <input
                    type="text"
                    value={aboutForm.photo_url}
                    onChange={e => setAboutForm({ ...aboutForm, photo_url: e.target.value })}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                      background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    Resume Download Path / URL
                  </label>
                  <input
                    type="text"
                    value={aboutForm.resume_url}
                    onChange={e => setAboutForm({ ...aboutForm, resume_url: e.target.value })}
                    style={{
                      width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
                      background: '#060608', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.8rem 1.8rem', borderRadius: '12px', border: 'none',
                  background: '#d4ff3d', color: '#000', fontWeight: 800, fontSize: '0.85rem',
                  letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(212, 255, 61, 0.25)',
                }}
              >
                Save Bio &amp; Media
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Milestone Stats Studio */}
      {activeTab === 'stats' && (
        <form onSubmit={handleSaveBio} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            background: '#0d0d12', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.75rem',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
              About Section Counter Milestones
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
              Animated numerical counters rendered below the portrait on the live site.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {aboutForm.stats.map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#060608', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '1rem',
                  }}
                >
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: '#d4ff3d', marginBottom: '0.5rem' }}>
                    Counter #{idx + 1}
                  </label>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem' }}>
                    <input
                      type="number"
                      value={stat.value}
                      onChange={e => handleStatChange(idx, 'value', Number(e.target.value))}
                      style={{
                        width: '70%', padding: '0.65rem', borderRadius: '8px',
                        background: '#0d0d12', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff', fontSize: '0.85rem', outline: 'none',
                      }}
                    />
                    <input
                      type="text"
                      value={stat.suffix || '+'}
                      onChange={e => handleStatChange(idx, 'suffix', e.target.value)}
                      placeholder="+"
                      style={{
                        width: '30%', padding: '0.65rem', borderRadius: '8px',
                        background: '#0d0d12', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#d4ff3d', fontSize: '0.85rem', outline: 'none', textAlign: 'center',
                      }}
                    />
                  </div>

                  <input
                    type="text"
                    value={stat.label}
                    onChange={e => handleStatChange(idx, 'label', e.target.value)}
                    placeholder="Label..."
                    style={{
                      width: '100%', padding: '0.65rem', borderRadius: '8px',
                      background: '#0d0d12', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.8rem 1.8rem', borderRadius: '12px', border: 'none',
                  background: '#d4ff3d', color: '#000', fontWeight: 800, fontSize: '0.85rem',
                  letterSpacing: '0.04em', textTransform: 'uppercase', cursor: 'pointer',
                  boxShadow: '0 0 20px rgba(212, 255, 61, 0.25)',
                }}
              >
                Save Milestone Counters
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
