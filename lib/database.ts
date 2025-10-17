import type {
  User,
  SchoolYear,
  Album,
  Photo,
  ModerationItem,
  Report,
  Notification,
  AuditLog,
  SchoolHistory,
  RejectionReason,
  EmailQueue,
} from "./types"

// Database connection interface (can be implemented with different databases)
export interface DatabaseConnection {
  // School Years
  getSchoolYears(): Promise<SchoolYear[]>
  createSchoolYear(data: Omit<SchoolYear, "id" | "createdAt" | "updatedAt">): Promise<SchoolYear>
  updateSchoolYear(id: string, data: Partial<SchoolYear>): Promise<SchoolYear>
  deleteSchoolYear(id: string): Promise<boolean>

  // Users
  getUsers(schoolYearId: string, filters?: any): Promise<User[]>
  createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>
  updateUser(id: string, data: Partial<User>): Promise<User>
  deleteUser(id: string): Promise<boolean>
  getUserByEmail(email: string): Promise<User | null>

  // Profiles
  getProfiles(schoolYearId: string, type: string, filters?: any): Promise<any[]>
  createProfile(type: string, data: any): Promise<any>
  updateProfile(id: string, type: string, data: any): Promise<any>
  deleteProfile(id: string, type: string): Promise<boolean>
  getProfileById(id: string, type: string): Promise<any | null>

  // Albums and Photos
  getAlbums(schoolYearId: string, filters?: any): Promise<Album[]>
  createAlbum(data: Omit<Album, "id" | "createdAt" | "updatedAt" | "photos">): Promise<Album>
  updateAlbum(id: string, data: Partial<Album>): Promise<Album>
  deleteAlbum(id: string): Promise<boolean>

  getPhotos(albumId: string): Promise<Photo[]>
  createPhoto(data: Omit<Photo, "id" | "createdAt" | "updatedAt">): Promise<Photo>
  updatePhoto(id: string, data: Partial<Photo>): Promise<Photo>
  deletePhoto(id: string): Promise<boolean>

  // Moderation
  getModerationItems(schoolYearId: string, filters?: any): Promise<ModerationItem[]>
  createModerationItem(data: Omit<ModerationItem, "id" | "createdAt" | "updatedAt">): Promise<ModerationItem>
  updateModerationItem(id: string, data: Partial<ModerationItem>): Promise<ModerationItem>

  // Reports
  getReports(schoolYearId: string, filters?: any): Promise<Report[]>
  createReport(data: Omit<Report, "id" | "createdAt">): Promise<Report>
  updateReport(id: string, data: Partial<Report>): Promise<Report>

  // Notifications
  getNotifications(userId: string): Promise<Notification[]>
  createNotification(data: Omit<Notification, "id" | "createdAt">): Promise<Notification>
  markNotificationRead(id: string): Promise<boolean>

