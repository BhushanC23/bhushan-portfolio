import { useState, useMemo } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  ExternalLink,
  GitBranch,
  X,
  Check,
  Filter,
  Sparkles,
  Code2,
  FileCode2,
  Layers,
  Cpu
} from 'lucide-react';

const CATEGORIES = ['All', 'Full Stack', 'AI/ML', 'WebXR', 'Utility Tool'];

const DEFAULT_PROJECT = {
  title: '',
  category: 'Full Stack',
  description: '',
  architectureNotes: '',
  metrics: '',
  techStack: '',
  liveUrl: '',
  githubUrl: '',
  imageUrl: '',
  featured: false,
};

export default function ProjectsPanel() {
  const { projects, saveItem, deleteItem } = usePortfolioData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filtered and searched projects
  const filteredProjects = useMemo(() => {
    return (projects || []).filter(p => {
      const title = (p.title || p.name || '').toLowerCase();
      const desc = (p.description || p.desc || '').toLowerCase();
      const cat = (p.category || p.tag || '');
      const tech = (Array.isArray(p.techStack) ? p.techStack.join(' ') : (p.tech || '')).toLowerCase();
      const q = searchTerm.toLowerCase();

      const matchesSearch = title.includes(q) || desc.includes(q) || tech.includes(q);
      const matchesCategory =
        activeCategory === 'All' ||
        (activeCategory === 'WebXR'
          ? (cat.toLowerCase().includes('xr') || cat.toLowerCase().includes('ar'))
          : cat.toLowerCase().includes(activeCategory.toLowerCase()));

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchTerm, activeCategory]);

  const handleOpenAdd = () => {
    setEditingProject({ ...DEFAULT_PROJECT });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject({
      ...project,
      title: project.title || project.name,
      category: project.category || project.tag || 'Full Stack',
      description: project.description || project.desc || '',
      architectureNotes: project.architectureNotes || '',
      metrics: project.metrics || '',
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : (Array.isArray(project.tech) ? project.tech.join(', ') : project.techStack || ''),
      liveUrl: project.liveUrl || project.demo || '',
      githubUrl: project.githubUrl || project.github || '',
      imageUrl: project.imageUrl || project.image || project.img || '',
      featured: !!project.featured,
    });
    setIsModalOpen(true);
  };

  const handleToggleFeatured = async (project, e) => {
    e.stopPropagation();
    const updated = { ...project, featured: !project.featured };
    await saveItem('projects', updated);
    showToast(`${project.title || project.name} is ${!project.featured ? 'now Featured' : 'unstarred'}`);
  };

  const handleDelete = async (project, e) => {
    e.stopPropagation();
    const name = project.title || project.name;
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      await deleteItem('projects', project.id);
      showToast(`Deleted "${name}"`);
    }
  };

  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!editingProject.title.trim()) {
      alert('Please enter a project title');
      return;
    }

    const payload = {
      ...editingProject,
      title: editingProject.title.trim(),
      name: editingProject.title.trim(),
      category: editingProject.category,
      tag: editingProject.category,
      description: editingProject.description.trim(),
      desc: editingProject.description.trim(),
      architectureNotes: editingProject.architectureNotes.trim(),
      metrics: editingProject.metrics.trim(),
      techStack: typeof editingProject.techStack === 'string'
        ? editingProject.techStack.split(',').map(s => s.trim()).filter(Boolean)
        : editingProject.techStack,
      tech: typeof editingProject.techStack === 'string'
        ? editingProject.techStack.split(',').map(s => s.trim()).filter(Boolean)
        : editingProject.techStack,
      liveUrl: editingProject.liveUrl.trim(),
      demo: editingProject.liveUrl.trim(),
      githubUrl: editingProject.githubUrl.trim(),
      github: editingProject.githubUrl.trim(),
      imageUrl: (editingProject.imageUrl || '').trim(),
      image: (editingProject.imageUrl || '').trim(),
      featured: !!editingProject.featured,
    };

    await saveItem('projects', payload);
    setIsModalOpen(false);
    showToast(editingProject.id ? `Updated "${payload.title}"` : `Added "${payload.title}"`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
          padding: '0.9rem 1.4rem',
          background: '#0e2415', border: '1px solid #22c55e', borderRadius: '12px',
          color: '#86efac', fontSize: '0.85rem', fontWeight: 600,
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <Check size={16} />
          {toast.msg}
        </div>
      )}

      {/* Action Header & Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        background: '#0d0d12',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '0.6rem 1rem',
          width: '100%',
          maxWidth: '340px',
        }}>
          <Search size={16} color="rgba(255, 255, 255, 0.4)" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search projects by title, stack, notes..."
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              outline: 'none',
              fontSize: '0.85rem',
              width: '100%',
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* New Project Button */}
        <button
          onClick={handleOpenAdd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.4rem',
            borderRadius: '12px',
            border: 'none',
            background: '#d4ff3d',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(212, 255, 61, 0.25)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus size={16} strokeWidth={3} />
          + New Project
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '100px',
                border: `1px solid ${isActive ? '#d4ff3d' : 'rgba(255, 255, 255, 0.1)'}`,
                background: isActive ? 'rgba(212, 255, 61, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                color: isActive ? '#d4ff3d' : 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: '#0d0d12',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          color: 'rgba(255, 255, 255, 0.4)',
        }}>
          <Layers size={36} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h4 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>No Projects Found</h4>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Try clearing filters or add a new project above.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
        }}>
          {filteredProjects.map((project, idx) => {
            const title = project.title || project.name;
            const category = project.category || project.tag || 'Full Stack';
            const desc = project.description || project.desc || '';
            const stack = Array.isArray(project.techStack) ? project.techStack : (Array.isArray(project.tech) ? project.tech : []);

            return (
              <div
                key={project.id || idx}
                style={{
                  background: '#0d0d12',
                  border: `1px solid ${project.featured ? 'rgba(212, 255, 61, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: project.featured ? '0 10px 30px rgba(212, 255, 61, 0.06)' : 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = project.featured ? '#d4ff3d' : 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = project.featured ? 'rgba(212, 255, 61, 0.3)' : 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  {/* Top Bar: Category Pill & Featured Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <span style={{
                      padding: '0.2rem 0.65rem',
                      borderRadius: '100px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '9px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#d4ff3d',
                    }}>
                      {category}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleFeatured(project, e)}
                      title={project.featured ? "Featured Project" : "Click to Feature"}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        color: project.featured ? '#eab308' : 'rgba(255, 255, 255, 0.25)',
                        transition: 'transform 0.15s, color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Star size={16} fill={project.featured ? '#eab308' : 'none'} />
                    </button>
                  </div>

                  {/* Title & Desc */}
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#fff',
                    margin: '0 0 0.5rem 0',
                    lineHeight: 1.3,
                  }}>
                    {title}
                  </h3>
                  <p style={{
                    fontSize: '0.82rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: 1.55,
                    margin: '0 0 1rem 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {desc}
                  </p>

                  {/* Architecture Note if available */}
                  {project.architectureNotes && (
                    <div style={{
                      background: 'rgba(212, 255, 61, 0.04)',
                      borderLeft: '2px solid #d4ff3d',
                      padding: '0.45rem 0.75rem',
                      marginBottom: '1rem',
                      fontSize: '0.74rem',
                      color: 'rgba(255, 255, 255, 0.75)',
                      fontFamily: 'monospace',
                    }}>
                      ⚡ Arch: {project.architectureNotes}
                    </div>
                  )}

                  {/* Tech Stack Chips */}
                  {stack.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      {stack.map((t, i) => (
                        <span key={i} style={{
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          fontSize: '0.72rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontFamily: 'monospace',
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls: Links & Edit / Delete */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}>
                  {/* External links */}
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'rgba(255, 255, 255, 0.5)', display: 'flex' }}
                        title="GitHub Repository"
                      >
                        <GitBranch size={15} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#d4ff3d', display: 'flex' }}
                        title="Live Demo"
                      >
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>

                  {/* Edit & Delete Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleOpenEdit(project)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <Pencil size={12} />
                      Edit
                    </button>

                    <button
                      onClick={(e) => handleDelete(project, e)}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: '8px',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-Over Drawer / Modal Form for Add & Edit */}
      {isModalOpen && editingProject && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#0d0d12',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            padding: '2.25rem',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {editingProject.id ? 'Edit Project Specifications' : 'New Production Project'}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
                  Modifications instantly reflect across the live portfolio.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.4)', cursor: 'pointer', padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Row 1: Title & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. Heritage AR — Cultural Platform"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      background: '#060608',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    Category
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      background: '#060608',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#d4ff3d',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                  Short Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Explain what the project does, key features, and problem it solves..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: '#060608',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Architecture & Engineering Challenge Note */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                  Key Engineering Challenge / Architecture Note (X-Ray View)
                </label>
                <input
                  type="text"
                  value={editingProject.architectureNotes}
                  onChange={e => setEditingProject({ ...editingProject, architectureNotes: e.target.value })}
                  placeholder="e.g. Optimized A-Frame rendering pipeline in MindAR to achieve steady 60fps in mobile WebXR"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: '#060608',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#d4ff3d',
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={editingProject.techStack}
                  onChange={e => setEditingProject({ ...editingProject, techStack: e.target.value })}
                  placeholder="React, TypeScript, MindAR, Three.js, Node.js"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: '#060608',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              {/* URLs: Live Demo & GitHub */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    Live URL / Demo Link
                  </label>
                  <input
                    type="url"
                    value={editingProject.liveUrl}
                    onChange={e => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    placeholder="https://evsync.vercel.app"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      background: '#060608',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={editingProject.githubUrl}
                    onChange={e => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                    placeholder="https://github.com/BhushanC23/evsync"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      background: '#060608',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Image / Preview Cover URL */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                  Project Preview / Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={editingProject.imageUrl}
                  onChange={e => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/... or /projects/preview.png"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: '#060608',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Featured Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <input
                  type="checkbox"
                  id="featuredSwitch"
                  checked={editingProject.featured}
                  onChange={e => setEditingProject({ ...editingProject, featured: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#d4ff3d', cursor: 'pointer' }}
                />
                <label htmlFor="featuredSwitch" style={{ fontSize: '0.85rem', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                  Mark as Featured Project (Renders with gold laurel ribbon on live site)
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.75rem 1.4rem',
                    borderRadius: '12px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.6rem',
                    borderRadius: '12px',
                    background: '#d4ff3d',
                    border: 'none',
                    color: '#000',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(212, 255, 61, 0.25)',
                  }}
                >
                  Save to Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
