import { useEffect, useRef, useCallback } from 'react';

const frameCount = 94;

export function useScrollVideo(onProgressUpdate, images) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Interpolation targets for butter-smooth performance
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const lastRenderedFrame = useRef(-1);
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
    easeFactorRef.current = isMobile ? 0.35 : 0.25;
  }, []);

  const handleScroll = useCallback(() => {
    const containerHeight = containerHeightRef.current;
    if (containerHeight <= 0) return;
    
    // scrollY is layout-free, extremely fast, and prevents layout thrashing
    const scrollTop = window.scrollY;
    const progress = Math.min(Math.max(scrollTop / containerHeight, 0), 1);
    
    targetProgress.current = progress;
  }, []);

  const renderFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    // Progressive load guard — find nearest loaded frame if this slot is null
    let img = images[index];
    if (!img) {
      // Walk backwards to find last available frame
      for (let k = index - 1; k >= 0; k--) {
        if (images[k]) { img = images[k]; break; }
      }
    }

    if (!canvas || !ctx || !img) return;

    // Use client dimensions to perfectly match screen layout and prevent dynamic mobile address bar stretching!
    const { clientWidth, clientHeight } = canvas;
    if (canvas.width !== clientWidth || canvas.height !== clientHeight) {
      canvas.width = clientWidth;
      canvas.height = clientHeight;
    }

    const { width, height } = canvas;
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = width;
      drawHeight = width / imgRatio;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      drawHeight = height;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [images]);

  // Handle Resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(currentProgress.current * frameCount)
      );
      renderFrame(frameIndex);
    }
  }, [renderFrame]);

  // Store the callback in a mutable ref to prevent tearing down listeners/loops on render
  const onProgressUpdateRef = useRef(onProgressUpdate);
  useEffect(() => {
    onProgressUpdateRef.current = onProgressUpdate;
  }, [onProgressUpdate]);

  useEffect(() => {
    if (images.length === 0) return;

    // Initial dimension caching & sizing
    updateDimensions();
    handleResize();

    const handleResizeEvent = () => {
      updateDimensions();
      handleResize();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResizeEvent, { passive: true });

    // High-performance 120fps render loop
    const updateLoop = () => {
      if (images.length === 0) return;

      const easeFactor = easeFactorRef.current;
      currentProgress.current += (targetProgress.current - currentProgress.current) * easeFactor;

      // Snap to target if very close to avoid micro-rendering calculations
      if (Math.abs(targetProgress.current - currentProgress.current) < 0.0002) {
        currentProgress.current = targetProgress.current;
      }

      // Map progress directly to frame indices (0 to 93)
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(currentProgress.current * frameCount)
      );

      // Render only when frame index changes (unparalleled 0ms seek GPU drawing speed!)
      if (lastRenderedFrame.current !== frameIndex) {
        renderFrame(frameIndex);
        lastRenderedFrame.current = frameIndex;
        
        if (onProgressUpdateRef.current) {
          onProgressUpdateRef.current(currentProgress.current);
        }
      }
      
      loopRef.current = requestAnimationFrame(updateLoop);
    };

    loopRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResizeEvent);
      if (loopRef.current) {
        cancelAnimationFrame(loopRef.current);
      }
    };
  }, [images, handleScroll, updateDimensions, handleResize, renderFrame]);

  // Initial draw when images loaded — draw frame 0 AND call progress(0) immediately
  // This ensures the hero overlay text shows instantly when preloader dismisses
  useEffect(() => {
    // images[0] may be null during progressive loading — wait until it's ready
    if (images.length > 0 && images[0]) {
      renderFrame(0);
      lastRenderedFrame.current = 0;
      // Fire progress callback at 0 so Overlay-1 is immediately visible
      if (onProgressUpdateRef.current) {
        onProgressUpdateRef.current(0);
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
      const progress = scrollTop / docHeight;
      el.style.transform = `scaleX(${progress})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progressRef };
}
