"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Heart, GraduationCap, Users, Briefcase, UserCheck, Save, Upload, User, Plus, X } from "lucide-react"
import Image from "next/image"
import { uploadProfileImage, validateImageFile, getImagePreviewUrl } from "@/lib/image-upload-utils"
import { useFormValidation } from "@/hooks/use-form-validation"
import { commonValidationRules } from "@/lib/form-validation"
import { FormField } from "@/components/form-field"
import { calculateAge } from "@/lib/age-utils"

interface CreateManualProfileFormProps {
  schoolYearId: string
  onBack: () => void
  onSave: () => void
}

type UserRole = "student" | "faculty" | "alumni" | "staff" | "utility"

// Dynamic academic data structure
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

export function CreateManualProfileForm({
  schoolYearId,
  onBack,
  onSave,
}: CreateManualProfileFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")
  const [availableMajors, setAvailableMajors] = useState<string[]>([])
  const [showMajorsDropdown, setShowMajorsDropdown] = useState(false)
  const [programDetails, setProgramDetails] = useState<any>({})
  const [departmentData, setDepartmentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const initialFormData = {
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
    major: "",
    blockSection: "",
    dreamJob: "",
    socialMediaFacebook: "",
    socialMediaInstagram: "",
    socialMediaTwitter: "",

    // Faculty fields
    position: "",
    departmentAssigned: "",
    customDepartmentAssigned: "",
    yearsOfService: "",
    messageToStudents: "",

    // Staff fields (includes maintenance)
    officeAssigned: "",
    customOfficeAssigned: "",

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
  }

  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateFieldOnBlur,
    validateFormOnSubmit,
    clearErrors,
    setSubmitting,
    hasErrors
  } = useFormValidation({
    initialData: initialFormData,
    validationRules: {}, // Will be determined by role-specific rules
    selectedRole
  })

  const [availableYearLevels, setAvailableYearLevels] = useState<string[]>([])
  const [availablePrograms, setAvailablePrograms] = useState<string[]>([])
  const [availableSections, setAvailableSections] = useState<string[]>([])

  // Fetch dynamic form data
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/form-data?schoolYearId=${schoolYearId}`)
        const result = await response.json()
        
        if (result.success) {
          setDepartmentData(result.data.departments)
          setProgramDetails(result.data.programDetails || {})
          console.log('Dynamic form data loaded for admin:', result.data.departments)
          console.log('Program details loaded:', result.data.programDetails)
        } else {
          console.error('Failed to fetch form data:', result.error)
          // Fallback to hardcoded data
          setDepartmentData({
            "Senior High": {
              yearLevels: ["Grade 11", "Grade 12"],
              programs: ["STEM", "ABM", "HUMSS", "GAS", "TVL"],
              sections: ["Section A", "Section B", "Section C", "Section D"],
            },
            College: {
              yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
              programs: ["BSIT", "BSCS", "BSIS", "BSA", "BSBA"],
              sections: ["Section A", "Section B", "Section C", "Section D"],
            },
            Elementary: {
              yearLevels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
              programs: ["Elementary"],
              sections: ["Section A", "Section B", "Section C", "Section D"],
            },
            "Junior High": {
              yearLevels: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
              programs: ["Junior High"],
              sections: ["Section A", "Section B", "Section C", "Section D"],
            },
          })
        }
      } catch (error) {
        console.error('Error fetching form data:', error)
        // Fallback to hardcoded data
        setDepartmentData({
          "Senior High": {
            yearLevels: ["Grade 11", "Grade 12"],
            programs: ["STEM", "ABM", "HUMSS", "GAS", "TVL"],
            sections: ["Section A", "Section B", "Section C", "Section D"],
          },
          College: {
            yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
            programs: ["BSIT", "BSCS", "BSIS", "BSA", "BSBA"],
            sections: ["Section A", "Section B", "Section C", "Section D"],
          },
          Elementary: {
            yearLevels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
            programs: ["Elementary"],
            sections: ["Section A", "Section B", "Section C", "Section D"],
          },
          "Junior High": {
            yearLevels: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
            programs: ["Junior High"],
            sections: ["Section A", "Section B", "Section C", "Section D"],
          },
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFormData()
  }, [schoolYearId])

  // Dynamic dropdown logic
  useEffect(() => {
    if (departmentData && formData.department && departmentData[formData.department]) {
      const deptData = departmentData[formData.department]
      setAvailablePrograms(deptData.programs || [])
      setAvailableYearLevels(deptData.yearLevels || [])
      
      // Reset dependent fields when department changes
      updateField("courseProgram", "")
      updateField("blockSection", "")
      updateField("yearLevel", "")
      updateField("major", "")
      setShowMajorsDropdown(false)
      setAvailableMajors([])
      setAvailableSections([]) // Clear sections initially
    }
  }, [formData.department, departmentData, updateField])

  // Handle major dropdown when course/program changes
  useEffect(() => {
    if (formData.department === 'College' && formData.courseProgram && programDetails[formData.courseProgram]) {
      const courseDetails = programDetails[formData.courseProgram]
      if (courseDetails.majorType === 'has-major' && courseDetails.majors && courseDetails.majors.length > 0) {
        setShowMajorsDropdown(true)
        setAvailableMajors(courseDetails.majors)
      } else {
        setShowMajorsDropdown(false)
        setAvailableMajors([])
      }
      // Reset major field when course changes
      updateField("major", "")
    } else {
      setShowMajorsDropdown(false)
      setAvailableMajors([])
    }
  }, [formData.department, formData.courseProgram, programDetails, updateField])

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
              updateField("blockSection", "")
            }
          }
        } catch (error) {
          console.error('Error fetching filtered sections:', error)
        }
      } else {
        // If not all required fields are selected, clear sections
        setAvailableSections([])
        if (formData.blockSection) {
          updateField("blockSection", "")
        }
      }
    }

    fetchFilteredSections()
  }, [formData.department, formData.courseProgram, formData.yearLevel, formData.major, schoolYearId, updateField])

  useEffect(() => {
    if (formData.courseProgram && formData.department && departmentData && departmentData[formData.department]) {
      const deptData = departmentData[formData.department]
      
      // For College courses, show majors dropdown for BSED
      if (formData.courseProgram === "BSED") {
        setShowMajorsDropdown(true)
        setAvailableMajors(["English", "Math", "Science"])
      } else {
        setShowMajorsDropdown(false)
        setAvailableMajors([])
      }
      
      // Reset section and major fields when program changes
      updateField("blockSection", "")
      updateField("major", "")
    }
  }, [formData.courseProgram, formData.department, departmentData, updateField])

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

  const handleInputChange = (field: string, value: string) => {
    updateField(field, value)
    
    // Auto-calculate age when birthday changes
    if (field === "birthday" && value) {
      const calculatedAge = calculateAge(value)
      if (calculatedAge !== null) {
        updateField("age", calculatedAge.toString())
      }
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    const validationError = validateImageFile(file)
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    try {
      // Show preview immediately
      const previewUrl = await getImagePreviewUrl(file)
      setProfilePhoto(previewUrl)

      // Clear profile photo error when image is selected
      if (errors.profilePhoto) {
        clearErrors()
      }

      // Upload to IMGBB
      const uploadResult = await uploadProfileImage(file)
      
      if (uploadResult.success) {
        // Update form data with the uploaded image URL
        updateField("profilePicture", uploadResult.url || "")
        
        toast({
          title: "Image uploaded successfully",
          description: "Profile photo has been uploaded.",
        })
      } else {
        toast({
          title: "Upload failed",
          description: uploadResult.error || "Failed to upload image",
          variant: "destructive",
        })
        // Reset preview on failure
        setProfilePhoto(null)
      }
    } catch (error) {
      console.error("Photo upload error:", error)
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the image",
        variant: "destructive",
      })
      setProfilePhoto(null)
    }
  }

  const handleSave = async () => {
    // Add profile photo validation
    if (!profilePhoto) {
      toast({
        title: "Validation Error",
        description: "Profile photo is required.",
        variant: "destructive",
      })
      return
    }

    if (!validateFormOnSubmit()) {
      const errorFields = Object.keys(errors).filter(key => errors[key])
      
      // Debug logging
      console.log("[Create Manual Profile] Validation failed:", {
        errors,
        errorFields,
        formData,
        selectedRole
      })
      
      const errorMessage = errorFields.length > 0 
        ? `Please fix the following fields: ${errorFields.join(', ')}`
        : "Please fix the errors before saving."
      
      toast({
        title: "Validation Error",
        description: errorMessage,
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/admin/${schoolYearId}/profiles/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType: selectedRole,
          profileData: {
            // Basic Info
            fullName: formData.fullName,
            nickname: formData.nickname,
            age: Number(formData.age),
            gender: formData.gender,
            birthday: formData.birthday,
            address: formData.address,
            email: formData.email,
            phone: formData.phone,
            
            // Yearbook Info
            profilePicture: formData.profilePicture,
            sayingMotto: formData.sayingMotto,
            
            // Role-specific data
            ...(selectedRole === "student" && {
              fatherGuardianName: formData.fatherGuardianName,
              motherGuardianName: formData.motherGuardianName,
              department: formData.department,
              yearLevel: formData.yearLevel,
              courseProgram: formData.courseProgram,
              major: formData.major,
              blockSection: formData.blockSection,
              dreamJob: formData.dreamJob,
              socialMediaFacebook: formData.socialMediaFacebook,
              socialMediaInstagram: formData.socialMediaInstagram,
              socialMediaTwitter: formData.socialMediaTwitter,
              hobbies: formData.hobbies,
              honors: formData.honors,
              officerRole: formData.officerRole,
            }),
            
            ...(selectedRole === "faculty" && {
              position: formData.position,
              department: formData.departmentAssigned === "Others" ? formData.customDepartmentAssigned : formData.departmentAssigned,
              departmentAssigned: formData.departmentAssigned === "Others" ? formData.customDepartmentAssigned : formData.departmentAssigned,
              yearsOfService: formData.yearsOfService ? Number(formData.yearsOfService) : undefined,
              messageToStudents: formData.messageToStudents,
              courses: formData.courses,
              additionalRoles: formData.additionalRoles,
            }),
            
            ...(selectedRole === "staff" && {
              position: formData.position,
              department: "Faculty & Staff", // Staff belong to Faculty & Staff collection
              officeAssigned: formData.officeAssigned === "Others" ? formData.customOfficeAssigned : formData.officeAssigned,
              yearsOfService: formData.yearsOfService ? Number(formData.yearsOfService) : undefined,
              messageToStudents: formData.messageToStudents,
            }),
            
            ...(selectedRole === "utility" && {
              position: formData.position,
              department: "Faculty & Staff", // Utility belong to Faculty & Staff collection
              officeAssigned: formData.officeAssigned === "Others" ? formData.customOfficeAssigned : formData.officeAssigned,
              yearsOfService: formData.yearsOfService ? Number(formData.yearsOfService) : undefined,
              messageToStudents: formData.messageToStudents,
            }),
            
            ...(selectedRole === "alumni" && {
              department: formData.department || "Alumni", // Ensure alumni have department field
              graduationYear: formData.graduationYear ? Number(formData.graduationYear) : undefined,
              currentProfession: formData.currentProfession,
              currentCompany: formData.currentCompany,
              currentLocation: formData.currentLocation,
              achievements: achievements,
              activities: formData.activities,
            }),
            
            // Additional fields
            bio: formData.bio,
            
            // Legacy fields for backward compatibility
            quote: formData.quote,
            ambition: formData.ambition,
          }
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Manual profile created successfully!",
        })
        
        // Dispatch event to notify other components about the new manual profile
        window.dispatchEvent(new CustomEvent('manualProfileCreated', {
          detail: {
            schoolYearId: schoolYearId,
            userType: selectedRole,
            profileId: result.profileId
          }
        }))
        
        onSave()
      } else {
        toast({
          title: "Error",
          description: result.message || result.error || "Failed to create profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error creating manual profile:', error)
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "student":
        return <GraduationCap className="h-4 w-4" />
      case "faculty":
        return <Users className="h-4 w-4" />
      case "alumni":
        return <UserCheck className="h-4 w-4" />
      case "staff":
        return <Briefcase className="h-4 w-4" />
      case "utility":
        return <Briefcase className="h-4 w-4" />
    }
  }

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case "faculty":
        return (
          <div className="space-y-6">
            {/* Professional Information */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Role *</Label>
                    <Input
                      id="position"
                      placeholder="Enter position/role"
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      className={errors.position ? "border-red-500" : ""}
                    />
                    {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departmentAssigned">Department Assigned *</Label>
                    <Select value={formData.departmentAssigned} onValueChange={(value) => {
                      handleInputChange("departmentAssigned", value)
                      if (value !== "Others") {
                        handleInputChange("customDepartmentAssigned", "")
                      }
                    }}>
                      <SelectTrigger className={errors.departmentAssigned ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Elementary">Elementary</SelectItem>
                        <SelectItem value="Junior High">Junior High</SelectItem>
                        <SelectItem value="Senior High">Senior High</SelectItem>
                        <SelectItem value="College">College</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.departmentAssigned && <p className="text-sm text-red-600">{errors.departmentAssigned}</p>}
                    
                    {formData.departmentAssigned === "Others" && (
                      <div className="mt-2">
                        <Label htmlFor="customDepartmentAssigned">Enter Correct Department Assigned *</Label>
                        <Input
                          id="customDepartmentAssigned"
                          placeholder="Enter department name"
                          value={formData.customDepartmentAssigned}
                          onChange={(e) => handleInputChange("customDepartmentAssigned", e.target.value)}
                          className={errors.customDepartmentAssigned ? "border-red-500" : ""}
                        />
                        {errors.customDepartmentAssigned && <p className="text-sm text-red-600">{errors.customDepartmentAssigned}</p>}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfService">Years of Service *</Label>
                    <Input
                      id="yearsOfService"
                      type="number"
                      placeholder="Enter years of service"
                      value={formData.yearsOfService}
                      onChange={(e) => handleInputChange("yearsOfService", e.target.value)}
                      className={errors.yearsOfService ? "border-red-500" : ""}
                    />
                    {errors.yearsOfService && <p className="text-sm text-red-600">{errors.yearsOfService}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messageToStudents">Message to Students</Label>
                  <Textarea
                    id="messageToStudents"
                    placeholder="Share a message with your students"
                    value={formData.messageToStudents}
                    onChange={(e) => handleInputChange("messageToStudents", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courses">Courses Taught</Label>
                  <Textarea
                    id="courses"
                    placeholder="List the courses you teach"
                    value={formData.courses}
                    onChange={(e) => handleInputChange("courses", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalRoles">Additional Roles & Responsibilities</Label>
                  <Textarea
                    id="additionalRoles"
                    placeholder="Any additional roles or responsibilities"
                    value={formData.additionalRoles}
                    onChange={(e) => handleInputChange("additionalRoles", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your professional background"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "staff":
        return (
          <div className="space-y-6">
            {/* Professional Information */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Role *</Label>
                    <Input
                      id="position"
                      placeholder="Enter position/role"
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      className={errors.position ? "border-red-500" : ""}
                    />
                    {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="officeAssigned">Department/Office Assigned *</Label>
                    <Select value={formData.officeAssigned} onValueChange={(value) => {
                      handleInputChange("officeAssigned", value)
                      if (value !== "Others") {
                        handleInputChange("customOfficeAssigned", "")
                      }
                    }}>
                      <SelectTrigger className={errors.officeAssigned ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select office" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="Registrar">Registrar</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="IT Department">IT Department</SelectItem>
                        <SelectItem value="Library">Library</SelectItem>
                        <SelectItem value="Guidance">Guidance</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.officeAssigned && <p className="text-sm text-red-600">{errors.officeAssigned}</p>}
                    
                    {formData.officeAssigned === "Others" && (
                      <div className="mt-2">
                        <Label htmlFor="customOfficeAssigned">Enter Correct Department/Office Assigned *</Label>
                        <Input
                          id="customOfficeAssigned"
                          placeholder="Enter office name"
                          value={formData.customOfficeAssigned}
                          onChange={(e) => handleInputChange("customOfficeAssigned", e.target.value)}
                          className={errors.customOfficeAssigned ? "border-red-500" : ""}
                        />
                        {errors.customOfficeAssigned && <p className="text-sm text-red-600">{errors.customOfficeAssigned}</p>}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfService">Years of Service *</Label>
                    <Input
                      id="yearsOfService"
                      type="number"
                      placeholder="Enter years of service"
                      value={formData.yearsOfService}
                      onChange={(e) => handleInputChange("yearsOfService", e.target.value)}
                      className={errors.yearsOfService ? "border-red-500" : ""}
                    />
                    {errors.yearsOfService && <p className="text-sm text-red-600">{errors.yearsOfService}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messageToStudents">Message to Students</Label>
                  <Textarea
                    id="messageToStudents"
                    placeholder="Share a message with your students"
                    value={formData.messageToStudents}
                    onChange={(e) => handleInputChange("messageToStudents", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "utility":
        return (
          <div className="space-y-6">
            {/* Professional Information */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Role *</Label>
                    <Input
                      id="position"
                      placeholder="Enter position/role"
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                      className={errors.position ? "border-red-500" : ""}
                    />
                    {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="officeAssigned">Department/Office Assigned *</Label>
                    <Select value={formData.officeAssigned} onValueChange={(value) => {
                      handleInputChange("officeAssigned", value)
                      if (value !== "Others") {
                        handleInputChange("customOfficeAssigned", "")
                      }
                    }}>
                      <SelectTrigger className={errors.officeAssigned ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select office" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Custodial">Custodial</SelectItem>
                        <SelectItem value="Groundskeeping">Groundskeeping</SelectItem>
                        <SelectItem value="IT Support">IT Support</SelectItem>
                        <SelectItem value="Facilities">Facilities</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.officeAssigned && <p className="text-sm text-red-600">{errors.officeAssigned}</p>}
                    
                    {formData.officeAssigned === "Others" && (
                      <div className="mt-2">
                        <Label htmlFor="customOfficeAssigned">Enter Specific Department Assigned *</Label>
                        <Input
                          id="customOfficeAssigned"
                          placeholder="Enter department name"
                          value={formData.customOfficeAssigned}
                          onChange={(e) => handleInputChange("customOfficeAssigned", e.target.value)}
                          className={errors.customOfficeAssigned ? "border-red-500" : ""}
                        />
                        {errors.customOfficeAssigned && <p className="text-sm text-red-600">{errors.customOfficeAssigned}</p>}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfService">Years of Service *</Label>
                    <Input
                      id="yearsOfService"
                      type="number"
                      placeholder="Enter years of service"
                      value={formData.yearsOfService}
                      onChange={(e) => handleInputChange("yearsOfService", e.target.value)}
                      className={errors.yearsOfService ? "border-red-500" : ""}
                    />
                    {errors.yearsOfService && <p className="text-sm text-red-600">{errors.yearsOfService}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messageToStudents">Message to Students</Label>
                  <Textarea
                    id="messageToStudents"
                    placeholder="Share a message with your students"
                    value={formData.messageToStudents}
                    onChange={(e) => handleInputChange("messageToStudents", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "alumni":
        return (
          <div className="space-y-6">
            {/* Academic Information */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                      <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="College">College</SelectItem>
                        <SelectItem value="Senior High">Senior High</SelectItem>
                        <SelectItem value="Junior High">Junior High</SelectItem>
                        <SelectItem value="Elementary">Elementary</SelectItem>
                        <SelectItem value="Graduate School">Graduate School</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-sm text-red-600">{errors.department}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseProgram">Course/Program (when studied) *</Label>
                    <Input
                      id="courseProgram"
                      placeholder="Enter course/program studied"
                      value={formData.courseProgram}
                      onChange={(e) => handleInputChange("courseProgram", e.target.value)}
                      className={errors.courseProgram ? "border-red-500" : ""}
                    />
                    {errors.courseProgram && <p className="text-sm text-red-600">{errors.courseProgram}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Year Graduated *</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      placeholder="Enter graduation year"
                      value={formData.graduationYear}
                      onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                      className={errors.graduationYear ? "border-red-500" : ""}
                    />
                    {errors.graduationYear && <p className="text-sm text-red-600">{errors.graduationYear}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Information */}
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  Career Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentProfession">Current Profession *</Label>
                    <Input
                      id="currentProfession"
                      placeholder="Enter current profession"
                      value={formData.currentProfession}
                      onChange={(e) => handleInputChange("currentProfession", e.target.value)}
                      className={errors.currentProfession ? "border-red-500" : ""}
                    />
                    {errors.currentProfession && <p className="text-sm text-red-600">{errors.currentProfession}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentCompany">Company/Organization</Label>
                    <Input
                      id="currentCompany"
                      placeholder="Enter company/organization"
                      value={formData.currentCompany}
                      onChange={(e) => handleInputChange("currentCompany", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentLocation">Current Location</Label>
                    <Input
                      id="currentLocation"
                      placeholder="Enter current location"
                      value={formData.currentLocation}
                      onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="achievements">Professional Achievements</Label>
                  <Textarea
                    id="achievements"
                    placeholder="List your professional achievements"
                    value={formData.achievements}
                    onChange={(e) => handleInputChange("achievements", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activities">Current Activities & Involvement</Label>
                  <Textarea
                    id="activities"
                    placeholder="Tell us about your current activities and involvement"
                    value={formData.activities}
                    onChange={(e) => handleInputChange("activities", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">About Me</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "student":
        return (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                      <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="College">College</SelectItem>
                        <SelectItem value="Senior High">Senior High</SelectItem>
                        <SelectItem value="Junior High">Junior High</SelectItem>
                        <SelectItem value="Elementary">Elementary</SelectItem>
                        <SelectItem value="Graduate School">Graduate School</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-sm text-red-600">{errors.department}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearLevel">Year Level *</Label>
                    <Select value={formData.yearLevel} onValueChange={(value) => handleInputChange("yearLevel", value)}>
                      <SelectTrigger className={errors.yearLevel ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select year level" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableYearLevels.map((level) => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.yearLevel && <p className="text-sm text-red-600">{errors.yearLevel}</p>}
                  </div>
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

                {/* Major field for BSED students */}
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
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-4 w-4 text-green-600" />
                  Parents/Guardian Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherGuardianName">Father's Name *</Label>
                    <Input
                      id="fatherGuardianName"
                      placeholder="e.g., Juan Dela Cruz"
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
                      placeholder="e.g., Maria Dela Cruz"
                      value={formData.motherGuardianName}
                      onChange={(e) => handleInputChange("motherGuardianName", e.target.value)}
                      className={errors.motherGuardianName ? "border-red-500" : ""}
                    />
                    {errors.motherGuardianName && <p className="text-sm text-red-600">{errors.motherGuardianName}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "faculty":
        return (
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    placeholder="e.g., Associate Professor, Instructor"
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    className={errors.position ? "border-red-500" : ""}
                  />
                  {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departmentAssigned">Department Assigned *</Label>
                  <Input
                    id="departmentAssigned"
                    placeholder="e.g., College of Computer Studies"
                    value={formData.departmentAssigned}
                    onChange={(e) => handleInputChange("departmentAssigned", e.target.value)}
                    className={errors.departmentAssigned ? "border-red-500" : ""}
                  />
                  {errors.departmentAssigned && <p className="text-sm text-red-600">{errors.departmentAssigned}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfService">Years of Service *</Label>
                <Input
                  id="yearsOfService"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData.yearsOfService}
                  onChange={(e) => handleInputChange("yearsOfService", e.target.value)}
                  className={errors.yearsOfService ? "border-red-500" : ""}
                />
                {errors.yearsOfService && <p className="text-sm text-red-600">{errors.yearsOfService}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageToStudents">Message to Students *</Label>
                <Textarea
                  id="messageToStudents"
                  placeholder="Share your message or advice to students..."
                  value={formData.messageToStudents}
                  onChange={(e) => handleInputChange("messageToStudents", e.target.value)}
                  className={errors.messageToStudents ? "border-red-500" : ""}
                  rows={3}
                />
                {errors.messageToStudents && <p className="text-sm text-red-600">{errors.messageToStudents}</p>}
              </div>
            </CardContent>
          </Card>
        )

      case "alumni":
        return (
          <div className="space-y-6">
            <Card className="border-orange-200 bg-orange-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-orange-600" />
                  Academic History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                      <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="College">College</SelectItem>
                        <SelectItem value="Senior High">Senior High</SelectItem>
                        <SelectItem value="Junior High">Junior High</SelectItem>
                        <SelectItem value="Elementary">Elementary</SelectItem>
                        <SelectItem value="Graduate School">Graduate School</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-sm text-red-600">{errors.department}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courseProgram">Course/Program *</Label>
                    <Input
                      id="courseProgram"
                      placeholder="e.g., BS Computer Science"
                      value={formData.courseProgram}
                      onChange={(e) => handleInputChange("courseProgram", e.target.value)}
                      className={errors.courseProgram ? "border-red-500" : ""}
                    />
                    {errors.courseProgram && <p className="text-sm text-red-600">{errors.courseProgram}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year *</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    placeholder="e.g., 2020"
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                    className={errors.graduationYear ? "border-red-500" : ""}
                  />
                  {errors.graduationYear && <p className="text-sm text-red-600">{errors.graduationYear}</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Career Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentProfession">Current Profession</Label>
                    <Input
                      id="currentProfession"
                      placeholder="e.g., Software Engineer"
                      value={formData.currentProfession}
                      onChange={(e) => handleInputChange("currentProfession", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentCompany">Current Company</Label>
                    <Input
                      id="currentCompany"
                      placeholder="e.g., Tech Solutions Inc."
                      value={formData.currentCompany}
                      onChange={(e) => handleInputChange("currentCompany", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentLocation">Current Location</Label>
                  <Input
                    id="currentLocation"
                    placeholder="e.g., Manila, Philippines"
                    value={formData.currentLocation}
                    onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "staff":
      case "utility":
        return (
          <Card className="border-gray-200 bg-gray-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-600" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    placeholder="e.g., Registrar, Maintenance Staff"
                    value={formData.position}
                    onChange={(e) => handleInputChange("position", e.target.value)}
                    className={errors.position ? "border-red-500" : ""}
                  />
                  {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="officeAssigned">Office Assigned *</Label>
                  <Input
                    id="officeAssigned"
                    placeholder="e.g., Registrar's Office, Maintenance Department"
                    value={formData.officeAssigned}
                    onChange={(e) => handleInputChange("officeAssigned", e.target.value)}
                    className={errors.officeAssigned ? "border-red-500" : ""}
                  />
                  {errors.officeAssigned && <p className="text-sm text-red-600">{errors.officeAssigned}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsOfService">Years of Service *</Label>
                <Input
                  id="yearsOfService"
                  type="number"
                  placeholder="e.g., 3"
                  value={formData.yearsOfService}
                  onChange={(e) => handleInputChange("yearsOfService", e.target.value)}
                  className={errors.yearsOfService ? "border-red-500" : ""}
                />
                {errors.yearsOfService && <p className="text-sm text-red-600">{errors.yearsOfService}</p>}
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading form data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Role Selection */}
          <Card className="p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-600" />
            Select Profile Type
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { value: "student", label: "Student", icon: getRoleIcon("student") },
              { value: "faculty", label: "Faculty", icon: getRoleIcon("faculty") },
              { value: "alumni", label: "Alumni", icon: getRoleIcon("alumni") },
              { value: "staff", label: "Staff", icon: getRoleIcon("staff") },
              { value: "utility", label: "Utility", icon: getRoleIcon("utility") },
            ].map((role) => (
              <Button
                key={role.value}
                variant={selectedRole === role.value ? "default" : "outline"}
                className={`h-20 flex flex-col items-center gap-2 transition-all duration-200 ${
                  selectedRole === role.value
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                    : "hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                }`}
                onClick={() => setSelectedRole(role.value as UserRole)}
              >
                <div className={`transition-colors duration-200 ${
                  selectedRole === role.value 
                    ? "text-white" 
                    : "text-gray-600 hover:text-blue-600"
                }`}>
                  {role.icon}
                </div>
                <span className={`text-sm font-medium transition-colors duration-200 ${
                  selectedRole === role.value 
                    ? "text-white" 
                    : "text-gray-700 hover:text-blue-700"
                }`}>{role.label}</span>
              </Button>
            ))}
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
        <CardContent className="px-0 pb-0 space-y-6">
          {/* Profile Picture Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              {/* Profile Photo Preview */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                {profilePhoto ? (
                  <Image src={profilePhoto} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                    <User className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Upload Section */}
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="profilePhoto" className="text-sm font-medium">
                    Add Profile Picture
                  </Label>
                  <div className="flex items-center gap-3">
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
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                  </div>
                  {errors.profilePhoto && <p className="text-sm text-red-600">{errors.profilePhoto}</p>}
                </div>
                
                {profilePhoto && (
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Profile picture uploaded successfully
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Fields */}
          <div className="space-y-4">
            <FormField
              id="fullName"
              label="Full Name"
              type="text"
              value={formData.fullName}
              onChange={(value) => handleInputChange("fullName", value)}
              onBlur={() => validateFieldOnBlur("fullName")}
              placeholder="Juan Dela Cruz"
              required
              error={errors.fullName}
              className="h-11"
            />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="nickname"
              label="Nickname"
              type="text"
              value={formData.nickname}
              onChange={(value) => handleInputChange("nickname", value)}
              onBlur={() => validateFieldOnBlur("nickname")}
              placeholder="Jay"
              error={errors.nickname}
            />
            <FormField
              id="age"
              label="Age"
              type="number"
              value={formData.age}
              onChange={(value) => handleInputChange("age", value)}
              onBlur={() => validateFieldOnBlur("age")}
              placeholder="Auto-calculated"
              required
              error={errors.age}
              disabled={true}
              className="bg-gray-50"
            />
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
                  <SelectItem value="Other">Other</SelectItem>
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
                placeholder="juan.delacruz@cctc.edu.ph"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="09123456789"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific fields */}
      {renderRoleSpecificFields()}

      {/* Additional Information for Students */}
      {selectedRole === "student" && (
        <Card className="p-6">
          <CardHeader className="px-0 pt-0 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dreamJob">Dream Job</Label>
              <Input
                id="dreamJob"
                placeholder="Software Engineer"
                value={formData.dreamJob}
                onChange={(e) => handleInputChange("dreamJob", e.target.value)}
              />
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
              <Select
                value={formData.officerRole}
                onValueChange={(value) => handleInputChange("officerRole", value)}
              >
                <SelectTrigger className={formData.officerRole && formData.officerRole !== "None" ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : ""}>
                  <SelectValue placeholder="Select officer role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Mayor">Mayor</SelectItem>
                  <SelectItem value="Vice Mayor">Vice Mayor</SelectItem>
                  <SelectItem value="Secretary">Secretary</SelectItem>
                  <SelectItem value="Assistant Secretary">Assistant Secretary</SelectItem>
                  <SelectItem value="Treasurer">Treasurer</SelectItem>
                  <SelectItem value="Assistant Treasurer">Assistant Treasurer</SelectItem>
                  <SelectItem value="Auditor">Auditor</SelectItem>
                </SelectContent>
              </Select>
              {formData.officerRole && formData.officerRole !== "None" && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-md">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Officer Role Active: {formData.officerRole}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Personal Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself, your interests, and aspirations..."
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Media Information */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-600" />
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
            <Heart className="h-5 w-5 text-yellow-600" />
            Yearbook Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sayingMotto">
              {selectedRole === "faculty" ? "Teaching Philosophy/Motto" : 
               selectedRole === "staff" || selectedRole === "utility" ? "Motto" : 
               "Motto/Saying"} *
            </Label>
            <Textarea
              id="sayingMotto"
              placeholder={
                selectedRole === "faculty" ? "Share your teaching philosophy or motto" :
                selectedRole === "staff" || selectedRole === "utility" ? "Share your motto" :
                "Strive for progress, not perfection"
              }
              value={formData.sayingMotto}
              onChange={(e) => handleInputChange("sayingMotto", e.target.value)}
              rows={2}
              className={errors.sayingMotto ? "border-red-500" : ""}
            />
            {errors.sayingMotto && <p className="text-sm text-red-600">{errors.sayingMotto}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="achievements">Achievements/Honors</Label>
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

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting}>
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Creating..." : "Create Profile"}
        </Button>
      </div>
        </>
      )}
    </div>
  )
}
