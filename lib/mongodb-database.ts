import { connectToDatabase, getDatabase } from './mongodb/connection'
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
} from './types'
import type { DatabaseConnection } from './database'

export class MongoDatabase implements DatabaseConnection {
  private async getCollection(collectionName: string) {
    const db = await connectToDatabase()
    return db.collection(collectionName)
  }

  // School Years
  async getSchoolYears(): Promise<SchoolYear[]> {
    const collection = await this.getCollection('school_years')
    const data = await collection.find({}).sort({ startDate: -1 }).toArray()
    
    return data.map((row) => ({
      id: row._id.toString(),
      yearLabel: row.yearLabel,
      startDate: new Date(row.startDate),
      endDate: new Date(row.endDate),
      isActive: row.isActive,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }))
  }

  async createSchoolYear(data: Omit<SchoolYear, 'id' | 'createdAt' | 'updatedAt'>): Promise<SchoolYear> {
    const collection = await this.getCollection('school_years')
    const now = new Date()
    const schoolYear = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await collection.insertOne(schoolYear)
    
    return {
      id: result.insertedId.toString(),
      ...schoolYear,
    }
  }

  async updateSchoolYear(id: string, data: Partial<SchoolYear>): Promise<SchoolYear> {
    const collection = await this.getCollection('school_years')
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      throw new Error('School year not found')
    }
    
