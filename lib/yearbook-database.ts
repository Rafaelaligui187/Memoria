import { connectToDatabase } from './mongodb/connection'
import { ObjectId } from 'mongodb'
import {
  BaseYearbookEntry,
  CollegeYearbookEntry,
  SeniorHighYearbookEntry,
  JuniorHighYearbookEntry,
  ElementaryYearbookEntry,
  AlumniYearbookEntry,
  FacultyStaffYearbookEntry,
  SchoolYearSchema,
  YEARBOOK_COLLECTIONS,
  DEPARTMENT_TO_COLLECTION,
  YearbookEntry,
  Department,
  YEARBOOK_VALIDATION_SCHEMAS
} from './yearbook-schemas'

export class YearbookDatabase {
  private async getCollection(collectionName: string) {
    const db = await connectToDatabase()
    return db.collection(collectionName)
  }

  // School Year Management
  async createSchoolYear(data: Omit<SchoolYearSchema, '_id' | 'createdAt' | 'updatedAt'>): Promise<SchoolYearSchema> {
    const collection = await this.getCollection(YEARBOOK_COLLECTIONS.SCHOOL_YEARS)
    const now = new Date()
    const schoolYear: SchoolYearSchema = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await collection.insertOne(schoolYear)
    
    return {
      ...schoolYear,
      _id: result.insertedId,
    }
  }

  async getSchoolYears(): Promise<SchoolYearSchema[]> {
    const collection = await this.getCollection(YEARBOOK_COLLECTIONS.SCHOOL_YEARS)
    const data = await collection.find({}).sort({ startDate: -1 }).toArray()
    
    return data.map((row) => ({
      _id: row._id,
      yearLabel: row.yearLabel,
      startDate: new Date(row.startDate),
      endDate: new Date(row.endDate),
      isActive: row.isActive,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }))
  }

  async getActiveSchoolYear(): Promise<SchoolYearSchema | null> {
    const collection = await this.getCollection(YEARBOOK_COLLECTIONS.SCHOOL_YEARS)
    const data = await collection.findOne({ isActive: true })
    
    if (!data) return null
    
    return {
      _id: data._id,
      yearLabel: data.yearLabel,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      isActive: data.isActive,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    }
  }

