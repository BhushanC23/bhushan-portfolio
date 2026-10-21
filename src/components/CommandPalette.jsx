import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Command,
  FileText,
  Mail,
  Bot,
  Target,
  Shield,
  Volume2,
  VolumeX,
  ExternalLink,
  Layers,
  Briefcase,
  Wrench,
  Award,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Code2,
  Cpu
} from 'lucide-react';
import { BHUSHAN_DATA } from '../data/bhushanData';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [audioState, setAudioState] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  // Listen for Cmd+K / Ctrl+K and custom event
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomToggle = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle_command_palette', handleCustomToggle);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle_command_palette', handleCustomToggle);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
      window.lenis?.stop();
    } else {
      document.body.style.overflow = '';
      window.lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      window.lenis?.start();
    };
  }, [isOpen]);

  // Actions catalog
  const allActions = useMemo(() => [
    // ── RECRUITER FAST-TRACK ──
    {
      id: 'download-resume',
      title: 'Download Resume PDF',
      description: 'Official 2026 SWE & AI Post-Training Resume',
      category: 'Recruiter Fast-Track',
      icon: FileText,
      badge: 'PDF',
      shortcut: '↵',
      perform: () => {
        const link = document.createElement('a');
        link.href = '/Bhushan_Chaturbhuj_Resume.pdf';
        link.download = 'Bhushan_Chaturbhuj_Resume.pdf';
        link.click();
      },
    },
    {
      id: 'copy-email',
      title: "Copy Bhushan's Email",
      description: 'bhushanchaturbhuj23@gmail.com',
      category: 'Recruiter Fast-Track',
      icon: Mail,
      badge: copiedEmail ? 'Copied!' : 'Copy',
      shortcut: 'Email',
      perform: () => {
        navigator.clipboard.writeText('bhushanchaturbhuj23@gmail.com');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 3000);
      },
    },
    {
      id: 'ask-ai-recruiter',
      title: 'Ask AI Recruiter Assistant',
      description: 'Interactive portfolio intelligence powered by Gemini',
      category: 'Recruiter Fast-Track',
      icon: Bot,
      badge: 'Gemini',
      shortcut: 'Chat',
      perform: () => {
        window.dispatchEvent(new CustomEvent('open_ai_chat', {
          detail: { prompt: "Hi! Can you give me an executive summary of Bhushan's background and top technical strengths?" }
        }));
      },
    },
    {
      id: 'run-role-matcher',
      title: 'Run JD Role-Fit Matcher',
      description: "Evaluate Bhushan's alignment for Senior / Staff SWE & Generative AI roles",
      category: 'Recruiter Fast-Track',
      icon: Target,
      badge: 'Role-Fit',
      shortcut: 'AI Audit',
      perform: () => {
        window.dispatchEvent(new CustomEvent('open_ai_chat', {
          detail: {
            mode: 'matcher',
            preset: 'fullstack',
            prompt: "Please act as an executive technical recruiter. Analyze Bhushan's fit for a Full-Stack & Generative AI Engineer position, highlighting his Ethara AI LLM post-training work and production WebXR systems."
          }
        }));
      },
    },

    // ── PORTFOLIO NAVIGATION ──
    {
      id: 'nav-projects',
      title: 'Jump to Projects & Case Studies',
      description: 'Production systems: EVSync, Heritage AR, Ziply, AlphabetIQ',
      category: 'Navigation',
      icon: Layers,
      shortcut: '#projects',
      perform: () => {
        document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-llm-sandbox',
      title: 'Jump to LLM Post-Training & RLHF Sandbox',
      description: 'Interactive SFT vs Base LLM benchmark & telemetry lab',
      category: 'Navigation',
      icon: Sparkles,
      badge: 'Ethara AI',
      shortcut: '#llm-sandbox',
      perform: () => {
        document.querySelector('#llm-sandbox')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-experience',
      title: 'Jump to Career Timeline & Experience',
      description: 'Ethara AI, Sanjivani Innovation Cell, T&P MCA',
      category: 'Navigation',
      icon: Briefcase,
      shortcut: '#experience',
      perform: () => {
        document.querySelector('#experience')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-skills',
      title: 'Jump to Skills Matrix',
      description: 'Frontend, Backend, Databases, AI/ML, WebXR',
      category: 'Navigation',
      icon: Wrench,
      shortcut: '#skills',
      perform: () => {
        document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-achievements',
      title: 'Jump to Honors & Laurels',
      description: 'IIT Bombay National Rank 52, JPMorgan, NASSCOM',
      category: 'Navigation',
      icon: Award,
      shortcut: '#achievements',
      perform: () => {
        document.querySelector('#achievements')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'nav-contact',
      title: 'Jump to Contact & Connect',
      description: 'Direct message inquiry and calendar links',
      category: 'Navigation',
      icon: Mail,
      shortcut: '#contact',
      perform: () => {
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
      },
    },

    // ── ENGINEERING & ADMIN ──
    {
      id: 'open-nexus-os',
      title: 'Open NexusOS Command Center',
      description: 'Bhushan’s portfolio headless CMS & telemetry dashboard',
      category: 'Engineering & Admin',
      icon: Shield,
      badge: '/nexus',
      shortcut: 'Admin',
      perform: () => {
        navigate('/nexus');
      },
    },
    {
      id: 'toggle-music',
      title: 'Toggle Ambient Soundscape',
      description: 'OneRepublic, Adele, J. Lawrence chill track playback',
      category: 'Engineering & Admin',
      icon: audioState ? VolumeX : Volume2,
      badge: 'Audio',
      shortcut: 'Sound',
      perform: () => {
        window.dispatchEvent(new CustomEvent('toggle_ambient_audio'));
        setAudioState((prev) => !prev);
      },
    },
    {
      id: 'open-github',
      title: 'Visit GitHub Profile',
      description: 'github.com/BhushanC23',
      category: 'External Links',
      icon: ExternalLink,
      shortcut: '↗',
      perform: () => {
        window.open('https://github.com/BhushanC23', '_blank');
      },
    },
    {
      id: 'open-linkedin',
      title: 'Visit LinkedIn Profile',
      description: 'linkedin.com/in/bhushan-chaturbhuj',
      category: 'External Links',
      icon: ExternalLink,
      shortcut: '↗',
      perform: () => {
        window.open(BHUSHAN_DATA.social?.linkedin || 'https://linkedin.com', '_blank');
      },
    },
  ], [copiedEmail, audioState, navigate]);

  // Filter actions based on search query
  const filteredActions = useMemo(() => {
    if (!query.trim()) return allActions;
    const q = query.toLowerCase();
    return allActions.filter(action =>
      action.title.toLowerCase().includes(q) ||
      action.description.toLowerCase().includes(q) ||
      action.category.toLowerCase().includes(q)
    );
  }, [allActions, query]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation within list
  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredActions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredActions.length) % Math.max(1, filteredActions.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        executeAction(filteredActions[selectedIndex]);
      }
    }
  };

  const executeAction = (action) => {
    action.perform();
    if (action.id !== 'copy-email') {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={() => setIsOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(5, 5, 8, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '12vh 1rem 2rem',
        animation: 'palette-fade-in 0.18s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          background: '#09090d',
          border: '1px solid rgba(212, 255, 61, 0.22)',
          borderRadius: '20px',
          boxShadow: '0 30px 100px rgba(0, 0, 0, 0.85), 0 0 40px rgba(212, 255, 61, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Top Glow Highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '15%',
          right: '15%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #d4ff3d, transparent)',
          opacity: 0.9,
        }} />

        {/* Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          padding: '1.15rem 1.4rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(255, 255, 255, 0.015)',
        }}>
          <Search size={18} color="var(--accent-lime, #d4ff3d)" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command or jump to section (e.g. Resume, Projects, RLHF)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-body, "DM Sans", sans-serif)',
            }}
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={12} />
            </button>
          ) : (
            <span style={{
              fontSize: '10px',
              fontFamily: 'monospace',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.45)',
            }}>
              ESC to exit
            </span>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          style={{
            maxHeight: '380px',
            overflowY: 'auto',
            padding: '0.6rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '3px',
          }}
        >
          {filteredActions.length === 0 ? (
            <div style={{
              padding: '3rem 1rem',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '0.85rem',
            }}>
              No matching commands found for <span style={{ color: '#d4ff3d' }}>"{query}"</span>
            </div>
          ) : (
            filteredActions.map((action, idx) => {
              const Icon = action.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={action.id}
                  onClick={() => executeAction(action)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(212, 255, 61, 0.1)' : 'transparent',
                    border: isSelected ? '1px solid rgba(212, 255, 61, 0.25)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isSelected ? '#d4ff3d' : 'rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                      flexShrink: 0,
                      transition: 'all 0.12s ease',
                    }}>
                      <Icon size={16} />
                    </div>

                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}>
                        <span style={{
                          fontSize: '0.86rem',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
                        }}>
                          {action.title}
                        </span>
                        {action.badge && (
                          <span style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: isSelected ? 'rgba(0, 0, 0, 0.25)' : 'rgba(212, 255, 61, 0.1)',
                            color: isSelected ? '#ffffff' : '#d4ff3d',
                            border: '1px solid rgba(212, 255, 61, 0.2)',
                          }}>
                            {action.badge}
                          </span>
                        )}
                      </div>

                      <div style={{
                        fontSize: '0.72rem',
                        color: isSelected ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.4)',
                        marginTop: '1px',
                      }}>
                        {action.description}
                      </div>
                    </div>
                  </div>

                  {action.shortcut && (
                    <span style={{
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      color: isSelected ? '#d4ff3d' : 'rgba(255, 255, 255, 0.3)',
                      background: isSelected ? 'rgba(212, 255, 61, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                    }}>
                      {action.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(0, 0, 0, 0.2)',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.4)',
          fontFamily: 'monospace',
        }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span><strong style={{ color: 'rgba(255,255,255,0.7)' }}>↑↓</strong> Navigate</span>
            <span><strong style={{ color: 'rgba(255,255,255,0.7)' }}>↵</strong> Select</span>
            <span><strong style={{ color: 'rgba(255,255,255,0.7)' }}>esc</strong> Close</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#d4ff3d' }}>
            <Cpu size={12} />
            <span>Nexus Engine v4.0</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes palette-fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
