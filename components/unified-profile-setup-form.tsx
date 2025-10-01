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

interface UnifiedProfileSetupFormProps {
  schoolYearId: string
  isEditing?: boolean
  onBack: () => void
  onSave: () => void
}

type UserRole = "student" | "alumni" | "faculty" | "staff"

// Dynamic academic data structure
const departmentData = {
  "Senior High": {
    yearLevels: ["Grade 11", "Grade 12"],
    programs: {
      STEM: ["STEM 1", "STEM 2", "STEM 3"],
      HUMSS: ["HUMSS 1", "HUMSS 2", "HUMSS 3"],
      ABM: ["ABM 1", "ABM 2", "ABM 3"],
      GAS: ["GAS 1", "GAS 2", "GAS 3"],
      TVL: ["TVL 1", "TVL 2", "TVL 3"],
    },
  },
  College: {
    yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    programs: {
      "BS Computer Science": ["CS-A", "CS-B", "CS-C"],
      "BS Information Technology": ["IT-A", "IT-B", "IT-C"],
      "BS Engineering": ["ENG-A", "ENG-B", "ENG-C"],
      "BS Business Administration": ["BA-A", "BA-B", "BA-C"],
      "BS Education": ["ED-A", "ED-B", "ED-C"],
      "BS Psychology": ["PSY-A", "PSY-B", "PSY-C"],
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

export function UnifiedProfileSetupForm({
  schoolYearId,
  isEditing = false,
  onBack,
  onSave,
}: UnifiedProfileSetupFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    // Basic Info (all roles)
    fullName: "",
    nickname: "",
    age: "",
    gender: "",
    birthday: "",
    address: "",
    email: "",
    phone: "",

    // Yearbook Info (all roles)
    profilePicture: "",
    sayingMotto: "",

    // Student fields
    fatherGuardianName: "",
    motherGuardianName: "",
    department: "",
    yearLevel: "",
    courseProgram: "",
    blockSection: "",
    dreamJob: "",
    socialMediaFacebook: "",
    socialMediaInstagram: "",
    socialMediaTwitter: "",

    // Faculty fields
    position: "",
    departmentAssigned: "",
    yearsOfService: "",
    messageToStudents: "",

    // Staff fields (includes maintenance)
    officeAssigned: "",

    // Alumni fields
    graduationYear: "",
    currentProfession: "",
    currentCompany: "",
    currentLocation: "",

    // Additional personal fields
    bio: "",

    // Student-specific additional fields
    hobbies: "",
    honors: "",
    officerRole: "",

    // Faculty-specific additional fields
    courses: "",
    additionalRoles: "",

    // Alumni-specific additional fields
    achievements: "",
    activities: "",

    // Legacy fields for backward compatibility
    quote: "",
    ambition: "",
  })

  const [availableYearLevels, setAvailableYearLevels] = useState<string[]>([])
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([])
  const [availableSections, setAvailableSections] = useState<string[]>([])

  // Dynamic dropdown logic
  useEffect(() => {
    if (formData.department && departmentData[formData.department as keyof typeof departmentData]) {
      const deptData = departmentData[formData.department as keyof typeof departmentData]
      setAvailableYearLevels(deptData.yearLevels)
      setAvailablePrograms(Object.keys(deptData.programs))

      // Reset dependent fields
      setFormData((prev) => ({ ...prev, yearLevel: "", courseProgram: "", blockSection: "" }))
      setAvailableSections([])
    }
  }, [formData.department])

  useEffect(() => {
    if (
      formData.department &&
      formData.courseProgram &&
      departmentData[formData.department as keyof typeof departmentData]
    ) {
      const deptData = departmentData[formData.department as keyof typeof departmentData]
      const sections = deptData.programs[formData.courseProgram as keyof typeof deptData.programs] || []
      setAvailableSections([...sections, "Others"])

      // Reset section field
      setFormData((prev) => ({ ...prev, blockSection: "" }))
    }
  }, [formData.department, formData.courseProgram])

  // Get school year label for display
  const getSchoolYearLabel = (yearId: string) => {
    return yearId.replace("-", "–")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
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

    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required"
    }

    if (!formData.birthday.trim()) {
      newErrors.birthday = "Birthday is required"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    }

    if (!formData.sayingMotto.trim()) {
      newErrors.sayingMotto = "Saying/Motto is required"
    }

    // Role-specific validation
    if (selectedRole === "student") {
      if (!formData.fatherGuardianName.trim()) {
        newErrors.fatherGuardianName = "Father's/Guardian's name is required"
      }
      if (!formData.motherGuardianName.trim()) {
        newErrors.motherGuardianName = "Mother's/Guardian's name is required"
      }
      if (!formData.department.trim()) {
        newErrors.department = "Department is required"
      }
      if (!formData.yearLevel.trim()) {
        newErrors.yearLevel = "Year level is required"
      }
      if (!formData.courseProgram.trim()) {
        newErrors.courseProgram = "Course/Program is required"
      }
      if (!formData.blockSection.trim()) {
        newErrors.blockSection = "Block/Section is required"
      }
      if (!formData.dreamJob.trim()) {
        newErrors.dreamJob = "Dream job is required"
      }
    } else if (selectedRole === "alumni") {
      if (!formData.department.trim()) {
        newErrors.department = "Department is required"
      }
      if (!formData.courseProgram.trim()) {
        newErrors.courseProgram = "Course/Program is required"
      }
      if (!formData.graduationYear.trim()) {
        newErrors.graduationYear = "Graduation year is required"
      }
    } else if (selectedRole === "faculty") {
      if (!formData.position.trim()) {
        newErrors.position = "Position is required"
      }
      if (!formData.departmentAssigned.trim()) {
        newErrors.departmentAssigned = "Department assigned is required"
      }
      if (!formData.yearsOfService.trim()) {
        newErrors.yearsOfService = "Years of service is required"
      }
      if (!formData.messageToStudents.trim()) {
        newErrors.messageToStudents = "Message to students is required"
      }
    } else if (selectedRole === "staff") {
      if (!formData.position.trim()) {
        newErrors.position = "Position is required"
      }
      if (!formData.officeAssigned.trim()) {
        newErrors.officeAssigned = "Office assigned is required"
      }
      if (!formData.yearsOfService.trim()) {
        newErrors.yearsOfService = "Years of service is required"
      }
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

    console.log("[v0] Submitting unified profile data:", {
      formData,
      selectedRole,
      achievements,
      schoolYearId,
      isEditing,
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

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "student":
        return <GraduationCap className="h-4 w-4" />
      case "faculty":
        return <User className="h-4 w-4" />
      case "alumni":
        return <Users className="h-4 w-4" />
      case "staff":
        return <Briefcase className="h-4 w-4" />
    }
  }

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "student":
        return "Student"
      case "faculty":
        return "Faculty"
      case "alumni":
        return "Alumni"
      case "staff":
        return "Staff (includes Maintenance)"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h3 className="text-lg font-semibold">{isEditing ? "Edit" : "Create"} Profile</h3>
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    {getRoleIcon(selectedRole)}
                    <span>{getRoleLabel(selectedRole)}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {formData.age && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Age: {formData.age}</span>
                    </div>
                  )}
                  {(selectedRole === "student" || selectedRole === "alumni") && formData.department && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>{formData.department}</span>
                    </div>
                  )}
                  {(selectedRole === "faculty" || selectedRole === "staff") && formData.position && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{formData.position}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Form Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Role Selection */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Role Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-2">
                <Label htmlFor="role">Select Your Role *</Label>
                <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Student
                      </div>
                    </SelectItem>
                    <SelectItem value="alumni">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Alumni
                      </div>
                    </SelectItem>
                    <SelectItem value="faculty">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Faculty
                      </div>
                    </SelectItem>
                    <SelectItem value="staff">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Staff (includes Maintenance)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-600" />
                Basic Information
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
                    placeholder="Jay"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange("nickname", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="18"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className={errors.age ? "border-red-500" : ""}
                  />
                  {errors.age && <p className="text-sm text-red-600">{errors.age}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Sampaguita St., Quezon City"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="09123456789"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information - Students & Alumni */}
          {(selectedRole === "student" || selectedRole === "alumni") && (
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
                  {selectedRole === "student" && (
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
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="courseProgram">
                      {selectedRole === "student" ? "Course/Program *" : "Course/Program (when studied) *"}
                    </Label>
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
                </div>

                {selectedRole === "student" && (
                  <div className="space-y-2">
                    <Label htmlFor="blockSection">Section/Block *</Label>
                    <Select
                      value={formData.blockSection}
                      onValueChange={(value) => handleInputChange("blockSection", value)}
                      disabled={!formData.courseProgram}
                    >
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
                    {errors.blockSection && <p className="text-sm text-red-600">{errors.blockSection}</p>}
                  </div>
                )}

                {selectedRole === "alumni" && (
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Year Graduated *</Label>
                    <Input
                      id="graduationYear"
                      placeholder="2019"
                      value={formData.graduationYear}
                      onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                      className={errors.graduationYear ? "border-red-500" : ""}
                    />
                    {errors.graduationYear && <p className="text-sm text-red-600">{errors.graduationYear}</p>}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Parents/Guardian Information - Students only */}
          {selectedRole === "student" && (
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
                    <Label htmlFor="fatherGuardianName">Father's Name *</Label>
                    <Input
                      id="fatherGuardianName"
                      placeholder="Juan Sr."
                      value={formData.fatherGuardianName}
                      onChange={(e) => handleInputChange("fatherGuardianName", e.target.value)}
                      className={errors.fatherGuardianName ? "border-red-500" : ""}
                    />
                    {errors.fatherGuardianName && <p className="text-sm text-red-600">{errors.fatherGuardianName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherGuardianName">Mother's Name *</Label>
                    <Input
                      id="motherGuardianName"
                      placeholder="Maria"
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

          {/* Professional Information - Faculty & Staff */}
          {(selectedRole === "faculty" || selectedRole === "staff") && (
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
                  <Input
                    id="position"
                    placeholder={
                      selectedRole === "faculty"
                        ? "Teacher, Dean, Adviser"
                        : "Librarian, Registrar, Maintenance Technician"
                    }
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    className={errors.position ? "border-red-500" : ""}
                  />
                  {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={selectedRole === "faculty" ? "departmentAssigned" : "officeAssigned"}>
                    {selectedRole === "faculty" ? "Department Assigned *" : "Department/Office Assigned *"}
                  </Label>
                  <Input
                    id={selectedRole === "faculty" ? "departmentAssigned" : "officeAssigned"}
                    placeholder={
                      selectedRole === "faculty"
                        ? "College of Computer Studies"
                        : "Registrar, Library, Maintenance Department"
                    }
                    value={selectedRole === "faculty" ? formData.departmentAssigned : formData.officeAssigned}
                    onChange={(e) =>
                      handleInputChange(
                        selectedRole === "faculty" ? "departmentAssigned" : "officeAssigned",
                        e.target.value,
                      )
                    }
                    className={
                      errors[selectedRole === "faculty" ? "departmentAssigned" : "officeAssigned"]
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {errors[selectedRole === "faculty" ? "departmentAssigned" : "officeAssigned"] && (
                    <p className="text-sm text-red-600">
                      {errors[selectedRole === "faculty" ? "departmentAssigned" : "officeAssigned"]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfService">Years of Service *</Label>
                  <Input
                    id="yearsOfService"
                    type="number"
                    placeholder="10"
                    value={formData.yearsOfService}
                    onChange={(e) => handleInputChange("yearsOfService", e.target.value)}
                    className={errors.yearsOfService ? "border-red-500" : ""}
                  />
                  {errors.yearsOfService && <p className="text-sm text-red-600">{errors.yearsOfService}</p>}
                </div>

                {selectedRole === "faculty" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="messageToStudents">Message to Students *</Label>
                      <Textarea
                        id="messageToStudents"
                        placeholder="Always stay curious."
                        value={formData.messageToStudents}
                        onChange={(e) => handleInputChange("messageToStudents", e.target.value)}
                        className={errors.messageToStudents ? "border-red-500" : ""}
                        rows={3}
                      />
                      {errors.messageToStudents && <p className="text-sm text-red-600">{errors.messageToStudents}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="courses">Courses Taught</Label>
                      <Textarea
                        id="courses"
                        placeholder="Data Structures, Algorithms, Web Development..."
                        value={formData.courses}
                        onChange={(e) => handleInputChange("courses", e.target.value)}
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalRoles">Additional Roles & Responsibilities</Label>
                      <Textarea
                        id="additionalRoles"
                        placeholder="Student Council Advisor, Research Committee Member..."
                        value={formData.additionalRoles}
                        onChange={(e) => handleInputChange("additionalRoles", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Career Information - Alumni */}
          {selectedRole === "alumni" && (
            <Card className="p-6">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  Career Information
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentProfession">Current Profession</Label>
                  <Input
                    id="currentProfession"
                    placeholder="Software Engineer"
                    value={formData.currentProfession}
                    onChange={(e) => handleInputChange("currentProfession", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentCompany">Company/Organization</Label>
                  <Input
                    id="currentCompany"
                    placeholder="Acme Inc."
                    value={formData.currentCompany}
                    onChange={(e) => handleInputChange("currentCompany", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentLocation">Current Location</Label>
                  <Input
                    id="currentLocation"
                    placeholder="Manila, Philippines"
                    value={formData.currentLocation}
                    onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievements">Professional Achievements</Label>
                  <Textarea
                    id="achievements"
                    placeholder="Promoted to Senior Developer, Led successful project launches..."
                    value={formData.achievements}
                    onChange={(e) => handleInputChange("achievements", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activities">Current Activities & Involvement</Label>
                  <Textarea
                    id="activities"
                    placeholder="Alumni Association Member, Volunteer Mentor..."
                    value={formData.activities}
                    onChange={(e) => handleInputChange("activities", e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Information */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-orange-600" />
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-4">
              {selectedRole === "student" && (
                <>
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

                  <div className="space-y-2">
                    <Label htmlFor="hobbies">Hobbies & Interests</Label>
                    <Textarea
                      id="hobbies"
                      placeholder="Reading, playing guitar, photography..."
                      value={formData.hobbies}
                      onChange={(e) => handleInputChange("hobbies", e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="honors">Honors & Awards</Label>
                    <Textarea
                      id="honors"
                      placeholder="Dean's List, Academic Excellence Award..."
                      value={formData.honors}
                      onChange={(e) => handleInputChange("honors", e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="officerRole">Officer Roles & Leadership</Label>
                    <Textarea
                      id="officerRole"
                      placeholder="Class President, Student Council Member..."
                      value={formData.officerRole}
                      onChange={(e) => handleInputChange("officerRole", e.target.value)}
                      rows={2}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="bio">
                  {selectedRole === "student"
                    ? "Personal Bio"
                    : selectedRole === "faculty"
                      ? "Professional Bio"
                      : selectedRole === "alumni"
                        ? "About Me"
                        : "Bio"}
                </Label>
                <Textarea
                  id="bio"
                  placeholder={
                    selectedRole === "student"
                      ? "Tell us about yourself, your interests, and aspirations..."
                      : selectedRole === "faculty"
                        ? "Share your educational background and teaching philosophy..."
                        : selectedRole === "alumni"
                          ? "Share your journey since graduation..."
                          : "Tell us about yourself and your role..."
                  }
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

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
                  <Label htmlFor="socialMediaFacebook">Facebook</Label>
                  <Input
                    id="socialMediaFacebook"
                    placeholder="@juan.delacruz"
                    value={formData.socialMediaFacebook}
                    onChange={(e) => handleInputChange("socialMediaFacebook", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialMediaInstagram">Instagram</Label>
                  <Input
                    id="socialMediaInstagram"
                    placeholder="@juandelacruz"
                    value={formData.socialMediaInstagram}
                    onChange={(e) => handleInputChange("socialMediaInstagram", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="socialMediaTwitter">Twitter/X</Label>
                  <Input
                    id="socialMediaTwitter"
                    placeholder="@juandelacruz"
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
                <Award className="h-5 w-5 text-yellow-600" />
                Yearbook Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sayingMotto">
                  {selectedRole === "student" || selectedRole === "alumni"
                    ? "Motto/Saying *"
                    : selectedRole === "faculty"
                      ? "Teaching Philosophy/Motto *"
                      : "Motto *"}
                </Label>
                <Textarea
                  id="sayingMotto"
                  placeholder={
                    selectedRole === "student" || selectedRole === "alumni"
                      ? "Strive for progress, not perfection"
                      : selectedRole === "faculty"
                        ? "Teach to inspire"
                        : "Service before self"
                  }
                  value={formData.sayingMotto}
                  onChange={(e) => handleInputChange("sayingMotto", e.target.value)}
                  className={errors.sayingMotto ? "border-red-500" : ""}
                  rows={2}
                />
                {errors.sayingMotto && <p className="text-sm text-red-600">{errors.sayingMotto}</p>}
              </div>

              {/* Achievements */}
              <div className="space-y-4">
                <h4 className="font-medium">Achievements/Honors</h4>
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
