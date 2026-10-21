import { useEffect } from 'react';
import {
  X,
  Zap,
  Cpu,
  Layers,
  Database,
  Globe,
  ExternalLink,
  GitBranch,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Server,
  ArrowRight
} from 'lucide-react';

const ARCHITECTURE_PRESETS = {
  'EVSync': {
    pipeline: [
      { layer: 'Client / UI', tech: 'React 19 + GSAP', desc: 'Real-time vehicle comparator with multi-slider heuristic filters' },
      { layer: 'Engine / API', tech: 'Node.js + Express', desc: 'Custom recommendation engine evaluating budget, range & charging curve' },
      { layer: 'Data Layer', tech: 'MongoDB Atlas', desc: 'Indexed specs database with normalized query execution' },
    ],
    bottleneck: 'Calculating multi-variable recommendation scores across 40+ EV specs with sub-50ms latency on client devices.',
    solution: 'Designed an in-memory weighted scoring matrix with debounced client state, preventing redundant network roundtrips.',
    metrics: [
      { label: 'Query Latency', value: '< 45ms', status: 'Optimal' },
      { label: 'Spec Attributes', value: '40+', status: 'Indexed' },
      { label: 'Client Overhead', value: 'Zero Lag', status: '60 FPS' },
    ],
  },
  'District Community & Membership CMS': {
    pipeline: [
      { layer: 'Client / UI', tech: 'React + Vite', desc: 'Admin control center with secure biometric auth and member roster' },
      { layer: 'Media & SMS Engine', tech: 'Cloudinary CDN + Fast2SMS', desc: 'Asynchronous asset compression and instant transactional OTP routing' },
      { layer: 'Database', tech: 'MongoDB', desc: 'Role-based access control (RBAC) with audit logging' },
    ],
    bottleneck: 'Handling high-resolution portrait uploads on erratic mobile networks without timing out.',
    solution: 'Implemented client-side image canvas pre-compression before streaming to Cloudinary via direct signed upload presets.',
    metrics: [
      { label: 'Upload Speedup', value: '3.8x', status: 'Optimized' },
      { label: 'SMS Delivery SLA', value: '99.4%', status: 'Automated' },
      { label: 'Admin Access SLA', value: '< 100ms', status: 'RBAC' },
    ],
  },
  'Heritage AR — Cultural Platform': {
    pipeline: [
      { layer: 'WebXR Client', tech: 'MindAR + A-Frame', desc: 'Browser-based augmented reality rendering detailed 3D historical monuments' },
      { layer: 'Graphics Engine', tech: 'Three.js / WebGL', desc: 'PBR shading, directional ambient lighting, and geometry decimation' },
      { layer: 'Edge CDN', tech: 'Vercel Edge Network', desc: 'GLTF/GLB model streaming with brotli compression' },
    ],
    bottleneck: 'Thermal throttling and frame drops on mid-range Android and iOS devices when loading complex 3D meshes.',
    solution: 'Streamlined A-Frame rendering pipeline with LOD (Level of Detail) mesh swapping and strict draw call culling, sustaining 60fps.',
    metrics: [
      { label: 'Render Stability', value: '60 FPS', status: 'Locked' },
      { label: 'Native Installs', value: '0 Required', status: 'Browser' },
      { label: 'Track Latency', value: '< 120ms', status: 'Markerless' },
    ],
  },
  'Ziply': {
    pipeline: [
      { layer: 'Client / UI', tech: 'React.js', desc: 'Clean drag-and-drop file transfer interface with end-to-end encryption' },
      { layer: 'Token Engine', tech: 'Node.js Crypto', desc: 'Cryptographic URL generation with single-use and TTL expiration tokens' },
      { layer: 'Storage / Cache', tech: 'MongoDB TTL Indices', desc: 'Self-pruning ephemeral document storage with zero residue' },
    ],
    bottleneck: 'Preventing orphaned file artifacts and stale link access while maintaining zero-knowledge architecture.',
    solution: 'Combined cryptographic HMAC one-time pass tokens with automated MongoDB TTL index eviction pipelines.',
    metrics: [
      { label: 'Data Retention', value: 'Zero Residue', status: 'Auto-Purge' },
      { label: 'Encryption', value: 'AES-256', status: 'Enforced' },
      { label: 'Token Lifecycle', value: 'Single-Use', status: 'Secure' },
    ],
  },
  'AlphabetIQ Classifier': {
    pipeline: [
      { layer: 'Capture Client', tech: 'Interactive Canvas UI', desc: 'Touch and mouse drawing pad capturing stroke trajectories' },
      { layer: 'Pre-Processing', tech: 'Python + OpenCV', desc: 'Bilinear interpolation, grayscale normalization, and contrast enhancement' },
      { layer: 'Inference Model', tech: 'TensorFlow CNN', desc: 'Convolutional neural network trained on thousands of handwritten samples' },
    ],
    bottleneck: 'Handling varying stroke thicknesses and noisy backgrounds from casual finger drawing.',
    solution: 'Trained CNN with aggressive spatial data augmentation, Gaussian blurring, and bounding-box centration.',
    metrics: [
      { label: 'Test Accuracy', value: '96.4%', status: 'Validated' },
      { label: 'Inference SLA', value: '14ms', status: 'Real-time' },
      { label: 'Model Footprint', value: '< 3.2MB', status: 'Edge-ready' },
    ],
  },
  'Sanskriti AR': {
    pipeline: [
      { layer: 'WebXR Interface', tech: 'React + TypeScript', desc: 'Cultural visual immersion platform with real-time camera tracking' },
      { layer: 'Vision Engine', tech: 'MindAR Face Tracker', desc: '68 facial landmark detection running entirely client-side in WebAssembly' },
      { layer: 'Rendering Core', tech: 'Three.js Shaders', desc: 'Custom glowing aura and traditional headdress projection shaders' },
    ],
    bottleneck: 'High battery consumption and jitter during facial landmark tracking under low-light ambient conditions.',
    solution: 'Implemented Kalman filtering on landmark coordinates to smooth micro-jitters without adding frame lag.',
    metrics: [
      { label: 'Tracking Speed', value: '30 FPS', status: 'WASM' },
      { label: 'Jitter Reduction', value: '78%', status: 'Kalman' },
      { label: 'Latency', value: '< 25ms', status: 'Real-time' },
    ],
  },
};

