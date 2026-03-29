/**
 * Browser Supabase Client — for Client Components ('use client')
 *
 * Use this in any component with 'use client', custom hooks, or event handlers.
 * Never call this from Server Components or API routes.
 *
 * NOTE: Once the backend provides the Supabase project ID, generate proper
 * Database types with `npx supabase gen types` and add the generic here:
 *   createBrowserClient<Database>(...)
 */
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
