import { useState, useEffect } from "react"

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

export function useOverallStats() {
  const [stats, setStats] = useState<OverallStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
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
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  }
}
