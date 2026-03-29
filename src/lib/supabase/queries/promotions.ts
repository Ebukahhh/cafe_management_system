/**
 * Promotion Queries — Promo code validation
 */
import { createClient } from '../client'
import type { Promotion } from '../types/database.types'

/** Validate a promo code — returns the promotion if valid, null if not */
export async function validatePromoCode(code: string): Promise<Promotion | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('Failed to validate promo code:', error.message)
    throw new Error(error.message)
  }

  if (!data) return null

  // Check expiry
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return null
  }

  // Check usage limit
  if (data.max_uses !== null && data.used_count >= data.max_uses) {
    return null
  }

  return data as Promotion
}
