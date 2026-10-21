import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Award,
  Wrench,
  Sliders,
  LogOut,
  ExternalLink,
  CloudUpload,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Shield,
  Activity,
  Cpu
} from 'lucide-react';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { isSupabaseConfigured } from '../lib/supabase';
import OverviewPanel from './panels/OverviewPanel';
import ProjectsPanel from './panels/ProjectsPanel';
import ExperiencePanel from './panels/ExperiencePanel';
import AchievementsPanel from './panels/AchievementsPanel';
import SkillsPanel from './panels/SkillsPanel';
import HeroBioPanel from './panels/HeroBioPanel';

const SESSION_KEY = 'bx_admin_session';
const SESSION_DURATION_MS = 30 * 60 * 1000;

const NAV_TABS = [
  { id: 'overview', label: 'Overview & Telemetry', icon: LayoutDashboard, tag: 'System' },
  { id: 'projects', label: 'Projects Manager', icon: Layers, tag: 'Core' },
  { id: 'experience', label: 'Experience & Timeline', icon: Briefcase, tag: 'Career' },
  { id: 'achievements', label: 'Achievements & Certs', icon: Award, tag: 'Laurels' },
  { id: 'skills', label: 'Skills Matrix', icon: Wrench, tag: 'Tech' },
  { id: 'herobio', label: 'Hero & Bio Studio', icon: Sliders, tag: 'Content' },
];

function SessionClock() {
  const [timeLeft, setTimeLeft] = useState(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return 0;
      const { timestamp } = JSON.parse(raw);
      return Math.max(0, SESSION_DURATION_MS - (Date.now() - timestamp));
    } catch { return 0; }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) {
          setTimeLeft(0);
          return;
        }
        const { timestamp } = JSON.parse(raw);
        setTimeLeft(Math.max(0, SESSION_DURATION_MS - (Date.now() - timestamp)));
      } catch {
        setTimeLeft(0);
      }
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60000);
  const isExpiringSoon = minutes < 5;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      fontSize: '0.72rem',
      color: isExpiringSoon ? '#f87171' : 'rgba(255, 255, 255, 0.45)',
      fontFamily: 'monospace',
    }}>
      <Shield size={12} />
      <span>Session: {minutes}m</span>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [syncingCloud, setSyncingCloud] = useState(false);
  const [toast, setToast] = useState(null);

  const { syncAllToSupabase } = usePortfolioData();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    navigate('/nexus', { replace: true });
  };

  const handleHeaderCloudSync = async () => {
    try {
      setSyncingCloud(true);
      await syncAllToSupabase();
      showToast('All portfolio data synced to Supabase Cloud!');
    } catch (err) {
      showToast(err.message || 'Cloud sync failed', 'error');
    } finally {
      setSyncingCloud(false);
    }
  };

  const currentTabObj = NAV_TABS.find(t => t.id === activeTab) || NAV_TABS[0];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#060608',
      display: 'flex',
      fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
      color: '#f4f4f6',
      position: 'relative',
    }}>
      {/* Toast Feedback */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 99999,
          padding: '0.9rem 1.4rem',
          background: toast.type === 'success' ? '#0e2415' : '#2a1215',
          border: `1px solid ${toast.type === 'success' ? '#22c55e' : '#ef4444'}`,
          borderRadius: '12px',
          color: toast.type === 'success' ? '#86efac' : '#fca5a5',
          fontSize: '0.85rem', fontWeight: 600,
          boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* ─── SIDEBAR ─── */}
      <aside
        style={{
          width: '260px',
          flexShrink: 0,
          background: '#09090d',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem',
          boxSizing: 'border-box',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          transition: 'transform 0.3s ease',
        }}
        className={isMobileSidebarOpen ? 'mobile-sidebar-open' : ''}
      >
        <div>
          {/* Brand Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.25rem' }}>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 10px #22c55e, 0 0 4px #22c55e',
                  animation: 'pulse 1.8s infinite',
                  display: 'inline-block',
                }} />
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  color: '#ffffff',
                }}>
                  NEXUS // OS v4.0
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '9px', color: 'rgba(255, 255, 255, 0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                <span>Portfolio Control Engine</span>
                <span style={{ color: '#22c55e', fontWeight: 700 }}>● Connected</span>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="mobile-close-btn"
              style={{
                background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'none',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {NAV_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive ? 'rgba(212, 255, 61, 0.1)' : 'transparent',
                    color: isActive ? '#d4ff3d' : 'rgba(255, 255, 255, 0.65)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    width: '100%',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={16} color={isActive ? '#d4ff3d' : 'currentColor'} />
                    <span>{tab.label}</span>
                  </div>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: isActive ? '#d4ff3d' : 'rgba(255, 255, 255, 0.25)',
                    letterSpacing: '0.1em',
                  }}>
                    {tab.tag}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
          <div style={{ marginBottom: '1rem', padding: '0 0.25rem' }}>
            <SessionClock />
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.7rem 1rem',
              borderRadius: '10px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              background: 'rgba(239, 68, 68, 0.06)',
              color: '#f87171',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'}
          >
            <LogOut size={15} />
            Lock Session
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Telemetry Header Bar */}
        <header style={{
          height: '68px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(6, 6, 8, 0.85)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
        }}>
          {/* Left: Mobile hamburger + active title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="mobile-hamburger-btn"
              style={{
                background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'none', padding: 0,
              }}
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#fff',
                margin: 0,
                letterSpacing: '-0.01em',
              }}>
                {currentTabObj.label}
              </h1>
            </div>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <button
              onClick={handleHeaderCloudSync}
              disabled={syncingCloud}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(212, 255, 61, 0.3)',
                background: 'rgba(212, 255, 61, 0.08)',
                color: '#d4ff3d',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: syncingCloud ? 'not-allowed' : 'pointer',
                opacity: syncingCloud ? 0.7 : 1,
              }}
            >
              <CloudUpload size={14} />
              {syncingCloud ? 'Syncing...' : 'Sync Cloud'}
            </button>

            <Link
              to="/"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(255, 255, 255, 0.04)',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>Live Site</span>
              <ExternalLink size={13} color="rgba(255, 255, 255, 0.6)" />
            </Link>
          </div>
        </header>

        {/* Active Workspace Canvas */}
        <main style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '1360px',
          width: '100%',
          boxSizing: 'border-box',
          margin: '0 auto',
        }}>
          {activeTab === 'overview' && <OverviewPanel onNavigateTab={setActiveTab} />}
          {activeTab === 'projects' && <ProjectsPanel />}
          {activeTab === 'experience' && <ExperiencePanel />}
          {activeTab === 'achievements' && <AchievementsPanel />}
          {activeTab === 'skills' && <SkillsPanel />}
          {activeTab === 'herobio' && <HeroBioPanel />}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          aside {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
          }
          aside.mobile-sidebar-open {
            transform: translateX(0) !important;
          }
          .mobile-close-btn {
            display: block !important;
          }
          .mobile-hamburger-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
