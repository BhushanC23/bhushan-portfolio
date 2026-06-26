import { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollVideo } from '../hooks/useScrollVideo';
import Navbar from './Navbar';
import { usePortfolioData } from '../hooks/usePortfolioData';

// Scroll positions and layout are hardcoded; only text is editable via admin
const BASE_OVERLAYS = [
  {
    id: 'overlay-1', phase: 1,
    showAt: 0.0, hideAt: 0.22,
    heading: "Bhushan", headingLine2: "Chaturbhuj",
    sub: "Full Stack Developer.", tag: "MCA Student · LLM AI Intern",
    posStyle: { left: '5%', bottom: '14%' },
  },
  {
    id: 'overlay-2', phase: 2,
    showAt: 0.26, hideAt: 0.48,
    heading: "I Build", headingLine2: "Things.",
    sub: "That live on the web.", tag: "React · Node.js · MongoDB",
    posStyle: { left: '5%', top: '28%' },
  },
  {
    id: 'overlay-3', phase: 3,
    showAt: 0.52, hideAt: 0.74,
    heading: "Built with", headingLine2: "Precision.",
    sub: "MERN · AI/ML · Web AR", tag: null,
    posStyle: { right: '5%', top: 'calc(50% - 70px)' },
    centered: false,
  },
  {
    id: 'overlay-4', phase: 4,
    showAt: 0.78, hideAt: 2.0,
    heading: "Let's Create", headingLine2: "Something Amazing.",
    sub: "Open to exciting opportunities", tag: "Available for work",
    posStyle: { left: '50%', bottom: '8%' },
    centered: true,
  },
];

// Merge Supabase heroText rows into base overlays (text only)
function mergeHeroText(baseOverlays, heroTextRows) {
  if (!heroTextRows?.length) return baseOverlays;
  return baseOverlays.map(overlay => {
    const row = heroTextRows.find(r => r.phase === overlay.phase);
    if (!row) return overlay;
    return {
      ...overlay,
      heading: row.title || overlay.heading,
      headingLine2: row.title2 !== undefined ? (row.title2 || null) : overlay.headingLine2,
      sub: row.subtitle || overlay.sub,
      tag: row.tag !== undefined ? (row.tag || null) : overlay.tag,
    };
  });
}

function TextOverlay({ overlay }) {
  const { heading, headingLine2, sub, tag, id, posStyle, centered, eyebrow } = overlay;
  const isFirst = id === 'overlay-1';
  const isRightAligned = !!posStyle.right;

  return (
    <div
      id={id}
      className={`hero-overlay-card ${isRightAligned ? 'right-aligned-card' : ''}`}
      style={{
        position: 'absolute',
        ...posStyle,
        opacity: isFirst ? 1 : 0,
        transform: centered
          ? `translate(-50%, ${isFirst ? 0 : 20}px)`
          : `translateY(${isFirst ? 0 : 20}px)`,
        transition: 'none',
        zIndex: 10,
        width: centered ? '90%' : 'auto',
        maxWidth: centered ? '90%' : '36%',
        textAlign: centered ? 'center' : (isRightAligned ? 'right' : 'left'),
        pointerEvents: isFirst ? 'auto' : 'none',
      }}
    >
      {/* Eyebrow label */}
      {eyebrow && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '10px',
          fontWeight: 500,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'var(--teal-accent)',
          marginBottom: '0.75rem',
        }}>
          {eyebrow}
        </div>
      )}

      {/* Tag pill */}
      {tag && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.22rem 0.8rem',
          background: 'rgba(45,212,191,0.1)',
          border: '1px solid rgba(45,212,191,0.25)',
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

      {/* Main heading — serif/sans split */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: centered
          ? 'clamp(1.2rem, 2.2vw, 2.2rem)'
          : 'clamp(2rem, 4.2vw, 3.5rem)',
        fontWeight: 700,
        lineHeight: 0.95,
        letterSpacing: '-0.04em',
        color: '#ffffff',
        textShadow: '0 2px 8px rgba(0,0,0,0.85)',
        margin: 0,
        whiteSpace: centered ? 'normal' : 'normal',
      }} className={centered ? 'final-heading' : ''}>
        {heading}
        {headingLine2 && (
          <>
            <br />
            <span style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--cream)',
              letterSpacing: '-0.02em',
            }}>{headingLine2}</span>
          </>
        )}
      </h1>

      {/* Sub text */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.8rem, 1.2vw, 1.0rem)',
        fontWeight: 400,
        color: 'rgba(255,255,255,0.7)',
        marginTop: '0.75rem',
        letterSpacing: '0.02em',
        textShadow: '0 1px 6px rgba(0,0,0,0.8)',
      }} className={centered ? 'final-sub' : ''}>
        {sub}
      </p>
    </div>
  );
}

