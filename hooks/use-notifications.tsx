"use client"

import { useState, useEffect, useCallback } from 'react'
import { notificationService } from '@/lib/notification-service'

interface Notification {
  _id?: string
  id: string
  type: "info" | "success" | "warning" | "error" | "approval" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high" | "urgent"
  category: "profile" | "album" | "system" | "moderation" | "user" | "general"
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, any>
  userId?: string
  schoolYearId?: string
}

interface UseNotificationsParams {
  userId?: string
  schoolYearId?: string
  limit?: number
  unreadOnly?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  urgentCount: number
  loading: boolean
  error: string | null
  refreshNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAsUnread: (notificationId: string) => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  clearAllNotifications: () => Promise<void>
}

export function useNotifications(params: UseNotificationsParams = {}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { userId, schoolYearId, limit = 50, unreadOnly = false, autoRefresh = true, refreshInterval = 30000 } = params

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const fetchedNotifications = await notificationService.getNotifications({
        userId,
        schoolYearId,
        limit,
        unreadOnly
      })

      setNotifications(fetchedNotifications)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }, [userId, schoolYearId, limit, unreadOnly])

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications()
  }, [fetchNotifications])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.updateNotification(notificationId, 'mark_read')
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }, [])

  const markAsUnread = useCallback(async (notificationId: string) => {
    try {
      await notificationService.updateNotification(notificationId, 'mark_unread')
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: false } : n)
      )
    } catch (err) {
      console.error('Error marking notification as unread:', err)
    }
  }, [])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      await notificationService.updateNotification(notificationId, 'delete')
      
      setNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      )
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      // Update all unread notifications in batch
      const unreadNotifications = notifications.filter(n => !n.read)
      const unreadNotificationIds = unreadNotifications.map(n => n.id)
      
      await Promise.all(
        unreadNotificationIds.map(id => notificationService.updateNotification(id, 'mark_read'))
      )
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      )
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }, [notifications])

  const clearAllNotifications = useCallback(async () => {
    try {
      await Promise.all(
        notifications.map(n => notificationService.updateNotification(n.id, 'delete'))
      )
      
      setNotifications([])
    } catch (err) {
      console.error('Error clearing all notifications:', err)
    }
  }, [notifications])

  // Calculate counts
  const unreadCount = notifications.filter(n => !n.read).length
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length

  // Initial fetch
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchNotifications()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [fetchNotifications, autoRefresh, refreshInterval])

  // Listen for external notification events
  useEffect(() => {
    const handleNewNotification = (notification: Notification) => {
      // Only add if it matches our filters
      if (userId && notification.userId !== userId && notification.category !== 'system' && notification.category !== 'general') {
        return
      }
      
      if (schoolYearId && notification.schoolYearId !== schoolYearId) {
        return
      }

      setNotifications(prev => [notification, ...prev])
    }

    // Subscribe to real-time notifications
    const unsubscribe = notificationService.subscribe(handleNewNotification)

    return unsubscribe
  }, [userId, schoolYearId])

  return {
    notifications,
    unreadCount,
    urgentCount,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAsUnread,
    deleteNotification,
    markAllAsRead,
    clearAllNotifications
  }
}
