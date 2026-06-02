import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import AchievementsSection from './components/AchievementsSection';
import ContactSection from './components/ContactSection';
import AIChatSidebar from './components/AIChatSidebar';
import FlyingResumeButton from './components/FlyingResumeButton';
import AdminLogin from './admin/AdminLogin';
import AdminGuard from './admin/AdminGuard';
import AdminDashboard from './admin/AdminDashboard';
import { useScrollProgress } from './hooks/useScrollVideo';

function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
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
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
        dot.style.transform = 'translate(-50%, -50%) scale(2)';
        ring.style.width = '48px';
        ring.style.height = '48px';
        ring.style.borderColor = 'rgba(45,212,191,0.7)';
      }
    };

    const handleMouseOut = () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(45,212,191,0.5)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    rafRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
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

// Main public portfolio layout
function PortfolioLayout() {
  useEffect(() => {
    // Disable native browser scroll restoration to prevent landing at scrolled sections on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force page scroll to top immediately on mount/reload
    window.scrollTo(0, 0);

    // Safeguard to scroll to top before unloading the page
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <>
      {/* Custom cursor — desktop only */}
      <div className="cursor-wrapper" style={{ display: 'block' }}>
        <CustomCursor />
      </div>

      {/* Scroll progress bar */}
      <ScrollProgressBar />

      {/* Main sections */}
      <main>
        <HeroSection />
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
