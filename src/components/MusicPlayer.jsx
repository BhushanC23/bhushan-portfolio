import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

const PLAYLIST = [
  {
    title: 'Counting Stars',
    artist: 'OneRepublic',
    src: '/counting_stars.mp3'
  },
  {
    title: 'Skyfall',
    artist: 'Adele',
    src: '/skyfall.mp3'
  },
  {
    title: 'Hanging Tree',
    artist: 'J. Lawrence',
    src: '/hanging_tree.mp3'
  }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Choose a random song index on initial page refresh
  const [currentSongIndex, setCurrentSongIndex] = useState(() => {
    return Math.floor(Math.random() * PLAYLIST.length);
  });

  const audioRef = useRef(null);
  const isFirstMount = useRef(true);

  // Monitor viewport size for responsive layout
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Collapse the capsule when clicking outside it
  useEffect(() => {
    if (!isExpanded) return;
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.music-player-capsule')) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isExpanded]);

  // Core Audio Playback Lifecycle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Load active song source
    audio.src = PLAYLIST[currentSongIndex].src;
    audio.loop = false; // Disable loop to support auto-play next song
    audio.volume = 0.35; // Comfortable volume

    // Auto-advance to the next track when current one finishes
    const handleAudioEnded = () => {
      setCurrentSongIndex(prev => (prev + 1) % PLAYLIST.length);
    };
    audio.addEventListener('ended', handleAudioEnded);

    if (isFirstMount.current) {
      isFirstMount.current = false;
      
      const playAudio = () => {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked. Listen to gesture
            const handleFirstGesture = () => {
              audio.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.log('Autoplay play retry failed:', err));
              window.removeEventListener('click', handleFirstGesture);
              window.removeEventListener('touchstart', handleFirstGesture);
            };
            window.addEventListener('click', handleFirstGesture);
            window.addEventListener('touchstart', handleFirstGesture);
          });
      };

      const timer = setTimeout(playAudio, 800);
      return () => {
        clearTimeout(timer);
        audio.removeEventListener('ended', handleAudioEnded);
      };
    } else {
      // User manual transition: Play next/prev song immediately
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.log('Play transition failed:', err);
          setIsPlaying(false);
        });
    }

    return () => {
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, [currentSongIndex]);

  const togglePlay = (e) => {
    e.stopPropagation();
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

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSongIndex(prev => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentSongIndex(prev => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const currentSong = PLAYLIST[currentSongIndex];

  return (
    <div
      onClick={() => !isExpanded && setIsExpanded(true)}
      style={{
        position: 'fixed',
        bottom: isMobile ? '1.5rem' : '2rem',
        left: isMobile ? '1.5rem' : '2rem',
        zIndex: 1001,
        height: isMobile ? '44px' : '54px',
        width: isExpanded 
          ? (isMobile ? '230px' : '270px') 
          : (isMobile ? '44px' : '54px'),
        padding: isExpanded 
          ? (isMobile ? '0 0.6rem 0 0.6rem' : '0 1rem') 
          : '0',
        borderRadius: '100px',
        background: 'rgba(17, 17, 17, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isPlaying ? '1px solid var(--accent-lime)' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isPlaying 
          ? '0 4px 24px rgba(212, 255, 61, 0.18), inset 0 0 12px rgba(212, 255, 61, 0.04)'
          : '0 8px 30px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: !isExpanded ? 'center' : 'space-between',
        gap: isExpanded ? (isMobile ? '0.45rem' : '0.8rem') : '0',
        transition: 'width 0.4s cubic-bezier(0.25, 1, 0.5, 1), padding 0.4s ease, border-color 0.3s, box-shadow 0.3s',
        userSelect: 'none',
        overflow: 'hidden',
        cursor: !isExpanded ? 'pointer' : 'default',
      }}
      className="music-player-capsule"
    >
      <audio ref={audioRef} />

      {/* Collapsed Mode: Rotating Vector Music Note Badge */}
      {!isExpanded ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Custom vector double eighth note matching user image */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-lime)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              width: isMobile ? '20px' : '24px',
              height: isMobile ? '20px' : '24px',
              animation: isPlaying ? 'spin-ring 6s linear infinite' : 'none',
              transformOrigin: '50% 50%',
            }}
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" fill="var(--accent-lime)" />
            <circle cx="18" cy="16" r="3" fill="var(--accent-lime)" />
          </svg>
        </div>
      ) : (
        /* Full Capsule Content (Expanded) */
        <>
          {/* Left Music Note Badge / Equalizer Visualizer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
            {/* Click to collapse */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent-lime)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  width: isMobile ? '20px' : '24px',
                  height: isMobile ? '20px' : '24px',
                  animation: isPlaying ? 'spin-ring 6s linear infinite' : 'none',
                  transformOrigin: '50% 50%',
                }}
              >
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" fill="var(--accent-lime)" />
                <circle cx="18" cy="16" r="3" fill="var(--accent-lime)" />
              </svg>
            </button>

            {/* Equalizer Visualizer */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '2px',
              height: '11px',
              width: '11px',
            }}>
              <div style={{
                width: '1.5px', height: '100%',
                background: isPlaying ? 'var(--accent-lime)' : 'rgba(255,255,255,0.4)',
                transformOrigin: 'bottom',
                animation: isPlaying ? 'eq-bounce-1 0.7s ease-in-out infinite' : 'none',
                transform: 'scaleY(0.3)',
              }} />
              <div style={{
                width: '1.5px', height: '100%',
                background: isPlaying ? 'var(--accent-lime)' : 'rgba(255,255,255,0.4)',
                transformOrigin: 'bottom',
                animation: isPlaying ? 'eq-bounce-2 0.8s ease-in-out infinite' : 'none',
                transform: 'scaleY(0.5)',
              }} />
              <div style={{
                width: '1.5px', height: '100%',
                background: isPlaying ? 'var(--accent-lime)' : 'rgba(255,255,255,0.4)',
                transformOrigin: 'bottom',
                animation: isPlaying ? 'eq-bounce-3 0.6s ease-in-out infinite' : 'none',
                transform: 'scaleY(0.2)',
              }} />
            </div>
          </div>

          {/* Details */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: isMobile ? '65px' : '90px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? '8.5px' : '10.5px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: isPlaying ? 'var(--accent-lime)' : '#ffffff',
            }}>
              {currentSong.title}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: isMobile ? '6.5px' : '8px',
              color: 'rgba(255, 255, 255, 0.4)',
            }}>
              {currentSong.artist}
            </span>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.3rem' : '0.5rem', flexShrink: 0 }}>
            <button
              onClick={handlePrev}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.15rem',
                color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              aria-label="Previous Track"
            >
              <SkipBack size={isMobile ? 11 : 14} />
            </button>

            <button
              onClick={togglePlay}
              style={{
                background: isPlaying ? 'var(--accent-lime)' : 'rgba(255, 255, 255, 0.1)',
                border: 'none', cursor: 'pointer',
                width: isMobile ? '22px' : '28px',
                height: isMobile ? '22px' : '28px',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: isPlaying ? '#111111' : '#ffffff',
                transition: 'all 0.3s ease',
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={isMobile ? 9 : 12} fill="#111111" /> : <Play size={isMobile ? 9 : 12} fill="#ffffff" />}
            </button>

            <button
              onClick={handleNext}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.15rem',
                color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
              aria-label="Next Track"
            >
              <SkipForward size={isMobile ? 11 : 14} />
            </button>
          </div>
        </>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes spin-ring {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
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