export default function HeroSection({ images = [] }) {
  const { heroText } = usePortfolioData();
  const textOverlays = mergeHeroText(BASE_OVERLAYS, heroText);

  const updateHeroDomStyles = useCallback((progress) => {
    BASE_OVERLAYS.forEach(overlay => {
      const el = document.getElementById(overlay.id);
      if (!el) return;

      const { showAt, hideAt, centered } = overlay;
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

      el.style.opacity = opacity;
      el.style.transform = centered
        ? `translate(-50%, ${slideY}px)`
        : `translateY(${slideY}px)`;
      el.style.pointerEvents = opacity > 0 ? 'auto' : 'none';
    });

    // Scroll bar
    const scrollBar = document.getElementById('hero-scroll-bar');
    if (scrollBar) scrollBar.style.height = `${progress * 100}%`;

    // Scroll hint
    const scrollHint = document.getElementById('hero-scroll-hint');
    if (scrollHint) scrollHint.style.opacity = progress < 0.06 ? `${1 - progress * 16}` : '0';

    // Progress dots
    const dots = document.querySelectorAll('.hero-progress-dot');
    dots.forEach((dot, i) => {
      const overlay = BASE_OVERLAYS[i];
      if (!overlay) return;
      const isActive = progress >= overlay.showAt && progress < overlay.hideAt;
      dot.style.width = isActive ? '20px' : '6px';
      dot.style.background = isActive ? 'var(--teal-accent)' : 'rgba(45,212,191,0.15)';
    });
  }, []);

  const { canvasRef, containerRef } = useScrollVideo(updateHeroDomStyles, images);

  return (
    <section
      ref={containerRef}
      className="hero-scroll-container"
      style={{ position: 'relative' }}
    >

      {/* Sticky viewport */}
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

        {/* Decorative bg text */}
        <div style={{
          position: 'absolute',
          right: '-2%',
          bottom: '5%',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '20vw',
          color: 'var(--teal-accent)',
          opacity: 0.03,
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 2,
        }}>
          DEVELOPER
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: images.length > 0 ? 1 : 0,
            pointerEvents: 'none',
            display: 'block',
            filter: 'brightness(1.15) contrast(1.05) saturate(1.02)',
          }}
        />

        {/* Dark zones */}
        <div className="left-dark-zone" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(7,13,14,0.72) 0%, rgba(7,13,14,0.4) 30%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div className="bottom-dark-zone" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(7,13,14,0.7) 0%, transparent 30%)',
          pointerEvents: 'none',
        }} />
        <div className="top-dark-zone" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(7,13,14,0.4) 0%, transparent 15%)',
          pointerEvents: 'none',
        }} />

        {/* Navbar */}
        <Navbar />

        {/* Text Overlays */}
        {textOverlays.map(overlay => (
          <TextOverlay key={overlay.id} overlay={overlay} />
        ))}

        {/* Floating ambient dots */}
        {[
          { size: 4, x: '15%', y: '30%', delay: 0 },
          { size: 2, x: '80%', y: '20%', delay: 1 },
          { size: 6, x: '70%', y: '65%', delay: 2 },
          { size: 3, x: '25%', y: '75%', delay: 0.5 },
        ].map((dot, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: dot.x,
            top: dot.y,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            borderRadius: '50%',
            background: 'var(--teal-accent)',
            opacity: 0.3,
            pointerEvents: 'none',
            animation: `float-dot 4s ease-in-out ${dot.delay}s infinite alternate`,
            zIndex: 5,
          }} />
        ))}

        {/* Right-side scroll progress */}
        <div style={{
          position: 'absolute',
          right: '2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 10,
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            writingMode: 'vertical-rl',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Scroll
          </span>
          <div style={{
            width: '1px',
            height: '60px',
            background: 'rgba(45,212,191,0.15)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}>
            <div id="hero-scroll-bar" style={{
              width: '100%',
              height: '0%',
              background: 'var(--teal-accent)',
              transition: 'height 0.1s ease',
            }} />
          </div>
        </div>

        {/* Scroll hint — bottom center, fades immediately */}
        <div id="hero-scroll-hint" style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity: 1,
          zIndex: 10,
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>SCROLL</span>
          <div style={{
            width: '1px',
            height: '24px',
            background: 'var(--teal-accent)',
            animation: 'scroll-line-pulse 2s ease-in-out infinite',
          }} />
        </div>

        {/* Progress dots */}
        <div style={{
          position: 'absolute',
          left: '5%',
          bottom: '1.75rem',
          display: 'flex',
          gap: '0.4rem',
          zIndex: 10,
        }}>
          {BASE_OVERLAYS.map((overlay, i) => {
            const isFirst = i === 0;
            return (
              <div key={i} className="hero-progress-dot" style={{
                width: isFirst ? '20px' : '6px',
                height: '2px',
                borderRadius: '2px',
                background: isFirst ? 'var(--teal-accent)' : 'rgba(45,212,191,0.15)',
                transition: 'all 0.4s ease',
              }} />
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
        @keyframes float-dot {
          from { transform: translateY(0); }
          to { transform: translateY(-15px); }
        }
        @keyframes scroll-line-pulse {
          0% { opacity: 0.3; transform: scaleY(0.5); }
          50% { opacity: 1; transform: scaleY(1); }
          100% { opacity: 0.3; transform: scaleY(0.5); }
        }

        .hero-scroll-container {
          height: 300vh;
        }

        @media (max-width: 768px) {
          .hero-scroll-container {
            height: 135vh !important;
          }
          .left-dark-zone {
            background: linear-gradient(to right, rgba(7,13,14,0.65) 0%, rgba(7,13,14,0.2) 35%, transparent 60%) !important;
          }
          .bottom-dark-zone {
            background: linear-gradient(to top, rgba(7,13,14,0.7) 0%, rgba(7,13,14,0.2) 20%, transparent 35%) !important;
          }
          #overlay-2, #overlay-3 {
            display: none !important;
          }
          #overlay-1 {
            max-width: 80% !important;
            left: 4% !important;
            bottom: 8% !important;
          }
          #overlay-1 h1 {
            font-size: clamp(1.4rem, 6vw, 1.8rem) !important;
            line-height: 1.2 !important;
          }
          #overlay-1 p {
            font-size: 0.82rem !important;
          }
          #overlay-4 {
            width: 92% !important;
            max-width: 92% !important;
            left: 50% !important;
            bottom: 8% !important;
          }
          .final-heading {
            white-space: normal !important;
            font-size: clamp(1.1rem, 4.5vw, 1.6rem) !important;
            line-height: 1.35 !important;
          }
          .final-sub {
            white-space: normal !important;
            font-size: 0.82rem !important;
          }
        }
      `}</style>
    </section>
  );
}
