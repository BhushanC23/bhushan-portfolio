import { useEffect, useRef, useCallback } from 'react';

export function useScrollVideo(onProgressUpdate) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  // Interpolation targets for butter-smooth performance
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
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
    
    // Safe division check (mobile will return here since container height will be 100vh)
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
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
          // On mobile, the video plays natively for hardware-accelerated 60fps playback.
          // We read the current progress directly.
          const progress = vid.currentTime / vid.duration;
          currentProgress.current = progress;
          targetProgress.current = progress;
          
          if (onProgressUpdateRef.current) {
            onProgressUpdateRef.current(progress);
          }
        } else {
          // On desktop, we LERP toward target scroll progress
          const easeFactor = 0.08;
          currentProgress.current += (targetProgress.current - currentProgress.current) * easeFactor;

          if (Math.abs(targetProgress.current - currentProgress.current) < 0.0002) {
            currentProgress.current = targetProgress.current;
          }

          vid.currentTime = currentProgress.current * vid.duration;
          
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
