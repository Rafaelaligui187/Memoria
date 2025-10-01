"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Search,
  Download,
  RefreshCw,
  Zap,
  TrendingUp,
  FileText,
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
    riskScore?: number
  }
  submittedAt: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_review" | "approved" | "rejected" | "escalated"
  yearId: string
  metadata: Record<string, any>
  rejectionReason?: string
  reviewedAt?: string
  reviewedBy?: string
  aiFlags?: string[]
  escalationLevel?: number
  estimatedReviewTime?: number
}

interface EnhancedModerationQueueProps {
  selectedYear: string
}

export function EnhancedModerationQueue({ selectedYear }: EnhancedModerationQueueProps) {
  const [items, setItems] = useState<ModerationItem[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("submittedAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Dialog states
  const [bulkActionDialog, setBulkActionDialog] = useState(false)
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | "escalate">("approve")
  const [bulkReason, setBulkReason] = useState("")
  const [autoModerationEnabled, setAutoModerationEnabled] = useState(false)
  const [processingBulk, setProcessingBulk] = useState(false)
  const [bulkProgress, setBulkProgress] = useState(0)

  const { toast } = useToast()

  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.submittedBy.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = typeFilter === "all" || item.type === typeFilter
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter

      return matchesSearch && matchesType && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof ModerationItem] as string
      const bValue = b[sortBy as keyof ModerationItem] as string

      if (sortOrder === "asc") {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

  const runAutoModeration = async () => {
    setLoading(true)
    try {
      const pendingItems = items.filter((item) => item.status === "pending")

      for (const item of pendingItems) {
        // Simulate AI content analysis
        const aiFlags = []
        const riskScore = Math.random() * 100

        if (riskScore > 80) {
          aiFlags.push("High risk content detected")
          item.priority = "urgent"
        } else if (riskScore > 60) {
          aiFlags.push("Moderate risk content")
          item.priority = "high"
        } else if (riskScore < 20) {
          // Auto-approve low-risk content
          item.status = "approved"
          item.reviewedAt = new Date().toISOString()
          item.reviewedBy = "AI Moderator"
        }

        item.aiFlags = aiFlags
        item.submittedBy.riskScore = riskScore
      }

      setItems([...items])

      toast({
        title: "Auto-moderation Complete",
        description: `Processed ${pendingItems.length} items. ${pendingItems.filter((i) => i.status === "approved").length} auto-approved.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Auto-moderation failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBulkAction = async () => {
    if (selectedItems.length === 0) return

    setProcessingBulk(true)
    setBulkProgress(0)

    try {
      const totalItems = selectedItems.length

      for (let i = 0; i < selectedItems.length; i++) {
        const itemId = selectedItems[i]
        const itemIndex = items.findIndex((item) => item.id === itemId)

        if (itemIndex !== -1) {
          const updatedItem = { ...items[itemIndex] }

          switch (bulkAction) {
            case "approve":
              updatedItem.status = "approved"
              break
            case "reject":
              updatedItem.status = "rejected"
              updatedItem.rejectionReason = bulkReason
              break
            case "escalate":
              updatedItem.status = "escalated"
              updatedItem.escalationLevel = (updatedItem.escalationLevel || 0) + 1
              break
          }

          updatedItem.reviewedAt = new Date().toISOString()
          updatedItem.reviewedBy = "Admin User"

          items[itemIndex] = updatedItem
        }

        // Update progress
        setBulkProgress(((i + 1) / totalItems) * 100)

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      setItems([...items])
      setSelectedItems([])
      setBulkActionDialog(false)
      setBulkReason("")

      toast({
        title: "Bulk Action Complete",
        description: `Successfully ${bulkAction}ed ${selectedItems.length} items.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Bulk action failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingBulk(false)
      setBulkProgress(0)
    }
  }

  const getAnalytics = () => {
    const total = items.length
    const pending = items.filter((i) => i.status === "pending").length
    const approved = items.filter((i) => i.status === "approved").length
    const rejected = items.filter((i) => i.status === "rejected").length
    const escalated = items.filter((i) => i.status === "escalated").length
    const highPriority = items.filter((i) => i.priority === "high" || i.priority === "urgent").length
    const aiProcessed = items.filter((i) => i.aiFlags && i.aiFlags.length > 0).length

    const avgProcessingTime =
      items
        .filter((i) => i.reviewedAt && i.submittedAt)
        .reduce((acc, item) => {
          const submitted = new Date(item.submittedAt).getTime()
          const reviewed = new Date(item.reviewedAt!).getTime()
          return acc + (reviewed - submitted)
        }, 0) / items.filter((i) => i.reviewedAt).length || 0

    return {
      total,
      pending,
      approved,
      rejected,
      escalated,
      highPriority,
      aiProcessed,
      avgProcessingTime: Math.round(avgProcessingTime / (1000 * 60 * 60)), // hours
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
    }
  }

  const analytics = getAnalytics()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 bg-red-50"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
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
      case "escalated":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Escalated
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Analytics */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enhanced Moderation Queue</h2>
          <p className="text-muted-foreground">AI-powered content moderation for {selectedYear}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={runAutoModeration} disabled={loading}>
            <Zap className="h-4 w-4 mr-2" />
            {loading ? "Processing..." : "Auto-Moderate"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              /* Export functionality */
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={() => {
              /* Refresh data */
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Analytics Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total}</div>
            <p className="text-xs text-muted-foreground">{analytics.pending} pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.approvalRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.approved} approved, {analytics.rejected} rejected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.highPriority}</div>
            <p className="text-xs text-muted-foreground">{analytics.escalated} escalated items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Processed</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.aiProcessed}</div>
            <p className="text-xs text-muted-foreground">Avg. {analytics.avgProcessingTime}h processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="profile">Profiles</SelectItem>
                  <SelectItem value="album">Albums</SelectItem>
                  <SelectItem value="photo">Photos</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{selectedItems.length} selected</span>
                <Button size="sm" onClick={() => setBulkActionDialog(true)}>
                  Bulk Actions
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Items List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems(filteredItems.map((item) => item.id))
                        } else {
                          setSelectedItems([])
                        }
                      }}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Item</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Submitted</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">AI Flags</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          by {item.submittedBy.name}
                          {item.submittedBy.riskScore && (
                            <span
                              className={`ml-2 px-2 py-1 rounded text-xs ${
                                item.submittedBy.riskScore > 70
                                  ? "bg-red-100 text-red-800"
                                  : item.submittedBy.riskScore > 40
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              Risk: {Math.round(item.submittedBy.riskScore)}%
                            </span>
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{item.type}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {item.aiFlags && item.aiFlags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.aiFlags.slice(0, 2).map((flag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {flag}
                            </Badge>
                          ))}
                          {item.aiFlags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.aiFlags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialog} onOpenChange={setBulkActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Action</DialogTitle>
            <DialogDescription>Apply action to {selectedItems.length} selected items</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Action</Label>
              <Select
                value={bulkAction}
                onValueChange={(value: "approve" | "reject" | "escalate") => setBulkAction(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve All</SelectItem>
                  <SelectItem value="reject">Reject All</SelectItem>
                  <SelectItem value="escalate">Escalate All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(bulkAction === "reject" || bulkAction === "escalate") && (
              <div className="space-y-2">
                <Label>Reason</Label>
                <Textarea
                  placeholder="Enter reason for this action..."
                  value={bulkReason}
                  onChange={(e) => setBulkReason(e.target.value)}
                />
              </div>
            )}

            {processingBulk && (
              <div className="space-y-2">
                <Label>Progress</Label>
                <Progress value={bulkProgress} />
                <p className="text-sm text-muted-foreground">Processing {Math.round(bulkProgress)}%...</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkActionDialog(false)} disabled={processingBulk}>
              Cancel
            </Button>
            <Button onClick={handleBulkAction} disabled={processingBulk}>
              {processingBulk ? "Processing..." : `${bulkAction} ${selectedItems.length} Items`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
