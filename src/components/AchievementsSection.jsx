import { useRef, useEffect } from 'react';
import { BHUSHAN_DATA } from '../data/bhushanData';

export default function AchievementsSection() {
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
    });
  }, []);

  return (
    <section id="achievements" style={{
      background: 'var(--teal-dark)',
      padding: '7rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="grid-texture" style={{
        position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', justifyContent: 'center' }}>
            <div style={{ width: '30px', height: '1.5px', background: 'var(--gold-accent)' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--gold-accent)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>Recognition</span>
            <div style={{ width: '30px', height: '1.5px', background: 'var(--gold-accent)' }} />
          </div>
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
            Achievements &<br />
            <span style={{
              background: 'linear-gradient(135deg, #c9a84c, #f5c518)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Certifications.</span>
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {BHUSHAN_DATA.achievements.map((item, i) => (
            <div
              key={i}
              ref={el => cardsRef.current[i] = el}
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
                padding: '1.5rem',
                background: 'rgba(13,26,28,0.6)',
                borderRadius: '14px',
                border: '1px solid rgba(201,168,76,0.12)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
                e.currentTarget.style.background = 'rgba(13,26,28,0.9)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(201,168,76,0.06)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.12)';
                e.currentTarget.style.background = 'rgba(13,26,28,0.6)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>{item.icon}</div>
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.25rem',
                  lineHeight: 1.4,
                }}>{item.title}</h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        /* === ACHIEVEMENTS RESPONSIVE === */
        @media (max-width: 768px) {
          #achievements {
            padding: 4rem 0 !important;
          }
          #achievements .container-xl > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          #achievements {
            padding: 3rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
