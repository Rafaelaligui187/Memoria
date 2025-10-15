import { CreateNotificationData, NOTIFICATION_TEMPLATES } from "./notification-schemas"

class NotificationService {
  private static instance: NotificationService
  private callbacks: Set<(notification: any) => void> = new Set()

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  // Create notification - works both client-side and server-side
  async createNotification(data: CreateNotificationData): Promise<void> {
    try {
      // Check if we're running on the server side (in API routes)
      if (typeof window === 'undefined') {
        // Server-side: directly interact with database
        const { connectToDatabase } = await import('./mongodb/connection')
        const db = await connectToDatabase()
        const notificationsCollection = db.collection('notifications')

        const newNotification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...data,
          timestamp: new Date(),
          read: false,
        }

        await notificationsCollection.insertOne(newNotification)
        console.log('✅ Notification created directly in database:', newNotification.id)
      } else {
        // Client-side: make HTTP request
        const response = await fetch('/api/admin/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Failed to create notification')
        }

        const result = await response.json()
        console.log('✅ Notification created via API:', result.message)
      }
    } catch (error) {
      console.error('❌ Error creating notification:', error)
      throw error
    }
  }

  // Profile approval notification
  async notifyProfileApproved(userName: string, profileId: string, schoolYearId: string): Promise<void> {
    const notificationData = NOTIFICATION_TEMPLATES.PROFILE_APPROVED(userName, profileId, schoolYearId)
    await this.createNotification(notificationData)
  }

  // Profile rejection notification
  async notifyProfileRejected(userName: string, profileId: string, schoolYearId: string, reason?: string): Promise<void> {
    const notificationData = NOTIFICATION_TEMPLATES.PROFILE_REJECTED(userName, profileId, schoolYearId, reason)
    await this.createNotification(notificationData)
  }

  // New profile submission notification
  async notifyNewProfileSubmission(userName: string, profileId: string, schoolYearId: string): Promise<void> {
    const notificationData = NOTIFICATION_TEMPLATES.NEW_PROFILE_SUBMISSION(userName, profileId, schoolYearId)
    await this.createNotification(notificationData)
  }

  // User report/message notification
  async notifyUserReport(userName: string, subject: string, reportId: string, priority: "low" | "medium" | "high" | "urgent" = "medium"): Promise<void> {
    const notificationData = NOTIFICATION_TEMPLATES.USER_REPORT(userName, subject, reportId, priority)
    await this.createNotification(notificationData)
  }

  // System error notification
  async notifySystemError(errorMessage: string, severity: "low" | "medium" | "high" = "medium"): Promise<void> {
    const notificationData = NOTIFICATION_TEMPLATES.SYSTEM_ERROR(errorMessage, severity)
    await this.createNotification(notificationData)
  }

  // Update notification status
  async updateNotification(notificationId: string, action: "mark_read" | "mark_unread" | "delete"): Promise<void> {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId, action }),
      })

      if (!response.ok) {
        throw new Error('Failed to update notification')
      }

      const result = await response.json()
      console.log('Notification updated:', result.message)
    } catch (error) {
      console.error('Error updating notification:', error)
    }
  }

  // Get notifications
  async getNotifications(params: {
    userId?: string
    schoolYearId?: string
    limit?: number
    unreadOnly?: boolean
  } = {}): Promise<any[]> {
    try {
      const searchParams = new URLSearchParams()
      if (params.userId) searchParams.set('userId', params.userId)
      if (params.schoolYearId) searchParams.set('schoolYearId', params.schoolYearId)
      if (params.limit) searchParams.set('limit', params.limit.toString())
      if (params.unreadOnly) searchParams.set('unreadOnly', 'true')

      const response = await fetch(`/api/admin/notifications?${searchParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const result = await response.json()
      return result.success ? result.data : []
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return []
    }
  }

  // Real-time subscription (placeholder for future WebSocket implementation)
  subscribe(callback: (notification: any) => void): () => void {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  // Dispatch notification to subscribers
  emit(notification: any): void {
    this.callbacks.forEach(callback => callback(notification))
  }
}

export const notificationService = NotificationService.getInstance()
