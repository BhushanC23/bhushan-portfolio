import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BHUSHAN_DATA } from '../data/bhushanData';

gsap.registerPlugin(ScrollTrigger);

function ExperienceContent({ item, gold, isMobile }) {
  return (
    <div>
      {item.isCurrent && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.18rem 0.65rem',
          background: gold ? 'rgba(201,168,76,0.1)' : 'rgba(45,212,191,0.1)',
          border: `1px solid ${gold ? 'rgba(201,168,76,0.3)' : 'rgba(45,212,191,0.3)'}`,
          borderRadius: '20px',
          fontSize: '10px',
          fontWeight: 600,
          color: gold ? 'var(--gold-accent)' : 'var(--teal-accent)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          <span style={{
            width: '5px', height: '5px', borderRadius: '50%',
            background: gold ? 'var(--gold-accent)' : 'var(--teal-accent)',
            animation: 'current-pulse 2s ease-in-out infinite',
          }} />
          Current
        </span>
      )}

      {/* Year / period label */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.2em',
        color: gold ? 'var(--gold-accent)' : 'var(--teal-accent)',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
      }}>
        {item.period}
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: isMobile ? '1rem' : '1.1rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '0.25rem',
        letterSpacing: '-0.01em',
      }}>{item.title}</h3>

      <p style={{
        fontFamily: 'var(--font-serif)',
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: isMobile ? '0.9rem' : '1rem',
        color: 'var(--cream)',
        marginBottom: '0.4rem',
      }}>{item.company}</p>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: isMobile ? '0.8rem' : '0.85rem',
        color: 'var(--text-muted)',
        lineHeight: 1.7,
        marginBottom: '0.5rem',
      }}>{item.description}</p>

      <span style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.75rem',
        color: 'var(--text-dim)',
        letterSpacing: '0.05em',
      }}>📍 {item.type}</span>
    </div>
  );
}

function TimelineItem({ item, index, isMobile }) {
  const cardRef = useRef(null);
  const dotRef = useRef(null);
  const isRight = index % 2 !== 0;

  useEffect(() => {
    const card = cardRef.current;
    const dot = dotRef.current;
    if (!card || !dot) return;

    const ctx = gsap.context(() => {
      // 1. Animate the dot pop in with spring physics
      gsap.fromTo(dot,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: dot,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );

      // 2. Animate the card vertical scan and horizontal glide
      if (isMobile) {
        // Mobile only: Smooth entry from the right side (x: 40 -> 0)
        gsap.fromTo(card,
          {
            opacity: 0,
            x: 40,
            y: 0,
            clipPath: 'none',
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.95,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      } else {
        // Desktop: Standard premium vertical scan and horizontal glide
        gsap.fromTo(card,
          {
            opacity: 0,
            y: 40,
            x: isRight ? 30 : -30,
            clipPath: 'inset(0 0 100% 0)'
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 82%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, [isMobile, isRight]);

  const cardStyle = {
    padding: isMobile ? '1.25rem' : '1.75rem',
    background: 'var(--card-bg)',
    borderRadius: '12px',
    border: '1px solid var(--card-border)',
    borderLeft: `2px solid ${isRight ? 'var(--gold-accent)' : 'var(--teal-accent)'}`,
    backdropFilter: 'blur(16px)',
    boxShadow: '0 0 0 1px var(--card-border), 0 20px 40px rgba(0,0,0,0.25)',
    transition: 'all 0.3s ease',
  };

  return (
    <div className="exp-timeline-item" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 40px 1fr',
      gap: '1.5rem',
      alignItems: 'start',
      marginBottom: '2.5rem',
    }}>
      {/* Left side */}
      {!isRight ? (
        <div
          ref={cardRef}
          className="exp-card-left"
          style={cardStyle}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(45,212,191,0.3)';
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(45,212,191,0.15), 0 20px 40px rgba(0,0,0,0.35)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--card-border)';
            e.currentTarget.style.boxShadow = '0 0 0 1px var(--card-border), 0 20px 40px rgba(0,0,0,0.25)';
          }}
        >
          <ExperienceContent item={item} gold={false} isMobile={isMobile} />
        </div>
      ) : (
        <div className="exp-empty-col" />
      )}

      {/* Center dot */}
      <div className="exp-dot-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1.5rem' }}>
        <div
          ref={dotRef}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: item.isCurrent ? 'var(--teal-accent)' : 'var(--bg-primary)',
            border: `2px solid ${isRight ? 'var(--gold-accent)' : 'var(--teal-accent)'}`,
            flexShrink: 0,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {item.isCurrent && (
            <div style={{
              position: 'absolute',
              inset: '-5px',
              borderRadius: '50%',
              border: '2px solid rgba(45,212,191,0.3)',
              animation: 'ping 2s ease-out infinite',
            }} />
          )}
        </div>
      </div>

      {/* Right side */}
      {isRight ? (
        <div
          ref={cardRef}
          className="exp-card-right"
          style={{ ...cardStyle, borderLeft: '2px solid var(--gold-accent)' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
            e.currentTarget.style.boxShadow = '0 0 0 1px rgba(201,168,76,0.1), 0 20px 40px rgba(0,0,0,0.35)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--card-border)';
            e.currentTarget.style.boxShadow = '0 0 0 1px var(--card-border), 0 20px 40px rgba(0,0,0,0.25)';
          }}
        >
          <ExperienceContent item={item} gold={true} isMobile={isMobile} />
        </div>
      ) : (
        <div className="exp-empty-col" />
      )}
    </div>
  );
}

export default function ExperienceSection() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const headerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the timeline vertical line drawing
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 80%',
              scrub: 0.5,
            }
          }
        );
      }

      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} style={{
      background: 'var(--bg-primary)',
      padding: '10rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative number */}
      <div className="section-deco-number" style={{ right: '-2%', top: '-5%' }}>03</div>

      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '40%', height: '100%',
        background: 'radial-gradient(ellipse at right, rgba(45,212,191,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <h2 className="heading-display">
            Experience &amp;{' '}
            <span className="serif-accent">Roles</span>
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="exp-timeline-line"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'linear-gradient(to bottom, transparent, var(--teal-accent) 10%, var(--teal-accent) 90%, transparent)',
              transform: 'translateX(-50%)',
              opacity: 0.3,
            }}
          />

          {BHUSHAN_DATA.experience.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} isMobile={isMobile} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes current-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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