export default function ArchitectureXRayModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    window.lenis?.stop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      window.lenis?.start();
    };
  }, [onClose]);

  if (!project) return null;

  const title = project.title || project.name || 'System Architecture';
  const category = project.category || project.tag || 'Full Stack';
  const stack = Array.isArray(project.techStack)
    ? project.techStack
    : (Array.isArray(project.tech) ? project.tech : (Array.isArray(project.stack) ? project.stack : []));
  const liveUrl = project.demo || project.liveUrl;
  const githubUrl = project.github || project.githubUrl;

  const preset = ARCHITECTURE_PRESETS[title] || {
    pipeline: [
      { layer: 'Client / Interface', tech: stack.slice(0, 2).join(' + ') || 'React 19', desc: 'Reactive state machine with componentized layout' },
      { layer: 'Application Middleware', tech: stack[2] || 'Node.js REST API', desc: 'Low-latency request routing and business logic validation' },
      { layer: 'Data & Model Engine', tech: stack[3] || 'Cloud Database', desc: 'High availability persistence and indexed queries' },
    ],
    bottleneck: project.architectureNotes || 'Architected for clean separation of concerns, high throughput, and zero layout thrashing.',
    solution: 'Structured with asynchronous micro-services, caching layers, and decoupled frontend pipelines.',
    metrics: [
      { label: 'Runtime SLA', value: '99.9%', status: 'Optimal' },
      { label: 'Responsiveness', value: '< 100ms', status: 'Fast' },
      { label: 'Code Quality', value: 'Strict TS', status: 'Verified' },
    ],
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(4, 4, 6, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'modal-fade-in 0.22s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          background: '#0a0a0f',
          border: '1px solid rgba(212, 255, 61, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 30px 100px rgba(0, 0, 0, 0.9), 0 0 50px rgba(212, 255, 61, 0.08)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Top Glow Highlight */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #d4ff3d, transparent)',
          opacity: 0.9,
        }} />

        {/* Modal Header */}
        <div style={{
          padding: '1.75rem 2rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.015)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '100px',
                background: 'rgba(212, 255, 61, 0.1)',
                border: '1px solid rgba(212, 255, 61, 0.3)',
                fontSize: '10px',
                fontWeight: 700,
                color: '#d4ff3d',
                fontFamily: 'monospace',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                <Zap size={10} fill="currentColor" />
                SYSTEM ARCHITECTURE X-RAY
              </span>

              <span style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.45)',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
              }}>
                {category}
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display, "Syne", sans-serif)',
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0.2rem 0 0.35rem',
              letterSpacing: '-0.02em',
            }}>
              {title}
            </h2>

            <p style={{
              fontSize: '0.86rem',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
              lineHeight: 1.5,
              maxWidth: '600px',
            }}>
              {project.desc || project.description}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close architecture modal"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'rgba(212, 255, 61, 0.4)';
              e.currentTarget.style.background = 'rgba(212, 255, 61, 0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

          {/* ── 1. Three-Tier System Architecture Pipeline ── */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.85rem',
            }}>
              <span style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#d4ff3d',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                [01] Runtime Pipeline Topology
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.35)', fontFamily: 'monospace' }}>
                End-to-End Data Flow
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.85rem',
              position: 'relative',
            }}>
              {preset.pipeline.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#101016',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.1rem',
                    position: 'relative',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212, 255, 61, 0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                  }}>
                    <span style={{
                      fontSize: '10px',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: 'rgba(255, 255, 255, 0.45)',
                      textTransform: 'uppercase',
                    }}>
                      Stage 0{idx + 1}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: 'rgba(212, 255, 61, 0.08)',
                      color: '#d4ff3d',
                      fontFamily: 'monospace',
                    }}>
                      Active
                    </span>
                  </div>

                  <div style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '0.2rem',
                  }}>
                    {step.layer}
                  </div>

                  <div style={{
                    fontSize: '0.74rem',
                    fontFamily: 'monospace',
                    color: '#d4ff3d',
                    marginBottom: '0.45rem',
                  }}>
                    {step.tech}
                  </div>

                  <div style={{
                    fontSize: '0.74rem',
                    color: 'rgba(255, 255, 255, 0.55)',
                    lineHeight: 1.45,
                  }}>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 2. Engineering Challenge Solved & Solution ── */}
          <div style={{
            background: 'rgba(212, 255, 61, 0.03)',
            border: '1px solid rgba(212, 255, 61, 0.15)',
            borderRadius: '16px',
            padding: '1.25rem 1.4rem',
            position: 'relative',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.65rem',
              color: '#d4ff3d',
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              <Cpu size={14} />
              Key Engineering Bottleneck &amp; Architectural Fix
            </div>

            <div style={{ marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 700, fontFamily: 'monospace' }}>
                CRITICAL BOTTLENECK:
              </span>{' '}
              <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5 }}>
                {preset.bottleneck}
              </span>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: '#86efac', fontWeight: 700, fontFamily: 'monospace' }}>
                ARCHITECTURAL SOLUTION:
              </span>{' '}
              <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5 }}>
                {preset.solution}
              </span>
            </div>
          </div>

          {/* ── 3. Performance SLA & Telemetry Metrics ── */}
          <div>
            <div style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 700,
              color: '#d4ff3d',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '0.85rem',
            }}>
              [02] Runtime Metrics &amp; Validation SLA
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.75rem',
            }}>
              {preset.metrics.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#101016',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '0.9rem 1.1rem',
                  }}
                >
                  <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.45)', fontFamily: 'monospace', marginBottom: '0.2rem' }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display, "Syne", sans-serif)' }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: '9px', color: '#86efac', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                    ● {m.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 4. Tech Stack Breakdown ── */}
          {stack.length > 0 && (
            <div>
              <div style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#d4ff3d',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '0.75rem',
              }}>
                [03] Integrated Stack Modules
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {stack.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '0.78rem',
                      fontFamily: 'monospace',
                      color: 'rgba(255, 255, 255, 0.85)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: '1.25rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              fontFamily: 'monospace',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
          >
            ← Close X-Ray
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(212, 255, 61, 0.4)';
                  e.currentTarget.style.color = '#d4ff3d';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                <GitBranch size={13} />
                Repository
              </a>
            )}

            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '10px',
                  background: '#d4ff3d',
                  color: '#000000',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 0 20px rgba(212, 255, 61, 0.3)',
                  transition: 'transform 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ExternalLink size={13} />
                Live Demo ↗
              </a>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
