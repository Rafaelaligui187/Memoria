"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  ImageIcon,
  MessageSquare,
  Clock,
  BarChart3,
  History,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react"

import { AccountManagement } from "@/components/account-management"
import { ProfileApprovalSystem } from "@/components/profile-approval-system"
import { MediaManagement } from "@/components/media-management"
import { ReportsManagement } from "@/components/reports-management"
import { AuditLogsSystem } from "@/components/audit-logs-system"
import { YearSettingsSystem } from "@/components/year-settings-system"
import { YearbookManagement } from "@/components/yearbook-management"
import { ActivityFeed } from "@/components/activity-feed"
import { OverallData } from "@/components/overall-data"
import { useAdminStats } from "@/hooks/use-admin-stats"

export default function AdminDashboardPage() {
  const searchParams = useSearchParams()
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedYearLabel, setSelectedYearLabel] = useState("")
  const [activeSection, setActiveSection] = useState(() => {
    // Initialize from localStorage if available, otherwise default to "overall"
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminActiveSection') || "overall"
    }
    return "overall"
  })
  const [isDashboardMode, setIsDashboardMode] = useState(true)
  
  // Use dynamic stats
  const { stats, loading: statsLoading, refreshStats } = useAdminStats(selectedYear)

  // Save active section to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminActiveSection', activeSection)
    }
  }, [activeSection])

  // Listen for profile approval/rejection events to refresh stats
  useEffect(() => {
    const handleStatsRefresh = () => {
      refreshStats()
    }

    // Listen for custom events from approval actions
    window.addEventListener('profileApproved', handleStatsRefresh)
    window.addEventListener('profileRejected', handleStatsRefresh)

    return () => {
      window.removeEventListener('profileApproved', handleStatsRefresh)
      window.removeEventListener('profileRejected', handleStatsRefresh)
    }
  }, [refreshStats])

  // Listen for year changes from sidebar
  useEffect(() => {
    const handleYearChange = (event: CustomEvent) => {
      const { yearId, yearLabel } = event.detail
      setSelectedYear(yearId)
      setSelectedYearLabel(yearLabel)
      setActiveSection("overview") // Reset to overview when year changes
      setIsDashboardMode(false) // Switch to overview mode when year is selected
      
      // Update URL parameters
      const url = new URL(window.location.href)
      url.searchParams.set('year', yearId)
      url.searchParams.set('section', 'overview')
      window.history.replaceState({}, '', url.toString())
      
      // Refresh stats for the new year
      refreshStats()
    }

    window.addEventListener('yearChanged', handleYearChange as EventListener)

    return () => {
      window.removeEventListener('yearChanged', handleYearChange as EventListener)
    }
  }, [refreshStats])

  // Listen for section changes from sidebar
  useEffect(() => {
    const handleSectionChange = (event: CustomEvent) => {
      const { section } = event.detail
      setActiveSection(section)
      
      // Update URL parameters
      const url = new URL(window.location.href)
      url.searchParams.set('section', section)
      window.history.replaceState({}, '', url.toString())
    }

    window.addEventListener('sectionChanged', handleSectionChange as EventListener)

    return () => {
      window.removeEventListener('sectionChanged', handleSectionChange as EventListener)
    }
  }, [])

  // Listen for dashboard mode changes from sidebar
  useEffect(() => {
    const handleDashboardModeChange = (event: CustomEvent) => {
      const { isDashboardMode: newMode, activeSection: newActiveSection } = event.detail
      setIsDashboardMode(newMode)
      
      if (newMode) {
        // When switching to dashboard mode, use the activeSection from the event
        const sectionToSet = newActiveSection || "overall"
        
        // Use setTimeout to ensure this runs after URL parameter handling
        setTimeout(() => {
          setActiveSection(sectionToSet)
          setSelectedYear("")
          setSelectedYearLabel("")
          const url = new URL(window.location.href)
          url.searchParams.set('section', sectionToSet)
          url.searchParams.delete('year')
          window.history.replaceState({}, '', url.toString())
        }, 0)
      }
    }

    window.addEventListener('dashboardModeChanged', handleDashboardModeChange as EventListener)

    return () => {
      window.removeEventListener('dashboardModeChanged', handleDashboardModeChange as EventListener)
    }
  }, [])

  useEffect(() => {
    const yearParam = searchParams.get("year")
    const sectionParam = searchParams.get("section")

    // Only set parameters if they exist, otherwise use defaults
    if (yearParam) {
      setSelectedYear(yearParam)
      setIsDashboardMode(false) // If year is selected, switch to overview mode
    } else {
      setIsDashboardMode(true) // If no year selected, use dashboard mode
    }
    
    if (sectionParam) {
      setActiveSection(sectionParam)
    } else if (!yearParam) {
      // If no section specified and no year selected, try localStorage, otherwise default to overall
      const savedSection = typeof window !== 'undefined' ? localStorage.getItem('adminActiveSection') : null
      setActiveSection(savedSection || "overall")
    }
  }, [searchParams])

  // Set initial URL parameters on page load if none exist
  useEffect(() => {
    const yearParam = searchParams.get("year")
    const sectionParam = searchParams.get("section")
    
    // If no parameters exist, set default URL for dashboard mode
    if (!yearParam && !sectionParam) {
      const url = new URL(window.location.href)
      url.searchParams.set('section', 'overall')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Memoria Yearbook System</p>
        </div>
        {!isDashboardMode && selectedYear && (
          <Badge variant="secondary" className="text-sm">
            {selectedYearLabel || selectedYear}
          </Badge>
        )}
      </div>

      {isDashboardMode ? (
        <Tabs value={activeSection} onValueChange={(value) => {
          setActiveSection(value)
          // Update URL parameters when tab changes
          const url = new URL(window.location.href)
          url.searchParams.set('section', value)
          url.searchParams.delete('year') // Remove year param when in dashboard mode
          window.history.replaceState({}, '', url.toString())
          // Also save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('adminActiveSection', value)
          }
        }} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="overall" className="flex items-center gap-1 hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overall Data</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-1 hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Gallery & Albums</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1 hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Reports & Messages</span>
              {stats?.totalOpenReports > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {stats.totalOpenReports}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="audit-logs" className="flex items-center gap-1 hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Audit Logs</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Year Settings</span>
            </TabsTrigger>
          </TabsList>

        <TabsContent value="overall" className="space-y-4">
          <OverallData />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4" key={`gallery-${selectedYear}`}>
          <MediaManagement selectedYear={selectedYear} selectedYearLabel={selectedYearLabel} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4" key={`reports-${selectedYear}`}>
          <ReportsManagement selectedYear={selectedYear} selectedYearLabel={selectedYearLabel} />
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-4" key={`audit-logs-${selectedYear}`}>
          <AuditLogsSystem selectedYear={selectedYear} selectedYearLabel={selectedYearLabel} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4" key={`settings-${selectedYear}`}>
          <YearSettingsSystem selectedYear={selectedYear} selectedYearLabel={selectedYearLabel} />
        </TabsContent>
      </Tabs>
      ) : (
        // Overview Mode - Show content based on active section
        <div className="space-y-4">
          {activeSection === "overview" && (
            <>
              {/* Year-Specific Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Profiles</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        stats?.totalApprovedCount || 0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Total approved accounts</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        stats?.totalPendingCount || 0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Profiles awaiting review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Media Items</CardTitle>
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        stats?.totalMediaItems || 0
                      )}
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
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        stats?.totalOpenReports || 0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Require attention</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Pending Approvals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      Pending Profile Approvals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {statsLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse p-3 border rounded-lg">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          </div>
                        ))}
                      </div>
                    ) : stats?.pendingApprovals && stats.pendingApprovals.length > 0 ? (
                      stats.pendingApprovals.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.fullName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.department}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                // TODO: Handle approve action
                                window.location.href = `/admin/profiles/${item._id}/approve`
                              }}
                              className="text-green-600 border-green-600 bg-transparent border rounded p-1 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                // TODO: Handle reject action
                                window.location.href = `/admin/profiles/${item._id}/reject`
                              }}
                              className="text-red-600 border-red-600 bg-transparent border rounded p-1 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No pending approvals</p>
                        <p className="text-sm">All profiles have been reviewed</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <ActivityFeed selectedYear={selectedYear} showUserActions={false} />
              </div>
            </>
          )}

          {activeSection === "accounts" && (
            <AccountManagement selectedYear={selectedYear} selectedYearLabel={selectedYearLabel} />
          )}

          {activeSection === "profiles" && (
            <ProfileApprovalSystem selectedYear={selectedYear} selectedYearLabel={selectedYearLabel} />
          )}

          {activeSection === "yearbook-pages" && (
            <YearbookManagement selectedYear={selectedYear} selectedYearLabel={selectedYearLabel} />
          )}
        </div>
      )}
    </div>
  )
}
