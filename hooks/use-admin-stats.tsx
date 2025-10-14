"use client"

import { useState, useEffect } from 'react'

interface AdminStatsData {
  totalApprovedCount: number
  totalPendingCount: number
  totalMediaItems: number
  totalOpenReports: number
  pendingApprovals: Array<{
    _id: string
    fullName: string
    email: string
    department: string
    createdAt: string
    status: string
  }>
  recentApprovals: Array<{
    _id: string
    fullName: string
    email: string
    department: string
    reviewedAt: string
    status: string
  }>
}

interface AdminStatsHook {
  stats: AdminStatsData | null
  loading: boolean
  error: string | null
  refreshStats: () => Promise<void>
}

export function useAdminStats(schoolYearId: string): AdminStatsHook {
  const [stats, setStats] = useState<AdminStatsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    if (!schoolYearId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/stats?schoolYearId=${schoolYearId}`)
      const result = await response.json()

      if (result.success) {
        setStats(result.data)
      } else {
        setError(result.error || 'Failed to fetch statistics')
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err)
      setError('Failed to fetch statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [schoolYearId])

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  }
}
