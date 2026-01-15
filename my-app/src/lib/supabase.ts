import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY

// Server-side Supabase client (uses service role key, bypasses RLS)
// ONLY use this in API routes and server components
let serverSupabase: SupabaseClient | null = null

export function getSupabaseServerClient(): SupabaseClient | null {
  if (!serverSupabase && supabaseUrl && supabaseServiceKey) {
    serverSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return serverSupabase
}

// For backwards compatibility with existing API routes
export const supabase = getSupabaseServerClient()