/**
 * Upload a product image to the "product-images" Supabase Storage bucket.
 *
 * Returns the public URL on success.
 * Throws on failure.
 */
import { createClient } from '../client'

const BUCKET = 'product-images'

export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient()

  // Build a unique file path: products/<timestamp>-<sanitised-name>
  const ext = file.name.split('.').pop() || 'jpg'
  const safeName = file.name
    .replace(/\.[^/.]+$/, '')           // strip extension
    .replace(/[^a-zA-Z0-9_-]/g, '_')   // remove special chars
    .slice(0, 60)                       // cap length
  const filePath = `products/${Date.now()}-${safeName}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Image upload failed:', error.message)
    throw new Error(error.message)
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath)

  return urlData.publicUrl
}

/**
 * Delete a product image from storage by its public URL.
 * Silently ignores errors (best-effort cleanup).
 */
export async function deleteProductImage(publicUrl: string) {
  const supabase = createClient()

  // Extract the path after /object/public/product-images/
  const marker = `/object/public/${BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return

  const filePath = publicUrl.slice(idx + marker.length)

  await supabase.storage.from(BUCKET).remove([filePath])
}
