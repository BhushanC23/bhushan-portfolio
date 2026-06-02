import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, Trash2, Bot, Sparkles } from 'lucide-react';
import { BHUSHAN_SYSTEM_PROMPT, QUICK_QUESTIONS } from '../data/bhushanData';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

function TypingIndicator() {
  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      padding: '0.85rem 1rem',
      background: 'rgba(45,212,191,0.06)',
      borderRadius: '14px 14px 14px 4px',
      border: '1px solid rgba(45,212,191,0.1)',
      width: 'fit-content',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: 'var(--teal-accent)',
          animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '0.75rem',
    }}>
      {!isUser && (
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'rgba(45,212,191,0.12)',
          border: '1px solid rgba(45,212,191,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginRight: '0.5rem',
          marginTop: '2px',
        }}>
          <Bot size={14} color="var(--teal-accent)" />
        </div>
      )}
      <div style={{
        maxWidth: '80%',
        padding: '0.75rem 1rem',
        borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: isUser
          ? 'linear-gradient(135deg, #2dd4bf, #0d9488)'
          : 'rgba(45,212,191,0.06)',
        border: isUser ? 'none' : '1px solid rgba(45,212,191,0.1)',
        color: isUser ? '#070d0e' : 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        lineHeight: 1.65,
        fontWeight: isUser ? 500 : 400,
      }}>
        {msg.text}
      </div>
    </div>
  );
}

