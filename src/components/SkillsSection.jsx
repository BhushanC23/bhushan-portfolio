import { useEffect, useRef, useState } from 'react';
import { BHUSHAN_DATA } from '../data/bhushanData';

const CATEGORY_ICONS = {
  frontend: '⚡',
  backend: '🔧',
  database: '🗄️',
  aiml: '🤖',
  tools: '🛠️',
  specialties: '✨',
};

const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  aiml: 'AI / ML',
  tools: 'Tools & DevOps',
  specialties: 'Specialties',
};

function SkillCard({ category, skills, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(30px) scale(0.97)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="card-dark"
      style={{ padding: '1.75rem' }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        <span style={{ fontSize: '1.5rem' }}>{CATEGORY_ICONS[category]}</span>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--teal-accent)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          {CATEGORY_LABELS[category]}
        </h3>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        {skills.map((skill, i) => (
          <span
            key={i}
            className="skill-tag"
            style={{
              animationDelay: `${i * 0.05}s`,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const categories = Object.keys(BHUSHAN_DATA.skills);

  return (
    <section id="skills" style={{
      background: 'var(--teal-dark)',
      padding: '7rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div className="grid-texture" style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.3,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,212,191,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '30px', height: '1.5px', background: 'var(--teal-accent)' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--teal-accent)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>What I Work With</span>
          </div>
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
            Skills &<br />
            <span className="animated-underline">Technologies.</span>
          </h2>
        </div>

        {/* Skills grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {categories.map((category, i) => (
            <SkillCard
              key={category}
              category={category}
              skills={BHUSHAN_DATA.skills[category]}
              index={i}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #skills .container-xl > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
