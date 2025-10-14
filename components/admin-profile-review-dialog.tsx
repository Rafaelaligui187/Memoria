"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  User,
  GraduationCap,
  Briefcase,
  Calendar,
  MapPin,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Facebook,
  Instagram,
  Twitter,
  Heart,
  Users,
  Share2,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface ProfileData {
  // Basic Info
  fullName: string
  nickname?: string
  age?: number
  gender?: string
  birthday?: string
  address?: string
  email?: string
  phone?: string

  // Academic/Professional Info
  department?: string
  yearLevel?: string
  courseProgram?: string
  major?: string
  blockSection?: string
  graduationYear?: string
  position?: string
  departmentAssigned?: string
  officeAssigned?: string
  yearsOfService?: number

  // Parents/Guardian (Students)
  fatherGuardianName?: string
  motherGuardianName?: string

  // Career Info (Alumni)
  currentProfession?: string
  currentCompany?: string
  currentLocation?: string

  // Additional Info
  dreamJob?: string
  sayingMotto?: string
  messageToStudents?: string

  // Social Media
  socialMediaFacebook?: string
  socialMediaInstagram?: string
  socialMediaTwitter?: string

  // Yearbook Info
  profilePictureUrl?: string
  achievements?: string[]
  activities?: string[]
}

interface Profile {
  id: string
  userId: string
  type: "student" | "faculty" | "alumni" | "staff" | "utility"
  status: "draft" | "pending" | "approved" | "rejected"
  yearId: string
  data: ProfileData
  createdAt: string
  updatedAt: string
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

interface AdminProfileReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: Profile | null
  onApprove: (profileId: string) => void
  onReject: (profileId: string, reason: string) => void
}

