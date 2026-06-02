import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BHUSHAN_DATA } from '../data/bhushanData';

/**
 * usePortfolioData — fetches live data from Supabase.
 * Renders initial state with static BHUSHAN_DATA to prevent blank/loading screen flashes,
 * then updates dynamically if Supabase returns successfully.
 * Falls back gracefully to static data on error or if not configured.
 *
 * Returns: { projects, skills, heroText, about, loading, error, refetch }
 */
export function usePortfolioData() {
  const [data, setData] = useState({
    projects: BHUSHAN_DATA.projects,
    skills: BHUSHAN_DATA.skills,
    heroText: BHUSHAN_DATA.heroText,
    about: BHUSHAN_DATA.about,
  });
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      // Fetch all 4 tables in parallel to avoid waterfall latency
      const [aboutRes, heroRes, projectsRes, skillsRes] = await Promise.allSettled([
        supabase.from('about').select('*').limit(1),
        supabase.from('hero_text').select('*').order('phase'),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*')
      ]);

      const updated = { ...data };
      let hasUpdates = false;

      // 1. Process "about"
      if (aboutRes.status === 'fulfilled' && !aboutRes.value.error && aboutRes.value.data?.[0]) {
        const row = aboutRes.value.data[0];
        updated.about = {
          bio: row.bio || BHUSHAN_DATA.about.bio,
          photo_url: row.photo_url || BHUSHAN_DATA.about.photo_url
        };
        hasUpdates = true;
      }

      // 2. Process "hero_text"
      if (heroRes.status === 'fulfilled' && !heroRes.value.error && heroRes.value.data?.length) {
        // Map the rows back into 1-indexed phase arrays, falling back to static copy for missing phases
        updated.heroText = BHUSHAN_DATA.heroText.map(baseOverlay => {
          const row = heroRes.value.data.find(r => r.phase === baseOverlay.phase);
          if (!row) return baseOverlay;
          return {
            phase: baseOverlay.phase,
            title: row.title !== undefined ? row.title : baseOverlay.title,
            title2: row.title2 !== undefined ? (row.title2 || null) : baseOverlay.title2,
            subtitle: row.subtitle !== undefined ? row.subtitle : baseOverlay.subtitle,
            tag: row.tag !== undefined ? (row.tag || null) : baseOverlay.tag,
          };
        });
        hasUpdates = true;
      }

      // 3. Process "projects"
      if (projectsRes.status === 'fulfilled' && !projectsRes.value.error && projectsRes.value.data?.length) {
        // Map table fields to be completely compatible with any component expecting "name" / "title", "desc" / "description", or "stack" / "tech"
        updated.projects = projectsRes.value.data.map(row => ({
          id: row.id,
          name: row.title || row.name,
          title: row.title || row.name,
          description: row.desc || row.description,
          desc: row.desc || row.description,
          stack: row.tech || row.stack || [],
          tech: row.tech || row.stack || [],
          tag: row.tag || 'Full Stack',
          featured: !!row.featured,
          github: row.github || 'https://github.com/BhushanC23',
          demo: row.demo || ''
        }));
        hasUpdates = true;
      }

      // 4. Process "skills"
      if (skillsRes.status === 'fulfilled' && !skillsRes.value.error && skillsRes.value.data?.length) {
        const skillsObj = {};
        skillsRes.value.data.forEach(row => {
          skillsObj[row.category] = row.items || [];
        });

        // Ensure we merge and keep any missing categories from baseline data
        updated.skills = {
          ...BHUSHAN_DATA.skills,
          ...skillsObj
        };
        hasUpdates = true;
      }

      if (hasUpdates) {
        setData(updated);
      }
      setError(null);
    } catch (err) {
      console.warn('⚠️ Supabase fetch failed. Falling back to high-quality static data:', err);
      setError(err.message || 'Fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...data,
    loading,
    error,
    refetch: fetchData
  };
}
