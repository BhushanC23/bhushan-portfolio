import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BHUSHAN_DATA } from '../data/bhushanData';
import { usePortfolioData } from '../hooks/usePortfolioData';

gsap.registerPlugin(ScrollTrigger);

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
    <div ref={ref} style={{ textAlign: 'center', position: 'relative' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2.5rem, 5vw, 5rem)',
        fontWeight: 800,
        color: 'var(--teal-accent)',
        lineHeight: 1,
        letterSpacing: '-0.04em',
      }}>
        {typeof value === 'number' && !Number.isInteger(value)
          ? Number(count).toFixed(2)
          : Math.round(count)
        }{suffix}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        marginTop: '0.6rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </div>
  );
}

export default function AboutSection() {
  const { about } = usePortfolioData();
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const photoRef = useRef(null);
  const statsRef = useRef(null);
  const photoBorderRef = useRef(null);
  const photoContainerRef = useRef(null);
  const photoImgRef = useRef(null);

  const bioParagraphs = about?.bio
    ? about.bio.split('\n').filter(p => p.trim())
    : [
        `Hi, I'm <strong>Bhushan Chaturbhuj</strong> — a Full Stack Engineer and MCA Candidate specializing in highly interactive web systems, Web AR experiences, and Large Language Model (LLM) post-training. I excel at bridging the gap between sophisticated backend AI logic and smooth, immersive user interfaces.`,
        `Currently interning at <strong style="color:var(--gold-accent)">Ethara AI</strong> on LLM Post-Training (SFT &amp; RLHF workflows). I love turning ideas into reality — from AR heritage platforms to EV buying assistants.`,
        `🏆 National Rank 52 at NEC 2025 (IIT Bombay E-Cell) — I love scaling technical ideas from initial concept to high-impact user adoption.`,
      ];

  const photoSrc = about?.photo_url || '/bhushan-photo.jpg';

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = [headingRef.current, textRef.current, photoRef.current].filter(Boolean);

      els.forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      });

      if (statsRef.current) {
        gsap.fromTo(statsRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      }

      // Premium entrance reveal for photo container mask & zoom
      if (photoContainerRef.current) {
        gsap.fromTo(photoContainerRef.current,
          { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 1.3,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      }

      if (photoImgRef.current) {
        gsap.fromTo(photoImgRef.current,
          { scale: 1.3 },
          {
            scale: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      }

      if (photoBorderRef.current) {
        gsap.fromTo(photoBorderRef.current,
          { opacity: 0, x: 0, y: 0 },
          {
            opacity: 0.3,
            x: 12,
            y: 12,
            duration: 1.3,
            delay: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      }

      // Parallax scroll scrub & 3D Tilt on scroll (both mobile and PC)
      if (photoContainerRef.current && photoImgRef.current && photoBorderRef.current) {
        // Subtle 3D Tilt on scroll
        gsap.fromTo(photoContainerRef.current,
          { rotationY: -6, rotationX: 4 },
          {
            rotationY: 6,
            rotationX: -4,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );

        // Parallax image shift inside overflow: hidden container
        gsap.fromTo(photoImgRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );

        // Depth border offset parallax
        gsap.fromTo(photoBorderRef.current,
          { x: 8, y: 8 },
          {
            x: 16,
            y: 16,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{
      background: 'var(--bg-secondary)',
      padding: '10rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative number */}
      <div className="section-deco-number" style={{ right: '-2%', top: '-5%' }}>01</div>

      {/* Background accents */}
      <div style={{
        position: 'absolute',
        top: '-100px', right: '-100px',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-80px', left: '-80px',
        width: '300px', height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl">
        {/* Section header */}
        <div ref={headingRef} style={{ marginBottom: '3.5rem' }}>
          <h2 className="heading-display">
            The person{' '}
            <span className="serif-accent">behind the code</span>
          </h2>
        </div>

        {/* Two-column layout: 55% text / 45% image */}
        <div className="about-two-col" style={{
          display: 'grid',
          gridTemplateColumns: '55% 42%',
          gap: '3rem',
          alignItems: 'center',
        }}>
          {/* Left — Text */}
          <div ref={textRef}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.8,
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
            }} dangerouslySetInnerHTML={{ __html: bioParagraphs[0] || '' }} />

            {bioParagraphs[1] && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-lg)',
                lineHeight: 1.8,
                color: 'var(--text-muted)',
                marginBottom: '2rem',
              }} dangerouslySetInnerHTML={{ __html: bioParagraphs[1] }} />
            )}

            {/* Blockquote highlight */}
            {bioParagraphs[2] && (
              <blockquote style={{
                borderLeft: '2px solid var(--teal-accent)',
                paddingLeft: '1.5rem',
                marginBottom: '2.5rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '1.2rem',
                lineHeight: 1.7,
                color: 'var(--cream)',
              }} dangerouslySetInnerHTML={{ __html: bioParagraphs[2] }} />
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={BHUSHAN_DATA.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-teal magnetic"
                style={{ textDecoration: 'none' }}
              >
                View GitHub →
              </a>
              <a
                href={BHUSHAN_DATA.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline magnetic"
                style={{ textDecoration: 'none' }}
              >
                LinkedIn
              </a>
              <a
                href="/Bhushan_Chaturbhuj_Resume.pdf"
                download="Bhushan_Chaturbhuj_Resume.pdf"
                className="btn-outline magnetic"
                style={{
                  textDecoration: 'none',
                  borderColor: 'rgba(201,168,76,0.4)',
                  color: 'var(--gold-accent)',
                }}
              >
                Resume ↓
              </a>
            </div>
          </div>

          {/* Right — Photo */}
          <div ref={photoRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="about-photo-wrap" style={{
              position: 'relative',
              width: 'min(380px, 100%)',
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}>
              {/* Offset border for depth */}
              <div
                ref={photoBorderRef}
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px solid var(--teal-accent)',
                  borderRadius: '20px',
                  transform: 'translate(12px, 12px)',
                  opacity: 0.3,
                  zIndex: 0,
                  transformStyle: 'preserve-3d',
                }}
              />

              {/* Glow */}
              <div style={{
                position: 'absolute',
                inset: '-12px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(45,212,191,0.2), rgba(201,168,76,0.1), transparent)',
                filter: 'blur(20px)',
                zIndex: 0,
              }} />

              {/* Photo container */}
              <div
                ref={photoContainerRef}
                className="photo-container"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  border: '1px solid var(--card-border)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  background: 'var(--teal-dark)',
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={() => {
                  gsap.to(photoContainerRef.current, { scale: 1.03, z: 20, duration: 0.4, overwrite: 'auto' });
                }}
                onMouseLeave={() => {
                  gsap.to(photoContainerRef.current, { scale: 1, z: 0, duration: 0.4, overwrite: 'auto' });
                }}
              >
                <img
                  ref={photoImgRef}
                  src={photoSrc}
                  alt="Bhushan Chaturbhuj"
                  style={{
                    width: '100%',
                    height: '115%', // slightly taller for parallax scroll shift
                    objectFit: 'cover',
                    objectPosition: 'top',
                    display: 'block',
                    transformOrigin: 'center center',
                    willChange: 'transform',
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />

                {/* Available badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  padding: '0.4rem 0.9rem',
                  background: 'rgba(7,13,14,0.85)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  border: '1px solid rgba(45,212,191,0.2)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    color: 'var(--teal-accent)',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                  }}>
                    Available for work ✦
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="about-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          marginTop: '6rem',
          paddingTop: '3rem',
          borderTop: '1px solid rgba(45,212,191,0.08)',
          position: 'relative',
        }}>
          {/* Vertical dividers */}
          {[1, 2, 3].map(i => (
            <div key={i} className="about-stat-divider" style={{
              position: 'absolute',
              left: `${(100 / 4) * i}%`,
              top: '3rem',
              bottom: 0,
              width: '1px',
              background: 'rgba(45,212,191,0.08)',
            }} />
          ))}
          {BHUSHAN_DATA.stats.map((stat, i) => (
            <CounterStat key={i} {...stat} />
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          #about { padding: 6rem 0 !important; }
          .about-two-col {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem 0 !important;
          }
          .about-stat-divider {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          #about { padding: 5rem 0 !important; }
          .about-photo-wrap {
            width: min(280px, 80vw) !important;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
