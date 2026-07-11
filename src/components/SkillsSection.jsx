import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BHUSHAN_DATA } from '../data/bhushanData';
import { usePortfolioData } from '../hooks/usePortfolioData';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────
   Category config — icon, label, accent color, bg
   ───────────────────────────────────────────────────── */
const CATEGORIES = [
  {
    key: 'frontend',
    label: 'Frontend & UX',
    icon: '⚡',
    accent: '#d4ff3d',
    bg: '#111109',        // olive-dark (lime tint) — default
    desc: 'Building fast, beautiful, highly interactive interfaces',
  },
  {
    key: 'backend',
    label: 'Backend & APIs',
    icon: '🔧',
    accent: '#94a3b8',
    bg: '#0e0e10',        // very dark cool grey
    desc: 'Scalable server architecture and REST API design',
  },
  {
    key: 'database',
    label: 'Databases',
    icon: '🗄️',
    accent: '#c9a84c',
    bg: '#130f00',        // very dark amber tint
    desc: 'Data persistence, querying and cloud storage',
  },
  {
    key: 'aiml',
    label: 'AI / ML & LLMs',
    icon: '🤖',
    accent: '#e0b4ff',
    bg: '#110d18',        // very dark grape tint
    desc: 'Model training, SFT, RLHF workflows and inference',
  },
  {
    key: 'tools',
    label: 'Tools & DevOps',
    icon: '🛠',
    accent: '#86efac',
    bg: '#071009',        // very dark forest-green tint
    desc: 'Workflows, version control and deployment pipelines',
  },
  {
    key: 'specialties',
    label: 'Specialties',
    icon: '✨',
    accent: '#f9a8d4',
    bg: '#130008',        // very dark rose tint
    desc: 'Creative web, 3D, and immersive AR/XR experiences',
  },
];

/* Marquee dot colors */
const MARQUEE_COLORS = {
  frontend: '#d4ff3d',
  backend: '#60a5fa',
  database: '#c9a84c',
  aiml: '#a78bfa',
  tools: '#34d399',
  specialties: '#f472b6',
};

/* ─────────────────────────────────────────────────────
   Single Category Tab Card
   ───────────────────────────────────────────────────── */
function CategoryCard({ cat, isActive, onClick, skillCount }) {
  const [hovered, setHovered] = useState(false);
  const active = isActive || hovered;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="skill-cat-card"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.25rem',
        borderRadius: '20px',
        border: `2px solid ${isActive ? cat.accent : 'rgba(255,255,255,0.1)'}`,
        background: isActive ? cat.bg : 'rgba(255,255,255,0.03)',
        boxShadow: isActive ? `0 0 32px ${cat.accent}22, 4px 4px 0px ${cat.accent}` : 'none',
        transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '140px',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        textAlign: 'left',
        outline: 'none',
        margin: 0,
        transform: isActive ? 'translateY(-4px)' : hovered ? 'translateY(-2px)' : 'none',
      }}
    >
      {/* Glow blob on active */}
      {isActive && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 30% 30%, ${cat.accent}18, transparent 65%)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Icon */}
      <div style={{
        fontSize: '1.6rem',
        lineHeight: 1,
        marginBottom: '0.5rem',
        filter: isActive ? 'none' : 'grayscale(0.5) opacity(0.7)',
        transition: 'filter 0.3s ease',
      }}>
        {cat.icon}
      </div>

      {/* Label */}
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.9rem',
          fontWeight: 700,
          color: isActive ? cat.accent : 'rgba(255,255,255,0.6)',
          letterSpacing: '-0.01em',
          lineHeight: 1.2,
          marginBottom: '0.4rem',
          transition: 'color 0.3s ease',
        }}>
          {cat.label}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.7rem',
          color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)',
          lineHeight: 1.4,
          transition: 'color 0.3s ease',
        }}>
          {skillCount} skills
        </div>
      </div>

      {/* Active indicator bottom line */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '3px',
        background: isActive ? cat.accent : 'transparent',
        borderRadius: '0 0 20px 20px',
        transition: 'background 0.3s ease',
      }} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────
   Skill Pill — animated entry
   ───────────────────────────────────────────────────── */
