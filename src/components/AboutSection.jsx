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
    <div 
      ref={ref} 
      className="about-stat-card"
      style={{ 
        textAlign: 'center', 
        position: 'relative',
        background: '#181818',
        border: '2px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        padding: '2.5rem 1.5rem',
        boxShadow: '4px 4px 0px rgba(255, 255, 255, 0.08)',
        transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.25s ease, border-color 0.25s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translate(-3px, -3px)';
        e.currentTarget.style.boxShadow = '7px 7px 0px var(--accent-lime)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translate(0px, 0px)';
        e.currentTarget.style.boxShadow = '4px 4px 0px rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
      }}
    >
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
        fontWeight: 800,
        color: '#ffffff',
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
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.5)',
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
  const curtain1Ref = useRef(null);
  const curtain2Ref = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
      // Heading & text elements reveal (removed photoRef from els to prevent conflicting animations)
      const els = [headingRef.current, textRef.current].filter(Boolean);

      els.forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: i * 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
              once: true,
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

      // Premium visual: Double-curtain reveal with image scale/parallax
      // Triggered on photoRef so it fires at correct scroll depth regardless of marginTop offset
      if (curtain2Ref.current && curtain1Ref.current) {
        // Set initial state: both curtains fully covering the photo
        gsap.set(curtain2Ref.current, { xPercent: 0 });
        gsap.set(curtain1Ref.current, { xPercent: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: photoContainerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none', // play once, never reverse
            once: true,
          }
        });

        // Curtain 2 (Dark) slides out first
        tl.to(curtain2Ref.current,
          { xPercent: 101, duration: 1.0, ease: 'power3.inOut' }
        );

        // Curtain 1 (Lime) slides out with overlap
        tl.to(curtain1Ref.current,
          { xPercent: 101, duration: 1.0, ease: 'power3.inOut' },
          '-=0.75'
        );

        // Profile image scales down from slight zoom
        if (photoImgRef.current) {
          gsap.set(photoImgRef.current, { xPercent: -10, scale: 1.15 });
          tl.to(photoImgRef.current,
            { xPercent: 0, scale: 1.0, duration: 1.2, ease: 'power2.out' },
            '-=0.8'
          );
        }

        // Offset border frame pops in
        if (photoBorderRef.current) {
          gsap.set(photoBorderRef.current, { opacity: 0 });
          tl.to(photoBorderRef.current,
            { opacity: 0.3, duration: 0.6, ease: 'power2.out' },
            '-=0.5'
          );
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} style={{
      background: '#111111',
      padding: isMobile ? '5rem 0 3rem' : '5rem 0 3.5rem',
      position: 'relative',
      height: '100vh',
      overflow: 'hidden',
      marginTop: '-100vh',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {/* Decorative number */}


      {/* Background accents */}
      <div style={{
        position: 'absolute',
        top: '-100px', right: '-100px',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,255,61,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-80px', left: '-80px',
        width: '300px', height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl">
        {/* Section header */}
        <div ref={headingRef} style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.3rem 0.9rem',
            background: 'rgba(212,255,61,0.08)',
            border: '1px solid rgba(212,255,61,0.2)',
            borderRadius: '100px',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--accent-lime)',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-lime)', flexShrink: 0 }} />
            About Me
          </div>
          <h2 className="heading-display" style={{ marginTop: '0.2rem', color: '#ffffff' }}>
            The person{' '}
            <span className="serif-accent" style={{ color: 'var(--accent-lime)' }}>behind the code</span>
          </h2>
        </div>

        {/* Biography & Photo main card */}
        <div style={{
          background: '#181818',
          border: '2px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: isMobile ? '1.5rem 1.25rem' : '2.5rem 2.5rem',
          boxShadow: '6px 6px 0px rgba(255, 255, 255, 0.05)',
          marginBottom: '1.25rem',
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Two-column layout: 55% text / 45% image */}
          <div className="about-two-col" style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '58% 38%',
            gap: '2rem',
            alignItems: 'center',
          }}>
          {/* Left — Text */}
          <div ref={textRef}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-body-lg)',
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.75)',
              marginBottom: '1.5rem',
            }} dangerouslySetInnerHTML={{ __html: bioParagraphs[0] || '' }} />

            {bioParagraphs[1] && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-body-lg)',
                lineHeight: 1.8,
                color: 'rgba(255, 255, 255, 0.75)',
                marginBottom: '2rem',
              }} dangerouslySetInnerHTML={{ __html: bioParagraphs[1] }} />
            )}

            {/* Blockquote highlight */}
            {bioParagraphs[2] && (
              <blockquote style={{
                borderLeft: '2px solid var(--accent-lime)',
                paddingLeft: '1.5rem',
                marginBottom: '2.5rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '1.2rem',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.85)',
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
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px',
                  transform: 'translate(12px, 12px)',
                  opacity: 0.3,
                  zIndex: 0,
                  transformStyle: 'preserve-3d',
                }}
              />

              {/* Soft shadow depth */}
              <div style={{
                position: 'absolute',
                inset: '-12px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(212,255,61,0.12), rgba(201,168,76,0.06), transparent)',
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
                  border: '1px solid var(--line-subtle)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                  background: 'var(--bg-secondary)',
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={() => {
                  gsap.to(photoContainerRef.current, { scale: 1.03, z: 20, duration: 0.4, overwrite: 'auto' });
                }}
                onMouseLeave={() => {
                  gsap.to(photoContainerRef.current, { scale: 1, z: 0, duration: 0.4, overwrite: 'auto' });
                }}
              >
                {/* Curtain 1: Lime Accent */}
                <div
                  ref={curtain1Ref}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--accent-lime)',
                    zIndex: 2,
                    pointerEvents: 'none',
                    borderRadius: '20px',
                  }}
                />
                {/* Curtain 2: Dark Surface */}
                <div
                  ref={curtain2Ref}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--surface-dark)',
                    zIndex: 3,
                    pointerEvents: 'none',
                    borderRadius: '20px',
                  }}
                />

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
                    position: 'relative',
                    zIndex: 1,
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />

                {/* Available badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '1rem',
                  padding: '0.4rem 0.9rem',
                  background: 'rgba(17,17,17,0.92)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  border: '1px solid rgba(212,255,61,0.3)',
                  zIndex: 1,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    color: 'var(--accent-lime)',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}>
                    Available for work ✦
                  </span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="about-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '1rem',
          marginTop: '1.25rem',
          position: 'relative',
          zIndex: 1,
        }}>
          {BHUSHAN_DATA.stats.map((stat, i) => (
            <CounterStat key={i} {...stat} />
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          #about { padding: 4rem 0 2.5rem !important; }
          .about-two-col {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .about-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem 0 !important;
          }
          .about-stat-divider {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          #about { padding: 3.5rem 0 2rem !important; }
          .about-photo-wrap {
            width: min(220px, 70vw) !important;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
