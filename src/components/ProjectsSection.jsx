import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { GitBranch } from 'lucide-react';
import { BHUSHAN_DATA } from '../data/bhushanData';
import { usePortfolioData } from '../hooks/usePortfolioData';

gsap.registerPlugin(ScrollTrigger);

const CARD_GAP = 24;    // px gap between cards

const TAG_COLORS = {
  'Full Stack':          { bg: 'rgba(45,212,191,0.10)', border: 'rgba(45,212,191,0.25)', color: '#2dd4bf' },
  'Full Stack + CMS':    { bg: 'rgba(45,212,191,0.10)', border: 'rgba(45,212,191,0.25)', color: '#2dd4bf' },
  'Utility Tool':        { bg: 'rgba(201,168,76,0.10)',  border: 'rgba(201,168,76,0.25)',  color: '#c9a84c' },
  'AR / Web XR':         { bg: 'rgba(139,92,246,0.10)',  border: 'rgba(139,92,246,0.25)',  color: '#a78bfa' },
  'AR':                  { bg: 'rgba(139,92,246,0.10)',  border: 'rgba(139,92,246,0.25)',  color: '#a78bfa' },
  'AI/ML':               { bg: 'rgba(249,115,22,0.10)',  border: 'rgba(249,115,22,0.25)',  color: '#fb923c' },
};
const DEFAULT_TAG = { bg: 'rgba(45,212,191,0.10)', border: 'rgba(45,212,191,0.25)', color: '#2dd4bf' };

/* ──────────────────────────────────────────────
   Single project card — 3‑D tilt + glow on hover
   ────────────────────────────────────────────── */
