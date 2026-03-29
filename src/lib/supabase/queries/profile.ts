/**
 * Profile Queries — User profile and loyalty reads
 */
import { createClient } from '../client'
import type { Profile } from '../types/database.types'

/** Fetch a user's profile */
export async function getProfile(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Failed to fetch profile:', error.message)
    throw new Error(error.message)
  }

  return data as Profile
}

/** Get a user's loyalty balance (RPC) */
export async function getLoyaltyBalance(userId: string): Promise<number> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc('get_loyalty_balance', {
    p_user_id: userId,
  })

  if (error) {
    console.error('Failed to fetch loyalty balance:', error.message)
    throw new Error(error.message)
  }

  return data as number
}
