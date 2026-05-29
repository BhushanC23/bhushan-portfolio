import { useState, useEffect, useRef } from 'react';
import { useScrollVideo } from '../hooks/useScrollVideo';
import Navbar from './Navbar';
import { ChevronDown } from 'lucide-react';

// Each overlay has its own unique position to create visual variety
// Face is always center-right in the video, so text stays LEFT side (max 42% width)
const TEXT_OVERLAYS = [
  {
    id: 'overlay-1',
    showAt: 0.0,
    hideAt: 0.22,
    heading: "Bhushan",
    headingLine2: "Chaturbhuj",
    sub: "Full Stack Developer.",
    tag: "MCA Student · LLM AI Intern",
    // Bottom-left: face is upper-center in this frame
    posStyle: { left: '5%', bottom: '14%' },
  },
  {
    id: 'overlay-2',
    showAt: 0.26,
    hideAt: 0.48,
    heading: "I Build",
    headingLine2: "Things.",
    sub: "That live on the web.",
    tag: "React · Node.js · MongoDB",
    // Upper-left: face tends to be center in this frame
    posStyle: { left: '5%', top: '28%' },
  },
  {
    id: 'overlay-3',
    showAt: 0.52,
    hideAt: 0.74,
    heading: "Built with",
    headingLine2: "Precision.",
    sub: "MERN · AI/ML · Web AR",
    tag: null,
    // Right-center: vertically middle of screen, right side
    posStyle: { right: '5%', top: 'calc(50% - 70px)' },
    centered: false,
  },
  {
    id: 'overlay-4',
    showAt: 0.78,
    hideAt: 2.0,      // stays visible through remainder of scroll
    heading: "Let's Create Something Amazing.",
    headingLine2: null,
    sub: "Open to exciting opportunities",
    tag: "Available for work",
    // Mathematically centered horizontally & pushed lower to prevent overlapping face/body
    posStyle: { left: '50%', bottom: '8%' },
    centered: true,
  },
];

function TextOverlay({ overlay, progress }) {
  const { showAt, hideAt, heading, headingLine2, sub, tag, id, posStyle, centered } = overlay;

  const isVisible = progress >= showAt && progress < hideAt;

  let opacity = 0;
  let slideY = 20;
  if (isVisible) {
    const fadeInEnd = showAt + 0.05;
    const fadeOutStart = hideAt - 0.06;

    if (progress < fadeInEnd) {
      opacity = (progress - showAt) / 0.05;
    } else if (progress > fadeOutStart) {
      opacity = 1 - (progress - fadeOutStart) / 0.06;
    } else {
      opacity = 1;
    }
    opacity = Math.min(Math.max(opacity, 0), 1);
    slideY = (1 - opacity) * 20;
  }

  const isRightAligned = !!posStyle.right;

  return (
    <div
      id={id}
      className={`hero-overlay-card ${isRightAligned ? 'right-aligned-card' : ''}`}
      style={{
        position: 'absolute',
        ...posStyle,
        opacity,
        transform: centered 
          ? `translate(-50%, ${slideY}px)` 
          : `translateY(${slideY}px)`,
        transition: 'none',
        zIndex: 10,
        width: centered ? '90%' : 'auto',
        maxWidth: centered ? '90%' : '42%',
        textAlign: centered ? 'center' : (isRightAligned ? 'right' : 'left'),
        pointerEvents: opacity > 0 ? 'auto' : 'none',
      }}
    >
      {/* Tag pill */}
      {tag && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.22rem 0.8rem',
          background: 'rgba(45,212,191,0.1)',
          border: '1px solid rgba(45,212,191,0.35)',
          borderRadius: '50px',
          marginBottom: '0.75rem',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--teal-accent)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {tag}
          </span>
        </div>
      )}

      {/* Main heading */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: centered
          ? 'clamp(1.2rem, 2.2vw, 2.2rem)'
          : 'clamp(2rem, 4.5vw, 4.5rem)',
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: '-0.02em',
        color: '#ffffff',
        textShadow: '0 2px 8px rgba(0,0,0,0.85)',
        margin: 0,
        whiteSpace: centered ? 'nowrap' : 'normal',
      }} className={centered ? 'final-heading' : ''}>
        {id === 'overlay-4' ? (
          <>
            <span className="desktop-only-inline">Let's Create Something Amazing.</span>
            <span className="mobile-only-block">
              Let's Create Something
              <br />
              <span className="animated-underline">Amazing.</span>
            </span>
          </>
        ) : (
          <>
            {heading}
            {headingLine2 && (
              <>
                <br />
                <span className="animated-underline">{headingLine2}</span>
              </>
            )}
          </>
        )}
      </h1>

      {/* Sub text */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.8rem, 1.2vw, 1.0rem)',
        fontWeight: 500,
        color: 'rgba(255,255,255,0.92)',
        marginTop: '0.5rem',
        letterSpacing: '0.03em',
        textShadow: '0 1px 6px rgba(0,0,0,0.8)',
        whiteSpace: 'nowrap',
      }} className={centered ? 'final-sub' : ''}>
        {sub}
      </p>
    </div>
  );
}

