"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Plus,
  Upload,
  Save,
  User,
  GraduationCap,
  Heart,
  Users,
  ArrowLeft,
  AlertCircle,
  Calendar,
  Share2,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import { calculateAge } from "@/lib/age-utils"

interface YearbookProfileSetupFormProps {
  schoolYearId: string
  userRole: "student" | "alumni" // Add userRole prop to remove role selection
  isEditing?: boolean
  userId?: string // Add userId for fetching existing data
  onBack: () => void
  onSave: () => void
}

const departmentData = {
  "Senior High": {
    yearLevels: ["Grade 11", "Grade 12"],
    programs: {
      STEM: ["STEM 1", "STEM 2", "STEM 3", "STEM 4", "STEM 5"],
      HUMSS: ["HUMSS 1", "HUMSS 2", "HUMSS 3", "HUMSS 4", "HUMSS 5"],
      ABM: ["ABM 1", "ABM 2", "ABM 3", "ABM 4", "ABM 5"],
      TVL: ["TVL 1", "TVL 2", "TVL 3", "TVL 4", "TVL 5"],
      HE: ["HE 1", "HE 2", "HE 3", "HE 4", "HE 5"],
      ICT: ["ICT 1", "ICT 2", "ICT 3", "ICT 4", "ICT 5"],
    },
  },
  College: {
    yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    programs: {
      "BS Information Technology": ["IT-A", "IT-B", "IT-C", "IT-D", "IT-E", "IT-F"],
      "BEED": ["BEED-A", "BEED-B", "BEED-C", "BEED-D", "BEED-E", "BEED-F"],
      "BSED": ["BSED-A", "BSED-B", "BSED-C", "BSED-D", "BSED-E", "BSED-F"],
      "BS Hospitality Management": ["HM-A", "HM-B", "HM-C", "HM-D", "HM-E", "HM-F"],
      "BS Entrepreneurship": ["ENT-A", "ENT-B", "ENT-C", "ENT-D", "ENT-E", "ENT-F"],
      "BPed": ["PED-A", "PED-B", "PED-C", "PED-D", "PED-E", "PED-F"],
    },
  },
  "Graduate School": {
    yearLevels: ["Master's", "Doctorate"],
    programs: {
      "Master of Science in Computer Science": ["MSCS-A", "MSCS-B"],
      "Master of Business Administration": ["MBA-A", "MBA-B"],
      "Doctor of Philosophy": ["PhD-A", "PhD-B"],
    },
  },
  Elementary: {
    yearLevels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    programs: {
      Elementary: ["Section A", "Section B", "Section C", "Section D"],
    },
  },
  "Junior High": {
    yearLevels: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
    programs: {
      "Junior High": ["Section A", "Section B", "Section C", "Section D"],
    },
  },
}

