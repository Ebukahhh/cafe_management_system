/**
 * Pick the Supabase client for privileged admin DB access.
 * Prefers the service role key so RLS does not hide other users' rows.
 */
import { createServiceRoleClient } from './service-role'
import { createClient } from './server'

export async function getSupabaseForAdmin() {
  const privileged = createServiceRoleClient()
  if (privileged) return privileged
  return await createClient()
}
