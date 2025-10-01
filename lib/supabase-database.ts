import { createClient } from "@/lib/supabase/server"
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
import type { DatabaseConnection } from "./database"

export class SupabaseDatabase implements DatabaseConnection {
  // School Years
  async getSchoolYears(): Promise<SchoolYear[]> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("school_years").select("*").order("start_date", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching school years:", error)
      throw new Error(`Failed to fetch school years: ${error.message}`)
    }

    return data.map((row) => ({
      id: row.id,
      yearLabel: row.year_label,
      startDate: new Date(row.start_date),
      endDate: new Date(row.end_date),
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }))
  }

  async createSchoolYear(data: Omit<SchoolYear, "id" | "createdAt" | "updatedAt">): Promise<SchoolYear> {
    const supabase = await createClient()
    const { data: result, error } = await supabase
      .from("school_years")
      .insert({
        year_label: data.yearLabel,
        start_date: data.startDate.toISOString(),
        end_date: data.endDate.toISOString(),
        is_active: data.isActive,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating school year:", error)
      throw new Error(`Failed to create school year: ${error.message}`)
    }

    return {
      id: result.id,
      yearLabel: result.year_label,
      startDate: new Date(result.start_date),
      endDate: new Date(result.end_date),
      isActive: result.is_active,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
    }
  }

  async updateSchoolYear(id: string, data: Partial<SchoolYear>): Promise<SchoolYear> {
    const supabase = await createClient()
    const updateData: any = {}

    if (data.yearLabel) updateData.year_label = data.yearLabel
    if (data.startDate) updateData.start_date = data.startDate.toISOString()
    if (data.endDate) updateData.end_date = data.endDate.toISOString()
    if (data.isActive !== undefined) updateData.is_active = data.isActive

    const { data: result, error } = await supabase
      .from("school_years")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating school year:", error)
      throw new Error(`Failed to update school year: ${error.message}`)
    }

    return {
      id: result.id,
      yearLabel: result.year_label,
      startDate: new Date(result.start_date),
      endDate: new Date(result.end_date),
      isActive: result.is_active,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
    }
  }

  async deleteSchoolYear(id: string): Promise<boolean> {
    const supabase = await createClient()
    const { error } = await supabase.from("school_years").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting school year:", error)
      return false
    }

    return true
  }

  // Users
  async getUsers(schoolYearId: string, filters?: any): Promise<User[]> {
    const supabase = await createClient()
    const query = supabase.from("users").select("*").eq("school_year_id", schoolYearId)

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching users:", error)
      throw new Error(`Failed to fetch users: ${error.message}`)
    }

    return data.map((row) => ({
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      schoolYearId: row.school_year_id,
      isActive: row.is_active,
      lastLogin: row.last_login ? new Date(row.last_login) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }))
  }

  async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const supabase = await createClient()
    const { data: result, error } = await supabase
      .from("users")
      .insert({
        email: data.email,
        name: data.name,
        role: data.role,
        school_year_id: data.schoolYearId,
        is_active: data.isActive,
        last_login: data.lastLogin?.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating user:", error)
      throw new Error(`Failed to create user: ${error.message}`)
    }

    return {
      id: result.id,
      email: result.email,
      name: result.name,
      role: result.role,
      schoolYearId: result.school_year_id,
      isActive: result.is_active,
      lastLogin: result.last_login ? new Date(result.last_login) : null,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const supabase = await createClient()
    const updateData: any = {}

    if (data.email) updateData.email = data.email
    if (data.name) updateData.name = data.name
    if (data.role) updateData.role = data.role
    if (data.schoolYearId) updateData.school_year_id = data.schoolYearId
    if (data.isActive !== undefined) updateData.is_active = data.isActive
    if (data.lastLogin) updateData.last_login = data.lastLogin.toISOString()

    const { data: result, error } = await supabase.from("users").update(updateData).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Error updating user:", error)
      throw new Error(`Failed to update user: ${error.message}`)
    }

    return {
      id: result.id,
      email: result.email,
      name: result.name,
      role: result.role,
      schoolYearId: result.school_year_id,
      isActive: result.is_active,
      lastLogin: result.last_login ? new Date(result.last_login) : null,
      createdAt: new Date(result.created_at),
      updatedAt: new Date(result.updated_at),
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    const supabase = await createClient()
    const { error } = await supabase.from("users").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting user:", error)
      return false
    }

    return true
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const supabase = await createClient()
    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) {
      if (error.code === "PGRST116") return null // No rows returned
      console.error("[v0] Error fetching user by email:", error)
      throw new Error(`Failed to fetch user: ${error.message}`)
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      schoolYearId: data.school_year_id,
      isActive: data.is_active,
      lastLogin: data.last_login ? new Date(data.last_login) : null,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    }
  }

  // Profiles - Generic implementation for all profile types
  async getProfiles(schoolYearId: string, type: string, filters?: any): Promise<any[]> {
    const supabase = await createClient()
    const tableName = `${type}_profiles`

    const { data, error } = await supabase.from(tableName).select("*").eq("school_year_id", schoolYearId)

    if (error) {
      console.error(`[v0] Error fetching ${type} profiles:`, error)
      throw new Error(`Failed to fetch ${type} profiles: ${error.message}`)
    }

    return data || []
  }

  async createProfile(type: string, data: any): Promise<any> {
    const supabase = await createClient()
    const tableName = `${type}_profiles`

    const { data: result, error } = await supabase.from(tableName).insert(data).select().single()

    if (error) {
      console.error(`[v0] Error creating ${type} profile:`, error)
      throw new Error(`Failed to create ${type} profile: ${error.message}`)
    }

    return result
  }

  async updateProfile(id: string, type: string, data: any): Promise<any> {
    const supabase = await createClient()
    const tableName = `${type}_profiles`

    const { data: result, error } = await supabase.from(tableName).update(data).eq("id", id).select().single()

    if (error) {
      console.error(`[v0] Error updating ${type} profile:`, error)
      throw new Error(`Failed to update ${type} profile: ${error.message}`)
    }

    return result
  }

  async deleteProfile(id: string, type: string): Promise<boolean> {
    const supabase = await createClient()
    const tableName = `${type}_profiles`

    const { error } = await supabase.from(tableName).delete().eq("id", id)

    if (error) {
      console.error(`[v0] Error deleting ${type} profile:`, error)
      return false
    }

    return true
  }

  async getProfileById(id: string, type: string): Promise<any | null> {
    const supabase = await createClient()
    const tableName = `${type}_profiles`

    const { data, error } = await supabase.from(tableName).select("*").eq("id", id).single()

    if (error) {
      if (error.code === "PGRST116") return null // No rows returned
      console.error(`[v0] Error fetching ${type} profile:`, error)
      throw new Error(`Failed to fetch ${type} profile: ${error.message}`)
    }

    return data
  }

  // Placeholder implementations for other methods
  // Albums and Photos
  async getAlbums(schoolYearId: string, filters?: any): Promise<Album[]> {
    // TODO: Implement when albums table is ready
    return []
  }

  async createAlbum(data: Omit<Album, "id" | "createdAt" | "updatedAt" | "photos">): Promise<Album> {
    throw new Error("Albums not yet implemented")
  }

  async updateAlbum(id: string, data: Partial<Album>): Promise<Album> {
    throw new Error("Albums not yet implemented")
  }

  async deleteAlbum(id: string): Promise<boolean> {
    throw new Error("Albums not yet implemented")
  }

  async getPhotos(albumId: string): Promise<Photo[]> {
    return []
  }

  async createPhoto(data: Omit<Photo, "id" | "createdAt" | "updatedAt">): Promise<Photo> {
    throw new Error("Photos not yet implemented")
  }

  async updatePhoto(id: string, data: Partial<Photo>): Promise<Photo> {
    throw new Error("Photos not yet implemented")
  }

  async deletePhoto(id: string): Promise<boolean> {
    throw new Error("Photos not yet implemented")
  }

  // Moderation
  async getModerationItems(schoolYearId: string, filters?: any): Promise<ModerationItem[]> {
    return []
  }

  async createModerationItem(data: Omit<ModerationItem, "id" | "createdAt" | "updatedAt">): Promise<ModerationItem> {
    throw new Error("Moderation not yet implemented")
  }

  async updateModerationItem(id: string, data: Partial<ModerationItem>): Promise<ModerationItem> {
    throw new Error("Moderation not yet implemented")
  }

  // Reports
  async getReports(schoolYearId: string, filters?: any): Promise<Report[]> {
    return []
  }

  async createReport(data: Omit<Report, "id" | "createdAt">): Promise<Report> {
    throw new Error("Reports not yet implemented")
  }

  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    throw new Error("Reports not yet implemented")
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    return []
  }

  async createNotification(data: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
    throw new Error("Notifications not yet implemented")
  }

  async markNotificationRead(id: string): Promise<boolean> {
    throw new Error("Notifications not yet implemented")
  }

  // Audit Logs
  async createAuditLog(data: Omit<AuditLog, "id" | "createdAt">): Promise<AuditLog> {
    const supabase = await createClient()
    const { data: result, error } = await supabase
      .from("audit_logs")
      .insert({
        user_id: data.userId,
        action: data.action,
        target_type: data.targetType,
        target_id: data.targetId,
        details: data.details,
        school_year_id: data.schoolYearId,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating audit log:", error)
      throw new Error(`Failed to create audit log: ${error.message}`)
    }

    return {
      id: result.id,
      userId: result.user_id,
      action: result.action,
      targetType: result.target_type,
      targetId: result.target_id,
      details: result.details,
      schoolYearId: result.school_year_id,
      ipAddress: result.ip_address,
      userAgent: result.user_agent,
      createdAt: new Date(result.created_at),
    }
  }

  async getAuditLogs(schoolYearId: string, filters?: any): Promise<AuditLog[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("school_year_id", schoolYearId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching audit logs:", error)
      throw new Error(`Failed to fetch audit logs: ${error.message}`)
    }

    return data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      action: row.action,
      targetType: row.target_type,
      targetId: row.target_id,
      details: row.details,
      schoolYearId: row.school_year_id,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: new Date(row.created_at),
    }))
  }

  // School History
  async getSchoolHistory(schoolYearId: string): Promise<SchoolHistory | null> {
    return null // TODO: Implement when needed
  }

  async createOrUpdateSchoolHistory(
    data: Omit<SchoolHistory, "id" | "createdAt" | "updatedAt">,
  ): Promise<SchoolHistory> {
    throw new Error("School history not yet implemented")
  }

  // Rejection Reasons
  async getRejectionReasons(schoolYearId?: string): Promise<RejectionReason[]> {
    // Return default rejection reasons for now
    return [
      { id: "1", reason: "Inappropriate content", category: "content", isActive: true },
      { id: "2", reason: "Incomplete information", category: "data", isActive: true },
      { id: "3", reason: "Poor image quality", category: "media", isActive: true },
      { id: "4", reason: "Duplicate entry", category: "data", isActive: true },
      { id: "5", reason: "Other", category: "general", isActive: true },
    ]
  }

  async createRejectionReason(data: Omit<RejectionReason, "id">): Promise<RejectionReason> {
    throw new Error("Rejection reasons not yet implemented")
  }

  async updateRejectionReason(id: string, data: Partial<RejectionReason>): Promise<RejectionReason> {
    throw new Error("Rejection reasons not yet implemented")
  }

  async deleteRejectionReason(id: string): Promise<boolean> {
    throw new Error("Rejection reasons not yet implemented")
  }

  // Email Queue
  async queueEmail(data: Omit<EmailQueue, "id" | "createdAt">): Promise<EmailQueue> {
    throw new Error("Email queue not yet implemented")
  }

  async getQueuedEmails(): Promise<EmailQueue[]> {
    return []
  }

  async markEmailSent(id: string): Promise<boolean> {
    throw new Error("Email queue not yet implemented")
  }

  async markEmailFailed(id: string, error: string): Promise<boolean> {
    throw new Error("Email queue not yet implemented")
  }
}
