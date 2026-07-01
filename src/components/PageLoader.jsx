import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ── Quotes shown one-by-one during loading ── */
const QUOTES = [
  { text: "Great design is invisible.",         attr: "— Design Philosophy"      },
  { text: "Code brings ideas to life.",          attr: "— Developer's Mindset"     },
  { text: "AI amplifies human creativity.",      attr: "— Not replaces it"         },
  { text: "Build things that endure.",           attr: "— Why I make what I make"  },
];

/* each quote: fadeIn 0.6s + hold 1.1s + fadeOut 0.5s ≈ 2.2s */
const Q_FADE_IN  = 0.6;
const Q_HOLD     = 1.1;
const Q_FADE_OUT = 0.5;

const MIN_MS = 4500;   // minimum loader display time

export default function PageLoader({ progress, onComplete }) {
  const overlayRef = useRef(null);
  const panelRef   = useRef(null);
  const lineRef    = useRef(null);    // progress fill
  const trackRef   = useRef(null);    // progress track
  const numRef     = useRef(null);    // counter row
  const quoteRef   = useRef(null);    // big quote text
  const attrRef    = useRef(null);    // attribution

  const [count, setCount] = useState(0);
  const [qIdx,  setQIdx]  = useState(0);
  const [done,  setDone]  = useState(false);

  const obj       = useRef({ v: 0 });
  const isExiting = useRef(false);
  const mountTime = useRef(Date.now());

  /* ── Run the quote cycle independently of loading ── */
  useEffect(() => {
    let idx   = 0;
    let killed = false;

    const showNext = () => {
      if (killed || !quoteRef.current || !attrRef.current) return;
      setQIdx(idx % QUOTES.length);

      gsap.timeline()
        .fromTo(
          [quoteRef.current, attrRef.current],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: Q_FADE_IN, ease: "power3.out", stagger: 0.12 }
        )
        .to(
          [quoteRef.current, attrRef.current],
          { opacity: 0, y: -8, duration: Q_FADE_OUT, ease: "power2.in", stagger: 0.06 },
          `+=${Q_HOLD}`
        )
        .call(() => {
          idx++;
          if (!killed) showNext();
        });
    };

    /* slight delay so intro fade-in of track/counter finishes first */
    const t = gsap.delayedCall(0.4, showNext);

    return () => {
      killed = true;
      t.kill();
      gsap.killTweensOf([quoteRef.current, attrRef.current]);
    };
  }, []);

  /* ── Intro: track + counter slide up ── */
  useEffect(() => {
    const els = [trackRef.current, numRef.current].filter(Boolean);
    if (!els.length) return;
    gsap.fromTo(els,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.15 }
    );
  }, []);

  /* ── Progress counter ── */
  useEffect(() => {
    const isLast = progress === 100;
    gsap.to(obj.current, {
      v: progress,
      duration: isLast ? 1.0 : 0.55,
      ease: isLast ? "power2.out" : "power1.out",
      onUpdate: () => {
        const v = Math.floor(obj.current.v);
        setCount(v);
        if (lineRef.current) lineRef.current.style.width = v + "%";
      },
      onComplete: () => {
        if (isLast && !isExiting.current) {
          isExiting.current = true;
          const elapsed = Date.now() - mountTime.current;
          const wait    = Math.max(0, MIN_MS - elapsed) / 1000;
          gsap.delayedCall(wait, triggerExit);
        }
      },
    });
  }, [progress]);

  /* ── Exit animation ── */
  const triggerExit = () => {
    const targets = [quoteRef.current, attrRef.current, trackRef.current, numRef.current].filter(Boolean);
    const tl = gsap.timeline({ onComplete: () => { setDone(true); onComplete?.(); } });

    /* kill ongoing quote cycle so it doesn't fight the exit */
    gsap.killTweensOf([quoteRef.current, attrRef.current]);

    tl.to(targets, { opacity: 0, y: -12, duration: 0.38, stagger: 0.05, ease: "power2.in" });
    tl.to(panelRef.current,   { yPercent: -100, duration: 0.72, ease: "power3.inOut" }, "-=0.05");
    tl.to(overlayRef.current, { yPercent: -100, duration: 0.68, ease: "power3.inOut" }, "-=0.52");
  };

  if (done) return null;

  const padded = count.toString().padStart(2, "0");
  const q      = QUOTES[qIdx];

  return (
    <>
      {/* accent panel — sweeps up just before main */}
      <div
        ref={panelRef}
        style={{ position: "fixed", inset: 0, zIndex: 9998, background: "var(--accent-lime)", pointerEvents: "none" }}
      />

      {/* main loader overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* very subtle center glow */}
        <div style={{
          position: "absolute",
          width: "60vw", height: "60vw", maxWidth: 600, maxHeight: 600,
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(212,255,61,0.12) 0%, transparent 68%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        {/* ── QUOTE BLOCK ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(0.5rem, 1.2vw, 0.85rem)",
          marginBottom: "clamp(3rem, 7vw, 5.5rem)",
        }}>
          <div
            ref={quoteRef}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.15rem, 3vw, 2.4rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.2,
              letterSpacing: "0.02em",
              color: "#ffffff",
              opacity: 0,
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            {q.text}
          </div>

          <div
            ref={attrRef}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.6rem, 1vw, 0.7rem)",
              fontWeight: 400,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--accent-lime)",
              opacity: 0,
              userSelect: "none",
            }}
          >
            {q.attr}
          </div>
        </div>

        {/* ── PROGRESS TRACK ── */}
        <div
          ref={trackRef}
          style={{
            width: "clamp(200px, 36vw, 420px)",
            height: "1px",
            background: "rgba(255,255,255,0.1)",
            position: "relative",
            opacity: 0,
          }}
        >
          <div
            ref={lineRef}
            style={{
              position: "absolute", left: 0, top: 0,
              height: "100%", width: "0%",
              background: "var(--accent-lime)",
              transition: "width 0.14s ease-out",
            }}
          />
        </div>

        {/* ── COUNTER ROW ── */}
        <div
          ref={numRef}
          style={{
            width: "clamp(200px, 36vw, 420px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: "0.7rem",
            opacity: 0,
          }}
        >
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(0.7rem, 1.3vw, 0.88rem)",
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: "#ffffff",
          }}>
            {padded}
          </span>
          <span style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.58rem, 0.95vw, 0.65rem)",
            fontWeight: 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}>
            Loading
          </span>
        </div>
      </div>
    </>
  );
}
