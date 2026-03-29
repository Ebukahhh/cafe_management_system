/**
 * Notification Queries — All notification-related database reads
 */
import { createClient } from '../client'
import type { Notification } from '../types/database.types'

/** Fetch all notifications for a user */
export async function getNotifications(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Failed to fetch notifications:', error.message)
    throw new Error(error.message)
  }

  return data as Notification[]
}

/** Get count of unread notifications for a user */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient()

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  if (error) {
    console.error('Failed to fetch unread count:', error.message)
    throw new Error(error.message)
  }

  return count ?? 0
}
