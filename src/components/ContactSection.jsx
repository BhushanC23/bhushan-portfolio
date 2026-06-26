import { useState, useRef, useEffect } from 'react';
import { GitBranch, Link, AtSign, Mail, Send, MapPin } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { BHUSHAN_DATA } from '../data/bhushanData';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { icon: GitBranch, href: BHUSHAN_DATA.social.github, label: 'GitHub', handle: '@BhushanC23' },
  { icon: Link, href: BHUSHAN_DATA.social.linkedin, label: 'LinkedIn', handle: 'bhushan-chaturbhuj' },
  { icon: AtSign, href: BHUSHAN_DATA.social.instagram, label: 'Instagram', handle: '@bhushxnn.in' },
  { icon: Mail, href: `mailto:${BHUSHAN_DATA.social.email}`, label: 'Email', handle: 'bhushan.chaturbhuj...' },
];

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    purpose: 'General Inquiry',
    role: '',
    jobType: 'Full-Time',
    budget: 'TBD / Flexible',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const formBoxRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const setField = (name, value) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      }
      if (formBoxRef.current) {
        gsap.fromTo(formBoxRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 0.9,
            delay: isMobile ? 0 : 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: formBoxRef.current,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, [isMobile]);

  const handleChange = (e) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getEmailSubject = () => {
    if (formState.purpose === 'Hiring / Job Offer') {
      return `[Hiring] ${formState.role || 'Position'} at ${formState.company || 'Unknown Company'}`;
    }
    if (formState.purpose === 'Freelance Project') {
      return `[Freelance] Project Inquiry - Budget: ${formState.budget}`;
    }
    return `[General] Portfolio Message from ${formState.name}`;
  };

  const getPlaceholderText = () => {
    switch (formState.purpose) {
      case 'Hiring / Job Offer':
        return 'Tell me about the position, team structure, tech stack, and next steps in your recruitment process...';
      case 'Freelance Project':
        return 'Tell me about your project, key goals, timeline, and any specific requirements...';
      default:
        return 'Tell me how I can help you, or details about your inquiry...';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '0186bb1b-0807-4b4e-9aa9-e0331a592844';

      const payload = {
        access_key: apiKey,
        subject: getEmailSubject(),
        from_name: 'Bhushan Portfolio',
        name: formState.name,
        email: formState.email,
        purpose: formState.purpose,
        message: formState.message,
      };

      if (formState.purpose === 'Hiring / Job Offer') {
        payload.company = formState.company;
        payload.role = formState.role;
        payload.job_type = formState.jobType;
      } else if (formState.purpose === 'Freelance Project') {
        if (formState.company) payload.company = formState.company;
        payload.budget = formState.budget;
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        setFormState({
          name: '',
          email: '',
          company: '',
          purpose: 'General Inquiry',
          role: '',
          jobType: 'Full-Time',
          budget: 'TBD / Flexible',
          message: ''
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert(data.message || 'Oops! There was an issue sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Email submission error:', error);
      if (error.message === 'Web3Forms Access Key not set in environment.') {
        alert('Configuration Error: Web3Forms Access Key is not configured. Please define VITE_WEB3FORMS_ACCESS_KEY in your .env file.');
      } else {
        alert(
          `Failed to connect to the email server.\n\n` +
          `If you are using an ad-blocker (like Brave Shields or uBlock Origin), it might be blocking the submission. Please temporarily disable it and try again.\n\n` +
          `Alternatively, you can email me directly at: ${BHUSHAN_DATA.social.email}`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const underlineInputStyle = {
    width: '100%',
    padding: '1rem 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(45,212,191,0.2)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  return (
    <section id="contact" ref={sectionRef} style={{
      background: 'var(--bg-primary)',
      padding: '10rem 0 5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative number */}
      <div className="section-deco-number" style={{ left: '-2%', top: '-5%' }}>06</div>

      {/* Background glow */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '700px',
        height: '350px',
        background: 'radial-gradient(ellipse, rgba(45,212,191,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container-xl" style={{ position: 'relative', zIndex: 1 }}>
        {/* Editorial headline — full width, centered */}
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>

          {/* Very large editorial title */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: 'var(--text-primary)',
          }}>
            Let's build <span style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'var(--cream)',
              letterSpacing: '-0.02em',
            }}>something</span>
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            color: 'var(--cream)',
          }}>
            extraordinary
          </div>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--text-muted)',
            marginTop: '1.5rem',
          }}>
            Available for full-time roles and freelance projects.
          </p>

          {/* Large email CTA */}
          <a
            href={`mailto:${BHUSHAN_DATA.social.email}`}
            className="magnetic"
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              fontWeight: 600,
              color: 'var(--teal-accent)',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {BHUSHAN_DATA.social.email}
            <span style={{
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              width: '100%',
              height: '1px',
              background: 'var(--teal-accent)',
              transformOrigin: 'left',
              transform: 'scaleX(0)',
              transition: 'transform 0.3s ease',
            }} className="email-underline" />
          </a>
        </div>

        {/* Two-column: social + form */}
        <div className="contact-two-col" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '4rem',
          alignItems: 'start',
        }}>
          {/* Left — Location + social links */}
          <div>
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <MapPin size={16} color="var(--teal-accent)" />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Kopargaon, Maharashtra, India
                </span>
              </div>
            </div>

            {/* Social links — icon only + label */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SOCIAL_LINKS.map(({ icon: Icon, href, label, handle }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="magnetic"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.875rem 1.25rem',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(8px)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(45,212,191,0.25)';
                    e.currentTarget.style.transform = 'translateX(6px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--card-border)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(45,212,191,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={16} color="var(--teal-accent)" />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                    }}>{label}</div>
                    <div style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                    }}>{handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — Contact form */}
          <div ref={formBoxRef} className="contact-form-box">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: '2rem',
                  color: 'var(--cream)',
                  marginBottom: '0.75rem',
                }}>Message sent.</div>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  I'll get back to you soon. Thanks!
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Float-label inputs */}
                {[
                  { name: 'name', type: 'text', label: 'Your name', required: true },
                  { name: 'email', type: 'email', label: 'your@email.com', required: true },
                ].map(({ name, type, label, required }) => (
                  <div key={name} style={{ position: 'relative' }}>
                    <input
                      type={type}
                      name={name}
                      id={`contact-${name}`}
                      value={formState[name]}
                      onChange={handleChange}
                      placeholder={label}
                      required={required}
                      style={underlineInputStyle}
                      onFocus={e => e.target.style.borderBottomColor = 'var(--teal-accent)'}
                      onBlur={e => e.target.style.borderBottomColor = 'rgba(45,212,191,0.2)'}
                    />
                  </div>
                ))}

                {/* Purpose of Contact selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Purpose of Contact
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {['General Inquiry', 'Hiring / Job Offer', 'Freelance Project'].map((opt) => {
                      const active = formState.purpose === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setField('purpose', opt)}
                          style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '50px',
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            background: active ? 'rgba(45, 212, 191, 0.12)' : 'rgba(13, 26, 28, 0.4)',
                            border: `1px solid ${active ? 'var(--teal-accent)' : 'var(--card-border)'}`,
                            color: active ? 'var(--teal-accent)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                            boxShadow: active ? '0 0 12px rgba(45, 212, 191, 0.15)' : 'none',
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Conditional Fields Wrapper with smooth CSS animation */}
                {(() => {
                  const showHiring = formState.purpose === 'Hiring / Job Offer';
                  const showFreelance = formState.purpose === 'Freelance Project';
                  const hasConditional = showHiring || showFreelance;
                  return (
                    <div
                      style={{
                        maxHeight: hasConditional ? '320px' : '0px',
                        opacity: hasConditional ? 1 : 0,
                        transform: hasConditional ? 'translateY(0)' : 'translateY(-10px)',
                        overflow: 'hidden',
                        transition: 'max-height 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease, transform 0.35s ease, margin 0.35s ease',
                        marginTop: hasConditional ? '0.5rem' : '0px',
                        marginBottom: hasConditional ? '0.5rem' : '0px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                      }}
                    >
                      {/* Hiring Fields */}
                      {showHiring && (
                        <>
                          <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ position: 'relative' }}>
                              <input
                                type="text"
                                name="company"
                                id="contact-company"
                                value={formState.company}
                                onChange={handleChange}
                                placeholder="Company / Organization"
                                required={showHiring}
                                style={underlineInputStyle}
                                onFocus={e => e.target.style.borderBottomColor = 'var(--teal-accent)'}
                                onBlur={e => e.target.style.borderBottomColor = 'rgba(45,212,191,0.2)'}
                              />
                            </div>
                            <div style={{ position: 'relative' }}>
                              <input
                                type="text"
                                name="role"
                                id="contact-role"
                                value={formState.role}
                                onChange={handleChange}
                                placeholder="Target Role / Position"
                                required={showHiring}
                                style={underlineInputStyle}
                                onFocus={e => e.target.style.borderBottomColor = 'var(--teal-accent)'}
                                onBlur={e => e.target.style.borderBottomColor = 'rgba(45,212,191,0.2)'}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Job Type
                            </span>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                              {['Full-Time', 'Contract', 'Part-Time / Other'].map((t) => {
                                const active = formState.jobType === t;
                                return (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={() => setField('jobType', t)}
                                    style={{
                                      padding: '0.4rem 0.9rem',
                                      borderRadius: '20px',
                                      fontFamily: 'var(--font-body)',
                                      fontSize: '0.78rem',
                                      fontWeight: 500,
                                      background: active ? 'rgba(45, 212, 191, 0.08)' : 'transparent',
                                      border: `1px solid ${active ? 'var(--teal-accent)' : 'rgba(45, 212, 191, 0.15)'}`,
                                      color: active ? 'var(--teal-accent)' : 'var(--text-muted)',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    {t}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '-0.25rem' }}>
                            <span style={{ color: 'var(--teal-accent)', fontSize: '1.1rem', lineHeight: '0.8' }}>✦</span>
                            <span>I am open to full-time remote or hybrid positions (relocation negotiable).</span>
                          </div>
                        </>
                      )}

                      {/* Freelance Fields */}
                      {showFreelance && (
                        <>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="text"
                              name="company"
                              id="contact-project-company"
                              value={formState.company}
                              onChange={handleChange}
                              placeholder="Company / Project Name (Optional)"
                              style={underlineInputStyle}
                              onFocus={e => e.target.style.borderBottomColor = 'var(--teal-accent)'}
                              onBlur={e => e.target.style.borderBottomColor = 'rgba(45,212,191,0.2)'}
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              Project Budget (USD)
                            </span>
                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                              {['TBD / Flexible', 'Under $2k', '$2k - $5k', '$5k+'].map((b) => {
                                const active = formState.budget === b;
                                return (
                                  <button
                                    key={b}
                                    type="button"
                                    onClick={() => setField('budget', b)}
                                    style={{
                                      padding: '0.4rem 0.9rem',
                                      borderRadius: '20px',
                                      fontFamily: 'var(--font-body)',
                                      fontSize: '0.78rem',
                                      fontWeight: 500,
                                      background: active ? 'rgba(45, 212, 191, 0.08)' : 'transparent',
                                      border: `1px solid ${active ? 'var(--teal-accent)' : 'rgba(45, 212, 191, 0.15)'}`,
                                      color: active ? 'var(--teal-accent)' : 'var(--text-muted)',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    {b}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '-0.25rem' }}>
                            <span style={{ color: 'var(--teal-accent)', fontSize: '1.1rem', lineHeight: '0.8' }}>✦</span>
                            <span>Please share high-level project goals, timeline, and tech constraints.</span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}

                <div style={{ position: 'relative' }}>
                  <textarea
                    name="message"
                    id="contact-message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder={getPlaceholderText()}
                    required
                    rows={5}
                    style={{ ...underlineInputStyle, resize: 'none' }}
                    onFocus={e => e.target.style.borderBottomColor = 'var(--teal-accent)'}
                    onBlur={e => e.target.style.borderBottomColor = 'rgba(45,212,191,0.2)'}
                  />
                </div>

                <button
                  type="submit"
                  id="contact-submit"
                  disabled={isSubmitting}
                  className="btn-teal magnetic"
                  style={{
                    justifyContent: 'center',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    alignSelf: 'flex-start',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
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
          marginTop: '6rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(45,212,191,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--text-dim)',
            letterSpacing: '0.1em',
          }}>
            Bhushan Chaturbhuj © 2025 — Built with React &amp; GSAP
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic"
                style={{
                  color: 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'var(--teal-accent)';
                  e.currentTarget.style.transform = 'scale(1.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #contact { padding: 6rem 0 3rem !important; }
          .contact-two-col {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 600px) {
          .form-grid-2col {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .email-underline { display: block; }
        a:hover .email-underline { transform: scaleX(1) !important; }
        input::placeholder, textarea::placeholder {
          color: var(--text-dim);
          font-family: var(--font-body);
        }
      `}</style>
    </section>
  );
}
