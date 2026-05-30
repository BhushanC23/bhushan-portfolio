import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Save, Image } from 'lucide-react';

function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
      padding: '0.85rem 1.25rem',
      background: type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
      border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
      borderRadius: '12px', color: type === 'success' ? '#86efac' : '#fca5a5',
      fontSize: '0.88rem', fontFamily: 'var(--font-body)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'slideUp 0.3s ease',
    }}>
      {message}
    </div>
  );
}

export default function AboutPanel() {
  const [form, setForm] = useState({ bio: '', photo_url: '' });
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [imgError, setImgError] = useState(false);

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
    const { data, error } = await supabase.from('about').select('*').limit(1);
    if (error) { showToast(error.message, 'error'); }
    else if (data?.[0]) {
      setForm({ bio: data[0].bio || '', photo_url: data[0].photo_url || '' });
      setRecordId(data[0].id);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    const payload = { bio: form.bio, photo_url: form.photo_url };
    let error;
    if (recordId) {
      ({ error } = await supabase.from('about').update(payload).eq('id', recordId));
    } else {
      const { data, error: insertErr } = await supabase.from('about').insert(payload).select().single();
      error = insertErr;
      if (data) setRecordId(data.id);
    }
    if (error) showToast(error.message, 'error');
    else showToast('About section saved!');
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: 'rgba(7,13,14,0.55)', border: '1px solid rgba(45,212,191,0.13)',
    borderRadius: '10px', color: '#fff', fontSize: '0.9rem',
    fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };
  const labelStyle = { display: 'block', color: 'rgba(240,244,244,0.45)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.4rem' };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>About Section</h2>
        <p style={{ color: 'rgba(240,244,244,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Edit the bio text and profile photo URL shown in the About section.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,244,244,0.3)' }}>Loading about data…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>

          {/* Left — text fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Bio Text</label>
              <p style={{ color: 'rgba(240,244,244,0.3)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                Write your full bio here. You can use line breaks to separate paragraphs.
              </p>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Hi, I'm Bhushan Chaturbhuj — a Full Stack Developer…"
                style={{ ...inputStyle, height: '220px', resize: 'vertical', lineHeight: 1.7 }}
              />
            </div>

            <div>
              <label style={labelStyle}>Photo URL</label>
              <p style={{ color: 'rgba(240,244,244,0.3)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
                Enter a direct image URL (Cloudinary, GitHub raw, etc.) or leave empty to use <code style={{ color: 'var(--teal-accent)', background: 'rgba(45,212,191,0.08)', padding: '0 4px', borderRadius: '4px' }}>/bhushan-photo.jpg</code> from public folder.
              </p>
              <input
                value={form.photo_url}
                onChange={e => { setForm(f => ({ ...f, photo_url: e.target.value })); setImgError(false); }}
                placeholder="https://res.cloudinary.com/…"
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: saving ? 'rgba(45,212,191,0.3)' : 'rgba(45,212,191,0.85)', border: 'none', borderRadius: '10px', color: '#070d0e', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', transition: 'all 0.2s' }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.boxShadow = '0 6px 18px rgba(45,212,191,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <Save size={16} /> {saving ? 'Saving…' : 'Save About'}
            </button>
          </div>

          {/* Right — photo preview */}
          <div>
            <label style={labelStyle}>Photo Preview</label>
            <div style={{ border: '1px solid rgba(45,212,191,0.12)', borderRadius: '16px', overflow: 'hidden', aspectRatio: '3/4', background: 'rgba(13,26,28,0.5)', position: 'relative' }}>
              {form.photo_url && !imgError ? (
                <img
                  src={form.photo_url}
                  alt="Profile preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(240,244,244,0.2)', gap: '0.5rem' }}>
                  <Image size={32} />
                  <span style={{ fontSize: '0.8rem' }}>{imgError ? 'Invalid URL' : 'No photo URL set'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Toast message={toast.message} type={toast.type} />
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        textarea::placeholder, input::placeholder { color: rgba(240,244,244,0.2); }
      `}</style>
    </div>
  );
}
