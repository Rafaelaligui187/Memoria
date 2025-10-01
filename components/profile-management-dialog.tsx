"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { UnifiedProfileSetupForm } from "./unified-profile-setup-form"
import { useAuth } from "@/contexts/auth-context"

interface ProfileManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SchoolYear {
  id: string
  label: string
  status: "active" | "archived" | "draft"
}

interface UserProfile {
  id: string
  schoolYearId: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
  rejectionReason?: string
}

// Mock data - replace with actual API calls
const availableSchoolYears: SchoolYear[] = [
  { id: "2024-2025", label: "2024–2025", status: "active" },
  { id: "2023-2024", label: "2023–2024", status: "archived" },
  { id: "2022-2023", label: "2022–2023", status: "archived" },
]

const userProfiles: UserProfile[] = [
  {
    id: "profile-1",
    schoolYearId: "2023-2024",
    status: "approved",
    createdAt: "2023-09-15",
    updatedAt: "2023-09-20",
  },
  {
    id: "profile-2",
    schoolYearId: "2024-2025",
    status: "pending",
    createdAt: "2024-09-10",
    updatedAt: "2024-09-10",
  },
]

export function ProfileManagementDialog({ open, onOpenChange }: ProfileManagementDialogProps) {
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useAuth()

  const getUserRole = () => {
    if (!user) return "student"
    if (user.role === "faculty") return "faculty"
    if (user.role === "staff" || user.role === "utility") return "staff"
    if (user.role === "alumni") return "alumni"
    return "student"
  }

  const userRole = getUserRole()
  const isYearbookProfile = userRole === "student" || userRole === "alumni"

  const handleCreateProfile = (schoolYearId: string) => {
    setSelectedSchoolYear(schoolYearId)
    setIsEditing(false)
    setShowProfileSetup(true)
  }

  const handleEditProfile = (schoolYearId: string) => {
    setSelectedSchoolYear(schoolYearId)
    setIsEditing(true)
    setShowProfileSetup(true)
  }

  const handleBackToList = () => {
    setShowProfileSetup(false)
    setSelectedSchoolYear(null)
    setIsEditing(false)
  }

  const handleProfileSave = () => {
    setShowProfileSetup(false)
    setSelectedSchoolYear(null)
    setIsEditing(false)
    // Optionally refresh the profile list here
  }

  const getStatusIcon = (status: UserProfile["status"]) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusBadge = (status: UserProfile["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending Approval
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {!showProfileSetup ? (
          <>
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-bold text-primary">Profile Management</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {isYearbookProfile
                  ? "Manage your yearbook profiles for different school years. You can have one profile per school year."
                  : "Manage your Faculty & Staff profiles for different school years. You can have one profile per school year."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Available School Years</h3>
                <div className="grid gap-4">
                  {availableSchoolYears.map((schoolYear) => {
                    const existingProfile = userProfiles.find((p) => p.schoolYearId === schoolYear.id)

                    return (
                      <Card key={schoolYear.id} className="border-2 hover:border-primary/20 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-primary" />
                              <div>
                                <CardTitle className="text-base">{schoolYear.label}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  School Year {schoolYear.label.replace("–", " - ")}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {schoolYear.status === "active" && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  Active
                                </Badge>
                              )}
                              {existingProfile && getStatusBadge(existingProfile.status)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {existingProfile ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {getStatusIcon(existingProfile.status)}
                                <span>
                                  Profile{" "}
                                  {existingProfile.status === "approved"
                                    ? "approved"
                                    : existingProfile.status === "pending"
                                      ? "pending admin approval"
                                      : "rejected"}
                                </span>
                              </div>

                              {existingProfile.status === "rejected" && existingProfile.rejectionReason && (
                                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                  <div className="text-sm">
                                    <p className="font-medium text-red-800">Rejection Reason:</p>
                                    <p className="text-red-700">{existingProfile.rejectionReason}</p>
                                  </div>
                                </div>
                              )}

                              <div className="text-xs text-muted-foreground">
                                Created: {new Date(existingProfile.createdAt).toLocaleDateString()}
                                {existingProfile.updatedAt !== existingProfile.createdAt && (
                                  <span> • Updated: {new Date(existingProfile.updatedAt).toLocaleDateString()}</span>
                                )}
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProfile(schoolYear.id)}
                                className="w-full"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                No profile created for this school year yet.
                              </p>
                              <Button onClick={() => handleCreateProfile(schoolYear.id)} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Profile
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important Notes:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• You can create one profile per school year</li>
                      <li>• All new profiles and edits require admin approval before being published</li>
                      <li>• You can edit your profile even after it's approved, but changes will need re-approval</li>
                      <li>• Rejected profiles can be edited and resubmitted</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <UnifiedProfileSetupForm
              schoolYearId={selectedSchoolYear!}
              isEditing={isEditing}
              onBack={handleBackToList}
              onSave={handleProfileSave}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
