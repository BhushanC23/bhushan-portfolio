import { supabase, isSupabaseConfigured } from './supabase';
import { BHUSHAN_DATA } from '../data/bhushanData';

const LOCAL_STORAGE_KEY = 'nexus_portfolio_data';
const UPDATE_EVENT_NAME = 'nexus_portfolio_updated';

/**
 * Normalizes baseline BHUSHAN_DATA to ensure uniform schema
 * across projects, experience, achievements, skills, hero, and about.
 */
function getInitialNormalizedData() {
  const projects = (BHUSHAN_DATA.projects || []).map((p, idx) => ({
    id: p.id || `proj_${idx + 1}`,
    title: p.name || p.title || 'Untitled Project',
    name: p.name || p.title || 'Untitled Project',
    category: p.tag || p.category || 'Full Stack',
    tag: p.tag || p.category || 'Full Stack',
    description: p.description || p.desc || '',
    desc: p.description || p.desc || '',
    techStack: p.stack || p.tech || p.techStack || [],
    tech: p.stack || p.tech || p.techStack || [],
    stack: p.stack || p.tech || p.techStack || [],
    liveUrl: p.demo || p.liveUrl || '',
    demo: p.demo || p.liveUrl || '',
    githubUrl: p.github || p.githubUrl || 'https://github.com/BhushanC23',
    github: p.github || p.githubUrl || 'https://github.com/BhushanC23',
    featured: !!p.featured,
    architectureNotes: p.architectureNotes || 'Engineered with clean separation of concerns, optimized render lifecycles, and low-latency API communication.',
    metrics: p.metrics || '60 FPS UI · High Availability',
    order: idx + 1,
  }));

  const experience = (BHUSHAN_DATA.experience || []).map((e, idx) => ({
    id: e.id || `exp_${idx + 1}`,
    role: e.title || e.role || 'Software Engineer',
    title: e.title || e.role || 'Software Engineer',
    company: e.company || 'Tech Company',
    duration: e.period || e.duration || '2025–Present',
    period: e.period || e.duration || '2025–Present',
    current: !!(e.isCurrent || e.current),
    isCurrent: !!(e.isCurrent || e.current),
    description: e.description || '',
    points: e.points || (e.description ? [e.description] : []),
    type: e.type || 'On-site',
    order: idx + 1,
  }));

  const achievements = (BHUSHAN_DATA.achievements || []).map((a, idx) => ({
    id: a.id || `ach_${idx + 1}`,
    title: a.title || 'Honorable Recognition',
    org: a.desc || a.org || 'Industry Organization',
    desc: a.desc || a.org || 'Industry Organization',
    year: a.year || '2025',
    badge: a.icon || a.badge || '🏆',
    icon: a.icon || a.badge || '🏆',
    description: a.description || a.desc || '',
    featured: idx === 0,
    link: a.link || '',
    order: idx + 1,
  }));

  const skills = {
    frontend: [...(BHUSHAN_DATA.skills?.frontend || [])],
    backend: [...(BHUSHAN_DATA.skills?.backend || [])],
    database: [...(BHUSHAN_DATA.skills?.database || [])],
    aiml: [...(BHUSHAN_DATA.skills?.aiml || [])],
    tools: [...(BHUSHAN_DATA.skills?.tools || [])],
    specialties: [...(BHUSHAN_DATA.skills?.specialties || [])],
  };

  const hero_text = (BHUSHAN_DATA.heroText || []).map((h, idx) => ({
    phase: h.phase || idx + 1,
    title: h.title || '',
    title2: h.title2 || '',
    subtitle: h.subtitle || '',
    tag: h.tag || '',
  }));

  const about = {
    bio: BHUSHAN_DATA.about?.bio || '',
    photo_url: BHUSHAN_DATA.about?.photo_url || '/bhushan-photo.jpg',
    resume_url: '/Bhushan_Chaturbhuj_Resume.pdf',
    stats: BHUSHAN_DATA.stats || [
      { value: 3, suffix: '+', label: 'Years Building' },
      { value: 10, suffix: '+', label: 'Projects Shipped' },
      { value: 12, suffix: '+', label: 'Technologies Used' },
      { value: 6, suffix: '+', label: 'Interactive Web Apps' },
    ],
  };

  return {
    projects,
    experience,
    achievements,
    skills,
    hero_text,
    about,
    lastSyncedAt: new Date().toISOString(),
  };
}

/**
 * Reads local cached portfolio data from localStorage or seeds from defaults.
 */
