"use client"

import { useEffect, useCallback } from 'react'
import { profileEventManager, ProfileUpdateEvent } from '@/lib/profile-events'

interface UseYearbookAutoRefreshOptions {
  schoolYearId: string
  department: string
  filters?: {
    yearLevel?: string
    courseProgram?: string
    blockSection?: string
  }
  onRefresh: () => void
  enabled?: boolean
}

/**
 * Custom hook that automatically refreshes yearbook data when profiles are approved or created
 */
export function useYearbookAutoRefresh({
  schoolYearId,
  department,
  filters,
  onRefresh,
  enabled = true
}: UseYearbookAutoRefreshOptions) {
  
  const handleProfileUpdate = useCallback((event: ProfileUpdateEvent) => {
    console.log('[useYearbookAutoRefresh] Received profile update event:', event)
    
    // Check if this event should trigger a refresh for this yearbook page
    const shouldRefresh = profileEventManager.shouldRefreshYearbook(
      event,
      schoolYearId,
      department,
      filters
    )
    
    if (shouldRefresh) {
      console.log('[useYearbookAutoRefresh] Refreshing yearbook data due to profile update')
      onRefresh()
    } else {
      console.log('[useYearbookAutoRefresh] Profile update does not affect this yearbook page')
    }
  }, [schoolYearId, department, filters, onRefresh])

  useEffect(() => {
    if (!enabled) {
      return
    }

    console.log('[useYearbookAutoRefresh] Setting up auto-refresh for:', {
      schoolYearId,
      department,
      filters
    })

    // Subscribe to both in-memory events and DOM events for cross-tab communication
    const unsubscribeMemory = profileEventManager.subscribe(
      `yearbook-${schoolYearId}-${department}`,
      handleProfileUpdate
    )
    
    const unsubscribeDOM = profileEventManager.subscribeToDOMEvents(handleProfileUpdate)

    return () => {
      console.log('[useYearbookAutoRefresh] Cleaning up auto-refresh listeners')
      unsubscribeMemory()
      unsubscribeDOM()
    }
  }, [schoolYearId, department, filters, handleProfileUpdate, enabled])

  return {
    // Expose the event manager for manual triggering if needed
    triggerRefresh: onRefresh
  }
}
