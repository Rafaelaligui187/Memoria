import { connectToDatabase } from "@/lib/mongodb/connection"

export interface AdminNotificationData {
  userId?: string // Specific user ID for targeted notifications
  type: "info" | "success" | "warning" | "error" | "approval" | "system"
  title: string
  message: string
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, any>
  priority?: "low" | "medium" | "high" | "urgent"
  category?: "profile" | "album" | "system" | "moderation" | "user" | "general" | "content"
}

class AdminNotificationService {
  private static instance: AdminNotificationService

  static getInstance(): AdminNotificationService {
    if (!AdminNotificationService.instance) {
      AdminNotificationService.instance = new AdminNotificationService()
    }
    return AdminNotificationService.instance
  }

  // Create notification for all users or specific user
  async createNotification(data: AdminNotificationData): Promise<void> {
    try {
      const db = await connectToDatabase()
      const notificationsCollection = db.collection('notifications')

      const notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: data.userId || "all", // "all" means all users should see this
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: new Date(),
        read: false,
        priority: data.priority || "medium",
        category: data.category || "general",
        actionUrl: data.actionUrl,
        actionLabel: data.actionLabel,
        metadata: data.metadata,
      }

      await notificationsCollection.insertOne(notification)
      console.log('✅ Admin notification created:', notification.id, 'for user:', notification.userId)
    } catch (error) {
      console.error('❌ Error creating admin notification:', error)
      throw error
    }
  }

  // Notify all users about new gallery album
  async notifyNewAlbum(albumData: {
    title: string
    category: string
    description?: string
    yearId?: string
  }): Promise<void> {
    await this.createNotification({
      type: "info",
      title: "New Album Added to Gallery",
      message: `A new album "${albumData.title}" has been added to the gallery${albumData.category ? ` in the ${albumData.category} category` : ''}. Check it out!`,
      actionUrl: "/gallery",
      actionLabel: "View Gallery",
      priority: "medium",
      category: "album",
      metadata: {
        albumTitle: albumData.title,
        category: albumData.category,
        yearId: albumData.yearId
      }
    })
  }

  // Notify all users about new school year
  async notifyNewSchoolYear(yearData: {
    label: string
    startDate: string
    endDate: string
  }): Promise<void> {
    await this.createNotification({
      type: "system",
      title: "New School Year Added",
      message: `A new school year "${yearData.label}" has been added to the system. You can now submit profiles for this academic year.`,
      actionUrl: "/dashboard",
      actionLabel: "Go to Dashboard",
      priority: "high",
      category: "system",
      metadata: {
        yearLabel: yearData.label,
        startDate: yearData.startDate,
        endDate: yearData.endDate
      }
    })
  }

  // Notify all users about new strand
  async notifyNewStrand(strandData: {
    name: string
    fullName: string
    department: string
    schoolYear: string
  }): Promise<void> {
    await this.createNotification({
      type: "info",
      title: "New Strand Added",
      message: `A new strand "${strandData.fullName}" has been added to the ${strandData.department} department for ${strandData.schoolYear}.`,
      actionUrl: "/faculty",
      actionLabel: "View Faculty & Staff",
      priority: "medium",
      category: "content",
      metadata: {
        strandName: strandData.name,
        fullName: strandData.fullName,
        department: strandData.department,
        schoolYear: strandData.schoolYear
      }
    })
  }

  // Notify all users about new course
  async notifyNewCourse(courseData: {
    name: string
    fullName: string
    department: string
    schoolYear: string
  }): Promise<void> {
    await this.createNotification({
      type: "info",
      title: "New Course Added",
      message: `A new course "${courseData.fullName}" has been added to the ${courseData.department} department for ${courseData.schoolYear}.`,
      actionUrl: "/faculty",
      actionLabel: "View Faculty & Staff",
      priority: "medium",
      category: "content",
      metadata: {
        courseName: courseData.name,
        fullName: courseData.fullName,
        department: courseData.department,
        schoolYear: courseData.schoolYear
      }
    })
  }

  // Notify all users about new section
  async notifyNewSection(sectionData: {
    name: string
    department: string
    schoolYear: string
  }): Promise<void> {
    await this.createNotification({
      type: "info",
      title: "New Section Added",
      message: `A new section "${sectionData.name}" has been added to the ${sectionData.department} department for ${sectionData.schoolYear}.`,
      actionUrl: "/faculty",
      actionLabel: "View Faculty & Staff",
      priority: "medium",
      category: "content",
      metadata: {
        sectionName: sectionData.name,
        department: sectionData.department,
        schoolYear: sectionData.schoolYear
      }
    })
  }

  // Notify specific user about profile approval
  async notifyProfileApproval(userId: string, profileData: {
    fullName: string
    userType: string
    department?: string
    schoolYear: string
  }): Promise<void> {
    await this.createNotification({
      userId,
      type: "success",
      title: "Profile Approved!",
      message: `Congratulations! Your ${profileData.userType} profile for ${profileData.schoolYear} has been approved and is now live.`,
      actionUrl: "/dashboard",
      actionLabel: "View Profile",
      priority: "high",
      category: "profile",
      metadata: {
        profileName: profileData.fullName,
        userType: profileData.userType,
        department: profileData.department,
        schoolYear: profileData.schoolYear,
        isApproval: true
      }
    })
  }

  // Notify specific user about message being in progress
  async notifyMessageInProgress(userId: string, messageData: {
    subject: string
    reportId: string
  }): Promise<void> {
    await this.createNotification({
      userId,
      type: "info",
      title: "Your Message is Being Reviewed",
      message: `An admin is now reviewing your message "${messageData.subject}". You'll receive a response soon.`,
      actionUrl: "/dashboard",
      actionLabel: "View Message",
      priority: "medium",
      category: "user",
      metadata: {
        subject: messageData.subject,
        reportId: messageData.reportId,
        isInProgress: true
      }
    })
  }

  // Notify specific user about message reply
  async notifyMessageReply(userId: string, messageData: {
    subject: string
    adminReply: string
    reportId: string
  }): Promise<void> {
    await this.createNotification({
      userId,
      type: "success",
      title: "Admin Replied to Your Message",
      message: `Admin reply: "${messageData.adminReply}"`,
      actionUrl: "/dashboard",
      actionLabel: "View Reply",
      priority: "medium",
      category: "user",
      metadata: {
        subject: messageData.subject,
        reportId: messageData.reportId,
        adminReply: messageData.adminReply,
        isReply: true
      }
    })
  }

  // Notify specific user about message resolution
  async notifyMessageResolved(userId: string, messageData: {
    subject: string
    reportId: string
  }): Promise<void> {
    await this.createNotification({
      userId,
      type: "success",
      title: "Message Resolved",
      message: `Your message "${messageData.subject}" has been resolved by the admin.`,
      actionUrl: "/dashboard",
      actionLabel: "View Details",
      priority: "medium",
      category: "user",
      metadata: {
        subject: messageData.subject,
        reportId: messageData.reportId,
        isResolved: true
      }
    })
  }

  // Notify all users about system updates
  async notifySystemUpdate(updateData: {
    title: string
    description: string
    actionUrl?: string
  }): Promise<void> {
    await this.createNotification({
      type: "system",
      title: updateData.title,
      message: updateData.description,
      actionUrl: updateData.actionUrl,
      actionLabel: updateData.actionUrl ? "Learn More" : undefined,
      priority: "medium",
      category: "system",
      metadata: {
        isSystemUpdate: true
      }
    })
  }
}

export const adminNotificationService = AdminNotificationService.getInstance()
