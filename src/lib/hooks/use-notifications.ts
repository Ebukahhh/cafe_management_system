/**
 * useNotifications — Realtime hook for live notification updates
 *
 * Subscribes to new INSERT events on the notifications table for the current user.
 * Based on integration guide Section 7.2.
 */
'use client'

import { useEffect, useState, useCallback } from 'react'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { createClient } from '../supabase/client'
import type { Notification } from '../supabase/types/database.types'
import { useUIStore } from '../store/ui'

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const addToast = useUIStore((s) => s.addToast)

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return

    const supabase = createClient()

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error && data) {
      const typed = data as unknown as Notification[]
      setNotifications(typed)
      setUnreadCount(typed.filter((n) => !n.is_read).length)
    }
  }, [userId])

  useEffect(() => {
    if (!userId) return

    fetchNotifications()

    const supabase = createClient()

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload: RealtimePostgresChangesPayload<Notification>) => {
          const newNotification = payload.new as Notification

          // Add to list
          setNotifications((prev) => [newNotification, ...prev])

          // Increment unread count
          setUnreadCount((prev) => prev + 1)

          // Show toast
          addToast({
            message: newNotification.title,
            type: 'info',
          })
        }
      )
      .subscribe()

    // IMPORTANT: Always unsubscribe when the component unmounts (Rule 5)
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, fetchNotifications, addToast])

  return { notifications, unreadCount, refetch: fetchNotifications }
}
