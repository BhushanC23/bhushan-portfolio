import { useEffect, useRef } from 'react';
import { BHUSHAN_DATA } from '../data/bhushanData';

function TimelineItem({ item, index }) {
  const itemRef = useRef(null);

  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;

    const isRight = index % 2 === 0;
    el.style.opacity = '0';
    el.style.transform = `translateX(${isRight ? '-30px' : '30px'})`;
    el.style.transition = `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateX(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div ref={itemRef} className="exp-timeline-item" style={{
      display: 'grid',
      gridTemplateColumns: '1fr 40px 1fr',
      gap: '1.5rem',
      alignItems: 'start',
      marginBottom: '2.5rem',
    }}>
      {/* Left side */}
      {index % 2 === 0 ? (
        <div className="exp-card-left" style={{
          padding: '1.75rem',
          background: 'var(--teal-mid)',
          borderRadius: '16px',
          border: '1px solid rgba(45,212,191,0.12)',
          borderLeft: '3px solid var(--teal-accent)',
          transition: 'all 0.3s ease',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(45,212,191,0.3)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(45,212,191,0.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(45,212,191,0.12)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <ExperienceContent item={item} />
        </div>
      ) : <div className="exp-empty-col" />}

      {/* Center dot */}
      <div className="exp-dot-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1.5rem' }}>
        <div style={{
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: item.isCurrent ? 'var(--teal-accent)' : 'var(--teal-mid)',
          border: '2px solid var(--teal-accent)',
          boxShadow: item.isCurrent ? '0 0 15px rgba(45,212,191,0.5)' : 'none',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}>
          {item.isCurrent && (
            <div style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              border: '2px solid rgba(45,212,191,0.3)',
              animation: 'ping 2s ease-out infinite',
            }} />
          )}
        </div>
      </div>

      {/* Right side */}
      {index % 2 !== 0 ? (
        <div className="exp-card-right" style={{
          padding: '1.75rem',
          background: 'var(--teal-mid)',
          borderRadius: '16px',
          border: '1px solid rgba(45,212,191,0.12)',
          borderLeft: '3px solid var(--gold-accent)',
          transition: 'all 0.3s ease',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(201,168,76,0.06)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(45,212,191,0.12)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <ExperienceContent item={item} gold />
        </div>
      ) : <div className="exp-empty-col" />}
    </div>
  );
}

function ExperienceContent({ item, gold }) {
  return (
    <div>
      {item.isCurrent && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '0.2rem 0.7rem',
          background: gold ? 'rgba(201,168,76,0.1)' : 'rgba(45,212,191,0.1)',
          border: `1px solid ${gold ? 'rgba(201,168,76,0.3)' : 'rgba(45,212,191,0.3)'}`,
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: gold ? 'var(--gold-accent)' : 'var(--teal-accent)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: gold ? 'var(--gold-accent)' : 'var(--teal-accent)',
          }} />
          Current
        </span>
      )}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '0.25rem',
      }}>{item.title}</h3>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.95rem',
        fontWeight: 600,
        color: gold ? 'var(--gold-accent)' : 'var(--teal-accent)',
        marginBottom: '0.3rem',
      }}>{item.company}</p>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}>📍 {item.type}</span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}>🗓 {item.period}</span>
      </div>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        color: 'rgba(240,244,244,0.65)',
        lineHeight: 1.6,
      }}>{item.description}</p>
    </div>
  );
}

export default function ExperienceSection() {
  return (
    <section id="experience" style={{
      background: 'var(--bg-primary)',
      padding: '7rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '40%',
        height: '100%',
        background: 'radial-gradient(ellipse at right, rgba(45,212,191,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '30px', height: '1.5px', background: 'var(--teal-accent)' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--teal-accent)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>Career</span>
            <div style={{ width: '30px', height: '1.5px', background: 'var(--teal-accent)' }} />
          </div>
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
            Experience &<br />
            <span className="animated-underline">Roles.</span>
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto' }}>
          {/* Vertical line */}
          <div className="exp-timeline-line" style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'linear-gradient(to bottom, transparent, rgba(45,212,191,0.3) 10%, rgba(45,212,191,0.3) 90%, transparent)',
            transform: 'translateX(-50%)',
          }} />

          {BHUSHAN_DATA.experience.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        /* === EXPERIENCE TIMELINE RESPONSIVE === */
        @media (max-width: 768px) {
          #experience {
            padding: 4rem 0 !important;
          }
          /* Force single-column on all timeline items */
          .exp-timeline-item {
            grid-template-columns: 32px 1fr !important;
            gap: 1rem !important;
            margin-bottom: 1.75rem !important;
          }
          /* Hide the empty side placeholder */
          .exp-empty-col {
            display: none !important;
          }
          /* Show all cards on the right side only */
          .exp-card-left,
          .exp-card-right {
            display: block !important;
            grid-column: 2 !important;
          }
          /* Reorder: dot always col 1, card always col 2 */
          .exp-dot-col {
            grid-column: 1 !important;
            padding-top: 1.25rem !important;
          }
          /* Move vertical line to left */
          .exp-timeline-line {
            left: 15px !important;
          }
        }
        @media (max-width: 480px) {
          #experience .container-xl {
            padding: 0 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
