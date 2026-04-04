import { createClient } from '../client';

const BUCKET = 'avatars';

/**
 * Upload an avatar image file to the "avatars" Supabase Storage bucket.
 *
 * Returns the public URL on success.
 * Throws on failure.
 */
export async function uploadAvatarImage(file: File): Promise<string> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Build a unique file path: e.g. <user_id>/<timestamp>.<ext>
  const ext = file.name.split('.').pop() || 'jpg';
  const filePath = `${user.id}/${Date.now()}.${ext}`;

  // Upload file to bucket
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) {
    console.error('Avatar upload failed:', error.message);
    throw new Error(error.message);
  }

  // Retrieve the public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