    return {
      id: result._id.toString(),
      yearLabel: result.yearLabel,
      startDate: new Date(result.startDate),
      endDate: new Date(result.endDate),
      isActive: result.isActive,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    }
  }

  async deleteSchoolYear(id: string): Promise<boolean> {
    const collection = await this.getCollection('school_years')
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  // Users
  async getUsers(schoolYearId: string, filters?: any): Promise<User[]> {
    const collection = await this.getCollection('users')
    const query = { schoolYearId, ...filters }
    const data = await collection.find(query).toArray()
    
    return data.map((row) => ({
      id: row._id.toString(),
      email: row.email,
      name: row.name,
      role: row.role,
      schoolYearId: row.schoolYearId,
      isActive: row.isActive,
      lastLogin: row.lastLogin ? new Date(row.lastLogin) : null,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }))
  }

  async createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const collection = await this.getCollection('users')
    const now = new Date()
    const user = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await collection.insertOne(user)
    
    return {
      id: result.insertedId.toString(),
      ...user,
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const collection = await this.getCollection('users')
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      throw new Error('User not found')
    }
    
    return {
      id: result._id.toString(),
      email: result.email,
      name: result.name,
      role: result.role,
      schoolYearId: result.schoolYearId,
      isActive: result.isActive,
      lastLogin: result.lastLogin ? new Date(result.lastLogin) : null,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    const collection = await this.getCollection('users')
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount > 0) {
      // Also delete audit logs for this user
      try {
        const auditLogsDeleted = await this.deleteAuditLogsByUserId(id)
        console.log(`[MongoDB] Deleted user ${id} and ${auditLogsDeleted} associated audit logs`)
      } catch (auditError) {
        console.error(`[MongoDB] Error deleting audit logs for user ${id}:`, auditError)
        // Don't fail user deletion if audit log cleanup fails
      }
    }
    
    return result.deletedCount > 0
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection('users')
    const data = await collection.findOne({ email })
    
    if (!data) return null
    
    return {
      id: data._id.toString(),
      email: data.email,
      name: data.name,
      role: data.role,
      schoolYearId: data.schoolYearId,
      isActive: data.isActive,
      lastLogin: data.lastLogin ? new Date(data.lastLogin) : null,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  }

  // Profiles - Generic implementation for all profile types
  async getProfiles(schoolYearId: string, type: string, filters?: any): Promise<any[]> {
    const collection = await this.getCollection(`${type}_profiles`)
    const query = { schoolYearId, ...filters }
    const data = await collection.find(query).toArray()
    
    return data.map((row) => ({
      id: row._id.toString(),
      ...row,
    }))
  }

  async createProfile(type: string, data: any): Promise<any> {
    const collection = await this.getCollection(`${type}_profiles`)
    const now = new Date()
    const profile = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await collection.insertOne(profile)
    
    return {
      id: result.insertedId.toString(),
      ...profile,
    }
  }

  async updateProfile(id: string, type: string, data: any): Promise<any> {
    const collection = await this.getCollection(`${type}_profiles`)
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      throw new Error('Profile not found')
    }
    
    return {
      id: result._id.toString(),
      ...result,
    }
  }

  async deleteProfile(id: string, type: string): Promise<boolean> {
    const collection = await this.getCollection(`${type}_profiles`)
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async getProfileById(id: string, type: string): Promise<any | null> {
    const collection = await this.getCollection(`${type}_profiles`)
    const data = await collection.findOne({ _id: new ObjectId(id) })
    
    if (!data) return null
    
    return {
      id: data._id.toString(),
      ...data,
    }
  }

  // Albums and Photos
  async getAlbums(schoolYearId: string, filters?: any): Promise<Album[]> {
    const collection = await this.getCollection('albums')
    const query = { schoolYearId, ...filters }
    const data = await collection.find(query).toArray()
    
    return data.map((row) => ({
      id: row._id.toString(),
      title: row.title,
      description: row.description,
      coverImageUrl: row.coverImageUrl,
      privacy: row.privacy,
      tags: row.tags,
      schoolYearId: row.schoolYearId,
      createdBy: row.createdBy,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      photos: row.photos || [],
    }))
  }

  async createAlbum(data: Omit<Album, 'id' | 'createdAt' | 'updatedAt' | 'photos'>): Promise<Album> {
    const collection = await this.getCollection('albums')
    const now = new Date()
    const album = {
      ...data,
      photos: [],
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await collection.insertOne(album)
    
    return {
      id: result.insertedId.toString(),
      ...album,
    }
  }

  async updateAlbum(id: string, data: Partial<Album>): Promise<Album> {
    const collection = await this.getCollection('albums')
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      throw new Error('Album not found')
    }
    
    return {
      id: result._id.toString(),
      title: result.title,
      description: result.description,
      coverImageUrl: result.coverImageUrl,
      privacy: result.privacy,
      tags: result.tags,
      schoolYearId: result.schoolYearId,
      createdBy: result.createdBy,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
      photos: result.photos || [],
    }
  }

  async deleteAlbum(id: string): Promise<boolean> {
    const collection = await this.getCollection('albums')
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  async getPhotos(albumId: string): Promise<Photo[]> {
    const collection = await this.getCollection('photos')
    const data = await collection.find({ albumId }).toArray()
    
    return data.map((row) => ({
      id: row._id.toString(),
      albumId: row.albumId,
      filename: row.filename,
      url: row.url,
      thumbnailUrl: row.thumbnailUrl,
      caption: row.caption,
      photographer: row.photographer,
      dateTaken: row.dateTaken ? new Date(row.dateTaken) : undefined,
      location: row.location,
      visibility: row.visibility,
      orderIndex: row.orderIndex,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }))
  }

  async createPhoto(data: Omit<Photo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Photo> {
    const collection = await this.getCollection('photos')
    const now = new Date()
    const photo = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await collection.insertOne(photo)
    
    return {
      id: result.insertedId.toString(),
      ...photo,
    }
  }

  async updatePhoto(id: string, data: Partial<Photo>): Promise<Photo> {
    const collection = await this.getCollection('photos')
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      throw new Error('Photo not found')
    }
    
    return {
      id: result._id.toString(),
      albumId: result.albumId,
      filename: result.filename,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      caption: result.caption,
      photographer: result.photographer,
      dateTaken: result.dateTaken ? new Date(result.dateTaken) : undefined,
      location: result.location,
      visibility: result.visibility,
      orderIndex: result.orderIndex,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    }
  }

  async deletePhoto(id: string): Promise<boolean> {
    const collection = await this.getCollection('photos')
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  // Moderation
  async getModerationItems(schoolYearId: string, filters?: any): Promise<ModerationItem[]> {
    const collection = await this.getCollection('moderation_items')
    const query = { schoolYearId, ...filters }
    const data = await collection.find(query).toArray()
    
    return data.map((row) => ({
      id: row._id.toString(),
      type: row.type,
      targetId: row.targetId,
      targetType: row.targetType,
      submittedBy: row.submittedBy,
      status: row.status,
      schoolYearId: row.schoolYearId,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      moderatedBy: row.moderatedBy,
      moderatedAt: row.moderatedAt ? new Date(row.moderatedAt) : undefined,
      rejectionReasons: row.rejectionReasons,
      customReason: row.customReason,
    }))
  }

  async createModerationItem(data: Omit<ModerationItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ModerationItem> {
    const collection = await this.getCollection('moderation_items')
    const now = new Date()
    const item = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await collection.insertOne(item)
    
    return {
      id: result.insertedId.toString(),
      ...item,
    }
  }

  async updateModerationItem(id: string, data: Partial<ModerationItem>): Promise<ModerationItem> {
    const collection = await this.getCollection('moderation_items')
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      throw new Error('Moderation item not found')
    }
    
    return {
      id: result._id.toString(),
      type: result.type,
      targetId: result.targetId,
      targetType: result.targetType,
      submittedBy: result.submittedBy,
      status: result.status,
      schoolYearId: result.schoolYearId,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
      moderatedBy: result.moderatedBy,
      moderatedAt: result.moderatedAt ? new Date(result.moderatedAt) : undefined,
      rejectionReasons: result.rejectionReasons,
      customReason: result.customReason,
    }
  }

  // Reports
  async getReports(schoolYearId: string, filters?: any): Promise<Report[]> {
    const collection = await this.getCollection('reports')
    const query = { schoolYearId, ...filters }
    const data = await collection.find(query).toArray()
    
    return data.map((row) => ({
      id: row._id.toString(),
      reporterId: row.reporterId,
      targetType: row.targetType,
      targetId: row.targetId,
      message: row.message,
      attachments: row.attachments,
      status: row.status,
      schoolYearId: row.schoolYearId,
      createdAt: new Date(row.createdAt),
      resolvedBy: row.resolvedBy,
      resolvedAt: row.resolvedAt ? new Date(row.resolvedAt) : undefined,
      resolutionNotes: row.resolutionNotes,
    }))
  }

  async createReport(data: Omit<Report, 'id' | 'createdAt'>): Promise<Report> {
    const collection = await this.getCollection('reports')
    const now = new Date()
    const report = {
      ...data,
      createdAt: now,
    }
    
    const result = await collection.insertOne(report)
    
    return {
      id: result.insertedId.toString(),
      ...report,
    }
  }

  async updateReport(id: string, data: Partial<Report>): Promise<Report> {
    const collection = await this.getCollection('reports')
    const updateData = {
      ...data,
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      throw new Error('Report not found')
    }
    
    return {
      id: result._id.toString(),
      reporterId: result.reporterId,
      targetType: result.targetType,
      targetId: result.targetId,
      message: result.message,
      attachments: result.attachments,
      status: result.status,
      schoolYearId: result.schoolYearId,
      createdAt: new Date(result.createdAt),
      resolvedBy: result.resolvedBy,
      resolvedAt: result.resolvedAt ? new Date(result.resolvedAt) : undefined,
      resolutionNotes: result.resolutionNotes,
    }
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    const collection = await this.getCollection('notifications')
    const data = await collection.find({ userId }).toArray()
    
    return data.map((row) => ({
      id: row._id.toString(),
      userId: row.userId,
      type: row.type,
      title: row.title,
      message: row.message,
      data: row.data,
      read: row.read,
      createdAt: new Date(row.createdAt),
    }))
  }

  async createNotification(data: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const collection = await this.getCollection('notifications')
    const now = new Date()
    const notification = {
      ...data,
      createdAt: now,
    }
    
    const result = await collection.insertOne(notification)
    
    return {
      id: result.insertedId.toString(),
      ...notification,
    }
  }

  async markNotificationRead(id: string): Promise<boolean> {
    const collection = await this.getCollection('notifications')
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { read: true } }
    )
    return result.modifiedCount > 0
  }

  // Audit Logs
  async createAuditLog(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    const collection = await this.getCollection('audit_logs')
    const now = new Date()
    const log = {
      ...data,
      createdAt: now,
    }
    
    const result = await collection.insertOne(log)
    
    return {
      id: result.insertedId.toString(),
      ...log,
    }
  }

  async getAuditLogs(schoolYearId: string, filters?: any): Promise<AuditLog[]> {
    const collection = await this.getCollection('audit_logs')
    const query = { schoolYearId, ...filters }
    const data = await collection.find(query).sort({ createdAt: -1 }).toArray()
    
    return data.map((row) => ({
      id: row._id.toString(),
      userId: row.userId,
      action: row.action,
      targetType: row.targetType,
      targetId: row.targetId,
      details: row.details,
      ipAddress: row.ipAddress,
      userAgent: row.userAgent,
      schoolYearId: row.schoolYearId,
      createdAt: new Date(row.createdAt),
    }))
  }

  async deleteAuditLogsByUserId(userId: string): Promise<number> {
    const collection = await this.getCollection('audit_logs')
    const result = await collection.deleteMany({ userId })
    console.log(`[MongoDB] Deleted ${result.deletedCount} audit logs for user ${userId}`)
    return result.deletedCount
  }

  // School History
  async getSchoolHistory(schoolYearId: string): Promise<SchoolHistory | null> {
    const collection = await this.getCollection('school_histories')
    const data = await collection.findOne({ schoolYearId })
    
    if (!data) return null
    
    return {
      id: data._id.toString(),
      schoolYearId: data.schoolYearId,
      title: data.title,
      content: data.content,
      version: data.version,
      createdBy: data.createdBy,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      isPublished: data.isPublished,
    }
  }

  async createOrUpdateSchoolHistory(
    data: Omit<SchoolHistory, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<SchoolHistory> {
    const collection = await this.getCollection('school_histories')
    const now = new Date()
    
    const result = await collection.findOneAndUpdate(
      { schoolYearId: data.schoolYearId },
      {
        $set: {
          ...data,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true, returnDocument: 'after' }
    )
    
    return {
      id: result._id.toString(),
      schoolYearId: result.schoolYearId,
      title: result.title,
      content: result.content,
      version: result.version,
      createdBy: result.createdBy,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
      isPublished: result.isPublished,
    }
  }

  // Rejection Reasons
  async getRejectionReasons(schoolYearId?: string): Promise<RejectionReason[]> {
    const collection = await this.getCollection('rejection_reasons')
    const query = { isActive: true }
    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }
    
    const data = await collection.find(query).toArray()
    
    return data.map((row) => ({
      id: row._id.toString(),
      reason: row.reason,
      category: row.category,
      isActive: row.isActive,
      schoolYearId: row.schoolYearId,
    }))
  }

  async createRejectionReason(data: Omit<RejectionReason, 'id'>): Promise<RejectionReason> {
    const collection = await this.getCollection('rejection_reasons')
    const reason = {
      ...data,
    }
    
    const result = await collection.insertOne(reason)
    
    return {
      id: result.insertedId.toString(),
      ...reason,
    }
  }

  async updateRejectionReason(id: string, data: Partial<RejectionReason>): Promise<RejectionReason> {
    const collection = await this.getCollection('rejection_reasons')
    const updateData = {
      ...data,
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    if (!result) {
      throw new Error('Rejection reason not found')
    }
    
    return {
      id: result._id.toString(),
      reason: result.reason,
      category: result.category,
      isActive: result.isActive,
      schoolYearId: result.schoolYearId,
    }
  }

  async deleteRejectionReason(id: string): Promise<boolean> {
    const collection = await this.getCollection('rejection_reasons')
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  // Email Queue
  async queueEmail(data: Omit<EmailQueue, 'id' | 'createdAt'>): Promise<EmailQueue> {
    const collection = await this.getCollection('email_queue')
    const now = new Date()
    const email = {
      ...data,
      createdAt: now,
    }
    
    const result = await collection.insertOne(email)
    
    return {
      id: result.insertedId.toString(),
      ...email,
    }
  }

  async getQueuedEmails(): Promise<EmailQueue[]> {
    const collection = await this.getCollection('email_queue')
    const data = await collection.find({ status: 'pending' }).toArray()
    
    return data.map((row) => ({
      id: row._id.toString(),
      to: row.to,
      subject: row.subject,
      body: row.body,
      type: row.type,
      status: row.status,
      createdAt: new Date(row.createdAt),
      sentAt: row.sentAt ? new Date(row.sentAt) : undefined,
      error: row.error,
    }))
  }

  async markEmailSent(id: string): Promise<boolean> {
    const collection = await this.getCollection('email_queue')
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'sent', sentAt: new Date() } }
    )
    return result.modifiedCount > 0
  }

  async markEmailFailed(id: string, error: string): Promise<boolean> {
    const collection = await this.getCollection('email_queue')
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'failed', error } }
    )
    return result.modifiedCount > 0
  }
}

// Import ObjectId from mongodb
import { ObjectId } from 'mongodb'
