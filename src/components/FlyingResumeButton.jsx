import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function FlyingResumeButton() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  // Viewport Observer: Slides the widget in from the left ONLY from the About section onwards
  useEffect(() => {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) {
      // Fallback if section is missing
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      },
      {
        root: null,
        threshold: 0.05,
      }
    );

    observer.observe(aboutSection);
    return () => observer.disconnect();
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Bhushan_Chaturbhuj_Resume.pdf';
    link.download = 'Bhushan_Chaturbhuj_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={handleDownload}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        left: '2rem',
        bottom: '2rem',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transform: visible 
          ? (hovered ? 'translateY(0) scale(1.05)' : 'translateY(0) scale(1)') 
          : 'translateY(100px) opacity(0)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
      }}
      className="flying-resume-badge"
    >
      {/* Outer circular badge */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: hovered ? '1.5px solid var(--accent-lime)' : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: hovered 
            ? '0 0 24px rgba(212, 255, 61, 0.25), 0 8px 30px rgba(0, 0, 0, 0.6)' 
            : '0 8px 24px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {/* Rotating dash ring (SVG) */}
        <svg
          viewBox="0 0 100 100"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            animation: hovered ? 'spin-ring 4s linear infinite' : 'spin-ring 12s linear infinite',
            transition: 'animation-duration 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={hovered ? 'var(--accent-lime)' : 'rgba(255, 255, 255, 0.2)'}
            strokeWidth="1.5"
            strokeDasharray="4 8"
            style={{ transition: 'stroke 0.3s ease' }}
          />
        </svg>

        {/* Inner pulsing indicator light */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'var(--accent-lime)',
          boxShadow: '0 0 8px var(--accent-lime)',
          animation: 'pulse-dot-light 2s infinite alternate',
        }} />

        {/* Centered Modern CV / Download Icon */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          color: hovered ? 'var(--accent-lime)' : '#ffffff',
          transform: hovered ? 'scale(1.1) translateY(1px)' : 'scale(1) translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        }}>
          <Download size={20} />
        </div>
      </div>

      {/* Slide-out sleek label */}
      <div
        style={{
          background: 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: hovered ? '1.5px solid var(--accent-lime)' : '1px solid rgba(255, 255, 255, 0.1)',
          borderLeft: 'none',
          padding: '0 1.25rem 0 2.25rem',
          height: '42px',
          borderRadius: '0 30px 30px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '-1.75rem',
          position: 'relative',
          zIndex: -1,
          fontFamily: 'var(--font-display)',
          fontSize: '11px',
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: hovered ? 'var(--accent-lime)' : 'rgba(255, 255, 255, 0.8)',
          boxShadow: hovered 
            ? '0 0 24px rgba(212, 255, 61, 0.15), 0 8px 30px rgba(0, 0, 0, 0.5)' 
            : '0 8px 24px rgba(0, 0, 0, 0.3)',
          transform: hovered ? 'translateX(0)' : 'translateX(-12px)',
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? 'auto' : 'none',
          transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        Resume
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin-ring {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-dot-light {
          0%   { opacity: 0.4; }
          100% { opacity: 1; }
        }
        @media (max-width: 768px) {
          .flying-resume-badge {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
