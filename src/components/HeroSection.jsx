import { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollVideo } from '../hooks/useScrollVideo';
import Navbar from './Navbar';
import { ChevronDown } from 'lucide-react';
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
    heading: "Let's Create Something Amazing.", headingLine2: null,
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
  const { heading, headingLine2, sub, tag, id, posStyle, centered } = overlay;

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
        maxWidth: centered ? '90%' : '42%',
        textAlign: centered ? 'center' : (isRightAligned ? 'right' : 'left'),
        pointerEvents: isFirst ? 'auto' : 'none',
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
  const { heroText } = usePortfolioData();

  // Merge Supabase hero text into base overlays (text only, positions unchanged)
  const textOverlays = mergeHeroText(BASE_OVERLAYS, heroText);

  // High-performance direct DOM updates to achieve 120fps fluid scrolling with ZERO React overhead!
  const updateHeroDomStyles = useCallback((progress) => {
    // 1. Overlays
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

    // 2. Right-side scroll progress bar
    const scrollBar = document.getElementById('hero-scroll-bar');
    if (scrollBar) {
      scrollBar.style.height = `${progress * 100}%`;
    }

    // 3. Scroll hint (ChevronDown)
    const scrollHint = document.getElementById('hero-scroll-hint');
    if (scrollHint) {
      scrollHint.style.opacity = progress < 0.06 ? `${1 - progress * 16}` : '0';
    }

    // 4. Progress dots (bottom-left)
    const dots = document.querySelectorAll('.hero-progress-dot');
    dots.forEach((dot, i) => {
      const overlay = BASE_OVERLAYS[i];
      if (!overlay) return;
      const isActive = progress >= overlay.showAt && progress < overlay.hideAt;
      dot.style.width = isActive ? '20px' : '6px';
      dot.style.background = isActive ? 'var(--teal-accent)' : 'rgba(45,212,191,0.2)';
    });
  }, []);

  const [images, setImages] = useState([]);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [preloaderActive, setPreloaderActive] = useState(true);

  const { canvasRef, containerRef } = useScrollVideo(updateHeroDomStyles, images);

  // ─── PROGRESSIVE LOADER ────────────────────────────────────────────────────
  // Show the site the INSTANT frame-001 is ready (usually < 500ms on cache).
  // Remaining 93 frames load silently in background. Canvas skips null slots.
  useEffect(() => {
    const FRAME_COUNT = 94;
    const slots = new Array(FRAME_COUNT).fill(null); // pre-allocated, index = frame-1
    let loadedCount = 0;
    let firstFrameShown = false;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/sequence/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;

      const done = (idx) => () => {
        slots[idx - 1] = img;
        loadedCount++;

        if (idx === 1 && !firstFrameShown) {
          // ⚡ Frame 001 ready → dismiss preloader immediately!
          firstFrameShown = true;
          setImages([...slots]);
          setVideoLoaded(true);
          setLoadingProgress(1);
        } else {
          setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
          // Refresh canvas image array every 10 frames (avoid thrashing)
          if (loadedCount % 10 === 0 || loadedCount === FRAME_COUNT) {
            setImages([...slots]);
          }
        }
      };

      img.onload = done(i);
      img.onerror = done(i);
    }
  }, []);

  // Force-render Overlay-1 the moment preloader finishes
  useEffect(() => {
    if (videoLoaded) {
      const t = setTimeout(() => updateHeroDomStyles(0), 50);
      return () => clearTimeout(t);
    }
  }, [videoLoaded, updateHeroDomStyles]);



  return (
    <section
      ref={containerRef}
      className="hero-scroll-container"
      style={{ position: 'relative' }}
    >
      {/* Cinematic 0-100% Preloader Overlay */}
      {preloaderActive && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#070d0e',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: videoLoaded ? 0 : 1,
          transition: 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
          pointerEvents: videoLoaded ? 'none' : 'auto',
        }}
        onTransitionEnd={() => {
          if (videoLoaded) {
            setPreloaderActive(false);
          }
        }}
        >
          {/* Centered Large Futuristic Percentage Counter */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {/* Huge, thin premium percentage number */}
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 12vw, 10rem)',
              fontWeight: 200,
              color: '#ffffff',
              letterSpacing: '-0.05em',
              lineHeight: 0.9,
              textShadow: '0 4px 20px rgba(45,212,191,0.15)',
              userSelect: 'none',
            }}>
              {loadingProgress.toString().padStart(2, '0')}
            </span>

            {/* Micro-meter track */}
            <div style={{
              marginTop: '1.5rem',
              width: '160px',
              height: '1px',
              background: 'rgba(255,255,255,0.06)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--teal-accent), var(--gold-accent))',
                boxShadow: '0 0 8px var(--teal-accent)',
                transition: 'width 0.1s ease-out',
              }} />
            </div>

            {/* Subtle, premium metadata subtext */}
            <span style={{
              marginTop: '1.25rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.62rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.38)',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              animation: 'subtle-pulse 2s ease-in-out infinite',
            }}>
              Initializing Portfolio
            </span>
          </div>

          {/* Inline animations for premium minimal preloader */}
          <style>{`
            @keyframes subtle-pulse {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 0.85; }
            }
          `}</style>
        </div>
      )}

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

        {/* Scroll Canvas - Hardware-accelerated 120fps GPU frames drawing */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: videoLoaded ? 1 : 0,
            pointerEvents: 'none',
            display: 'block',
            filter: 'brightness(1.15) contrast(1.05) saturate(1.02)',
          }}
        />

        {/* Left dark zone — keeps text readable over video */}
        <div className="left-dark-zone" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(7,13,14,0.72) 0%, rgba(7,13,14,0.4) 30%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        {/* Bottom dark zone */}
        <div className="bottom-dark-zone" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(7,13,14,0.7) 0%, transparent 30%)',
          pointerEvents: 'none',
        }} />
        {/* Top vignette */}
        <div className="top-dark-zone" style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(7,13,14,0.4) 0%, transparent 15%)',
          pointerEvents: 'none',
        }} />

        {/* Grid texture */}
        <div className="grid-texture" style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          pointerEvents: 'none',
        }} />

        {/* Navbar */}
        <Navbar />

        {/* Text Overlays */}
        {textOverlays.map(overlay => (
          <TextOverlay
            key={overlay.id}
            overlay={overlay}
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
            <div id="hero-scroll-bar" style={{
              width: '100%',
              height: '0%',
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
        <div id="hero-scroll-hint" style={{
          position: 'absolute',
          bottom: '2rem',
          right: '4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          opacity: 1,
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
          {BASE_OVERLAYS.map((overlay, i) => {
            const isFirst = i === 0;
            return (
              <div key={i} className="hero-progress-dot" style={{
                width: isFirst ? '20px' : '6px',
                height: '2.5px',
                borderRadius: '2px',
                background: isFirst ? 'var(--teal-accent)' : 'rgba(45,212,191,0.2)',
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
