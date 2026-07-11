import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BHUSHAN_DATA } from '../data/bhushanData';
import { usePortfolioData } from '../hooks/usePortfolioData';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   Animated Counter
   ───────────────────────────────────────────────────────────── */
function Counter({ value, suffix, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true;
        let start = 0;
        const steps = 50;
        const inc = value / steps;
        const t = setInterval(() => {
          start += inc;
          if (start >= value) { setCount(value); clearInterval(t); }
          else setCount(Math.round(start));
        }, 30);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
        fontWeight: 800,
        color: '#ffffff',
        letterSpacing: '-0.04em',
        lineHeight: 1,
      }}>
        {count}{suffix}
      </div>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '9px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)',
        marginTop: '0.4rem',
      }}>
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Section
   ───────────────────────────────────────────────────────── */
export default function AboutSection() {
  const { about } = usePortfolioData();
  const sectionRef        = useRef(null);
  const nameRef           = useRef(null);
  const bioRef            = useRef(null);
  const photoContainerRef = useRef(null);
  const photoImgRef       = useRef(null);
  const curtain1Ref       = useRef(null);
  const curtain2Ref       = useRef(null);
  const statsRef          = useRef(null);
  const lineRef           = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const photoSrc = about?.photo_url || '/bhushan-photo.jpg';

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = {
        trigger: sectionRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      };

      // Main cohesive reveal timeline
      const mainTl = gsap.timeline({ scrollTrigger: trigger });

      // Name chars split-like reveal
      if (nameRef.current) {
        mainTl.fromTo(nameRef.current,
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.0, ease: 'power4.out' },
          0
        );
      }

      // Divider line scaleX
      if (lineRef.current) {
        mainTl.fromTo(lineRef.current,
          { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, duration: 1.0, ease: 'power3.inOut' },
          0.1
        );
      }

      // Bio slides up
      if (bioRef.current) {
        mainTl.fromTo(bioRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          0.3
        );
      }

      // Stats fade up
      if (statsRef.current) {
        mainTl.fromTo(statsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
          0.5
        );
      }

      // Photo double-curtain reveal
      if (curtain1Ref.current && curtain2Ref.current) {
        gsap.set(curtain2Ref.current, { xPercent: 0 });
        gsap.set(curtain1Ref.current, { xPercent: 0 });
        if (photoImgRef.current) {
          gsap.set(photoImgRef.current, { scale: 1.12 });
        }
        
        mainTl.to(curtain2Ref.current, { xPercent: 101, duration: 0.9, ease: 'power3.inOut' }, 0.4);
        mainTl.to(curtain1Ref.current, { xPercent: 101, duration: 0.9, ease: 'power3.inOut' }, 0.6);
        if (photoImgRef.current) {
          mainTl.to(photoImgRef.current, { scale: 1, duration: 1.2, ease: 'power2.out' }, 0.6);
        }
      }
    });
    return () => ctx.revert();
  }, []);

  // ── Bio text ──
  const bioText = `Full Stack Engineer & MCA Candidate specializing in highly interactive web systems, Web AR experiences, and LLM post-training. Former LLM Post-Training Intern at Ethara AI executing SFT & RLHF workflows.`;

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: '#0e0e0e',
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        marginTop: '-100vh',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobile ? '4rem 0 2rem' : '3.5rem 0 2rem',
      }}
    >
      {/* ── Ambient glows ── */}
      <div style={{
        position: 'absolute', top: '-120px', right: '-80px',
        width: '550px', height: '550px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,255,61,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '30%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,255,61,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ── Ghost editorial word — extreme background ── */}
      <div style={{
        position: 'absolute',
        right: isMobile ? '-5%' : '-2%',
        top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(140px, 20vw, 260px)',
        fontWeight: 900,
        color: 'rgba(255,255,255,0.025)',
        lineHeight: 1,
        letterSpacing: '-0.06em',
        userSelect: 'none',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        ABOUT
      </div>

      {/* ── Thin lime vertical rule — far left ── */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: '3px',
        background: 'linear-gradient(to bottom, transparent, var(--accent-lime) 40%, var(--accent-lime) 60%, transparent)',
        opacity: 0.35,
        pointerEvents: 'none',
      }} />

      {/* ═══════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════ */}
      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Row 1: Top label + index ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isMobile ? '1rem' : '1.5rem',
        }}>
          {/* Pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.3rem 0.9rem',
            background: 'rgba(212,255,61,0.08)',
            border: '1px solid rgba(212,255,61,0.2)',
            borderRadius: '100px',
            fontFamily: 'var(--font-body)',
            fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--accent-lime)',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-lime)' }} />
            About Me
          </div>

          {/* Right: year index */}
          {!isMobile && (
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)',
            }}>
              SINCE — 2004 · MCA '25
            </div>
          )}
        </div>

        {/* ── Row 2: Main grid (heading + photo) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 300px',
          gap: isMobile ? '1.5rem' : '2.5rem',
          alignItems: 'center',
        }}>
          {/* ── LEFT COLUMN ── */}
          <div>
            {/* Huge editorial name */}
            <div
              ref={nameRef}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 4vw, 3.8rem)',
                fontWeight: 900,
                letterSpacing: '-0.045em',
                lineHeight: 0.95,
                color: '#ffffff',
                marginBottom: '0.4rem',
                overflow: 'hidden',
              }}
            >
              The person
              <br />
              <span style={{
                WebkitTextStroke: '1px rgba(255,255,255,0.3)',
                color: 'transparent',
                fontFamily: 'var(--font-display)',
              }}>
                behind
              </span>
              {' '}
              <span style={{ color: 'var(--accent-lime)' }}>
                the
              </span>
              <br />
              <em style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: '0.82em',
                letterSpacing: '-0.02em',
                color: 'rgba(255,255,255,0.85)',
              }}>
                code.
              </em>
            </div>



            {/* Bio text */}
            <p
              ref={bioRef}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.8rem, 1.1vw, 0.92rem)',
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.6)',
                maxWidth: '520px',
                marginBottom: isMobile ? '0.65rem' : '0.85rem',
              }}
            >
              {bioText}
            </p>



            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <a
                href={BHUSHAN_DATA.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-teal magnetic"
                style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '0.65rem 1.4rem' }}
              >
                GitHub →
              </a>
              <a
                href={BHUSHAN_DATA.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline magnetic"
                style={{ textDecoration: 'none', fontSize: '0.85rem', padding: '0.65rem 1.4rem' }}
              >
                LinkedIn
              </a>
              <a
                href="/Bhushan_Chaturbhuj_Resume.pdf"
                download
                className="btn-outline magnetic"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  padding: '0.65rem 1.4rem',
                  borderColor: 'rgba(201,168,76,0.35)',
                  color: 'var(--gold-accent)',
                }}
              >
                Resume ↓
              </a>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Photo ── */}
          <div style={{
            position: 'relative',
            maxWidth: isMobile ? '240px' : 'none',
            width: '100%',
            margin: isMobile ? '0.75rem auto 0' : '0',
          }}>


            {/* Photo frame */}
            <div
              ref={photoContainerRef}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '3/4',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1.5px solid rgba(255,255,255,0.1)',
                background: '#1a1a1a',
              }}
              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.02, duration: 0.4, ease: 'power2.out' })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: 'power2.out' })}
            >
              {/* Lime corner accent — top left */}
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: '48px', height: '48px',
                borderTop: '2px solid var(--accent-lime)',
                borderLeft: '2px solid var(--accent-lime)',
                borderRadius: '20px 0 0 0',
                zIndex: 4, pointerEvents: 'none',
              }} />
              {/* Lime corner accent — bottom right */}
              <div style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '48px', height: '48px',
                borderBottom: '2px solid var(--accent-lime)',
                borderRight: '2px solid var(--accent-lime)',
                borderRadius: '0 0 20px 0',
                zIndex: 4, pointerEvents: 'none',
              }} />

              {/* Curtain 1 — lime */}
              <div ref={curtain1Ref} style={{
                position: 'absolute', inset: 0,
                background: 'var(--accent-lime)',
                zIndex: 3, borderRadius: '20px',
              }} />
              {/* Curtain 2 — dark */}
              <div ref={curtain2Ref} style={{
                position: 'absolute', inset: 0,
                background: '#0e0e0e',
                zIndex: 2, borderRadius: '20px',
              }} />

              <img
                ref={photoImgRef}
                src={photoSrc}
                alt="Bhushan Chaturbhuj"
                style={{
                  width: '100%', height: '115%',
                  objectFit: 'cover', objectPosition: 'top',
                  display: 'block', willChange: 'transform',
                  position: 'relative', zIndex: 1,
                }}
                onError={e => { e.target.style.display = 'none'; }}
              />

              {/* Bottom gradient overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '50%',
                background: 'linear-gradient(to top, rgba(14,14,14,0.7), transparent)',
                zIndex: 2, pointerEvents: 'none',
              }} />
            </div>

            {/* Offset depth card behind photo */}
            <div style={{
              position: 'absolute', inset: 0,
              borderRadius: '20px',
              border: '1px solid rgba(212,255,61,0.15)',
              transform: 'translate(10px, 10px)',
              zIndex: 0, pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* ── Divider line ── */}
        <div
          ref={lineRef}
          style={{
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, var(--accent-lime), rgba(255,255,255,0.08), transparent)',
            margin: isMobile ? '1rem 0 0.6rem' : '1.25rem 0 0.75rem',
          }}
        />

        {/* ── Stats row ── */}
        <div
          ref={statsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : `repeat(${BHUSHAN_DATA.stats.length}, 1fr)`,
            gap: isMobile ? '1.5rem 1rem' : '1rem',
          }}
        >
          {BHUSHAN_DATA.stats.map((stat, i) => (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}>
              {/* Divider (all except first) — hidden on mobile */}
              {i > 0 && !isMobile && (
                <div style={{
                  position: 'absolute',
                  left: 0, top: '10%', bottom: '10%',
                  width: '1px',
                  background: 'rgba(255,255,255,0.08)',
                }} />
              )}
              <Counter {...stat} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        @media (max-width: 900px) {
          #about { height: auto !important; min-height: 100vh; padding: 5rem 0 3rem !important; }
        }
      `}</style>
    </section>
  );
}
