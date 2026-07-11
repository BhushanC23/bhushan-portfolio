import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef(null);

  // Monitor viewport size for responsive layout
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Handle Autoplay policy on modern browsers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set initial configuration
    audio.loop = true;
    audio.volume = 0.35; // Comfortable background volume

    const attemptPlay = () => {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay blocked by browser. Wait for user gesture on document
          const handleFirstGesture = () => {
            audio.play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(err => console.log('Autoplay play retry failed:', err));
            document.removeEventListener('click', handleFirstGesture);
            document.removeEventListener('keydown', handleFirstGesture);
          };
          document.addEventListener('click', handleFirstGesture);
          document.addEventListener('keydown', handleFirstGesture);
        });
    };

    attemptPlay();
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Audio play failed:', err));
    }
  };

  const handleNextPrev = () => {
    const audio = audioRef.current;
    if (!audio) return;
    // Restart song for next/prev when there is only 1 song
    audio.currentTime = 0;
    if (!isPlaying) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Audio play failed:', err));
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: isMobile ? '4.75rem' : '1.25rem',
        right: isMobile ? '1rem' : '2.5rem',
        zIndex: 1001, // Positioned above the navbar capsule
        height: isMobile ? '40px' : '52px',
        padding: isMobile ? '0 0.75rem' : '0 1rem',
        borderRadius: '100px',
        background: 'rgba(17, 17, 17, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isPlaying ? '1px solid var(--accent-lime)' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isPlaying 
          ? '0 4px 20px rgba(212, 255, 61, 0.15), inset 0 0 12px rgba(212, 255, 61, 0.03)'
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '0.6rem' : '0.8rem',
        transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        userSelect: 'none',
      }}
    >
      <audio ref={audioRef} src="/Counting Stars.mp3" />

      {/* Music Visualizer Eq (Bounces when playing) */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '2px',
        height: '14px',
        width: '14px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '2px',
          height: '100%',
          background: isPlaying ? 'var(--accent-lime)' : 'rgba(255,255,255,0.4)',
          transformOrigin: 'bottom',
          animation: isPlaying ? 'eq-bounce-1 0.7s ease-in-out infinite' : 'none',
          transform: 'scaleY(0.3)',
          transition: 'all 0.3s ease',
        }} />
        <div style={{
          width: '2px',
          height: '100%',
          background: isPlaying ? 'var(--accent-lime)' : 'rgba(255,255,255,0.4)',
          transformOrigin: 'bottom',
          animation: isPlaying ? 'eq-bounce-2 0.8s ease-in-out infinite' : 'none',
          transform: 'scaleY(0.5)',
          transition: 'all 0.3s ease',
        }} />
        <div style={{
          width: '2px',
          height: '100%',
          background: isPlaying ? 'var(--accent-lime)' : 'rgba(255,255,255,0.4)',
          transformOrigin: 'bottom',
          animation: isPlaying ? 'eq-bounce-3 0.6s ease-in-out infinite' : 'none',
          transform: 'scaleY(0.2)',
          transition: 'all 0.3s ease',
        }} />
      </div>

      {/* Song details */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: isMobile ? '75px' : '100px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? '9.5px' : '11px',
          fontWeight: 800,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: isPlaying ? 'var(--accent-lime)' : '#ffffff',
          transition: 'color 0.3s ease',
        }}>
          Counting Stars
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: isMobile ? '7.5px' : '8.5px',
          color: 'rgba(255, 255, 255, 0.4)',
        }}>
          OneRepublic
        </span>
      </div>

      {/* Divider */}
      <div style={{
        width: '1px',
        height: '16px',
        background: 'rgba(255,255,255,0.1)',
        flexShrink: 0,
      }} />

      {/* Controls Container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '0.4rem' : '0.6rem',
      }}>
        {/* Prev */}
        <button
          onClick={handleNextPrev}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem',
            color: 'rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          aria-label="Previous track"
        >
          <SkipBack size={isMobile ? 12 : 14} />
        </button>

        {/* Play / Pause Toggle */}
        <button
          onClick={togglePlay}
          style={{
            background: isPlaying ? 'var(--accent-lime)' : 'rgba(255, 255, 255, 0.1)',
            border: 'none', cursor: 'pointer',
            width: isMobile ? '24px' : '30px',
            height: isMobile ? '24px' : '30px',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isPlaying ? '#111111' : '#ffffff',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            if (!isPlaying) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }
          }}
          onMouseLeave={e => {
            if (!isPlaying) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }
          }}
          aria-label={isPlaying ? 'Pause track' : 'Play track'}
        >
          {isPlaying ? <Pause size={isMobile ? 11 : 13} fill="#111111" /> : <Play size={isMobile ? 11 : 13} fill="#ffffff" />}
        </button>

        {/* Next */}
        <button
          onClick={handleNextPrev}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: '0.2rem',
            color: 'rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          aria-label="Next track"
        >
          <SkipForward size={isMobile ? 12 : 14} />
        </button>
      </div>

      <style>{`
        @keyframes eq-bounce-1 {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1.0); }
        }
        @keyframes eq-bounce-2 {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(0.2); }
        }
        @keyframes eq-bounce-3 {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(0.8); }
        }
      `}</style>
    </div>
  );
}
