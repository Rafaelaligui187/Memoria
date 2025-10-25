"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Upload, Save, User, Briefcase, Heart, ArrowLeft, AlertCircle, Share2, Award, GraduationCap } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface FacultyStaffProfileSetupFormProps {
  schoolYearId: string
  userRole: "faculty" | "staff"
  isEditing?: boolean
  onBack: () => void
  onSave: () => void
}

export function FacultyStaffProfileSetupForm({
  schoolYearId,
  userRole,
  isEditing = false,
  onBack,
  onSave,
}: FacultyStaffProfileSetupFormProps) {
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  
  // Academic Information state for faculty
  const [availableAcademicYearLevels, setAvailableAcademicYearLevels] = useState<string[]>([])
  const [availableAcademicPrograms, setAvailableAcademicPrograms] = useState<string[]>([])
  const [availableAcademicSections, setAvailableAcademicSections] = useState<{name: string, yearLevel: string}[]>([])
  const [departmentData, setDepartmentData] = useState<any>(null)
  const [isLoadingFormData, setIsLoadingFormData] = useState(true)
  const [formDataError, setFormDataError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    age: "",
    birthday: "",
    address: "",
    sayingMotto: "",
    dreamJob: "",
    facebook: "",
    instagram: "",
    twitter: "",
    // Faculty/Staff specific fields
    position: "",
    department: "",
    yearsOfService: "",
    bio: "",
    courses: "",
    additionalRoles: "",
    // Academic Information for Advisory Roles
    academicDepartment: "",
    academicYearLevels: [],
    academicCourseProgram: "",
    academicSections: [],
  })

  // Get school year label for display
  const getSchoolYearLabel = (yearId: string) => {
    return yearId.replace("-", "–")
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // Fetch dynamic form data
  useEffect(() => {
    const fetchFormData = async () => {
      setIsLoadingFormData(true)
      setFormDataError(null)
      
      try {
        const response = await fetch(`/api/admin/form-data?schoolYearId=${schoolYearId}`)
        const result = await response.json()
        
        if (result.success) {
          setDepartmentData(result.data.departments)
          console.log('Dynamic form data loaded for faculty-staff form:', result.data.departments)
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
        setIsLoadingFormData(false)
      }
    }

    fetchFormData()
  }, [schoolYearId])

  // Academic Information dynamic dropdown logic for faculty
  useEffect(() => {
    if (departmentData && formData.academicDepartment && departmentData[formData.academicDepartment]) {
      const deptData = departmentData[formData.academicDepartment]
      setAvailableAcademicYearLevels(deptData.yearLevels || [])
      setAvailableAcademicPrograms(deptData.programs || [])
      
      // Reset dependent fields when department changes
      handleInputChange("academicYearLevels", [])
      handleInputChange("academicCourseProgram", "")
      handleInputChange("academicSections", [])
      setAvailableAcademicSections([]) // Clear sections initially
    }
  }, [formData.academicDepartment, departmentData])

  // Fetch filtered academic sections when course/program and year levels are selected
  useEffect(() => {
    const fetchFilteredAcademicSections = async () => {
      if (formData.academicDepartment && formData.academicCourseProgram && formData.academicYearLevels?.length > 0) {
        try {
          // Make multiple API calls for each selected year level
          const sectionPromises = formData.academicYearLevels.map(async (yearLevel) => {
            const params = new URLSearchParams({
              schoolYearId: schoolYearId,
              department: formData.academicDepartment,
              program: formData.academicCourseProgram,
              yearLevel: yearLevel
            })
            
            const response = await fetch(`/api/admin/form-data?${params}`)
            const result = await response.json()
            
            if (result.success) {
              // Return sections with their year level information
              return (result.data.sections || []).map((section: string) => ({
                name: section,
                yearLevel: yearLevel
              }))
            }
            return []
          })
          
          // Wait for all API calls to complete
          const sectionResults = await Promise.all(sectionPromises)
          
          // Combine sections from all year levels
          const allSections = sectionResults.flat()
          
          setAvailableAcademicSections(allSections)
          console.log(`Filtered academic sections for ${formData.academicDepartment} - ${formData.academicCourseProgram} - ${formData.academicYearLevels}:`, allSections)
          
          // Reset academic sections if current selections are not available
          if (formData.academicSections?.length > 0) {
            const availableSectionKeys = allSections.map(s => `${s.name}-${s.yearLevel}`)
            const validSections = formData.academicSections.filter((section: string) => 
              availableSectionKeys.includes(section)
            )
            if (validSections.length !== formData.academicSections.length) {
              handleInputChange("academicSections", validSections)
            }
          }
        } catch (error) {
          console.error('Error fetching filtered academic sections:', error)
        }
      } else {
        // If not all required fields are selected, clear sections
        setAvailableAcademicSections([])
        if (formData.academicSections?.length > 0) {
          handleInputChange("academicSections", [])
        }
      }
    }

    fetchFilteredAcademicSections()
  }, [formData.academicDepartment, formData.academicCourseProgram, formData.academicYearLevels, schoolYearId])

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

    // Faculty/Staff specific required fields
    if (!formData.position.trim()) {
      newErrors.position = "Position is required"
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required"
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Submitting faculty/staff profile data:", {
      formData,
      userRole,
      achievements,
      schoolYearId,
      isEditing,
      academicInfo: {
        academicDepartment: formData.academicDepartment,
        academicYearLevels: formData.academicYearLevels,
        academicCourseProgram: formData.academicCourseProgram,
        academicSections: formData.academicSections,
      }
    })

    toast({
      title: isEditing ? "Profile updated successfully!" : "Profile created successfully!",
      description: isEditing
        ? "Your profile changes have been submitted for admin approval."
        : "Your profile has been submitted for admin approval.",
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
          <div className="flex items-center gap-3 pb-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-semibold">
            {isEditing ? "Edit" : "Create"} {userRole === "faculty" ? "Faculty" : "Staff"} Profile
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
                : "Your profile will be submitted for admin review before being published in the Faculty & Staff section."}
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
                    <Briefcase className="h-4 w-4" />
                    <span>{formData.position || "Position"}</span>
                  </div>
                  {formData.department && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{formData.department}</span>
                    </div>
                  )}
                  {formData.yearsOfService && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span>{formData.yearsOfService} years of service</span>
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
                    placeholder="35"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className={errors.age ? "border-red-500" : ""}
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
                  placeholder="Education is the most powerful weapon which you can use to change the world"
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
                  placeholder="Department Head"
                  value={formData.dreamJob}
                  onChange={(e) => handleInputChange("dreamJob", e.target.value)}
                  className={errors.dreamJob ? "border-red-500" : ""}
                />
                {errors.dreamJob && <p className="text-sm text-red-600">{errors.dreamJob}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position/Role *</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => {
                    handleInputChange("position", value)
                    // Reset department when position changes
                    handleInputChange("department", "")
                  }}
                >
                  <SelectTrigger className={errors.position ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select position/role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRole === "faculty" ? (
                      <>
                        <SelectItem value="Department Head">Department Head</SelectItem>
                        <SelectItem value="Subject Teacher">Subject Teacher</SelectItem>
                        <SelectItem value="Teacher Adviser">Teacher Adviser</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Librarian">Librarian</SelectItem>
                        <SelectItem value="Registrar">Registrar</SelectItem>
                        <SelectItem value="Finance Officer">Finance Officer</SelectItem>
                        <SelectItem value="HR Officer">HR Officer</SelectItem>
                        <SelectItem value="IT Support">IT Support</SelectItem>
                        <SelectItem value="Guidance Counselor">Guidance Counselor</SelectItem>
                        <SelectItem value="Security Guard">Security Guard</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department Assigned *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                >
                  <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRole === "faculty" ? (
                      <>
                        {/* Same department options for all faculty roles */}
                        <SelectItem value="College of Computer Studies">College of Computer Studies</SelectItem>
                        <SelectItem value="College of Hospitality Management">College of Hospitality Management</SelectItem>
                        <SelectItem value="College of Education">College of Education</SelectItem>
                        <SelectItem value="College of Agriculture">College of Agriculture</SelectItem>
                        <SelectItem value="Elementary Department">Elementary Department</SelectItem>
                        <SelectItem value="Junior High School Department">Junior High School Department</SelectItem>
                        <SelectItem value="Senior High School Department">Senior High School Department</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="Registrar">Registrar</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="IT Department">IT Department</SelectItem>
                        <SelectItem value="Library">Library</SelectItem>
                        <SelectItem value="Guidance">Guidance</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-sm text-red-600">{errors.department}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfService">Years of Service</Label>
                <Input
                  id="yearsOfService"
                  type="number"
                  placeholder="10"
                  value={formData.yearsOfService}
                  onChange={(e) => handleInputChange("yearsOfService", e.target.value)}
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself, your background, and your passion for education..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className={errors.bio ? "border-red-500" : ""}
                  rows={4}
                />
                {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
              </div>

              {userRole === "faculty" && (
                <div className="space-y-2">
                  <Label htmlFor="courses">Courses Taught</Label>
                  <Textarea
                    id="courses"
                    placeholder="Data Structures, Algorithms, Web Development"
                    value={formData.courses}
                    onChange={(e) => handleInputChange("courses", e.target.value)}
                    rows={2}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="additionalRoles">Additional Roles</Label>
                <Textarea
                  id="additionalRoles"
                  placeholder="Student Council Advisor, Research Committee Member"
                  value={formData.additionalRoles}
                  onChange={(e) => handleInputChange("additionalRoles", e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information - Faculty (Optional for Advisory Roles) */}
          {userRole === "faculty" && (
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  Academic Information (Optional)
                  <span className="text-sm font-normal text-gray-500">
                    - Fill this section if you serve as an adviser
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Advisory Role Information</p>
                      <p>If you select academic information below, your profile will automatically appear as an adviser on the respective Yearbook pages. You can select multiple sections and year levels if you handle multiple advisories.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="academicDepartment">Department</Label>
                    <Select 
                      value={formData.academicDepartment} 
                      onValueChange={(value) => {
                        handleInputChange("academicDepartment", value)
                        // Reset dependent fields when department changes
                        handleInputChange("academicYearLevels", [])
                        handleInputChange("academicCourseProgram", "")
                        handleInputChange("academicSections", [])
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Elementary">Elementary</SelectItem>
                        <SelectItem value="Junior High">Junior High</SelectItem>
                        <SelectItem value="Senior High">Senior High</SelectItem>
                        <SelectItem value="College">College</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academicCourseProgram">Course/Program</Label>
                    <Select 
                      value={formData.academicCourseProgram} 
                      onValueChange={(value) => {
                        handleInputChange("academicCourseProgram", value)
                        // Reset sections when course changes
                        handleInputChange("academicSections", [])
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select course/program" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAcademicPrograms.map((program) => (
                          <SelectItem key={program} value={program}>
                            {program}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="academicYearLevels">Year Levels (Multiple Selection)</Label>
                    <div className="space-y-2">
                      {availableAcademicYearLevels.map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`year-${level}`}
                            checked={formData.academicYearLevels.includes(level)}
                            onChange={(e) => {
                              const currentLevels = formData.academicYearLevels || []
                              const newLevels = e.target.checked
                                ? [...currentLevels, level]
                                : currentLevels.filter((l: string) => l !== level)
                              handleInputChange("academicYearLevels", newLevels)
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`year-${level}`} className="text-sm font-normal">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academicSections">Sections/Blocks (Multiple Selection)</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {availableAcademicSections.map((section) => (
                        <div key={`${section.name}-${section.yearLevel}`} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`section-${section.name}-${section.yearLevel}`}
                            checked={formData.academicSections.includes(`${section.name}-${section.yearLevel}`)}
                            onChange={(e) => {
                              const currentSections = formData.academicSections || []
                              const sectionKey = `${section.name}-${section.yearLevel}`
                              const newSections = e.target.checked
                                ? [...currentSections, sectionKey]
                                : currentSections.filter((s: string) => s !== sectionKey)
                              handleInputChange("academicSections", newSections)
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`section-${section.name}-${section.yearLevel}`} className="text-sm font-normal">
                            <span className="font-medium">{section.name}</span>
                            <span className="text-blue-600 ml-2 text-xs">({section.yearLevel})</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {(formData.academicYearLevels?.length > 0 || formData.academicSections?.length > 0) && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="text-sm text-green-800">
                        <p className="font-medium mb-1">Advisory Role Active</p>
                        <p>Your profile will appear as an adviser on the Yearbook pages for the selected academic information.</p>
                      </div>
                    </div>
                  </div>
                )}
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

          {/* Achievements */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Achievements & Recognition
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-4">
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
        </>
      )}
    </div>
  )
}
