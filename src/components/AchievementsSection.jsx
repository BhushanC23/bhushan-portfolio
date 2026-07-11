import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BHUSHAN_DATA } from '../data/bhushanData';

gsap.registerPlugin(ScrollTrigger);

export default function AchievementsSection() {
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

  const featuredAchievement = BHUSHAN_DATA.achievements[0];
  const otherAchievements = BHUSHAN_DATA.achievements.slice(1);

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
          {/* Card 1: IIT Bombay (Featured) */}
          <div
            ref={el => cardsRef.current[0] = el}
            className="bento-card bento-gold"
            style={{
              gridColumn: isMobile ? 'span 1' : 'span 2',
              minHeight: '220px',
            }}
          >
            {/* Watermark 52 */}
            <div style={{
              position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
              fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: isMobile ? '6rem' : '8.5rem',
              color: 'var(--accent-lime)', opacity: 0.18, lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
            }}>
              52
            </div>

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{featuredAchievement.icon || "🥇"}</span>
                  <span style={{
                    padding: '0.2rem 0.75rem', background: 'rgba(212,255,61,0.15)',
                    border: '1px solid rgba(17,17,17,0.15)', borderRadius: '20px',
                    fontSize: '10px', fontWeight: 700, color: 'var(--surface-dark)',
                    letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-display)',
                  }}>
                    NATIONAL RANK
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: isMobile ? '1.1rem' : '1.4rem',
                  fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem',
                  letterSpacing: '-0.01em',
                }}>
                  {featuredAchievement.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300,
                  fontSize: '1.05rem', color: 'var(--cream)', lineHeight: 1.5,
                  maxWidth: '90%',
                }}>
                  {featuredAchievement.desc}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: JPMorgan */}
          <div
            ref={el => cardsRef.current[1] = el}
            className="bento-card bento-teal"
            style={{ gridColumn: 'span 1' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{otherAchievements[0].icon || "🎓"}</span>
                  <span style={{
                    padding: '0.2rem 0.75rem', background: 'rgba(212,255,61,0.15)',
                    border: '1px solid rgba(17,17,17,0.15)', borderRadius: '20px',
                    fontSize: '10px', fontWeight: 700, color: 'var(--surface-dark)',
                    letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-display)',
                  }}>
                    SWE CERTIFIED
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.05rem',
                  fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem',
                  lineHeight: 1.3,
                }}>
                  {otherAchievements[0].title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300,
                  fontSize: '0.9rem', color: 'var(--cream)', lineHeight: 1.5,
                }}>
                  {otherAchievements[0].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: NASSCOM */}
          <div
            ref={el => cardsRef.current[2] = el}
            className="bento-card bento-teal"
            style={{ gridColumn: 'span 1' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{otherAchievements[1].icon || "🤖"}</span>
                  <span style={{
                    padding: '0.2rem 0.75rem', background: 'rgba(212,255,61,0.15)',
                    border: '1px solid rgba(17,17,17,0.15)', borderRadius: '20px',
                    fontSize: '10px', fontWeight: 700, color: 'var(--surface-dark)',
                    letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-display)',
                  }}>
                    GENERATIVE AI
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.05rem',
                  fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem',
                  lineHeight: 1.3,
                }}>
                  {otherAchievements[1].title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300,
                  fontSize: '0.9rem', color: 'var(--cream)', lineHeight: 1.5,
                }}>
                  {otherAchievements[1].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: MSME */}
          <div
            ref={el => cardsRef.current[3] = el}
            className="bento-card bento-amber"
            style={{ gridColumn: 'span 1' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{otherAchievements[2].icon || "🏢"}</span>
                  <span style={{
                    padding: '0.2rem 0.75rem', background: 'rgba(212,255,61,0.15)',
                    border: '1px solid rgba(17,17,17,0.15)', borderRadius: '20px',
                    fontSize: '10px', fontWeight: 700, color: 'var(--surface-dark)',
                    letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-display)',
                  }}>
                    GOVERNMENT MSME
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.05rem',
                  fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem',
                  lineHeight: 1.3,
                }}>
                  {otherAchievements[2].title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300,
                  fontSize: '0.9rem', color: 'var(--cream)', lineHeight: 1.5,
                }}>
                  {otherAchievements[2].desc}
                </p>
              </div>
            </div>
          </div>

          {/* Card 5: GCP */}
          <div
            ref={el => cardsRef.current[4] = el}
            className="bento-card bento-blue"
            style={{ gridColumn: 'span 1' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{otherAchievements[3].icon || "☁️"}</span>
                  <span style={{
                    padding: '0.2rem 0.75rem', background: 'rgba(212,255,61,0.15)',
                    border: '1px solid rgba(17,17,17,0.15)', borderRadius: '20px',
                    fontSize: '10px', fontWeight: 700, color: 'var(--surface-dark)',
                    letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-display)',
                  }}>
                    CLOUD CERTIFIED
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.05rem',
                  fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem',
                  lineHeight: 1.3,
                }}>
                  {otherAchievements[3].title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300,
                  fontSize: '0.9rem', color: 'var(--cream)', lineHeight: 1.5,
                }}>
                  {otherAchievements[3].desc}
                </p>
              </div>
            </div>
          </div>
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
