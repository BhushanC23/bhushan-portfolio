import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BHUSHAN_DATA } from '../data/bhushanData';

/**
 * usePortfolioData — fetches live data from Supabase.
 * Falls back to static bhushanData.js when Supabase is not configured.
 *
 * Returns: { projects, skills, heroText, about, loading, error, refetch }
 */
export function usePortfolioData() {
  const [data, setData] = useState({
    projects: null,
    skills: null,
    heroText: null,
    about: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchAll() {
    if (!isSupabaseConfigured) {
      // Use static fallback data immediately
      setData({
        projects: BHUSHAN_DATA.projects,
        skills: BHUSHAN_DATA.skills,
        heroText: null,   // HeroSection uses built-in overlays as fallback
        about: null,      // AboutSection uses built-in text as fallback
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [
        { data: projects, error: pErr },
        { data: skills, error: sErr },
        { data: heroText, error: hErr },
        { data: about, error: aErr },
      ] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('category'),
        supabase.from('hero_text').select('*').order('phase'),
        supabase.from('about').select('*').limit(1),
      ]);

      if (pErr || sErr || hErr || aErr) {
        throw pErr || sErr || hErr || aErr;
      }

      // Transform skills array → { category: items[] } map (matches bhushanData shape)
      const skillsMap = {};
      (skills || []).forEach(row => {
        skillsMap[row.category] = row.items || [];
      });

      setData({
        projects: projects?.length ? projects : BHUSHAN_DATA.projects,
        skills: Object.keys(skillsMap).length ? skillsMap : BHUSHAN_DATA.skills,
        heroText: heroText?.length ? heroText : null,
        about: about?.[0] || null,
      });
      setError(null);
    } catch (err) {
      console.warn('[usePortfolioData] Supabase fetch failed, using static data:', err.message);
      setData({
        projects: BHUSHAN_DATA.projects,
        skills: BHUSHAN_DATA.skills,
        heroText: null,
        about: null,
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return { ...data, loading, error, refetch: fetchAll };
}
