import { createClient } from '../client'
import type { Product, ProductOption } from '../types/app.types'

/** Insert a new product */
export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()

  if (error) {
    console.error('Failed to create product:', error.message)
    throw new Error(error.message)
  }

  return data
}

/** Update an existing product */
export async function updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update product:', error.message)
    throw new Error(error.message)
  }

  return data
}

/** Soft or hard delete products */
export async function deleteProducts(ids: string[]) {
  const supabase = createClient()

  // Note: Depending on your DB constraints (e.g. order items referring to products),
  // you might want to soft delete by setting `is_available = false` and `archived = true`
  // But for this example we do a hard delete as requested.
  const { error } = await supabase
    .from('products')
    .delete()
    .in('id', ids)

  if (error) {
    console.error('Failed to delete products:', error.message)
    throw new Error(error.message)
  }

  return true
}
