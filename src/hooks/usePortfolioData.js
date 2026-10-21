import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  getLocalData,
  saveLocalData,
  saveItem as cmsSaveItem,
  deleteItem as cmsDeleteItem,
  reorderItems as cmsReorderItems,
  syncAllToSupabase as cmsSyncAll,
} from '../lib/cmsService';

/**
 * usePortfolioData — NexusOS Hybrid Reactive Data Hook
 *
 * Instantly hydrates from local cache / baseline data (zero screen flash),
 * merges live cloud updates from Supabase, and reactively syncs with any
 * admin edits made inside NexusOS without requiring full page reloads.
 */
export function usePortfolioData() {
  const [data, setData] = useState(() => getLocalData());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Re-sync local state whenever NexusOS performs an add/edit/delete/reorder
  useEffect(() => {
    const handleDataUpdate = (e) => {
      if (e.detail) {
        setData(e.detail);
      } else {
        setData(getLocalData());
      }
    };

    window.addEventListener('nexus_portfolio_updated', handleDataUpdate);
    return () => window.removeEventListener('nexus_portfolio_updated', handleDataUpdate);
  }, []);

  // Fetch live tables from Supabase when connected
  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [aboutRes, heroRes, projectsRes, skillsRes, expRes, achRes] = await Promise.allSettled([
        supabase.from('about').select('*').limit(1),
        supabase.from('hero_text').select('*').order('phase'),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*'),
        supabase.from('experience').select('*'),
        supabase.from('achievements').select('*'),
      ]);

      const current = getLocalData();
      let hasUpdates = false;

      // 1. Merge About
      if (aboutRes.status === 'fulfilled' && !aboutRes.value.error && aboutRes.value.data?.[0]) {
        const row = aboutRes.value.data[0];
        current.about = {
          ...current.about,
          bio: row.bio || current.about.bio,
          photo_url: row.photo_url || current.about.photo_url,
        };
        hasUpdates = true;
      }

      // 2. Merge Hero Text
      if (heroRes.status === 'fulfilled' && !heroRes.value.error && heroRes.value.data?.length) {
        current.hero_text = heroRes.value.data.map(row => ({
          phase: row.phase,
          title: row.title,
          title2: row.title2 || '',
          subtitle: row.subtitle || '',
          tag: row.tag || '',
        }));
        hasUpdates = true;
      }

      // 3. Merge Projects
      if (projectsRes.status === 'fulfilled' && !projectsRes.value.error && projectsRes.value.data?.length) {
        current.projects = projectsRes.value.data.map((row, idx) => ({
          id: row.id,
          title: row.title,
          name: row.title,
          description: row.desc,
          desc: row.desc,
          techStack: row.tech || [],
          tech: row.tech || [],
          stack: row.tech || [],
          category: row.tag || 'Full Stack',
          tag: row.tag || 'Full Stack',
          featured: !!row.featured,
          githubUrl: row.github || '',
          github: row.github || '',
          liveUrl: row.demo || '',
          demo: row.demo || '',
          architectureNotes: row.architectureNotes || 'Production-grade architecture with responsive rendering.',
          metrics: row.metrics || 'Optimized performance',
          order: idx + 1,
        }));
        hasUpdates = true;
      }

      // 4. Merge Skills
      if (skillsRes.status === 'fulfilled' && !skillsRes.value.error && skillsRes.value.data?.length) {
        const skillsObj = {};
        skillsRes.value.data.forEach(row => {
          skillsObj[row.category] = row.items || [];
        });
        current.skills = {
          ...current.skills,
          ...skillsObj,
        };
        hasUpdates = true;
      }

      // 5. Merge Experience (if table exists)
      if (expRes.status === 'fulfilled' && !expRes.value.error && expRes.value.data?.length) {
        current.experience = expRes.value.data.map((row, idx) => ({
          id: row.id,
          role: row.role,
          title: row.role,
          company: row.company,
          duration: row.duration,
          period: row.duration,
          current: !!row.current,
          isCurrent: !!row.current,
          description: row.description,
          type: row.type || 'On-site',
          order: idx + 1,
        }));
        hasUpdates = true;
      }

      // 6. Merge Achievements (if table exists)
      if (achRes.status === 'fulfilled' && !achRes.value.error && achRes.value.data?.length) {
        current.achievements = achRes.value.data.map((row, idx) => ({
          id: row.id,
          title: row.title,
          org: row.org,
          desc: row.org,
          year: row.year,
          badge: row.badge || '🏆',
          icon: row.badge || '🏆',
          description: row.description,
          featured: !!row.featured,
          link: row.link || '',
          order: idx + 1,
        }));
        hasUpdates = true;
      }

      if (hasUpdates) {
        saveLocalData(current);
        setData(current);
      }
      setError(null);
    } catch (err) {
      console.warn('[NexusOS] Live cloud fetch notice (local cache active):', err);
      setError(err.message || 'Fetch notice');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...data,
    heroText: data.hero_text, // CamelCase alias for HeroSection compatibility
    loading,
    error,
    refetch: fetchData,
    saveItem: cmsSaveItem,
    deleteItem: cmsDeleteItem,
    reorderItems: cmsReorderItems,
    syncAllToSupabase: cmsSyncAll,
  };
}

export { cmsSaveItem as saveItem, cmsDeleteItem as deleteItem, cmsReorderItems as reorderItems, cmsSyncAll as syncAllToSupabase };
