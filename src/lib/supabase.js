import { createClient } from '@supabase/supabase-js'

// Public values only. The anon key is safe in the browser: Row Level Security
// allows INSERT on admission_applications and nothing else.
// Env vars (VITE_*) override these defaults when set in Vercel.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://uawybzrmyjllwoqnsrac.supabase.co'
const key =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd3lienJteWpsbHdvcW5zcmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwOTQ1MzgsImV4cCI6MjEwNjY3MDUzOH0.Fdu70pfq2-V2arN91_sdZTMBnh4McBQ2dzv-XS2veHU'

export const supabase = createClient(url, key, { auth: { persistSession: false } })
