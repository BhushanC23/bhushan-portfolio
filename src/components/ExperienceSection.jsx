import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BHUSHAN_DATA } from '../data/bhushanData';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────
   Card content — designed for light bg
   ───────────────────────────────────────── */
function ExperienceContent({ item, isMobile }) {
  return (
    <div>
      {item.isCurrent && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.2rem 0.8rem',
          background: '#d4ff3d',
          border: '1.5px solid #111111',
          borderRadius: '20px',
          fontSize: '9px',
          fontWeight: 700,
          color: '#111111',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginBottom: '0.9rem',
          boxShadow: '2px 2px 0px #111111',
        }}>
          <span style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: '#111111',
            animation: 'current-pulse 2s ease-in-out infinite',
          }} />
          Current
        </span>
      )}

      {/* Period label */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.2em',
        color: '#999999',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
      }}>
        {item.period}
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: isMobile ? '1rem' : '1.15rem',
        fontWeight: 800,
        color: '#111111',
        marginBottom: '0.2rem',
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      }}>{item.title}</h3>

      <p style={{
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: isMobile ? '0.9rem' : '1rem',
        color: '#6b6b6b',
        marginBottom: '0.75rem',
      }}>{item.company}</p>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: isMobile ? '0.8rem' : '0.85rem',
        color: '#555555',
        lineHeight: 1.75,
        marginBottom: '0.75rem',
      }}>{item.description}</p>

      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        fontFamily: 'var(--font-body)',
        fontSize: '0.75rem',
        color: '#999999',
        letterSpacing: '0.05em',
        borderTop: '1px solid #e8e8e4',
        paddingTop: '0.6rem',
        width: '100%',
      }}>📍 {item.type}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Timeline Item (left / center dot / right)
   ───────────────────────────────────────── */
