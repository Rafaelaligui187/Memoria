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
  Award,
  Briefcase,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import { uploadProfileImage, validateImageFile, getImagePreviewUrl } from "@/lib/image-upload-utils"

interface StudentProfileSetupFormProps {
  schoolYearId: string
  userId: string
  isEditing?: boolean
  onBack: () => void
  onSave: () => void
}

export function StudentProfileSetupForm({
  schoolYearId,
  userId,
  isEditing = false,
  onBack,
  onSave,
}: StudentProfileSetupFormProps) {
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [departmentData, setDepartmentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isLoadingFormData, setIsLoadingFormData] = useState(true)
  const [formDataError, setFormDataError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    // Basic Info
    fullName: "",
    nickname: "",
    age: "",
    gender: "",
    birthday: "",
    address: "",
    email: "",
    phone: "",

    // Academic Info
    department: "",
    yearLevel: "",
    courseProgram: "",
    major: "",
    blockSection: "",

    // Parents/Guardian Info
    fatherGuardianName: "",
    motherGuardianName: "",

    // Additional Info
    dreamJob: "",
    hobbies: "",
    honors: "",
    officerRole: "",
    bio: "",

    // Yearbook Info
    profilePicture: "",
    sayingMotto: "",

    // Social Media
    socialMediaFacebook: "",
    socialMediaInstagram: "",
    socialMediaTwitter: "",
  })

  const [availableYearLevels, setAvailableYearLevels] = useState<string[]>([])
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([])
  const [availableSections, setAvailableSections] = useState<string[]>([])

  // Officer roles for students
  const officerRoles = [
    "Mayor",
    "Vice Mayor", 
    "Secretary",
    "Assistant Secretary",
    "Treasurer",
    "Assistant Treasurer",
    "Auditor"
  ]

  // Fetch dynamic form data
  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoadingFormData(true)
      setFormDataError(null)
      
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/form-data?schoolYearId=${schoolYearId}`)
        const result = await response.json()
        
        if (result.success) {
          setDepartmentData(result.data.departments)
          console.log('Dynamic form data loaded:', result.data.departments)
        } else {
          console.error('Failed to fetch form data:', result.error)
          setFormDataError(`Failed to load academic data: ${result.error}`)
          setDepartmentData({})
        }
      } catch (error) {
        console.error('Error fetching form data:', error)
        setFormDataError('Failed to connect to database. Please check your connection and try again.')
        setDepartmentData({})
      } finally {
        setLoading(false)
        setIsLoadingFormData(false)
      }
    }

    fetchFormData()
  }, [schoolYearId])

  useEffect(() => {
    if (departmentData && formData.department && departmentData[formData.department]) {
      const dept = departmentData[formData.department]
      setAvailableYearLevels(dept.yearLevels || [])
      setAvailablePrograms(dept.programs || [])
      
      // Reset dependent fields when department changes
      setFormData(prev => ({
        ...prev,
        yearLevel: "",
        courseProgram: "",
        blockSection: ""
      }))
      setAvailableSections([]) // Clear sections initially
    }
  }, [formData.department, departmentData])

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const addAchievement = () => {
    if (newAchievement.trim() && !achievements.includes(newAchievement.trim())) {
      setAchievements(prev => [...prev, newAchievement.trim()])
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setAchievements(prev => prev.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (validation) {
      toast({
        title: "Invalid Image",
        description: validation,
        variant: "destructive",
      })
      return
    }

    try {
      const uploadResult = await uploadProfileImage(file)
      if (uploadResult.success && uploadResult.url) {
        setProfilePhoto(uploadResult.url)
        handleInputChange("profilePicture", uploadResult.url)
        toast({
          title: "Success",
          description: "Profile picture uploaded successfully!",
        })
      } else {
        throw new Error(uploadResult.error || "Upload failed")
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields for students
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.nickname.trim()) newErrors.nickname = "Nickname is required"
    if (!formData.age.trim()) newErrors.age = "Age is required"
    if (!formData.gender.trim()) newErrors.gender = "Gender is required"
    if (!formData.birthday.trim()) newErrors.birthday = "Birthday is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.department.trim()) newErrors.department = "Department is required"
    if (!formData.yearLevel.trim()) newErrors.yearLevel = "Year level is required"
    if (!formData.courseProgram.trim()) newErrors.courseProgram = "Course/Program is required"
    if (!formData.blockSection.trim()) newErrors.blockSection = "Section/Block is required"
    if (!formData.fatherGuardianName.trim()) newErrors.fatherGuardianName = "Father's name is required"
    if (!formData.motherGuardianName.trim()) newErrors.motherGuardianName = "Mother's name is required"

    // Debug logging
    console.log("[Student Form] Validation check:", {
      formData,
      newErrors,
      errorCount: Object.keys(newErrors).length
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      const errorFields = Object.keys(errors).filter(key => errors[key])
      const errorMessage = errorFields.length > 0 
        ? `Please fix the following fields: ${errorFields.join(', ')}`
        : "Please fill in all required fields"
      
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      })
      return
    }

    try {
      const profileData = {
        ...formData,
        userType: "student",
        achievements: achievements,
        bio: formData.bio,
      }

      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...profileData,
          schoolYearId,
          userId,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Student profile created successfully!",
        })
        onSave()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to create profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoadingFormData && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Loading academic data...</p>
              <p>Please wait while we fetch the latest academic information from the database.</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {formDataError && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">Unable to load academic data</p>
              <p>{formDataError}</p>
              <p className="mt-2 text-xs">Please refresh the page or contact support if the issue persists.</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Content - Only show when data is loaded successfully */}
      {!isLoadingFormData && !formDataError && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading form data...</p>
              </div>
            </div>
          ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Student Profile Setup</h2>
              </div>
            </div>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
          </div>

      {/* Profile Picture */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                <Image
                  src={profilePhoto || formData.profilePicture || "/placeholder-user.jpg"}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profilePicture">Upload Profile Picture</Label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-64"
              />
              <p className="text-sm text-gray-500">
                Recommended: Square image, max 2MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname *</Label>
              <Input
                id="nickname"
                placeholder="Enter your nickname"
                value={formData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                className={errors.nickname ? "border-red-500" : ""}
              />
              {errors.nickname && <p className="text-sm text-red-500">{errors.nickname}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className={errors.age ? "border-red-500" : ""}
              />
              {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
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
              {errors.birthday && <p className="text-sm text-red-500">{errors.birthday}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-green-600" />
            Academic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Elementary">Elementary</SelectItem>
                  <SelectItem value="Junior High">Junior High</SelectItem>
                  <SelectItem value="Senior High">Senior High</SelectItem>
                  <SelectItem value="College">College</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearLevel">Year Level *</Label>
              <Select value={formData.yearLevel} onValueChange={(value) => handleInputChange("yearLevel", value)}>
                <SelectTrigger className={errors.yearLevel ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select year level" />
                </SelectTrigger>
                <SelectContent>
                  {availableYearLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.yearLevel && <p className="text-sm text-red-500">{errors.yearLevel}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseProgram">Course/Program *</Label>
              <Select value={formData.courseProgram} onValueChange={(value) => handleInputChange("courseProgram", value)}>
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
              {errors.courseProgram && <p className="text-sm text-red-500">{errors.courseProgram}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="blockSection">Section/Block *</Label>
              <Select value={formData.blockSection} onValueChange={(value) => handleInputChange("blockSection", value)}>
                <SelectTrigger className={errors.blockSection ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select section/block" />
                </SelectTrigger>
                <SelectContent>
                  {availableSections.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.blockSection && <p className="text-sm text-red-500">{errors.blockSection}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parents/Guardian Information */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Parents/Guardian Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fatherGuardianName">Father's Name *</Label>
              <Input
                id="fatherGuardianName"
                placeholder="Enter father's name"
                value={formData.fatherGuardianName}
                onChange={(e) => handleInputChange("fatherGuardianName", e.target.value)}
                className={errors.fatherGuardianName ? "border-red-500" : ""}
              />
              {errors.fatherGuardianName && <p className="text-sm text-red-500">{errors.fatherGuardianName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherGuardianName">Mother's Name *</Label>
              <Input
                id="motherGuardianName"
                placeholder="Enter mother's name"
                value={formData.motherGuardianName}
                onChange={(e) => handleInputChange("motherGuardianName", e.target.value)}
                className={errors.motherGuardianName ? "border-red-500" : ""}
              />
              {errors.motherGuardianName && <p className="text-sm text-red-500">{errors.motherGuardianName}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dreamJob">Dream Job</Label>
              <Input
                id="dreamJob"
                placeholder="What's your dream job?"
                value={formData.dreamJob}
                onChange={(e) => handleInputChange("dreamJob", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hobbies">Hobbies & Interests</Label>
              <Textarea
                id="hobbies"
                placeholder="Tell us about your hobbies and interests"
                value={formData.hobbies}
                onChange={(e) => handleInputChange("hobbies", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="honors">Honors & Awards</Label>
              <Textarea
                id="honors"
                placeholder="List your honors and awards"
                value={formData.honors}
                onChange={(e) => handleInputChange("honors", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="officerRole">Officer Role</Label>
              <Select value={formData.officerRole} onValueChange={(value) => handleInputChange("officerRole", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select officer role" />
                </SelectTrigger>
                <SelectContent>
                  {officerRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Personal Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
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
              <Label htmlFor="socialMediaFacebook">Facebook</Label>
              <Input
                id="socialMediaFacebook"
                placeholder="@username"
                value={formData.socialMediaFacebook}
                onChange={(e) => handleInputChange("socialMediaFacebook", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialMediaInstagram">Instagram</Label>
              <Input
                id="socialMediaInstagram"
                placeholder="@username"
                value={formData.socialMediaInstagram}
                onChange={(e) => handleInputChange("socialMediaInstagram", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialMediaTwitter">Twitter/X</Label>
              <Input
                id="socialMediaTwitter"
                placeholder="@username"
                value={formData.socialMediaTwitter}
                onChange={(e) => handleInputChange("socialMediaTwitter", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yearbook Information */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Yearbook Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sayingMotto">Motto/Saying</Label>
              <Textarea
                id="sayingMotto"
                placeholder="What's your motto or favorite saying?"
                value={formData.sayingMotto}
                onChange={(e) => handleInputChange("sayingMotto", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="achievements">Achievements/Honors</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add an achievement"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                  />
                  <Button type="button" onClick={addAchievement} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {achievements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {achievement}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(index)}
                          className="h-4 w-4 p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </>
          )}
        </>
      )}
    </div>
  )
}
