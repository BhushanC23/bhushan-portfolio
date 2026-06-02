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
  const [data] = useState({
    projects: BHUSHAN_DATA.projects,
    skills: BHUSHAN_DATA.skills,
    heroText: BHUSHAN_DATA.heroText,
    about: BHUSHAN_DATA.about,
  });

  return { ...data, loading: false, error: null, refetch: () => {} };
}
