import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Active section via IntersectionObserver
  useEffect(() => {
    const sections = NAV_LINKS.map(l => document.querySelector(l.href)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection('#' + entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(s => observer.observe(s));
    return () => sections.forEach(s => observer.unobserve(s));
  }, []);

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      ref={menuRef}
      style={{
        position: 'fixed',
        top: isScrolled ? '10px' : '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        width: isScrolled ? 'min(700px, 92vw)' : 'min(740px, 94vw)',
      }}
    >
      {/* Main pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isScrolled ? '0.55rem 1.25rem' : '0.65rem 1.5rem',
          background: 'rgba(7, 13, 14, 0.85)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: `1px solid ${isScrolled ? 'rgba(45,212,191,0.25)' : 'rgba(45,212,191,0.15)'}`,
          borderRadius: '50px',
          boxShadow: isScrolled ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.05rem',
            color: 'var(--teal-accent)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            textShadow: '0 0 20px rgba(45,212,191,0.4)',
            padding: 0,
            flexShrink: 0,
            transition: 'text-shadow 0.3s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => e.target.style.textShadow = '0 0 30px rgba(45,212,191,0.8)'}
          onMouseLeave={e => e.target.style.textShadow = '0 0 20px rgba(45,212,191,0.4)'}
        >
          Bhushan
        </button>

        {/* Divider */}
        <div style={{
          width: '1px',
          height: '18px',
          background: 'rgba(45,212,191,0.2)',
          flexShrink: 0,
          marginLeft: '1.2rem',
          marginRight: '0.5rem',
        }} />

        {/* Desktop nav links */}
        <div
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            flex: 1,
          }}
        >
          {NAV_LINKS.map(link => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: activeSection === link.href ? 'var(--teal-accent)' : 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '0.875rem',
                letterSpacing: '0.01em',
                padding: '0.35rem 0',
                position: 'relative',
                transition: 'color 0.25s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                if (activeSection !== link.href) e.currentTarget.style.color = 'rgba(240,244,244,0.9)';
              }}
              onMouseLeave={e => {
                if (activeSection !== link.href) e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              {link.label}
              {activeSection === link.href && (
                <span style={{
                  position: 'absolute',
                  bottom: '0px',
                  left: 0,
                  width: '100%',
                  height: '1.5px',
                  background: 'var(--teal-accent)',
                  borderRadius: '1px',
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Hire Me CTA */}
        <a
          href="mailto:bhushan.chaturbhuj_25pca@sanjivani.edu.in"
          className="desktop-nav"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.45rem 1.1rem',
            background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
            color: '#070d0e',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '0.82rem',
            borderRadius: '50px',
            textDecoration: 'none',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            marginLeft: '1rem',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(45,212,191,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Hire Me
        </a>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--teal-accent)',
            cursor: 'pointer',
            padding: '0.25rem',
            marginLeft: '0.5rem',
          }}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: isMenuOpen ? '360px' : '0',
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          marginTop: '0.4rem',
        }}
      >
        <div
          style={{
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
            background: 'rgba(7,13,14,0.9)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(45,212,191,0.15)',
            borderRadius: '16px',
          }}
        >
          {NAV_LINKS.map(link => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: activeSection === link.href ? 'var(--teal-accent)' : 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '1rem',
                textAlign: 'left',
                padding: '0.5rem 0',
                transition: 'color 0.2s ease',
                borderBottom: '1px solid rgba(45,212,191,0.07)',
              }}
            >
              {link.label}
            </button>
          ))}
          <a
            href="/Bhushan_Chaturbhuj_Resume.pdf"
            download="Bhushan_Chaturbhuj_Resume.pdf"
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '0.6rem',
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.3)',
              color: 'var(--gold-accent)',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: '50px',
              textDecoration: 'none',
              marginTop: '0.25rem',
            }}
          >
            Download Resume 📄
          </a>
          <a
            href="mailto:bhushan.chaturbhuj_25pca@sanjivani.edu.in"
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '0.6rem',
              background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
              color: '#070d0e',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.9rem',
              borderRadius: '50px',
              textDecoration: 'none',
              marginTop: '0.25rem',
            }}
          >
            Hire Me
          </a>
        </div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