  // Audit Logs
  createAuditLog(data: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog>
  getAuditLogs(schoolYearId: string, filters?: any): Promise<AuditLog[]>
  deleteAuditLogsByUserId(userId: string): Promise<number>

  // School History
  getSchoolHistory(schoolYearId: string): Promise<SchoolHistory | null>
  createOrUpdateSchoolHistory(data: Omit<SchoolHistory, "id" | "createdAt" | "updatedAt">): Promise<SchoolHistory>

  // Rejection Reasons
  getRejectionReasons(schoolYearId?: string): Promise<RejectionReason[]>
  createRejectionReason(data: Omit<RejectionReason, "id">): Promise<RejectionReason>
  updateRejectionReason(id: string, data: Partial<RejectionReason>): Promise<RejectionReason>
  deleteRejectionReason(id: string): Promise<boolean>

  // Email Queue
  queueEmail(data: Omit<EmailQueue, "id" | "createdAt">): Promise<EmailQueue>
  getQueuedEmails(): Promise<EmailQueue[]>
  markEmailSent(id: string): Promise<boolean>
  markEmailFailed(id: string, error: string): Promise<boolean>
}

// Mock database implementation for development
class MockDatabase implements DatabaseConnection {
  private schoolYears: SchoolYear[] = [
    {
      id: "1",
      yearLabel: "2024-2025",
      startDate: new Date("2024-08-01"),
      endDate: new Date("2025-07-31"),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      yearLabel: "2023-2024",
      startDate: new Date("2023-08-01"),
      endDate: new Date("2024-07-31"),
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  private users: User[] = []
  private profiles: Record<string, any[]> = {
    student: [],
    faculty: [],
    alumni: [],
    staff: [],
    utility: [],
    advisory: [],
  }
  private albums: Album[] = []
  private photos: Photo[] = []
  private moderationItems: ModerationItem[] = []
  private reports: Report[] = []
  private notifications: Notification[] = []
  private auditLogs: AuditLog[] = []
  private schoolHistories: SchoolHistory[] = []
  private rejectionReasons: RejectionReason[] = [
    { id: "1", reason: "Inappropriate content", category: "content", isActive: true },
    { id: "2", reason: "Incomplete information", category: "data", isActive: true },
    { id: "3", reason: "Poor image quality", category: "media", isActive: true },
    { id: "4", reason: "Duplicate entry", category: "data", isActive: true },
    { id: "5", reason: "Other", category: "general", isActive: true },
  ]
  private emailQueue: EmailQueue[] = []

  // School Years
  async getSchoolYears(): Promise<SchoolYear[]> {
    return [...this.schoolYears]
  }

  async createSchoolYear(data: Omit<SchoolYear, "id" | "createdAt" | "updatedAt">): Promise<SchoolYear> {
    const schoolYear: SchoolYear = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.schoolYears.push(schoolYear)
    return schoolYear
  }

  async updateSchoolYear(id: string, data: Partial<SchoolYear>): Promise<SchoolYear> {
    const index = this.schoolYears.findIndex((sy) => sy.id === id)
    if (index === -1) throw new Error("School year not found")

    this.schoolYears[index] = { ...this.schoolYears[index], ...data, updatedAt: new Date() }
    return this.schoolYears[index]
  }

  async deleteSchoolYear(id: string): Promise<boolean> {
    const index = this.schoolYears.findIndex((sy) => sy.id === id)
    if (index === -1) return false

    this.schoolYears.splice(index, 1)
    return true
  }

  // Users
  async getUsers(schoolYearId: string, filters?: any): Promise<User[]> {
    return [...this.users]
  }

  async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const user: User = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(user)
    return user
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const index = this.users.findIndex((u) => u.id === id)
    if (index === -1) throw new Error("User not found")

    this.users[index] = { ...this.users[index], ...data, updatedAt: new Date() }
    return this.users[index]
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id)
    if (index === -1) return false

    this.users.splice(index, 1)
    
    // Also delete audit logs for this user
    try {
      const auditLogsDeleted = await this.deleteAuditLogsByUserId(id)
      console.log(`[MockDB] Deleted user ${id} and ${auditLogsDeleted} associated audit logs`)
    } catch (auditError) {
      console.error(`[MockDB] Error deleting audit logs for user ${id}:`, auditError)
      // Don't fail user deletion if audit log cleanup fails
    }
    
    return true
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null
  }

  // Profiles
  async getProfiles(schoolYearId: string, type: string, filters?: any): Promise<any[]> {
    return [...(this.profiles[type] || [])]
  }

  async createProfile(type: string, data: any): Promise<any> {
    const profile = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (!this.profiles[type]) this.profiles[type] = []
    this.profiles[type].push(profile)
    return profile
  }

  async updateProfile(id: string, type: string, data: any): Promise<any> {
    const profiles = this.profiles[type] || []
    const index = profiles.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Profile not found")

    profiles[index] = { ...profiles[index], ...data, updatedAt: new Date() }
    return profiles[index]
  }

  async deleteProfile(id: string, type: string): Promise<boolean> {
    const profiles = this.profiles[type] || []
    const index = profiles.findIndex((p) => p.id === id)
    if (index === -1) return false

    profiles.splice(index, 1)
    return true
  }

