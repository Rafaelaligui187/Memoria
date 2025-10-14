"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  User,
  ImageIcon,
  MessageSquare,
  FileText,
  Calendar,
  AlertTriangle,
} from "lucide-react"

interface ModerationItem {
  id: string
  type: "profile" | "album" | "photo" | "report" | "content"
  title: string
  description: string
  submittedBy: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  submittedAt: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_review" | "approved" | "rejected"
  yearId: string
  metadata: {
    role?: string
    department?: string
    contentType?: string
    reportReason?: string
    albumName?: string
    photoCount?: number
  }
}

const mockModerationItems: ModerationItem[] = [
  {
    id: "1",
    type: "profile",
    title: "Student Profile Submission",
    description: "John Doe submitted his student profile for approval",
    submittedBy: {
      id: "user1",
      name: "John Doe",
      email: "john.doe@cctc.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40&text=JD",
    },
    submittedAt: "2024-08-15T10:30:00Z",
    priority: "medium",
    status: "pending",
    yearId: "", // Will be populated from active school year
    metadata: {
      role: "Student",
      department: "College",
      contentType: "BSIT Profile",
    },
  },
  {
    id: "2",
    type: "album",
    title: "Sports Day Album",
    description: "New album with 25 photos from Sports Day event",
    submittedBy: {
      id: "user2",
      name: "Maria Santos",
      email: "maria.santos@cctc.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40&text=MS",
    },
    submittedAt: "2024-08-14T14:20:00Z",
    priority: "low",
    status: "pending",
    yearId: "", // Will be populated from active school year
    metadata: {
      albumName: "Sports Day 2024",
      photoCount: 25,
      contentType: "Event Photos",
    },
  },
  {
    id: "3",
    type: "report",
    title: "Inappropriate Content Report",
    description: "User reported inappropriate content in a profile",
    submittedBy: {
      id: "user3",
      name: "Anonymous User",
      email: "anonymous@system.local",
    },
    submittedAt: "2024-08-13T09:15:00Z",
    priority: "high",
    status: "pending",
    yearId: "", // Will be populated from active school year
    metadata: {
      reportReason: "Inappropriate language in bio",
      contentType: "Profile Content",
    },
  },
  {
    id: "4",
    type: "photo",
    title: "Profile Photo Update",
    description: "Faculty member updated their profile photo",
    submittedBy: {
      id: "user4",
      name: "Dr. Elena Rodriguez",
      email: "elena.rodriguez@cctc.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40&text=ER",
    },
    submittedAt: "2024-08-12T16:45:00Z",
    priority: "low",
    status: "in_review",
    yearId: "", // Will be populated from active school year
    metadata: {
      role: "Faculty",
      department: "Mathematics",
      contentType: "Profile Photo",
    },
  },
]

const rejectionReasons = [
  "Inappropriate content",
  "Incomplete information",
  "Poor image quality",
  "Violation of community guidelines",
  "Spam or promotional content",
  "Duplicate submission",
  "Technical issues",
  "Other (specify below)",
]

interface ModerationQueueProps {
  selectedYear: string
}

