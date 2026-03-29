/**
 * Mark Notifications Read Mutation
 */
import { createClient } from '../client'

/** Mark all unread notifications as read for a user */
export async function markNotificationsRead(userId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) {
    console.error('Failed to mark notifications as read:', error.message)
    throw new Error(error.message)
  }
}

/** Mark a single notification as read */
export async function markNotificationRead(notificationId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)

  if (error) {
    console.error('Failed to mark notification as read:', error.message)
    throw new Error(error.message)
  }
}
