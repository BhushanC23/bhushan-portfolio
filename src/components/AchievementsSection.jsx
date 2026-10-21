import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BHUSHAN_DATA } from '../data/bhushanData';
import { usePortfolioData } from '../hooks/usePortfolioData';

gsap.registerPlugin(ScrollTrigger);

export default function AchievementsSection() {
  const { achievements } = usePortfolioData();
  const achievementsList = achievements && achievements.length > 0 ? achievements : BHUSHAN_DATA.achievements;
  const featuredAchievement = achievementsList[0] || BHUSHAN_DATA.achievements[0];
  const otherAchievements = achievementsList.slice(1).length >= 4 ? achievementsList.slice(1) : BHUSHAN_DATA.achievements.slice(1);
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 92%',
              once: true,
            }
          }
        );
      }

      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: isMobile ? 0 : i * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              once: true,
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section id="achievements" ref={sectionRef} style={{
      background: '#ffffff',
      padding: isMobile ? '4rem 0' : '10rem 0',
      position: 'relative',
      overflow: 'hidden',
      transition: 'padding 0.3s ease',
    }}>
      {/* Decorative number */}


      <div className="grid-texture" style={{
        position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: isMobile ? '2.25rem' : '3.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.9rem',
            background: 'rgba(212,255,61,0.1)',
            border: '1px solid rgba(212,255,61,0.25)',
            borderRadius: '100px',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(17,17,17,0.7)',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4ff3d', flexShrink: 0 }} />
            Achievements
          </div>
          <h2 className="heading-display" style={{ marginTop: '0.2rem', textAlign: 'center' }}>
            Achievements &amp;{' '}
            <span className="serif-accent">Recognition</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="achievements-grid" style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '1.5rem',
        }}>
          {achievementsList.map((ach, idx) => {
            const isFeatured = idx === 0 || ach.featured;
            const bentoClasses = ['bento-gold', 'bento-teal', 'bento-teal', 'bento-amber', 'bento-blue'];
            const cardTheme = bentoClasses[idx % bentoClasses.length];
            const icon = ach.badge || ach.icon || '🏆';
            const title = ach.title;
            const desc = ach.description || ach.desc || ach.org || '';
            const tag = ach.year ? `${ach.year}` : (isFeatured ? 'NATIONAL RANK' : 'RECOGNITION');

            return (
              <div
                key={ach.id || idx}
                ref={el => cardsRef.current[idx] = el}
                className={`bento-card ${cardTheme}`}
                style={{
                  gridColumn: isFeatured && !isMobile ? 'span 2' : 'span 1',
                  minHeight: isFeatured ? '220px' : 'auto',
                  position: 'relative',
                }}
              >
                {/* Watermark 52 for featured card */}
                {isFeatured && (
                  <div style={{
                    position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
                    fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: isMobile ? '6rem' : '8.5rem',
                    color: 'var(--accent-lime)', opacity: 0.18, lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
                  }}>
                    52
                  </div>
                )}

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                        <span style={{
                          padding: '0.2rem 0.75rem', background: 'rgba(212,255,61,0.15)',
                          border: '1px solid rgba(17,17,17,0.15)', borderRadius: '20px',
                          fontSize: '10px', fontWeight: 700, color: 'var(--surface-dark)',
                          letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-display)',
                        }}>
                          {tag}
                        </span>
                      </div>
                      {ach.link && (
                        <a
                          href={ach.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#111', fontSize: '0.75rem', fontWeight: 600,
                            textDecoration: 'none', opacity: 0.6,
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
                        >
                          Verify ↗
                        </a>
                      )}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isFeatured ? (isMobile ? '1.1rem' : '1.4rem') : '1.05rem',
                      fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem',
                      lineHeight: 1.3, letterSpacing: isFeatured ? '-0.01em' : 'normal',
                    }}>
                      {title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300,
                      fontSize: isFeatured ? '1.05rem' : '0.9rem', color: 'var(--cream)', lineHeight: 1.5,
                      maxWidth: isFeatured ? '90%' : '100%',
                    }}>
                      {desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .bento-card {
          background: #ffffff;
          border: 2px solid var(--surface-dark);
          border-radius: 20px;
          padding: 1.75rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.25s ease, box-shadow 0.25s ease;
          will-change: transform;
          box-shadow: 4px 4px 0px var(--surface-dark);
        }

        .bento-card:hover {
          transform: translate(-3px, -3px);
          box-shadow: 7px 7px 0px var(--surface-dark);
        }

        .bento-gold {
          background: #ffffff;
        }
        .bento-gold:hover {
          box-shadow: 7px 7px 0px var(--surface-dark) !important;
        }

        .bento-teal {
          background: #ffffff;
        }
        .bento-teal:hover {
          box-shadow: 7px 7px 0px var(--surface-dark) !important;
        }

        .bento-amber {
          background: #ffffff;
        }
        .bento-amber:hover {
          box-shadow: 7px 7px 0px var(--surface-dark) !important;
        }

        .bento-blue {
          background: #ffffff;
        }
        .bento-blue:hover {
          box-shadow: 7px 7px 0px var(--surface-dark) !important;
        }

        @media (max-width: 768px) {
          #achievements { padding: 4rem 0 !important; }
          .achievements-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          .bento-card {
            grid-column: span 1 !important;
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
