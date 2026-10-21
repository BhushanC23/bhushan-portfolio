import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Shield, Eye, EyeOff, Zap, ArrowLeft, Terminal, KeyRound, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SESSION_KEY = 'bx_admin_session';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export default function AdminLogin() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('passkey'); // 'passkey' | 'supabase'
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect straight to /nexus/os
  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const { timestamp } = JSON.parse(session);
        if (Date.now() - timestamp < SESSION_DURATION_MS) {
          navigate('/nexus/os', { replace: true });
        }
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, [navigate]);

  const grantAccess = () => {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        authenticatedAt: new Date().toISOString(),
        user: email || 'Root Admin',
      })
    );
    navigate('/nexus/os', { replace: true });
  };

  const handlePasskeySubmit = (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const adminPass = import.meta.env.VITE_ADMIN_PASS || 'bhushxn@123';
      if (password === adminPass) {
        grantAccess();
      } else {
        setError('Invalid security passkey. Access denied.');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
      setLoading(false);
    }, 300);
  };

  const handleSupabaseSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isSupabaseConfigured) {
      setError('Supabase credentials not configured in environment. Use Passkey mode.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: sbError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (sbError) throw sbError;
      if (data?.session) {
        grantAccess();
      }
    } catch (err) {
      setError(err.message || 'Supabase authentication failed.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickUnlock = () => {
    const adminPass = import.meta.env.VITE_ADMIN_PASS || 'bhushxn@123';
    setPassword(adminPass);
    setLoading(true);
    setTimeout(() => {
      grantAccess();
    }, 200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#060608',
      backgroundImage: `
        radial-gradient(circle at 50% 0%, rgba(212, 255, 61, 0.08) 0%, transparent 60%),
        radial-gradient(circle at 100% 100%, rgba(201, 168, 76, 0.04) 0%, transparent 50%),
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
      `,
      backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
      color: '#f4f4f6',
    }}>
      {/* Floating Back Button */}
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1.1rem',
          borderRadius: '100px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.7)',
          textDecoration: 'none',
          fontSize: '0.8rem',
          fontWeight: 600,
          backdropFilter: 'blur(12px)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = 'rgba(212, 255, 61, 0.3)';
          e.currentTarget.style.background = 'rgba(212, 255, 61, 0.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
        }}
      >
        <ArrowLeft size={14} />
        Live Portfolio
      </Link>

      {/* Main Terminal Security Card */}
      <div
        className={shake ? 'animate-shake' : ''}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#0d0d12',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 255, 61, 0.04)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Top glowing ambient highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #d4ff3d, transparent)',
          opacity: 0.8,
        }} />

        {/* Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '100px',
            background: 'rgba(212, 255, 61, 0.08)',
            border: '1px solid rgba(212, 255, 61, 0.25)',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#d4ff3d',
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#d4ff3d',
              boxShadow: '0 0 8px #d4ff3d',
              animation: 'pulse 2s infinite',
            }} />
            GATEWAY ONLINE // ENCLAVE
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.3)', fontFamily: 'monospace' }}>
            v4.0
          </span>
        </div>

        {/* Brand Heading */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-display, "Syne", sans-serif)',
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 0.35rem 0',
            color: '#ffffff',
          }}>
            NexusOS
          </h1>
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0,
            letterSpacing: '0.02em',
          }}>
            Portfolio Control Engine &amp; Headless Studio
          </p>
        </div>

        {/* Auth Mode Toggle Pill */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          <button
            type="button"
            onClick={() => setAuthMode('passkey')}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              border: 'none',
              background: authMode === 'passkey' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: authMode === 'passkey' ? '#fff' : 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            <KeyRound size={13} color={authMode === 'passkey' ? '#d4ff3d' : 'currentColor'} />
            Passkey
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('supabase')}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              border: 'none',
              background: authMode === 'supabase' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: authMode === 'supabase' ? '#fff' : 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s',
            }}
          >
            <Cpu size={13} color={authMode === 'supabase' ? '#d4ff3d' : 'currentColor'} />
            Supabase Cloud
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={authMode === 'passkey' ? handlePasskeySubmit : handleSupabaseSubmit}>
          {authMode === 'supabase' && (
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="bhushan@nexus.os"
                required
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace',
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>
                {authMode === 'passkey' ? 'Master Terminal Key' : 'Account Password'}
              </label>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={authMode === 'passkey' ? 'Enter passkey...' : '••••••••••••'}
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.8rem 2.8rem 0.8rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'monospace',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(212, 255, 61, 0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute',
                  right: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              fontSize: '0.8rem',
              marginBottom: '1.25rem',
            }}>
              <AlertTriangle size={15} flexShrink={0} />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '12px',
              border: 'none',
              background: '#d4ff3d',
              color: '#000',
              fontWeight: 800,
              fontSize: '0.88rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 0 24px rgba(212, 255, 61, 0.25)',
              transition: 'transform 0.15s, box-shadow 0.15s',
              opacity: loading ? 0.8 : 1,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Lock size={15} />
            {loading ? 'Authenticating...' : 'Unlock NexusOS'}
          </button>
        </form>

        {/* ⚡ Quick Dev Unlock */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            type="button"
            onClick={handleQuickUnlock}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#d4ff3d';
              e.currentTarget.style.color = '#d4ff3d';
              e.currentTarget.style.background = 'rgba(212, 255, 61, 0.04)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          >
            <Zap size={14} color="#d4ff3d" />
            ⚡ Quick Dev Unlock (Instant Access)
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.3)' }}>
        Authorized Access Only · Shift + Alt + N Shortcut Registered
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  );
}
