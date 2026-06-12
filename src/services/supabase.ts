import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase URL or ANON KEY is not set. Edit .env to configure.')
}

// Safe debug: log URL and anon key length to help diagnose Invalid API key errors
// (never log the full key)
// eslint-disable-next-line no-console
console.debug('Supabase config:', {
  url: SUPABASE_URL ? SUPABASE_URL.replace(/(^https?:\/\/)|(:\/.+$)/g, '') : '<missing>',
  anonKeyLength: SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.length : 0
})

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