export function ModerationQueue({ selectedYear }: ModerationQueueProps) {
  const [items, setItems] = useState<ModerationItem[]>(
    mockModerationItems.filter((item) => item.yearId === selectedYear),
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("pending")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [bulkActionDialogOpen, setBulkActionDialogOpen] = useState(false)
  const [bulkAction, setBulkAction] = useState<"approve" | "reject">("approve")
  const [rejectionReason, setRejectionReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const { toast } = useToast()

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedBy.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === "all" || item.type === filterType
    const matchesPriority = filterPriority === "all" || item.priority === filterPriority
    const matchesStatus = filterStatus === "all" || item.status === filterStatus

    return matchesSearch && matchesType && matchesPriority && matchesStatus
  })

  // Get counts for different statuses
  const pendingCount = items.filter((item) => item.status === "pending").length
  const inReviewCount = items.filter((item) => item.status === "in_review").length
  const urgentCount = items.filter((item) => item.priority === "urgent").length
  const highPriorityCount = items.filter((item) => item.priority === "high").length

  const handleItemAction = (itemId: string, action: "approve" | "reject", reason?: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            status: action === "approve" ? ("approved" as const) : ("rejected" as const),
            rejectionReason: reason,
          }
        : item,
    )
    setItems(updatedItems)

    const item = items.find((i) => i.id === itemId)
    toast({
      title: action === "approve" ? "Item Approved" : "Item Rejected",
      description: `${item?.title} has been ${action}d successfully.`,
    })
  }

  const handleBulkAction = () => {
    if (selectedItems.length === 0) return

    const reason = rejectionReason === "Other (specify below)" ? customReason : rejectionReason

    if (bulkAction === "reject" && !reason) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason.",
        variant: "destructive",
      })
      return
    }

    const updatedItems = items.map((item) =>
      selectedItems.includes(item.id)
        ? {
            ...item,
            status: bulkAction === "approve" ? ("approved" as const) : ("rejected" as const),
            rejectionReason: bulkAction === "reject" ? reason : undefined,
          }
        : item,
    )

    setItems(updatedItems)
    setSelectedItems([])
    setBulkActionDialogOpen(false)
    setRejectionReason("")
    setCustomReason("")

    toast({
      title: `Bulk ${bulkAction === "approve" ? "Approval" : "Rejection"} Complete`,
      description: `${selectedItems.length} items have been ${bulkAction}d.`,
    })
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge variant="destructive" className="bg-red-600">
            Urgent
          </Badge>
        )
      case "high":
        return (
          <Badge variant="destructive" className="bg-orange-600">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="bg-yellow-600 text-white">
            Medium
          </Badge>
        )
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "in_review":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Eye className="h-3 w-3 mr-1" />
            In Review
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "profile":
        return <User className="h-4 w-4" />
      case "album":
      case "photo":
        return <ImageIcon className="h-4 w-4" />
      case "report":
        return <MessageSquare className="h-4 w-4" />
      case "content":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
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
          <h2 className="text-2xl font-bold tracking-tight">Moderation Queue</h2>
          <p className="text-muted-foreground">Review and moderate content for {selectedYear}</p>
        </div>
        {selectedItems.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setBulkAction("approve")
                setBulkActionDialogOpen(true)
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Bulk Approve ({selectedItems.length})
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setBulkAction("reject")
                setBulkActionDialogOpen(true)
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Bulk Reject ({selectedItems.length})
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Review</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inReviewCount}</div>
            <p className="text-xs text-muted-foreground">Being reviewed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityCount}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentCount}</div>
            <p className="text-xs text-muted-foreground">Immediate action</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="profile">Profiles</SelectItem>
                <SelectItem value="album">Albums</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="report">Reports</SelectItem>
                <SelectItem value="content">Content</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Items */}
      <Card>
        <CardHeader>
          <CardTitle>Moderation Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedItems([...selectedItems, item.id])
                    } else {
                      setSelectedItems(selectedItems.filter((id) => id !== item.id))
                    }
                  }}
                />
                <div className="flex items-center gap-3">
                  {getTypeIcon(item.type)}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={item.submittedBy.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {item.submittedBy.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{item.title}</h4>
                    {getPriorityBadge(item.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>By {item.submittedBy.name}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.submittedAt)}
                    </span>
                    {item.metadata.role && <span>Role: {item.metadata.role}</span>}
                    {item.metadata.department && <span>Dept: {item.metadata.department}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(item.status)}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item)
                    setViewDialogOpen(true)
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Review
                </Button>
                {item.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleItemAction(item.id, "approve")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 bg-transparent"
                      onClick={() => handleItemAction(item.id, "reject", "Quick rejection")}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No items found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Item Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Item</DialogTitle>
            <DialogDescription>Review details for moderation</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedItem.submittedBy.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {selectedItem.submittedBy.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedItem.title}</h3>
                  <p className="text-muted-foreground">Submitted by {selectedItem.submittedBy.name}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedItem.submittedAt)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm mt-1">{selectedItem.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="text-sm mt-1 capitalize">{selectedItem.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <div className="mt-1">{getPriorityBadge(selectedItem.priority)}</div>
                  </div>
                </div>

                {selectedItem.metadata.role && (
                  <div>
                    <Label className="text-sm font-medium">Role & Department</Label>
                    <p className="text-sm mt-1">
                      {selectedItem.metadata.role} • {selectedItem.metadata.department}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedItem?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 bg-transparent"
                  onClick={() => {
                    if (selectedItem) {
                      handleItemAction(selectedItem.id, "reject", "Rejected from review dialog")
                      setViewDialogOpen(false)
                    }
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (selectedItem) {
                      handleItemAction(selectedItem.id, "approve")
                      setViewDialogOpen(false)
                    }
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialogOpen} onOpenChange={setBulkActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk {bulkAction === "approve" ? "Approve" : "Reject"} Items</DialogTitle>
            <DialogDescription>
              You are about to {bulkAction} {selectedItems.length} items.
              {bulkAction === "reject" && " Please provide a reason for rejection."}
            </DialogDescription>
          </DialogHeader>
          {bulkAction === "reject" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Rejection Reason</Label>
                <Select value={rejectionReason} onValueChange={setRejectionReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {rejectionReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {rejectionReason === "Other (specify below)" && (
                <div className="space-y-2">
                  <Label>Custom Reason</Label>
                  <Textarea
                    placeholder="Please specify the reason for rejection..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBulkAction}
              className={bulkAction === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
              variant={bulkAction === "reject" ? "destructive" : "default"}
            >
              {bulkAction === "approve" ? "Approve All" : "Reject All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