function ProjectCard({ project, index, cardWidth, cardHeight, isMobile }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const tagStyle = TAG_COLORS[project.tag] || DEFAULT_TAG;
  const title    = project.title || project.name || '?';
  const desc     = project.desc  || project.description || '';
  const stack    = project.tech  || project.stack || [];

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;
    const rect  = card.getBoundingClientRect();
    const x     = (e.clientX - rect.left) / rect.width;
    const y     = (e.clientY - rect.top)  / rect.height;
    const rotX  =  (y - 0.5) * 10;
    const rotY  = -(x - 0.5) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    if (glow) glow.style.background =
      `radial-gradient(circle at ${x*100}% ${y*100}%, rgba(45,212,191,0.10), transparent 60%)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className="proj-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      style={{
        width: `${cardWidth}px`,
        flexShrink: 0,
        height: `${cardHeight}px`,
        borderRadius: '16px',
        background: 'var(--card-bg)',
        border: `1px solid ${hovered ? 'rgba(45,212,191,0.25)' : 'var(--card-border)'}`,
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
        transform: (isMobile && hovered) ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 12px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(45,212,191,0.05)' : 'none',
        willChange: 'transform',
        cursor: 'default',
      }}
    >
      {/* Mouse‑follow glow */}
      {!isMobile && (
        <div
          ref={glowRef}
          style={{
            position: 'absolute', inset: 0,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none', zIndex: 0,
          }}
        />
      )}

      {/* Featured ribbon */}
      {project.featured && (
        <div style={{
          position: 'absolute', top: '1rem', right: '1rem', zIndex: 2,
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400,
          fontSize: '0.72rem', color: 'var(--gold-accent)', letterSpacing: '0.05em',
        }}>
          ✦ Featured
        </div>
      )}

      {/* Colour band */}
      <div style={{
        width: '100%', height: isMobile ? '75px' : '125px', flexShrink: 0,
        background: `linear-gradient(135deg, ${tagStyle.bg}, var(--teal-dark))`,
        borderBottom: '1px solid var(--card-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: isMobile ? '2.5rem' : '5.5rem', color: tagStyle.color,
          opacity: 0.15, letterSpacing: '-0.06em', userSelect: 'none', lineHeight: 1,
        }}>
          {title.charAt(0)}
        </span>
        {/* Index number */}
        <span style={{
          position: 'absolute',
          bottom: isMobile ? '0.3rem' : '0.6rem',
          left: isMobile ? '0.8rem' : '1.25rem',
          fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)',
          textTransform: 'uppercase',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        {/* Tag pill */}
        <div style={{
          position: 'absolute',
          bottom: isMobile ? '0.4rem' : '0.75rem',
          right: isMobile ? '0.8rem' : '1.25rem',
          padding: isMobile ? '0.12rem 0.45rem' : '0.2rem 0.7rem',
          background: tagStyle.bg, border: `1px solid ${tagStyle.border}`,
          borderRadius: '20px',
          fontSize: isMobile ? '0.58rem' : '0.68rem',
          fontWeight: 500,
          color: tagStyle.color, fontFamily: 'var(--font-body)', letterSpacing: '0.03em',
        }}>
          {project.tag || 'Project'}
        </div>
      </div>

      {/* Body */}
      <div style={{
        padding: isMobile ? '0.75rem' : '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '0.3rem' : '0.55rem',
        flex: 1,
        position: 'relative',
        zIndex: 1,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? '0.9rem' : '1.1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
          lineHeight: 1.25,
          margin: 0,
        }}>
          {title}
        </h3>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: isMobile ? '0.75rem' : '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: isMobile ? 1.4 : 1.6,
          flex: 1,
          margin: 0,
        }}>
          {desc}
        </p>

        {/* Tech stack pills */}
        {stack.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '0.2rem' : '0.3rem',
            marginTop: '0.25rem'
          }}>
            {stack.map((tech, i) => (
              <span key={i} style={{
                padding: isMobile ? '0.08rem 0.35rem' : '0.18rem 0.5rem',
                background: 'rgba(7,13,14,0.6)',
                border: '1px solid rgba(45,212,191,0.08)',
                borderRadius: '6px',
                fontSize: isMobile ? '0.58rem' : '0.68rem',
                color: 'var(--text-dim)', fontFamily: 'var(--font-body)',
              }}>
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* GitHub */}
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            color: 'var(--teal-accent)',
            fontSize: isMobile ? '0.7rem' : '0.78rem',
            fontFamily: 'var(--font-body)', textDecoration: 'none',
            transition: 'color 0.2s ease', marginTop: '0.25rem',
            alignSelf: 'flex-start',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--teal-accent)'}
        >
          <GitBranch size={13} />
          GitHub →
        </a>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Section — horizontal pin scroll (All Screens)
   ────────────────────────────────────────────── */
export default function ProjectsSection() {
  const { projects, loading } = usePortfolioData();
  const projectList = (projects || BHUSHAN_DATA.projects || []);

  const outerRef  = useRef(null);  // tall scroll-distance wrapper
  const stickyRef = useRef(null);  // sticky 100vh viewport
  const trackRef  = useRef(null);  // moving flex row
  const headerRef = useRef(null);
  const counterRef= useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [cardWidth, setCardWidth] = useState(300);
  const [cardHeight, setCardHeight] = useState(440);
  const [viewportHeight, setViewportHeight] = useState(600);
  const lastWidth = useRef(0);

  useEffect(() => {
    const updateSize = () => {
      const currentWidth = window.innerWidth;
      const isMob = currentWidth < 768;
      
      // Only recalculate viewport dimensions if window width changes.
      // This prevents browser URL bar toggles on mobile scroll from triggering layout jumps!
      if (currentWidth !== lastWidth.current) {
        lastWidth.current = currentWidth;
        setIsMobile(isMob);
        setViewportHeight(window.innerHeight);
        if (isMob) {
          setCardWidth(Math.min(270, currentWidth - 32));
          setCardHeight(window.innerHeight < 650 ? 300 : 330);
        } else {
          // Dynamic sizing on desktop to prevent card details from overlapping with bottom scroll hint/counter
          const height = Math.max(370, Math.min(440, window.innerHeight - 290));
          setCardHeight(height);
          setCardWidth(Math.round(height * 0.69));
        }
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  /* ── GSAP horizontal pin ── */
  useEffect(() => {
    if (!trackRef.current || !outerRef.current) return;
    if (projectList.length === 0) return;

    const leftPad = isMobile ? 24 : 80;
    const totalCards  = projectList.length + 1; // +1 for "View All" card
    const trackWidth  = totalCards * (cardWidth + CARD_GAP) + leftPad;
    const slideAmount = trackWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        x: -slideAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              Math.round(self.progress * projectList.length),
              projectList.length - 1
            );
            setActiveIndex(idx);
          },
        },
      });
    });

    return () => ctx.revert();
  }, [projectList, cardWidth, isMobile]);

  /* ── Header fade‑in ── */
  useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse',
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const leftPad = isMobile ? 24 : 80;
  const totalCards  = projectList.length + 1;
  const trackWidth  = totalCards * (cardWidth + CARD_GAP) + leftPad;
  const slideAmount = Math.max(trackWidth - (typeof window !== 'undefined' ? window.innerWidth : 1280), 0);

  return (
    /* Tall outer wrapper — height provides scroll distance for the pin */
    <section
      id="projects"
      ref={outerRef}
      style={{
        position: 'relative',
        height: `${viewportHeight + slideAmount}px`,
        background: 'var(--bg-secondary)',
      }}
    >
      {/* Decorative number */}
      <div className="section-deco-number" style={{ left: '-2%', top: '2%' }}>04</div>

      {/* Locked height sticky viewport */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: `${viewportHeight}px`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Header ── */}
        <div
          ref={headerRef}
          style={{
            padding: isMobile ? '2.5rem 1.5rem 1rem' : '3.5rem 5rem 1.5rem',
            flexShrink: 0,
            position: 'relative',
            zIndex: 2,
          }}
        >
          <h2 className="heading-display" style={{ fontSize: isMobile ? 'clamp(1.8rem, 6vw, 2.5rem)' : 'clamp(2.5rem, 5vw, 5rem)' }}>
            Projects I've{' '}
            <span className="serif-accent">Built</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: isMobile ? '0.85rem' : '0.95rem',
            color: 'var(--text-muted)',
            marginTop: '0.6rem',
          }}>
            {isMobile ? 'Scroll down to explore horizontally →' : 'Scroll down to explore → full-stack · AI · Web AR'}
          </p>
        </div>

        {/* ── Horizontal card track ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'visible' }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: `${CARD_GAP}px`,
              alignItems: 'center',
              paddingLeft: isMobile ? '1.5rem' : '5rem',
              paddingRight: isMobile ? '1.5rem' : '5rem',
              willChange: 'transform',
            }}
          >
            {loading ? (
              <div style={{ color: 'var(--text-muted)', padding: '3rem', fontFamily: 'var(--font-body)' }}>
                Loading projects…
              </div>
            ) : projectList.map((project, i) => (
              <ProjectCard
                key={project.id || i}
                project={project}
                index={i}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                isMobile={isMobile}
              />
            ))}

            {/* View All CTA card */}
            <a
              href="https://github.com/BhushanC23"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: isMobile ? '140px' : '160px',
                height: `${cardHeight}px`,
                flexShrink: 0,
                borderRadius: '16px',
                background: 'transparent',
                border: '1px dashed rgba(45,212,191,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-body)',
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(45,212,191,0.5)';
                e.currentTarget.style.color = 'var(--teal-accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(45,212,191,0.2)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <GitBranch size={22} />
              View All
            </a>
          </div>
        </div>

        {/* Project counter — bottom right */}
        <div
          ref={counterRef}
          style={{
            position: 'absolute',
            bottom: isMobile ? '1.25rem' : '2rem',
            right: isMobile ? '1.5rem' : '4rem',
            fontFamily: 'var(--font-display)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            color: 'var(--text-muted)',
            zIndex: 2,
          }}
        >
          {String(activeIndex + 1).padStart(2, '0')}
          <span style={{ color: 'rgba(45,212,191,0.4)' }}> / </span>
          <span style={{ color: 'var(--teal-accent)' }}>{String(projectList.length).padStart(2, '0')}</span>
        </div>

        {/* Scroll hint arrow */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: isMobile ? 'none' : 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 2,
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          opacity: activeIndex > 0 ? 0 : 0.8,
          pointerEvents: 'none',
          transition: 'opacity 0.4s ease',
        }}>
          <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
            <path d="M0 4h14M10 1l4 3-4 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          Scroll to explore
        </div>
      </div>

      <style>{`
        @keyframes hint-fade {
          from { opacity: 0.35; }
          to { opacity: 0.9; }
        }
      `}</style>
    </section>
  );
}
