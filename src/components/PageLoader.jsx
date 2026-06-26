import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

function LoaderWord({ text }) {
  const elementRef = useRef(null);
  const [displayedText, setDisplayedText] = useState(text);

  useEffect(() => {
    if (displayedText !== text) {
      const el = elementRef.current;
      if (!el) {
        setDisplayedText(text);
        return;
      }
      gsap.timeline()
        .to(el, { opacity: 0, y: -10, duration: 0.15, ease: 'power2.in' })
        .call(() => {
          setDisplayedText(text);
        })
        .fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
    }
  }, [text, displayedText]);

  return (
    <div
      ref={elementRef}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(0.62rem, 1.5vw, 0.72rem)',
        fontWeight: 600,
        color: 'var(--text-muted)',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        textAlign: 'center',
        height: '20px',
        lineHeight: '20px',
      }}
    >
      {displayedText}
    </div>
  );
}

export default function PageLoader({ progress, onComplete }) {
  const containerRef = useRef(null);
  const mainPanelRef = useRef(null);
  const goldPanelRef = useRef(null);
  const tealPanelRef = useRef(null);
  const lineRef = useRef(null);
  const counterRef = useRef(null);
  
  const [displayedCount, setDisplayedCount] = useState(0);
  const [done, setDone] = useState(false);
  const progressObj = useRef({ value: 0 });
  const isAnimatingExit = useRef(false);

  useEffect(() => {
    const isLast = progress === 100;

    gsap.to(progressObj.current, {
      value: progress,
      duration: isLast ? 0.8 : 0.4,
      ease: isLast ? 'power2.out' : 'power1.out',
      onUpdate: () => {
        setDisplayedCount(Math.floor(progressObj.current.value));
      },
      onComplete: () => {
        if (isLast && !isAnimatingExit.current) {
          isAnimatingExit.current = true;
          triggerExit();
        }
      }
    });
  }, [progress]);

  const triggerExit = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        onComplete?.();
      }
    });

    // Animate inner elements out slightly first
    tl.to([counterRef.current, lineRef.current], {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      stagger: 0.05
    });

    // Peeling back the panels: Main (top), Gold (middle), Teal (bottom)
    tl.to(mainPanelRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut'
    }, '-=0.1')
    .to(goldPanelRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut'
    }, '-=0.75')
    .to(tealPanelRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut'
    }, '-=0.75');
  };

  if (done) return null;

  // Select matching text based on progress
  let activeText = "DESIGNING EXPERIENCES";
  if (displayedCount >= 25 && displayedCount < 50) {
    activeText = "BUILDING APPLICATIONS";
  } else if (displayedCount >= 50 && displayedCount < 75) {
    activeText = "OPTIMIZING AI WORKFLOWS";
  } else if (displayedCount >= 75 && displayedCount < 90) {
    activeText = "MCA CANDIDATE";
  } else if (displayedCount >= 90) {
    activeText = "BHUSHAN CHATURBHUJ";
  }

  return (
    <div ref={containerRef} className="page-loader-container">
      {/* Three layers for the transition sweep */}
      <div ref={tealPanelRef} className="loader-panel teal-panel" />
      <div ref={goldPanelRef} className="loader-panel gold-panel" />
      
      <div ref={mainPanelRef} className="loader-panel main-panel">
        <div className="loader-content">
          {/* Big number counter */}
          <div ref={counterRef} className="loader-counter">
            {displayedCount.toString().padStart(3, '0')}
          </div>
          
          {/* sleek loader bar */}
          <div style={{
            width: '200px',
            height: '1px',
            background: 'rgba(255, 255, 255, 0.07)',
            margin: '1.5rem 0',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div
              ref={lineRef}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${displayedCount}%`,
                background: 'linear-gradient(90deg, var(--teal-accent), var(--gold-accent))',
                boxShadow: '0 0 8px var(--teal-accent)',
                transition: 'width 0.1s ease-out',
              }}
            />
          </div>
          
          {/* Rolling active word */}
          <LoaderWord text={activeText} />
        </div>
      </div>
    </div>
  );
}
