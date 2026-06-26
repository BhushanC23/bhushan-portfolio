import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';

const SESSION_KEY = 'bx_admin_session';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export default function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const { timestamp } = JSON.parse(session);
        if (Date.now() - timestamp < SESSION_DURATION_MS) {
          navigate('/bx-studio/dashboard', { replace: true });
        }
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Small delay for UX feel
    setTimeout(() => {
      const adminPass = import.meta.env.VITE_ADMIN_PASS || 'bhushxn@123';
      if (password === adminPass) {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ timestamp: Date.now() })
        );
        navigate('/bx-studio/dashboard', { replace: true });
      } else {
        setError('Invalid credentials. Access denied.');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(45,212,191,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(201,168,76,0.04) 0%, transparent 50%), #080c0d',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Grid texture */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(45,212,191,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Floating orbs */}
      <div style={{
        position: 'absolute', top: '15%', left: '10%',
        width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,212,191,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '8%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Login Card */}
      <div
        className={shake ? 'admin-shake' : ''}
        style={{
          width: '100%',
          maxWidth: '420px',
          margin: '0 1.5rem',
          background: 'rgba(13, 22, 24, 0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(45,212,191,0.15)',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(45,212,191,0.05)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '16px',
            background: 'rgba(45,212,191,0.1)',
            border: '1px solid rgba(45,212,191,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <Shield size={24} color="var(--teal-accent)" />
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--teal-accent)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}>
            Restricted Access
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.9rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            BX Studio
          </h1>
          <p style={{
            color: 'rgba(240,244,244,0.4)',
            fontSize: '0.85rem',
            marginTop: '0.5rem',
          }}>
            Admin dashboard — authorized personnel only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <div style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(45,212,191,0.5)',
            }}>
              <Lock size={16} />
            </div>
            <input
              id="admin-password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                padding: '0.85rem 3rem 0.85rem 2.75rem',
                background: 'rgba(7,13,14,0.6)',
                border: `1px solid ${error ? 'rgba(239,68,68,0.4)' : 'rgba(45,212,191,0.15)'}`,
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(45,212,191,0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(45,212,191,0.08)';
              }}
              onBlur={e => {
                e.target.style.borderColor = error ? 'rgba(239,68,68,0.4)' : 'rgba(45,212,191,0.15)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(240,244,244,0.35)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              color: '#f87171',
              fontSize: '0.82rem',
              marginBottom: '1rem',
              padding: '0.6rem 0.9rem',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              ⚠ {error}
            </div>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: loading
                ? 'rgba(45,212,191,0.3)'
                : 'linear-gradient(135deg, rgba(45,212,191,0.9), rgba(45,212,191,0.7))',
              border: '1px solid rgba(45,212,191,0.4)',
              borderRadius: '12px',
              color: '#070d0e',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: !password ? 0.5 : 1,
            }}
            onMouseEnter={e => {
              if (!loading && password) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 8px 20px rgba(45,212,191,0.25)';
              }
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {loading ? 'Verifying…' : 'Access Dashboard →'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(45,212,191,0.07)',
          color: 'rgba(240,244,244,0.2)',
          fontSize: '0.72rem',
          letterSpacing: '0.05em',
        }}>
          BX Studio · Session expires in 30 min
        </div>
      </div>

      <style>{`
        @keyframes admin-shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        .admin-shake { animation: admin-shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97); }
        input::placeholder { color: rgba(240,244,244,0.25); }
        .back-link { color: rgba(122,158,159,0.4); transition: color 0.2s; }
        .back-link:hover { color: rgba(45,212,191,0.7); }
      `}</style>

      {/* Back to portfolio */}
      <a
        href="/"
        className="back-link"
        style={{
          position: 'absolute',
          bottom: '1.75rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.68rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        ← Back to portfolio
      </a>
    </div>
  );
}
