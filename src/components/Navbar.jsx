import { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#about',      label: 'About' },
  { href: '#skills',     label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects',   label: 'Projects' },
  { href: '#contact',    label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled,    setIsScrolled]    = useState(false);
  const [isMenuOpen,    setIsMenuOpen]    = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [indicatorStyle,setIndicatorStyle]= useState({});
  const linksRef = useRef([]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map(l => document.querySelector(l.href)).filter(Boolean);
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection('#' + e.target.id); }),
      { threshold: 0.35 }
    );
    sections.forEach(s => observer.observe(s));
    return () => sections.forEach(s => observer.unobserve(s));
  }, []);

  /* sliding pill indicator */
  useEffect(() => {
    const idx = NAV_LINKS.findIndex(l => l.href === activeSection);
    if (idx < 0 || !linksRef.current[idx]) { setIndicatorStyle({ opacity: 0 }); return; }
    const el = linksRef.current[idx];
    setIndicatorStyle({ opacity: 1, left: el.offsetLeft, width: el.offsetWidth });
  }, [activeSection]);

  /* close menu on outside click */
  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.navbar-mobile')) setIsMenuOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [isMenuOpen]);

  const handleNavClick = (href) => {
    setIsMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ────────────────────────────────
          DESKTOP  floating capsule
          ──────────────────────────────── */}
      <nav
        className="navbar-capsule"
        style={{
          position: 'fixed',
          top: isScrolled ? '1rem' : '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          borderRadius: '100px',
          padding: '0 6px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          background: isScrolled
            ? 'rgba(17, 17, 17, 0.92)'
            : 'rgba(17, 17, 17, 0.65)',
          backdropFilter: 'blur(24px) saturate(160%)',
          WebkitBackdropFilter: 'blur(24px) saturate(160%)',
          border: `1px solid ${isScrolled ? 'rgba(212,255,61,0.25)' : 'rgba(212,255,61,0.12)'}`,
          boxShadow: isScrolled
            ? '0 8px 40px rgba(0,0,0,0.35), inset 0 0 24px rgba(212,255,61,0.04)'
            : '0 4px 20px rgba(0,0,0,0.2)',
          transition: 'top 0.4s ease, background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
          whiteSpace: 'nowrap',
        }}
      >
        {/* Sliding active indicator */}
        <span aria-hidden style={{
          position: 'absolute',
          top: '6px',
          height: 'calc(100% - 12px)',
          borderRadius: '100px',
          background: 'rgba(212,255,61,0.12)',
          border: '1px solid rgba(212,255,61,0.25)',
          transition: 'left 0.35s cubic-bezier(0.4,0,0.2,1), width 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.2s',
          pointerEvents: 'none',
          zIndex: 0,
          ...indicatorStyle,
        }} />

        {NAV_LINKS.map((link, i) => {
          const isActive = activeSection === link.href;
          return (
            <button
              key={link.href}
              ref={el => linksRef.current[i] = el}
              onClick={() => handleNavClick(link.href)}
              style={{
                position: 'relative', zIndex: 1,
                background: 'none', border: 'none', cursor: 'pointer',
                height: '40px', padding: '0 1rem',
                display: 'flex', alignItems: 'center',
                fontFamily: 'var(--font-body)',
                fontSize: '12px', fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: isActive ? 'var(--accent-lime)' : 'rgba(240,244,244,0.60)',
                transition: 'color 0.2s ease',
                borderRadius: '100px',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'rgba(240,244,244,0.9)'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(240,244,244,0.60)'; }}
            >
              {link.label}
            </button>
          );
        })}

        <div style={{ width: '1px', height: '18px', background: 'rgba(212,255,61,0.2)', margin: '0 4px', flexShrink: 0 }} />

        <button
          onClick={() => handleNavClick('#contact')}
          style={{
            position: 'relative', zIndex: 1,
            display: 'inline-flex', alignItems: 'center',
            padding: '0 1.25rem', height: '38px', marginRight: '2px',
            background: 'var(--accent-lime)',
            border: 'none',
            borderRadius: '100px',
            fontFamily: 'var(--font-body)', fontWeight: 800,
            fontSize: '11.5px', letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#111111', cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.25s cubic-bezier(0.25,1,0.5,1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,255,61,0.40)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Connect
        </button>
      </nav>

      {/* ────────────────────────────────
          MOBILE  floating pill drawer
          ──────────────────────────────── */}
      <div
        className="navbar-mobile"
        style={{
          position: 'fixed',
          top: '0.75rem',
          left: '1rem',
          right: '1rem',
          zIndex: 1000,
          borderRadius: '18px',
          overflow: 'hidden',
          background: 'rgba(17,17,17,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(212,255,61,0.16)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.1rem',
          height: '50px',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px', fontWeight: 700,
            color: 'var(--accent-lime)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            Bhushan
          </span>

          <button
            onClick={() => setIsMenuOpen(v => !v)}
            style={{
              background: 'rgba(212,255,61,0.08)',
              border: '1px solid rgba(212,255,61,0.15)',
              borderRadius: '10px',
              color: 'var(--accent-lime)',
              cursor: 'pointer',
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>

        {/* Dropdown */}
        <div style={{
          maxHeight: isMenuOpen ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{ padding: '0.25rem 0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV_LINKS.map(link => {
              const isActive = activeSection === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  style={{
                    background: isActive ? 'rgba(212,255,61,0.10)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: isActive ? 'var(--accent-lime)' : 'rgba(240,244,244,0.65)',
                    fontFamily: 'var(--font-body)', fontWeight: isActive ? 600 : 400,
                    fontSize: '13px', letterSpacing: '0.07em', textTransform: 'uppercase',
                    textAlign: 'left',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    minHeight: '44px',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {isActive && (
                    <span style={{
                      display: 'inline-block', width: '4px', height: '4px',
                      borderRadius: '50%', background: 'var(--teal-accent)',
                      marginRight: '0.6rem', flexShrink: 0,
                    }} />
                  )}
                  {link.label}
                </button>
              );
            })}

            <button
              onClick={() => handleNavClick('#contact')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                minHeight: '44px', marginTop: '0.4rem',
                background: 'var(--accent-lime)',
                border: 'none',
                borderRadius: '12px',
                color: '#111',
                fontFamily: 'var(--font-body)', fontWeight: 600,
                fontSize: '12.5px', letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Connect ✦
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .navbar-capsule { display: flex !important; }
        .navbar-mobile  { display: none !important; }
        @media (max-width: 820px) {
          .navbar-capsule { display: none !important; }
          .navbar-mobile  { display: block !important; }
        }
      `}</style>
    </>
  );
}
