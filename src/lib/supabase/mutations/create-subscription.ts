/**
 * Create Subscription Mutation
 *
 * Creates the subscription then inserts subscription items.
 */
import { createClient } from '../client'
import type { SubscriptionFrequency } from '../types/database.types'

interface CreateSubscriptionInput {
  userId: string
  frequency: SubscriptionFrequency
  daysOfWeek?: number[]
  preferredTime?: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    selectedOptions?: Record<string, unknown>
  }>
}

export async function createSubscription(input: CreateSubscriptionInput) {
  const supabase = createClient()

  // Step 1: Create subscription
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: input.userId,
      frequency: input.frequency,
      days_of_week: input.daysOfWeek ?? null,
      preferred_time: input.preferredTime ?? null,
      status: 'active',
    })
    .select()
    .single()

  if (subError) {
    console.error('Failed to create subscription:', subError.message)
    throw new Error(subError.message)
  }

  // Step 2: Insert subscription items
  const { error: itemsError } = await supabase
    .from('subscription_items')
    .insert(
      input.items.map((item) => ({
        subscription_id: subscription.id,
        product_id: item.productId,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        selected_options: item.selectedOptions ?? null,
      }))
    )

  if (itemsError) {
    console.error('Failed to insert subscription items:', itemsError.message)
    throw new Error(itemsError.message)
  }

  return subscription
}
