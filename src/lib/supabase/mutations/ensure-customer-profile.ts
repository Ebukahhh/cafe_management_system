/**
 * Ensures a `profiles` row exists for the given auth user (email or OAuth signup).
 * Does not overwrite existing rows (so admin/barista roles stay intact).
 */
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export async function ensureCustomerProfile(user: User, overrides?: { fullName?: string; phone?: string | null }) {
  const supabase = createClient()

  const { data: existing, error: selErr } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (selErr) {
    console.error('[ensureCustomerProfile] select', selErr.message)
    throw new Error(selErr.message)
  }

  if (existing) return

  const meta = user.user_metadata as Record<string, unknown> | undefined
  const fullName =
    overrides?.fullName?.trim() ||
    (typeof meta?.full_name === 'string' ? meta.full_name.trim() : '') ||
    (typeof meta?.name === 'string' ? meta.name.trim() : '') ||
    user.email?.split('@')[0] ||
    'Guest'

  const phone =
    overrides?.phone !== undefined
      ? overrides.phone
      : typeof meta?.phone === 'string'
        ? meta.phone.trim() || null
        : null

  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    full_name: fullName,
    phone,
    role: 'customer',
  })

  if (error) {
    console.error('[ensureCustomerProfile] insert', error.message)
    throw new Error(error.message)
  }
}