export default function HeroSection() {
  const { videoRef, containerRef } = useScrollVideo();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = container.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / containerHeight, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      style={{ height: '300vh', position: 'relative' }}
    >
      {/* Sticky viewport container */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}>

        {/* Background fallback */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, #070d0e 0%, #0a1f22 50%, #0d1a1c 100%)',
        }} />

        {/* Scroll Video */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsLoaded(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        >
          <source src="/bhushan.mp4" type="video/mp4" />
        </video>

        {/* Left dark zone — keeps text readable over video */}
        <div className="left-dark-zone" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(7,13,14,0.92) 0%, rgba(7,13,14,0.75) 30%, rgba(7,13,14,0.3) 55%, transparent 75%)',
          pointerEvents: 'none',
        }} />
        {/* Bottom dark zone */}
        <div className="bottom-dark-zone" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(7,13,14,0.9) 0%, rgba(7,13,14,0.5) 20%, transparent 45%)',
          pointerEvents: 'none',
        }} />
        {/* Top vignette */}
        <div className="top-dark-zone" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(7,13,14,0.6) 0%, transparent 20%)',
          pointerEvents: 'none',
        }} />

        {/* Grid texture */}
        <div className="grid-texture" style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          pointerEvents: 'none',
        }} />

        {/* Navbar */}
        <Navbar />

        {/* Text Overlays */}
        {TEXT_OVERLAYS.map(overlay => (
          <TextOverlay
            key={overlay.id}
            overlay={overlay}
            progress={scrollProgress}
          />
        ))}

        {/* Right-side scroll progress bar */}
        <div style={{
          position: 'absolute',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 10,
        }}>
          <div style={{
            width: '2px',
            height: '70px',
            background: 'rgba(45,212,191,0.15)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: '100%',
              height: `${scrollProgress * 100}%`,
              background: 'var(--teal-accent)',
              transition: 'height 0.1s ease',
            }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.58rem',
            color: 'var(--text-muted)',
            writingMode: 'vertical-rl',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}>
            Scroll
          </span>
        </div>

        {/* Scroll hint — bottom right, fades immediately */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          right: '4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          opacity: scrollProgress < 0.06 ? 1 - scrollProgress * 16 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: 10,
        }}>
          <ChevronDown size={14} color="var(--teal-accent)" style={{ animation: 'bounce 2s infinite' }} />
        </div>

        {/* Progress dots — bottom left */}
        <div style={{
          position: 'absolute',
          left: '5%',
          bottom: '1.75rem',
          display: 'flex',
          gap: '0.4rem',
          zIndex: 10,
        }}>
          {TEXT_OVERLAYS.map((overlay, i) => {
            const isActive = scrollProgress >= overlay.showAt && scrollProgress < overlay.hideAt;
            return (
              <div key={i} style={{
                width: isActive ? '20px' : '6px',
                height: '2.5px',
                borderRadius: '2px',
                background: isActive ? 'var(--teal-accent)' : 'rgba(45,212,191,0.2)',
                transition: 'all 0.4s ease',
              }} />
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        
        .mobile-only-block {
          display: none;
        }
        .desktop-only-inline {
          display: inline;
        }

        @media (max-width: 768px) {
          .left-dark-zone {
            background: linear-gradient(to right, rgba(7,13,14,0.75) 0%, rgba(7,13,14,0.3) 30%, transparent 60%) !important;
          }
          .bottom-dark-zone {
            background: linear-gradient(to top, rgba(7,13,14,0.85) 0%, rgba(7,13,14,0.4) 15%, transparent 32%) !important;
          }
          
          .mobile-only-block {
            display: block;
          }
          .desktop-only-inline {
            display: none;
          }
          
          #overlay-2, #overlay-3 {
            display: none !important;
          }
          #overlay-1 {
            max-width: 80% !important;
            left: 4% !important;
            bottom: 8% !important; /* Pushed lower on mobile to match Overlay 4! */
          }
          #overlay-1 h1 {
            font-size: clamp(1.4rem, 6vw, 1.8rem) !important; /* Reduced mobile size! */
            line-height: 1.2 !important;
          }
          #overlay-1 p {
            font-size: 0.82rem !important; /* Reduced subtext mobile size! */
          }
          #overlay-4 {
            width: 92% !important;
            max-width: 92% !important;
            left: 50% !important;
            bottom: 8% !important; /* Pushed lower on mobile view too! */
          }
          .final-heading {
            white-space: normal !important;
            font-size: clamp(1.1rem, 4.5vw, 1.6rem) !important; /* Reduced mobile size! */
            line-height: 1.35 !important;
          }
          .final-sub {
            white-space: normal !important;
            font-size: 0.82rem !important; /* Reduced subtext mobile size! */
          }
        }
      `}</style>
    </section>
  );
}