export function getLocalData() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure all 6 collections exist
      const baseline = getInitialNormalizedData();
      return {
        projects: parsed.projects || baseline.projects,
        experience: parsed.experience || baseline.experience,
        achievements: parsed.achievements || baseline.achievements,
        skills: parsed.skills || baseline.skills,
        hero_text: parsed.hero_text || baseline.hero_text,
        about: parsed.about || baseline.about,
        lastSyncedAt: parsed.lastSyncedAt || null,
      };
    }
  } catch (e) {
    console.warn('[NexusOS] Error parsing localStorage data, using baseline:', e);
  }

  const initial = getInitialNormalizedData();
  saveLocalData(initial);
  return initial;
}

/**
 * Writes data into localStorage and triggers window event for instant UI update.
 */
export function saveLocalData(data) {
  try {
    const payload = {
      ...data,
      lastSyncedAt: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: payload }));
    return true;
  } catch (e) {
    console.error('[NexusOS] Failed to save localStorage:', e);
    return false;
  }
}

/**
 * Creates or updates an item in a specific collection.
 */
export async function saveItem(collection, item) {
  const data = getLocalData();
  let updatedCollection;

  if (collection === 'projects' || collection === 'experience' || collection === 'achievements') {
    const list = [...(data[collection] || [])];
    const itemId = item.id || `${collection.slice(0, 3)}_${Date.now()}`;
    const normalizedItem = {
      ...item,
      id: itemId,
      // Field aliases for 100% backward compatibility
      title: item.title || item.name || item.role,
      name: item.title || item.name,
      role: item.role || item.title,
      category: item.category || item.tag,
      tag: item.category || item.tag,
      description: item.description || item.desc,
      desc: item.description || item.desc,
      techStack: Array.isArray(item.techStack) ? item.techStack : (Array.isArray(item.tech) ? item.tech : (item.techStack ? item.techStack.split(',').map(s => s.trim()).filter(Boolean) : [])),
      tech: Array.isArray(item.techStack) ? item.techStack : (Array.isArray(item.tech) ? item.tech : (item.techStack ? item.techStack.split(',').map(s => s.trim()).filter(Boolean) : [])),
      stack: Array.isArray(item.techStack) ? item.techStack : (Array.isArray(item.tech) ? item.tech : []),
      liveUrl: item.liveUrl || item.demo,
      demo: item.liveUrl || item.demo,
      githubUrl: item.githubUrl || item.github,
      github: item.githubUrl || item.github,
      current: !!(item.current || item.isCurrent),
      isCurrent: !!(item.current || item.isCurrent),
      badge: item.badge || item.icon || '🏆',
      icon: item.badge || item.icon || '🏆',
      org: item.org || item.desc,
    };

    const existingIndex = list.findIndex(i => String(i.id) === String(itemId));
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...normalizedItem };
    } else {
      normalizedItem.order = list.length + 1;
      list.unshift(normalizedItem); // New items placed at top
    }
    updatedCollection = list;
    data[collection] = list;
  } else if (collection === 'skills') {
    data.skills = { ...data.skills, ...item };
    updatedCollection = data.skills;
  } else if (collection === 'hero_text') {
    data.hero_text = item;
    updatedCollection = data.hero_text;
  } else if (collection === 'about') {
    data.about = { ...data.about, ...item };
    updatedCollection = data.about;
  }

  saveLocalData(data);

  // Sync to Supabase in background if available
  if (isSupabaseConfigured) {
    try {
      if (collection === 'projects') {
        const payload = {
          title: item.title || item.name,
          desc: item.description || item.desc,
          tech: Array.isArray(item.techStack) ? item.techStack : (Array.isArray(item.tech) ? item.tech : []),
          github: item.githubUrl || item.github || '',
          demo: item.liveUrl || item.demo || '',
          tag: item.category || item.tag || 'Full Stack',
          featured: !!item.featured,
        };
        if (item.id && !String(item.id).startsWith('proj_')) {
          await supabase.from('projects').update(payload).eq('id', item.id);
        } else {
          await supabase.from('projects').insert([payload]);
        }
      } else if (collection === 'skills') {
        // Upsert categories
        for (const [category, items] of Object.entries(item)) {
          await supabase.from('skills').upsert({ category, items }, { onConflict: 'category' });
        }
      } else if (collection === 'about') {
        await supabase.from('about').upsert([{ id: 1, bio: data.about.bio, photo_url: data.about.photo_url }]);
      }
    } catch (err) {
      console.warn('[NexusOS] Background Supabase sync failed, local copy preserved:', err);
    }
  }

  return { success: true, data: updatedCollection };
}

/**
 * Deletes an item by ID from a collection.
 */
