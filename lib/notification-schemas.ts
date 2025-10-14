import { ObjectId } from "mongodb"

export interface NotificationSchema {
  _id?: ObjectId
  id: string
  type: "info" | "success" | "warning" | "error" | "approval" | "system" 
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: "low" | "medium" | "high" | "urgent"
  category: "profile" | "album" | "system" | "moderation" | "user" | "general"
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, any>
  userId?: string // For user-specific notifications
  schoolYearId?: string // For year-specific notifications
  createdAt: Date
  updatedAt: Date
}

export interface CreateNotificationData {
  type: "info" | "success" | "warning" | "error" | "approval" | "system"
  title: string
  message: string
  priority: "low" | "medium" | "high" | "urgent"
  category: "profile" | "album" | "system" | "moderation" | "user" | "general"
  actionUrl?: string
  actionLabel?: string
  metadata?: Record<string, any>
  userId?: string
  schoolYearId?: string
}

export interface NotificationSettings {
  emailOnApproval: boolean
  emailOnRejection: boolean
  inAppNotifications: boolean
  emailOnNewSubmission: boolean
  emailOnSystemAlerts: boolean
}

export const NOTIFICATION_COLLECTION = "notifications"

// Helper function to create notification data
export function createNotification(data: CreateNotificationData): Omit<NotificationSchema, 'read' | 'updatedAt'> {
  const now = new Date()
  return {
    id: data.type + "_" + now.getTime() + "_" + Math.random().toString(36).substr(2, 9),
    type: data.type,
    title: data.title,
    message: data.message,
    timestamp: now,
    priority: data.priority,
    category: data.category,
    actionUrl: data.actionUrl,
    actionLabel: data.actionLabel,
    metadata: data.metadata,
    userId: data.userId,
    schoolYearId: data.schoolYearId,
    createdAt: now,
  }
}

// Notification templates for common events
export const NOTIFICATION_TEMPLATES = {
  PROFILE_APPROVED: (userName: string, profileId: string, schoolYearId: string) => ({
    type: "approval" as const,
    title: "Profile Approved",
    message: `${userName}'s profile has been approved and is now live.`,
    priority: "medium" as const,
    category: "profile" as const,
    actionUrl: `/admin/profiles?year=${schoolYearId}`,
    actionLabel: "View Profiles",
    metadata: { profileId, userName, schoolYearId },
    schoolYearId,
  }),
  
  PROFILE_REJECTED: (userName: string, profileId: string, schoolYearId: string, reason?: string) => ({
    type: "warning" as const,
    title: "Profile Rejected",
    message: `${userName}'s profile has been rejected${reason ? `: ${reason}` : '.'}`,
    priority: "medium" as const,
    category: "profile" as const,
    actionUrl: `/admin/profiles?year=${schoolYearId}`,
    actionLabel: "View Profiles",
    metadata: { profileId, userName, schoolYearId, rejectionReason: reason },
    schoolYearId,
  }),
  
  NEW_PROFILE_SUBMISSION: (userName: string, profileId: string, schoolYearId: string) => ({
    type: "info" as const,
    title: "New Profile Submission",
    message: `${userName} has submitted a new profile for review.`,
    priority: "medium" as const,
    category: "profile" as const,
    actionUrl: `/admin/profiles?year=${schoolYearId}`,
    actionLabel: "Review Profile",
    metadata: { profileId, userName, schoolYearId },
    schoolYearId,
  }),
  
  SYSTEM_ERROR: (errorMessage: string, severity: "low" | "medium" | "high" = "medium") => ({
    type: "error" as const,
    title: "System Alert",
    message: errorMessage,
    priority: severity === "high" ? "urgent" as const : "high" as const,
    category: "system" as const,
    actionUrl: "/admin/settings",
    actionLabel: "Check System",
    metadata: { errorMessage, severity },
  }),
}
