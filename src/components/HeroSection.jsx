import { useRef, useCallback } from 'react';
import { useScrollVideo } from '../hooks/useScrollVideo';
import { usePortfolioData } from '../hooks/usePortfolioData';
import TopographicBackground from './TopographicBackground';
import BlobShape from './BlobShape';

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL ZONES (must mirror useScrollVideo.js constants)
   0.00 → 0.30  : canvas plays F001 → F044  (intro)
   0.30 → 0.85  : canvas FROZEN at F045     (text phases 1–4 cycle here)
   0.85 → 1.00  : canvas plays F045 → F240  (outro)

   TEXT PHASE MAP  (within the 0.30 → 0.85 lock zone)
   Each phase is evenly distributed:
   ph-1 : 0.30 → 0.4375
   ph-2 : 0.4375 → 0.575
   ph-3 : 0.575 → 0.7125
   ph-4 : 0.7125 → 0.85
─────────────────────────────────────────────────────────────────────────────── */
const LOCK_START = 0.30;
const LOCK_END   = 0.85;
const LOCK_SPAN  = LOCK_END - LOCK_START; // 0.55

// 3 text phases evenly carved out of the lock zone (tp-1, tp-2, tp-3)
const TEXT_PHASES = [
  { id: 'tp-1', showAt: LOCK_START,                          hideAt: LOCK_START + LOCK_SPAN * 0.333 },
  { id: 'tp-2', showAt: LOCK_START + LOCK_SPAN * 0.333,      hideAt: LOCK_START + LOCK_SPAN * 0.666 },
  { id: 'tp-3', showAt: LOCK_START + LOCK_SPAN * 0.666,      hideAt: LOCK_END },
];

// All dots — include the intro (pre-lock) as the first dot
const ALL_DOTS = [
  { showAt: 0.00, hideAt: LOCK_START },
  ...TEXT_PHASES,
];

const IN_DUR  = 0.025;
const OUT_DUR = 0.025;

function phaseOpacity(progress, showAt, hideAt) {
  if (progress < showAt || progress >= hideAt) return 0;
  let op = 1;
  if (progress < showAt + IN_DUR)  op = (progress - showAt) / IN_DUR;
  if (progress > hideAt - OUT_DUR) op = (hideAt - progress) / OUT_DUR;
  return Math.min(Math.max(op, 0), 1);
}

/* ── frame 045 face analysis ─────────────────────────────────────────────────
   Eyes are at approx 40% from top, 55% from left of the canvas.
   The canvas covers 100vw × 100vh.
   Text overlay zone: top 4% → 33% (well above the eyes)
   Horizontal zone:   left 3% → 58% (face is centered-right, text sits left/center)
───────────────────────────────────────────────────────────────────────────── */

// Shared text position — directly above eyes in frame 045
const TEXT_TOP    = '6%';    // vertical anchor (above eyes at ~40% top)
const TEXT_LEFT   = '4%';    // horizontal anchor (left safe zone)
const TEXT_WIDTH  = '55%';   // max width so text doesn't bleed into the face

