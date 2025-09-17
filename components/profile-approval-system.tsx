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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Clock, Eye, MessageSquare, Plus, Filter } from "lucide-react"

interface ProfileSubmission {
  id: string
  userId: string
  userName: string
  userEmail: string
  role: "Student" | "Faculty" | "Alumni" | "Staff" | "Utility"
  department: string
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
  yearId: string
  profileData: {
    bio?: string
    achievements?: string[]
    interests?: string[]
    quote?: string
    photo?: string
    // Role-specific fields
    course?: string
    grade?: string
    position?: string
    graduationYear?: string
    subjects?: string[]
    awards?: string[]
  }
}

const mockSubmissions: ProfileSubmission[] = [
  {
    id: "1",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john.doe@example.com",
    role: "Student",
    department: "College",
    status: "pending",
    submittedAt: "2024-08-15T10:30:00Z",
    yearId: "2024-2025",
    profileData: {
      bio: "Passionate computer science student with interests in AI and web development.",
      achievements: ["Dean's List", "Programming Competition Winner"],
      interests: ["Coding", "Gaming", "Music"],
      quote: "Code is poetry in motion.",
      course: "BSIT",
      grade: "4th Year",
    },
  },
  {
    id: "2",
    userId: "user2",
    userName: "Dr. Maria Santos",
    userEmail: "maria.santos@example.com",
    role: "Faculty",
    department: "College",
    status: "pending",
    submittedAt: "2024-08-14T14:20:00Z",
    yearId: "2024-2025",
    profileData: {
      bio: "Professor of Mathematics with 15 years of teaching experience.",
      achievements: ["Outstanding Teacher Award", "Research Publication"],
      interests: ["Mathematics", "Research", "Teaching"],
      quote: "Mathematics is the language of the universe.",
      position: "Professor",
      subjects: ["Calculus", "Statistics", "Linear Algebra"],
    },
  },
  {
    id: "3",
    userId: "user3",
    userName: "Jane Smith",
    userEmail: "jane.smith@example.com",
    role: "Alumni",
    department: "College",
    status: "rejected",
    submittedAt: "2024-08-13T09:15:00Z",
    reviewedAt: "2024-08-14T11:30:00Z",
    reviewedBy: "Admin User",
    rejectionReason: "Inappropriate content in bio section",
    yearId: "2024-2025",
    profileData: {
      bio: "Alumni working in tech industry.",
      graduationYear: "2020",
      course: "BSIT",
    },
  },
]

const rejectionReasons = [
  "Inappropriate content",
  "Incomplete information",
  "Photo quality issues",
  "Violation of community guidelines",
  "Spam or promotional content",
  "Duplicate submission",
  "Other (specify below)",
]

interface ProfileApprovalSystemProps {
  selectedYear: string
}

