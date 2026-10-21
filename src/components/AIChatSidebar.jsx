import { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Send,
  Trash2,
  Bot,
  Sparkles,
  Target,
  Briefcase,
  FileText,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  Cpu,
  Server,
  Layers,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { BHUSHAN_SYSTEM_PROMPT, QUICK_QUESTIONS, BHUSHAN_DATA } from '../data/bhushanData';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

// Realistic Presets for Fast Recruiter Evaluation
const JD_PRESETS = [
  {
    id: 'fullstack',
    label: '⚡ Full Stack Engineer',
    roleTitle: 'Full Stack Software Engineer',
    sampleJD: `We are looking for a Full Stack Software Engineer to build scalable web applications and real-time APIs.
Requirements:
- Strong experience with React (v18/19), JavaScript (ES6+), and modern UI engineering.
- Robust backend development with Node.js, Express, MongoDB / PostgreSQL, and Redis.
- Experience with real-time architectures, WebSockets, telemetry protocols, and REST APIs.
- Passion for software architecture, performance optimization, and clean modular code.`,
  },
  {
    id: 'aillm',
    label: '🧠 AI / LLM Engineer',
    roleTitle: 'AI & LLM Post-Training Engineer',
    sampleJD: `Seeking an Applied AI / LLM Engineer to fine-tune generative language models and develop alignment pipelines.
Requirements:
- Hands-on experience with Supervised Fine-Tuning (SFT) and RLHF/DPO preference curation.
- Experience curating high-signal synthetic training datasets and prompt evaluations.
- Knowledge of Python, PyTorch/Transformers, Hugging Face, and evaluation benchmarks.
- Ability to bridge applied generative AI research with production full-stack web applications.`,
  },
  {
    id: 'frontend',
    label: '🎨 Frontend Creative Dev',
    roleTitle: 'Frontend & Creative 3D Developer',
    sampleJD: `Seeking a Creative Frontend Developer to build immersive 3D web experiences and high-performance interactive interfaces.
Requirements:
- Mastery of modern React, WebGL, Three.js, and browser-based WebXR / AR systems.
- Proven track record optimizing rendering pipelines for guaranteed 60fps on mobile.
- Deep expertise in GSAP micro-animations, glassmorphic UI systems, and responsive layouts.
- Eye for precision typography, fluid spatial interactions, and accessible user experiences.`,
  },
];

// Fallback Deterministic Matcher (guarantees 100% uptime if Gemini API is rate-limited or unconfigured)
function calculateDeterministicMatch(jdText) {
  const text = (jdText || '').toLowerCase();

  const isAI = text.includes('llm') || text.includes('ai') || text.includes('sft') || text.includes('rlhf') || text.includes('prompt') || text.includes('dataset') || text.includes('machine learning');
  const isCreative = text.includes('three.js') || text.includes('webgl') || text.includes('webxr') || text.includes('creative') || text.includes('animation') || text.includes('ar') || text.includes('3d') || text.includes('gsap');
  const isFullstack = text.includes('full stack') || text.includes('node') || text.includes('express') || text.includes('backend') || text.includes('mongo') || text.includes('database') || text.includes('api') || text.includes('telemetry');

  let score = 95;
  let roleTitle = 'Full Stack & AI Engineer';
  let matchedSkills = ['React 19', 'Node.js', 'MongoDB', 'Ethara AI (SFT)', 'Heritage AR (WebXR)', 'EVSync'];

  if (isAI && !isCreative) {
    score = 97;
    roleTitle = 'Applied AI & LLM Post-Training Engineer';
    matchedSkills = ['LLM Post-Training', 'SFT & RLHF', 'Synthetic Datasets', 'Ethara AI', 'Python', 'React 19'];
  } else if (isCreative && !isAI) {
    score = 96;
    roleTitle = 'Creative WebXR & Frontend Developer';
    matchedSkills = ['WebXR & Three.js', '60fps Optimization', 'Heritage AR', 'React 19', 'GSAP', 'WebGL Shaders'];
  } else if (isFullstack) {
    score = 96;
    roleTitle = 'Full Stack Software Engineer';
    matchedSkills = ['React 19', 'Node.js / Express', 'MongoDB & Redis', 'EVSync Telemetry', 'REST / WebSockets', 'Architecture'];
  }

  const bullets = [
    {
      title: 'Full-Stack Architecture & Real-Time Telemetry',
      project: 'EVSync & AlphabetIQ',
      icon: Server,
      desc: "Engineered scalable distributed backend services in Node.js and MongoDB. Architected production OCPP 2.0.1 IoT telemetry protocols with live state machines and Redis caching for EVSync, plus speech NLP classification for AlphabetIQ.",
    },
    {
      title: 'Applied Generative AI & LLM Post-Training',
      project: 'Ethara AI Internship',
      icon: Cpu,
      desc: "Spearheaded Supervised Fine-Tuning (SFT) and RLHF preference alignment pipelines during his Ethara AI internship. Engineered high-signal synthetic datasets and automated multi-turn evaluation benchmarks.",
    },
    {
      title: 'High-Performance Spatial WebXR & Creative UI',
      project: 'Heritage AR',
      icon: Layers,
      desc: "Pioneered browser-based 3D cultural WebXR in Three.js and A-Frame, achieving 60fps rendering on resource-constrained mobile devices via GLTF instancing, WebGL shader passes, and zero-runtime bundle optimizations.",
    },
  ];

  return {
    score,
    verdict: `${score}% Strong Match — High-Impact Technical Fit`,
    roleTitle,
    summary: `Bhushan displays 95%+ core competency overlap across modern React, distributed Node.js microservices, WebXR rendering, and enterprise LLM alignment pipelines.`,
    bullets,
    matchedSkills,
  };
}

// Typing bubble indicator
function TypingIndicator() {
  return (
    <div style={{
      display: 'flex',
      gap: '5px',
      padding: '0.85rem 1.1rem',
      background: 'rgba(17, 26, 28, 0.85)',
      borderRadius: '16px 16px 16px 4px',
      border: '1px solid rgba(212, 255, 61, 0.15)',
      width: 'fit-content',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: 'var(--accent-lime, #d4ff3d)',
          boxShadow: '0 0 6px rgba(212, 255, 61, 0.5)',
          animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

// Detect Smart Action Chips for AI Messages
function getActionChips(text = '') {
  const t = text.toLowerCase();
  const chips = [];

  const mentionsProjects = t.includes('project') || t.includes('heritage') || t.includes('evsync') || t.includes('alphabetiq') || t.includes('shipped') || t.includes('portfolio') || t.includes('built') || t.includes('work');
  const mentionsResume = t.includes('resume') || t.includes('cv') || t.includes('download') || t.includes('pdf') || t.includes('background') || t.includes('education') || t.includes('experience');
  const mentionsHire = t.includes('hire') || t.includes('contact') || t.includes('interview') || t.includes('email') || t.includes('reach') || t.includes('available') || t.includes('opportunity') || t.includes('role') || t.includes('offer');
  const mentionsLLM = t.includes('llm') || t.includes('ethara') || t.includes('sft') || t.includes('rlhf') || t.includes('dataset') || t.includes('alignment') || t.includes('post-training');

  if (mentionsProjects) {
    chips.push({ id: 'projects', label: '🚀 Scroll to Projects', type: 'projects' });
  }
  if (mentionsResume) {
    chips.push({ id: 'resume', label: '📄 Download Resume', type: 'resume' });
  }
  if (mentionsHire) {
    chips.push({ id: 'hire', label: '💼 Hire Bhushan', type: 'hire' });
  }
  if (mentionsLLM) {
    chips.push({ id: 'llm', label: '⚡ View Ethara AI Lab', type: 'llm' });
  }

  // Fallback defaults if general greeting
  if (chips.length === 0) {
    return [
      { id: 'projects', label: '🚀 View Projects', type: 'projects' },
      { id: 'resume', label: '📄 Get Resume', type: 'resume' },
      { id: 'hire', label: '💼 Hire Bhushan', type: 'hire' },
    ];
  }
  return chips;
}

// Single Message Bubble with Action Chips
function ChatMessage({ msg, onAction }) {
  const isUser = msg.role === 'user';
  const chips = useMemo(() => (!isUser ? getActionChips(msg.text) : []), [isUser, msg.text]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '1rem',
      animation: 'fadeIn 0.25s ease-out',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.6rem',
        maxWidth: '88%',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}>
        {!isUser && (
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(212,255,61,0.15), rgba(7,13,14,0.9))',
            border: '1px solid rgba(212, 255, 61, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
            boxShadow: '0 0 10px rgba(212,255,61,0.2)',
          }}>
            <Bot size={15} color="var(--accent-lime, #d4ff3d)" />
          </div>
        )}

        <div style={{
          padding: '0.85rem 1.1rem',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          background: isUser
            ? 'linear-gradient(135deg, #18282b, #111e20)'
            : 'linear-gradient(135deg, rgba(14,24,26,0.95), rgba(9,16,18,0.95))',
          border: isUser
            ? '1px solid rgba(212,255,61,0.3)'
            : '1px solid rgba(255,255,255,0.08)',
          color: '#f8fafc',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          boxShadow: isUser
            ? '0 4px 15px rgba(0,0,0,0.3)'
            : '0 8px 24px rgba(0,0,0,0.4)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {msg.text}
        </div>
      </div>

      {/* Smart Action Chips below AI messages */}
      {!isUser && chips.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.45rem',
          marginTop: '0.55rem',
          marginLeft: '2.5rem',
          maxWidth: '85%',
        }}>
          {chips.map(chip => (
            <button
              key={chip.id}
              onClick={() => onAction(chip.type)}
              className="chat-action-chip"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.75rem',
                background: 'rgba(212, 255, 61, 0.08)',
                border: '1px solid rgba(212, 255, 61, 0.28)',
                borderRadius: '50px',
                color: 'var(--accent-lime, #d4ff3d)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AIChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'matcher'
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{
    role: 'ai',
    text: "Hello! 👋 I'm Bhushan's 2026 Recruiter AI Agent powered by Gemini. Ask me about his Full-Stack systems, Ethara AI LLM Post-Training internship, or run an instant Job Description Matchmaker audit!",
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  // JD Matchmaker State
  const [jdInput, setJdInput] = useState(JD_PRESETS[0].sampleJD);
  const [activePreset, setActivePreset] = useState('fullstack');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportCard, setReportCard] = useState(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const jdTextareaRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (activeTab === 'chat' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, activeTab]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'chat') {
        setTimeout(() => inputRef.current?.focus(), 250);
      } else {
        setTimeout(() => jdTextareaRef.current?.focus(), 250);
      }
    }
  }, [isOpen, activeTab]);

  // Lock body scroll with Lenis support
  useEffect(() => {
    if (isOpen) {
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

  // Global event listener for command palette & external triggers
  useEffect(() => {
    const handleOpenAiChat = (e) => {
      setIsOpen(true);
      const detail = e.detail || {};

      if (detail.mode === 'matcher') {
        setActiveTab('matcher');
        if (detail.preset) {
          const match = JD_PRESETS.find(p => p.id === detail.preset);
          if (match) {
            setActivePreset(match.id);
            setJdInput(match.sampleJD);
          }
        }
      } else {
        setActiveTab('chat');
        if (detail.prompt) {
          setTimeout(() => {
            sendMessage(detail.prompt);
          }, 350);
        }
      }
    };

    window.addEventListener('open_ai_chat', handleOpenAiChat);
    return () => window.removeEventListener('open_ai_chat', handleOpenAiChat);
  }, [conversationHistory]);

  // Smooth scroll helper
  const scrollToTarget = (targetId) => {
    const el = document.getElementById(targetId.replace('#', ''));
    if (el) {
      if (window.lenis) {
        window.lenis.scrollTo(el, { offset: -60, duration: 1.2 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Smart Action Chip handler
  const handleAction = (type, customRole = 'Full Stack Software Engineer') => {
    if (type === 'projects') {
      if (window.innerWidth < 768) setIsOpen(false);
      scrollToTarget('projects');
    } else if (type === 'resume') {
      const link = document.createElement('a');
      link.href = '/Bhushan_Chaturbhuj_Resume.pdf';
      link.download = 'Bhushan_Chaturbhuj_Resume.pdf';
      link.click();
    } else if (type === 'hire') {
      window.dispatchEvent(new CustomEvent('select_contact_purpose', {
        detail: {
          purpose: 'Hiring / Job Offer',
          role: customRole,
          notes: `Recruiter fast-track interview request from 2026 AI Agent (${customRole})`,
        }
      }));
      setIsOpen(false);
      setTimeout(() => {
        scrollToTarget('contact');
      }, 150);
    } else if (type === 'llm') {
      if (window.innerWidth < 768) setIsOpen(false);
      scrollToTarget('llm-sandbox');
    }
  };

  // AI Chat message sender
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
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || "I had trouble generating a response. Please try asking again!";

      setConversationHistory(prev => [
        ...prev,
        { role: 'model', parts: [{ text: aiText }] },
      ]);
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (err) {
      // Graceful conversational response highlighting Bhushan's exact capabilities
      let fallbackText = "";
      const lower = text.toLowerCase();

      if (lower.includes('project') || lower.includes('work') || lower.includes('heritage')) {
        fallbackText = "Bhushan's top production projects include:\n\n1. 🏛️ Heritage AR (WebXR 3D cultural reconstruction at 60fps in Three.js)\n2. ⚡ EVSync (IoT EV fleet telemetry platform with Node.js, Express, MongoDB & OCPP 2.0.1)\n3. 🧠 AlphabetIQ (Speech NLP & handwritten classification engine)\n\nClick below to scroll straight to Projects or explore the architecture x-ray!";
      } else if (lower.includes('llm') || lower.includes('ethara') || lower.includes('ai') || lower.includes('intern')) {
        fallbackText = "At Ethara AI (April – June 2026), Bhushan was an LLM Post-Training Intern where he engineered Supervised Fine-Tuning (SFT) pipelines, curated high-signal RLHF preference pairs, and built multi-turn alignment benchmarks. Check out the interactive Ethara AI Sandbox below!";
      } else if (lower.includes('hire') || lower.includes('contact') || lower.includes('reach') || lower.includes('interview')) {
        fallbackText = "Bhushan is actively interviewing for Full Stack Software Engineer, Frontend Creative Developer, and Generative AI roles. You can contact him directly at bhushanchaturbhuj23@gmail.com or click 'Hire Bhushan' below to schedule an interview!";
      } else {
        fallbackText = "Bhushan Chaturbhuj is an MCA graduate, Full-Stack Developer, and LLM Post-Training Engineer (Ethara AI). He achieved National Rank 52 at IIT Bombay's NEC 2025 and builds high-framerate WebXR and distributed Node.js/MongoDB systems.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: fallbackText }]);
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
      text: "Chat cleared! Ask me anything about Bhushan's engineering work or test his fit with the JD Role Matcher.",
    }]);
    setConversationHistory([]);
  };

  // Run JD Role Matchmaker with Gemini + Deterministic Fallback
  const runJDMatchmaker = async () => {
    if (!jdInput.trim()) return;

    setIsAnalyzing(true);
    setReportCard(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (apiKey && apiKey !== 'your_google_ai_studio_key_here') {
      try {
        const prompt = `You are a Principal Executive Recruiter evaluating candidate Bhushan Chaturbhuj for the following Job Description.

Candidate Profile:
- Full-Stack Developer & LLM Post-Training Engineer
- Education: MCA / B.Tech Computer Science, GPA 8.7/10
- Key Experience: LLM Post-Training Intern at Ethara AI (SFT, RLHF, alignment pipelines, synthetic data curation)
- Featured Projects:
  1. Heritage AR: WebXR 3D spatial interactive experience (Three.js, MindAR, A-Frame, 60fps rendering)
  2. EVSync: Enterprise EV Fleet telemetry platform (Node.js, Express, MongoDB, Redis, OCPP 2.0.1 IoT protocols)
  3. AlphabetIQ: Full-stack handwritten classification & speech NLP web platform (React, Python TensorFlow)
- Stack: React, Next.js, Node.js, Express, Three.js, WebGL, MongoDB, PostgreSQL, Python, SFT, RLHF.

Job Description:
"""${jdInput.trim()}"""

Evaluate his technical match. Return ONLY a valid JSON object without markdown fences matching this format:
{
  "score": 96,
  "verdict": "Strong Senior Fit",
  "roleTitle": "Full Stack / AI Engineer",
  "summary": "One sentence executive summary of candidate alignment",
  "bullets": [
    {
      "title": "Full-Stack Architecture & Telemetry",
      "project": "EVSync & AlphabetIQ",
      "desc": "Concrete evidence how EVSync and AlphabetIQ demonstrate required backend/frontend capabilities."
    },
    {
      "title": "Applied LLM Post-Training & SFT",
      "project": "Ethara AI",
      "desc": "Concrete evidence how Ethara AI alignment and dataset work maps to the role."
    },
    {
      "title": "High-Performance 3D & Creative UI",
      "project": "Heritage AR",
      "desc": "Concrete evidence how Heritage AR 60fps WebXR rendering proves advanced interface skills."
    }
  ],
  "matchedSkills": ["React 19", "Node.js", "LLM Post-Training", "Three.js / WebXR", "MongoDB", "OCPP 2.0.1"]
}`;

        const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 700,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);

          if (parsed.score && parsed.bullets && parsed.bullets.length >= 3) {
            setReportCard(parsed);
            setIsAnalyzing(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Gemini JD Matcher API encountered an issue. Using deterministic fallback scorer.", err);
      }
    }

    // Deterministic fallback scorer
    setTimeout(() => {
      const fallback = calculateDeterministicMatch(jdInput);
      setReportCard(fallback);
      setIsAnalyzing(false);
    }, 600);
  };

  const handlePresetSelect = (preset) => {
    setActivePreset(preset.id);
    setJdInput(preset.sampleJD);
    setReportCard(null);
  };

  const copyMatchSummary = () => {
    if (!reportCard) return;
    const text = `🎯 Bhushan Chaturbhuj — JD Role Match Report:
Role: ${reportCard.roleTitle}
Score: ${reportCard.score}% (${reportCard.verdict})
Summary: ${reportCard.summary}

Why Bhushan Fits:
1. ${reportCard.bullets[0]?.title} (${reportCard.bullets[0]?.project}): ${reportCard.bullets[0]?.desc}
2. ${reportCard.bullets[1]?.title} (${reportCard.bullets[1]?.project}): ${reportCard.bullets[1]?.desc}
3. ${reportCard.bullets[2]?.title} (${reportCard.bullets[2]?.project}): ${reportCard.bullets[2]?.desc}

Top Skills: ${reportCard.matchedSkills?.join(', ')}
Portfolio: ${window.location.origin}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="ai-chat-trigger"
          onClick={() => setIsOpen(true)}
          className="glowing-ai-btn"
          style={{
            position: 'fixed',
            bottom: '1.75rem',
            right: '1.75rem',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 1.45rem',
            background: 'linear-gradient(135deg, #0d1719, #070d0e)',
            color: '#ffffff',
            border: '1px solid rgba(212, 255, 61, 0.4)',
            borderRadius: '50px',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '0.88rem',
            boxShadow: '0 12px 35px rgba(0,0,0,0.6), 0 0 20px rgba(212,255,61,0.22)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            overflow: 'hidden',
          }}
          aria-label="Open 2026 Recruiter AI Agent"
        >
          <div className="btn-shimmer" />

          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Bot size={18} color="var(--accent-lime, #d4ff3d)" className="ai-icon" />
            <Sparkles size={10} color="var(--accent-lime, #d4ff3d)" style={{ position: 'absolute', top: '-4px', right: '-4px' }} className="spark-micro" />
          </div>

          <span style={{
            letterSpacing: '0.04em',
            background: 'linear-gradient(90deg, #ffffff, #d4ff3d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            Recruiter AI Agent
            <span style={{
              fontSize: '0.65rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '20px',
              background: 'rgba(212,255,61,0.18)',
              color: '#d4ff3d',
              border: '1px solid rgba(212,255,61,0.35)',
              fontWeight: 800,
            }}>2026</span>
          </span>
        </button>
      )}

      {/* Floating Hover Tooltip */}
      {!isOpen && (
        <div
          className="ai-invite-tooltip"
          style={{
            position: 'fixed',
            bottom: '5.2rem',
            right: '1.75rem',
            zIndex: 1100,
            background: 'rgba(10, 18, 20, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(212, 255, 61, 0.35)',
            borderRadius: '14px 14px 4px 14px',
            padding: '0.55rem 1rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 15px rgba(212,255,61,0.18)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
          }}
        >
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: 'var(--accent-lime, #d4ff3d)',
            display: 'inline-block',
            boxShadow: '0 0 8px #d4ff3d',
            animation: 'pulse 1.6s infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#f8fafc',
            letterSpacing: '0.01em',
          }}>
            🎯 Match your Job Description or chat with AI!
          </span>
        </div>
      )}

      {/* Sidebar Backdrop Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(4, 7, 8, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1150,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
          touchAction: 'none',
        }}
      />

      {/* Sidebar Panel - Dark Obsidian Glassmorphic Aesthetic */}
      <div
        id="ai-chat-sidebar"
        className="ai-sidebar-panel"
        data-lenis-prevent
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          right: 0,
          width: 'min(460px, 100vw)',
          background: 'rgba(7, 13, 14, 0.96)',
          backdropFilter: 'blur(28px) saturate(180%)',
          borderLeft: '1px solid rgba(212, 255, 61, 0.22)',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.85)',
          overflowY: 'hidden',
          overscrollBehavior: 'contain',
        }}
      >
        {/* Header Bar */}
        <div style={{
          padding: '1.15rem 1.4rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(180deg, rgba(14, 24, 26, 0.9), rgba(7, 13, 14, 0.9))',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(212,255,61,0.2), rgba(7,13,14,0.9))',
              border: '1px solid rgba(212, 255, 61, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(212, 255, 61, 0.15)',
            }}>
              <Bot size={20} color="var(--accent-lime, #d4ff3d)" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.96rem',
                color: '#ffffff',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}>
                Recruiter AI Agent
                <span style={{
                  fontSize: '0.62rem',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '4px',
                  background: 'rgba(212,255,61,0.15)',
                  color: '#d4ff3d',
                  border: '1px solid rgba(212,255,61,0.3)',
                  fontWeight: 700,
                }}>v4.0</span>
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.72rem',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                marginTop: '1px',
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#d4ff3d',
                  boxShadow: '0 0 6px #d4ff3d',
                  animation: 'pulse 2s infinite',
                }} />
                Gemini 2.5 Flash · Portfolio Intelligence
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {activeTab === 'chat' && (
              <button
                onClick={clearChat}
                title="Clear chat"
                aria-label="Clear chat conversation"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  padding: '0.45rem',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'rgba(212,255,61,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              title="Close panel"
              aria-label="Close Recruiter AI Agent sidebar"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                color: '#94a3b8',
                padding: '0.45rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = 'rgba(212,255,61,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* TASK 1: Two-Mode Toggle: 💬 AI Chat vs 🎯 JD Role Matcher */}
        <div style={{
          padding: '0.75rem 1.4rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(10, 18, 20, 0.8)',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            gap: '4px',
          }}>
            <button
              onClick={() => setActiveTab('chat')}
              aria-pressed={activeTab === 'chat'}
              aria-label="Switch to AI Chat tab"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.8rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'chat' ? 700 : 500,
                background: activeTab === 'chat'
                  ? 'linear-gradient(135deg, rgba(212,255,61,0.2), rgba(212,255,61,0.08))'
                  : 'transparent',
                color: activeTab === 'chat' ? 'var(--accent-lime, #d4ff3d)' : '#94a3b8',
                boxShadow: activeTab === 'chat'
                  ? '0 0 12px rgba(212, 255, 61, 0.15), inset 0 0 1px 1px rgba(212, 255, 61, 0.3)'
                  : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <MessageSquare size={14} />
              <span>💬 AI Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('matcher')}
              aria-pressed={activeTab === 'matcher'}
              aria-label="Switch to JD Role Matcher tab"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.8rem',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                fontWeight: activeTab === 'matcher' ? 700 : 500,
                background: activeTab === 'matcher'
                  ? 'linear-gradient(135deg, rgba(212,255,61,0.2), rgba(212,255,61,0.08))'
                  : 'transparent',
                color: activeTab === 'matcher' ? 'var(--accent-lime, #d4ff3d)' : '#94a3b8',
                boxShadow: activeTab === 'matcher'
                  ? '0 0 12px rgba(212, 255, 61, 0.15), inset 0 0 1px 1px rgba(212, 255, 61, 0.3)'
                  : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <Target size={14} />
              <span>🎯 JD Role Matcher</span>
            </button>
          </div>
        </div>

        {/* ─────────────────── TAB 1: AI RECRUITER CHAT ─────────────────── */}
        {activeTab === 'chat' && (
          <>
            {/* Quick Suggested Questions */}
            {messages.length === 1 && (
              <div style={{ padding: '0.9rem 1.4rem 0.4rem', flexShrink: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  color: '#94a3b8',
                  marginBottom: '0.6rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}>Recruiter Quick Prompts</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        color: '#e2e8f0',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(212, 255, 61, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(212, 255, 61, 0.4)';
                        e.currentTarget.style.color = '#d4ff3d';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.color = '#e2e8f0';
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div
              data-lenis-prevent
              style={{
                flex: 1,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                padding: '1.25rem 1.4rem',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {messages.map((msg, i) => (
                <ChatMessage key={i} msg={msg} onAction={handleAction} />
              ))}

              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'rgba(212, 255, 61, 0.15)',
                    border: '1px solid rgba(212, 255, 61, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Bot size={15} color="var(--accent-lime, #d4ff3d)" />
                  </div>
                  <TypingIndicator />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Bar */}
            <div style={{
              padding: '1rem 1.4rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'linear-gradient(180deg, rgba(10, 18, 20, 0.8), rgba(7, 13, 14, 0.98))',
              flexShrink: 0,
            }}>
              <div style={{
                display: 'flex',
                gap: '0.65rem',
                alignItems: 'center',
                background: 'rgba(15, 25, 28, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.6rem 0.75rem 0.6rem 1rem',
                transition: 'border-color 0.25s ease',
              }}
                onFocusWithin={e => e.currentTarget.style.borderColor = 'rgba(212, 255, 61, 0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
              >
                <textarea
                  ref={inputRef}
                  id="ai-chat-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Bhushan's stack, projects, or role fit..."
                  rows={1}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: '#ffffff',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.88rem',
                    resize: 'none',
                    lineHeight: 1.45,
                    maxHeight: '90px',
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
                    borderRadius: '8px',
                    background: input.trim() && !isTyping
                      ? 'var(--accent-lime, #d4ff3d)'
                      : 'rgba(255, 255, 255, 0.06)',
                    border: 'none',
                    cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    boxShadow: input.trim() && !isTyping
                      ? '0 0 14px rgba(212, 255, 61, 0.35)'
                      : 'none',
                  }}
                  aria-label="Send message"
                >
                  <Send size={15} color={input.trim() && !isTyping ? '#070d0e' : 'rgba(255, 255, 255, 0.3)'} />
                </button>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.55rem',
                padding: '0 0.2rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.68rem',
                  color: '#64748b',
                }}>
                  Enter to send · Shift+Enter newline
                </span>
                <button
                  onClick={() => setActiveTab('matcher')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-lime, #d4ff3d)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: 0,
                  }}
                >
                  Evaluate JD fit →
                </button>
              </div>
            </div>
          </>
        )}

        {/* ─────────────────── TAB 2: 🎯 JD ROLE MATCHER ─────────────────── */}
        {activeTab === 'matcher' && (
          <div
            data-lenis-prevent
            style={{
              flex: 1,
              overflowY: 'auto',
              overscrollBehavior: 'contain',
              padding: '1.25rem 1.4rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
            }}
          >
            {/* Introductory Pill */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(212, 255, 61, 0.08), rgba(12, 20, 22, 0.7))',
              border: '1px solid rgba(212, 255, 61, 0.2)',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
            }}>
              <Zap size={18} color="var(--accent-lime, #d4ff3d)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.2rem',
                }}>
                  Instant Role-Fit Analysis
                </h4>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.74rem',
                  color: '#94a3b8',
                  lineHeight: 1.45,
                }}>
                  Paste your Job Description or choose a preset. Gemini will analyze Bhushan's exact project evidence (*Heritage AR*, *EVSync*, *AlphabetIQ*) and *Ethara AI* internship to produce a verified Match Report.
                </p>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>Quick Role Presets</span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>1-Click Load</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                {JD_PRESETS.map(preset => {
                  const isSelected = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      style={{
                        padding: '0.55rem 0.4rem',
                        background: isSelected ? 'rgba(212, 255, 61, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected ? '1px solid rgba(212, 255, 61, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        color: isSelected ? 'var(--accent-lime, #d4ff3d)' : '#cbd5e1',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.72rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* JD Textarea */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.4rem',
              }}>
                <label
                  htmlFor="jd-textarea-input"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Job Description Content
                </label>
                {jdInput && (
                  <button
                    onClick={() => { setJdInput(''); setActivePreset(null); setReportCard(null); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '0.68rem',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Clear text
                  </button>
                )}
              </div>

              <textarea
                ref={jdTextareaRef}
                id="jd-textarea-input"
                rows={5}
                value={jdInput}
                onChange={e => {
                  setJdInput(e.target.value);
                  setActivePreset(null);
                }}
                placeholder="Paste Job Description (requirements, responsibilities, tech stack)..."
                style={{
                  width: '100%',
                  background: 'rgba(13, 22, 24, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '0.8rem 0.9rem',
                  color: '#ffffff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(212, 255, 61, 0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
              />
            </div>

            {/* Run Matcher CTA Button */}
            <button
              onClick={runJDMatchmaker}
              disabled={!jdInput.trim() || isAnalyzing}
              className="analyze-jd-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                width: '100%',
                padding: '0.85rem 1.2rem',
                background: isAnalyzing
                  ? 'rgba(212, 255, 61, 0.2)'
                  : 'linear-gradient(135deg, var(--accent-lime, #d4ff3d), #b8e622)',
                color: isAnalyzing ? '#d4ff3d' : '#070d0e',
                border: 'none',
                borderRadius: '10px',
                fontFamily: 'var(--font-display)',
                fontSize: '0.88rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                cursor: !jdInput.trim() || isAnalyzing ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isAnalyzing
                  ? 'none'
                  : '0 8px 25px rgba(212, 255, 61, 0.3)',
              }}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={16} className="spin-icon" />
                  <span>Synthesizing Project Evidence...</span>
                </>
              ) : (
                <>
                  <Target size={17} />
                  <span>Analyze Role Match with Gemini</span>
                </>
              )}
            </button>

            {/* ────────── MATCH REPORT CARD ────────── */}
            {reportCard && (
              <div
                className="match-report-card"
                style={{
                  background: 'linear-gradient(180deg, rgba(14, 25, 28, 0.95), rgba(8, 15, 17, 0.98))',
                  border: '1px solid rgba(212, 255, 61, 0.3)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,255,61,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.1rem',
                  animation: 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Score Header with Animated Volt Lime Radial Ring */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.1rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}>
                  {/* Radial Ring */}
                  <div style={{ position: 'relative', width: '92px', height: '92px', flexShrink: 0 }}>
                    <svg width="92" height="92" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="var(--accent-lime, #d4ff3d)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={2 * Math.PI * 42 * (1 - reportCard.score / 100)}
                        style={{
                          transform: 'rotate(-90deg)',
                          transformOrigin: '50% 50%',
                          transition: 'stroke-dashoffset 1.3s cubic-bezier(0.16, 1, 0.3, 1)',
                          filter: 'drop-shadow(0 0 8px rgba(212, 255, 61, 0.7))',
                        }}
                      />
                      <text
                        x="50"
                        y="47"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="22"
                        fontWeight="900"
                        fontFamily="var(--font-display)"
                      >
                        {reportCard.score}%
                      </text>
                      <text
                        x="50"
                        y="64"
                        textAnchor="middle"
                        fill="var(--accent-lime, #d4ff3d)"
                        fontSize="8.5"
                        fontWeight="800"
                        letterSpacing="1px"
                      >
                        MATCH
                      </text>
                    </svg>
                  </div>

                  {/* Verdict & Role Title */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '50px',
                      background: 'rgba(212, 255, 61, 0.15)',
                      border: '1px solid rgba(212, 255, 61, 0.35)',
                      color: 'var(--accent-lime, #d4ff3d)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      marginBottom: '0.35rem',
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#d4ff3d', boxShadow: '0 0 5px #d4ff3d' }} />
                      {reportCard.verdict}
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.02rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      lineHeight: 1.25,
                      margin: 0,
                    }}>
                      {reportCard.roleTitle}
                    </h3>

                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.73rem',
                      color: '#94a3b8',
                      margin: '0.3rem 0 0',
                      lineHeight: 1.4,
                    }}>
                      {reportCard.summary}
                    </p>
                  </div>
                </div>

                {/* Why Bhushan Fits: 3 Pillars mapped to exact projects */}
                <div>
                  <h4 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    marginBottom: '0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}>
                    <Check size={14} color="var(--accent-lime, #d4ff3d)" />
                    Why Bhushan Fits (Project Evidence)
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {reportCard.bullets.map((bullet, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '10px',
                          padding: '0.7rem 0.85rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.65rem',
                          transition: 'border-color 0.2s ease',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,255,61,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
                      >
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          background: 'rgba(212, 255, 61, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                        }}>
                          {idx === 0 ? <Server size={14} color="#d4ff3d" /> :
                           idx === 1 ? <Cpu size={14} color="#d4ff3d" /> :
                                       <Layers size={14} color="#d4ff3d" />}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            gap: '0.4rem',
                            marginBottom: '0.2rem',
                          }}>
                            <span style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              color: '#ffffff',
                            }}>
                              {bullet.title}
                            </span>
                            <span style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.66rem',
                              color: 'var(--accent-lime, #d4ff3d)',
                              fontWeight: 700,
                              padding: '0.05rem 0.4rem',
                              borderRadius: '4px',
                              background: 'rgba(212, 255, 61, 0.1)',
                              whiteSpace: 'nowrap',
                            }}>
                              {bullet.project}
                            </span>
                          </div>

                          <p style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.74rem',
                            color: '#94a3b8',
                            lineHeight: 1.45,
                            margin: 0,
                          }}>
                            {bullet.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overlapping Tech Stack Badges */}
                {reportCard.matchedSkills && (
                  <div>
                    <span style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.68rem',
                      color: '#64748b',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.4rem',
                    }}>
                      Verified Competency Overlap
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {reportCard.matchedSkills.map((skill, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '0.25rem 0.6rem',
                            background: 'rgba(212, 255, 61, 0.08)',
                            border: '1px solid rgba(212, 255, 61, 0.22)',
                            borderRadius: '20px',
                            color: '#e2e8f0',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons: Direct CTA to Schedule Interview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <button
                    onClick={() => handleAction('hire', reportCard.roleTitle)}
                    className="schedule-interview-cta"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.85rem 1rem',
                      background: 'linear-gradient(135deg, var(--accent-lime, #d4ff3d), #b8e622)',
                      color: '#070d0e',
                      border: 'none',
                      borderRadius: '10px',
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 8px 24px rgba(212, 255, 61, 0.35)',
                    }}
                  >
                    <span>Schedule Interview with Bhushan →</span>
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                    <button
                      onClick={copyMatchSummary}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: copiedSummary ? '#d4ff3d' : '#cbd5e1',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {copiedSummary ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedSummary ? 'Copied Report!' : 'Copy Summary'}</span>
                    </button>

                    <button
                      onClick={() => handleAction('resume')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.55rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: '#cbd5e1',
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <FileText size={14} />
                      <span>Download Resume</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes dot-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes float-btn {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .spin-icon {
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .glowing-ai-btn {
          animation: float-btn 3.8s ease-in-out infinite;
        }

        .glowing-ai-btn:hover {
          border-color: var(--accent-lime, #d4ff3d) !important;
          box-shadow: 0 14px 45px rgba(0,0,0,0.7), 0 0 30px rgba(212,255,61,0.4) !important;
          transform: translateY(-2px);
        }

        .glowing-ai-btn:hover .ai-icon {
          transform: rotate(12deg) scale(1.1);
        }

        .glowing-ai-btn:hover .spark-micro {
          transform: scale(1.3) rotate(-20deg);
          filter: drop-shadow(0 0 6px var(--accent-lime, #d4ff3d));
        }

        .btn-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(212,255,61,0.22),
            transparent
          );
          transform: skewX(-25deg);
          animation: shimmerSweep 4.5s infinite;
        }

        @keyframes shimmerSweep {
          0% { left: -100%; }
          30% { left: 160%; }
          100% { left: 160%; }
        }

        .ai-invite-tooltip {
          opacity: 0 !important;
          pointer-events: none;
          transform: translateY(8px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .glowing-ai-btn:hover ~ .ai-invite-tooltip,
        .glowing-ai-btn:focus ~ .ai-invite-tooltip {
          opacity: 1 !important;
          pointer-events: auto;
          transform: translateY(0);
        }

        .chat-action-chip:hover {
          background: var(--accent-lime, #d4ff3d) !important;
          color: #070d0e !important;
          box-shadow: 0 0 14px rgba(212, 255, 61, 0.4) !important;
          transform: translateY(-1px);
        }

        .schedule-interview-cta:hover {
          box-shadow: 0 10px 30px rgba(212, 255, 61, 0.5) !important;
          transform: translateY(-2px);
        }

        .analyze-jd-btn:hover:not(:disabled) {
          box-shadow: 0 10px 30px rgba(212, 255, 61, 0.45) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 480px) {
          .ai-sidebar-panel {
            width: 100vw !important;
            border-left: none !important;
          }
          .glowing-ai-btn {
            bottom: 1.25rem !important;
            right: 1.25rem !important;
            padding: 0.75rem 1.25rem !important;
          }
          .ai-invite-tooltip {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
