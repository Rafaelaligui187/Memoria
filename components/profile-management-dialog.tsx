"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit, Plus, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { UnifiedProfileSetupForm } from "./unified-profile-setup-form"
import { useAuth } from "@/contexts/auth-context"
import type { User as AuthUser } from "@/lib/types"

interface ProfileManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SchoolYear {
  _id: string
  yearLabel: string
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface UserProfile {
  id: string
  schoolYearId: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
  rejectionReason?: string
}

// Initial empty state - will be populated from API
const initialSchoolYears: SchoolYear[] = []

// User profiles will be fetched from API based on actual user data
const userProfiles: UserProfile[] = []

export function ProfileManagementDialog({ open, onOpenChange }: ProfileManagementDialogProps) {
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [availableSchoolYears, setAvailableSchoolYears] = useState<SchoolYear[]>(initialSchoolYears)
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const getUserRole = () => {
    if (!user) return "student"
    // Handle both auth context user and typed user
    const userRole = (user as any).role || (user as any).userType
    if (userRole === "faculty") return "faculty"
    if (userRole === "staff" || userRole === "utility") return "staff"
    if (userRole === "alumni") return "alumni"
    if (userRole === "admin") return "admin"
    return "student"
  }

  const getUserId = () => {
    if (!user) return ""
    return (user as any).id || (user as any).schoolId || ""
  }

  const userRole = getUserRole()
  const isYearbookProfile = userRole === "student" || userRole === "alumni"

  // Fetch user profiles from API
  const fetchUserProfiles = async () => {
    try {
      const userId = getUserId()
      if (!userId) return

      console.log('Fetching user profiles from API...')
      const response = await fetch(`/api/profiles?ownedBy=${userId}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const result = await response.json()
      
      console.log('User profiles API response:', result)
      
      if (result.success) {
        // Convert API response to UserProfile format
        const profiles: UserProfile[] = result.profiles.map((profile: any) => ({
          id: profile.id,
          schoolYearId: profile.schoolYearId,
          status: profile.status,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
          rejectionReason: profile.rejectionReason,
        }))
        setUserProfiles(profiles)
        console.log('User profiles updated:', profiles)
      } else {
        console.error('Failed to fetch user profiles:', result.message)
        setUserProfiles([])
      }
    } catch (error) {
      console.error('Error fetching user profiles:', error)
      setUserProfiles([])
    }
  }

  // Fetch available school years from API
  const fetchSchoolYears = async () => {
    setLoading(true)
    try {
      console.log('Fetching school years from API...')
      const response = await fetch('/api/school-years', {
        cache: 'no-store', // Ensure we get fresh data
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const result = await response.json()
      
      console.log('School years API response:', result)
      
      if (result.success) {
        setAvailableSchoolYears(result.data)
        console.log('Available school years updated:', result.data)
      } else {
        console.error('Failed to fetch school years:', result.error)
        setAvailableSchoolYears([])
      }

      // Also fetch user profiles to get submitted school years
      await fetchUserProfiles()
    } catch (error) {
      console.error('Error fetching school years:', error)
      setAvailableSchoolYears([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchSchoolYears()
    }
  }, [open])

  // Listen for school year updates from admin interface
  useEffect(() => {
    const handleSchoolYearsUpdate = (event: CustomEvent) => {
      console.log('School years updated event received:', event.detail)
      console.log('Profile management dialog is open:', open)
      // Add a small delay to ensure database operation completes
      setTimeout(() => {
        console.log('Fetching school years after event...')
        fetchSchoolYears()
      }, 100)
    }

    const handleProfileCreated = (event: CustomEvent) => {
      console.log('Profile created event received')
      console.log('Profile management dialog is open:', open)
      // Add a small delay to ensure database operation completes
      setTimeout(() => {
        console.log('Fetching profiles after creation...')
        fetchSchoolYears()
      }, 500)
    }

    const handleNewProfileCreated = (event: CustomEvent) => {
      console.log('New profile created event received')
      console.log('Profile management dialog is open:', open)
      // Add a small delay to ensure database operation completes
      setTimeout(() => {
        console.log('Fetching profiles after new profile creation...')
        fetchSchoolYears()
      }, 500)
    }

    // Add event listeners
    window.addEventListener('schoolYearsUpdated', handleSchoolYearsUpdate as EventListener)
    window.addEventListener('profileCreated', handleProfileCreated as EventListener)
    window.addEventListener('newProfileCreated', handleNewProfileCreated as EventListener)
    window.addEventListener('manualProfileCreated', handleProfileCreated as EventListener)

    return () => {
      window.removeEventListener('schoolYearsUpdated', handleSchoolYearsUpdate as EventListener)
      window.removeEventListener('profileCreated', handleProfileCreated as EventListener)
      window.removeEventListener('newProfileCreated', handleNewProfileCreated as EventListener)
      window.removeEventListener('manualProfileCreated', handleProfileCreated as EventListener)
    }
  }, [])

  // Refresh school years when dialog opens (to catch newly added years)
  useEffect(() => {
    if (open && !loading) {
      // Add a small delay to ensure any pending admin operations complete
      const timeoutId = setTimeout(() => {
        fetchSchoolYears()
      }, 500)
      
      return () => clearTimeout(timeoutId)
    }
  }, [open])

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
    // Refresh both school years and user profiles after save
    fetchSchoolYears()
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('profileCreated'))
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Available School Years</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchSchoolYears}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      Loading school years...
                    </div>
                  </div>
                ) : availableSchoolYears.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="text-muted-foreground mb-2">No school years available</div>
                      <div className="text-sm text-muted-foreground">
                        Contact your administrator to add school years.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {availableSchoolYears.map((schoolYear) => {
                    const existingProfile = userProfiles.find((p) => p.schoolYearId === schoolYear._id)
                    const isPending = existingProfile?.status === "pending"

                    return (
                      <Card key={schoolYear._id} className={`border-2 hover:border-primary/20 transition-colors ${isPending ? 'border-yellow-300 bg-yellow-50/30' : ''}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-primary" />
                              <div>
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-base">{schoolYear.yearLabel}</CardTitle>
                                  {isPending && (
                                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                                      PENDING
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  School Year {schoolYear.yearLabel?.replace("–", " - ") || schoolYear.yearLabel}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {schoolYear.isActive && (
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
                                onClick={() => handleEditProfile(schoolYear._id)}
                                className="w-full"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                {existingProfile.status === "rejected" ? "Edit & Resubmit" : 
                                 existingProfile.status === "approved" ? "Edit Approved Profile" : 
                                 "Edit Profile"}
                              </Button>
                              {existingProfile.status === "approved" && (
                                <p className="text-xs text-muted-foreground text-center">
                                  ✓ Approved profile - can still be edited
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                No profile created for this school year yet.
                              </p>
                              <Button onClick={() => handleCreateProfile(schoolYear._id)} className="w-full">
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
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important Notes:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• You can create one profile per school year</li>
                      <li>• All new profiles and edits require admin approval before being published</li>
                      <li>• You can edit your profile even after it's approved - edits are saved immediately</li>
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
              userId={getUserId()}
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
