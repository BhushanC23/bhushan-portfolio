import { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollVideo } from '../hooks/useScrollVideo';
import Navbar from './Navbar';
import { usePortfolioData } from '../hooks/usePortfolioData';
import TopographicBackground from './TopographicBackground';
import BlobShape from './BlobShape';

/* ─────────────────────────────────────────────────────────────────────────────
   PHASE MAP  (based on frame analysis)
   F001–080   dark bg, face angled top-right → safe zone: bottom-left + right edge
   F081–120   bg transitioning dark→olive   → full-width text centered
   F121–200   bg going grey→cream, face up  → safe zone: top-left
   F201–240   white bg, face front-center   → safe zone: left column
───────────────────────────────────────────────────────────────────────────── */
const PHASES = [
  {
    id: 'ph-1',
    showAt: 0.00, hideAt: 0.30,
    // large name split top-left + role bottom-right
  },
  {
    id: 'ph-2',
    showAt: 0.30, hideAt: 0.55,
    // center-screen statement
  },
  {
    id: 'ph-3',
    showAt: 0.55, hideAt: 0.78,
    // top-left minimal tag
  },
  {
    id: 'ph-4',
    showAt: 0.78, hideAt: 2.0,
    // left-column final CTA
  },
];

// Adaptive text colour based on bg brightness
function textColor(progress) {
  // 0–0.35 → white (dark bg), 0.35–0.55 → crossfade, 0.55+ → dark (#111)
  if (progress < 0.30) return { h: '#ffffff', s: 'rgba(255,255,255,0.55)', tag: 'rgba(255,255,255,0.12)', tagBorder: 'rgba(255,255,255,0.22)', tagText: '#fff' };
  if (progress > 0.60) return { h: '#111111', s: 'rgba(17,17,17,0.55)', tag: 'rgba(17,17,17,0.06)', tagBorder: 'rgba(17,17,17,0.18)', tagText: '#111' };
  const t = (progress - 0.30) / 0.30;
  const lerp = (a, b) => Math.round(a + (b - a) * t);
  const fg = lerp(255, 17);
  return {
    h: `rgb(${fg},${fg},${fg})`,
    s: `rgba(${fg},${fg},${fg},0.55)`,
    tag: `rgba(${fg},${fg},${fg},0.08)`,
    tagBorder: `rgba(${fg},${fg},${fg},0.2)`,
    tagText: `rgb(${fg},${fg},${fg})`,
  };
}

