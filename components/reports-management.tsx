"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Eye, Reply, Archive, Filter } from "lucide-react"

interface Report {
  id: string
  userId: string
  userName: string
  userEmail: string
  category: "inappropriate_content" | "harassment" | "spam" | "technical_issue" | "other"
  subject: string
  description: string
  status: "new" | "in_progress" | "resolved" | "archived"
  priority: "low" | "medium" | "high" | "urgent"
  submittedAt: string
  resolvedAt?: string
  assignedTo?: string
  adminReply?: string
  yearId: string
  attachments?: string[]
}

const mockReports: Report[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    category: "inappropriate_content",
    subject: "Inappropriate photo in gallery",
    description: "There's a photo in the Sports Day album that contains inappropriate content and should be removed.",
    status: "new",
    priority: "high",
    submittedAt: "2024-08-15T10:30:00Z",
    yearId: "", // Will be populated from active school year
  },
  {
    id: "2",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane.smith@example.com",
    category: "technical_issue",
    subject: "Cannot upload profile photo",
    description: "I'm having trouble uploading my profile photo. The upload keeps failing with an error message.",
    status: "in_progress",
    priority: "medium",
    submittedAt: "2024-08-14T14:20:00Z",
    assignedTo: "Admin User",
    yearId: "", // Will be populated from active school year
  },
  {
    id: "3",
    userId: "user3",
    userName: "Mike Johnson",
    userEmail: "mike.johnson@example.com",
    category: "harassment",
    subject: "Bullying in comments",
    description: "Someone is posting mean comments on my profile and I would like this to be addressed.",
    status: "resolved",
    priority: "high",
    submittedAt: "2024-08-13T09:15:00Z",
    resolvedAt: "2024-08-14T11:30:00Z",
    assignedTo: "Admin User",
    adminReply:
      "We have investigated the issue and taken appropriate action. The offending comments have been removed and the user has been warned.",
    yearId: "", // Will be populated from active school year
  },
]

const reportCategories = {
  inappropriate_content: "Inappropriate Content",
  harassment: "Harassment/Bullying",
  spam: "Spam",
  technical_issue: "Technical Issue",
  other: "Other",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

interface ReportsManagementProps {
  selectedYear: string
  selectedYearLabel?: string
}

export function ReportsManagement({ selectedYear, selectedYearLabel }: ReportsManagementProps) {
  const [reports, setReports] = useState<Report[]>(mockReports.filter((report) => report.yearId === selectedYear))
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [adminReply, setAdminReply] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const { toast } = useToast()

  const filteredReports = reports.filter((report) => {
    const matchesStatus = filterStatus === "all" || report.status === filterStatus
    const matchesPriority = filterPriority === "all" || report.priority === filterPriority
    const matchesCategory = filterCategory === "all" || report.category === filterCategory
    return matchesStatus && matchesPriority && matchesCategory
  })

  const newCount = reports.filter((r) => r.status === "new").length
  const inProgressCount = reports.filter((r) => r.status === "in_progress").length
  const resolvedCount = reports.filter((r) => r.status === "resolved").length

  const handleStatusChange = (reportId: string, newStatus: Report["status"]) => {
    const updatedReports = reports.map((report) =>
      report.id === reportId
        ? {
            ...report,
            status: newStatus,
            resolvedAt: newStatus === "resolved" ? new Date().toISOString() : report.resolvedAt,
            assignedTo: newStatus === "in_progress" ? "Admin User" : report.assignedTo,
          }
        : report,
    )
    setReports(updatedReports)

    toast({
      title: "Status Updated",
      description: `Report status changed to ${newStatus.replace("_", " ")}.`,
    })
  }

  const handleReply = () => {
    if (!selectedReport || !adminReply.trim()) {
      toast({
        title: "Error",
        description: "Please enter a reply message.",
        variant: "destructive",
      })
      return
    }

    const updatedReports = reports.map((report) =>
      report.id === selectedReport.id
        ? {
            ...report,
            adminReply: adminReply,
            status: "resolved" as const,
            resolvedAt: new Date().toISOString(),
            assignedTo: "Admin User",
          }
        : report,
    )

    setReports(updatedReports)
    setReplyDialogOpen(false)
    setSelectedReport(null)
    setAdminReply("")

    toast({
      title: "Reply Sent",
      description: "Your reply has been sent and the report has been marked as resolved.",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            New
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="outline">
            <Archive className="h-3 w-3 mr-1" />
            Archived
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    return (
      <Badge variant="outline" className={priorityColors[priority as keyof typeof priorityColors]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports & Messages</h2>
          <p className="text-muted-foreground">Handle user reports and messages for {selectedYearLabel || selectedYear}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newCount}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Being handled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(reportCategories).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Reports</TabsTrigger>
          <TabsTrigger value="resolved">Resolved Reports</TabsTrigger>
          <TabsTrigger value="all">All Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Active Reports (
                {filteredReports.filter((r) => r.status !== "resolved" && r.status !== "archived").length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredReports
                .filter((r) => r.status !== "resolved" && r.status !== "archived")
                .map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {report.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{report.subject}</h4>
                          {getPriorityBadge(report.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {reportCategories[report.category]} • {report.userName}
                        </p>
                        <p className="text-xs text-muted-foreground">Submitted {formatDate(report.submittedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(report.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report)
                          setViewDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {report.status === "new" && (
                        <Button size="sm" onClick={() => handleStatusChange(report.id, "in_progress")}>
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              {filteredReports.filter((r) => r.status !== "resolved" && r.status !== "archived").length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active reports</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resolved Reports ({filteredReports.filter((r) => r.status === "resolved").length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredReports
                .filter((r) => r.status === "resolved")
                .map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {report.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{report.subject}</h4>
                          {getPriorityBadge(report.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {reportCategories[report.category]} • {report.userName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Resolved {report.resolvedAt ? formatDate(report.resolvedAt) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(report.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReport(report)
                          setViewDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Reports ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {report.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{report.subject}</h4>
                        {getPriorityBadge(report.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {reportCategories[report.category]} • {report.userName}
                      </p>
                      <p className="text-xs text-muted-foreground">Submitted {formatDate(report.submittedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(report.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report)
                        setViewDialogOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Report Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Report from {selectedReport?.userName}</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {selectedReport.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedReport.userName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedReport.userEmail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm mt-1">{reportCategories[selectedReport.category]}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="mt-1">{getPriorityBadge(selectedReport.priority)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Submitted</Label>
                  <p className="text-sm mt-1">{formatDate(selectedReport.submittedAt)}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Subject</Label>
                <p className="text-sm mt-1">{selectedReport.subject}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm mt-1">{selectedReport.description}</p>
              </div>

              {selectedReport.adminReply && (
                <div>
                  <Label className="text-sm font-medium">Admin Reply</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedReport.adminReply}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedReport?.status !== "resolved" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewDialogOpen(false)
                    setReplyDialogOpen(true)
                  }}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Reply & Resolve
                </Button>
                {selectedReport?.status === "new" && (
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedReport.id, "in_progress")
                      setViewDialogOpen(false)
                    }}
                  >
                    Mark In Progress
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Report</DialogTitle>
            <DialogDescription>
              Send a reply to {selectedReport?.userName} and mark this report as resolved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Your Reply</Label>
              <Textarea
                placeholder="Enter your reply to the user..."
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReply}>Send Reply & Resolve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
