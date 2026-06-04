import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BHUSHAN_DATA } from '../data/bhushanData';
import { usePortfolioData } from '../hooks/usePortfolioData';

gsap.registerPlugin(ScrollTrigger);

// Category dot colors
const CATEGORY_DOT_COLORS = {
  frontend: '#2dd4bf',
  backend: '#5eead4',
  database: '#c9a84c',
  aiml: '#fb923c',
  tools: '#a78bfa',
  specialties: '#f9a8d4',
};

export default function SkillsSection() {
  const { skills } = usePortfolioData();
  const skillsData = skills || BHUSHAN_DATA.skills;
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  // Build flat skill lists for two marquee rows
  const row1Skills = [
    ...(skillsData.frontend || []).map(s => ({ name: s, cat: 'frontend' })),
    ...(skillsData.backend || []).map(s => ({ name: s, cat: 'backend' })),
    ...(skillsData.database || []).map(s => ({ name: s, cat: 'database' })),
  ];
  const row2Skills = [
    ...(skillsData.aiml || []).map(s => ({ name: s, cat: 'aiml' })),
    ...(skillsData.tools || []).map(s => ({ name: s, cat: 'tools' })),
    ...(skillsData.specialties || []).map(s => ({ name: s, cat: 'specialties' })),
  ];

  // Duplicate for seamless loop
  const row1Doubled = [...row1Skills, ...row1Skills];
  const row2Doubled = [...row2Skills, ...row2Skills];

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
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} style={{
      background: 'var(--teal-dark)',
      padding: '10rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative number */}
      <div className="section-deco-number" style={{ left: '-2%', top: '-5%' }}>02</div>

      <div className="grid-texture" style={{
        position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1, marginBottom: '4rem' }}>
        {/* Section header */}
        <div ref={headerRef} style={{ marginBottom: '2rem' }}>
          <h2 className="heading-display">
            Skills &amp;{' '}
            <span className="serif-accent">Technologies</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--text-muted)',
            marginTop: '1rem',
            maxWidth: '480px',
          }}>
            Tools and technologies I use to build fast, beautiful, and intelligent experiences.
          </p>
        </div>
      </div>

      {/* Marquee Row 1 — moves LEFT */}
      <div className="marquee-wrapper" style={{ marginBottom: '1rem' }}>
        <div className="marquee-track">
          {row1Doubled.map((skill, i) => (
            <span key={i} className="skill-tag">
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: CATEGORY_DOT_COLORS[skill.cat] || 'var(--teal-accent)',
                flexShrink: 0,
              }} />
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 — moves RIGHT */}
      <div className="marquee-wrapper">
        <div className="marquee-track reverse">
          {row2Doubled.map((skill, i) => (
            <span key={i} className="skill-tag">
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: CATEGORY_DOT_COLORS[skill.cat] || 'var(--gold-accent)',
                flexShrink: 0,
              }} />
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #skills { padding: 6rem 0 !important; }
        }
      `}</style>
    </section>
  );
}