export function AdminProfileReviewDialog({
  open,
  onOpenChange,
  profile,
  onApprove,
  onReject,
}: AdminProfileReviewDialogProps) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  if (!profile) return null

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      await onApprove(profile.id)
      toast({
        title: "Profile Approved",
        description: "The profile has been approved and published.",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection reason required",
        description: "Please provide a reason for rejecting this profile.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      await onReject(profile.id, rejectionReason)
      toast({
        title: "Profile Rejected",
        description: "The profile has been rejected and the user has been notified.",
      })
      onOpenChange(false)
      setRejectionReason("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: Profile["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      case "draft":
        return (
          <Badge variant="outline">
            <Eye className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        )
    }
  }

  const getRoleIcon = (type: Profile["type"]) => {
    switch (type) {
      case "student":
        return <GraduationCap className="h-4 w-4" />
      case "faculty":
        return <User className="h-4 w-4" />
      case "alumni":
        return <Users className="h-4 w-4" />
      case "staff":
      case "utility":
        return <Briefcase className="h-4 w-4" />
    }
  }

  const getRoleLabel = (type: Profile["type"]) => {
    switch (type) {
      case "student":
        return "Student"
      case "faculty":
        return "Faculty"
      case "alumni":
        return "Alumni"
      case "staff":
        return "Staff"
      case "utility":
        return "Utility/Maintenance"
    }
  }

  const getSocialLinks = () => {
    const links = []
    if (profile.data.socialMediaFacebook) {
      links.push({
        platform: "Facebook",
        value: profile.data.socialMediaFacebook,
        icon: Facebook,
      })
    }
    if (profile.data.socialMediaInstagram) {
      links.push({
        platform: "Instagram",
        value: profile.data.socialMediaInstagram,
        icon: Instagram,
      })
    }
    if (profile.data.socialMediaTwitter) {
      links.push({
        platform: "Twitter/X",
        value: profile.data.socialMediaTwitter,
        icon: Twitter,
      })
    }
    return links
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-primary">Profile Review</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Review and approve or reject this profile submission
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {getRoleIcon(profile.type)}
              <span className="font-medium">{getRoleLabel(profile.type)}</span>
              {getStatusBadge(profile.status)}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Photo & Quick Info */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="text-center space-y-4">
                {/* Profile Photo */}
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
                  {profile.data.profilePictureUrl ? (
                    <Image
                      src={profile.data.profilePictureUrl || "/placeholder.svg"}
                      alt={profile.data.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                      <User className="h-16 w-16" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div>
                  <h2 className="text-xl font-bold">
                    {profile.data.fullName}
                    {profile.data.nickname && (
                      <span className="text-muted-foreground font-normal"> "{profile.data.nickname}"</span>
                    )}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2">
                    {getRoleIcon(profile.type)}
                    <span>{getRoleLabel(profile.type)}</span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-2 text-sm">
                  {profile.data.age && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Age: {profile.data.age}</span>
                    </div>
                  )}
                  {profile.data.address && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-center">{profile.data.address}</span>
                    </div>
                  )}
                </div>

                {/* Submission Info */}
                <div className="pt-4 border-t space-y-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Submitted:</span>{" "}
                    {profile.submittedAt ? new Date(profile.submittedAt).toLocaleDateString() : "Not submitted"}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {new Date(profile.updatedAt).toLocaleDateString()}
                  </div>
                  {profile.reviewedAt && (
                    <div>
                      <span className="font-medium">Reviewed:</span> {new Date(profile.reviewedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Full Name:</span>
                    <p>{profile.data.fullName}</p>
                  </div>
                  {profile.data.nickname && (
                    <div>
                      <span className="font-medium">Nickname:</span>
                      <p>{profile.data.nickname}</p>
                    </div>
                  )}
                  {profile.data.age && (
                    <div>
                      <span className="font-medium">Age:</span>
                      <p>{profile.data.age}</p>
                    </div>
                  )}
                  {profile.data.gender && (
                    <div>
                      <span className="font-medium">Gender:</span>
                      <p>{profile.data.gender}</p>
                    </div>
                  )}
                  {profile.data.birthday && (
                    <div>
                      <span className="font-medium">Birthday:</span>
                      <p>{new Date(profile.data.birthday).toLocaleDateString()}</p>
                    </div>
                  )}
                  {profile.data.address && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Address:</span>
                      <p>{profile.data.address}</p>
                    </div>
                  )}
                  {profile.data.email && (
                    <div>
                      <span className="font-medium">Email:</span>
                      <p>{profile.data.email}</p>
                    </div>
                  )}
                  {profile.data.phone && (
                    <div>
                      <span className="font-medium">Phone:</span>
                      <p>{profile.data.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Academic Information - Students & Alumni */}
            {(profile.type === "student" || profile.type === "alumni") && (
              <Card className="p-6">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {profile.data.department && (
                      <div>
                        <span className="font-medium">Department:</span>
                        <p>{profile.data.department}</p>
                      </div>
                    )}
                    {profile.data.courseProgram && (
                      <div>
                        <span className="font-medium">Course/Program:</span>
                        <p>{profile.data.courseProgram}</p>
                      </div>
                    )}
                    {profile.data.courseProgram === "BSED" && profile.data.major && (
                      <div>
                        <span className="font-medium">Major:</span>
                        <p>Major in: {profile.data.major}</p>
                      </div>
                    )}
                    {profile.type === "student" && profile.data.yearLevel && (
                      <div>
                        <span className="font-medium">Year Level:</span>
                        <p>{profile.data.yearLevel}</p>
                      </div>
                    )}
                    {profile.type === "student" && profile.data.blockSection && (
                      <div>
                        <span className="font-medium">Section/Block:</span>
                        <p>{profile.data.blockSection}</p>
                      </div>
                    )}
                    {profile.type === "alumni" && profile.data.graduationYear && (
                      <div>
                        <span className="font-medium">Graduation Year:</span>
                        <p>{profile.data.graduationYear}</p>
                      </div>
                    )}
                    {profile.type === "student" && profile.data.dreamJob && (
                      <div>
                        <span className="font-medium">Dream Job:</span>
                        <p>{profile.data.dreamJob}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Parents/Guardian Information - Students */}
            {profile.type === "student" && (profile.data.fatherGuardianName || profile.data.motherGuardianName) && (
              <Card className="p-6">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Parents/Guardian Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {profile.data.fatherGuardianName && (
                      <div>
                        <span className="font-medium">Father's Name:</span>
                        <p>{profile.data.fatherGuardianName}</p>
                      </div>
                    )}
                    {profile.data.motherGuardianName && (
                      <div>
                        <span className="font-medium">Mother's Name:</span>
                        <p>{profile.data.motherGuardianName}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Professional Information - Faculty & Staff */}
            {(profile.type === "faculty" || profile.type === "staff" || profile.type === "utility") && (
              <Card className="p-6">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {profile.data.position && (
                      <div>
                        <span className="font-medium">Position:</span>
                        <p>{profile.data.position}</p>
                      </div>
                    )}
                    {profile.data.departmentAssigned && (
                      <div>
                        <span className="font-medium">Department:</span>
                        <p>{profile.data.departmentAssigned}</p>
                      </div>
                    )}
                    {profile.data.officeAssigned && (
                      <div>
                        <span className="font-medium">Office:</span>
                        <p>{profile.data.officeAssigned}</p>
                      </div>
                    )}
                    {profile.data.yearsOfService && (
                      <div>
                        <span className="font-medium">Years of Service:</span>
                        <p>{profile.data.yearsOfService}</p>
                      </div>
                    )}
                  </div>
                  {profile.data.messageToStudents && (
                    <div className="mt-4">
                      <span className="font-medium">Message to Students:</span>
                      <p className="mt-1 text-muted-foreground italic">"{profile.data.messageToStudents}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Career Information - Alumni */}
            {profile.type === "alumni" &&
              (profile.data.currentProfession || profile.data.currentCompany || profile.data.currentLocation) && (
                <Card className="p-6">
                  <CardHeader className="px-0 pt-0 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-purple-600" />
                      Career Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {profile.data.currentProfession && (
                        <div>
                          <span className="font-medium">Current Profession:</span>
                          <p>{profile.data.currentProfession}</p>
                        </div>
                      )}
                      {profile.data.currentCompany && (
                        <div>
                          <span className="font-medium">Company:</span>
                          <p>{profile.data.currentCompany}</p>
                        </div>
                      )}
                      {profile.data.currentLocation && (
                        <div>
                          <span className="font-medium">Location:</span>
                          <p>{profile.data.currentLocation}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Social Media Information */}
            {getSocialLinks().length > 0 && (
              <Card className="p-6">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-purple-600" />
                    Social Media
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {getSocialLinks().map((link) => {
                      const IconComponent = link.icon
                      return (
                        <div key={link.platform}>
                          <span className="font-medium flex items-center gap-1">
                            <IconComponent className="h-3 w-3" />
                            {link.platform}:
                          </span>
                          <p>{link.value}</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Yearbook Information */}
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Yearbook Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {profile.data.sayingMotto && (
                  <div className="mb-4">
                    <span className="font-medium">
                      {profile.type === "faculty" ? "Teaching Philosophy:" : "Motto/Saying:"}
                    </span>
                    <p className="mt-1 text-lg italic text-center p-4 bg-muted rounded-lg">
                      "{profile.data.sayingMotto}"
                    </p>
                  </div>
                )}

                {profile.data.achievements && profile.data.achievements.length > 0 && (
                  <div className="mb-4">
                    <span className="font-medium">Achievements/Honors:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.data.achievements.map((achievement, index) => (
                        <Badge key={index} variant="secondary">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.data.activities && profile.data.activities.length > 0 && (
                  <div>
                    <span className="font-medium">Activities & Organizations:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.data.activities.map((activity, index) => (
                        <Badge key={index} variant="outline">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Actions */}
            {profile.status === "pending" && (
              <Card className="p-6 border-2 border-dashed border-muted">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-lg">Admin Review</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
                    <Textarea
                      id="rejectionReason"
                      placeholder="Provide a clear reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleApprove}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isProcessing ? "Approving..." : "Approve Profile"}
                    </Button>
                    <Button
                      onClick={handleReject}
                      disabled={isProcessing || !rejectionReason.trim()}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {isProcessing ? "Rejecting..." : "Reject Profile"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rejection Reason Display */}
            {profile.status === "rejected" && profile.rejectionReason && (
              <Card className="p-6 border-red-200 bg-red-50">
                <CardHeader className="px-0 pt-0 pb-4">
                  <CardTitle className="text-lg text-red-800">Rejection Reason</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <p className="text-red-700">{profile.rejectionReason}</p>
                  {profile.reviewedAt && (
                    <p className="text-xs text-red-600 mt-2">
                      Rejected on {new Date(profile.reviewedAt).toLocaleDateString()}
                      {profile.reviewedBy && ` by ${profile.reviewedBy}`}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
