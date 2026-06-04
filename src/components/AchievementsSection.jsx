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

      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          {
            opacity: 1,
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.9,
            delay: isMobile ? 0 : (i === 0 ? 0 : (i % 2 === 1 ? 0 : 0.15)),
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
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
      background: 'var(--teal-dark)',
      padding: isMobile ? '4rem 0' : '10rem 0',
      position: 'relative',
      overflow: 'hidden',
      transition: 'padding 0.3s ease',
    }}>
      {/* Decorative number */}
      <div className="section-deco-number" style={{ right: '-2%', top: '-5%' }}>05</div>

      <div className="grid-texture" style={{
        position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: isMobile ? '2.25rem' : '3.5rem', textAlign: 'center' }}>
          <h2 className="heading-display">
            Achievements &amp;{' '}
            <span className="serif-accent">Recognition</span>
          </h2>
        </div>

        {/* Featured achievement — full width */}
        <div
          ref={el => cardsRef.current[0] = el}
          style={{
            position: 'relative',
            padding: isMobile ? '1.5rem 1.25rem 1.5rem 1.5rem' : '2.5rem 2rem 2.5rem 3rem',
            borderLeft: '2px solid var(--gold-accent)',
            marginBottom: '2rem',
            overflow: 'hidden',
            background: 'rgba(13,26,28,0.4)',
            borderRadius: '0 12px 12px 0',
            boxShadow: '0 0 60px rgba(201,168,76,0.06)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(13,26,28,0.7)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(13,26,28,0.4)';
          }}
        >
          {/* Large decorative "52" */}
          <div style={{
            position: 'absolute',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '10vw',
            color: 'var(--gold-accent)',
            opacity: 0.05,
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}>
            52
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{
              display: 'inline-flex',
              padding: '0.2rem 0.75rem',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--gold-accent)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
              marginBottom: '0.75rem',
            }}>
              NATIONAL RANK
            </span>

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? '1.1rem' : 'clamp(1.1rem, 2vw, 1.5rem)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.25rem',
            }}>
              {featuredAchievement.title}
            </h3>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '1rem',
              color: 'var(--cream)',
            }}>
              {featuredAchievement.desc}
            </p>
          </div>
        </div>

        {/* Other achievements — 2-column grid */}
        <div className="achievements-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0',
        }}>
          {otherAchievements.map((item, i) => (
            <div
              key={i}
              ref={el => cardsRef.current[i + 1] = el}
              style={{
                padding: isMobile ? '1.25rem 1.25rem 1.25rem 1.5rem' : '1.5rem 1.5rem 1.5rem 2rem',
                borderLeft: '2px solid var(--teal-accent)',
                borderBottom: '1px solid rgba(45,212,191,0.06)',
                background: 'transparent',
                transition: 'all 0.3s ease',
                margin: '0.25rem',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(13,26,28,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span style={{
                display: 'inline-flex',
                padding: '0.15rem 0.6rem',
                background: 'rgba(45,212,191,0.07)',
                border: '1px solid rgba(45,212,191,0.15)',
                borderRadius: '20px',
                fontSize: '9px',
                fontWeight: 700,
                color: 'var(--teal-accent)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-display)',
                marginBottom: '0.6rem',
              }}>
                CERTIFIED
              </span>

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '0.3rem',
                lineHeight: 1.35,
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '0.85rem',
                color: 'var(--cream)',
                lineHeight: 1.5,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #achievements { padding: 4rem 0 !important; }
          .achievements-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