  async getProfileById(id: string, type: string): Promise<any | null> {
    const profiles = this.profiles[type] || []
    return profiles.find((p) => p.id === id) || null
  }

  // Albums and Photos
  async getAlbums(schoolYearId: string, filters?: any): Promise<Album[]> {
    return this.albums.filter((a) => a.schoolYearId === schoolYearId)
  }

  async createAlbum(data: Omit<Album, "id" | "createdAt" | "updatedAt" | "photos">): Promise<Album> {
    const album: Album = {
      ...data,
      id: Date.now().toString(),
      photos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.albums.push(album)
    return album
  }

  async updateAlbum(id: string, data: Partial<Album>): Promise<Album> {
    const index = this.albums.findIndex((a) => a.id === id)
    if (index === -1) throw new Error("Album not found")

    this.albums[index] = { ...this.albums[index], ...data, updatedAt: new Date() }
    return this.albums[index]
  }

  async deleteAlbum(id: string): Promise<boolean> {
    const index = this.albums.findIndex((a) => a.id === id)
    if (index === -1) return false

    this.albums.splice(index, 1)
    return true
  }

  async getPhotos(albumId: string): Promise<Photo[]> {
    return this.photos.filter((p) => p.albumId === albumId)
  }

  async createPhoto(data: Omit<Photo, "id" | "createdAt" | "updatedAt">): Promise<Photo> {
    const photo: Photo = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.photos.push(photo)
    return photo
  }

  async updatePhoto(id: string, data: Partial<Photo>): Promise<Photo> {
    const index = this.photos.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Photo not found")

    this.photos[index] = { ...this.photos[index], ...data, updatedAt: new Date() }
    return this.photos[index]
  }

  async deletePhoto(id: string): Promise<boolean> {
    const index = this.photos.findIndex((p) => p.id === id)
    if (index === -1) return false

    this.photos.splice(index, 1)
    return true
  }

  // Moderation
  async getModerationItems(schoolYearId: string, filters?: any): Promise<ModerationItem[]> {
    return this.moderationItems.filter((m) => m.schoolYearId === schoolYearId)
  }

  async createModerationItem(data: Omit<ModerationItem, "id" | "createdAt" | "updatedAt">): Promise<ModerationItem> {
    const item: ModerationItem = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.moderationItems.push(item)
    return item
  }

  async updateModerationItem(id: string, data: Partial<ModerationItem>): Promise<ModerationItem> {
    const index = this.moderationItems.findIndex((m) => m.id === id)
    if (index === -1) throw new Error("Moderation item not found")

    this.moderationItems[index] = { ...this.moderationItems[index], ...data, updatedAt: new Date() }
    return this.moderationItems[index]
  }

  // Reports
  async getReports(schoolYearId: string, filters?: any): Promise<Report[]> {
    return this.reports.filter((r) => r.schoolYearId === schoolYearId)
  }

  async createReport(data: Omit<Report, "id" | "createdAt">): Promise<Report> {
    const report: Report = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    this.reports.push(report)
    return report
  }

  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    const index = this.reports.findIndex((r) => r.id === id)
    if (index === -1) throw new Error("Report not found")

    this.reports[index] = { ...this.reports[index], ...data }
    return this.reports[index]
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications.filter((n) => n.userId === userId)
  }

  async createNotification(data: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
    const notification: Notification = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    this.notifications.push(notification)
    return notification
  }

  async markNotificationRead(id: string): Promise<boolean> {
    const index = this.notifications.findIndex((n) => n.id === id)
    if (index === -1) return false

    this.notifications[index].read = true
    return true
  }

  // Audit Logs
  async createAuditLog(data: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
    const log: AuditLog = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    this.auditLogs.push(log)
    return log
  }

  async getAuditLogs(schoolYearId: string, filters?: any): Promise<AuditLog[]> {
    return this.auditLogs.filter((l) => l.schoolYearId === schoolYearId)
  }

