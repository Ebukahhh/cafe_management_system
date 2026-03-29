/**
 * Subscription Queries — All subscription-related database reads
 */
import { createClient } from '../client'
import type { SubscriptionWithDetails } from '../types/app.types'

/** Fetch a user's active subscription with items and recent runs */
export async function getUserSubscription(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, subscription_items(*), subscription_runs(*)')
    .eq('user_id', userId)
    .in('status', ['active', 'paused'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch subscription:', error.message)
    throw new Error(error.message)
  }

  return data as SubscriptionWithDetails | null
}
