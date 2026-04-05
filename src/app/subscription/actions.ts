'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { buildDaysOfWeekForDb, computeNextRunAtIso } from '@/lib/subscription-next-run'
import type { SubscriptionFrequency } from '@/lib/supabase/types/database.types'

export type SubscriptionLineInput = {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export async function createSubscriptionAction(input: {
  frequency: SubscriptionFrequency
  specificDays: number[]
  weeklyDay: number
  preferredTime: string
  endDateYmd: string | null
  paymentMethod: string | null
  items: SubscriptionLineInput[]
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')

  if (!input.items.length) throw new Error('Select at least one product.')

  const daysForDb = buildDaysOfWeekForDb(input.frequency, input.specificDays, input.weeklyDay)

  if (input.frequency === 'specific_days' && (!daysForDb || daysForDb.length === 0)) {
    throw new Error('Pick at least one day for your schedule.')
  }
  if (input.frequency === 'weekly' && (!daysForDb || daysForDb.length === 0)) {
    throw new Error('Pick a delivery day for weekly subscriptions.')
  }

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .neq('status', 'cancelled')
    .maybeSingle()

  if (existing) {
    throw new Error('You already have an active subscription. Pause or cancel it before creating a new one.')
  }

  const nextRunAt = computeNextRunAtIso({
    frequency: input.frequency,
    daysOfWeek: daysForDb,
    preferredTime: input.preferredTime,
  })

  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: user.id,
      frequency: input.frequency,
      days_of_week: daysForDb,
      preferred_time: input.preferredTime,
      status: 'active',
      next_run_at: nextRunAt,
      end_date: input.endDateYmd,
      payment_method: input.paymentMethod,
      failed_count: 0,
    })
    .select()
    .single()

  if (subError || !subscription) {
    console.error('createSubscriptionAction subscription:', subError?.message)
    throw new Error(subError?.message ?? 'Could not create subscription.')
  }

  const { error: itemsError } = await supabase.from('subscription_items').insert(
    input.items.map((row) => ({
      subscription_id: subscription.id,
      product_id: row.productId,
      product_name: row.productName,
      quantity: row.quantity,
      unit_price: row.unitPrice,
      selected_options: {},
    }))
  )

  if (itemsError) {
    await supabase.from('subscriptions').delete().eq('id', subscription.id)
    console.error('createSubscriptionAction items:', itemsError.message)
    throw new Error(itemsError.message)
  }

  /**
   * `subscription_runs` rows are normally inserted when each billing cycle executes
   * (success / failed / skipped). No run row is created at signup.
   */

  revalidatePath('/subscription')
  revalidatePath('/profile')
  return { subscriptionId: subscription.id }
}

export async function updateSubscriptionAction(
  subscriptionId: string,
  input: {
    frequency: SubscriptionFrequency
    specificDays: number[]
    weeklyDay: number
    preferredTime: string
    endDateYmd: string | null
    paymentMethod: string | null
    items: SubscriptionLineInput[]
  }
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not signed in')

  if (!input.items.length) throw new Error('Select at least one product.')

  // Verify ownership
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('id, user_id')
    .eq('id', subscriptionId)
    .single()

  if (!existingSub || existingSub.user_id !== user.id) {
    throw new Error('Subscription not found or unauthorized')
  }

  const daysForDb = buildDaysOfWeekForDb(input.frequency, input.specificDays, input.weeklyDay)

  if (input.frequency === 'specific_days' && (!daysForDb || daysForDb.length === 0)) {
    throw new Error('Pick at least one day for your schedule.')
  }
  if (input.frequency === 'weekly' && (!daysForDb || daysForDb.length === 0)) {
    throw new Error('Pick a delivery day for weekly subscriptions.')
  }

  const nextRunAt = computeNextRunAtIso({
    frequency: input.frequency,
    daysOfWeek: daysForDb,
    preferredTime: input.preferredTime,
  })

  // 1. Update the subscription
  const { error: updateError } = await supabase
    .from('subscriptions')
    .update({
      frequency: input.frequency,
      days_of_week: daysForDb,
      preferred_time: input.preferredTime,
      next_run_at: nextRunAt,
      end_date: input.endDateYmd,
      payment_method: input.paymentMethod,
    })
    .eq('id', subscriptionId)

  if (updateError) {
    console.error('updateSubscriptionAction update:', updateError.message)
    throw new Error(updateError.message)
  }

  // 2. Delete old items
  const { error: delError } = await supabase
    .from('subscription_items')
    .delete()
    .eq('subscription_id', subscriptionId)

  if (delError) {
    throw new Error('Failed to update subscription items')
  }

  // 3. Insert new items
  const { error: itemsError } = await supabase.from('subscription_items').insert(
    input.items.map((row) => ({
      subscription_id: subscriptionId,
      product_id: row.productId,
      product_name: row.productName,
      quantity: row.quantity,
      unit_price: row.unitPrice,
      selected_options: {},
    }))
  )

  if (itemsError) {
    console.error('updateSubscriptionAction items:', itemsError.message)
    throw new Error(itemsError.message)
  }

  revalidatePath('/subscription')
  revalidatePath('/profile/subscriptions')
  return { subscriptionId }
}
