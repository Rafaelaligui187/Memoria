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
  Wrench,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
import { uploadProfileImage, validateImageFile, getImagePreviewUrl } from "@/lib/image-upload-utils"
import { useFormValidation } from "@/hooks/use-form-validation"
import { commonValidationRules } from "@/lib/form-validation"
import { FormField } from "@/components/form-field"
import { calculateAge } from "@/lib/age-utils"

interface UnifiedProfileSetupFormProps {
  schoolYearId: string
  userId: string
  isEditing?: boolean
  onBack: () => void
  onSave: () => void
}

type UserRole = "student" | "alumni" | "faculty" | "staff" | "utility"

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

export function UnifiedProfileSetupForm({
  schoolYearId,
  userId,
  isEditing = false,
  onBack,
  onSave,
}: UnifiedProfileSetupFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const [departmentData, setDepartmentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
  const [availableMajors, setAvailableMajors] = useState<string[]>([])
  const [showMajorsDropdown, setShowMajorsDropdown] = useState(false)
  const [programDetails, setProgramDetails] = useState<any>({})

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
          console.log('Dynamic form data loaded for unified form:', result.data.departments)
          console.log('Program details loaded:', result.data.programDetails)
        } else {
          console.error('Failed to fetch form data:', result.error)
          // Fallback to hardcoded data
          setDepartmentData({
            "Elementary": {
              yearLevels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
              programs: ["Elementary"],
              sections: ["Section A", "Section B", "Section C", "Section D"],
            },
            "Junior High": {
              yearLevels: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
              programs: ["Junior High"],
              sections: ["Section A", "Section B", "Section C", "Section D"],
            },
            "Senior High": {
              yearLevels: ["Grade 11", "Grade 12"],
              programs: ["STEM", "ABM", "HUMSS", "GAS", "TVL"],
              sections: ["Section A", "Section B", "Section C", "Section D"],
            },
            "College": {
              yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
              programs: ["BSIT", "BSCS", "BSIS", "BSA", "BSBA"],
              sections: ["Section A", "Section B", "Section C", "Section D"],
            },
          })
        }
      } catch (error) {
        console.error('Error fetching form data:', error)
        // Fallback to hardcoded data
        setDepartmentData({
          "Elementary": {
            yearLevels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
            programs: ["Elementary"],
            sections: ["Section A", "Section B", "Section C", "Section D"],
          },
          "Junior High": {
            yearLevels: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
            programs: ["Junior High"],
            sections: ["Section A", "Section B", "Section C", "Section D"],
          },
          "Senior High": {
            yearLevels: ["Grade 11", "Grade 12"],
            programs: ["STEM", "ABM", "HUMSS", "GAS", "TVL"],
            sections: ["Section A", "Section B", "Section C", "Section D"],
          },
          "College": {
            yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
            programs: ["BSIT", "BSCS", "BSIS", "BSA", "BSBA"],
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
      setAvailableYearLevels(deptData.yearLevels || [])
      setAvailablePrograms(deptData.programs || [])
      
      // Reset dependent fields when department changes
      updateField("yearLevel", "")
      updateField("courseProgram", "")
      updateField("blockSection", "")
      updateField("major", "")
      setAvailableSections([]) // Clear sections initially
      setShowMajorsDropdown(false)
      setAvailableMajors([])
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

  // State for school year label
  const [schoolYearLabel, setSchoolYearLabel] = useState<string>('')

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
            const profileData = {
              // Basic Info
              fullName: existingProfile.fullName || "",
              nickname: existingProfile.nickname || "",
              age: existingProfile.age?.toString() || "",
              gender: existingProfile.gender || "",
              birthday: existingProfile.birthday ? new Date(existingProfile.birthday).toISOString().split('T')[0] : "",
              address: existingProfile.address || "",
              email: existingProfile.email || "",
              phone: existingProfile.phone || "",

              // Yearbook Info
              profilePicture: existingProfile.profilePicture || "",
              sayingMotto: existingProfile.sayingMotto || "",

              // Student fields
              fatherGuardianName: existingProfile.fatherGuardianName || "",
              motherGuardianName: existingProfile.motherGuardianName || "",
              department: existingProfile.department || "",
              yearLevel: existingProfile.yearLevel || "",
              courseProgram: existingProfile.courseProgram || "",
              major: existingProfile.major || "",
              blockSection: existingProfile.blockSection || "",
              dreamJob: existingProfile.dreamJob || "",
              socialMediaFacebook: existingProfile.socialMediaFacebook || "",
              socialMediaInstagram: existingProfile.socialMediaInstagram || "",
              socialMediaTwitter: existingProfile.socialMediaTwitter || "",

              // Faculty fields
              position: existingProfile.position || "",
              departmentAssigned: existingProfile.departmentAssigned || "",
              yearsOfService: existingProfile.yearsOfService?.toString() || "",
              messageToStudents: existingProfile.messageToStudents || "",

              // Staff fields
              officeAssigned: existingProfile.officeAssigned || "",

              // Alumni fields
              graduationYear: existingProfile.graduationYear || "",
              currentProfession: existingProfile.currentProfession || "",
              currentCompany: existingProfile.currentCompany || "",
              currentLocation: existingProfile.currentLocation || "",

              // Additional personal fields
              bio: existingProfile.bio || "",

              // Student-specific additional fields
              hobbies: existingProfile.hobbies || "",
              honors: existingProfile.honors || "",
              officerRole: existingProfile.officerRole || "",

              // Faculty-specific additional fields
              courses: existingProfile.courses || "",
              additionalRoles: existingProfile.additionalRoles || "",

              // Alumni-specific additional fields
              achievements: existingProfile.achievements || "",
              activities: existingProfile.activities || "",

              // Legacy fields for backward compatibility
              quote: existingProfile.quote || "",
              ambition: existingProfile.ambition || "",
            }

            // Update form data using updateField
            Object.entries(profileData).forEach(([key, value]) => {
              updateField(key, value)
            })

            // Set profile photo if exists
            if (existingProfile.profilePicture) {
              setProfilePhoto(existingProfile.profilePicture)
            }

            // Set achievements array if exists
            if (existingProfile.achievements && Array.isArray(existingProfile.achievements)) {
              setAchievements(existingProfile.achievements)
            } else if (existingProfile.achievements && typeof existingProfile.achievements === 'string') {
              setAchievements(existingProfile.achievements.split(',').map((a: string) => a.trim()).filter((a: string) => a))
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
    updateField(field, value)
    
    // Auto-calculate age when birthday changes
    if (field === "birthday" && value) {
      const calculatedAge = calculateAge(value)
      if (calculatedAge !== null) {
        updateField("age", calculatedAge.toString())
      }
    }
    
    // Detect officer role selection
    if (field === "officerRole") {
      if (value && value !== "None") {
        console.log(`🎯 Officer Role Selected: ${value}`, {
          studentName: formData.fullName || "Unknown",
          department: formData.department || "Unknown",
          yearLevel: formData.yearLevel || "Unknown",
          section: formData.blockSection || "Unknown",
          timestamp: new Date().toISOString()
        })
        
        // Show success toast for officer role selection
        toast({
          title: "Officer Role Selected! 🎉",
          description: `You've been assigned as ${value}. This will be displayed prominently in the yearbook.`,
          duration: 4000,
        })
      } else if (value === "None") {
        console.log("❌ Officer Role Removed", {
          studentName: formData.fullName || "Unknown",
          timestamp: new Date().toISOString()
        })
        
        toast({
          title: "Officer Role Removed",
          description: "You are no longer assigned an officer role.",
          duration: 3000,
        })
      }
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

  const handleSubmit = async () => {
    // Add profile photo validation
    if (!profilePhoto) {
      toast({
        title: "Please fix the errors",
        description: "Profile photo is required.",
        variant: "destructive",
      })
      return
    }

    if (!validateFormOnSubmit()) {
      const errorFields = Object.keys(errors).filter(key => errors[key])
      
      // Debug logging
      console.log("[Unified Form] Validation failed:", {
        errors,
        errorFields,
        formData,
        selectedRole
      })
      
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

    setSubmitting(true)

    try {
      console.log("[v0] Submitting unified profile data:", {
        formData,
        selectedRole,
        achievements,
        schoolYearId,
        isEditing,
        profilePicture: formData.profilePicture,
        hasProfilePicture: !!formData.profilePicture,
      })

      // Prepare profile data for submission
      const profileData = {
        // Basic Info
        fullName: formData.fullName,
        nickname: formData.nickname,
        age: formData.age,
        gender: formData.gender,
        birthday: formData.birthday,
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
        
        // Yearbook Info
        schoolYear: getSchoolYearLabel(schoolYearId), // Include school year label from admin settings
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
          yearsOfService: formData.yearsOfService,
          messageToStudents: formData.messageToStudents,
          courses: formData.courses,
          additionalRoles: formData.additionalRoles,
        }),
        
        ...((selectedRole === "staff" || selectedRole === "utility") && {
          position: formData.position,
          department: "Faculty & Staff", // Staff belong to Faculty &Staff collection
          officeAssigned: formData.officeAssigned === "Others" ? formData.customOfficeAssigned : formData.officeAssigned,
          yearsOfService: formData.yearsOfService,
          messageToStudents: formData.messageToStudents,
        }),
        
        ...(selectedRole === "alumni" && {
          department: formData.department || "Alumni", // Ensure alumni have department field
          graduationYear: formData.graduationYear,
          currentProfession: formData.currentProfession,
          currentCompany: formData.currentCompany,
          currentLocation: formData.currentLocation,
          achievements: formData.achievements,
          activities: formData.activities,
        }),
        
        // Additional fields
        bio: formData.bio,
        achievements: achievements, // Array of achievements
      }

      console.log("[v0] Final profileData being sent to API:", {
        profilePicture: profileData.profilePicture,
        hasProfilePicture: !!profileData.profilePicture,
        profileDataKeys: Object.keys(profileData)
      })

      // Submit to API
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schoolYearId,
          userType: selectedRole,
          profileData,
          userId,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: isEditing ? "Profile updated successfully!" : "Profile created successfully!",
          description: isEditing
            ? "Your profile changes have been submitted for admin approval."
            : "Your profile has been submitted for admin approval.",
        })
        
        // Dispatch event for new profile creation (only for new profiles, not edits)
        if (!isEditing) {
          window.dispatchEvent(new CustomEvent('newProfileCreated'))
        }
        
        onSave()
      } else {
        toast({
          title: "Profile submission failed",
          description: result.message || "Failed to submit profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Profile submission error:", error)
      toast({
        title: "Profile submission failed",
        description: "An error occurred while submitting your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
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
          description: "Your profile photo has been uploaded.",
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
      case "utility":
        return <Wrench className="h-4 w-4" />
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
        return "Staff"
      case "utility":
        return "Utility (Maintenance)"
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
                  Profile Photo <span className="text-red-500">*</span>
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
                    className={`w-full ${errors.profilePhoto ? 'border-red-500 hover:border-red-600' : ''}`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                  {errors.profilePhoto && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.profilePhoto}
                    </p>
                  )}
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
                  {(selectedRole === "faculty" || selectedRole === "staff" || selectedRole === "utility") && formData.position && (
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
                        Staff
                      </div>
                    </SelectItem>
                    <SelectItem value="utility">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4" />
                        Utility (Maintenance)
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
                    placeholder="Auto-calculated"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className={`${errors.age ? "border-red-500" : ""} bg-gray-50`}
                    disabled={true}
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
                    type="tel"
                    placeholder="09123456789"
                    value={formData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      handleInputChange("phone", value);
                    }}
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

                  {showMajorsDropdown && (
                    <div className="space-y-2">
                      <Label htmlFor="major">Major (Optional)</Label>
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

          {/* Professional Information - Faculty, Staff & Utility */}
          {(selectedRole === "faculty" || selectedRole === "staff" || selectedRole === "utility") && (
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
                  <Select
                    value={selectedRole === "faculty" ? formData.departmentAssigned : formData.officeAssigned}
                    onValueChange={(value) => {
                      handleInputChange(
                        selectedRole === "faculty" ? "departmentAssigned" : "officeAssigned",
                        value,
                      )
                      if (value !== "Others") {
                        handleInputChange(
                          selectedRole === "faculty" ? "customDepartmentAssigned" : "customOfficeAssigned",
                          "",
                        )
                      }
                    }}
                  >
                    <SelectTrigger
                      className={
                        errors[selectedRole === "faculty" ? "departmentAssigned" : "officeAssigned"]
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder={
                        selectedRole === "faculty"
                          ? "Select department"
                          : "Select office"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedRole === "faculty" ? (
                        <>
                          <SelectItem value="Elementary">Elementary</SelectItem>
                          <SelectItem value="Junior High">Junior High</SelectItem>
                          <SelectItem value="Senior High">Senior High</SelectItem>
                          <SelectItem value="College">College</SelectItem>
                          <SelectItem value="Administration">Administration</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </>
                      ) : selectedRole === "staff" ? (
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
                          <SelectItem value="Others">Others</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Maintenance">Maintenance</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                          <SelectItem value="Custodial">Custodial</SelectItem>
                          <SelectItem value="Groundskeeping">Groundskeeping</SelectItem>
                          <SelectItem value="IT Support">IT Support</SelectItem>
                          <SelectItem value="Facilities">Facilities</SelectItem>
                          <SelectItem value="Others">Others</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  {errors[selectedRole === "faculty" ? "departmentAssigned" : "officeAssigned"] && (
                    <p className="text-sm text-red-600">
                      {errors[selectedRole === "faculty" ? "departmentAssigned" : "officeAssigned"]}
                    </p>
                  )}
                  
                  {(selectedRole === "faculty" ? formData.departmentAssigned : formData.officeAssigned) === "Others" && (
                    <div className="mt-2">
                      <Label htmlFor={selectedRole === "faculty" ? "customDepartmentAssigned" : "customOfficeAssigned"}>
                        {selectedRole === "faculty" ? "Enter Correct Department Assigned *" : 
                         selectedRole === "staff" ? "Enter Correct Department/Office Assigned *" :
                         "Enter Specific Department Assigned *"}
                      </Label>
                      <Input
                        id={selectedRole === "faculty" ? "customDepartmentAssigned" : "customOfficeAssigned"}
                        placeholder={
                          selectedRole === "faculty"
                            ? "Enter department name"
                            : selectedRole === "staff"
                            ? "Enter office name"
                            : "Enter department name"
                        }
                        value={selectedRole === "faculty" ? formData.customDepartmentAssigned : formData.customOfficeAssigned}
                        onChange={(e) =>
                          handleInputChange(
                            selectedRole === "faculty" ? "customDepartmentAssigned" : "customOfficeAssigned",
                            e.target.value,
                          )
                        }
                        className={
                          errors[selectedRole === "faculty" ? "customDepartmentAssigned" : "customOfficeAssigned"]
                            ? "border-red-500"
                            : ""
                        }
                      />
                      {errors[selectedRole === "faculty" ? "customDepartmentAssigned" : "customOfficeAssigned"] && (
                        <p className="text-sm text-red-600">
                          {errors[selectedRole === "faculty" ? "customDepartmentAssigned" : "customOfficeAssigned"]}
                        </p>
                      )}
                    </div>
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

                {(selectedRole === "faculty" || selectedRole === "staff" || selectedRole === "utility") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="messageToStudents">
                        {selectedRole === "faculty" ? "Message to Students *" : "Message to Students"}
                      </Label>
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

                    {selectedRole === "faculty" && (
                      <>
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
                  <Label htmlFor="currentProfession">Current Profession *</Label>
                  <Input
                    id="currentProfession"
                    placeholder="Software Engineer"
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
                    <Select value={formData.officerRole} onValueChange={(value) => handleInputChange("officerRole", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select officer role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mayor">Mayor</SelectItem>
                        <SelectItem value="Vice Mayor">Vice Mayor</SelectItem>
                        <SelectItem value="Secretary">Secretary</SelectItem>
                        <SelectItem value="Assistant Secretary">Assistant Secretary</SelectItem>
                        <SelectItem value="Treasurer">Treasurer</SelectItem>
                        <SelectItem value="Assistant Treasurer">Assistant Treasurer</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.officerRole && formData.officerRole !== "None" && (
                      <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded-md">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Officer Role Active: {formData.officerRole}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="bio">
                  {selectedRole === "student"
                    ? "Personal Bio *"
                    : selectedRole === "faculty"
                      ? "Professional Bio *"
                      : selectedRole === "alumni"
                        ? "About Me *"
                        : "Bio *"}
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
        <Button 
          onClick={handleSubmit} 
          className="px-6" 
          disabled={!profilePhoto}
        >
          <Save className="mr-2 h-4 w-4" />
          {isEditing ? "Update Profile" : "Save Profile"}
        </Button>
      </div>
        </>
      )}
    </div>
  )
}
