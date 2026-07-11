import { useEffect, useRef, useCallback } from 'react';

const frameCount = 240;

// ─── SCROLL ZONES ──────────────────────────────────────────────────────────
// 0.00 → 0.30  : canvas plays F001 → F072  (intro animation)
// 0.30 → 0.85  : canvas LOCKED at F045     (text phases scroll here)
// 0.85 → 1.00  : canvas resumes F072 → F240 (outro animation)
const LOCK_START   = 0.30;   // scroll% where canvas freezes
const LOCK_END     = 0.85;   // scroll% where canvas resumes
const LOCK_FRAME   = 44;     // 0-indexed → frame 045 (the eye-level freeze frame)
const INTRO_FRAMES = 72;     // frames played in intro zone
const TOTAL_FRAMES = 240;

/**
 * Maps raw scroll progress (0→1) to a canvas frame index (0→239).
 * During LOCK_START→LOCK_END the frame is pinned to LOCK_FRAME.
 */
function progressToFrame(progress) {
  if (progress <= LOCK_START) {
    // Intro zone: 0 → LOCK_FRAME
    const t = progress / LOCK_START;
    return Math.min(LOCK_FRAME, Math.floor(t * (LOCK_FRAME + 1)));
  }
  if (progress < LOCK_END) {
    // Locked zone: always show the freeze frame
    return LOCK_FRAME;
  }
  // Outro zone: LOCK_FRAME → TOTAL_FRAMES-1
  const t = (progress - LOCK_END) / (1.0 - LOCK_END);
  return Math.min(TOTAL_FRAMES - 1, Math.floor(LOCK_FRAME + t * (TOTAL_FRAMES - LOCK_FRAME)));
}

function getFrameBgColor(index) {
  if (index < 125) return '#000000';
  if (index > 195) return '#ffffff';
  const t = (index - 125) / (195 - 125);
  const val = Math.round(t * 255);
  return `rgb(${val}, ${val}, ${val})`;
}

export function useScrollVideo(onProgressUpdate, images) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const targetProgress  = useRef(0);
  const currentProgress = useRef(0);
  const lastRenderedFrame = useRef(-1);
  const loopRef = useRef(null);

  const containerHeightRef = useRef(0);
  const easeFactorRef = useRef(0.08);

  const updateDimensions = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    containerHeightRef.current = container.offsetHeight - window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    easeFactorRef.current = isMobile ? 0.35 : 0.25;
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

    let img = images[index];
    if (!img) {
      for (let k = index - 1; k >= 0; k--) {
        if (images[k]) { img = images[k]; break; }
      }
    }

    if (!canvas || !ctx || !img) return;

    const { clientWidth, clientHeight } = canvas;
    if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
      canvas.width  = clientWidth;
      canvas.height = clientHeight;
    }

    const { width, height } = canvas;
    const imgRatio    = img.width / img.height;
    const canvasRatio = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;
    const isMobile = width < 768;

    if (isMobile) {
      // 68% height scaling for mobile portrait viewport: keeps subject proportional and centered,
      // avoiding the extreme "close-up face zoom" while remaining immersive via background matching.
      drawHeight = height * 0.68;
      drawWidth  = drawHeight * imgRatio;
      offsetX    = (width - drawWidth) / 2;
      offsetY    = (height - drawHeight) / 2;
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

    // Fill background with matching frame color to create a seamless landscape-in-portrait integration
    const bgColor = getFrameBgColor(index);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [images]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width  = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const frameIndex = progressToFrame(currentProgress.current);
      renderFrame(frameIndex);
    }
  }, [renderFrame]);

  const onProgressUpdateRef = useRef(onProgressUpdate);
  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  useEffect(() => {
    if (images.length === 0) return;

    updateDimensions();
    handleResize();

    const handleResizeEvent = () => {
      updateDimensions();
      handleResize();
    };

    window.addEventListener('scroll', handleScroll,      { passive: true });
    window.addEventListener('resize', handleResizeEvent, { passive: true });

    const updateLoop = () => {
      if (images.length === 0) return;

      const easeFactor = easeFactorRef.current;
      currentProgress.current += (targetProgress.current - currentProgress.current) * easeFactor;

      if (Math.abs(targetProgress.current - currentProgress.current) < 0.0002) {
        currentProgress.current = targetProgress.current;
      }

      // Map progress to a 0.0 -> 0.75 sub-range, capping at 1.0 (retains freeze frame F240 for overlap transition)
      const scaledProgress = Math.min(currentProgress.current / 0.75, 1);
      const frameIndex = progressToFrame(scaledProgress);

      if (lastRenderedFrame.current !== frameIndex) {
        renderFrame(frameIndex);
        lastRenderedFrame.current = frameIndex;
      }

      // Always fire progress callback with scaledProgress
      if (onProgressUpdateRef.current) {
        onProgressUpdateRef.current(scaledProgress);
      }

      loopRef.current = requestAnimationFrame(updateLoop);
    };

    loopRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResizeEvent);
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [images, handleScroll, updateDimensions, handleResize, renderFrame]);

  useEffect(() => {
    if (images.length > 0 && images[0]) {
      renderFrame(0);
      lastRenderedFrame.current = 0;
      if (onProgressUpdateRef.current) onProgressUpdateRef.current(0);
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
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = scrollTop / docHeight;
      el.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progressRef };
}
