/**
 * Product Queries — All product-related database reads
 */
import { createClient } from '../client'
import type { ProductWithOptions } from '../types/app.types'

/** Fetch all available products, optionally filtered by category */
export async function getProducts(categoryId?: string) {
  const supabase = createClient()

  let query = supabase
    .from('products')
    .select('*, product_options(*), categories(name)')
    .eq('is_available', true)
    .order('sort_order', { ascending: true })

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch products:', error.message)
    throw new Error(error.message)
  }

  return data as ProductWithOptions[]
}

/** Fetch a single product by ID with options and category */
export async function getProductById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, product_options(*), categories(name)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to fetch product:', error.message)
    throw new Error(error.message)
  }

  return data as ProductWithOptions
}

/** Fetch featured products for the landing page */
export async function getFeaturedProducts() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*, product_options(*), categories(name)')
    .eq('is_available', true)
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(6)

  if (error) {
    console.error('Failed to fetch featured products:', error.message)
    throw new Error(error.message)
  }

  return data as ProductWithOptions[]
}

/** Fetch all active categories */
export async function getCategories() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch categories:', error.message)
    throw new Error(error.message)
  }

  return data
}
