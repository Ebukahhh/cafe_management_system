/**
 * Order Queries — All order-related database reads
 */
import { createClient } from '../client'
import type { OrderWithItems } from '../types/app.types'

/** Fetch a user's order history with items and product info */
export async function getUserOrders(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, image_url))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Failed to fetch orders:', error.message)
    throw new Error(error.message)
  }

  return data as OrderWithItems[]
}

/** Fetch a single order by ID with full details */
export async function getOrderById(orderId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, image_url))')
    .eq('id', orderId)
    .single()

  if (error) {
    console.error('Failed to fetch order:', error.message)
    throw new Error(error.message)
  }

  return data as OrderWithItems
}