function TimelineItem({ item, index, isMobile }) {
  const cardRef = useRef(null);
  const dotRef  = useRef(null);
  const isRight = index % 2 !== 0;

  useEffect(() => {
    const card = cardRef.current;
    const dot  = dotRef.current;
    if (!card || !dot) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(dot,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: dot, start: 'top 88%',
            toggleActions: 'play none none none', once: true,
          }
        }
      );

      gsap.fromTo(card,
        { opacity: 0, y: 30, x: isMobile ? 20 : (isRight ? 25 : -25) },
        {
          opacity: 1, y: 0, x: 0,
          duration: isMobile ? 0.7 : 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: isMobile ? 'top 92%' : 'top 88%',
            toggleActions: 'play none none none', once: true,
          }
        }
      );
    });

    return () => ctx.revert();
  }, [isMobile, isRight]);

  /* White card — thick dark border + shadow for visibility on off-white bg */
  const cardStyle = {
    padding: isMobile ? '1.5rem 1.25rem' : '2rem 1.75rem',
    background: '#ffffff',
    borderRadius: '20px',
    border: '2px solid #111111',
    boxShadow: '4px 4px 0px #111111',
    transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.25s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div className="exp-timeline-item" style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '32px 1fr' : '1fr 40px 1fr',
      gap: isMobile ? '1rem' : '1.5rem',
      alignItems: 'start',
      marginBottom: isMobile ? '1.75rem' : '2.5rem',
    }}>
      {/* ── Left card ── */}
      {!isRight ? (
        <div
          ref={cardRef}
          className="exp-card-left"
          style={cardStyle}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translate(-3px, -3px)';
            e.currentTarget.style.boxShadow = '7px 7px 0px #d4ff3d';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translate(0px, 0px)';
            e.currentTarget.style.boxShadow = '4px 4px 0px #111111';
          }}
        >
          {/* Corner lime triangle accent */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '60px', height: '60px',
            background: '#d4ff3d',
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
            opacity: 0.55,
            pointerEvents: 'none',
          }} />
          <ExperienceContent item={item} isMobile={isMobile} />
        </div>
      ) : (
        <div className="exp-empty-col" />
      )}

      {/* ── Centre dot ── */}
      <div className="exp-dot-col" style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', paddingTop: '1.5rem'
      }}>
        <div ref={dotRef} style={{
          width: '14px', height: '14px', borderRadius: '50%',
          background: item.isCurrent ? '#d4ff3d' : '#ffffff',
          border: '2.5px solid #111111',
          flexShrink: 0, position: 'relative', zIndex: 1,
          boxShadow: item.isCurrent ? '0 0 0 4px rgba(212,255,61,0.25)' : 'none',
        }}>
          {item.isCurrent && (
            <div style={{
              position: 'absolute', inset: '-6px', borderRadius: '50%',
              border: '2px solid #d4ff3d',
              animation: 'ping 2s ease-out infinite',
            }} />
          )}
        </div>
      </div>

      {/* ── Right card ── */}
      {isRight ? (
        <div
          ref={cardRef}
          className="exp-card-right"
          style={cardStyle}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translate(-3px, -3px)';
            e.currentTarget.style.boxShadow = '7px 7px 0px #d4ff3d';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translate(0px, 0px)';
            e.currentTarget.style.boxShadow = '4px 4px 0px #111111';
          }}
        >
          {/* Corner lime triangle accent */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '60px', height: '60px',
            background: '#d4ff3d',
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
            opacity: 0.55,
            pointerEvents: 'none',
          }} />
          <ExperienceContent item={item} isMobile={isMobile} />
        </div>
      ) : (
        <div className="exp-empty-col" />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   Section export
   ───────────────────────────────────────── */
export default function ExperienceSection() {
  const sectionRef = useRef(null);
  const lineRef    = useRef(null);
  const headerRef  = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1, duration: 1.5, ease: 'power2.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%', end: 'bottom 80%', scrub: 0.5,
            }
          }
        );
      }
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current, start: 'top 85%',
              toggleActions: 'play none none none', once: true,
            }
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} style={{
      background: '#f8f8f5',
      padding: '10rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ── Deco number ── */}


      {/* ════════════════════════════════════
          FLOATING BACKGROUND DECORATION
          ════════════════════════════════════ */}

      {/* Lime glow circle — top right */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '420px', height: '420px',
        borderRadius: '50%',
        border: '2px solid #d4ff3d',
        opacity: 0.2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '-50px', right: '-50px',
        width: '260px', height: '260px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,255,61,0.14) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Smaller circle — bottom left */}
      <div style={{
        position: 'absolute', bottom: '-60px', left: '-60px',
        width: '250px', height: '250px',
        borderRadius: '50%',
        border: '1.5px solid rgba(17,17,17,0.1)',
        opacity: 0.6, pointerEvents: 'none',
      }} />

      {/* Floating "TIMELINE" pill tag — top left */}
      <div style={{
        position: 'absolute', top: '7%', left: '5%',
        padding: '0.28rem 0.85rem',
        background: '#d4ff3d',
        border: '1.5px solid #111111',
        borderRadius: '4px',
        boxShadow: '2px 2px 0px #111111',
        fontFamily: 'var(--font-body)',
        fontSize: '9px', fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: '#111111', opacity: 0.65, pointerEvents: 'none',
      }}>TIMELINE</div>

      {/* Dot grid — bottom left */}
      <div style={{
        position: 'absolute', bottom: '8%', left: '3%',
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 12px)',
        gridTemplateRows: 'repeat(6, 12px)',
        gap: '8px', opacity: 0.12, pointerEvents: 'none',
      }}>
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#111111' }} />
        ))}
      </div>

      {/* Dot grid — top right corner interior */}
      <div style={{
        position: 'absolute', top: '14%', right: '5%',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 12px)',
        gridTemplateRows: 'repeat(5, 12px)',
        gap: '8px', opacity: 0.09, pointerEvents: 'none',
      }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#111111' }} />
        ))}
      </div>

      {/* Floating rotated lime rectangle — bottom right */}
      <div style={{
        position: 'absolute', bottom: '18%', right: '5%',
        width: '72px', height: '72px',
        border: '2px solid #d4ff3d',
        borderRadius: '10px',
        opacity: 0.28, transform: 'rotate(15deg)',
        pointerEvents: 'none',
      }} />

      {/* Vertical editorial rule — far left */}
      <div style={{
        position: 'absolute', top: '18%', left: '2%',
        width: '1px', height: '62%',
        background: 'linear-gradient(to bottom, transparent, rgba(17,17,17,0.1) 30%, rgba(17,17,17,0.1) 70%, transparent)',
        pointerEvents: 'none',
      }} />

      {/* Diagonal accent line — top left */}
      <div style={{
        position: 'absolute', top: '10%', left: '-40px',
        width: '200px', height: '1.5px',
        background: 'linear-gradient(90deg, transparent, rgba(17,17,17,0.2))',
        transform: 'rotate(-28deg)',
        pointerEvents: 'none',
      }} />

      {/* ════════════════════════════════════
          SECTION CONTENT
          ════════════════════════════════════ */}
      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{
          marginBottom: '4rem',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.4rem',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.9rem',
            background: 'rgba(17,17,17,0.06)',
            border: '1px solid rgba(17,17,17,0.15)',
            borderRadius: '100px',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.55)',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'rgba(17,17,17,0.4)', flexShrink: 0 }} />
            Experience & Roles
          </div>
          <h2 className="heading-display" style={{ marginTop: '0.2rem', textAlign: 'center', color: '#111111' }}>
            Experience &amp;{' '}
            <span className="serif-accent">Roles</span>
          </h2>
        </div>

        {/* Timeline container */}
        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
          {/* Vertical line — visible on off-white bg */}
          <div
            ref={lineRef}
            className="exp-timeline-line"
            style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0,
              width: '2px',
              background: 'linear-gradient(to bottom, transparent, rgba(17,17,17,0.2) 10%, rgba(17,17,17,0.2) 90%, transparent)',
              transform: 'translateX(-50%)',
            }}
          />

          {BHUSHAN_DATA.experience.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} isMobile={isMobile} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes current-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        @media (max-width: 768px) {
          #experience { padding: 6rem 0 !important; }
          .exp-timeline-item {
            grid-template-columns: 32px 1fr !important;
            gap: 1rem !important;
            margin-bottom: 1.75rem !important;
          }
          .exp-empty-col { display: none !important; }
          .exp-card-left, .exp-card-right {
            display: block !important;
            grid-column: 2 !important;
            grid-row: 1 !important;
          }
          .exp-dot-col {
            grid-column: 1 !important;
            grid-row: 1 !important;
            padding-top: 1.25rem !important;
          }
          .exp-timeline-line { left: 16px !important; }
        }
      `}</style>
    </section>
  );
}
