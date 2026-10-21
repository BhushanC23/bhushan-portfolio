import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import gsap from 'gsap';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import AchievementsSection from './components/AchievementsSection';
import ContactSection from './components/ContactSection';
import AIChatSidebar from './components/AIChatSidebar';
import GrainOverlay from './components/GrainOverlay';
import PageLoader from './components/PageLoader';
import Navbar from './components/Navbar';
import CommandPalette from './components/CommandPalette';
import LLMSandboxSection from './components/LLMSandboxSection';
import AdminLogin from './admin/AdminLogin';
import AdminGuard from './admin/AdminGuard';
import AdminDashboard from './admin/AdminDashboard';
import { useScrollProgress } from './hooks/useScrollVideo';
import GridOverlay from './components/GridOverlay';
import MusicPlayer from './components/MusicPlayer';

/* ─────────── Global Keyboard Shortcuts ─────────── */
function GlobalShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shift + Alt + N immediately launches the Nexus Admin OS
      if (e.shiftKey && e.altKey && (e.key === 'N' || e.key === 'n' || e.code === 'KeyN')) {
        e.preventDefault();
        navigate('/nexus');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return null;
}

/* ─────────── Magnetic Morphing Cursor (GSAP quickSetter) ─────────── */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const mousePos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ringPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    // Center coordinates on anchors with zero layout-thrashing
    gsap.set([dot, ring], {
      xPercent: -50,
      yPercent: -50,
      top: 0,
      left: 0,
      opacity: 0,
      force3D: true,
    });

    // High-performance direct CSS transform setters
    const setDotX = gsap.quickSetter(dot, 'x', 'px');
    const setDotY = gsap.quickSetter(dot, 'y', 'px');
    const setRingX = gsap.quickSetter(ring, 'x', 'px');
    const setRingY = gsap.quickSetter(ring, 'y', 'px');

    let currentHoverType = null;
    let hasMoved = false;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      setDotX(e.clientX);
      setDotY(e.clientY);

      if (!hasMoved) {
        hasMoved = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.25, ease: 'power2.out' });
      }
    };

    // Smooth inertial ring follow via unified GSAP ticker
    const tickCursor = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

      setRingX(ringPos.current.x);
      setRingY(ringPos.current.y);
    };

    gsap.ticker.add(tickCursor);

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .magnetic');
      const projectCard = e.target.closest('.project-card, .proj-card');

      if (projectCard) {
        currentHoverType = 'project';
        gsap.to(dot, { width: 12, height: 12, duration: 0.2, ease: 'power2.out' });
        gsap.to(ring, {
          width: 80,
          height: 80,
          borderColor: 'rgba(255, 255, 255, 0.85)',
          duration: 0.25,
          ease: 'power2.out',
        });
        if (label) {
          label.textContent = 'View →';
          gsap.to(label, { opacity: 1, duration: 0.2 });
        }
      } else if (target) {
        currentHoverType = 'interactive';
        gsap.to(dot, { width: 0, height: 0, opacity: 0, duration: 0.15 });
        gsap.to(ring, {
          width: 54,
          height: 54,
          borderColor: 'var(--accent-lime, #d4ff3d)',
          duration: 0.25,
          ease: 'power2.out',
        });
        if (label) gsap.to(label, { opacity: 0, duration: 0.15 });
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, .magnetic, .project-card, .proj-card');
      if (target) {
        currentHoverType = null;
        gsap.to(dot, { width: 8, height: 8, opacity: 1, duration: 0.2 });
        gsap.to(ring, {
          width: 36,
          height: 36,
          borderColor: 'rgba(255, 255, 255, 0.4)',
          duration: 0.25,
          ease: 'power2.out',
        });
        if (label) gsap.to(label, { opacity: 0, duration: 0.15 });
      }
    };

    const handleMouseDown = () => {
      const targetWidth = currentHoverType === 'project' ? 50 : currentHoverType === 'interactive' ? 38 : 22;
      gsap.to(ring, { width: targetWidth, height: targetWidth, duration: 0.14, ease: 'power2.inOut' });
      const dotWidth = currentHoverType === 'project' ? 8 : currentHoverType === 'interactive' ? 0 : 4;
      gsap.to(dot, { width: dotWidth, height: dotWidth, duration: 0.14 });
    };

    const handleMouseUp = () => {
      const targetWidth = currentHoverType === 'project' ? 80 : currentHoverType === 'interactive' ? 54 : 36;
      gsap.to(ring, { width: targetWidth, height: targetWidth, duration: 0.35, ease: 'elastic.out(1, 0.5)' });
      const dotWidth = currentHoverType === 'project' ? 12 : currentHoverType === 'interactive' ? 0 : 8;
      gsap.to(dot, { width: dotWidth, height: dotWidth, duration: 0.35 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      gsap.ticker.remove(tickCursor);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  );
}

function ScrollProgressBar() {
  const { progressRef } = useScrollProgress();
  return (
    <div
      ref={progressRef}
      className="scroll-progress"
      style={{ width: '100%' }}
    />
  );
}

/* ─────────── Magnetic Elements Effect ─────────── */
function useMagneticEffect() {
  useEffect(() => {
    const elements = document.querySelectorAll('.magnetic');
    const handlers = [];

    elements.forEach(el => {
      const onMove = (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;
        gsap.to(el, { x: deltaX, y: deltaY, duration: 0.3, ease: 'power2.out' });
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      handlers.push({ el, onMove, onLeave });
    });

    return () => {
      handlers.forEach(({ el, onMove, onLeave }) => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);
}

/* ─────────── Mouse Spotlight ─────────── */
function useMouseSpotlight() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
}

/* ─────────── Main Portfolio Layout ─────────── */
function PortfolioLayout() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [images, setImages] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useMouseSpotlight();
  useMagneticEffect();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  /* ── Progressive Frame Loading: Ready as soon as first 35 frames load ── */
  useEffect(() => {
    const FRAME_COUNT = 240;
    const INITIAL_THRESHOLD = 35;
    const slots = new Array(FRAME_COUNT).fill(null);
    let loadedCount = 0;
    let initialReadyFired = false;

    // Load initial 35 frames first, then seamlessly cache the rest
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/sequence/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;

      const done = (idx) => () => {
        slots[idx - 1] = img;
        loadedCount++;

        // Fast-track initial progress calculation against the first 35 frames
        if (!initialReadyFired) {
          const progress = Math.min(100, Math.round((loadedCount / INITIAL_THRESHOLD) * 100));
          setLoadingProgress(progress);

          if (loadedCount >= INITIAL_THRESHOLD) {
            initialReadyFired = true;
            setLoadingProgress(100);
            setImages([...slots]);
          }
        } else if (loadedCount % 15 === 0 || loadedCount === FRAME_COUNT) {
          // Incrementally sync newly cached background frames to state
          setImages([...slots]);
        }
      };

      img.onload = done(i);
      img.onerror = done(i);
    }
  }, []);

  /* ── Unified Lenis Smooth Scroll Synced to GSAP Ticker ── */
  useEffect(() => {
    let lenisInstance = null;
    let tickerHandler = null;

    const initLenis = async () => {
      try {
        const LenisModule = await import('@studio-freight/lenis');
        const Lenis = LenisModule.default;
        lenisInstance = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smooth: true,
        });
        window.lenis = lenisInstance;

        tickerHandler = (time) => {
          lenisInstance.raf(time * 1000);
        };

        gsap.ticker.add(tickerHandler);
        gsap.ticker.lagSmoothing(0);
      } catch (e) {
        // Fallback to native scrolling if module fails
      }
    };

    initLenis();

    return () => {
      if (tickerHandler) {
        gsap.ticker.remove(tickerHandler);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
        if (window.lenis === lenisInstance) {
          window.lenis = undefined;
        }
      }
    };
  }, []);

  return (
    <>
      {/* Fast-tracked Page Loader */}
      <PageLoader progress={loadingProgress} onComplete={() => setLoaderDone(true)} />

      {/* Hardware-accelerated custom cursor */}
      <div className="cursor-wrapper" style={{ display: 'block' }}>
        <CustomCursor />
      </div>

      {/* Navigation chrome */}
      {loaderDone && <ScrollProgressBar />}
      {loaderDone && <Navbar />}
      {loaderDone && <MusicPlayer />}
      {loaderDone && <CommandPalette />}

      {/* Primary content sections */}
      <main>
        <HeroSection images={images} />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <LLMSandboxSection />
        <ProjectsSection />
        <AchievementsSection />
        <ContactSection />
      </main>

      {/* Recruiter AI Sidebar */}
      <AIChatSidebar />

      {/* Hardware-accelerated film grain overlay */}
      <GrainOverlay />

      {/* Architectural guidelines overlay */}
      <GridOverlay />

      <style>{`
        @media (max-width: 768px), (pointer: coarse) {
          .cursor-wrapper { display: none !important; }
        }
        * { cursor: none !important; }
        @media (max-width: 768px), (pointer: coarse) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Global listener for Shift + Alt + N */}
      <GlobalShortcuts />

      <Routes>
        {/* Public portfolio */}
        <Route path="/" element={<PortfolioLayout />} />

        {/* New 2026 Nexus Admin OS */}
        <Route path="/nexus" element={<AdminLogin />} />
        <Route
          path="/nexus/os"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />

        {/* Backward-compatible redirects from legacy /bx-studio */}
        <Route path="/bx-studio" element={<Navigate to="/nexus" replace />} />
        <Route path="/bx-studio/dashboard" element={<Navigate to="/nexus/os" replace />} />
        <Route path="/bx-studio/*" element={<Navigate to="/nexus" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
