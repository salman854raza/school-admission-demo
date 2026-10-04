import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only the public anon key is ever used in the browser. Row Level Security
// allows INSERT only; the public can never read stored applications.
export const supabase =
  url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
