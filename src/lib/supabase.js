import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wqlvginhhlbfzlzeupos.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbHZnaW5oaGxiZnpsemV1cG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTA4MDgsImV4cCI6MjA5NTcyNjgwOH0.mQVtM67-MSsAJIwOsqpzl9vctWuFYo8Qc1aCnZ9VkxQ';

// Guard against placeholder values — client is null when not configured
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('xxxxxxxxxxxx') &&
  !supabaseAnonKey.includes('placeholder');

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = isConfigured;
