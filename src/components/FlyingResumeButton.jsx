import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function FlyingResumeButton() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  // Viewport Observer: Slides the widget in from the left ONLY from the About section onwards
  useEffect(() => {
    const aboutSection = document.getElementById('about');
    if (!aboutSection) {
      // Fallback if section is missing (e.g., admin pages)
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
        left: '1rem',
        bottom: '1rem',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        cursor: 'pointer',
        // Smooth slide-in from off-screen left
        transform: visible 
          ? (hovered ? 'translateX(0) scale(1.02)' : 'translateX(0) scale(1)') 
          : 'translateX(-220px) scale(0.8)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'transform 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s ease',
      }}
      className="flying-bot-container"
    >
      {/* Cute Intelligent Floating AI Robot Widget */}
      <div
        style={{
          width: '72px',
          height: '72px',
          position: 'relative',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: hovered ? 'rotate(4deg) scale(1.05)' : 'rotate(0deg) scale(1)',
        }}
      >
        {/* Pulsing Cyan Repulsor Hover Jet (Bottom) */}
        <div
          className="bot-repulsor-beam"
          style={{
            position: 'absolute',
            bottom: '5px',
            left: '27px',
            width: '18px',
            height: '28px',
            background: 'linear-gradient(to bottom, var(--teal-accent), rgba(45,212,191,0.2), transparent)',
            borderRadius: '50% 50% 30% 30%',
            filter: 'blur(1.5px)',
            opacity: 0.9,
            transformOrigin: 'top center',
          }}
        />

        {/* Vector SVG Cute Intelligent Robot */}
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: '100%',
            filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.5))',
          }}
        >
          <defs>
            {/* Robot metallic body white gradient */}
            <linearGradient id="botBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Dark glass screen visor */}
            <linearGradient id="botVisor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Glowing cyan lens */}
            <radialGradient id="botEyeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Left Cute Floating Arm */}
          <g className="bot-arm-left" style={{ transformOrigin: '24px 50px' }}>
            <rect x="14" y="44" width="8" height="18" rx="4" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.5" />
            {/* Glowing cyan wrist ring */}
            <rect x="14" y="55" width="8" height="2" fill="var(--teal-accent)" />
            {/* Cute hand joint */}
            <circle cx="18" cy="64" r="3" fill="#475569" />
          </g>

          {/* Right Cute Floating Arm */}
          <g className="bot-arm-right" style={{ transformOrigin: '76px 50px' }}>
            <rect x="78" y="44" width="8" height="18" rx="4" fill="#94a3b8" stroke="#cbd5e1" strokeWidth="0.5" />
            {/* Glowing cyan wrist ring */}
            <rect x="78" y="55" width="8" height="2" fill="var(--teal-accent)" />
            {/* Cute hand joint */}
            <circle cx="82" cy="64" r="3" fill="#475569" />
          </g>

          {/* Little Head Antenna */}
          <line x1="50" y1="20" x2="50" y2="8" stroke="#475569" strokeWidth="2" />
          <circle cx="50" cy="7" r="2.5" fill="var(--teal-accent)" className="bot-antenna-blink" style={{ filter: 'drop-shadow(0 0 3px var(--teal-accent))' }} />

          {/* Spherical Lower Torso */}
          <circle cx="50" cy="58" r="18" fill="url(#botBody)" stroke="#94a3b8" strokeWidth="1" />
          
          {/* Neon energy core ring (Chest) */}
          <circle cx="50" cy="56" r="6" fill="url(#botEyeGlow)" className="bot-core-pulse" />
          <circle cx="50" cy="56" r="8" fill="none" stroke="rgba(45,212,191,0.3)" strokeWidth="1" />

          {/* Robot Head */}
          <rect x="30" y="20" width="40" height="28" rx="14" fill="url(#botBody)" stroke="#94a3b8" strokeWidth="1" />

          {/* Curved Face Visor Visor */}
          <rect x="35" y="24" width="30" height="18" rx="8" fill="url(#botVisor)" stroke="rgba(45,212,191,0.2)" strokeWidth="1" />

          {/* Glowing Digital Eyes (With Blinking Animation) */}
          <g className="bot-eyes">
            <ellipse cx="43" cy="33" rx="4" ry="4" fill="url(#botEyeGlow)" className="bot-eye-left" />
            <ellipse cx="57" cy="33" rx="4" ry="4" fill="url(#botEyeGlow)" className="bot-eye-right" />
            {/* Pupil Highlight */}
            <circle cx="43" cy="33" r="1" fill="#ffffff" className="bot-pupil" />
            <circle cx="57" cy="33" r="1" fill="#ffffff" className="bot-pupil" />
          </g>

          {/* Repulsor Port Joint (Underneath Torso) */}
          <rect x="46" y="74" width="8" height="4" rx="1" fill="#475569" />
        </svg>
      </div>

      {/* Slide-out Speech Bubble Button */}
      <div
        className="bot-slide-bubble"
        style={{
          background: 'rgba(13,26,28,0.88)',
          backdropFilter: 'blur(20px)',
          padding: '0.5rem 1rem',
          borderRadius: '30px',
          border: '1px solid rgba(45,212,191,0.3)',
          color: 'var(--text-primary)',
          fontSize: '0.8rem',
          fontWeight: 700,
          fontFamily: 'var(--font-body)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 15px rgba(45,212,191,0.06)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: hovered ? 'translateX(0) scale(1)' : 'translateX(-10px) scale(0.95)',
          opacity: hovered ? 1 : 0,
          pointerEvents: hovered ? 'auto' : 'none',
          whiteSpace: 'nowrap',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)',
        }}
      >
        <span style={{ letterSpacing: '0.03em' }}>Download Resume</span>
        <Download size={14} color="var(--teal-accent)" className="bot-download-icon" style={{ transition: 'transform 0.3s ease' }} />
      </div>

      {/* Advanced CSS Keyframes for High-Fidelity Robot Aerodynamics */}
      <style>{`
        .flying-bot-container {
          animation: organicBotHover 4s ease-in-out infinite;
          user-select: none;
        }

        .flying-bot-container:hover .bot-download-icon {
          transform: translateY(3px);
        }

        /* 🤖 Multi-Axis Organic Float (Simulating high-precision thruster hover) */
        @keyframes organicBotHover {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-12px) rotate(1.5deg); }
          50% { transform: translateY(-4px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.8deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        /* 🪫 Blinking Digital Visor Eyes (Simulates Intelligence/Bleeping) */
        .bot-eyes {
          animation: botVisorBlink 4.5s step-end infinite;
          transform-origin: center;
        }

        @keyframes botVisorBlink {
          0%, 95%, 100% { transform: scaleY(1); }
          97% { transform: scaleY(0.1); }
        }

        /* 🪽 Floating Left Arm Wave */
        .bot-arm-left {
          animation: leftArmWave 1.8s ease-in-out infinite alternate;
        }
        /* 🪽 Floating Right Arm Wave */
        .bot-arm-right {
          animation: rightArmWave 1.8s ease-in-out infinite alternate-reverse;
        }

        @keyframes leftArmWave {
          0% { transform: rotate(-5deg) translateY(-2px); }
          100% { transform: rotate(10deg) translateY(2px); }
        }
        @keyframes rightArmWave {
          0% { transform: rotate(5deg) translateY(-2px); }
          100% { transform: rotate(-10deg) translateY(2px); }
        }

        /* 💥 Repulsor Beam Exhaust Pulse */
        .bot-repulsor-beam {
          animation: pulseRepulsor 0.12s ease-in-out infinite alternate;
        }

        @keyframes pulseRepulsor {
          0% { transform: scaleY(0.85) scaleX(0.95); opacity: 0.8; }
          100% { transform: scaleY(1.25) scaleX(1.05); opacity: 1; }
        }

        /* 💡 Bleeping Beacon Indicator Antenna */
        .bot-antenna-blink {
          animation: antennaPulse 1s ease-in-out infinite alternate;
        }

        @keyframes antennaPulse {
          0% { opacity: 0.4; fill: #0f766e; }
          100% { opacity: 1; fill: var(--teal-accent); }
        }

        /* 🌌 Glowing Energy Core Pulsing */
        .bot-core-pulse {
          animation: corePulse 1.2s ease-in-out infinite alternate;
        }

        @keyframes corePulse {
          0% { opacity: 0.6; r: 5px; }
          100% { opacity: 1; r: 7.5px; }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .flying-bot-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
