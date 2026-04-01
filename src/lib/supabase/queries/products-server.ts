/**
 * Server-only product reads for pages that render on the server.
 */
import { createClient } from '../server'
import type { ProductWithOptions } from '../types/app.types'

export async function getAvailableProductsForSubscription(): Promise<ProductWithOptions[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, product_options(*), categories(name)')
    .eq('is_available', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch products for subscription:', error.message)
    throw new Error(error.message)
  }

  return (data ?? []) as ProductWithOptions[]
}
