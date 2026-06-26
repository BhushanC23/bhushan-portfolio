import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import gsap from 'gsap';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import AchievementsSection from './components/AchievementsSection';
import ContactSection from './components/ContactSection';
import AIChatSidebar from './components/AIChatSidebar';
import FlyingResumeButton from './components/FlyingResumeButton';
import GrainOverlay from './components/GrainOverlay';
import PageLoader from './components/PageLoader';
import AdminLogin from './admin/AdminLogin';
import AdminGuard from './admin/AdminGuard';
import AdminDashboard from './admin/AdminDashboard';
import { useScrollProgress } from './hooks/useScrollVideo';

/* ─────────── Magnetic Morphing Cursor ─────────── */
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const animateRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;
      ring.style.left = `${ringPos.current.x}px`;
      ring.style.top = `${ringPos.current.y}px`;
      rafRef.current = requestAnimationFrame(animateRing);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, .magnetic');
      const projectCard = e.target.closest('.project-card');

      if (projectCard) {
        dot.style.opacity = '0';
        ring.style.width = '80px';
        ring.style.height = '80px';
        ring.style.borderColor = 'rgba(45,212,191,0.5)';
        ring.style.background = 'rgba(45,212,191,0.08)';
        if (label) { label.style.opacity = '1'; label.textContent = 'View →'; }
      } else if (target) {
        dot.style.opacity = '0';
        ring.style.width = '60px';
        ring.style.height = '60px';
        ring.style.borderColor = 'rgba(45,212,191,0.6)';
        ring.style.background = 'var(--teal-glow)';
        if (label) label.style.opacity = '0';
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, .magnetic, .project-card');
      if (target) {
        dot.style.opacity = '1';
        ring.style.width = '40px';
        ring.style.height = '40px';
        ring.style.borderColor = 'rgba(45,212,191,0.4)';
        ring.style.background = 'transparent';
        if (label) label.style.opacity = '0';
      }
    };

    const handleMouseDown = () => {
      gsap.to(ring, { width: 20, height: 20, duration: 0.1, ease: 'power2.in' });
    };
    const handleMouseUp = () => {
      gsap.to(ring, { width: 40, height: 40, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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

/* ─────────── Magnetic Effect Hook ─────────── */
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
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
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

  // Preload image sequence for Hero scroll-scrub video
  useEffect(() => {
    const FRAME_COUNT = 94;
    const slots = new Array(FRAME_COUNT).fill(null);
    let loadedCount = 0;
    let firstFrameShown = false;

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/sequence/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;

      const done = (idx) => () => {
        slots[idx - 1] = img;
        loadedCount++;

        if (idx === 1 && !firstFrameShown) {
          firstFrameShown = true;
          setImages([...slots]);
          setLoadingProgress(1);
        } else {
          const progress = Math.round((loadedCount / FRAME_COUNT) * 100);
          setLoadingProgress(progress);
          if (loadedCount % 10 === 0 || loadedCount === FRAME_COUNT) {
            setImages([...slots]);
          }
        }
      };

      img.onload = done(i);
      img.onerror = done(i);
    }
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    let lenis;
    const initLenis = async () => {
      try {
        const LenisModule = await import('@studio-freight/lenis');
        const Lenis = LenisModule.default;
        lenis = new Lenis({
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smooth: true,
        });

        // Connect Lenis to GSAP ticker
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      } catch (e) {
        // Lenis not available, native scroll continues
      }
    };
    initLenis();

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Page Loader */}
      <PageLoader progress={loadingProgress} onComplete={() => setLoaderDone(true)} />

      {/* Custom cursor — desktop only */}
      <div className="cursor-wrapper" style={{ display: 'block' }}>
        <CustomCursor />
      </div>

      {/* Scroll progress bar */}
      <ScrollProgressBar />

      {/* Main sections */}
      <main>
        <HeroSection images={images} />
        <AboutSection />
        <SkillsSection />
        <ExperienceSection />
        <ProjectsSection />
        <AchievementsSection />
        <ContactSection />
      </main>

      {/* Flying Astronaut Resume Button */}
      <FlyingResumeButton />

      {/* AI Chat Sidebar */}
      <AIChatSidebar />

      {/* Film Grain */}
      <GrainOverlay />

      <style>{`
        @media (max-width: 768px) {
          .cursor-wrapper { display: none !important; }
        }
        * { cursor: none !important; }
        @media (max-width: 768px) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public portfolio */}
        <Route path="/" element={<PortfolioLayout />} />

        {/* Hidden admin routes — no links anywhere in the public app */}
        <Route path="/bx-studio" element={<AdminLogin />} />
        <Route
          path="/bx-studio/dashboard"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
