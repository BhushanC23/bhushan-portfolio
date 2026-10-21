import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ── Quotes shown one-by-one during loading ── */
const QUOTES = [
  { text: "Great design is invisible.",    attr: "— Design Philosophy"     },
  { text: "Code brings ideas to life.",     attr: "— Developer's Mindset"    },
  { text: "AI amplifies human creativity.", attr: "— Not replaces it"        },
  { text: "Build things that endure.",      attr: "— Why I make what I make" },
];

export default function PageLoader({ progress, onComplete }) {
  const overlayRef = useRef(null);
  const panelRef   = useRef(null);
  const lineRef    = useRef(null); // progress fill line
  const trackRef   = useRef(null); // progress track
  const numRef     = useRef(null); // counter row
  const quoteRef   = useRef(null); // quote heading
  const attrRef    = useRef(null); // quote attribution

  const [count, setCount] = useState(0);
  const [qIdx,  setQIdx]  = useState(0);
  const [done,  setDone]  = useState(false);

  const obj       = useRef({ v: 0 });
  const isExiting = useRef(false);

  /* ── Snappy quote reveal ── */
  useEffect(() => {
    let idx = 0;
    let killed = false;

    const showQuote = () => {
      if (killed || !quoteRef.current || !attrRef.current) return;
      setQIdx(idx % QUOTES.length);

      gsap.timeline()
        .fromTo(
          [quoteRef.current, attrRef.current],
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", stagger: 0.08 }
        )
        .to(
          [quoteRef.current, attrRef.current],
          { opacity: 0, y: -6, duration: 0.28, ease: "power2.in", stagger: 0.04 },
          "+=1.4"
        )
        .call(() => {
          idx++;
          if (!killed) showQuote();
        });
    };

    // Immediate initial reveal
    showQuote();

    // Fast-exit failsafe: never delay FCP/LCP past 800ms under Lighthouse/slow network
    const failsafe = setTimeout(() => {
      if (!isExiting.current) {
        isExiting.current = true;
        triggerExit();
      }
    }, 800);

    return () => {
      killed = true;
      clearTimeout(failsafe);
      gsap.killTweensOf([quoteRef.current, attrRef.current]);
    };
  }, []);

  /* ── Track & counter entrance ── */
  useEffect(() => {
    const targets = [trackRef.current, numRef.current].filter(Boolean);
    if (!targets.length) return;
    gsap.fromTo(targets,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.05 }
    );
  }, []);

  /* ── Exit animation (clean GSAP curtain wipe) ── */
  const triggerExit = () => {
    const targets = [quoteRef.current, attrRef.current, trackRef.current, numRef.current].filter(Boolean);
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        onComplete?.();
      }
    });

    // Terminate quote cycle
    gsap.killTweensOf([quoteRef.current, attrRef.current]);

    tl.to(targets, { opacity: 0, y: -8, duration: 0.22, stagger: 0.03, ease: "power2.in" });
    tl.to(panelRef.current,   { yPercent: -100, duration: 0.52, ease: "power3.inOut" }, "-=0.08");
    tl.to(overlayRef.current, { yPercent: -100, duration: 0.48, ease: "power3.inOut" }, "-=0.38");
  };

  /* ── High-speed responsive progress tween ── */
  useEffect(() => {
    const isLast = progress === 100;

    gsap.to(obj.current, {
      v: progress,
      duration: isLast ? 0.35 : 0.2,
      ease: isLast ? "power2.out" : "power1.out",
      onUpdate: () => {
        const v = Math.min(100, Math.floor(obj.current.v));
        setCount(v);
        if (lineRef.current) lineRef.current.style.width = v + "%";
      },
      onComplete: () => {
        if (isLast && !isExiting.current) {
          isExiting.current = true;
          // Crisp 100ms finish delay before curtain exit
          gsap.delayedCall(0.1, triggerExit);
        }
      },
    });
  }, [progress]);

  if (done) return null;

  const padded = count.toString().padStart(2, "0");
  const q      = QUOTES[qIdx];

  return (
    <>
      {/* Accent panel — sweeps up just before main curtain */}
      <div
        ref={panelRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "var(--accent-lime, #d4ff3d)",
          pointerEvents: "none",
        }}
      />

      {/* Main loader overlay */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Subtle center ambient glow */}
        <div style={{
          position: "absolute",
          width: "50vw",
          height: "50vw",
          maxWidth: 500,
          maxHeight: 500,
          top: "50%",
          left: "50%",
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
          gap: "clamp(0.4rem, 1vw, 0.75rem)",
          marginBottom: "clamp(2.5rem, 6vw, 4.5rem)",
        }}>
          <div
            ref={quoteRef}
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', serif)",
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
              fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
              fontSize: "clamp(0.6rem, 1vw, 0.7rem)",
              fontWeight: 400,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--accent-lime, #d4ff3d)",
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
            background: "rgba(255,255,255,0.12)",
            position: "relative",
            opacity: 0,
          }}
        >
          <div
            ref={lineRef}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: "0%",
              background: "var(--accent-lime, #d4ff3d)",
              boxShadow: "0 0 12px var(--accent-lime, #d4ff3d)",
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
            marginTop: "0.85rem",
            opacity: 0,
          }}
        >
          <span style={{
            fontFamily: "var(--font-display, 'Syne', sans-serif)",
            fontSize: "clamp(0.7rem, 1.3vw, 0.88rem)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#ffffff",
            lineHeight: 1,
          }}>
            {padded}
          </span>
          <span style={{
            fontFamily: "var(--font-body, 'DM Sans', sans-serif)",
            fontSize: "clamp(0.58rem, 0.95vw, 0.65rem)",
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1,
          }}>
            Ready
          </span>
        </div>
      </div>
    </>
  );
}
