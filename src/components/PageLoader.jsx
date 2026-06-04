import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function PageLoader({ onComplete }) {
  const loaderRef = useRef(null);
  const lineRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Guard: all refs must be present
    if (!loaderRef.current || !lineRef.current || !titleRef.current || !subtitleRef.current) {
      setDone(true);
      onComplete?.();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        onComplete?.();
      }
    });

    tl.set(titleRef.current, { opacity: 0, y: 20 })
      .set(subtitleRef.current, { opacity: 0 })
      .set(lineRef.current, { width: 0 })
      .to(lineRef.current, {
        width: '160px',
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.out',
      })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.1')
      .to(subtitleRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }, '-=0.2')
      .to(loaderRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.6,
        delay: 0.25,
        ease: 'power3.inOut',
      });

    return () => tl.kill();
  }, [onComplete]);

  if (done) return null;

  return (
    <div
      ref={loaderRef}
      className="page-loader"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
    >
      <div ref={lineRef} className="loader-line" />
      <div ref={titleRef} className="loader-title">BHUSHAN</div>
      <div ref={subtitleRef} className="loader-subtitle">Portfolio 2025</div>
    </div>
  );
}
