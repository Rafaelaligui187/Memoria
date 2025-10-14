import { yearbookDb } from './yearbook-database'
import { Department, YearbookEntry, YEARBOOK_COLLECTIONS, DEPARTMENT_TO_COLLECTION } from './yearbook-schemas'

export interface CreateYearbookEntryRequest {
  department: Department
  schoolYearId: string
  data: Omit<YearbookEntry, '_id' | 'schoolYearId' | 'status' | 'createdAt' | 'updatedAt'>
}

export interface UpdateYearbookEntryRequest {
  department: Department
  id: string
  data: Partial<YearbookEntry>
}

export interface YearbookEntryResponse {
  success: boolean
  data?: YearbookEntry
  message?: string
  error?: string
}

export interface YearbookEntriesResponse {
  success: boolean
  data?: YearbookEntry[]
  message?: string
  error?: string
  total?: number
}

export class YearbookService {
  /**
   * Create a new yearbook entry
   */
  async createYearbookEntry(request: CreateYearbookEntryRequest): Promise<YearbookEntryResponse> {
    try {
      // Validate department
      if (!this.isValidDepartment(request.department)) {
        return {
          success: false,
          error: `Invalid department: ${request.department}. Must be one of: ${Object.keys(DEPARTMENT_TO_COLLECTION).join(', ')}`
        }
      }

      // Validate school year exists
      const schoolYears = await yearbookDb.getSchoolYears()
      const schoolYearExists = schoolYears.some(sy => sy._id?.toString() === request.schoolYearId)
      
      if (!schoolYearExists) {
        return {
          success: false,
          error: `School year with ID ${request.schoolYearId} not found`
        }
      }

      // Check for duplicate email in the same school year and department
      const existingEntries = await yearbookDb.getYearbookEntries(
        request.department,
        request.schoolYearId,
        { email: request.data.email }
      )

      if (existingEntries.length > 0) {
        return {
          success: false,
          error: `Email ${request.data.email} already exists in ${request.department} for this school year`
        }
      }

      // Create the entry
      const entry = await yearbookDb.createYearbookEntry(request.department, {
        ...request.data,
        schoolYearId: request.schoolYearId,
        status: 'pending'
      })

      return {
        success: true,
        data: entry,
        message: `${request.department} yearbook entry created successfully`
      }

    } catch (error) {
      console.error('Error creating yearbook entry:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get yearbook entries by department and school year
   */
  async getYearbookEntries(
    department: Department,
    schoolYearId: string,
    filters?: any
  ): Promise<YearbookEntriesResponse> {
    try {
      if (!this.isValidDepartment(department)) {
        return {
          success: false,
          error: `Invalid department: ${department}`
        }
      }

      const entries = await yearbookDb.getYearbookEntries(department, schoolYearId, filters)

      return {
        success: true,
        data: entries,
        total: entries.length,
        message: `Found ${entries.length} entries in ${department}`
      }

    } catch (error) {
      console.error('Error getting yearbook entries:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get a specific yearbook entry by ID
   */
  async getYearbookEntryById(
    department: Department,
    id: string
  ): Promise<YearbookEntryResponse> {
    try {
      if (!this.isValidDepartment(department)) {
        return {
          success: false,
          error: `Invalid department: ${department}`
        }
      }

      const entry = await yearbookDb.getYearbookEntryById(department, id)

      if (!entry) {
        return {
          success: false,
          error: 'Yearbook entry not found'
        }
      }

      return {
        success: true,
        data: entry,
        message: 'Yearbook entry retrieved successfully'
      }

    } catch (error) {
      console.error('Error getting yearbook entry:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Update a yearbook entry
   */
  async updateYearbookEntry(request: UpdateYearbookEntryRequest): Promise<YearbookEntryResponse> {
    try {
      if (!this.isValidDepartment(request.department)) {
        return {
          success: false,
          error: `Invalid department: ${request.department}`
        }
      }

      // Check if entry exists
      const existingEntry = await yearbookDb.getYearbookEntryById(request.department, request.id)
      if (!existingEntry) {
        return {
          success: false,
          error: 'Yearbook entry not found'
        }
      }

      // If email is being updated, check for duplicates
      if (request.data.email && request.data.email !== existingEntry.email) {
        const duplicateEntries = await yearbookDb.getYearbookEntries(
          request.department,
          existingEntry.schoolYearId,
          { email: request.data.email }
        )

        if (duplicateEntries.length > 0) {
          return {
            success: false,
            error: `Email ${request.data.email} already exists in ${request.department} for this school year`
          }
        }
      }

      const updatedEntry = await yearbookDb.updateYearbookEntry(
        request.department,
        request.id,
        request.data
      )

      return {
        success: true,
        data: updatedEntry,
        message: 'Yearbook entry updated successfully'
      }

    } catch (error) {
      console.error('Error updating yearbook entry:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Delete a yearbook entry
   */
  async deleteYearbookEntry(department: Department, id: string): Promise<YearbookEntryResponse> {
    try {
      if (!this.isValidDepartment(department)) {
        return {
          success: false,
          error: `Invalid department: ${department}`
        }
      }

      const deleted = await yearbookDb.deleteYearbookEntry(department, id)

      if (!deleted) {
        return {
          success: false,
          error: 'Yearbook entry not found'
        }
      }

      return {
        success: true,
        message: 'Yearbook entry deleted successfully'
      }

    } catch (error) {
      console.error('Error deleting yearbook entry:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get entries by status
   */
  async getEntriesByStatus(
    department: Department,
    schoolYearId: string,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<YearbookEntriesResponse> {
    try {
      if (!this.isValidDepartment(department)) {
        return {
          success: false,
          error: `Invalid department: ${department}`
        }
      }

      const entries = await yearbookDb.getEntriesByStatus(department, schoolYearId, status)

      return {
        success: true,
        data: entries,
        total: entries.length,
        message: `Found ${entries.length} ${status} entries in ${department}`
      }

    } catch (error) {
      console.error('Error getting entries by status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get entries by year level
   */
  async getEntriesByYearLevel(
    department: Department,
    schoolYearId: string,
    yearLevel: string
  ): Promise<YearbookEntriesResponse> {
    try {
      if (!this.isValidDepartment(department)) {
        return {
          success: false,
          error: `Invalid department: ${department}`
        }
      }

      const entries = await yearbookDb.getEntriesByYearLevel(department, schoolYearId, yearLevel)

      return {
        success: true,
        data: entries,
        total: entries.length,
        message: `Found ${entries.length} entries in ${yearLevel}`
      }

    } catch (error) {
      console.error('Error getting entries by year level:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get entries by course program
   */
  async getEntriesByCourseProgram(
    department: Department,
    schoolYearId: string,
    courseProgram: string
  ): Promise<YearbookEntriesResponse> {
    try {
      if (!this.isValidDepartment(department)) {
        return {
          success: false,
          error: `Invalid department: ${department}`
        }
      }

      const entries = await yearbookDb.getEntriesByCourseProgram(department, schoolYearId, courseProgram)

      return {
        success: true,
        data: entries,
        total: entries.length,
        message: `Found ${entries.length} entries in ${courseProgram}`
      }

    } catch (error) {
      console.error('Error getting entries by course program:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get entries by block section
   */
  async getEntriesByBlockSection(
    department: Department,
    schoolYearId: string,
    blockSection: string
  ): Promise<YearbookEntriesResponse> {
    try {
      if (!this.isValidDepartment(department)) {
        return {
          success: false,
          error: `Invalid department: ${department}`
        }
      }

      const entries = await yearbookDb.getEntriesByBlockSection(department, schoolYearId, blockSection)

      return {
        success: true,
        data: entries,
        total: entries.length,
        message: `Found ${entries.length} entries in ${blockSection}`
      }

    } catch (error) {
      console.error('Error getting entries by block section:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Search yearbook entries
   */
  async searchYearbookEntries(
    department: Department,
    schoolYearId: string,
    searchTerm: string,
    filters?: any
  ): Promise<YearbookEntriesResponse> {
    try {
      if (!this.isValidDepartment(department)) {
        return {
          success: false,
          error: `Invalid department: ${department}`
        }
      }

      const entries = await yearbookDb.searchYearbookEntries(department, schoolYearId, searchTerm, filters)

      return {
        success: true,
        data: entries,
        total: entries.length,
        message: `Found ${entries.length} entries matching "${searchTerm}"`
      }

    } catch (error) {
      console.error('Error searching yearbook entries:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get yearbook statistics
   */
  async getYearbookStatistics(schoolYearId: string): Promise<{
    success: boolean
    data?: Record<string, any>
    error?: string
  }> {
    try {
      const stats = await yearbookDb.getYearbookStatistics(schoolYearId)

      return {
        success: true,
        data: stats
      }

    } catch (error) {
      console.error('Error getting yearbook statistics:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Bulk create yearbook entries
   */
  async bulkCreateYearbookEntries(
    department: Department,
    entries: Omit<YearbookEntry, '_id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<YearbookEntriesResponse> {
    try {
      if (!this.isValidDepartment(department)) {
        return {
          success: false,
          error: `Invalid department: ${department}`
        }
      }

      const createdEntries = await yearbookDb.bulkCreateYearbookEntries(department, entries)

      return {
        success: true,
        data: createdEntries,
        total: createdEntries.length,
        message: `Successfully created ${createdEntries.length} entries in ${department}`
      }

    } catch (error) {
      console.error('Error bulk creating yearbook entries:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Bulk update yearbook entries
   */
  async bulkUpdateYearbookEntries(
    department: Department,
    updates: Array<{ id: string; data: Partial<YearbookEntry> }>
  ): Promise<YearbookEntriesResponse> {
    try {
      if (!this.isValidDepartment(department)) {
        return {
          success: false,
          error: `Invalid department: ${department}`
        }
      }

      const updatedEntries = await yearbookDb.bulkUpdateYearbookEntries(department, updates)

      return {
        success: true,
        data: updatedEntries,
        total: updatedEntries.length,
        message: `Successfully updated ${updatedEntries.length} entries in ${department}`
      }

    } catch (error) {
      console.error('Error bulk updating yearbook entries:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get all school years
   */
  async getSchoolYears(): Promise<{
    success: boolean
    data?: any[]
    error?: string
  }> {
    try {
      const schoolYears = await yearbookDb.getSchoolYears()

      return {
        success: true,
        data: schoolYears
      }

    } catch (error) {
      console.error('Error getting school years:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Get active school year
   */
  async getActiveSchoolYear(): Promise<{
    success: boolean
    data?: any
    error?: string
  }> {
    try {
      const activeSchoolYear = await yearbookDb.getActiveSchoolYear()

      if (!activeSchoolYear) {
        return {
          success: false,
          error: 'No active school year found'
        }
      }

      return {
        success: true,
        data: activeSchoolYear
      }

    } catch (error) {
      console.error('Error getting active school year:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Create school year
   */
  async createSchoolYear(data: {
    yearLabel: string
    startDate: Date
    endDate: Date
    isActive: boolean
  }): Promise<{
    success: boolean
    data?: any
    error?: string
  }> {
    try {
      const schoolYear = await yearbookDb.createSchoolYear(data)

      return {
        success: true,
        data: schoolYear
      }

    } catch (error) {
      console.error('Error creating school year:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Update school year
   */
  async updateSchoolYear(id: string, data: {
    yearLabel?: string
    startDate?: Date
    endDate?: Date
    isActive?: boolean
  }): Promise<{
    success: boolean
    data?: any
    error?: string
  }> {
    try {
      const schoolYear = await yearbookDb.updateSchoolYear(id, data)

      return {
        success: true,
        data: schoolYear
      }

    } catch (error) {
      console.error('Error updating school year:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Delete school year
   */
  async deleteSchoolYear(id: string): Promise<{
    success: boolean
    error?: string
  }> {
    try {
      const deleted = await yearbookDb.deleteSchoolYear(id)

      if (!deleted) {
        return {
          success: false,
          error: 'School year not found'
        }
      }

      return {
        success: true
      }

    } catch (error) {
      console.error('Error deleting school year:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Validate if department is valid
   */
  private isValidDepartment(department: string): department is Department {
    return department in DEPARTMENT_TO_COLLECTION
  }

  /**
   * Get department collection name
   */
  getDepartmentCollectionName(department: Department): string {
    return DEPARTMENT_TO_COLLECTION[department]
  }

  /**
   * Get all available departments
   */
  getAvailableDepartments(): Department[] {
    return Object.keys(DEPARTMENT_TO_COLLECTION) as Department[]
  }
}

// Export singleton instance
export const yearbookService = new YearbookService()
