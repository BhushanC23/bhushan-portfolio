import { useState, useRef } from 'react';
import { GitBranch, Link, AtSign, Mail, Send, MapPin } from 'lucide-react';
import { BHUSHAN_DATA } from '../data/bhushanData';

const SOCIAL_LINKS = [
  { icon: GitBranch, href: BHUSHAN_DATA.social.github, label: 'GitHub', handle: '@BhushanC23' },
  { icon: Link, href: BHUSHAN_DATA.social.linkedin, label: 'LinkedIn', handle: 'bhushan-chaturbhuj' },
  { icon: AtSign, href: BHUSHAN_DATA.social.instagram, label: 'Instagram', handle: '@bhushxnn.in' },
  { icon: Mail, href: `mailto:${BHUSHAN_DATA.social.email}`, label: 'Email', handle: 'bhushan.chaturbhuj...' },
];

export default function ContactSection() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission — integrate with EmailJS/Formspree in production
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1.25rem',
    background: 'rgba(13,26,28,0.8)',
    border: '1px solid rgba(45,212,191,0.15)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    backdropFilter: 'blur(8px)',
  };

  const focusStyle = {
    borderColor: 'rgba(45,212,191,0.5)',
    boxShadow: '0 0 0 3px rgba(45,212,191,0.08)',
  };

  return (
    <section id="contact" style={{
      background: 'var(--bg-primary)',
      padding: '7rem 0 5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(ellipse, rgba(45,212,191,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', justifyContent: 'center' }}>
            <div style={{ width: '30px', height: '1.5px', background: 'var(--teal-accent)' }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--teal-accent)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>Get In Touch</span>
            <div style={{ width: '30px', height: '1.5px', background: 'var(--teal-accent)' }} />
          </div>
          <h2 className="section-title" style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Let's Work<br />
            <span className="animated-underline">Together.</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            maxWidth: '480px',
            margin: '0 auto',
          }}>
            Have a project in mind? I'm currently open to freelance work and full-time opportunities.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="contact-two-col" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '4rem',
          alignItems: 'start',
        }}>
          {/* Left — Info */}
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <MapPin size={18} color="var(--teal-accent)" />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Kopargaon, Maharashtra, India
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--teal-accent)" />
                <a href={`mailto:${BHUSHAN_DATA.social.email}`} style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--teal-accent)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                  {BHUSHAN_DATA.social.email}
                </a>
              </div>
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, handle }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    background: 'rgba(13,26,28,0.6)',
                    border: '1px solid rgba(45,212,191,0.1)',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(45,212,191,0.3)';
                    e.currentTarget.style.background = 'rgba(13,26,28,0.9)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(45,212,191,0.1)';
                    e.currentTarget.style.background = 'rgba(13,26,28,0.6)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(45,212,191,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={18} color="var(--teal-accent)" />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}>{label}</div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}>{handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="contact-form-box" style={{
            padding: '2.5rem',
            background: 'rgba(13,26,28,0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(45,212,191,0.1)',
            backdropFilter: 'blur(12px)',
          }}>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--teal-accent)',
                  marginBottom: '0.5rem',
                }}>Message Sent!</h3>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
                  I'll get back to you soon. Thanks!
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>Name</label>
                  <input
                    type="text"
                    name="name"
                    id="contact-name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(45,212,191,0.15)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    id="contact-email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    style={inputStyle}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(45,212,191,0.15)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>Message</label>
                  <textarea
                    name="message"
                    id="contact-message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '130px' }}
                    onFocus={e => Object.assign(e.target.style, focusStyle)}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(45,212,191,0.15)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={isSubmitting}
                  className="btn-teal"
                  style={{
                    justifyContent: 'center',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '5rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(45,212,191,0.08)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}>
            © 2025 Bhushan Chaturbhuj. Designed & Built with ❤️ and lots of ☕
          </p>
        </div>
      </div>

      <style>{`
        /* === CONTACT SECTION RESPONSIVE === */
        @media (max-width: 900px) {
          #contact {
            padding: 4rem 0 3rem !important;
          }
          .contact-two-col {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 640px) {
          #contact {
            padding: 3.5rem 0 2.5rem !important;
          }
          .contact-form-box {
            padding: 1.5rem !important;
          }
          .contact-social-link {
            padding: 0.75rem 1rem !important;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
