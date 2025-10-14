"use client"

import { useState, useEffect } from "react"
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
import { notificationService } from "@/lib/notification-service"
import { UnifiedProfileSetupForm } from "@/components/unified-profile-setup-form"
import { CreateManualProfileForm } from "@/components/create-manual-profile-form"
import { CheckCircle, XCircle, Clock, Eye, MessageSquare, Plus, Filter, Edit } from "lucide-react"

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
    // Basic Info (all roles)
    fullName?: string
    nickname?: string
    age?: number
    gender?: string
    birthday?: string
    address?: string
    email?: string
    phone?: string

    // Yearbook Info (all roles)
    profilePictureUrl?: string
    sayingMotto?: string
    achievements?: string[]

    // Student & Alumni fields
    fatherGuardianName?: string
    motherGuardianName?: string
    department?: string
    yearLevel?: string
    courseProgram?: string
    major?: string
    blockSection?: string
    dreamJob?: string
    socialMediaFacebook?: string
    socialMediaInstagram?: string
    socialMediaTwitter?: string
    graduationYear?: string

    // Faculty fields
    position?: string
    departmentAssigned?: string
    yearsOfService?: number
    messageToStudents?: string

    // Staff fields
    officeAssigned?: string

    // Alumni career fields
    currentProfession?: string
    currentCompany?: string
    currentLocation?: string

    // Legacy fields for backward compatibility
    bio?: string
    interests?: string[]
    quote?: string
    photo?: string
    course?: string
    grade?: string
    subjects?: string[]
    awards?: string[]
  }
}


interface ProfileApprovalSystemProps {
  selectedYear: string
  selectedYearLabel?: string
}

