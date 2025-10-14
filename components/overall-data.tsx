"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Clock, 
  XCircle, 
  ImageIcon, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  CheckCircle
} from "lucide-react"
import { useOverallStats } from "@/hooks/use-overall-stats"
import { useEffect } from "react"

export function OverallData() {
  const { stats, loading, error, refreshStats } = useOverallStats()

  // Listen for profile approval/rejection events to refresh stats
  useEffect(() => {
    const handleStatsRefresh = () => {
      refreshStats()
    }

    // Listen for custom events from approval actions
    window.addEventListener('profileApproved', handleStatsRefresh)
    window.addEventListener('profileRejected', handleStatsRefresh)
    window.addEventListener('manualProfileCreated', handleStatsRefresh)

    return () => {
      window.removeEventListener('profileApproved', handleStatsRefresh)
      window.removeEventListener('profileRejected', handleStatsRefresh)
      window.removeEventListener('manualProfileCreated', handleStatsRefresh)
    }
  }, [refreshStats])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <XCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading overall statistics: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <p>No data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved Users</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalApprovedCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Across all school years</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.totalPendingCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Media Items</CardTitle>
            <ImageIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalMediaItems.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Photos and videos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
            <MessageSquare className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.totalOpenReports.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total School Years</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalSchoolYears}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {stats.schoolYearStats.filter(year => year.isActive).length} Active
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                {stats.schoolYearStats.filter(year => !year.isActive).length} Archived
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* School Year Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            School Year Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.schoolYearStats.map((yearStat) => (
              <div key={yearStat.yearId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{yearStat.yearLabel}</h4>
                      {yearStat.isActive && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      School Year {yearStat.yearLabel}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-green-600">{yearStat.approvedCount}</div>
                    <div className="text-xs text-muted-foreground">Approved</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-amber-600">{yearStat.pendingCount}</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-red-600">{yearStat.rejectedCount}</div>
                    <div className="text-xs text-muted-foreground">Rejected</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-600">{yearStat.mediaItems}</div>
                    <div className="text-xs text-muted-foreground">Media</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total School Years</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalSchoolYears}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {stats.schoolYearStats.filter(year => year.isActive).length} Active
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                {stats.schoolYearStats.filter(year => !year.isActive).length} Archived
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.totalApprovedCount + stats.totalPendingCount + stats.totalRejectedCount).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All statuses combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalApprovedCount + stats.totalPendingCount + stats.totalRejectedCount > 0 
                ? Math.round((stats.totalApprovedCount / (stats.totalApprovedCount + stats.totalPendingCount + stats.totalRejectedCount)) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Of all submitted profiles</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