export default function HeroSection({ images = [] }) {
  const { heroText } = usePortfolioData();
  const stickyRef = useRef(null);
  const progressRef = useRef(0);

  /* ── DOM-driven animation callback (runs every RAF, no React re-render) ── */
  const updateHeroDomStyles = useCallback((progress) => {
    progressRef.current = progress;
    const tc = textColor(progress);

    /* 1 ── Background crossfade: black(0) → white(1) */
    const sticky = stickyRef.current;
    if (sticky) {
      const v = Math.round(progress * 255);
      sticky.style.backgroundColor = `rgb(${v},${v},${v})`;
    }

    /* 2 ── Phase visibility */
    PHASES.forEach(({ id, showAt, hideAt }) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (progress < showAt || progress >= hideAt) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        return;
      }
      const IN_DUR  = 0.06;
      const OUT_DUR = 0.07;
      let op = 1;
      if (progress < showAt + IN_DUR)  op = (progress - showAt) / IN_DUR;
      if (progress > hideAt - OUT_DUR) op = (hideAt - progress) / OUT_DUR;
      op = Math.min(Math.max(op, 0), 1);

      el.style.opacity = String(op);
      el.style.pointerEvents = op > 0.1 ? 'auto' : 'none';
    });

    /* 3 ── Adaptive text colours in each phase (outline vs solid text handling) */
    const nameEl = document.getElementById('ph-1-name');
    if (nameEl) {
      nameEl.style.webkitTextStrokeColor = tc.h;
      nameEl.style.color = 'transparent';
    }
    const roleEl = document.getElementById('ph-1-role');
    if (roleEl) roleEl.style.color = tc.h;

    const stOutline = document.getElementById('ph-2-statement-outline');
    if (stOutline) {
      stOutline.style.webkitTextStrokeColor = tc.h;
      stOutline.style.color = 'transparent';
    }
    const stSolid = document.getElementById('ph-2-statement-solid');
    if (stSolid) stSolid.style.color = tc.h;

    ['ph-3-label','ph-4-cta-head'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.color = tc.h;
    });
    ['ph-1-sub','ph-2-sub','ph-3-sub','ph-4-sub'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.color = tc.s;
    });
    document.querySelectorAll('.hero-tag-pill').forEach(el => {
      el.style.background = tc.tag;
      el.style.borderColor = tc.tagBorder;
      el.style.color = tc.tagText;
    });

    /* 4 ── Scroll progress bar */
    const bar  = document.getElementById('h-scroll-bar');
    const track= document.getElementById('h-scroll-track');
    const lbl  = document.getElementById('h-scroll-lbl');
    if (bar)   { bar.style.height = `${progress * 100}%`; bar.style.background   = tc.h; }
    if (track) track.style.background = tc.tag;
    if (lbl)   lbl.style.color = tc.s;

    /* 5 ── Scroll hint fade */
    const hint = document.getElementById('h-hint');
    if (hint) hint.style.opacity = progress < 0.05 ? `${1 - progress * 20}` : '0';

    /* 6 ── Phase dots */
    document.querySelectorAll('.h-dot').forEach((dot, i) => {
      const phase = PHASES[i];
      const active = phase && progress >= phase.showAt && progress < phase.hideAt;
      dot.style.width     = active ? '22px' : '5px';
      dot.style.background= active ? tc.h : tc.tag;
    });

    /* 7 ── Ticker bar color adapt */
    const ticker = document.getElementById('h-ticker');
    if (ticker) ticker.style.borderTopColor = tc.tagBorder;

    /* 8 ── Frame counter */
    const counter = document.getElementById('h-frame-counter');
    if (counter) {
      const frame = Math.round(progress * 239) + 1;
      counter.textContent = String(frame).padStart(3, '0');
      counter.style.color = tc.s;
    }

  }, []);

  const { canvasRef, containerRef } = useScrollVideo(updateHeroDomStyles, images);

  return (
    <section
      ref={containerRef}
      style={{ position: 'relative', height: '300vh' }}
    >
      <style>{`
        /* ── Ticker scroll ── */
        @keyframes ticker-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        /* ── Scroll line pulse ── */
        @keyframes scroll-line-pulse {
          0%   { opacity:0.3; transform:scaleY(0.5); }
          50%  { opacity:1;   transform:scaleY(1);   }
          100% { opacity:0.3; transform:scaleY(0.5); }
        }
        /* ── Word reveal clip ── */
        @keyframes word-reveal {
          from { clip-path: inset(0 100% 0 0); opacity:0; }
          to   { clip-path: inset(0 0% 0 0);   opacity:1; }
        }
        /* ── Soft float ── */
        @keyframes soft-float {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }

        /* ── Mobile hero height ── */
        @media (max-width:768px){
          .hero-scroll-pin { height:135vh !important; }
        }
        /* ── Hide phase 2+3 on small screens ── */
        @media (max-width:640px){
          #ph-2, #ph-3 { display:none !important; }
        }
      `}</style>

      {/* ══════════════════ STICKY VIEWPORT ══════════════════ */}
      <div
        ref={stickyRef}
        className="hero-scroll-pin"
        style={{
          position: 'sticky', top: 0,
          height: '100vh', overflow: 'hidden',
          backgroundColor: '#000',
        }}
      >
        {/* ── Canvas (frame sequence) ── */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            display: 'block', pointerEvents: 'none',
            opacity: images.length > 0 ? 1 : 0,
            objectFit: 'cover',
            zIndex: 2,
          }}
        />

        {/* ── Topographic Elevation Overlay (Difference blend mode makes it white on black bg and black on white bg) ── */}
        <TopographicBackground stroke="#ffffff" opacity={0.12} zIndex={3} mixBlendMode="difference" />

        {/* ── Organic Ambient Light Spotlights (overlayed on canvas) ── */}
        <BlobShape zIndex={3} mixBlendMode="soft-light" opacity1={0.15} opacity2={0.12} />

        {/* ── Navbar ── */}
        <Navbar />

        {/* ══════════════════════════════════════════════════
            PHASE 1 (F001–F072) — Dark bg, face angled top-right
            Layout: HUGE name bottom-left, role chip top-right
        ══════════════════════════════════════════════════ */}
        <div id="ph-1" style={{
          position: 'absolute', inset: 0,
          opacity: 1, transition: 'none',
          pointerEvents: 'auto',
          zIndex: 5,
        }}>
          {/* Top-right role tag — sits in dark negative space */}
          <div style={{
            position: 'absolute',
            top: '18%', right: '4%',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            gap: '0.6rem',
          }}>
            <span className="hero-tag-pill" style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', fontFamily: 'var(--font-body)',
              padding: '0.3rem 0.9rem', borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.22)',
              background: 'rgba(255,255,255,0.12)', color: '#fff',
              transition: 'none',
            }}>MCA Student</span>
            <span className="hero-tag-pill" style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em',
              textTransform: 'uppercase', fontFamily: 'var(--font-body)',
              padding: '0.3rem 0.9rem', borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.22)',
              background: 'rgba(255,255,255,0.12)', color: '#fff',
              transition: 'none',
            }}>LLM AI Intern</span>
          </div>

          {/* Huge editorial name — bottom-left, face is upper-right */}
          <div style={{
            position: 'absolute',
            bottom: '10%', left: '4%',
            zIndex: 5,
          }}>
            {/* Eyebrow */}
            <div id="ph-1-sub" style={{
              fontFamily: 'var(--font-body)', fontSize: '11px',
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '0.6rem',
              transition: 'none',
            }}>Full Stack Developer</div>

            {/* BHUSHAN — giant display outline */}
            <div id="ph-1-name" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 9.5vw, 8.5rem)',
              fontWeight: 900, lineHeight: 0.82,
              letterSpacing: '-0.03em',
              color: 'transparent',
              WebkitTextStroke: '1.5px currentColor',
              transition: 'none',
            }}>
              BHUSHAN
            </div>

            {/* CHATURBHUJ in italic serif — offset right */}
            <div id="ph-1-role" style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic', fontWeight: 300,
              fontSize: 'clamp(2rem, 5.5vw, 5.5rem)',
              letterSpacing: '-0.02em',
              color: 'rgba(255,255,255,0.9)',
              marginLeft: 'clamp(1.5rem, 4vw, 5rem)',
              lineHeight: 1,
              transition: 'none',
            }}>
              Chaturbhuj.
            </div>

            {/* Bottom rule + year */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              marginTop: '1.5rem',
            }}>
              <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '10px',
                color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em',
              }}>©2025</span>
              <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)' }} />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            PHASE 2 (F073–F132) — bg transitioning, face straightening
            Layout: centered full-width "I BUILD THINGS" statement
        ══════════════════════════════════════════════════ */}
        <div id="ph-2" style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-end',
          paddingBottom: '12%',
          opacity: 0, transition: 'none',
          pointerEvents: 'none',
          zIndex: 5,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div id="ph-2-sub" style={{
              fontFamily: 'var(--font-body)', fontSize: '11px',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.55)',
              marginBottom: '0.75rem', transition: 'none',
            }}>What I Do</div>

            <div id="ph-2-statement" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 7vw, 7.5rem)',
              fontWeight: 800, lineHeight: 0.9,
              letterSpacing: '-0.04em',
              textAlign: 'center',
            }}>
              <span id="ph-2-statement-outline" style={{ WebkitTextStroke: '1.5px currentColor', color: 'transparent' }}>I Build</span><br />
              <span id="ph-2-statement-solid" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 300, fontSize: '0.85em', letterSpacing: '-0.02em' }}>Experiences.</span>
            </div>

            <div style={{
              display: 'flex', justifyContent: 'center', gap: '0.75rem',
              marginTop: '1.5rem', flexWrap: 'wrap',
            }}>
              {['React', 'Node.js', 'MongoDB', 'AI / ML', 'Web AR'].map(t => (
                <span key={t} className="hero-tag-pill" style={{
                  fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em',
                  textTransform: 'uppercase', fontFamily: 'var(--font-body)',
                  padding: '0.35rem 0.85rem', borderRadius: '4px',
                  border: '1px dashed currentColor',
                  background: 'transparent',
                  transition: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <span>✦</span>
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            PHASE 3 (F133–F187) — grey/cream bg, face mostly up
            Layout: top-left editorial tag + right-edge vertical text
        ══════════════════════════════════════════════════ */}
        <div id="ph-3" style={{
          position: 'absolute', inset: 0,
          opacity: 0, transition: 'none',
          pointerEvents: 'none',
          zIndex: 5,
        }}>
          {/* Top-left precision block */}
          <div style={{
            position: 'absolute',
            top: '18%', left: '4%',
          }}>
            <div id="ph-3-label" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5.5vw, 6rem)',
              fontWeight: 800, lineHeight: 0.9,
              letterSpacing: '-0.04em',
              color: '#111111', transition: 'none',
            }}>
              Built with<br />
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic', fontWeight: 300,
                fontSize: '0.9em', letterSpacing: '-0.02em',
              }}>Precision.</span>
            </div>
            <div id="ph-3-sub" style={{
              fontFamily: 'var(--font-body)', fontSize: '12px',
              color: 'rgba(17,17,17,0.5)', marginTop: '1rem',
              letterSpacing: '0.05em', lineHeight: 1.5,
              maxWidth: '220px', transition: 'none',
            }}>
              MERN Stack · AI/ML · Web AR<br />Clean code. Ship fast.
            </div>
          </div>

          {/* Right edge — vertical editorial label */}
          <div style={{
            position: 'absolute',
            right: '3%', top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '1rem',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '10px',
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: 'rgba(17,17,17,0.35)',
              writingMode: 'vertical-rl',
              transition: 'none',
            }}>Portfolio 2025</span>
            <div style={{ width: '1px', height: '60px', background: 'rgba(17,17,17,0.2)' }} />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            PHASE 4 (F188–F240) — white bg, face front-center-right
            Layout: left column — giant CTA + available chip
        ══════════════════════════════════════════════════ */}
        <div id="ph-4" style={{
          position: 'absolute', inset: 0,
          opacity: 0, transition: 'none',
          pointerEvents: 'none',
          zIndex: 5,
        }}>
          {/* Left column — open negative space to the left of face */}
          <div style={{
            position: 'absolute',
            bottom: '10%', left: '4%',
            maxWidth: '42%',
          }}>
            {/* Available chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#22c55e', display: 'inline-block',
                boxShadow: '0 0 8px rgba(34,197,94,0.7)',
                animation: 'soft-float 2s ease-in-out infinite',
              }} />
              <span className="hero-tag-pill" style={{
                fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                padding: '0.28rem 0.85rem', borderRadius: '100px',
                border: '1px solid rgba(17,17,17,0.18)',
                background: 'rgba(17,17,17,0.06)', color: '#111',
                transition: 'none',
              }}>Available for Work</span>
            </div>

            {/* Main CTA heading */}
            <div id="ph-4-cta-head" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 4.5vw, 4.5rem)',
              fontWeight: 800, lineHeight: 0.92,
              letterSpacing: '-0.04em',
              color: '#111111', transition: 'none',
            }}>
              Let's Create<br />
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic', fontWeight: 300,
                fontSize: '0.95em', letterSpacing: '-0.02em',
                color: '#555',
              }}>Something Amazing.</span>
            </div>

            {/* Sub */}
            <div id="ph-4-sub" style={{
              fontFamily: 'var(--font-body)', fontSize: '13px',
              color: 'rgba(17,17,17,0.5)', marginTop: '1rem',
              letterSpacing: '0.03em', lineHeight: 1.6,
              transition: 'none',
            }}>
              Open to exciting opportunities
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
              <a href="mailto:bhushan.chaturbhuj_25pca@sanjivani.edu.in" style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '0.65rem 1.6rem',
                background: '#111111', color: '#ffffff',
                fontFamily: 'var(--font-body)', fontWeight: 700,
                fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase',
                borderRadius: '100px', textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}
              >Hire Me →</a>
              <a href="/Bhushan_Chaturbhuj_Resume.pdf" target="_blank" style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '0.65rem 1.6rem',
                background: 'transparent',
                border: '1px solid rgba(17,17,17,0.25)',
                color: '#111111',
                fontFamily: 'var(--font-body)', fontWeight: 500,
                fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase',
                borderRadius: '100px', textDecoration: 'none',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#111'; e.currentTarget.style.transform='scale(1.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(17,17,17,0.25)'; e.currentTarget.style.transform='scale(1)'; }}
              >Resume ↗</a>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            GLOBAL UI CHROME
        ══════════════════════════════════════════════════ */}

        {/* ── Right scroll progress bar ── */}
        <div style={{
          position: 'absolute', right: '2rem', top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.6rem', zIndex: 20,
        }}>
          <span id="h-scroll-lbl" style={{
            fontFamily: 'var(--font-body)', fontSize: '9px',
            color: 'rgba(255,255,255,0.5)',
            writingMode: 'vertical-rl', letterSpacing: '0.22em',
            textTransform: 'uppercase', transition: 'none',
          }}>Scroll</span>
          <div id="h-scroll-track" style={{
            width: '1px', height: '52px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '1px', overflow: 'hidden',
          }}>
            <div id="h-scroll-bar" style={{
              width: '100%', height: '0%',
              background: '#ffffff', transition: 'none',
            }} />
          </div>
          {/* frame counter */}
          <span id="h-frame-counter" style={{
            fontFamily: 'var(--font-body)', fontSize: '9px',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.1em', transition: 'none',
          }}>001</span>
        </div>

        {/* ── Phase dots bottom-left ── */}
        <div style={{
          position: 'absolute', left: '4%', bottom: '2rem',
          display: 'flex', gap: '0.4rem', zIndex: 20,
          alignItems: 'center',
        }}>
          {PHASES.map((_, i) => (
            <div key={i} className="h-dot" style={{
              width: i === 0 ? '22px' : '5px', height: '2px',
              borderRadius: '2px',
              background: i === 0 ? '#ffffff' : 'rgba(255,255,255,0.12)',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>

        {/* ── Scroll hint (fades instantly) ── */}
        <div id="h-hint" style={{
          position: 'absolute', bottom: '2rem',
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.5rem',
          opacity: 1, zIndex: 20,
        }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '9px',
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.25em', textTransform: 'uppercase',
          }}>Scroll</span>
          <div style={{
            width: '1px', height: '22px',
            background: 'rgba(255,255,255,0.7)',
            animation: 'scroll-line-pulse 2s ease-in-out infinite',
          }} />
        </div>

        {/* ── Bottom ticker bar ── */}
        <div id="h-ticker" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          overflow: 'hidden',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          height: '30px',
          display: 'flex', alignItems: 'center',
          zIndex: 20,
        }}>
          <div style={{
            display: 'flex', gap: '0',
            animation: 'ticker-left 18s linear infinite',
            width: 'max-content',
          }}>
            {[...Array(2)].map((_, ri) => (
              <div key={ri} style={{ display: 'flex', gap: '0' }}>
                {[
                  'Full Stack Developer', '✦', 'React · Node.js · MongoDB', '✦',
                  'LLM AI Intern', '✦', 'MCA Student', '✦',
                  'Web AR Enthusiast', '✦', 'GSAP · Three.js', '✦',
                  'Open to Work', '✦',
                ].map((item, i) => (
                  <span key={i} style={{
                    fontFamily: 'var(--font-body)', fontSize: '10px',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                    paddingRight: '1.5rem', whiteSpace: 'nowrap',
                    transition: 'none',
                  }}>{item}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
