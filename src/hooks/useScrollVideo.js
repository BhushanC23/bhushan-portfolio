import { useEffect, useRef, useCallback } from 'react';

export function useScrollVideo(onProgressUpdate) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  // Interpolation targets for butter-smooth performance
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const lastRenderedTime = useRef(-1);
  const loopRef = useRef(null);

  // Store the callback in a mutable ref to prevent tearing down listeners/loops on render
  const onProgressUpdateRef = useRef(onProgressUpdate);
  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerHeight = container.offsetHeight - window.innerHeight;
    
    // Safe division check
    if (containerHeight <= 0) return;
    
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / containerHeight, 0), 1);
    
    targetProgress.current = progress;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.preload = 'auto';
    video.load();

    window.addEventListener('scroll', handleScroll, { passive: true });

    // High-performance 60fps/120fps render loop
    const updateLoop = () => {
      const vid = videoRef.current;
      if (vid && vid.duration && !isNaN(vid.duration)) {
        // Easing factors: 0.08 on desktop (creamy scroll), 0.14 on mobile (very responsive)
        const isMobile = window.innerWidth <= 768;
        const easeFactor = isMobile ? 0.14 : 0.08;

        currentProgress.current += (targetProgress.current - currentProgress.current) * easeFactor;

        // Snap to target if very close to avoid micro-rendering calculations
        if (Math.abs(targetProgress.current - currentProgress.current) < 0.0002) {
          currentProgress.current = targetProgress.current;
        }

        // Mathematical Snapping to 30fps Video Frames:
        // By seeking exactly to keyframe multiples (1/30s), we prevent the browser from doing
        // sub-frame calculations or redundant seeking, making 30fps scrub buttery-smooth.
        const fps = 30;
        const frameTime = 1 / fps;
        const targetTime = currentProgress.current * vid.duration;
        const roundedTime = Math.round(targetTime / frameTime) * frameTime;
        const safeTime = Math.min(Math.max(roundedTime, 0), vid.duration);

        if (lastRenderedTime.current !== safeTime) {
          vid.currentTime = safeTime;
          lastRenderedTime.current = safeTime;
          
          if (onProgressUpdateRef.current) {
            onProgressUpdateRef.current(currentProgress.current);
          }
        }
      }
      loopRef.current = requestAnimationFrame(updateLoop);
    };

    loopRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (loopRef.current) {
        cancelAnimationFrame(loopRef.current);
      }
    };
  }, [handleScroll]);

  return { videoRef, containerRef };
}

export function useScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      el.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progressRef };
}
