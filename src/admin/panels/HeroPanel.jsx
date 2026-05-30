import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Save, ChevronDown, ChevronUp } from 'lucide-react';

// The 4 overlay phases — matches HeroSection.jsx TEXT_OVERLAYS
const PHASES = [
  { phase: 1, label: 'Phase 1 — Entry', description: 'First overlay shown when page loads', defaultTitle: 'Bhushan', defaultTitle2: 'Chaturbhuj', defaultSub: 'Full Stack Developer.', defaultTag: 'MCA Student · LLM AI Intern' },
  { phase: 2, label: 'Phase 2 — Build', description: 'Shown during early scroll', defaultTitle: 'I Build', defaultTitle2: 'Things.', defaultSub: 'That live on the web.', defaultTag: 'React · Node.js · MongoDB' },
  { phase: 3, label: 'Phase 3 — Precision', description: 'Shown mid-scroll', defaultTitle: 'Built with', defaultTitle2: 'Precision.', defaultSub: 'MERN · AI/ML · Web AR', defaultTag: '' },
  { phase: 4, label: 'Phase 4 — CTA', description: 'Final overlay shown near end of scroll', defaultTitle: "Let's Create Something Amazing.", defaultTitle2: '', defaultSub: 'Open to exciting opportunities', defaultTag: 'Available for work' },
];

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

function PhaseCard({ phaseDef, data, onSave }) {
  const [open, setOpen] = useState(phaseDef.phase === 1);
  const [form, setForm] = useState({
    title: data?.title ?? phaseDef.defaultTitle,
    title2: data?.title2 ?? phaseDef.defaultTitle2,
    subtitle: data?.subtitle ?? phaseDef.defaultSub,
    tag: data?.tag ?? phaseDef.defaultTag,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      title: data?.title ?? phaseDef.defaultTitle,
      title2: data?.title2 ?? phaseDef.defaultTitle2,
      subtitle: data?.subtitle ?? phaseDef.defaultSub,
      tag: data?.tag ?? phaseDef.defaultTag,
    });
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(phaseDef.phase, form);
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 0.9rem',
    background: 'rgba(7,13,14,0.55)', border: '1px solid rgba(45,212,191,0.13)',
    borderRadius: '9px', color: '#fff', fontSize: '0.88rem',
    fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', color: 'rgba(240,244,244,0.45)', fontSize: '0.72rem',
    fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem',
  };

  return (
    <div style={{ background: 'rgba(13,26,28,0.65)', border: '1px solid rgba(45,212,191,0.1)', borderRadius: '14px', overflow: 'hidden' }}>
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', padding: '1.1rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '0.78rem', fontWeight: 700, color: 'var(--teal-accent)' }}>
            {phaseDef.phase}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>{phaseDef.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(240,244,244,0.35)', marginTop: '1px' }}>{phaseDef.description}</div>
          </div>
        </div>
        <span style={{ color: 'rgba(240,244,244,0.3)' }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {/* Collapsible form */}
      {open && (
        <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid rgba(45,212,191,0.07)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Heading Line 1</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder={phaseDef.defaultTitle} />
            </div>
            <div>
              <label style={labelStyle}>Heading Line 2</label>
              <input style={inputStyle} value={form.title2} onChange={e => setForm(f => ({ ...f, title2: e.target.value }))} placeholder={phaseDef.defaultTitle2 || '(leave empty)'} />
            </div>
            <div>
              <label style={labelStyle}>Subtitle</label>
              <input style={inputStyle} value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder={phaseDef.defaultSub} />
            </div>
            <div>
              <label style={labelStyle}>Tag Pill</label>
              <input style={inputStyle} value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} placeholder={phaseDef.defaultTag || '(leave empty)'} />
            </div>
          </div>

          {/* Preview */}
          <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(7,13,14,0.4)', border: '1px solid rgba(45,212,191,0.07)', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.68rem', color: 'rgba(240,244,244,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Preview</div>
            {form.tag && <div style={{ display: 'inline-block', padding: '0.15rem 0.65rem', background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)', borderRadius: '20px', fontSize: '0.68rem', color: 'var(--teal-accent)', marginBottom: '0.4rem' }}>{form.tag}</div>}
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              {form.title}{form.title2 && <><br /><span style={{ color: 'var(--teal-accent)' }}>{form.title2}</span></>}
            </div>
            {form.subtitle && <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.35rem' }}>{form.subtitle}</div>}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: saving ? 'rgba(45,212,191,0.3)' : 'rgba(45,212,191,0.85)', border: 'none', borderRadius: '9px', color: '#070d0e', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.85rem' }}
          >
            <Save size={14} /> {saving ? 'Saving…' : 'Save Phase'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function HeroPanel() {
  const [heroData, setHeroData] = useState([]);
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
    const { data, error } = await supabase.from('hero_text').select('*').order('phase');
    if (error) showToast(error.message, 'error');
    else setHeroData(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (phase, form) => {
    const payload = { phase, title: form.title, title2: form.title2, subtitle: form.subtitle, tag: form.tag };
    const existing = heroData.find(d => d.phase === phase);
    let error;
    if (existing) {
      ({ error } = await supabase.from('hero_text').update(payload).eq('id', existing.id));
    } else {
      ({ error } = await supabase.from('hero_text').insert(payload));
    }
    if (error) { showToast(error.message, 'error'); return; }
    showToast(`Phase ${phase} saved!`);
    load();
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>Hero Overlays</h2>
        <p style={{ color: 'rgba(240,244,244,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Edit the 4 text overlays that appear as you scroll through the hero section.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(240,244,244,0.3)' }}>Loading hero text…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {PHASES.map(phaseDef => (
            <PhaseCard
              key={phaseDef.phase}
              phaseDef={phaseDef}
              data={heroData.find(d => d.phase === phaseDef.phase)}
              onSave={handleSave}
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
