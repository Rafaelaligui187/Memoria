"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  Users,
  FileText,
  ImageIcon,
  Settings,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Clock,
  Upload,
  History,
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

const initialSchoolYears: SchoolYear[] = [
  {
    id: "2024-2025",
    label: "2024–2025",
    status: "active",
    startDate: "2024-08-01",
    endDate: "2025-07-31",
    profileCount: 1248,
    albumCount: 15,
    pendingCount: 3,
  },
  {
    id: "2023-2024",
    label: "2023–2024",
    status: "archived",
    startDate: "2023-08-01",
    endDate: "2024-07-31",
    profileCount: 1156,
    albumCount: 22,
    pendingCount: 0,
  },
  {
    id: "2022-2023",
    label: "2022–2023",
    status: "archived",
    startDate: "2022-08-01",
    endDate: "2023-07-31",
    profileCount: 1089,
    albumCount: 18,
    pendingCount: 0,
  },
]

export function AdminSidebar() {
  const router = useRouter()
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>(initialSchoolYears)
  const [selectedYear, setSelectedYear] = useState("2024-2025")
  const [isYearsOpen, setIsYearsOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedYearForEdit, setSelectedYearForEdit] = useState<SchoolYear | null>(null)
  const [selectedYearForDelete, setSelectedYearForDelete] = useState<SchoolYear | null>(null)

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
    // Navigate to admin page with section parameter
    const url = `/admin?year=${selectedYear}&section=${section}`
    router.push(url)
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
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarMenu>
            {/* School Years Section */}
            <SidebarMenuItem>
              <Collapsible open={isYearsOpen} onOpenChange={setIsYearsOpen}>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="w-full justify-between">
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
                        className="w-full justify-between"
                        onClick={() => setSelectedYear(year.id)}
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
                      className="flex-1 bg-transparent"
                      onClick={() => setAddDialogOpen(true)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={handleEditYear}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={handleDeleteYear}>
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
                    className={activeSection === "overview" ? "bg-sidebar-accent" : ""}
                    onClick={() => handleSectionClick("overview")}
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Overview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={activeSection === "accounts" ? "bg-sidebar-accent" : ""}
                    onClick={() => handleSectionClick("accounts")}
                  >
                    <Users className="h-4 w-4" />
                    <span>User Accounts</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={activeSection === "profiles" ? "bg-sidebar-accent" : ""}
                    onClick={() => handleSectionClick("profiles")}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Profile Management</span>
                    {selectedYearData.pendingCount && selectedYearData.pendingCount > 0 && (
                      <Badge variant="destructive" className="ml-auto text-xs">
                        {selectedYearData.pendingCount}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={activeSection === "yearbook" ? "bg-sidebar-accent" : ""}
                    onClick={() => handleSectionClick("yearbook")}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Yearbook Pages</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={activeSection === "gallery" ? "bg-sidebar-accent" : ""}
                    onClick={() => handleSectionClick("gallery")}
                  >
                    <ImageIcon className="h-4 w-4" />
                    <span>Gallery & Albums</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={activeSection === "moderation" ? "bg-sidebar-accent" : ""}
                    onClick={() => handleSectionClick("moderation")}
                  >
                    <Clock className="h-4 w-4" />
                    <span>Moderation Queue</span>
                    {selectedYearData.pendingCount && selectedYearData.pendingCount > 0 && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {selectedYearData.pendingCount}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={activeSection === "reports" ? "bg-sidebar-accent" : ""}
                    onClick={() => handleSectionClick("reports")}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Reports & Messages</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      2
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={activeSection === "bulk-import" ? "bg-sidebar-accent" : ""}
                    onClick={() => handleSectionClick("bulk-import")}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Bulk Import</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={activeSection === "audit-logs" ? "bg-sidebar-accent" : ""}
                    onClick={() => handleSectionClick("audit-logs")}
                  >
                    <History className="h-4 w-4" />
                    <span>Audit Logs</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    className={activeSection === "settings" ? "bg-sidebar-accent" : ""}
                    onClick={() => handleSectionClick("settings")}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Year Settings</span>
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
