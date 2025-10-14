"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Users,
  FileText,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { YearManagementDialogs } from "./year-management-dialogs"
import { NotificationCenter } from "./notification-center"

interface SchoolYear {
  id: string
  label: string
  status: "active" | "archived" | "draft"
  startDate: string
  endDate: string
  profileCount?: number
  albumCount?: number
  pendingCount?: number
}

// Initial empty state - will be populated from API
const initialSchoolYears: SchoolYear[] = []

export function AdminSidebar() {
  const router = useRouter()
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>(initialSchoolYears)
  const [selectedYear, setSelectedYear] = useState("")
  const [isYearsOpen, setIsYearsOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")
  const [isDashboardMode, setIsDashboardMode] = useState(true)
  const [newProfileCount, setNewProfileCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedYearForEdit, setSelectedYearForEdit] = useState<SchoolYear | null>(null)
  const [selectedYearForDelete, setSelectedYearForDelete] = useState<SchoolYear | null>(null)

  // Fetch school years from API
  useEffect(() => {
    const fetchSchoolYears = async () => {
      try {
        const response = await fetch('/api/admin/years')
        const result = await response.json()
        
        if (result.success) {
          setSchoolYears(result.data)
          
          // Fetch profile counts for each school year
          await fetchProfileCounts(result.data)
        } else {
          console.error('Failed to fetch school years:', result.error)
        }
      } catch (error) {
        console.error('Error fetching school years:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchoolYears()
  }, [])

  // Fetch profile counts for each school year
  const fetchProfileCounts = async (years: SchoolYear[]) => {
    try {
      const yearsWithCounts = await Promise.all(
        years.map(async (year) => {
          try {
            const response = await fetch(`/api/admin/stats?schoolYearId=${year.id}`)
            const result = await response.json()
            
            if (result.success) {
              return {
                ...year,
                profileCount: result.data.totalApprovedCount || 0,
                pendingCount: result.data.totalPendingCount || 0
              }
            }
          } catch (error) {
            console.error(`Error fetching counts for year ${year.label}:`, error)
          }
          
          return {
            ...year,
            profileCount: 0,
            pendingCount: 0
          }
        })
      )
      
      setSchoolYears(yearsWithCounts)
    } catch (error) {
      console.error('Error fetching profile counts:', error)
    }
  }

  // Listen for approval/rejection events to refresh counts
  useEffect(() => {
    const handleProfileCountRefresh = async () => {
      // Refresh counts for all school years by fetching fresh school year data
      try {
        const response = await fetch('/api/admin/years')
        const result = await response.json()
        
        if (result.success) {
          await fetchProfileCounts(result.data)
        }
      } catch (error) {
        console.error('Error refreshing profile counts:', error)
      }
    }

    window.addEventListener('profileApproved', handleProfileCountRefresh)
    window.addEventListener('profileRejected', handleProfileCountRefresh)
    window.addEventListener('manualProfileCreated', handleProfileCountRefresh)

    return () => {
      window.removeEventListener('profileApproved', handleProfileCountRefresh)
      window.removeEventListener('profileRejected', handleProfileCountRefresh)
      window.removeEventListener('manualProfileCreated', handleProfileCountRefresh)
    }
  }, [])

  // Listen for new profile creation events
  useEffect(() => {
    const handleNewProfile = () => {
      setNewProfileCount(prev => prev + 1)
    }

    const handleProfileViewed = () => {
      setNewProfileCount(0) // Reset count when profiles are viewed
    }

    window.addEventListener('newProfileCreated', handleNewProfile)
    window.addEventListener('profilesViewed', handleProfileViewed)

    return () => {
      window.removeEventListener('newProfileCreated', handleNewProfile)
      window.removeEventListener('profilesViewed', handleProfileViewed)
    }
  }, [])

  const handleEditYear = () => {
    const yearToEdit = schoolYears.find((year) => year.id === selectedYear)
    if (yearToEdit) {
      setSelectedYearForEdit(yearToEdit)
      setEditDialogOpen(true)
    }
  }

  const handleDeleteYear = () => {
    const yearToDelete = schoolYears.find((year) => year.id === selectedYear)
    if (yearToDelete) {
      setSelectedYearForDelete(yearToDelete)
      setDeleteDialogOpen(true)
    }
  }

  const handleSectionClick = (section: string) => {
    setActiveSection(section)
    // Switch to overview mode when clicking sidebar navigation
    setIsDashboardMode(false)
    
    // Reset new profile count when viewing profiles
    if (section === "profiles") {
      setNewProfileCount(0)
      // Dispatch event to notify that profiles have been viewed
      window.dispatchEvent(new CustomEvent('profilesViewed'))
    }
    
    // Dispatch events to notify dashboard
    window.dispatchEvent(new CustomEvent('sectionChanged', { 
      detail: { section } 
    }))
    window.dispatchEvent(new CustomEvent('dashboardModeChanged', { 
      detail: { isDashboardMode: false } 
    }))
  }

  const handleDashboardToggle = () => {
    // Always switch to dashboard mode (don't toggle)
    setIsDashboardMode(true)
    setSelectedYear("")
    setActiveSection("overall") // Set to "overall" to show Overall Data tab
    
    // Dispatch event to notify dashboard of mode change
    window.dispatchEvent(new CustomEvent('dashboardModeChanged', { 
      detail: { isDashboardMode: true, activeSection: "overall" } 
    }))
  }

  const selectedYearData = schoolYears.find((year) => year.id === selectedYear)

  return (
    <>
      <Sidebar className="border-r border-sidebar-border">
        <SidebarHeader className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-sidebar-foreground">Memoria Admin</h2>
              <p className="text-sm text-muted-foreground">Consolatrix College Yearbook System</p>
            </div>
            <NotificationCenter />
          </div>
          
          {/* Admin Dashboard Button */}
          <div className="mt-4">
            <SidebarMenuButton
              className={`${isDashboardMode ? "bg-blue-200 text-blue-900" : ""} hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200`}
              onClick={handleDashboardToggle}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </SidebarMenuButton>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarMenu>
            {/* School Years Section */}
            <SidebarMenuItem>
              <Collapsible open={isYearsOpen} onOpenChange={setIsYearsOpen}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full justify-between hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>School Years</span>
                    </div>
                    {isYearsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-6 mt-2 space-y-1">
                  {schoolYears.map((year) => (
                    <div key={year.id} className="space-y-1">
                      <Button
                        variant={selectedYear === year.id ? "secondary" : "ghost"}
                        size="sm"
                        className={`w-full justify-between hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200 ${selectedYear === year.id ? "bg-blue-200 text-blue-900" : ""}`}
                onClick={() => {
                  setSelectedYear(year.id)
                  // Switch to overview mode when selecting a year
                  setIsDashboardMode(false)
                  setActiveSection("overview")
                  
                  // Dispatch events to notify dashboard
                  window.dispatchEvent(new CustomEvent('yearChanged', {
                    detail: { yearId: year.id, yearLabel: year.label }
                  }))
                  window.dispatchEvent(new CustomEvent('dashboardModeChanged', { 
                    detail: { isDashboardMode: false } 
                  }))
                  window.dispatchEvent(new CustomEvent('sectionChanged', { 
                    detail: { section: "overview" } 
                  }))
                }}
                      >
                        <span>{year.label}</span>
                        <div className="flex items-center gap-1">
                          {year.status === "active" && (
                            <Badge variant="secondary" className="text-xs">
                              Active
                            </Badge>
                          )}
                          {year.status === "draft" && (
                            <Badge variant="outline" className="text-xs">
                              Draft
                            </Badge>
                          )}
                        </div>
                      </Button>
                      {selectedYear === year.id && (
                        <div className="ml-2 text-xs text-muted-foreground space-y-1">
                          <div className="flex justify-between">
                            <span>Profiles:</span>
                            <span>{year.profileCount || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Albums:</span>
                            <span>{year.albumCount || 0}</span>
                          </div>
                          {(year.pendingCount || 0) > 0 && (
                            <div className="flex justify-between text-amber-600">
                              <span>Pending:</span>
                              <span>{year.pendingCount}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-1 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent hover:bg-green-100 hover:text-green-800 active:bg-green-300 active:text-green-900 transition-all duration-200"
                      onClick={() => setAddDialogOpen(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 bg-transparent hover:bg-yellow-100 hover:text-yellow-800 active:bg-yellow-300 active:text-yellow-900 transition-all duration-200" 
                      onClick={handleEditYear}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 bg-transparent hover:bg-red-100 hover:text-red-800 active:bg-red-300 active:text-red-900 transition-all duration-200" 
                      onClick={handleDeleteYear}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </SidebarMenuItem>

            {/* Year-Specific Management */}
            {selectedYear && selectedYearData && (
              <>
                <div className="px-3 py-2 mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Managing: {selectedYearData.label}</h3>
                </div>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={`${activeSection === "overview" ? "bg-blue-200 text-blue-900" : ""} hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200`}
                    onClick={() => handleSectionClick("overview")}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={`${activeSection === "yearbook-pages" ? "bg-blue-200 text-blue-900" : ""} hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200`}
                    onClick={() => handleSectionClick("yearbook-pages")}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Yearbook Pages</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={`${activeSection === "accounts" ? "bg-blue-200 text-blue-900" : ""} hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200`}
                    onClick={() => handleSectionClick("accounts")}
                  >
                    <Users className="h-4 w-4" />
                    <span>User Accounts</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={`${activeSection === "profiles" ? "bg-blue-200 text-blue-900" : ""} hover:bg-blue-100 hover:text-blue-800 active:bg-blue-300 active:text-blue-900 transition-all duration-200`}
                    onClick={() => handleSectionClick("profiles")}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Profile Management</span>
                    {(newProfileCount > 0 || (selectedYearData.pendingCount && selectedYearData.pendingCount > 0)) && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {newProfileCount + (selectedYearData.pendingCount || 0)}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <YearManagementDialogs
        schoolYears={schoolYears}
        onYearsUpdate={setSchoolYears}
        addDialogOpen={addDialogOpen}
        setAddDialogOpen={setAddDialogOpen}
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        selectedYearForEdit={selectedYearForEdit}
        selectedYearForDelete={selectedYearForDelete}
      />
    </>
  )
}