export async function deleteItem(collection, id) {
  const data = getLocalData();

  if (collection === 'projects' || collection === 'experience' || collection === 'achievements') {
    data[collection] = (data[collection] || []).filter(item => String(item.id) !== String(id));
    saveLocalData(data);

    if (isSupabaseConfigured && !String(id).startsWith(collection.slice(0, 3))) {
      try {
        await supabase.from(collection).delete().eq('id', id);
      } catch (err) {
        console.warn(`[NexusOS] Supabase delete error for ${collection}:`, err);
      }
    }
    return { success: true };
  }

  return { success: false, error: 'Invalid collection' };
}

/**
 * Reorders items in a collection.
 */
export async function reorderItems(collection, newItems) {
  const data = getLocalData();
  data[collection] = newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
  saveLocalData(data);
  return { success: true };
}

/**
 * One-click Full Synchronization: pushes all 6 collections to Supabase.
 */
export async function syncAllToSupabase() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase credentials are not configured in .env (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).');
  }

  const data = getLocalData();
  const summary = { projects: 0, skills: 0, hero: 0, about: false, experience: 0, achievements: 0 };

  // 1. Sync Projects
  try {
    const projectsPayload = data.projects.map((p, idx) => ({
      title: p.title || p.name,
      desc: p.description || p.desc,
      tech: p.techStack || p.tech || p.stack || [],
      github: p.githubUrl || p.github || '',
      demo: p.liveUrl || p.demo || '',
      tag: p.category || p.tag || 'Full Stack',
      featured: !!p.featured,
    }));
    await supabase.from('projects').delete().not('id', 'is', null);
    const { error: pErr } = await supabase.from('projects').insert(projectsPayload);
    if (!pErr) summary.projects = projectsPayload.length;
  } catch (err) {
    console.warn('[NexusOS] Projects table sync notice:', err);
  }

  // 2. Sync Skills
  try {
    const skillsPayload = Object.keys(data.skills).map(category => ({
      category,
      items: data.skills[category] || [],
    }));
    await supabase.from('skills').delete().not('id', 'is', null);
    const { error: sErr } = await supabase.from('skills').insert(skillsPayload);
    if (!sErr) summary.skills = skillsPayload.length;
  } catch (err) {
    console.warn('[NexusOS] Skills table sync notice:', err);
  }

  // 3. Sync Hero Text
  try {
    const heroPayload = data.hero_text.map(h => ({
      phase: h.phase,
      title: h.title,
      title2: h.title2 || '',
      subtitle: h.subtitle || '',
      tag: h.tag || '',
    }));
    await supabase.from('hero_text').delete().not('id', 'is', null);
    const { error: hErr } = await supabase.from('hero_text').insert(heroPayload);
    if (!hErr) summary.hero = heroPayload.length;
  } catch (err) {
    console.warn('[NexusOS] Hero table sync notice:', err);
  }

  // 4. Sync About
  try {
    await supabase.from('about').upsert([{
      id: 1,
      bio: data.about.bio,
      photo_url: data.about.photo_url,
    }]);
    summary.about = true;
  } catch (err) {
    console.warn('[NexusOS] About table sync notice:', err);
  }

  // 5. Sync Experience & Achievements if tables exist
  try {
    const expPayload = data.experience.map(e => ({
      role: e.role,
      company: e.company,
      duration: e.duration,
      current: !!e.current,
      description: e.description,
      type: e.type,
    }));
    await supabase.from('experience').delete().not('id', 'is', null);
    await supabase.from('experience').insert(expPayload);
    summary.experience = expPayload.length;
  } catch {
    // Table may not exist yet, safely skip
  }

  try {
    const achPayload = data.achievements.map(a => ({
      title: a.title,
      org: a.org,
      year: a.year,
      badge: a.badge,
      description: a.description,
      featured: !!a.featured,
    }));
    await supabase.from('achievements').delete().not('id', 'is', null);
    await supabase.from('achievements').insert(achPayload);
    summary.achievements = achPayload.length;
  } catch {
    // Table may not exist yet, safely skip
  }

  saveLocalData({ ...data, lastSyncedAt: new Date().toISOString() });
  return { success: true, summary };
}

/**
 * Exports entire database as clean JSON.
 */
export function exportBackupJSON() {
  const data = getLocalData();
  return JSON.stringify(data, null, 2);
}

/**
 * Imports JSON backup and persists instantly.
 */
export function importBackupJSON(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON format');
    saveLocalData(parsed);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Resets portfolio to system defaults.
 */
export function resetToDefaults() {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  const baseline = getInitialNormalizedData();
  saveLocalData(baseline);
  return baseline;
}
