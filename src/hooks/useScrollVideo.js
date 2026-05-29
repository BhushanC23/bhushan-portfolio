import { useEffect, useRef, useCallback } from 'react';

export function useScrollVideo(onProgressUpdate) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  // Interpolation targets for butter-smooth performance
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const lastRenderedTime = useRef(-1);
  const loopRef = useRef(null);

  // Cached layout dimensions to prevent layout thrashing (synchronous reflow) in event handlers
  const containerHeightRef = useRef(0);
  const easeFactorRef = useRef(0.08);

  const updateDimensions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Read heights and viewport dimensions once here (safe layout read, occurs outside scroll events!)
    containerHeightRef.current = container.offsetHeight - window.innerHeight;
    
    const isMobile = window.innerWidth <= 768;
    easeFactorRef.current = isMobile ? 0.14 : 0.08;
  }, []);

  // Store the callback in a mutable ref to prevent tearing down listeners/loops on render
  const onProgressUpdateRef = useRef(onProgressUpdate);
  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  const handleScroll = useCallback(() => {
    const containerHeight = containerHeightRef.current;
    if (containerHeight <= 0) return;
    
    // scrollY is layout-free, extremely fast, and prevents layout thrashing
    const scrollTop = window.scrollY;
    const progress = Math.min(Math.max(scrollTop / containerHeight, 0), 1);
    
    targetProgress.current = progress;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.preload = 'auto';
    video.load();

    // Initial dimension caching
    updateDimensions();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateDimensions, { passive: true });

    // High-performance 60fps/120fps render loop
    const updateLoop = () => {
      const vid = videoRef.current;
      if (vid && vid.duration && !isNaN(vid.duration)) {
        const easeFactor = easeFactorRef.current;

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
      window.removeEventListener('resize', updateDimensions);
      if (loopRef.current) {
        cancelAnimationFrame(loopRef.current);
      }
    };
  }, [handleScroll, updateDimensions]);

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
