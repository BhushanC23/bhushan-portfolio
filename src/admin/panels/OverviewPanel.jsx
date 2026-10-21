import { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { exportBackupJSON, importBackupJSON, resetToDefaults } from '../../lib/cmsService';
import { isSupabaseConfigured } from '../../lib/supabase';
import {
  Layers,
  Star,
  Briefcase,
  Award,
  Wrench,
  CloudUpload,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  HardDrive
} from 'lucide-react';

export default function OverviewPanel({ onNavigateTab }) {
  const { projects, experience, achievements, skills, about, lastSyncedAt, syncAllToSupabase } = usePortfolioData();
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSyncCloud = async () => {
    try {
      setSyncing(true);
      const res = await syncAllToSupabase();
      showToast('All portfolio data successfully synchronized to Supabase Cloud!');
    } catch (err) {
      showToast(err.message || 'Supabase sync failed', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleExportBackup = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Database exported successfully as JSON!');
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;
    const res = importBackupJSON(importText);
    if (res.success) {
      setShowImportModal(false);
      setImportText('');
      showToast('Backup restored successfully!');
    } else {
      showToast('Invalid JSON file format: ' + res.error, 'error');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to restore baseline system defaults? Any un-synced custom edits will be reverted.')) {
      resetToDefaults();
      showToast('Portfolio successfully reset to defaults.');
    }
  };

  const totalSkills = Object.values(skills || {}).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0);
  const featuredProjectsCount = (projects || []).filter(p => p.featured).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
          padding: '0.9rem 1.4rem',
          background: toast.type === 'success' ? '#0e2415' : '#2a1215',
          border: `1px solid ${toast.type === 'success' ? '#22c55e' : '#ef4444'}`,
          borderRadius: '12px',
          color: toast.type === 'success' ? '#86efac' : '#fca5a5',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        }}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* Telemetry Header */}
      <div style={{
        background: '#0d0d12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: isSupabaseConfigured ? '#d4ff3d' : '#eab308',
              boxShadow: `0 0 10px ${isSupabaseConfigured ? '#d4ff3d' : '#eab308'}`,
            }} />
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: isSupabaseConfigured ? '#d4ff3d' : '#eab308' }}>
              {isSupabaseConfigured ? 'Cloud Sync Engine Connected' : 'Local Persistence Mode Active'}
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: '0 0 0.4rem 0' }}>
            System Telemetry &amp; Control
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            Last modified: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Ready'} · Offline-first instant propagation enabled.
          </p>
        </div>

        {/* Quick Action Button Group */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleSyncCloud}
            disabled={syncing}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: '#d4ff3d',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.82rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: syncing ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 0 20px rgba(212, 255, 61, 0.25)',
              opacity: syncing ? 0.7 : 1,
            }}
          >
            <CloudUpload size={16} />
            {syncing ? 'Pushing Data...' : 'Sync to Cloud'}
          </button>

          <button
            onClick={handleExportBackup}
            style={{
              padding: '0.75rem 1.1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
          >
            <Download size={15} />
            Export JSON
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            style={{
              padding: '0.75rem 1.1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.04)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
          >
            <Upload size={15} />
            Import Backup
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab('projects')}
          style={{
            background: '#0d0d12',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#d4ff3d'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Projects Live
            </span>
            <Layers size={18} color="#d4ff3d" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
            {projects?.length || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#d4ff3d', marginTop: '0.4rem', fontWeight: 600 }}>
            {featuredProjectsCount} Featured Highlights →
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab('experience')}
          style={{
            background: '#0d0d12',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#60a5fa'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Experience Milestones
            </span>
            <Briefcase size={18} color="#60a5fa" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
            {experience?.length || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#60a5fa', marginTop: '0.4rem', fontWeight: 600 }}>
            Manage Career Path →
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigateTab('achievements')}
          style={{
            background: '#0d0d12',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a84c'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Awards &amp; Certs
            </span>
            <Award size={18} color="#c9a84c" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
            {achievements?.length || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#c9a84c', marginTop: '0.4rem', fontWeight: 600 }}>
            Rank 52 + Certifications →
          </div>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigateTab('skills')}
          style={{
            background: '#0d0d12',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#a78bfa'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Verified Tech Skills
            </span>
            <Wrench size={18} color="#a78bfa" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
            {totalSkills}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginTop: '0.4rem', fontWeight: 600 }}>
            Across 6 Tech Domains →
          </div>
        </div>
      </div>

      {/* System Engine Diagnostic Specs */}
      <div style={{
        background: '#0d0d12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '2rem',
      }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginTop: 0, marginBottom: '1.5rem' }}>
          Database Architecture &amp; Storage Topology
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#d4ff3d' }}>
              <Database size={16} />
              <strong style={{ fontSize: '0.85rem' }}>Supabase PostgreSQL Engine</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              Connected to active Supabase project endpoint. Reads and mutations synchronize in parallel across <code>projects</code>, <code>skills</code>, <code>hero_text</code>, and <code>about</code>.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#60a5fa' }}>
              <HardDrive size={16} />
              <strong style={{ fontSize: '0.85rem' }}>Local Reactive Cache</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              Stores snapshots in <code>nexus_portfolio_data</code>. Any save or edit instantly dispatches window events, triggering zero-reload updates on the live portfolio.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#c9a84c' }}>
              <RefreshCw size={16} />
              <strong style={{ fontSize: '0.85rem' }}>Emergency Rollback</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
              Revert entire portfolio content to initial vetted production baseline with one click.
            </p>
            <button
              onClick={handleReset}
              style={{
                marginTop: '0.85rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reset to System Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Import JSON Modal */}
      {showImportModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#0d0d12',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: '0 0 0.5rem 0' }}>
              Restore Portfolio Database Backup
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>
              Paste your exported JSON database below to restore all 6 portfolio entities.
            </p>
            <textarea
              rows={10}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Paste JSON object here..."
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '12px',
                background: '#060608',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#d4ff3d',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                boxSizing: 'border-box',
                outline: 'none',
                marginBottom: '1.5rem',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                onClick={() => setShowImportModal(false)}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleImportSubmit}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '10px',
                  background: '#d4ff3d',
                  border: 'none',
                  color: '#000',
                  cursor: 'pointer',
                  fontWeight: 800,
                }}
              >
                Apply &amp; Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
