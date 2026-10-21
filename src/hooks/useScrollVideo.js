import { useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 240;

// ─── SCROLL ZONES (Optimized for fast responsiveness) ──────────────────────────
// 0.00 → 0.32  : canvas plays F001 → F045  (intro animation)
// 0.32 → 0.58  : canvas LOCKED at F045     (snappy text phases 1–3 cycle here)
// 0.58 → 1.00  : canvas resumes F045 → F240 (outro animation & white morph)
const LOCK_START = 0.32; // scroll% where canvas freezes on Frame 045
const LOCK_END   = 0.58; // scroll% where canvas resumes
const LOCK_FRAME = 44;   // 0-indexed → frame 045 (the eye-level freeze frame)

/**
 * Maps raw scroll progress (0→1) to a canvas frame index (0→239).
 * During LOCK_START→LOCK_END the frame is pinned to LOCK_FRAME.
 */
function progressToFrame(progress, isMobile) {
  if (isMobile) {
    // Smooth linear scrolling through all 240 frames on mobile portrait viewports
    return Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
  }

  if (progress <= LOCK_START) {
    // Intro zone: 0 → LOCK_FRAME
    const t = progress / LOCK_START;
    return Math.min(LOCK_FRAME, Math.floor(t * (LOCK_FRAME + 1)));
  }
  if (progress < LOCK_END) {
    // Responsive locked zone: always show the freeze frame
    return LOCK_FRAME;
  }
  // Outro zone: LOCK_FRAME → TOTAL_FRAMES-1
  const t = (progress - LOCK_END) / (1.0 - LOCK_END);
  return Math.min(TOTAL_FRAMES - 1, Math.floor(LOCK_FRAME + t * (TOTAL_FRAMES - LOCK_FRAME)));
}

function getFrameBgColor(index) {
  if (index < 120) return '#000000';
  if (index > 140) return '#ffffff';
  const t = (index - 120) / (140 - 120);
  const val = Math.round(t * 255);
  return `rgb(${val}, ${val}, ${val})`;
}

export function useScrollVideo(onProgressUpdate, images) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const lastRenderedFrame = useRef(-1);
  const loopRef = useRef(null);
  const isHeroVisible = useRef(true);

  const containerHeightRef = useRef(0);
  const easeFactorRef = useRef(0.25);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const lastReportedProgress = useRef(-1);

  const updateDimensions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    containerHeightRef.current = container.offsetHeight - window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    easeFactorRef.current = isMobile ? 0.35 : 0.25;

    const canvas = canvasRef.current;
    if (canvas) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
      dimensionsRef.current = { width: canvas.width, height: canvas.height };
    }
  }, []);

  const handleScroll = useCallback(() => {
    const containerHeight = containerHeightRef.current;
    if (containerHeight <= 0) return;
    const scrollTop = window.scrollY;
    const progress = Math.min(Math.max(scrollTop / containerHeight, 0), 1);
    targetProgress.current = progress;
  }, []);

  const renderFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const imgs = imagesRef.current || [];

    let img = imgs[index];
    if (!img) {
      // Fallback backwards to closest loaded image
      for (let k = index - 1; k >= 0; k--) {
        if (imgs[k]) { img = imgs[k]; break; }
      }
      // If none found backwards, search forwards
      if (!img) {
        for (let k = index + 1; k < imgs.length; k++) {
          if (imgs[k]) { img = imgs[k]; break; }
        }
      }
    }

    if (!canvas || !ctx || !img) return;

    let { width, height } = dimensionsRef.current;
    if (!width || !height) {
      width = canvas.width || canvas.clientWidth;
      height = canvas.height || canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { width, height };
    }
    if (!width || !height) return;

    const imgRatio    = img.width / img.height;
    const canvasRatio = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;
    const isMobile = width < 768;

    if (isMobile) {
      // 68% height scaling for mobile portrait viewport
      drawHeight = height * 0.68;
      drawWidth  = drawHeight * imgRatio;
      offsetX    = (width - drawWidth) / 2;
      offsetY    = (height - drawHeight) / 2 - (height * 0.1);
    } else {
      if (canvasRatio > imgRatio) {
        drawWidth  = width;
        drawHeight = width / imgRatio;
        offsetX    = 0;
        offsetY    = (height - drawHeight) / 2;
      } else {
        drawWidth  = height * imgRatio;
        drawHeight = height;
        offsetX    = (width - drawWidth) / 2;
        offsetY    = 0;
      }
    }

    // Seamless background matching
    const bgColor = getFrameBgColor(index);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
      dimensionsRef.current = { width: canvas.width, height: canvas.height };
      const isMobile = window.innerWidth < 768;
      const scaledProgress = Math.min(currentProgress.current / 0.75, 1);
      const frameIndex = progressToFrame(scaledProgress, isMobile);
      renderFrame(frameIndex);
    }
  }, [renderFrame]);

  const onProgressUpdateRef = useRef(onProgressUpdate);
  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  // Pause canvas redraws via IntersectionObserver when HeroSection is out of viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isHeroVisible.current;
        isHeroVisible.current = entry.isIntersecting;

        // When scrolling back into the HeroSection, force an immediate redraw of the current frame
        if (!wasVisible && entry.isIntersecting && images.length > 0) {
          const isMobile = window.innerWidth < 768;
          const scaledProgress = Math.min(currentProgress.current / 0.75, 1);
          const frameIndex = progressToFrame(scaledProgress, isMobile);
          renderFrame(frameIndex);
          if (onProgressUpdateRef.current) {
            onProgressUpdateRef.current(scaledProgress);
          }
        }
      },
      { root: null, threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [images, renderFrame]);

  useEffect(() => {
    updateDimensions();
    handleResize();

    const handleResizeEvent = () => {
      updateDimensions();
      handleResize();
    };

    window.addEventListener('scroll', handleScroll,      { passive: true });
    window.addEventListener('resize', handleResizeEvent, { passive: true });

    const updateLoop = () => {
      if (!imagesRef.current || imagesRef.current.length === 0) {
        loopRef.current = requestAnimationFrame(updateLoop);
        return;
      }

      const easeFactor = easeFactorRef.current;
      currentProgress.current += (targetProgress.current - currentProgress.current) * easeFactor;

      if (Math.abs(targetProgress.current - currentProgress.current) < 0.0002) {
        currentProgress.current = targetProgress.current;
      }

      // ONLY execute canvas rendering when HeroSection is actively intersecting viewport
      if (isHeroVisible.current) {
        const scaledProgress = Math.min(currentProgress.current / 0.75, 1);
        const isMobile = window.innerWidth < 768;
        const frameIndex = progressToFrame(scaledProgress, isMobile);

        if (lastRenderedFrame.current !== frameIndex) {
          renderFrame(frameIndex);
          lastRenderedFrame.current = frameIndex;
        }

        if (Math.abs(lastReportedProgress.current - scaledProgress) > 0.0001) {
          lastReportedProgress.current = scaledProgress;
          if (onProgressUpdateRef.current) {
            onProgressUpdateRef.current(scaledProgress);
          }
        }
      }

      loopRef.current = requestAnimationFrame(updateLoop);
    };

    loopRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResizeEvent);
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [handleScroll, updateDimensions, handleResize, renderFrame]);

  useEffect(() => {
    if (images.length > 0 && images[0]) {
      const isMobile = window.innerWidth < 768;
      const scaledProgress = Math.min(currentProgress.current / 0.75, 1);
      const frameIndex = progressToFrame(scaledProgress, isMobile);
      renderFrame(frameIndex);
      if (lastRenderedFrame.current === -1) {
        lastRenderedFrame.current = frameIndex;
        if (onProgressUpdateRef.current) onProgressUpdateRef.current(scaledProgress);
      }
    }
  }, [images, renderFrame]);

  return { canvasRef, containerRef };
}

export function useScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress  = scrollTop / docHeight;
      el.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progressRef };
}
