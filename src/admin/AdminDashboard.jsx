import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, Wrench, Image, Layers, LogOut, ChevronRight, Database, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BHUSHAN_DATA } from '../data/bhushanData';
import ProjectsPanel from './panels/ProjectsPanel';
import SkillsPanel from './panels/SkillsPanel';
import HeroPanel from './panels/HeroPanel';
import AboutPanel from './panels/AboutPanel';

const SESSION_KEY = 'bx_admin_session';
const SESSION_DURATION_MS = 30 * 60 * 1000;

const TABS = [
  { id: 'projects', label: 'Projects', icon: LayoutGrid, description: 'Manage project cards' },
  { id: 'skills', label: 'Skills', icon: Wrench, description: 'Manage skill tags' },
  { id: 'hero', label: 'Hero Text', icon: Layers, description: 'Edit 4 phase overlays' },
  { id: 'about', label: 'About', icon: Image, description: 'Edit bio & photo' },
];

function SessionTimer() {
  const [timeLeft, setTimeLeft] = useState(() => {
    try {
      const { timestamp } = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
      return Math.max(0, SESSION_DURATION_MS - (Date.now() - timestamp));
    } catch { return 0; }
  });

  useState(() => {
    const interval = setInterval(() => {
      try {
        const { timestamp } = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
        setTimeLeft(Math.max(0, SESSION_DURATION_MS - (Date.now() - timestamp)));
      } catch { setTimeLeft(0); }
    }, 30000);
    return () => clearInterval(interval);
  });

  const minutes = Math.floor(timeLeft / 60000);
  const isLow = minutes < 5;

  return (
    <span style={{ fontSize: '0.75rem', color: isLow ? '#f87171' : 'rgba(240,244,244,0.3)', fontFamily: 'var(--font-body)' }}>
      Session: {minutes}m left
    </span>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [syncing, setSyncing] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    navigate('/bx-studio', { replace: true });
  };

  const handleSyncLocalData = async () => {
    const confirmSync = window.confirm(
      "Are you sure you want to sync your existing hardcoded portfolio data to Supabase? This will clear any existing data in your Supabase projects, skills, hero, and about tables and replace it with your current website data."
    );
    if (!confirmSync) return;

    try {
      setSyncing(true);
      
      // 1. Sync Projects
      const projectsToInsert = BHUSHAN_DATA.projects.map(p => ({
        title: p.name,
        desc: p.description,
        tech: p.stack || [],
        github: p.github || '',
        demo: p.demo || '',
        tag: p.tag || '',
        featured: p.featured || false
      }));

      // Delete existing and insert new
      await supabase.from('projects').delete().not('id', 'is', null);
      const { error: pErr } = await supabase.from('projects').insert(projectsToInsert);
      if (pErr) throw new Error("Projects sync failed: " + pErr.message);

      // 2. Sync Skills
      const skillsToInsert = Object.keys(BHUSHAN_DATA.skills).map(category => ({
        category,
        items: BHUSHAN_DATA.skills[category] || []
      }));

      await supabase.from('skills').delete().not('id', 'is', null);
      const { error: sErr } = await supabase.from('skills').insert(skillsToInsert);
      if (sErr) throw new Error("Skills sync failed: " + sErr.message);

      // 3. Sync Hero Text
      const heroTextToInsert = [
        { phase: 1, title: 'Bhushan', title2: 'Chaturbhuj', subtitle: 'Full Stack Developer.', tag: 'MCA Student · LLM AI Intern' },
        { phase: 2, title: 'I Build', title2: 'Things.', subtitle: 'That live on the web.', tag: 'React · Node.js · MongoDB' },
        { phase: 3, title: 'Built with', title2: 'Precision.', subtitle: 'MERN · AI/ML · Web AR', tag: '' },
        { phase: 4, title: "Let's Create Something Amazing.", title2: '', subtitle: 'Open to exciting opportunities', tag: 'Available for work' }
      ];

      await supabase.from('hero_text').delete().not('id', 'is', null);
      const { error: hErr } = await supabase.from('hero_text').insert(heroTextToInsert);
      if (hErr) throw new Error("Hero text sync failed: " + hErr.message);

      // 4. Sync About Bio
      const aboutBio = [
        `Hi, I'm <strong>Bhushan Chaturbhuj</strong> — a Full Stack Developer and MCA student at Sanjivani University, Kopargaon. I build web experiences that are fast, functional, and memorable.`,
        `Currently interning at <strong style="color:var(--gold-accent)">Ethara AI</strong> on LLM Post-Training (SFT &amp; RLHF workflows). I love turning ideas into reality — from AR heritage platforms to EV buying assistants.`,
        `🏆 National Rank 52 at NEC 2025 (IIT Bombay E-Cell) — Turning coffee into code, and ideas into impact.`
      ].join('\n');

      const aboutToInsert = {
        bio: aboutBio,
        photo_url: '/bhushan-photo.jpg'
      };

      await supabase.from('about').delete().not('id', 'is', null);
      const { error: aErr } = await supabase.from('about').insert(aboutToInsert);
      if (aErr) throw new Error("About bio sync failed: " + aErr.message);

      alert("🎉 Local portfolio data synced to Supabase successfully! Refreshing dashboard...");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Sync failed: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const ActivePanel = {
    projects: ProjectsPanel,
    skills: SkillsPanel,
    hero: HeroPanel,
    about: AboutPanel,
  }[activeTab];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c0d',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-body)',
    }}>

      {/* Top Bar */}
      <header style={{
        height: '60px',
        background: 'rgba(13,22,24,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(45,212,191,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Database size={15} color="var(--teal-accent)" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.01em' }}>
              BX Studio
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(240,244,244,0.3)', marginTop: '-1px' }}>Admin Dashboard</div>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Supabase status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isSupabaseConfigured ? '#34d399' : '#f87171' }} />
            <span style={{ fontSize: '0.72rem', color: 'rgba(240,244,244,0.3)' }}>
              {isSupabaseConfigured ? 'Supabase connected' : 'Supabase not configured'}
            </span>
          </div>

          <SessionTimer />

          {/* Portfolio link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.75rem', color: 'rgba(240,244,244,0.3)', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--teal-accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,244,244,0.3)'}
          >
            View Portfolio <ChevronRight size={12} />
          </a>

          {/* Sync Local Data Button */}
          {isSupabaseConfigured && (
            <button
              onClick={handleSyncLocalData}
              disabled={syncing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.9rem',
                background: syncing ? 'rgba(45,212,191,0.03)' : 'rgba(45,212,191,0.08)',
                border: '1px solid rgba(45,212,191,0.18)',
                borderRadius: '8px',
                color: 'var(--teal-accent)',
                fontSize: '0.78rem',
                cursor: syncing ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.2s',
                opacity: syncing ? 0.6 : 1,
              }}
              onMouseEnter={e => { if (!syncing) e.currentTarget.style.background = 'rgba(45,212,191,0.15)'; }}
              onMouseLeave={e => { if (!syncing) e.currentTarget.style.background = 'rgba(45,212,191,0.08)'; }}
            >
              <RefreshCw size={13} style={{ animation: syncing ? 'spin 1.2s linear infinite' : 'none' }} />
              {syncing ? 'Syncing...' : 'Sync Local Data'}
            </button>
          )}

          {/* Logout */}
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: '8px', color: '#f87171', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.14)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          >
            <LogOut size={13} /> Logout
          </button>
          
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </header>

      {/* Body — sidebar + content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <nav style={{
          width: '220px',
          flexShrink: 0,
          background: 'rgba(10,18,20,0.8)',
          borderRight: '1px solid rgba(45,212,191,0.06)',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.35rem',
          overflowY: 'auto',
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,244,244,0.2)', marginBottom: '0.5rem', paddingLeft: '0.75rem' }}>
            Content
          </div>
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%', textAlign: 'left', padding: '0.7rem 0.75rem',
                  background: isActive ? 'rgba(45,212,191,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(45,212,191,0.15)' : '1px solid transparent',
                  borderRadius: '10px', cursor: 'pointer',
                  transition: 'all 0.18s',
                  display: 'flex', alignItems: 'center', gap: '0.65rem',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(45,212,191,0.04)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={16} color={isActive ? 'var(--teal-accent)' : 'rgba(240,244,244,0.35)'} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: isActive ? '#fff' : 'rgba(240,244,244,0.55)', lineHeight: 1.2 }}>{tab.label}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(240,244,244,0.25)', marginTop: '1px' }}>{tab.description}</div>
                </div>
              </button>
            );
          })}

          {/* Bottom hint */}
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', paddingLeft: '0.75rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(240,244,244,0.18)', lineHeight: 1.6 }}>
              Changes are saved to Supabase and reflected live on the portfolio.
            </div>
          </div>
        </nav>

        {/* Main content area */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2.5rem 2.5rem' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'rgba(240,244,244,0.3)', fontSize: '0.8rem' }}>
            <span>BX Studio</span>
            <ChevronRight size={13} />
            <span style={{ color: 'var(--teal-accent)' }}>{TABS.find(t => t.id === activeTab)?.label}</span>
          </div>

          {/* Supabase warning banner */}
          {!isSupabaseConfigured && (
            <div style={{ padding: '1rem 1.25rem', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '12px', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.1rem' }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 600, color: '#fbbf24', fontSize: '0.88rem', marginBottom: '0.3rem' }}>Supabase Not Configured</div>
                <div style={{ color: 'rgba(240,244,244,0.5)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  Add <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0 4px', borderRadius: '4px', color: '#fbbf24' }}>VITE_SUPABASE_URL</code> and{' '}
                  <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0 4px', borderRadius: '4px', color: '#fbbf24' }}>VITE_SUPABASE_ANON_KEY</code> to your <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0 4px', borderRadius: '4px', color: '#fbbf24' }}>.env</code> file, then restart the dev server.
                </div>
              </div>
            </div>
          )}

          <ActivePanel />
        </main>
      </div>
    </div>
  );
}
