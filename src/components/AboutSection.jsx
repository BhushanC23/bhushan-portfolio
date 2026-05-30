import { useEffect, useRef, useState } from 'react';
import { BHUSHAN_DATA } from '../data/bhushanData';
import { usePortfolioData } from '../hooks/usePortfolioData';

function CounterStat({ value, suffix, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(parseFloat(current.toFixed(2)));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: 800,
        color: 'var(--teal-accent)',
        lineHeight: 1,
        textShadow: '0 0 30px rgba(45,212,191,0.4)',
      }}>
        {typeof value === 'number' && !Number.isInteger(value)
          ? Number(count).toFixed(2)
          : Math.round(count)
        }{suffix}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        color: 'var(--text-muted)',
        marginTop: '0.4rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </div>
  );
}

export default function AboutSection() {
  const { about } = usePortfolioData();

  // Bio paragraphs: from Supabase (split by newline) or static fallback
  const bioParagraphs = about?.bio
    ? about.bio.split('\n').filter(p => p.trim())
    : [
        `Hi, I'm <strong>Bhushan Chaturbhuj</strong> — a Full Stack Developer and MCA student at Sanjivani University, Kopargaon. I build web experiences that are fast, functional, and memorable.`,
        `Currently interning at <strong style="color:var(--gold-accent)">Ethara AI</strong> on LLM Post-Training (SFT &amp; RLHF workflows). I love turning ideas into reality — from AR heritage platforms to EV buying assistants.`,
        `🏆 National Rank 52 at NEC 2025 (IIT Bombay E-Cell) — Turning coffee into code, and ideas into impact.`,
      ];

  const photoSrc = about?.photo_url || '/bhushan-photo.jpg';
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const photoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.2 }
    );

    [headingRef, textRef, photoRef].forEach(ref => {
      if (ref.current) {
        ref.current.style.opacity = '0';
        ref.current.style.transform = 'translateY(40px)';
        ref.current.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(ref.current);
      }
    });

    if (textRef.current) {
      textRef.current.style.transitionDelay = '0.15s';
    }
    if (photoRef.current) {
      photoRef.current.style.transitionDelay = '0.25s';
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{
      background: 'var(--bg-secondary)',
      padding: '7rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background accents */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-80px',
        left: '-80px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl">
        {/* Section label */}
        <div ref={headingRef}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}>
            <div style={{ width: '30px', height: '1.5px', background: 'var(--teal-accent)' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--teal-accent)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>About Me</span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            The Person Behind<br />
            <span className="animated-underline">the Code.</span>
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="about-two-col" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'center',
          marginTop: '3rem',
        }}>
          {/* Left — Text */}
          <div ref={textRef}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'rgba(240,244,244,0.8)',
              marginBottom: '1.5rem',
            }} dangerouslySetInnerHTML={{ __html: bioParagraphs[0] || '' }} />
            {bioParagraphs[1] && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                lineHeight: 1.8,
                color: 'rgba(240,244,244,0.7)',
                marginBottom: '1.5rem',
              }} dangerouslySetInnerHTML={{ __html: bioParagraphs[1] }} />
            )}
            {bioParagraphs[2] && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.8,
                color: 'rgba(240,244,244,0.6)',
                marginBottom: '2.5rem',
              }} dangerouslySetInnerHTML={{ __html: bioParagraphs[2] }} />
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={BHUSHAN_DATA.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-teal"
                style={{ textDecoration: 'none', fontSize: '0.9rem' }}
              >
                View GitHub →
              </a>
              <a
                href={BHUSHAN_DATA.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ textDecoration: 'none', fontSize: '0.9rem' }}
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Right — Photo */}
          <div ref={photoRef} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="about-photo-wrap" style={{
              position: 'relative',
              width: 'min(380px, 100%)',
            }}>
              {/* Glow ring */}
              <div style={{
                position: 'absolute',
                inset: '-12px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(45,212,191,0.3), rgba(201,168,76,0.15), transparent)',
                filter: 'blur(20px)',
                zIndex: 0,
              }} />

              {/* Photo container */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                border: '1px solid rgba(45,212,191,0.2)',
                borderRadius: '20px',
                overflow: 'hidden',
                aspectRatio: '3/4',
                background: 'var(--teal-dark)',
              }}>
                <img
                  src={photoSrc}
                  alt="Bhushan Chaturbhuj"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />

                {/* Corner accent */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(7,13,14,0.85)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  border: '1px solid rgba(45,212,191,0.2)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'var(--teal-accent)',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}>
                    Available for work ✦
                  </span>
                </div>
              </div>

              {/* Floating badge */}
              <div className="about-floating-badge" style={{
                position: 'absolute',
                top: '-1rem',
                left: '-1.5rem',
                padding: '0.75rem 1.25rem',
                background: 'rgba(13,26,28,0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                border: '1px solid rgba(201,168,76,0.3)',
                zIndex: 2,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--gold-accent)',
                }}>🥇 Rank 52</div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                }}>NEC 2025 — IIT Bombay</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="about-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          marginTop: '5rem',
          paddingTop: '3rem',
          borderTop: '1px solid rgba(45,212,191,0.1)',
        }}>
          {BHUSHAN_DATA.stats.map((stat, i) => (
            <CounterStat key={i} {...stat} />
          ))}
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        /* === ABOUT SECTION RESPONSIVE === */
        @media (max-width: 900px) {
          #about {
            padding: 5rem 0 !important;
          }
          .about-two-col {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem !important;
            margin-top: 3rem !important;
          }
        }
        @media (max-width: 640px) {
          #about {
            padding: 4rem 0 !important;
          }
          .about-photo-wrap {
            width: min(280px, 80vw) !important;
            margin: 0 auto;
          }
          .about-floating-badge {
            top: -0.75rem !important;
            left: -0.75rem !important;
            padding: 0.5rem 0.9rem !important;
          }
          .about-two-col > div:first-child p {
            font-size: 0.97rem !important;
          }
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            padding-top: 2rem !important;
            margin-top: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
