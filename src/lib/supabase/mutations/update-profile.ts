/**
 * Update Profile Mutation
 */
import { createClient } from '../client'

interface UpdateProfileInput {
  fullName?: string
  phone?: string
  avatarUrl?: string
  dietaryFlags?: string[]
}

export async function updateProfile(userId: string, updates: UpdateProfileInput) {
  const supabase = createClient()

  const { error } = await supabase
    .from('profiles')
    .update({
      ...(updates.fullName !== undefined && { full_name: updates.fullName }),
      ...(updates.phone !== undefined && { phone: updates.phone }),
      ...(updates.avatarUrl !== undefined && { avatar_url: updates.avatarUrl }),
      ...(updates.dietaryFlags !== undefined && { dietary_flags: updates.dietaryFlags }),
    })
    .eq('id', userId)

  if (error) {
    console.error('Failed to update profile:', error.message)
    throw new Error(error.message)
  }
}
