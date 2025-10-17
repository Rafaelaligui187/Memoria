"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Save, User, GraduationCap, Briefcase, Users, Wrench, AlertCircle, Heart } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ProfileSetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schoolYearId?: string | null
  isEditing?: boolean
}

type UserRole = "student" | "faculty" | "alumni" | "staff" | "utility" | "ar-sisters"

export function ProfileSetupDialog({ open, onOpenChange, schoolYearId, isEditing = false }: ProfileSetupDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [achievements, setAchievements] = useState<string[]>([])
  const [activities, setActivities] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")
  const [newActivity, setNewActivity] = useState("")
  const [showOtherSection, setShowOtherSection] = useState(false)
  
  // Academic Information state for faculty
  const [availableAcademicYearLevels, setAvailableAcademicYearLevels] = useState<string[]>([])
  const [availableAcademicPrograms, setAvailableAcademicPrograms] = useState<string[]>([])
  const [availableAcademicSections, setAvailableAcademicSections] = useState<{name: string, yearLevel: string}[]>([])
  const [departmentData, setDepartmentData] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    birthday: "",
    address: "",
    parentsGuardianName: "",
    course: "",
    yearLevel: "",
    block: "",
    sectionBlock: "",
    otherSectionBlock: "",
    quote: "",
    ambition: "",
    dreamJob: "",
    hobbies: "",
    honors: "",
    officerRole: "",
    department: "",
    position: "",
    yearsOfService: "",
    legacy: "",
    messageToStudents: "",
    graduationYear: "",
    work: "",
    company: "",
    location: "",
    advice: "",
    contribution: "",
    // AR Sisters specific fields
    vowsDate: "",
    customPosition: "",
    specialization: "",
    education: "",
    publications: "",
    research: "",
    classesHandled: "",
    departmentAssigned: "",
    customDepartmentAssigned: "",
    courses: "",
    additionalRoles: "",
    
    // Faculty Academic Information (optional for advisory roles)
    academicDepartment: "",
    academicYearLevels: [],
    academicCourseProgram: "",
    academicSections: [],
  })

  // Get school year label for display
  const getSchoolYearLabel = (yearId: string | null) => {
    if (!yearId) return ""
    return yearId.replace("-", "–")
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Detect officer role selection
    if (field === "officerRole") {
      if (value && value !== "None") {
        console.log(`🎯 Officer Role Selected: ${value}`, {
          studentName: formData.fullName || "Unknown",
          course: formData.course || "Unknown",
          yearLevel: formData.yearLevel || "Unknown",
          section: formData.sectionBlock || "Unknown",
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

  // Fetch dynamic form data
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/admin/form-data?schoolYearId=${schoolYearId}`)
        const result = await response.json()
        
        if (result.success) {
          setDepartmentData(result.data.departments)
          console.log('Dynamic form data loaded for profile dialog:', result.data.departments)
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
      }
    }

    if (schoolYearId) {
      fetchFormData()
    }
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
              schoolYearId: schoolYearId || "",
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

    if (schoolYearId) {
      fetchFilteredAcademicSections()
    }
  }, [formData.academicDepartment, formData.academicCourseProgram, formData.academicYearLevels, schoolYearId])

  const handleSectionBlockChange = (value: string) => {
    setFormData((prev) => ({ ...prev, sectionBlock: value }))
    setShowOtherSection(value === "Others")
    if (value !== "Others") {
      setFormData((prev) => ({ ...prev, otherSectionBlock: "" }))
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

  const handleSubmit = () => {
    console.log("[v0] Submitting profile data:", {
      formData,
      selectedRole,
      achievements,
      activities,
      schoolYearId,
      isEditing,
    })

    if (!formData.fullName.trim()) {
      toast({
        title: "Full name required",
        description: "Please enter your full name to continue.",
        variant: "destructive",
      })
      return
    }

    if (!schoolYearId) {
      toast({
        title: "School year required",
        description: "Please select a school year for your profile.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: isEditing ? "Profile updated successfully!" : "Profile created successfully!",
      description: isEditing
        ? "Your profile changes have been submitted for admin approval."
        : "Your yearbook profile has been submitted for admin approval.",
    })

    onOpenChange(false)
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

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case "student":
        return (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-4 w-4 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      placeholder="e.g., Jay, Tin, Mikee"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange("nickname", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      placeholder="MM/DD/YYYY"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange("birthday", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="e.g., 123 Sampaguita St., Quezon City"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentsGuardianName">Parents/Guardian Name</Label>
                  <Input
                    id="parentsGuardianName"
                    placeholder="e.g., Juan Dela Cruz, Maria Santos"
                    value={formData.parentsGuardianName}
                    onChange={(e) => handleInputChange("parentsGuardianName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dreamJob">Dream Job</Label>
                  <Input
                    id="dreamJob"
                    placeholder="e.g., Software Engineer, Architect, Teacher"
                    value={formData.dreamJob}
                    onChange={(e) => handleInputChange("dreamJob", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course / Program</Label>
                    <Input
                      id="course"
                      placeholder="e.g., Bachelor of Science in Information Technology"
                      value={formData.course}
                      onChange={(e) => handleInputChange("course", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearLevel">Year Level</Label>
                    <Select value={formData.yearLevel} onValueChange={(value) => handleInputChange("yearLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                        <SelectItem value="4">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sectionBlock">Section/Block</Label>
                  <Select value={formData.sectionBlock} onValueChange={handleSectionBlockChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your section/block" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Section A">Section A</SelectItem>
                      <SelectItem value="Section B">Section B</SelectItem>
                      <SelectItem value="Section C">Section C</SelectItem>
                      <SelectItem value="Section D">Section D</SelectItem>
                      <SelectItem value="Section E">Section E</SelectItem>
                      <SelectItem value="Section F">Section F</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  {showOtherSection && (
                    <Input
                      placeholder="Enter your section (e.g., BSIT 4th Year – Block D)"
                      value={formData.otherSectionBlock}
                      onChange={(e) => handleInputChange("otherSectionBlock", e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="honors">Honors / Awards</Label>
                  <Input
                    id="honors"
                    placeholder="e.g., Dean's List, Magna Cum Laude, Best Thesis Award"
                    value={formData.honors}
                    onChange={(e) => handleInputChange("honors", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officerRole">Officer Role (Optional)</Label>
                  <Select
                    value={formData.officerRole}
                    onValueChange={(value) => handleInputChange("officerRole", value)}
                  >
                    <SelectTrigger className={formData.officerRole && formData.officerRole !== "None" ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" : ""}>
                      <SelectValue placeholder="Select officer role (if applicable)" />
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
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quote">Quote / Message to Classmates</Label>
                  <Textarea
                    id="quote"
                    placeholder="e.g., 'The future belongs to those who believe in the beauty of their dreams.'"
                    value={formData.quote}
                    onChange={(e) => handleInputChange("quote", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ambition">Ambition</Label>
                    <Input
                      id="ambition"
                      placeholder="e.g., To become a successful entrepreneur and help others"
                      value={formData.ambition}
                      onChange={(e) => handleInputChange("ambition", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hobbies">Hobbies</Label>
                    <Input
                      id="hobbies"
                      placeholder="e.g., Reading, Gaming, Photography, Cooking"
                      value={formData.hobbies}
                      onChange={(e) => handleInputChange("hobbies", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "faculty":
        return (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-4 w-4 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      placeholder="e.g., Prof. Jay, Sir Mike, Ma'am Ana"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange("nickname", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      placeholder="MM/DD/YYYY"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange("birthday", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="e.g., 456 Mahogany Ave., Makati City"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department / Program</Label>
                    <Input
                      id="department"
                      placeholder="e.g., College of Computer Studies"
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position / Role</Label>
                    <Input
                      id="position"
                      placeholder="e.g., Associate Professor, Department Head"
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfService">Years of Service</Label>
                  <Input
                    id="yearsOfService"
                    type="number"
                    placeholder="e.g., 15"
                    value={formData.yearsOfService}
                    onChange={(e) => handleInputChange("yearsOfService", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="legacy">Legacy / Contribution Statement</Label>
                  <Textarea
                    id="legacy"
                    placeholder="e.g., Dedicated to nurturing future IT professionals through innovative teaching methods and industry partnerships..."
                    value={formData.legacy}
                    onChange={(e) => handleInputChange("legacy", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="messageToStudents">Message to Students</Label>
                  <Textarea
                    id="messageToStudents"
                    placeholder="e.g., Always remember that learning is a lifelong journey. Embrace challenges and never stop growing..."
                    value={formData.messageToStudents}
                    onChange={(e) => handleInputChange("messageToStudents", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Academic Information - Faculty (Optional for Advisory Roles) */}
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                  Academic Information (Optional)
                  <span className="text-sm font-normal text-gray-500">
                    - Fill this section if you serve as an adviser
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
          </div>
        )

      case "alumni":
        return (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-4 w-4 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      placeholder="e.g., Jay, Tin, Mikee"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange("nickname", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      placeholder="MM/DD/YYYY"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange("birthday", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="e.g., 789 Narra St., Cebu City"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-green-600" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="course">Course / Program</Label>
                    <Input
                      id="course"
                      placeholder="e.g., Bachelor of Science in Computer Science"
                      value={formData.course}
                      onChange={(e) => handleInputChange("course", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Batch / Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      placeholder="Graduation Year"
                      value={formData.graduationYear}
                      onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="honors">Honors / Awards (During Studies)</Label>
                  <Input
                    id="honors"
                    placeholder="e.g., Summa Cum Laude, Outstanding Thesis Award"
                    value={formData.honors}
                    onChange={(e) => handleInputChange("honors", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quote">Quote / Message to Batch Mates</Label>
                  <Textarea
                    id="quote"
                    placeholder="e.g., 'Our journey together has shaped who we are today. Let's continue to inspire each other...'"
                    value={formData.quote}
                    onChange={(e) => handleInputChange("quote", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ambition">Ambition</Label>
                    <Input
                      id="ambition"
                      placeholder="e.g., To lead innovative tech solutions globally"
                      value={formData.ambition}
                      onChange={(e) => handleInputChange("ambition", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hobbies">Hobbies</Label>
                    <Input
                      id="hobbies"
                      placeholder="e.g., Traveling, Photography, Mentoring"
                      value={formData.hobbies}
                      onChange={(e) => handleInputChange("hobbies", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-accent" />
                  Alumni Life Updates (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="work">Current Work / Profession</Label>
                    <Input
                      id="work"
                      placeholder="e.g., Senior Software Engineer"
                      value={formData.work}
                      onChange={(e) => handleInputChange("work", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company / Organization</Label>
                    <Input
                      id="company"
                      placeholder="e.g., Google Philippines"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Taguig City, Metro Manila"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advice">Advice to Future Generations</Label>
                  <Textarea
                    id="advice"
                    placeholder="e.g., 'Stay curious, embrace challenges, and never stop learning. The tech industry rewards those who adapt...'"
                    value={formData.advice}
                    onChange={(e) => handleInputChange("advice", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "staff":
      case "utility":
        return (
          <div className="space-y-6">
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-4 w-4 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nickname">Nickname</Label>
                    <Input
                      id="nickname"
                      placeholder="e.g., Kuya Jun, Ate Maria, Sir Ben"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange("nickname", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      placeholder="MM/DD/YYYY"
                      value={formData.birthday}
                      onChange={(e) => handleInputChange("birthday", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="e.g., 321 Acacia St., Pasig City"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  Work Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department / Office</Label>
                    <Input
                      id="department"
                      placeholder={
                        selectedRole === "utility"
                          ? "e.g., Maintenance Department, Security Office"
                          : "e.g., Registrar's Office, Finance Department"
                      }
                      value={formData.department}
                      onChange={(e) => handleInputChange("department", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position / Role</Label>
                    <Input
                      id="position"
                      placeholder={
                        selectedRole === "utility"
                          ? "e.g., Maintenance Technician, Security Guard"
                          : "e.g., Administrative Assistant, Accounting Clerk"
                      }
                      value={formData.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfService">Years of Service</Label>
                  <Input
                    id="yearsOfService"
                    type="number"
                    placeholder="e.g., 8"
                    value={formData.yearsOfService}
                    onChange={(e) => handleInputChange("yearsOfService", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contribution">Contribution / Role Description</Label>
                  <Textarea
                    id="contribution"
                    placeholder="e.g., Ensuring the campus is clean and safe for all students and faculty. Maintaining facilities to provide a conducive learning environment..."
                    value={formData.contribution}
                    onChange={(e) => handleInputChange("contribution", e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "ar-sisters":
        return (
          <div className="space-y-6">
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-4 w-4 text-purple-600" />
                  Religious & Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vowsDate">Date of Vows</Label>
                    <Input
                      id="vowsDate"
                      type="date"
                      value={formData.vowsDate}
                      onChange={(e) => handleInputChange("vowsDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position/Role *</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => {
                        handleInputChange("position", value)
                        handleInputChange("departmentAssigned", "")
                        handleInputChange("customDepartmentAssigned", "")
                        if (value !== "Others") {
                          handleInputChange("customPosition", "")
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position/role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Department Head">Department Head</SelectItem>
                        <SelectItem value="Subject Teacher">Subject Teacher</SelectItem>
                        <SelectItem value="Teacher Adviser">Teacher Adviser</SelectItem>
                        <SelectItem value="Guidance Counselor">Guidance Counselor</SelectItem>
                        <SelectItem value="Librarian">Librarian</SelectItem>
                        <SelectItem value="Registrar">Registrar</SelectItem>
                        <SelectItem value="Finance Officer">Finance Officer</SelectItem>
                        <SelectItem value="HR Officer">HR Officer</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {formData.position === "Others" && (
                      <div className="mt-2">
                        <Label htmlFor="customPosition">Enter Specific Position/Role *</Label>
                        <Input
                          id="customPosition"
                          placeholder="Enter your specific position/role"
                          value={formData.customPosition}
                          onChange={(e) => handleInputChange("customPosition", e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departmentAssigned">Department Assigned *</Label>
                    <Select
                      value={formData.departmentAssigned}
                      onValueChange={(value) => {
                        handleInputChange("departmentAssigned", value)
                        if (value !== "Others") {
                          handleInputChange("customDepartmentAssigned", "")
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {(formData.position === "Department Head" || formData.position === "Teacher") ? (
                          <>
                            <SelectItem value="College of Computer Studies">College of Computer Studies</SelectItem>
                            <SelectItem value="College of Hospitality Management">College of Hospitality Management</SelectItem>
                            <SelectItem value="College of Education">College of Education</SelectItem>
                            <SelectItem value="College of Agriculture">College of Agriculture</SelectItem>
                            <SelectItem value="Elementary Department">Elementary Department</SelectItem>
                            <SelectItem value="Junior High School Department">Junior High School Department</SelectItem>
                            <SelectItem value="Senior High School Department">Senior High School Department</SelectItem>
                            <SelectItem value="Administration">Administration</SelectItem>
                            <SelectItem value="Others">Others</SelectItem>
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
                            <SelectItem value="Others">Others</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    
                    {formData.departmentAssigned === "Others" && (
                      <div className="mt-2">
                        <Label htmlFor="customDepartmentAssigned">Enter Correct Department Assigned *</Label>
                        <Input
                          id="customDepartmentAssigned"
                          placeholder="Enter department name"
                          value={formData.customDepartmentAssigned}
                          onChange={(e) => handleInputChange("customDepartmentAssigned", e.target.value)}
                        />
                      </div>
                    )}
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
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      placeholder="Mathematics, Science, English"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange("specialization", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Educational Background</Label>
                  <Textarea
                    id="education"
                    placeholder="Bachelor of Education, Master of Arts in Education"
                    value={formData.education}
                    onChange={(e) => handleInputChange("education", e.target.value)}
                    rows={3}
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

            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Academic & Research Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="publications">Publications</Label>
                  <Textarea
                    id="publications"
                    placeholder="List your published works, research papers, articles"
                    value={formData.publications}
                    onChange={(e) => handleInputChange("publications", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="research">Research Interests</Label>
                  <Textarea
                    id="research"
                    placeholder="Educational Technology, Curriculum Development, Student Assessment"
                    value={formData.research}
                    onChange={(e) => handleInputChange("research", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="classesHandled">Classes Handled</Label>
                  <Textarea
                    id="classesHandled"
                    placeholder="Grade 11 STEM, Grade 12 ABM, College IT Students"
                    value={formData.classesHandled}
                    onChange={(e) => handleInputChange("classesHandled", e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold text-primary">
            {isEditing ? "Edit Your Yearbook Profile" : "Set Up Your Yearbook Profile"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? `Update your yearbook profile for ${getSchoolYearLabel(schoolYearId)}. Changes will require admin approval.`
              : `Create your personalized yearbook profile for ${getSchoolYearLabel(schoolYearId)}. Fill out the form with clear examples provided.`}
          </DialogDescription>
        </DialogHeader>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
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

        <div className="space-y-6">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Select Your Role</Label>
                <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student" className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Student
                      </div>
                    </SelectItem>
                    <SelectItem value="faculty">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Faculty
                      </div>
                    </SelectItem>
                    <SelectItem value="alumni">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Alumni
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
                        Utility
                      </div>
                    </SelectItem>
                    <SelectItem value="ar-sisters">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        AR Sisters
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="e.g., Juan Dela Cruz"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePhoto">Profile Photo</Label>
                <div className="flex items-center gap-3 p-4 border-2 border-dashed border-muted rounded-lg">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <Button variant="outline" size="sm" className="mb-1 bg-transparent">
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {renderRoleSpecificFields()}

          {(selectedRole === "student" ||
            selectedRole === "faculty" ||
            selectedRole === "alumni" ||
            selectedRole === "staff" ||
            selectedRole === "utility" ||
            selectedRole === "ar-sisters") && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Achievements</h3>
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
          )}

          {(selectedRole === "student" || selectedRole === "faculty" || selectedRole === "alumni") && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Activities</h3>
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
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Gallery Images</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Drag and drop images here, or click to select files</p>
              <Button variant="outline" className="mt-2 bg-transparent">
                Choose Files
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="px-6">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="px-6 bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Update Profile" : "Save Profile"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