export function YearbookProfileSetupForm({
  schoolYearId,
  userRole, // Accept userRole as prop instead of selecting it
  isEditing = false,
  userId,
  onBack,
  onSave,
}: YearbookProfileSetupFormProps) {
  const [achievements, setAchievements] = useState<string[]>([])
  const [activities, setActivities] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")
  const [newActivity, setNewActivity] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    age: "",
    birthday: "",
    address: "",
    sayingMotto: "",
    fatherGuardianName: "",
    motherGuardianName: "",
    department: "",
    yearLevel: "",
    courseProgram: "",
    major: "",
    blockSection: "",
    dreamJob: "",
    facebook: "",
    instagram: "",
    twitter: "",
    graduationYear: "",
    currentJobTitle: "",
    currentEmployer: "",
    location: "",
    messageToStudents: "",
    // Legacy fields for backward compatibility
    quote: "",
    ambition: "",
    hobbies: "",
    honors: "",
    officerRole: "",
  })

  const [availableYearLevels, setAvailableYearLevels] = useState<string[]>([])
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([])
  const [availableSections, setAvailableSections] = useState<string[]>([])
  const [availableMajors, setAvailableMajors] = useState<string[]>([])
  const [showMajorsDropdown, setShowMajorsDropdown] = useState(false)
  const [programDetails, setProgramDetails] = useState<any>({})

  useEffect(() => {
    if (formData.department && departmentData[formData.department as keyof typeof departmentData]) {
      const deptData = departmentData[formData.department as keyof typeof departmentData]
      setAvailableYearLevels(deptData.yearLevels)
      setAvailablePrograms(Object.keys(deptData.programs))

      // Reset dependent fields
      setFormData((prev) => ({ ...prev, yearLevel: "", courseProgram: "", major: "", blockSection: "" }))
      setAvailableSections([])
      setShowMajorsDropdown(false)
      setAvailableMajors([])
    }
  }, [formData.department])

  useEffect(() => {
    if (
      formData.department &&
      formData.courseProgram &&
      departmentData[formData.department as keyof typeof departmentData]
    ) {
      // Check if course has majors
      if (formData.department === 'College' && programDetails[formData.courseProgram]) {
        const courseDetails = programDetails[formData.courseProgram]
        if (courseDetails.majorType === 'has-major' && courseDetails.majors && courseDetails.majors.length > 0) {
          setShowMajorsDropdown(true)
          setAvailableMajors(courseDetails.majors)
        } else {
          setShowMajorsDropdown(false)
          setAvailableMajors([])
        }
      } else {
        setShowMajorsDropdown(false)
        setAvailableMajors([])
      }

      // Reset section and major fields
      setFormData((prev) => ({ ...prev, major: "", blockSection: "" }))
    }
  }, [formData.department, formData.courseProgram, programDetails])

  // Fetch filtered sections when course/strand and year level are selected
  useEffect(() => {
    const fetchFilteredSections = async () => {
      if (formData.department && formData.courseProgram && formData.yearLevel) {
        try {
          const params = new URLSearchParams({
            schoolYearId: schoolYearId,
            department: formData.department,
            program: formData.courseProgram,
            yearLevel: formData.yearLevel
          })
          
          // Add major parameter if available for College courses
          if (formData.department === 'College' && formData.major) {
            params.append('major', formData.major)
          }
          
          const response = await fetch(`/api/admin/form-data?${params}`)
          const result = await response.json()
          
          if (result.success) {
            setAvailableSections(result.data.sections || [])
            console.log(`Filtered sections for ${formData.department} - ${formData.courseProgram} - ${formData.yearLevel}:`, result.data.sections)
            
            // Reset block/section selection if current selection is not available
            if (formData.blockSection && !result.data.sections.includes(formData.blockSection)) {
              setFormData(prev => ({ ...prev, blockSection: "" }))
            }
          }
        } catch (error) {
          console.error('Error fetching filtered sections:', error)
        }
      } else {
        // If not all required fields are selected, clear sections
        setAvailableSections([])
        if (formData.blockSection) {
          setFormData(prev => ({ ...prev, blockSection: "" }))
        }
      }
    }

    fetchFilteredSections()
  }, [formData.department, formData.courseProgram, formData.yearLevel, formData.major, schoolYearId])

  // State for school year label
  const [schoolYearLabel, setSchoolYearLabel] = useState<string>('')

  // Fetch form data and program details from API
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/admin/form-data?schoolYearId=${schoolYearId}`)
        const result = await response.json()
        
        if (result.success) {
          setProgramDetails(result.data.programDetails || {})
          console.log('Program details loaded for yearbook form:', result.data.programDetails)
        } else {
          console.error('Failed to fetch form data:', result.error)
        }
      } catch (error) {
        console.error('Error fetching form data:', error)
      }
    }

    fetchFormData()
  }, [schoolYearId])

  // Fetch school year label from API
  useEffect(() => {
    const fetchSchoolYearLabel = async () => {
      try {
        const response = await fetch('/api/school-years')
        const result = await response.json()
        
        if (result.success && result.data) {
          const schoolYear = result.data.find((year: any) => 
            year._id === schoolYearId || year._id?.toString() === schoolYearId
          )
          if (schoolYear) {
            setSchoolYearLabel(schoolYear.yearLabel)
          }
        }
      } catch (error) {
        console.error('Error fetching school year label:', error)
      }
    }

    if (schoolYearId) {
      fetchSchoolYearLabel()
    }
  }, [schoolYearId])

  // Fetch existing profile data when editing
  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!isEditing || !userId || !schoolYearId) return

      try {
        console.log('Fetching existing profile for editing:', { userId, schoolYearId })
        
        const response = await fetch(`/api/profiles?ownedBy=${userId}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        
        const result = await response.json()
        
        if (result.success && result.profiles) {
          // Find the profile for the current school year
          const existingProfile = result.profiles.find((profile: any) => 
            profile.schoolYearId === schoolYearId
          )
          
          if (existingProfile) {
            console.log('Found existing profile for editing:', existingProfile)
            
            // Pre-fill form data with existing profile data
            setFormData({
              fullName: existingProfile.fullName || "",
              nickname: existingProfile.nickname || "",
              age: existingProfile.age?.toString() || "",
              birthday: existingProfile.birthday ? new Date(existingProfile.birthday).toISOString().split('T')[0] : "",
              address: existingProfile.address || "",
              sayingMotto: existingProfile.sayingMotto || "",
              fatherGuardianName: existingProfile.fatherGuardianName || "",
              motherGuardianName: existingProfile.motherGuardianName || "",
              department: existingProfile.department || "",
              yearLevel: existingProfile.yearLevel || "",
              courseProgram: existingProfile.courseProgram || "",
              major: existingProfile.major || "",
              blockSection: existingProfile.blockSection || "",
              dreamJob: existingProfile.dreamJob || "",
              facebook: existingProfile.socialMediaFacebook || "",
              instagram: existingProfile.socialMediaInstagram || "",
              twitter: existingProfile.socialMediaTwitter || "",
              graduationYear: existingProfile.graduationYear || "",
              currentJobTitle: existingProfile.currentProfession || "",
              currentEmployer: existingProfile.currentCompany || "",
              location: existingProfile.currentLocation || "",
              messageToStudents: existingProfile.messageToStudents || "",
              quote: existingProfile.quote || "",
              ambition: existingProfile.ambition || "",
              hobbies: existingProfile.hobbies || "",
              honors: existingProfile.honors || "",
              officerRole: existingProfile.officerRole || "",
            })

            // Set profile photo if exists
            if (existingProfile.profilePicture) {
              setProfilePhoto(existingProfile.profilePicture)
            }

            // Set achievements array if exists
            if (existingProfile.achievements && Array.isArray(existingProfile.achievements)) {
              setAchievements(existingProfile.achievements)
            } else if (existingProfile.achievements && typeof existingProfile.achievements === 'string') {
              setAchievements(existingProfile.achievements.split(',').map(a => a.trim()).filter(a => a))
            }

            // Set activities array if exists
            if (existingProfile.activities && Array.isArray(existingProfile.activities)) {
              setActivities(existingProfile.activities)
            } else if (existingProfile.activities && typeof existingProfile.activities === 'string') {
              setActivities(existingProfile.activities.split(',').map(a => a.trim()).filter(a => a))
            }

            console.log('Form data pre-filled with existing profile')
          } else {
            console.log('No existing profile found for this school year')
          }
        } else {
          console.error('Failed to fetch existing profile:', result.message)
        }
      } catch (error) {
        console.error('Error fetching existing profile:', error)
      }
    }

    fetchExistingProfile()
  }, [isEditing, userId, schoolYearId])

  // Get school year label for display and data
  const getSchoolYearLabel = (yearId: string) => {
    return schoolYearLabel || yearId.replace("-", "–") // Fallback to regex if API call fails
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Auto-calculate age when birthday changes
    if (field === "birthday" && value) {
      const calculatedAge = calculateAge(value)
      if (calculatedAge !== null) {
        setFormData((prev) => ({ ...prev, age: calculatedAge.toString() }))
      }
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSectionBlockChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sectionBlock: value }))
    // Removed setShowOtherSection logic as it's no longer needed with dynamic sections
    if (errors.sectionBlock) {
      setErrors((prev) => ({ ...prev, sectionBlock: "" }))
    }
  }

  const addAchievement = () => {
    if (newAchievement.trim() && achievements.length < 10) {
      setAchievements([...achievements, newAchievement.trim()])
      setNewAchievement("")
    } else if (achievements.length >= 10) {
      toast({
        title: "Maximum achievements reached",
        description: "You can add up to 10 achievements.",
        variant: "destructive",
      })
    }
  }

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index))
  }

  const addActivity = () => {
    if (newActivity.trim() && activities.length < 10) {
      setActivities([...activities, newActivity.trim()])
      setNewActivity("")
    } else if (activities.length >= 10) {
      toast({
        title: "Maximum activities reached",
        description: "You can add up to 10 activities.",
        variant: "destructive",
      })
    }
  }

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required for all roles
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required"
    } else if (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 100) {
      newErrors.age = "Please enter a valid age"
    }

    if (!formData.birthday.trim()) {
      newErrors.birthday = "Birthday is required"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.sayingMotto.trim()) {
      newErrors.sayingMotto = "Saying/Motto is required"
    }

    if (!formData.dreamJob.trim()) {
      newErrors.dreamJob = "Dream job is required"
    }

    if (userRole === "student") {
      // Academic Info
      if (!formData.department.trim()) {
        newErrors.department = "Department is required"
      }
      if (!formData.yearLevel.trim()) {
        newErrors.yearLevel = "Year level is required"
      }
      if (!formData.courseProgram.trim()) {
        newErrors.courseProgram = "Course/Program is required"
      }
      if (formData.courseProgram === "BSED" && !formData.major.trim()) {
        newErrors.major = "Major is required for BSED"
      }
      if (!formData.blockSection.trim()) {
        newErrors.blockSection = "Block/Section is required"
      }

      if (!formData.fatherGuardianName.trim()) {
        newErrors.fatherGuardianName = "Father's/Guardian's name is required"
      }
      if (!formData.motherGuardianName.trim()) {
        newErrors.motherGuardianName = "Mother's/Guardian's name is required"
      }
    } else if (userRole === "alumni") {
      // Alumni specific validation
      if (!formData.graduationYear.trim()) {
        newErrors.graduationYear = "Graduation year is required"
      }
      if (!formData.department.trim()) {
        newErrors.department = "Department is required"
      }
      if (!formData.courseProgram.trim()) {
        newErrors.courseProgram = "Course/Program is required"
      }
    }

    // Debug logging
    console.log("[Yearbook Form] Validation check:", {
      formData,
      newErrors,
      errorCount: Object.keys(newErrors).length,
      userRole
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      const errorFields = Object.keys(errors).filter(key => errors[key])
      const errorMessage = errorFields.length > 0 
        ? `Please fix the following fields: ${errorFields.join(', ')}`
        : "Some required fields are missing or invalid."
      
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Submitting yearbook profile data:", {
      formData,
      userRole, // Use userRole prop instead of selectedRole
      achievements,
      activities,
      schoolYearId,
      isEditing,
    })

    toast({
      title: isEditing ? "Profile updated successfully!" : "Profile created successfully!",
      description: isEditing
        ? "Your profile changes have been submitted for admin approval."
        : "Your yearbook profile has been submitted for admin approval.",
    })

    onSave()
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-semibold">
            {isEditing ? "Edit" : "Create"} {userRole === "alumni" ? "Alumni" : "Student"} Profile
          </h3>
          <p className="text-sm text-muted-foreground">School Year {getSchoolYearLabel(schoolYearId)}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Admin Approval Required</p>
            <p className="text-blue-700">
              {isEditing
                ? "Any changes to your profile will be submitted for admin review before being published."
                : "Your profile will be submitted for admin review before being published in the yearbook."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Photo & Basic Info */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6">
            <div className="text-center space-y-4">
              {/* Profile Photo */}
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
                {profilePhoto ? (
                  <Image src={profilePhoto || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label htmlFor="profilePhoto" className="text-sm font-medium">
                  Profile Photo
                </Label>
                <div className="flex flex-col items-center gap-2">
                  <input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("profilePhoto")?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                </div>
              </div>

              {/* Basic Info Preview */}
              <div className="pt-4 border-t space-y-3">
                <div>
                  <h4 className="font-semibold text-lg">{formData.fullName || "Your Name"}</h4>
                  {formData.nickname && <p className="text-muted-foreground italic">"{formData.nickname}"</p>}
                  {formData.age && <p className="text-sm text-muted-foreground">Age: {formData.age}</p>}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{formData.department || "Department"}</span>
                  </div>
                  {formData.courseProgram && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{formData.courseProgram}</span>
                    </div>
                  )}
                  {userRole === "student" && formData.yearLevel && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formData.yearLevel}</span>
                    </div>
                  )}
                  {userRole === "alumni" && formData.graduationYear && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Class of {formData.graduationYear}</span>
                    </div>
                  )}
                  {formData.blockSection && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{formData.blockSection}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Form Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Juan Dela Cruz"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={`h-11 ${errors.fullName ? "border-red-500" : ""}`}
                />
                {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    placeholder="Juan"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange("nickname", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Auto-calculated"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className={`${errors.age ? "border-red-500" : ""} bg-gray-50`}
                    disabled={true}
                  />
                  {errors.age && <p className="text-sm text-red-600">{errors.age}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday *</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleInputChange("birthday", e.target.value)}
                  className={errors.birthday ? "border-red-500" : ""}
                />
                {errors.birthday && <p className="text-sm text-red-600">{errors.birthday}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Rizal St, Quezon City"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sayingMotto">Saying/Motto *</Label>
                <Textarea
                  id="sayingMotto"
                  placeholder="Strive for progress, not perfection"
                  value={formData.sayingMotto}
                  onChange={(e) => handleInputChange("sayingMotto", e.target.value)}
                  className={errors.sayingMotto ? "border-red-500" : ""}
                  rows={2}
                />
                {errors.sayingMotto && <p className="text-sm text-red-600">{errors.sayingMotto}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dreamJob">Dream Job *</Label>
                <Input
                  id="dreamJob"
                  placeholder="Software Engineer"
                  value={formData.dreamJob}
                  onChange={(e) => handleInputChange("dreamJob", e.target.value)}
                  className={errors.dreamJob ? "border-red-500" : ""}
                />
                {errors.dreamJob && <p className="text-sm text-red-600">{errors.dreamJob}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          {(userRole === "student" || userRole === "alumni") && (
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                    <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Senior High">Senior High</SelectItem>
                      <SelectItem value="College">College</SelectItem>
                      <SelectItem value="Graduate School">Graduate School</SelectItem>
                      <SelectItem value="Elementary">Elementary</SelectItem>
                      <SelectItem value="Junior High">Junior High</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-sm text-red-600">{errors.department}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearLevel">Year Level *</Label>
                    <Select
                      value={formData.yearLevel}
                      onValueChange={(value) => handleInputChange("yearLevel", value)}
                      disabled={!formData.department}
                    >
                      <SelectTrigger className={errors.yearLevel ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select year level" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYearLevels.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.yearLevel && <p className="text-sm text-red-600">{errors.yearLevel}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courseProgram">Course/Program *</Label>
                    <Select
                      value={formData.courseProgram}
                      onValueChange={(value) => handleInputChange("courseProgram", value)}
                      disabled={!formData.department}
                    >
                      <SelectTrigger className={errors.courseProgram ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select course/program" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePrograms.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.courseProgram && <p className="text-sm text-red-600">{errors.courseProgram}</p>}
                  </div>

                  {showMajorsDropdown && (
                    <div className="space-y-2">
                      <Label htmlFor="major">Major *</Label>
                      <Select
                        value={formData.major}
                        onValueChange={(value) => handleInputChange("major", value)}
                        disabled={!formData.courseProgram}
                      >
                        <SelectTrigger className={errors.major ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select major" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableMajors.map((major) => (
                            <SelectItem key={major} value={major}>
                              {major}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.major && <p className="text-sm text-red-600">{errors.major}</p>}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blockSection">Block/Section *</Label>
                  <Select
                    value={formData.blockSection}
                    onValueChange={(value) => handleInputChange("blockSection", value)}
                    disabled={!formData.courseProgram}
                  >
                    <SelectTrigger className={errors.blockSection ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select block/section" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSections.map((section) => (
                        <SelectItem key={section} value={section}>
                          {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.blockSection && <p className="text-sm text-red-600">{errors.blockSection}</p>}
                </div>

                {userRole === "alumni" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year *</Label>
                      <Input
                        id="graduationYear"
                        placeholder="Graduation Year"
                        value={formData.graduationYear}
                        onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                        className={errors.graduationYear ? "border-red-500" : ""}
                      />
                      {errors.graduationYear && <p className="text-sm text-red-600">{errors.graduationYear}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentJobTitle">Current Job Title</Label>
                      <Input
                        id="currentJobTitle"
                        placeholder="Software Engineer"
                        value={formData.currentJobTitle}
                        onChange={(e) => handleInputChange("currentJobTitle", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentEmployer">Current Employer</Label>
                      <Input
                        id="currentEmployer"
                        placeholder="Tech Company Inc."
                        value={formData.currentEmployer}
                        onChange={(e) => handleInputChange("currentEmployer", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Current Location</Label>
                      <Input
                        id="location"
                        placeholder="Manila, Philippines"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="messageToStudents">Message to Current Students</Label>
                      <Textarea
                        id="messageToStudents"
                        placeholder="Share some advice or encouragement for current students..."
                        value={formData.messageToStudents}
                        onChange={(e) => handleInputChange("messageToStudents", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Parents/Guardian Information - Only for students */}
          {userRole === "student" && (
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Parents/Guardian Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherGuardianName">Father's/Guardian's Name *</Label>
                    <Input
                      id="fatherGuardianName"
                      placeholder="Juan Dela Cruz"
                      value={formData.fatherGuardianName}
                      onChange={(e) => handleInputChange("fatherGuardianName", e.target.value)}
                      className={errors.fatherGuardianName ? "border-red-500" : ""}
                    />
                    {errors.fatherGuardianName && <p className="text-sm text-red-600">{errors.fatherGuardianName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherGuardianName">Mother's/Guardian's Name *</Label>
                    <Input
                      id="motherGuardianName"
                      placeholder="Maria Dela Cruz"
                      value={formData.motherGuardianName}
                      onChange={(e) => handleInputChange("motherGuardianName", e.target.value)}
                      className={errors.motherGuardianName ? "border-red-500" : ""}
                    />
                    {errors.motherGuardianName && <p className="text-sm text-red-600">{errors.motherGuardianName}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Media Information */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Share2 className="h-5 w-5 text-purple-600" />
                Social Media (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    placeholder="@juan.delacruz"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange("facebook", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="@juandelacruz"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange("instagram", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    placeholder="@juandelacruz"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange("twitter", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements & Activities */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-lg">Achievements & Activities</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-6">
              {/* Achievements */}
              <div className="space-y-4">
                <h4 className="font-medium">Achievements</h4>
                <div className="flex gap-2">
                  <Input
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    placeholder="Add an achievement..."
                    onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                  />
                  <Button onClick={addAchievement} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((achievement, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {achievement}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeAchievement(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-4">
                <h4 className="font-medium">Activities & Organizations</h4>
                <div className="flex gap-2">
                  <Input
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    placeholder="Add an activity..."
                    onKeyPress={(e) => e.key === "Enter" && addActivity()}
                  />
                  <Button onClick={addActivity} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activities.map((activity, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {activity}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeActivity(index)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={onBack} className="px-6 bg-transparent">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="px-6">
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? "Update Profile" : "Save Profile"}
        </Button>
      </div>
    </div>
  )
}