export function ProfileApprovalSystem({ selectedYear }: ProfileApprovalSystemProps) {
  const [submissions, setSubmissions] = useState<ProfileSubmission[]>(
    mockSubmissions.filter((sub) => sub.yearId === selectedYear),
  )
  const [selectedSubmission, setSelectedSubmission] = useState<ProfileSubmission | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterRole, setFilterRole] = useState<string>("all")
  const { toast } = useToast()

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus
    const matchesRole = filterRole === "all" || sub.role === filterRole
    return matchesStatus && matchesRole
  })

  const pendingCount = submissions.filter((sub) => sub.status === "pending").length
  const approvedCount = submissions.filter((sub) => sub.status === "approved").length
  const rejectedCount = submissions.filter((sub) => sub.status === "rejected").length

  const handleApprove = () => {
    if (!selectedSubmission) return

    const updatedSubmissions = submissions.map((sub) =>
      sub.id === selectedSubmission.id
        ? {
            ...sub,
            status: "approved" as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: "Admin User",
          }
        : sub,
    )

    setSubmissions(updatedSubmissions)
    setApproveDialogOpen(false)
    setSelectedSubmission(null)

    toast({
      title: "Profile Approved",
      description: `${selectedSubmission.userName}'s profile has been approved and is now live.`,
    })
  }

  const handleReject = () => {
    if (!selectedSubmission) return

    const reason = selectedReason === "Other (specify below)" ? customReason : selectedReason
    if (!reason) {
      toast({
        title: "Error",
        description: "Please select or specify a rejection reason.",
        variant: "destructive",
      })
      return
    }

    const updatedSubmissions = submissions.map((sub) =>
      sub.id === selectedSubmission.id
        ? {
            ...sub,
            status: "rejected" as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: "Admin User",
            rejectionReason: reason,
          }
        : sub,
    )

    setSubmissions(updatedSubmissions)
    setRejectDialogOpen(false)
    setSelectedSubmission(null)
    setSelectedReason("")
    setCustomReason("")

    toast({
      title: "Profile Rejected",
      description: `${selectedSubmission.userName}'s profile has been rejected with feedback.`,
    })
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
          <h2 className="text-2xl font-bold tracking-tight">Profile Approval System</h2>
          <p className="text-muted-foreground">Review and approve profile submissions for {selectedYear}</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Manual Profile
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Live profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Need revision</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Faculty">Faculty</SelectItem>
                <SelectItem value="Alumni">Alumni</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Utility">Utility</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Approval Queue</TabsTrigger>
          <TabsTrigger value="approved">Approved Profiles</TabsTrigger>
          <TabsTrigger value="rejected">Rejected Profiles</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Pending Approvals ({filteredSubmissions.filter((s) => s.status === "pending").length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredSubmissions
                .filter((s) => s.status === "pending")
                .map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={submission.profileData.photo || "/placeholder.svg"} />
                        <AvatarFallback>
                          {submission.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{submission.userName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {submission.role} • {submission.department}
                        </p>
                        <p className="text-xs text-muted-foreground">Submitted {formatDate(submission.submittedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(submission.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSubmission(submission)
                          setViewDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              {filteredSubmissions.filter((s) => s.status === "pending").length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending submissions to review</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Approved Profiles ({filteredSubmissions.filter((s) => s.status === "approved").length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredSubmissions
                .filter((s) => s.status === "approved")
                .map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={submission.profileData.photo || "/placeholder.svg"} />
                        <AvatarFallback>
                          {submission.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{submission.userName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {submission.role} • {submission.department}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Approved {submission.reviewedAt ? formatDate(submission.reviewedAt) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(submission.status)}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Rejected Profiles ({filteredSubmissions.filter((s) => s.status === "rejected").length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredSubmissions
                .filter((s) => s.status === "rejected")
                .map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={submission.profileData.photo || "/placeholder.svg"} />
                        <AvatarFallback>
                          {submission.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{submission.userName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {submission.role} • {submission.department}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Rejected {submission.reviewedAt ? formatDate(submission.reviewedAt) : "N/A"}
                        </p>
                        {submission.rejectionReason && (
                          <p className="text-xs text-red-600">Reason: {submission.rejectionReason}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(submission.status)}
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Profile Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Profile Submission</DialogTitle>
            <DialogDescription>Review {selectedSubmission?.userName}'s profile submission</DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedSubmission.profileData.photo || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {selectedSubmission.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedSubmission.userName}</h3>
                  <p className="text-muted-foreground">
                    {selectedSubmission.role} • {selectedSubmission.department}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.userEmail}</p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedSubmission.profileData.bio && (
                  <div>
                    <Label className="text-sm font-medium">Biography</Label>
                    <p className="text-sm mt-1">{selectedSubmission.profileData.bio}</p>
                  </div>
                )}

                {selectedSubmission.profileData.quote && (
                  <div>
                    <Label className="text-sm font-medium">Quote</Label>
                    <p className="text-sm mt-1 italic">"{selectedSubmission.profileData.quote}"</p>
                  </div>
                )}

                {selectedSubmission.profileData.achievements &&
                  selectedSubmission.profileData.achievements.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Achievements</Label>
                      <ul className="text-sm mt-1 list-disc list-inside">
                        {selectedSubmission.profileData.achievements.map((achievement, index) => (
                          <li key={index}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {selectedSubmission.profileData.interests && selectedSubmission.profileData.interests.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Interests</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedSubmission.profileData.interests.map((interest, index) => (
                        <Badge key={index} variant="outline">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedSubmission?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 bg-transparent"
                  onClick={() => {
                    setViewDialogOpen(false)
                    setRejectDialogOpen(true)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setViewDialogOpen(false)
                    setApproveDialogOpen(true)
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

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve {selectedSubmission?.userName}'s profile? This will make it live in the
              yearbook.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              Approve Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Profile</DialogTitle>
            <DialogDescription>
              Please select a reason for rejecting {selectedSubmission?.userName}'s profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
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
            {selectedReason === "Other (specify below)" && (
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
