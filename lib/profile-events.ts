/**
 * Custom event system for profile updates
 * This enables real-time updates across the application when profiles are created or approved
 */

export interface ProfileUpdateEvent {
  type: 'profile_approved' | 'profile_created' | 'profile_updated'
  profileId: string
  schoolYearId: string
  department: string
  userType: string
  profileData?: any
}

export class ProfileEventManager {
  private static instance: ProfileEventManager
  private listeners: Map<string, Set<(event: ProfileUpdateEvent) => void>> = new Map()

  static getInstance(): ProfileEventManager {
    if (!ProfileEventManager.instance) {
      ProfileEventManager.instance = new ProfileEventManager()
    }
    return ProfileEventManager.instance
  }

  /**
   * Emit a profile update event
   */
  emit(event: ProfileUpdateEvent): void {
    console.log('[ProfileEventManager] Emitting event:', event)
    
    // Emit to all listeners
    this.listeners.forEach((listeners) => {
      listeners.forEach((listener) => {
        try {
          listener(event)
        } catch (error) {
          console.error('[ProfileEventManager] Error in listener:', error)
        }
      })
    })

    // Also emit as a custom DOM event for cross-tab communication
    if (typeof window !== 'undefined') {
      const customEvent = new CustomEvent('profileUpdate', {
        detail: event
      })
      window.dispatchEvent(customEvent)
    }
  }

  /**
   * Subscribe to profile update events
   */
  subscribe(
    key: string,
    listener: (event: ProfileUpdateEvent) => void
  ): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set())
    }
    
    this.listeners.get(key)!.add(listener)
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key)
      if (listeners) {
        listeners.delete(listener)
        if (listeners.size === 0) {
          this.listeners.delete(key)
        }
      }
    }
  }

  /**
   * Subscribe to DOM events for cross-tab communication
   */
  subscribeToDOMEvents(listener: (event: ProfileUpdateEvent) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {}
    }

    const handleEvent = (event: CustomEvent) => {
      listener(event.detail)
    }

    window.addEventListener('profileUpdate', handleEvent as EventListener)
    
    return () => {
      window.removeEventListener('profileUpdate', handleEvent as EventListener)
    }
  }

  /**
   * Check if a profile update affects a specific yearbook page
   */
  shouldRefreshYearbook(
    event: ProfileUpdateEvent,
    schoolYearId: string,
    department: string,
    filters?: {
      yearLevel?: string
      courseProgram?: string
      blockSection?: string
    }
  ): boolean {
    // Check if the event is for the same school year and department
    if (event.schoolYearId !== schoolYearId || event.department !== department) {
      return false
    }

    // If no filters, refresh for any profile in the department
    if (!filters) {
      return true
    }

    // For student profiles, check if they match the specific filters
    if (event.userType === 'student' && event.profileData) {
      const profile = event.profileData
      
      // Check year level
      if (filters.yearLevel && profile.yearLevel !== filters.yearLevel) {
        return false
      }
      
      // Check course program
      if (filters.courseProgram && profile.courseProgram !== filters.courseProgram) {
        return false
      }
      
      // Check block section
      if (filters.blockSection && profile.blockSection !== filters.blockSection) {
        return false
      }
    }

    return true
  }
}

// Export singleton instance
export const profileEventManager = ProfileEventManager.getInstance()

// Helper function to emit profile approval events
export function emitProfileApproved(
  profileId: string,
  schoolYearId: string,
  department: string,
  userType: string,
  profileData?: any
): void {
  profileEventManager.emit({
    type: 'profile_approved',
    profileId,
    schoolYearId,
    department,
    userType,
    profileData
  })
}

// Helper function to emit profile creation events
export function emitProfileCreated(
  profileId: string,
  schoolYearId: string,
  department: string,
  userType: string,
  profileData?: any
): void {
  profileEventManager.emit({
    type: 'profile_created',
    profileId,
    schoolYearId,
    department,
    userType,
    profileData
  })
}
