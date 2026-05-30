import { useEffect, useRef, useState } from 'react';
import { GitBranch, ExternalLink } from 'lucide-react';
import { BHUSHAN_DATA } from '../data/bhushanData';

const TAG_COLORS = {
  'Full Stack': { bg: 'rgba(45,212,191,0.1)', border: 'rgba(45,212,191,0.25)', color: 'var(--teal-accent)' },
  'Full Stack + CMS': { bg: 'rgba(45,212,191,0.1)', border: 'rgba(45,212,191,0.25)', color: 'var(--teal-accent)' },
  'Utility Tool': { bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.25)', color: 'var(--gold-accent)' },
  'AR / Web XR': { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', color: '#a78bfa' },
  'AR': { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)', color: '#a78bfa' },
  'AI/ML': { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)', color: '#fb923c' },
};

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const tagStyle = TAG_COLORS[project.tag] || TAG_COLORS['Full Stack'];

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    el.style.opacity = '0';
    el.style.transform = 'translateY(40px) scale(0.96)';
    el.style.transition = `opacity 0.65s ease ${index * 0.1}s, transform 0.65s ease ${index * 0.1}s`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) scale(1)';
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--teal-mid)',
        borderRadius: '16px',
        border: `1px solid ${hovered ? 'rgba(45,212,191,0.35)' : 'rgba(45,212,191,0.08)'}`,
        borderTop: `3px solid ${hovered ? 'var(--teal-accent)' : 'rgba(45,212,191,0.3)'}`,
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.5), 0 0 25px rgba(45,212,191,0.08)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Featured badge */}
      {project.featured && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.2rem 0.6rem',
          background: 'rgba(201,168,76,0.15)',
          border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: '20px',
          fontSize: '0.65rem',
          fontWeight: 700,
          color: 'var(--gold-accent)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          ⭐ Featured
        </div>
      )}

      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          padding: '0.25rem 0.75rem',
          background: tagStyle.bg,
          border: `1px solid ${tagStyle.border}`,
          borderRadius: '20px',
          fontSize: '0.72rem',
          fontWeight: 600,
          color: tagStyle.color,
          letterSpacing: '0.03em',
        }}>
          {project.tag}
        </span>

        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--text-muted)',
            transition: 'color 0.2s ease',
            marginTop: project.featured ? '1.5rem' : '0',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--teal-accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          aria-label={`GitHub repo for ${project.name}`}
        >
          <GitBranch size={18} />
        </a>
      </div>

      {/* Project name */}
      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
        }}>
          {project.name}
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          color: 'rgba(240,244,244,0.65)',
          lineHeight: 1.65,
        }}>
          {project.description}
        </p>
      </div>

      {/* Stack pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'auto' }}>
        {project.stack.map((tech, i) => (
          <span key={i} style={{
            padding: '0.2rem 0.65rem',
            background: 'rgba(7,13,14,0.5)',
            border: '1px solid rgba(45,212,191,0.1)',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
          }}>
            {tech}
          </span>
        ))}
      </div>

      {/* Hover glow effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% -20%, rgba(45,212,191,0.05) 0%, transparent 60%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" style={{
      background: 'var(--bg-secondary)',
      padding: '7rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(45,212,191,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
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
            }}>Portfolio</span>
          </div>
          <h2 className="section-title" style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Projects I've<br />
            <span className="animated-underline">Built.</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            maxWidth: '500px',
          }}>
            From full-stack platforms to AI models and Web AR experiences — here's what I've shipped.
          </p>
        </div>

        {/* Project Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {BHUSHAN_DATA.projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <a
            href="https://github.com/BhushanC23"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ textDecoration: 'none', display: 'inline-flex', gap: '0.5rem' }}
          >
            <GitBranch size={18} />
            View All on GitHub
          </a>
        </div>
      </div>

      <style>{`
        /* === PROJECTS RESPONSIVE === */
        @media (max-width: 768px) {
          #projects {
            padding: 4rem 0 !important;
          }
          #projects .container-xl > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          #projects {
            padding: 3rem 0 !important;
          }
        }
      `}</style>
    </section>
  );
}