  async deleteAuditLogsByUserId(userId: string): Promise<number> {
    const initialLength = this.auditLogs.length
    this.auditLogs = this.auditLogs.filter((log) => log.userId !== userId)
    const deletedCount = initialLength - this.auditLogs.length
    console.log(`[MockDB] Deleted ${deletedCount} audit logs for user ${userId}`)
    return deletedCount
  }

  // School History
  async getSchoolHistory(schoolYearId: string): Promise<SchoolHistory | null> {
    return this.schoolHistories.find((h) => h.schoolYearId === schoolYearId) || null
  }

  async createOrUpdateSchoolHistory(
    data: Omit<SchoolHistory, "id" | "createdAt" | "updatedAt">,
  ): Promise<SchoolHistory> {
    const existing = this.schoolHistories.find((h) => h.schoolYearId === data.schoolYearId)

    if (existing) {
      const index = this.schoolHistories.findIndex((h) => h.id === existing.id)
      this.schoolHistories[index] = { ...existing, ...data, updatedAt: new Date() }
      return this.schoolHistories[index]
    } else {
      const history: SchoolHistory = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      this.schoolHistories.push(history)
      return history
    }
  }

  // Rejection Reasons
  async getRejectionReasons(schoolYearId?: string): Promise<RejectionReason[]> {
    return this.rejectionReasons.filter(
      (r) => r.isActive && (!schoolYearId || !r.schoolYearId || r.schoolYearId === schoolYearId),
    )
  }

  async createRejectionReason(data: Omit<RejectionReason, "id">): Promise<RejectionReason> {
    const reason: RejectionReason = {
      ...data,
      id: Date.now().toString(),
    }
    this.rejectionReasons.push(reason)
    return reason
  }

  async updateRejectionReason(id: string, data: Partial<RejectionReason>): Promise<RejectionReason> {
    const index = this.rejectionReasons.findIndex((r) => r.id === id)
    if (index === -1) throw new Error("Rejection reason not found")

    this.rejectionReasons[index] = { ...this.rejectionReasons[index], ...data }
    return this.rejectionReasons[index]
  }

  async deleteRejectionReason(id: string): Promise<boolean> {
    const index = this.rejectionReasons.findIndex((r) => r.id === id)
    if (index === -1) return false

    this.rejectionReasons.splice(index, 1)
    return true
  }

  // Email Queue
  async queueEmail(data: Omit<EmailQueue, "id" | "createdAt">): Promise<EmailQueue> {
    const email: EmailQueue = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    this.emailQueue.push(email)
    return email
  }

  async getQueuedEmails(): Promise<EmailQueue[]> {
    return this.emailQueue.filter((e) => e.status === "pending")
  }

  async markEmailSent(id: string): Promise<boolean> {
    const index = this.emailQueue.findIndex((e) => e.id === id)
    if (index === -1) return false

    this.emailQueue[index].status = "sent"
    this.emailQueue[index].sentAt = new Date()
    return true
  }

  async markEmailFailed(id: string, error: string): Promise<boolean> {
    const index = this.emailQueue.findIndex((e) => e.id === id)
    if (index === -1) return false

    this.emailQueue[index].status = "failed"
    this.emailQueue[index].error = error
    return true
  }
}

import { MongoDatabase } from "./mongodb-database"

let dbInstance: DatabaseConnection | null = null

export function getDatabase(): DatabaseConnection {
  if (!dbInstance) {
    try {
      // Try to use MongoDB database
      dbInstance = new MongoDatabase()
      console.log("[v0] Using MongoDB database")
    } catch (error) {
      console.warn("[v0] Failed to initialize MongoDB database, falling back to mock:", error)
      // Fall back to mock database if MongoDB fails
      dbInstance = new MockDatabase()
    }
  }
  return dbInstance
}

export const db: DatabaseConnection = getDatabase()

// Utility functions
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function createAuditLog(
  userId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, any>,
  schoolYearId?: string,
) {
  return db.createAuditLog({
    userId,
    action,
    targetType,
    targetId,
    details,
    schoolYearId,
    ipAddress: "unknown", // Would be populated from request in real implementation
    userAgent: "unknown",
  })
}
