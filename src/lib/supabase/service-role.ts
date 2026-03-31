/**
 * Service-role Supabase client — bypasses Row Level Security.
 *
 * Use ONLY in Server Components, Server Actions, and Route Handlers.
 * Never import this module from client components or expose the key.
 *
 * Add to .env.local:
 *   SUPABASE_SERVICE_ROLE_KEY=<from Supabase Dashboard → Settings → API → service_role>
 */
import { createClient } from '@supabase/supabase-js'

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
