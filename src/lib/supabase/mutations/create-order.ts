/**
 * Create Order Mutation — Multi-step order creation
 *
 * Creates the order row first, then inserts all order items.
 * This should be called from a Server Action or API route.
 */
import { createClient } from '../client'
import type { OrderType, OrderItem } from '../types/database.types'

interface CreateOrderInput {
  userId: string
  orderType: OrderType
  subtotal: number
  total: number
  note?: string
  promoCode?: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    selectedOptions?: Record<string, unknown>
    lineTotal: number
  }>
}

export async function createOrder(input: CreateOrderInput) {
  const supabase = createClient()

  // Step 1: Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: input.userId,
      status: 'pending',
      order_type: input.orderType,
      subtotal: input.subtotal,
      total: input.total,
      note: input.note ?? null,
      promo_code: input.promoCode ?? null,
    })
    .select()
    .single()

  if (orderError) {
    console.error('Failed to create order:', orderError.message)
    throw new Error(orderError.message)
  }

  // Step 2: Insert order items
  const orderItems: Omit<OrderItem, 'id'>[] = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    selected_options: item.selectedOptions ?? null,
    line_total: item.lineTotal,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Failed to insert order items:', itemsError.message)
    throw new Error(itemsError.message)
  }

  return order
}
