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

export const NOTIFICATION_TEMPLATES = {
  PROFILE_APPROVED: (userName: string, profileId: string, schoolYearId: string): CreateNotificationData => ({
    type: "success",
    title: "Profile Approved",
    message: `Profile for ${userName} has been approved`,
    priority: "low",
    category: "profile",
    actionUrl: `/admin/profiles?profileId=${profileId}`,
    actionLabel: "View Profile",
    metadata: {
      profileId,
      userName,
      schoolYearId
    }
  }),

  PROFILE_REJECTED: (userName: string, profileId: string, schoolYearId: string, reason?: string): CreateNotificationData => ({
    type: "warning",
    title: "Profile Rejected",
    message: `Profile for ${userName} has been rejected${reason ? `: ${reason}` : ''}`,
    priority: "low",
    category: "profile",
    actionUrl: `/admin/profiles?profileId=${profileId}`,
    actionLabel: "View Profile",
    metadata: {
      profileId,
      userName,
      schoolYearId,
      reason
    }
  }),

  NEW_PROFILE_SUBMISSION: (userName: string, profileId: string, schoolYearId: string): CreateNotificationData => ({
    type: "approval",
    title: "New Profile Submission",
    message: `${userName} has submitted a new profile for review`,
    priority: "medium",
    category: "profile",
    actionUrl: `/admin/profiles?profileId=${profileId}`,
    actionLabel: "Review Profile",
    metadata: {
      profileId,
      userName,
      schoolYearId
    }
  }),

  SYSTEM_ERROR: (errorMessage: string, severity: "low" | "medium" | "high" = "medium"): CreateNotificationData => ({
    type: "error",
    title: "System Error",
    message: errorMessage,
    priority: severity === "high" ? "urgent" : severity,
    category: "system",
    metadata: {
      errorMessage,
      severity,
      timestamp: new Date().toISOString()
    }
  }),

  ALBUM_LIKED: (userName: string, albumName: string, albumId: string): CreateNotificationData => ({
    type: "info",
    title: "Album Liked",
    message: `${userName} liked the album "${albumName}"`,
    priority: "low",
    category: "album",
    actionUrl: `/gallery/${albumId}`,
    actionLabel: "View Album",
    metadata: {
      albumId,
      albumName,
      userName
    }
  }),

  USER_REPORT: (userName: string, subject: string, reportId: string, priority: "low" | "medium" | "high" | "urgent" = "medium"): CreateNotificationData => ({
    type: priority === "urgent" ? "error" : "warning",
    title: "New User Report",
    message: `${userName} submitted a report: "${subject}"`,
    priority,
    category: "moderation",
    actionUrl: `/admin/reports?reportId=${reportId}`,
    actionLabel: "View Report",
    metadata: {
      reportId,
      userName,
      subject
    }
  })
}