  async updateSchoolYear(id: string, data: Partial<SchoolYearSchema>): Promise<SchoolYearSchema> {
    const collection = await this.getCollection(YEARBOOK_COLLECTIONS.SCHOOL_YEARS)
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
      yearLabel: result.yearLabel,
      startDate: new Date(result.startDate),
      endDate: new Date(result.endDate),
      isActive: result.isActive,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
      _id: result._id,
    }
  }

  async deleteSchoolYear(id: string): Promise<boolean> {
    const collection = await this.getCollection(YEARBOOK_COLLECTIONS.SCHOOL_YEARS)
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  // Yearbook Entry Management
  async createYearbookEntry(
    department: Department,
    data: Omit<YearbookEntry, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<YearbookEntry> {
    const collectionName = DEPARTMENT_TO_COLLECTION[department]
    const collection = await this.getCollection(collectionName)
    
    // Validate required fields
    this.validateYearbookEntry(collectionName, data)
    
    const now = new Date()
    const entry = {
      ...data,
      status: 'pending' as const,
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await collection.insertOne(entry)
    
    return {
      ...entry,
      _id: result.insertedId,
    } as YearbookEntry
  }

  async getYearbookEntries(
    department: Department,
    schoolYearId: string,
    filters?: any
  ): Promise<YearbookEntry[]> {
    const collectionName = DEPARTMENT_TO_COLLECTION[department]
    const collection = await this.getCollection(collectionName)
    const query = { schoolYearId, ...filters }
    const data = await collection.find(query).toArray()
    
    return data.map((row) => ({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      birthday: row.birthday ? new Date(row.birthday) : undefined,
    })) as YearbookEntry[]
  }

  async getYearbookEntryById(
    department: Department,
    id: string
  ): Promise<YearbookEntry | null> {
    const collectionName = DEPARTMENT_TO_COLLECTION[department]
    const collection = await this.getCollection(collectionName)
    const data = await collection.findOne({ _id: new ObjectId(id) })
    
    if (!data) return null
    
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      birthday: data.birthday ? new Date(data.birthday) : undefined,
    } as YearbookEntry
  }

  async updateYearbookEntry(
    department: Department,
    id: string,
    data: Partial<YearbookEntry>
  ): Promise<YearbookEntry> {
    const collectionName = DEPARTMENT_TO_COLLECTION[department]
    const collection = await this.getCollection(collectionName)
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
      throw new Error('Yearbook entry not found')
    }
    
    return {
      ...result,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
      birthday: result.birthday ? new Date(result.birthday) : undefined,
    } as YearbookEntry
  }

  async deleteYearbookEntry(department: Department, id: string): Promise<boolean> {
    const collectionName = DEPARTMENT_TO_COLLECTION[department]
    const collection = await this.getCollection(collectionName)
    const result = await collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  // Validation Methods
  private validateYearbookEntry(collectionName: string, data: any): void {
    const validationSchema = YEARBOOK_VALIDATION_SCHEMAS[collectionName]
    if (!validationSchema) {
      throw new Error(`No validation schema found for collection: ${collectionName}`)
    }

    const missingFields = validationSchema.requiredFields.filter(
      field => data[field] === undefined || data[field] === null || data[field] === ''
    )

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    // Validate schoolYearId exists
    if (data.schoolYearId) {
      this.validateSchoolYearExists(data.schoolYearId)
    }
  }

  private async validateSchoolYearExists(schoolYearId: string): Promise<void> {
    const collection = await this.getCollection(YEARBOOK_COLLECTIONS.SCHOOL_YEARS)
    const schoolYear = await collection.findOne({ _id: new ObjectId(schoolYearId) })
    
    if (!schoolYear) {
      throw new Error(`School year with ID ${schoolYearId} not found`)
    }
  }

  // Department-specific methods
  async getEntriesByDepartment(department: Department, schoolYearId: string): Promise<YearbookEntry[]> {
    return this.getYearbookEntries(department, schoolYearId)
  }

  async getEntriesByStatus(
    department: Department,
    schoolYearId: string,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<YearbookEntry[]> {
    return this.getYearbookEntries(department, schoolYearId, { status })
  }

  async getEntriesByYearLevel(
    department: Department,
    schoolYearId: string,
    yearLevel: string
  ): Promise<YearbookEntry[]> {
    return this.getYearbookEntries(department, schoolYearId, { yearLevel })
  }

  async getEntriesByCourseProgram(
    department: Department,
    schoolYearId: string,
    courseProgram: string
  ): Promise<YearbookEntry[]> {
    return this.getYearbookEntries(department, schoolYearId, { courseProgram })
  }

  async getEntriesByBlockSection(
    department: Department,
    schoolYearId: string,
    blockSection: string
  ): Promise<YearbookEntry[]> {
    return this.getYearbookEntries(department, schoolYearId, { blockSection })
  }

  // Statistics and Analytics
  async getYearbookStatistics(schoolYearId: string): Promise<Record<string, any>> {
    const stats: Record<string, any> = {}
    
    for (const [department, collectionName] of Object.entries(DEPARTMENT_TO_COLLECTION)) {
      const collection = await this.getCollection(collectionName)
      
      const total = await collection.countDocuments({ schoolYearId })
      const pending = await collection.countDocuments({ schoolYearId, status: 'pending' })
      const approved = await collection.countDocuments({ schoolYearId, status: 'approved' })
      const rejected = await collection.countDocuments({ schoolYearId, status: 'rejected' })
      
      stats[department] = {
        total,
        pending,
        approved,
        rejected,
        approvalRate: total > 0 ? (approved / total) * 100 : 0
      }
    }
    
    return stats
  }

  // Bulk Operations
  async bulkCreateYearbookEntries(
    department: Department,
    entries: Omit<YearbookEntry, '_id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<YearbookEntry[]> {
    const collectionName = DEPARTMENT_TO_COLLECTION[department]
    const collection = await this.getCollection(collectionName)
    
    // Validate all entries
    for (const entry of entries) {
      this.validateYearbookEntry(collectionName, entry)
    }
    
    const now = new Date()
    const entriesWithTimestamps = entries.map(entry => ({
      ...entry,
      status: 'pending' as const,
      createdAt: now,
      updatedAt: now,
    }))
    
    const result = await collection.insertMany(entriesWithTimestamps)
    
    return entriesWithTimestamps.map((entry, index) => ({
      ...entry,
      _id: result.insertedIds[index],
    })) as YearbookEntry[]
  }

  async bulkUpdateYearbookEntries(
    department: Department,
    updates: Array<{ id: string; data: Partial<YearbookEntry> }>
  ): Promise<YearbookEntry[]> {
    const collectionName = DEPARTMENT_TO_COLLECTION[department]
    const collection = await this.getCollection(collectionName)
    
    const results: YearbookEntry[] = []
    
    for (const update of updates) {
      try {
        const result = await this.updateYearbookEntry(department, update.id, update.data)
        results.push(result)
      } catch (error) {
        console.error(`Failed to update entry ${update.id}:`, error)
      }
    }
    
    return results
  }

  // Search and Filter
  async searchYearbookEntries(
    department: Department,
    schoolYearId: string,
    searchTerm: string,
    filters?: any
  ): Promise<YearbookEntry[]> {
    const collectionName = DEPARTMENT_TO_COLLECTION[department]
    const collection = await this.getCollection(collectionName)
    
    const searchQuery = {
      schoolYearId,
      $or: [
        { fullName: { $regex: searchTerm, $options: 'i' } },
        { nickname: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { courseProgram: { $regex: searchTerm, $options: 'i' } },
        { blockSection: { $regex: searchTerm, $options: 'i' } },
      ],
      ...filters
    }
    
    const data = await collection.find(searchQuery).toArray()
    
    return data.map((row) => ({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      birthday: row.birthday ? new Date(row.birthday) : undefined,
    })) as YearbookEntry[]
  }
}

// Export singleton instance
export const yearbookDb = new YearbookDatabase()
