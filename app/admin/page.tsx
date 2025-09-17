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
  Upload,
  History,
  Settings,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react"

import { AccountManagement } from "@/components/account-management"
import { ProfileApprovalSystem } from "@/components/profile-approval-system"
import { MediaManagement } from "@/components/media-management"
import { ReportsManagement } from "@/components/reports-management"
import { EnhancedModerationQueue } from "@/components/enhanced-moderation-queue"
import { BulkImportSystem } from "@/components/bulk-import-system"
import { AuditLogsSystem } from "@/components/audit-logs-system"
import { YearSettingsSystem } from "@/components/year-settings-system"
import { YearbookManagement } from "@/components/yearbook-management"
import { ActivityFeed } from "@/components/activity-feed"

export default function AdminDashboardPage() {
  const searchParams = useSearchParams()
  const [selectedYear, setSelectedYear] = useState("2024-2025")
  const [activeSection, setActiveSection] = useState("overview")

  useEffect(() => {
    const yearParam = searchParams.get("year")
    const sectionParam = searchParams.get("section")

    if (yearParam) setSelectedYear(yearParam)
    if (sectionParam) setActiveSection(sectionParam)
  }, [searchParams])

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Managing {selectedYear} • Memoria Yearbook System</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Active Year: {selectedYear}
        </Badge>
      </div>

      <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Accounts</span>
          </TabsTrigger>
          <TabsTrigger value="profiles" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Profiles</span>
          </TabsTrigger>
          <TabsTrigger value="yearbook" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Yearbook</span>
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Gallery</span>
          </TabsTrigger>
          <TabsTrigger value="moderation" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Moderation</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          <TabsTrigger value="bulk-import" className="flex items-center gap-1">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </TabsTrigger>
          <TabsTrigger value="audit-logs" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Logs</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Year-Specific Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12% from last year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Profiles awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Media Items</CardTitle>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">856</div>
                <p className="text-xs text-muted-foreground">Photos and videos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
                <MessageSquare className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
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
                {[
                  { name: "John Doe", role: "Student", department: "Grade 12 STEM", time: "2 hours ago" },
                  { name: "Jane Smith", role: "Faculty", department: "Mathematics", time: "5 hours ago" },
                  { name: "Mike Johnson", role: "Alumni", department: "Class of 2020", time: "1 day ago" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.role} • {item.department}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-green-600 border-green-600 bg-transparent border rounded p-1">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 border-red-600 bg-transparent border rounded p-1">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <ActivityFeed selectedYear={selectedYear} showUserActions={false} />
          </div>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <AccountManagement selectedYear={selectedYear} />
        </TabsContent>

        <TabsContent value="profiles" className="space-y-4">
          <ProfileApprovalSystem selectedYear={selectedYear} />
        </TabsContent>

        <TabsContent value="yearbook" className="space-y-4">
          <YearbookManagement selectedYear={selectedYear} />
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <MediaManagement selectedYear={selectedYear} />
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <EnhancedModerationQueue selectedYear={selectedYear} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportsManagement selectedYear={selectedYear} />
        </TabsContent>

        <TabsContent value="bulk-import" className="space-y-4">
          <BulkImportSystem selectedYear={selectedYear} />
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-4">
          <AuditLogsSystem selectedYear={selectedYear} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <YearSettingsSystem selectedYear={selectedYear} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
