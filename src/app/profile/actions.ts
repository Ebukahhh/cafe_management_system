'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfileInfo(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not signed in')
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const phone = formData.get('phone') as string
  const dob = formData.get('dob') as string

  // Combine into full_name as per DB schema
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || null

  // For Dietary Flags, we get all values from checkboxes or hidden inputs named "dietary_flags"
  const dietaryFlags = formData.getAll('dietary_flags') as string[]

  const updates: Record<string, any> = {}
  
  if (fullName !== null) updates.full_name = fullName
  if (phone !== null) updates.phone = phone || null
  if (dietaryFlags.length >= 0) updates.dietary_flags = dietaryFlags
  
  // Note: dob is not in the current Profile schema, but we can store it in user_metadata via auth if strictly needed later.
  
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/profile')
}

export async function updateProfileAvatar(avatarUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not signed in')

  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/profile')
}