export function ProfileApprovalSystem({ selectedYear, selectedYearLabel }: ProfileApprovalSystemProps) {
  const [submissions, setSubmissions] = useState<ProfileSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ProfileSubmission | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [selectedRejectReasons, setSelectedRejectReasons] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createManualDialogOpen, setCreateManualDialogOpen] = useState(false)
  const { toast } = useToast()

  // Fetch profiles from API
  const fetchProfiles = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/profiles?schoolYearId=${selectedYear}`)
      const result = await response.json()
      
      if (result.success) {
        // Convert API accounts to ProfileSubmission format
        const profileSubmissions: ProfileSubmission[] = result.accounts.map((account: any) => ({
          id: account.profileId || account.id,
          userId: account.id,
          userName: account.name,
          userEmail: account.email,
          role: account.role as "Student" | "Faculty" | "Alumni" | "Staff" | "Utility",
          department: account.department,
          status: account.profileStatus || "pending",
          submittedAt: account.createdAt,
          reviewedAt: account.reviewedAt,
          reviewedBy: account.reviewedBy,
          rejectionReason: account.rejectionReason,
          yearId: selectedYear,
          profileData: account
        }))
        setSubmissions(profileSubmissions)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch profiles",
          variant: "destructive",
        })
        setSubmissions([])
      }
    } catch (error) {
      console.error('Error fetching profiles:', error)
      toast({
        title: "Error",
        description: "Failed to fetch profiles. Please try again.",
        variant: "destructive",
      })
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when selectedYear changes
  useEffect(() => {
    if (selectedYear) {
      fetchProfiles()
    }
  }, [selectedYear])

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus
    const matchesRole = filterRole === "all" || sub.role === filterRole
    return matchesStatus && matchesRole
  }).sort((a, b) => {
    // Sort by submission date - newest first for pending, oldest first for approved/rejected
    if (a.status === "pending" && b.status === "pending") {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    }
    if (a.status === "approved" && b.status === "approved") {
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    }
    if (a.status === "rejected" && b.status === "rejected") {
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    }
    return 0
  })

  const pendingCount = submissions.filter((sub) => sub.status === "pending").length
  const approvedCount = submissions.filter((sub) => sub.status === "approved").length
  const rejectedCount = submissions.filter((sub) => sub.status === "rejected").length

  const handleApprove = async () => {
    if (!selectedSubmission) return

    try {
      const response = await fetch(`/api/admin/${selectedYear}/profiles/${selectedSubmission.id}/approve`, {
        method: 'POST',
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Profile Approved",
          description: `${selectedSubmission.userName}'s profile has been approved.`,
        })
        // Refresh the profiles list
        fetchProfiles()
        
        // Create notification for profile approval
        await notificationService.notifyProfileApproved(
          selectedSubmission.userName,
          selectedSubmission.id,
          selectedYear
        )
        
        // Dispatch custom event to refresh admin overview stats
        window.dispatchEvent(new CustomEvent('profileApproved'))
        setApproveDialogOpen(false)
        setSelectedSubmission(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to approve profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error approving profile:', error)
      toast({
        title: "Error",
        description: "Failed to approve profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async () => {
    if (!selectedSubmission) return

    // Use selectedRejectReasons or fallback to selectedReason/customReason
    const reasons = selectedRejectReasons.length > 0 
      ? selectedRejectReasons 
      : selectedReason === "Other (specify below)" 
        ? [customReason] 
        : [selectedReason]
    
    const customRejectionReason = customReason || ""

    if (reasons.length === 0 || !reasons[0]) {
      toast({
        title: "Error",
        description: "Please select or specify a rejection reason.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/admin/${selectedYear}/profiles/${selectedSubmission.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reasons,
          customReason: customRejectionReason
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: "Profile Rejected",
          description: `${selectedSubmission.userName}'s profile has been rejected.`,
        })
        // Refresh the profiles list
        fetchProfiles()
        
        // Create notification for profile rejection
        await notificationService.notifyProfileRejected(
          selectedSubmission.userName,
          selectedSubmission.id,
          selectedYear,
          rejectionReason
        )
        
        // Dispatch custom event to refresh admin overview stats
        window.dispatchEvent(new CustomEvent('profileRejected'))
        setRejectDialogOpen(false)
        setSelectedSubmission(null)
        setSelectedReason("")
        setCustomReason("")
        setSelectedRejectReasons([])
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to reject profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error rejecting profile:', error)
      toast({
        title: "Error",
        description: "Failed to reject profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditProfile = (submission: ProfileSubmission) => {
    setSelectedSubmission(submission)
    setEditDialogOpen(true)
  }

  const handleEditSave = () => {
    // Close edit dialog and refresh profiles
    setEditDialogOpen(false)
    setSelectedSubmission(null)
    fetchProfiles()
    toast({
      title: "Profile Updated",
      description: "Profile has been updated successfully.",
    })
  }

  // Helper function to check if profile was submitted recently (within last 24 hours)
  const isRecentlySubmitted = (submittedAt: string) => {
    const submissionDate = new Date(submittedAt)
    const now = new Date()
    const hoursDiff = (now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60)
    return hoursDiff <= 24
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
          <p className="text-muted-foreground">Review and approve profile submissions for {selectedYearLabel || selectedYear}</p>
        </div>
        <Button onClick={() => setCreateManualDialogOpen(true)}>
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
                        <AvatarImage
                          src={
                            submission.profileData.profilePictureUrl ||
                            submission.profileData.photo ||
                            "/placeholder.svg"
                          }
                        />
                        <AvatarFallback>
                          {submission.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{submission.profileData.fullName || submission.userName}</h4>
                          {submission.status === "pending" && isRecentlySubmitted(submission.submittedAt) && (
                            <Badge variant="destructive" className="text-xs">
                              NEW
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {submission.role} • {submission.department}
                        </p>
                        <p className="text-xs text-muted-foreground">Submitted {formatDate(submission.submittedAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(submission.status)}
                      {submission.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProfile(submission)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
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
                        <AvatarImage
                          src={
                            submission.profileData.profilePictureUrl ||
                            submission.profileData.photo ||
                            "/placeholder.svg"
                          }
                        />
                        <AvatarFallback>
                          {submission.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{submission.profileData.fullName || submission.userName}</h4>
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
                        <AvatarImage
                          src={
                            submission.profileData.profilePictureUrl ||
                            submission.profileData.photo ||
                            "/placeholder.svg"
                          }
                        />
                        <AvatarFallback>
                          {submission.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{submission.profileData.fullName || submission.userName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {submission.role} • {submission.department}
                        </p>
                        <p className="text-sm text-muted-foreground">
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
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Profile Submission</DialogTitle>
            <DialogDescription>Review {selectedSubmission?.userName}'s profile submission</DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={
                      selectedSubmission.profileData.profilePictureUrl ||
                      selectedSubmission.profileData.photo ||
                      "/placeholder.svg"
                    }
                  />
                  <AvatarFallback className="text-lg">
                    {selectedSubmission.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedSubmission.profileData.fullName || selectedSubmission.userName}
                  </h3>
                  {selectedSubmission.profileData.nickname && (
                    <p className="text-muted-foreground italic">"{selectedSubmission.profileData.nickname}"</p>
                  )}
                  <p className="text-muted-foreground">
                    {selectedSubmission.role} • {selectedSubmission.department}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubmission.profileData.email || selectedSubmission.userEmail}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="academic">Academic/Professional</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="yearbook">Yearbook</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSubmission.profileData.age && (
                      <div>
                        <Label className="text-sm font-medium">Age</Label>
                        <p className="text-sm mt-1">{selectedSubmission.profileData.age}</p>
                      </div>
                    )}
                    {selectedSubmission.profileData.gender && (
                      <div>
                        <Label className="text-sm font-medium">Gender</Label>
                        <p className="text-sm mt-1">{selectedSubmission.profileData.gender}</p>
                      </div>
                    )}
                    {selectedSubmission.profileData.birthday && (
                      <div>
                        <Label className="text-sm font-medium">Birthday</Label>
                        <p className="text-sm mt-1">
                          {new Date(selectedSubmission.profileData.birthday).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedSubmission.profileData.phone && (
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <p className="text-sm mt-1">{selectedSubmission.profileData.phone}</p>
                      </div>
                    )}
                  </div>
                  {selectedSubmission.profileData.address && (
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm mt-1">{selectedSubmission.profileData.address}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="academic" className="space-y-4 mt-4">
                  {/* Student & Alumni Academic Info */}
                  {(selectedSubmission.role === "Student" || selectedSubmission.role === "Alumni") && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSubmission.profileData.department && (
                          <div>
                            <Label className="text-sm font-medium">Department</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.department}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.yearLevel && (
                          <div>
                            <Label className="text-sm font-medium">Year Level</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.yearLevel}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.courseProgram && (
                          <div>
                            <Label className="text-sm font-medium">Course/Program</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.courseProgram}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.courseProgram === "BSED" && selectedSubmission.profileData.major && (
                          <div>
                            <Label className="text-sm font-medium">Major</Label>
                            <p className="text-sm mt-1">Major in: {selectedSubmission.profileData.major}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.blockSection && (
                          <div>
                            <Label className="text-sm font-medium">Block/Section</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.blockSection}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.graduationYear && (
                          <div>
                            <Label className="text-sm font-medium">Graduation Year</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.graduationYear}</p>
                          </div>
                        )}
                      </div>

                      {/* Alumni Career Info */}
                      {selectedSubmission.role === "Alumni" && (
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-3">Career Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedSubmission.profileData.currentProfession && (
                              <div>
                                <Label className="text-sm font-medium">Current Profession</Label>
                                <p className="text-sm mt-1">{selectedSubmission.profileData.currentProfession}</p>
                              </div>
                            )}
                            {selectedSubmission.profileData.currentCompany && (
                              <div>
                                <Label className="text-sm font-medium">Company</Label>
                                <p className="text-sm mt-1">{selectedSubmission.profileData.currentCompany}</p>
                              </div>
                            )}
                            {selectedSubmission.profileData.currentLocation && (
                              <div>
                                <Label className="text-sm font-medium">Location</Label>
                                <p className="text-sm mt-1">{selectedSubmission.profileData.currentLocation}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Faculty Professional Info */}
                  {selectedSubmission.role === "Faculty" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSubmission.profileData.position && (
                          <div>
                            <Label className="text-sm font-medium">Position</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.position}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.departmentAssigned && (
                          <div>
                            <Label className="text-sm font-medium">Department Assigned</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.departmentAssigned}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.yearsOfService && (
                          <div>
                            <Label className="text-sm font-medium">Years of Service</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.yearsOfService}</p>
                          </div>
                        )}
                      </div>
                      {selectedSubmission.profileData.messageToStudents && (
                        <div>
                          <Label className="text-sm font-medium">Message to Students</Label>
                          <p className="text-sm mt-1 italic">"{selectedSubmission.profileData.messageToStudents}"</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Staff Professional Info */}
                  {(selectedSubmission.role === "Staff" || selectedSubmission.role === "Utility") && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSubmission.profileData.position && (
                          <div>
                            <Label className="text-sm font-medium">Position</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.position}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.officeAssigned && (
                          <div>
                            <Label className="text-sm font-medium">Office Assigned</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.officeAssigned}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.yearsOfService && (
                          <div>
                            <Label className="text-sm font-medium">Years of Service</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.yearsOfService}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="personal" className="space-y-4 mt-4">
                  {/* Parents/Guardian Info for Students */}
                  {selectedSubmission.role === "Student" && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Parents/Guardian Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSubmission.profileData.fatherGuardianName && (
                          <div>
                            <Label className="text-sm font-medium">Father's Name</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.fatherGuardianName}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.motherGuardianName && (
                          <div>
                            <Label className="text-sm font-medium">Mother's Name</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.motherGuardianName}</p>
                          </div>
                        )}
                      </div>
                      {selectedSubmission.profileData.dreamJob && (
                        <div>
                          <Label className="text-sm font-medium">Dream Job</Label>
                          <p className="text-sm mt-1">{selectedSubmission.profileData.dreamJob}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Social Media */}
                  {(selectedSubmission.profileData.socialMediaFacebook ||
                    selectedSubmission.profileData.socialMediaInstagram ||
                    selectedSubmission.profileData.socialMediaTwitter) && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Social Media</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedSubmission.profileData.socialMediaFacebook && (
                          <div>
                            <Label className="text-sm font-medium">Facebook</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.socialMediaFacebook}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.socialMediaInstagram && (
                          <div>
                            <Label className="text-sm font-medium">Instagram</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.socialMediaInstagram}</p>
                          </div>
                        )}
                        {selectedSubmission.profileData.socialMediaTwitter && (
                          <div>
                            <Label className="text-sm font-medium">Twitter/X</Label>
                            <p className="text-sm mt-1">{selectedSubmission.profileData.socialMediaTwitter}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Legacy Bio */}
                  {selectedSubmission.profileData.bio && (
                    <div>
                      <Label className="text-sm font-medium">Biography</Label>
                      <p className="text-sm mt-1">{selectedSubmission.profileData.bio}</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="yearbook" className="space-y-4 mt-4">
                  {(selectedSubmission.profileData.sayingMotto || selectedSubmission.profileData.quote) && (
                    <div>
                      <Label className="text-sm font-medium">Motto/Quote</Label>
                      <p className="text-sm mt-1 italic">
                        "{selectedSubmission.profileData.sayingMotto || selectedSubmission.profileData.quote}"
                      </p>
                    </div>
                  )}

                  {selectedSubmission.profileData.achievements &&
                    selectedSubmission.profileData.achievements.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Achievements</Label>
                        <ul className="text-sm mt-1 list-disc list-inside space-y-1">
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
                </TabsContent>
              </Tabs>
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
              Please provide a reason for rejecting {selectedSubmission?.userName}'s profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Reasons:</Label>
              <div className="space-y-2">
                {rejectionReasons.filter(reason => reason !== "Other (specify below)").map((reason) => (
                  <label key={reason} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedRejectReasons.includes(reason)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRejectReasons([...selectedRejectReasons, reason])
                        } else {
                          setSelectedRejectReasons(selectedRejectReasons.filter(r => r !== reason))
                        }
                      }}
                    />
                    <span className="text-sm">{reason}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Additional Notes (Optional):</Label>
              <Textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter additional rejection details..."
                rows={3}
              />
            </div>
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

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Edit {selectedSubmission?.userName}'s profile submission
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <UnifiedProfileSetupForm
              schoolYearId={selectedYear}
              userId={selectedSubmission.userId}
              isEditing={true}
              onBack={() => setEditDialogOpen(false)}
              onSave={handleEditSave}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Manual Profile Dialog */}
      <Dialog open={createManualDialogOpen} onOpenChange={setCreateManualDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Manual Profile</DialogTitle>
            <DialogDescription>
              Create a new profile manually for {selectedYear}
            </DialogDescription>
          </DialogHeader>
          <CreateManualProfileForm
            schoolYearId={selectedYear}
            onBack={() => setCreateManualDialogOpen(false)}
            onSave={() => {
              setCreateManualDialogOpen(false)
              fetchProfiles()
              
              // Trigger events to update other pages
              window.dispatchEvent(new CustomEvent('facultyProfilesUpdated'))
              window.dispatchEvent(new CustomEvent('staffProfilesUpdated'))
              window.dispatchEvent(new CustomEvent('alumniProfilesUpdated'))
              window.dispatchEvent(new CustomEvent('studentProfilesUpdated'))
              
              toast({
                title: "Profile Created",
                description: "Manual profile has been created successfully.",
              })
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

const rejectionReasons = [
  "Incomplete information",
  "Inappropriate content",
  "Duplicate submission",
  "Invalid data format",
  "Missing required fields",
]
