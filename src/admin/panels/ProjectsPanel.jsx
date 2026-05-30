import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Check, ExternalLink, GitBranch, Star } from 'lucide-react';

const EMPTY_PROJECT = {
  title: '',
  desc: '',
  tech: '',
  github: '',
  demo: '',
  tag: 'Full Stack',
  featured: false,
};

const TAGS = ['Full Stack', 'Full Stack + CMS', 'Utility Tool', 'AR / Web XR', 'AR', 'AI/ML', 'Backend', 'Other'];

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
      fontSize: '0.88rem',
      fontFamily: 'var(--font-body)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      animation: 'slideUp 0.3s ease',
    }}>
      {type === 'success' ? <Check size={15} /> : <X size={15} />}
      {message}
    </div>
  );
}

function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState(
    project
      ? { ...project, tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech }
      : { ...EMPTY_PROJECT }
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      desc: form.desc.trim(),
      tech: form.tech.split(',').map(t => t.trim()).filter(Boolean),
      github: form.github.trim(),
      demo: form.demo.trim(),
      tag: form.tag,
      featured: form.featured,
    };
    await onSave(payload, project?.id);
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'rgba(7,13,14,0.6)',
    border: '1px solid rgba(45,212,191,0.15)',
    borderRadius: '10px', color: '#fff',
    fontSize: '0.88rem', fontFamily: 'var(--font-body)',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };
  const labelStyle = { color: 'rgba(240,244,244,0.5)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'block' };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#0d1a1c', border: '1px solid rgba(45,212,191,0.15)',
        borderRadius: '16px', padding: '2rem',
        width: '100%', maxWidth: '560px', maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            {project ? 'Edit Project' : 'Add New Project'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,244,244,0.4)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={labelStyle}>Project Title *</label>
            <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. EVSync" />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea style={{ ...inputStyle, height: '90px', resize: 'vertical' }} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Short project description…" />
          </div>
          <div>
            <label style={labelStyle}>Tech Stack (comma-separated)</label>
            <input style={inputStyle} value={form.tech} onChange={e => setForm(f => ({ ...f, tech: e.target.value }))} placeholder="React, Node.js, MongoDB" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>GitHub URL</label>
              <input style={inputStyle} value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} placeholder="https://github.com/…" />
            </div>
            <div>
              <label style={labelStyle}>Demo URL</label>
              <input style={inputStyle} value={form.demo} onChange={e => setForm(f => ({ ...f, demo: e.target.value }))} placeholder="https://…" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Tag</label>
            <select style={{ ...inputStyle, appearance: 'none' }} value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
              {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', color: 'rgba(240,244,244,0.7)', fontSize: '0.88rem' }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
              style={{ width: '16px', height: '16px', accentColor: 'var(--teal-accent)' }} />
            Mark as Featured
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.7rem 1.25rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'rgba(240,244,244,0.6)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !form.title.trim()} style={{ padding: '0.7rem 1.5rem', background: saving ? 'rgba(45,212,191,0.3)' : 'rgba(45,212,191,0.85)', border: 'none', borderRadius: '10px', color: '#070d0e', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem' }}>
            {saving ? 'Saving…' : 'Save Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPanel() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'add' | project object
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deleting, setDeleting] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      showToast('Supabase not configured — connect it in .env first', 'error');
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setProjects(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (payload, id) => {
    if (id) {
      const { error } = await supabase.from('projects').update(payload).eq('id', id);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Project updated!');
    } else {
      const { error } = await supabase.from('projects').insert(payload);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Project added!');
    }
    setModal(null);
    load();
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Project deleted'); load(); }
    setDeleting(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>Projects</h2>
          <p style={{ color: 'rgba(240,244,244,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{projects.length} project{projects.length !== 1 ? 's' : ''} in database</p>
        </div>
        <button
          id="add-project-btn"
          onClick={() => setModal('add')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.25rem', background: 'rgba(45,212,191,0.85)', border: 'none', borderRadius: '10px', color: '#070d0e', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.88rem' }}
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,244,244,0.3)' }}>Loading projects…</div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,244,244,0.3)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📁</div>
          <p>No projects yet. Click "Add Project" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {projects.map(p => (
            <div key={p.id} style={{
              background: 'rgba(13,26,28,0.6)',
              border: '1px solid rgba(45,212,191,0.1)',
              borderRadius: '14px',
              padding: '1.25rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(45,212,191,0.25)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(45,212,191,0.1)'}
            >
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{p.title}</span>
                  {p.featured && <Star size={13} fill="var(--gold-accent)" color="var(--gold-accent)" />}
                  <span style={{ padding: '0.15rem 0.6rem', background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)', borderRadius: '20px', fontSize: '0.68rem', color: 'var(--teal-accent)', fontWeight: 600 }}>{p.tag}</span>
                </div>
                <p style={{ color: 'rgba(240,244,244,0.45)', fontSize: '0.82rem', margin: '0 0 0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '500px' }}>{p.desc}</p>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {(p.tech || []).slice(0, 5).map((t, i) => (
                    <span key={i} style={{ padding: '0.1rem 0.55rem', background: 'rgba(7,13,14,0.5)', border: '1px solid rgba(45,212,191,0.08)', borderRadius: '6px', fontSize: '0.7rem', color: 'rgba(240,244,244,0.4)' }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(240,244,244,0.3)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--teal-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,244,244,0.3)'}><GitBranch size={16} /></a>}
                {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(240,244,244,0.3)', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--gold-accent)'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,244,244,0.3)'}><ExternalLink size={16} /></a>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => setModal(p)} style={{ padding: '0.5rem', background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.15)', borderRadius: '8px', color: 'var(--teal-accent)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '8px', color: '#f87171', cursor: deleting === p.id ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', opacity: deleting === p.id ? 0.5 : 1 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ProjectModal
          project={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      <Toast message={toast.message} type={toast.type} />

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        select option { background: #0d1a1c; color: #fff; }
      `}</style>
    </div>
  );
}