export default function HeroSection({ images = [] }) {
  const { heroText } = usePortfolioData();
  const stickyRef = useRef(null);

  /* ── DOM-driven animation: no React re-renders, pure style mutations ── */
  const updateHeroDomStyles = useCallback((progress) => {

    /* 1 ── Canvas intro bg: 0→LOCK_START is dark, LOCK_START+ it stays dark (bg=black image) */
    const sticky = stickyRef.current;
    if (sticky) {
      // keep background black throughout (the canvas images are on dark bg)
      sticky.style.backgroundColor = '#000';
    }

    /* 2 ── Text phase visibility (only during lock zone) */
    TEXT_PHASES.forEach(({ id, showAt, hideAt }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const op = phaseOpacity(progress, showAt, hideAt);
      el.style.opacity      = String(op);
      el.style.pointerEvents = op > 0.05 ? 'auto' : 'none';
      const translateY = op < 1 ? `${(1 - op) * 14}px` : '0px';
      el.style.transform = `translateY(${translateY})`;
    });

    /* 2b ── Outro CTA phase (tp-4) for white background at 100% completion */
    const tp4 = document.getElementById('tp-4');
    if (tp4) {
      const outroStart = 0.88;
      let op4 = 0;
      if (progress >= outroStart) {
        // Fade in from 0.88 to 0.93, then hold fully visible at 1.00
        op4 = Math.min((progress - outroStart) / 0.05, 1);
      }
      tp4.style.opacity = String(op4);
      tp4.style.pointerEvents = op4 > 0.05 ? 'auto' : 'none';
      const ty4 = op4 < 1 ? `${(1 - op4) * 14}px` : '0px';
      tp4.style.transform = `translateY(${ty4})`;
    }


    /* 3 ── Lock zone indicator: show the "PAUSED" frame badge */
    const lockBadge = document.getElementById('h-lock-badge');
    if (lockBadge) {
      const inLock = progress >= LOCK_START && progress < LOCK_END;
      lockBadge.style.opacity = inLock ? '1' : '0';
    }

    /* 4 ── Scroll progress bar */
    const bar   = document.getElementById('h-scroll-bar');
    const track = document.getElementById('h-scroll-track');
    const lbl   = document.getElementById('h-scroll-lbl');
    if (bar)   { bar.style.height = `${progress * 100}%`; }
    if (track) { /* stays white-on-dark */ }
    if (lbl)   { /* stays styled */ }

    /* 5 ── Scroll hint fade (disappears quickly) */
    const hint = document.getElementById('h-hint');
    if (hint) hint.style.opacity = progress < 0.05 ? `${1 - progress * 20}` : '0';

    /* 6 ── Phase dots */
    ALL_DOTS.forEach(({ showAt, hideAt }, i) => {
      const dot = document.getElementById(`h-dot-${i}`);
      if (!dot) return;
      const active = progress >= showAt && progress < hideAt;
      dot.style.width      = active ? '22px' : '5px';
      dot.style.background = active ? '#d4e84a' : 'rgba(255,255,255,0.18)';
    });

    /* 7 ── Ticker bar */
    const ticker = document.getElementById('h-ticker');
    if (ticker) { /* always visible on dark bg */ }

    /* 8 ── Frame counter */
    const counter = document.getElementById('h-frame-counter');
    if (counter) {
      // Show the actual canvas frame (accounts for freeze)
      let displayFrame;
      if (progress <= LOCK_START) {
        displayFrame = Math.round((progress / LOCK_START) * 44) + 1;
      } else if (progress < LOCK_END) {
        displayFrame = 45; // frozen
      } else {
        displayFrame = Math.round(45 + ((progress - LOCK_END) / (1 - LOCK_END)) * 195) + 1;
      }
      counter.textContent = String(Math.min(displayFrame, 240)).padStart(3, '0');
    }

    /* 9 ── Eye-level crosshair line (subtle indicator above eyes) */
    const eyeLine = document.getElementById('h-eye-line');
    if (eyeLine) {
      const inLock = progress >= LOCK_START && progress < LOCK_END;
      eyeLine.style.opacity = inLock ? '0.18' : '0';
    }

  }, []);

  const { canvasRef, containerRef } = useScrollVideo(updateHeroDomStyles, images);

  return (
    <section
      ref={containerRef}
      style={{ position: 'relative', height: '500vh' }}
    >
      <style>{`
        @keyframes ticker-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes scroll-line-pulse {
          0%,100% { opacity:0.3; transform:scaleY(0.5); }
          50%      { opacity:1;   transform:scaleY(1);   }
        }
        @keyframes lock-badge-pulse {
          0%,100% { opacity:0.7; }
          50%      { opacity:1; }
        }
        @media (max-width:768px){
          .hero-scroll-pin { height:135vh !important; }
        }
        @media (max-width:640px){
          #tp-2,#tp-3 { display:none !important; }
        }

        /* ── TEXT PHASE BASE CONTAINER ── */
        .tp-box {
          position: absolute;
          right: 3%;
          left: auto;
          max-width: 40%;
          padding: 2rem 0;
          background: transparent;
          will-change: opacity, transform;
          text-align: right;
        }

        /* ── HEADLINE ── */
        .tp-headline {
          font-family: var(--font-display, 'Inter', sans-serif);
          font-weight: 800;
          line-height: 0.92;
          letter-spacing: -0.04em;
          color: #ffffff;
          margin: 0;
        }

        /* ── ITALIC ACCENT ── */
        .tp-italic {
          font-style: italic;
          font-weight: 300;
          color: #d4e84a;
          letter-spacing: -0.02em;
        }

        /* ── SUBTEXT ── */
        .tp-sub {
          font-family: var(--font-body, sans-serif);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin-top: 0.9rem;
        }

        /* ── TAG PILL ── */
        .tp-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-body, sans-serif);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #d4e84a;
          border: 1px solid rgba(212,232,74,0.6);
          background: rgba(212,232,74,0.1);
          padding: 0.22rem 0.75rem;
          border-radius: 100px;
          margin-bottom: 1rem;
          margin-left: auto;
        }

        /* ── DIVIDER ── */
        .tp-divider {
          width: 36px;
          height: 2px;
          background: #d4e84a;
          margin: 1.1rem 0 0.9rem;
          opacity: 0.7;
          margin-left: auto;
        }

        /* ── CTA BUTTONS ── */
        .tp-cta-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.55rem 1.4rem;
          border-radius: 100px;
          font-family: var(--font-body, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-decoration: none;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .tp-cta-btn:hover { transform: scale(1.05); }
        .tp-cta-primary {
          background: #d4e84a;
          color: #000;
          box-shadow: 0 0 20px rgba(212,232,74,0.4);
        }
        .tp-cta-primary:hover { box-shadow: 0 0 36px rgba(212,232,74,0.7); }
        .tp-cta-ghost {
          border: 1px solid rgba(255,255,255,0.4);
          color: #fff;
          background: rgba(255,255,255,0.05);
        }

        /* ── TEXT PHASE BASE CONTAINER (LIGHT FOR WHITE BG) ── */
        .tp-box-light {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 6%;
          background: transparent;
          will-change: opacity, transform;
          text-align: center;
        }
        .tp-headline-light {
          font-family: var(--font-display, 'Inter', sans-serif);
          font-weight: 900;
          line-height: 0.88;
          letter-spacing: -0.045em;
          color: #111111;
          margin: 0;
          /* Mask out center area where the face is to simulate depth (text behind face) */
          -webkit-mask-image: radial-gradient(ellipse 22vw 38vh at 50% 50%, transparent 0%, transparent 40%, black 85%);
          mask-image: radial-gradient(ellipse 22vw 38vh at 50% 50%, transparent 0%, transparent 40%, black 85%);
        }
        @media (max-width: 768px) {
          .tp-headline-light {
            -webkit-mask-image: radial-gradient(ellipse 42vw 32vh at 50% 50%, transparent 0%, transparent 40%, black 85%);
            mask-image: radial-gradient(ellipse 42vw 32vh at 50% 50%, transparent 0%, transparent 40%, black 85%);
          }
        }
        .tp-italic-light {
          font-style: italic;
          font-weight: 300;
          color: #8aaa00;
          letter-spacing: -0.02em;
          font-family: var(--font-serif, Georgia, serif);
        }
        .tp-sub-light {
          font-family: var(--font-body, sans-serif);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 0.9rem;
        }
        .tp-tag-light {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-body, sans-serif);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #111111;
          border: 1px solid rgba(0, 0, 0, 0.18);
          background: rgba(0, 0, 0, 0.04);
          padding: 0.22rem 0.9rem;
          border-radius: 100px;
          margin-bottom: 1.5rem;
        }
        .tp-divider-light {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #111111, transparent);
          margin: 1.25rem auto 0.5rem;
          opacity: 0.5;
        }
        .tp-cta-primary-light {
          background: #111111;
          color: #d4e84a;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
        }
        .tp-cta-primary-light:hover {
          background: #000000;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.28);
          transform: translateY(-2px);
        }
        .tp-cta-ghost-light {
          border: 1.5px solid rgba(0, 0, 0, 0.25);
          color: #111111;
          background: transparent;
        }
        .tp-cta-ghost-light:hover {
          background: rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
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
          zIndex: 1,
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
            zIndex: 2,
          }}
        />

        {/* ── Topographic Elevation Overlay ── */}
        <TopographicBackground stroke="#ffffff" opacity={0.08} zIndex={3} mixBlendMode="difference" />

        {/* ── Organic Ambient Light Spotlights ── */}
        <BlobShape zIndex={3} mixBlendMode="soft-light" opacity1={0.12} opacity2={0.10} />



        {/* ══════════════════════════════════════════════════════════════
            EYE-LEVEL REFERENCE LINE
            Frame 045: eyes are at ~40% from top of canvas.
            This invisible line marks the eye level for debugging.
        ══════════════════════════════════════════════════════════════ */}
        <div id="h-eye-line" style={{
          position: 'absolute',
          top: '40%',
          left: 0, right: 0,
          height: '1px',
          background: 'rgba(212,232,74,0.5)',
          opacity: 0,
          zIndex: 4,
          pointerEvents: 'none',
          transition: 'opacity 0.4s ease',
        }} />

        {/* ══ TEXT PHASE 1 — Name Reveal ══ */}
        <div id="tp-1" className="tp-box" style={{
          top: '8%', opacity: 0, pointerEvents: 'none', zIndex: 10,
        }}>
          <div className="tp-tag">
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#d4e84a', display: 'inline-block' }} />
            MCA · AI/ML · Web Dev
          </div>
          <div className="tp-headline" style={{ fontSize: 'clamp(1.6rem, 4vw, 3.8rem)' }}>
            BHUSHAN<br />
            <span className="tp-italic" style={{ fontSize: '0.78em' }}>Chaturbhuj.</span>
          </div>
          <div className="tp-divider" />
          <div className="tp-sub">Full Stack Developer &amp; LLM AI Intern</div>
        </div>

        {/* ══ TEXT PHASE 2 — Stack ══ */}
        <div id="tp-2" className="tp-box" style={{
          top: '8%', opacity: 0, pointerEvents: 'none', zIndex: 10,
        }}>
          <div className="tp-tag">Stack</div>
          <div className="tp-headline" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 3.2rem)' }}>
            Built with<br />
            <span className="tp-italic" style={{ fontSize: '0.95em' }}>Precision.</span>
          </div>
          <div className="tp-divider" />
          <div className="tp-sub">React · Node.js · MongoDB · Python · GSAP</div>
        </div>

        {/* ══ TEXT PHASE 3 — Vision ══ */}
        <div id="tp-3" className="tp-box" style={{
          top: '8%', opacity: 0, pointerEvents: 'none', zIndex: 10,
        }}>
          <div className="tp-tag">Vision</div>
          <div className="tp-headline" style={{ fontSize: 'clamp(1.4rem, 3.5vw, 3.2rem)' }}>
            Turning<br />
            <span className="tp-italic">Ideas</span><br />
            into Reality.
          </div>
          <div className="tp-divider" />
          <div className="tp-sub">AI · Web · Mobile · XR</div>
        </div>

        {/* ══ TEXT PHASE 4 — CTA (Outro on White BG) ══ */}
        <div id="tp-4" className="tp-box-light" style={{
          top: 0, opacity: 0, pointerEvents: 'none', zIndex: 10,
        }}>
          {/* Available tag */}
          <div className="tp-tag-light">
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
            Available for Work
          </div>

          {/* Giant editorial heading */}
          <div className="tp-headline-light" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}>
            Let’s Create
            <br />
            <span className="tp-italic-light">Something</span>
            <br />
            Amazing.
          </div>

          {/* Thin divider */}
          <div className="tp-divider-light" />

          {/* Buttons centered */}
          <div style={{ display: 'flex', gap: '0.9rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="mailto:bhushan.chaturbhuj_25pca@sanjivani.edu.in" className="tp-cta-btn tp-cta-primary-light">Hire Me →</a>
            <a href="/Bhushan_Chaturbhuj_Resume.pdf" target="_blank" className="tp-cta-btn tp-cta-ghost-light">Resume ↗</a>
          </div>
        </div>


        {/* ══════════════════════════════════════════════════════════════
            GLOBAL UI CHROME
        ══════════════════════════════════════════════════════════════ */}

        {/* ── Lock zone badge (shows "F·045" when frozen) ── */}
        <div id="h-lock-badge" style={{
          position: 'absolute', right: '4.5rem', top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0, transition: 'opacity 0.5s ease',
          zIndex: 20, pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: 'var(--font-body, monospace)',
            fontSize: '9px',
            letterSpacing: '0.2em',
            color: 'rgba(212,232,74,0.6)',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
            animation: 'lock-badge-pulse 2s ease-in-out infinite',
          }}>F·045 ⊙</div>
        </div>

        {/* ── Right scroll progress bar ── */}
        <div style={{
          position: 'absolute', right: '2rem', top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.6rem', zIndex: 20,
        }}>
          <span id="h-scroll-lbl" style={{
            fontFamily: 'var(--font-body, sans-serif)', fontSize: '9px',
            color: 'rgba(255,255,255,0.4)',
            writingMode: 'vertical-rl', letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}>Scroll</span>
          <div id="h-scroll-track" style={{
            width: '1px', height: '52px',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '1px', overflow: 'hidden',
          }}>
            <div id="h-scroll-bar" style={{
              width: '100%', height: '0%',
              background: '#d4e84a',
            }} />
          </div>
          <span id="h-frame-counter" style={{
            fontFamily: 'var(--font-body, monospace)', fontSize: '9px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em',
          }}>001</span>
        </div>

        {/* ── Phase dots bottom-left ── */}
        <div style={{
          position: 'absolute', left: '4%', bottom: '2rem',
          display: 'flex', gap: '0.4rem', zIndex: 20,
          alignItems: 'center',
        }}>
          {ALL_DOTS.map((_, i) => (
            <div key={i} id={`h-dot-${i}`} style={{
              width: i === 0 ? '22px' : '5px', height: '2px',
              borderRadius: '2px',
              background: i === 0 ? '#d4e84a' : 'rgba(255,255,255,0.18)',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>

        {/* ── Scroll hint ── */}
        <div id="h-hint" style={{
          position: 'absolute', bottom: '2.5rem',
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '0.5rem',
          opacity: 1, zIndex: 20, pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-body, sans-serif)', fontSize: '9px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.25em', textTransform: 'uppercase',
          }}>Scroll</span>
          <div style={{
            width: '1px', height: '22px',
            background: 'rgba(255,255,255,0.6)',
            animation: 'scroll-line-pulse 2s ease-in-out infinite',
          }} />
        </div>

        {/* ── Bottom ticker bar ── */}
        <div id="h-ticker" style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          overflow: 'hidden',
          borderTop: '1px solid rgba(255,255,255,0.08)',
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
                    fontFamily: 'var(--font-body, sans-serif)', fontSize: '10px',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.28)',
                    paddingRight: '1.5rem', whiteSpace: 'nowrap',
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
