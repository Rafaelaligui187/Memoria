import { useState, useEffect, useCallback } from "react"

interface OverallStatsData {
  totalApprovedCount: number
  totalPendingCount: number
  totalRejectedCount: number
  totalMediaItems: number
  totalOpenReports: number
  totalSchoolYears: number
  schoolYearStats: Array<{
    yearId: string
    yearLabel: string
    isActive: boolean
    approvedCount: number
    pendingCount: number
    rejectedCount: number
    mediaItems: number
  }>
}

// Cache for stats data
let cachedStats: OverallStatsData | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useOverallStats() {
  const [stats, setStats] = useState<OverallStatsData | null>(cachedStats)
  const [loading, setLoading] = useState(!cachedStats)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (forceRefresh = false) => {
    const now = Date.now()
    
    // Use cache if available and not expired, unless force refresh
    if (!forceRefresh && cachedStats && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('[Overall Stats Hook] Using cached data')
      setStats(cachedStats)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      console.log('[Overall Stats Hook] Fetching fresh data from API')
      
      const response = await fetch('/api/admin/overall-stats', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      const result = await response.json()
      
      console.log('[Overall Stats Hook] API Response:', result)
      
      if (result.success) {
        console.log('[Overall Stats Hook] Setting stats:', result.data)
        setStats(result.data)
        
        // Update cache
        cachedStats = result.data
        cacheTimestamp = now
      } else {
        console.error('[Overall Stats Hook] API Error:', result.message)
        setError(result.message || 'Failed to fetch overall statistics')
      }
    } catch (err) {
      console.error('Error fetching overall stats:', err)
      setError('Failed to fetch overall statistics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refreshStats: () => fetchStats(true)
  }
}