function SkillPill({ name, accent, delay }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current,
      { opacity: 0, y: 16, scale: 0.88 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.5)', delay }
    );
  }, [delay]);

  return (
    <span
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.55rem 1.1rem',
        borderRadius: '100px',
        border: `1.5px solid ${hovered ? accent : 'rgba(255,255,255,0.15)'}`,
        background: hovered ? `${accent}18` : 'rgba(255,255,255,0.04)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.88rem',
        fontWeight: 500,
        color: hovered ? accent : 'rgba(255,255,255,0.75)',
        letterSpacing: '0.01em',
        cursor: 'default',
        transition: 'all 0.22s ease',
        whiteSpace: 'nowrap',
        boxShadow: hovered ? `0 0 14px ${accent}30` : 'none',
      }}
    >
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: accent,
        flexShrink: 0,
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 0.2s',
      }} />
      {name}
    </span>
  );
}

/* ─────────────────────────────────────────────────────
   Active Category Detail Panel
   ───────────────────────────────────────────────────── */
function SkillPanel({ cat, skills, key: _k }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [cat.key]);

  return (
    <div ref={panelRef} style={{
      padding: '2.5rem 2rem',
      borderRadius: '24px',
      border: `1.5px solid ${cat.accent}30`,
      background: cat.bg,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '260px', height: '260px', borderRadius: '50%',
        background: `radial-gradient(circle, ${cat.accent}14, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <div style={{
            fontSize: '2rem', lineHeight: 1, marginBottom: '0.5rem'
          }}>{cat.icon}</div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '0.3rem',
          }}>{cat.label}</h3>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '320px',
          }}>{cat.desc}</p>
        </div>

        {/* Count badge */}
        <div style={{
          padding: '0.4rem 0.9rem',
          borderRadius: '100px',
          background: `${cat.accent}22`,
          border: `1px solid ${cat.accent}40`,
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          fontWeight: 800,
          color: cat.accent,
          flexShrink: 0,
        }}>
          {skills.length}
        </div>
      </div>

      {/* Skill pills — staggered in */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
        {skills.map((skill, i) => (
          <SkillPill key={`${cat.key}-${i}`} name={skill} accent={cat.accent} delay={i * 0.04} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Main Section
   ───────────────────────────────────────────────────── */
export default function SkillsSection() {
  const { skills } = usePortfolioData();
  const skillsData = skills || BHUSHAN_DATA.skills || {};
  const sectionRef = useRef(null);
  const headerRef  = useRef(null);
  const cardsRef   = useRef(null);
  const glowTopRef = useRef(null);   // top-right ambient glow blob
  const glowBotRef = useRef(null);   // bottom-left ambient glow blob
  const [activeKey, setActiveKey] = useState('frontend');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Animate section background + glow blobs on category switch ──
  useEffect(() => {
    const cat = CATEGORIES.find(c => c.key === activeKey);
    if (!cat || !sectionRef.current) return;

    gsap.to(sectionRef.current, {
      backgroundColor: cat.bg,
      duration: 0.55,
      ease: 'power2.inOut',
    });

    // Shift glow blobs to active category accent
    const glowColor = cat.accent;
    if (glowTopRef.current) {
      gsap.to(glowTopRef.current, {
        background: `radial-gradient(circle, ${glowColor}12 0%, transparent 65%)`,
        duration: 0.6, ease: 'power2.out',
      });
    }
    if (glowBotRef.current) {
      gsap.to(glowBotRef.current, {
        background: `radial-gradient(circle, ${glowColor}08 0%, transparent 65%)`,
        duration: 0.6, ease: 'power2.out',
      });
    }
  }, [activeKey]);

  // Header entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
              once: true,
            }
          }
        );
      }
      // Stagger category cards entrance
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.skill-cat-card');
        gsap.fromTo(cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0,
            stagger: 0.08,
            duration: 0.6, ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
              once: true,
            }
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const activeCat    = CATEGORIES.find(c => c.key === activeKey) || CATEGORIES[0];
  const activeSkills = skillsData[activeKey] || [];

  // Build marquee rows
  const allSkillsFlat = CATEGORIES.flatMap(c =>
    (skillsData[c.key] || []).map(s => ({ name: s, cat: c.key, accent: c.accent }))
  );
  const row1 = allSkillsFlat.slice(0, Math.ceil(allSkillsFlat.length / 2));
  const row2 = allSkillsFlat.slice(Math.ceil(allSkillsFlat.length / 2));
  const row1d = [...row1, ...row1];
  const row2d = [...row2, ...row2];

  return (
    <section id="skills" ref={sectionRef} style={{
      background: '#111109',
      padding: isMobile ? '6rem 0 4rem' : '10rem 0 5rem',
      position: 'relative',
      zIndex: 20,
      overflow: 'hidden',
      boxShadow: '0 -24px 80px rgba(0,0,0,0.85)',
    }}>

      {/* ── Background decorations ── */}
      {/* Lime glow — top right */}
      <div ref={glowTopRef} style={{
        position: 'absolute', top: '-60px', right: '5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,255,61,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      {/* Faint shimmer — bottom left */}
      <div ref={glowBotRef} style={{
        position: 'absolute', bottom: '5%', left: '-80px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,255,61,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Horizontal rule */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Section Header ── */}
        <div ref={headerRef} style={{ marginBottom: '3.5rem' }}>
          {/* Pill label */}
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
            marginBottom: '1rem',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-lime)', flexShrink: 0 }} />
            Skills & Stack
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 className="heading-display" style={{ color: '#ffffff', margin: 0 }}>
              Skills &amp;{' '}
              <span className="serif-accent" style={{ color: 'var(--accent-lime)' }}>Technologies</span>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'rgba(255,255,255,0.4)',
              maxWidth: '340px',
              lineHeight: 1.6,
              margin: 0,
            }}>
              Tools and technologies I use to build fast, beautiful, and intelligent experiences.
            </p>
          </div>
        </div>

        {/* ── Category Grid ── */}
        <div
          ref={cardsRef}
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          {CATEGORIES.map(cat => (
            <CategoryCard
              key={cat.key}
              cat={cat}
              isActive={activeKey === cat.key}
              onClick={() => setActiveKey(cat.key)}
              skillCount={(skillsData[cat.key] || []).length}
            />
          ))}
        </div>

        {/* ── Skill Detail Panel ── */}
        <SkillPanel key={activeKey} cat={activeCat} skills={activeSkills} />

        {/* ── Total count stat row ── */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          marginTop: '2rem',
          flexWrap: 'wrap',
        }}>
          {CATEGORIES.map(cat => (
            <div key={cat.key} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              opacity: activeKey === cat.key ? 1 : 0.35,
              transition: 'opacity 0.3s',
              cursor: 'pointer',
            }} onClick={() => setActiveKey(cat.key)}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cat.accent }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Marquee Rows ── */}
      <div style={{ marginTop: '4rem' }}>
        {/* Row 1 — left */}
        <div className="marquee-wrapper" style={{ marginBottom: '0.75rem' }}>
          <div className="marquee-track">
            {row1d.map((s, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 1rem',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.5)',
                whiteSpace: 'nowrap',
                marginRight: '0.75rem',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: MARQUEE_COLORS[s.cat] || '#fff', flexShrink: 0 }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 — right */}
        <div className="marquee-wrapper">
          <div className="marquee-track reverse">
            {row2d.map((s, i) => (
              <span key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.4rem 1rem',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.03)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.5)',
                whiteSpace: 'nowrap',
                marginRight: '0.75rem',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: MARQUEE_COLORS[s.cat] || '#fff', flexShrink: 0 }} />
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #skills { padding: 5rem 0 3rem !important; }
        }
      `}</style>
    </section>
  );
}