export default function AIChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{
    role: 'ai',
    text: "Hi! 👋 I'm Bhushan's AI assistant. Ask me anything about him — his skills, projects, experience, or how to contact him!",
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const newHistory = [
      ...conversationHistory,
      { role: 'user', parts: [{ text }] },
    ];
    setConversationHistory(newHistory);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey || apiKey === 'your_google_ai_studio_key_here') {
        throw new Error('API key not configured');
      }

      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: newHistory,
          systemInstruction: { parts: [{ text: BHUSHAN_SYSTEM_PROMPT }] },
          generationConfig: {
            maxOutputTokens: 512,
            temperature: 0.8,
          },
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || "I had trouble responding. Please try again!";

      setConversationHistory(prev => [
        ...prev,
        { role: 'model', parts: [{ text: aiText }] },
      ]);
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      const fallback = err.message === 'API key not configured'
        ? "⚠️ Gemini API key not set. Add VITE_GEMINI_API_KEY to your .env file to enable AI chat."
        : "Oops, I had a connectivity issue. Please try again!";
      setMessages(prev => [...prev, { role: 'ai', text: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'ai',
      text: "Chat cleared! Ask me anything about Bhushan 😊",
    }]);
    setConversationHistory([]);
  };

  return (
    <>
      {/* Floating Invitation Tooltip */}
      {!isOpen && (
        <div
          className="ai-invite-tooltip"
          style={{
            position: 'fixed',
            bottom: '5.2rem',
            right: '1.5rem',
            zIndex: 1100,
            background: 'rgba(13,26,28,0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(45,212,191,0.3)',
            borderRadius: '16px 16px 4px 16px',
            padding: '0.5rem 1rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 15px rgba(45,212,191,0.1)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--teal-accent)',
            display: 'inline-block',
            animation: 'pulse 1.5s infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'rgba(240,244,244,0.9)',
            letterSpacing: '0.01em',
          }}>
            Got questions? Ask my AI! ⚡
          </span>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        id="ai-chat-trigger"
        onClick={() => setIsOpen(true)}
        className="glowing-ai-btn"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 1100,
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.9rem 1.6rem',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          color: '#ffffff',
          border: '1px solid rgba(45,212,191,0.4)',
          borderRadius: '50px',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: '0.9rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 15px rgba(45,212,191,0.25)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          overflow: 'hidden',
        }}
        aria-label="Open AI Chat"
      >
        {/* Shimmer overlay effect */}
        <div className="btn-shimmer" />

        {/* Bot Icon with floating sparks */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <Bot size={18} color="var(--teal-accent)" className="ai-icon" style={{ transition: 'transform 0.3s ease' }} />
          <Sparkles size={10} color="var(--gold-accent)" style={{ position: 'absolute', top: '-4px', right: '-4px', transition: 'all 0.3s ease' }} className="spark-micro" />
        </div>
        
        <span style={{ 
          letterSpacing: '0.04em',
          background: 'linear-gradient(90deg, #ffffff, rgba(240,244,244,0.95))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>Ask AI</span>
      </button>

      {/* Sidebar Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(7,13,14,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1150,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Sidebar Panel */}
      <div
        id="ai-chat-sidebar"
        className="ai-sidebar-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          height: '-webkit-fill-available',
          width: 'min(420px, 100vw)',
          background: 'var(--bg-secondary)',
          borderLeft: '1px solid rgba(45,212,191,0.15)',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
          overflowY: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(45,212,191,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(13,26,28,0.8)',
          backdropFilter: 'blur(12px)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(45,212,191,0.2), rgba(45,212,191,0.05))',
              border: '1px solid rgba(45,212,191,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Bot size={18} color="var(--teal-accent)" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: 'var(--text-primary)',
              }}>Bhushan's AI</div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                color: 'var(--teal-accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--teal-accent)',
                  animation: 'pulse 2s infinite',
                }} />
                Powered by Gemini
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={clearChat} title="Clear chat" style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
              padding: '0.4rem', borderRadius: '6px', transition: 'color 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--teal-accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Trash2 size={16} />
            </button>
            <button onClick={() => setIsOpen(false)} title="Close" style={{
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
              padding: '0.4rem', borderRadius: '6px', transition: 'color 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div style={{ padding: '1rem 1.25rem 0', flexShrink: 0 }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginBottom: '0.6rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>Quick questions</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {QUICK_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    background: 'rgba(45,212,191,0.07)',
                    border: '1px solid rgba(45,212,191,0.2)',
                    borderRadius: '20px',
                    color: 'var(--teal-accent)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(45,212,191,0.14)';
                    e.currentTarget.style.borderColor = 'rgba(45,212,191,0.4)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(45,212,191,0.07)';
                    e.currentTarget.style.borderColor = 'rgba(45,212,191,0.2)';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(45,212,191,0.12)',
                border: '1px solid rgba(45,212,191,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={14} color="var(--teal-accent)" />
              </div>
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(45,212,191,0.1)',
          background: 'rgba(13,26,28,0.6)',
          backdropFilter: 'blur(8px)',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'flex-end',
            background: 'rgba(7,13,14,0.8)',
            border: '1px solid rgba(45,212,191,0.15)',
            borderRadius: '14px',
            padding: '0.6rem 0.6rem 0.6rem 1rem',
            transition: 'border-color 0.3s ease',
          }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(45,212,191,0.4)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(45,212,191,0.15)'}
          >
            <textarea
              ref={inputRef}
              id="ai-chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Bhushan..."
              rows={1}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                resize: 'none',
                lineHeight: 1.5,
                maxHeight: '100px',
                overflowY: 'auto',
              }}
            />
            <button
              id="ai-chat-send"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: input.trim() && !isTyping
                  ? 'linear-gradient(135deg, #2dd4bf, #0d9488)'
                  : 'rgba(45,212,191,0.1)',
                border: 'none',
                cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s ease',
              }}
              aria-label="Send message"
            >
              <Send size={15} color={input.trim() && !isTyping ? '#070d0e' : 'var(--text-muted)'} />
            </button>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            marginTop: '0.5rem',
            opacity: 0.7,
          }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      <style>{`
        @keyframes dot-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes float-btn {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }

        .glowing-ai-btn {
          animation: float-btn 3.5s ease-in-out infinite;
        }

        /* Hover glows & scale-up */
        .glowing-ai-btn:hover {
          border-color: var(--teal-accent) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.6), 0 0 25px rgba(45,212,191,0.5) !important;
        }

        .glowing-ai-btn:hover .ai-icon {
          transform: rotate(15deg) scale(1.1);
        }

        .glowing-ai-btn:hover .spark-micro {
          transform: rotate(-30deg) scale(1.3);
          filter: drop-shadow(0 0 4px var(--gold-accent));
        }

        /* Shimmer sweep effect */
        .btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(45,212,191,0.25),
            transparent
          );
          transform: skewX(-25deg);
          animation: shimmerSweep 4.5s infinite;
        }

        @keyframes shimmerSweep {
          0% { left: -100%; }
          30% { left: 150%; }
          100% { left: 150%; }
        }

        /* Breathing invitation tooltip animation */
        .ai-invite-tooltip {
          animation: tooltipFloat 3s ease-in-out infinite, fadeInDelayed 1s ease-out 1.5s both;
        }

        @keyframes tooltipFloat {
          0% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }

        @keyframes fadeInDelayed {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* === AI CHAT RESPONSIVE === */
        @media (max-width: 480px) {
          .ai-invite-tooltip {
            bottom: 4.8rem !important;
            right: 1.25rem !important;
            padding: 0.4rem 0.8rem !important;
          }
          .ai-invite-tooltip span:last-child {
            font-size: 0.72rem !important;
          }
          .glowing-ai-btn {
            bottom: 1.25rem !important;
            right: 1.25rem !important;
            padding: 0.8rem 1.4rem !important;
          }
          .ai-sidebar-panel {
            width: 100vw !important;
            border-left: none !important;
          }
        }
      `}</style>
    </>
  );
}
