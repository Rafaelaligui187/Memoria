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

interface FacultyProfileSetupFormProps {
  schoolYearId: string
  userId: string
  isEditing?: boolean
  onBack: () => void
  onSave: () => void
}

export function FacultyProfileSetupForm({
  schoolYearId,
  userId,
  isEditing = false,
  onBack,
  onSave,
}: FacultyProfileSetupFormProps) {
  const [achievements, setAchievements] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

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

    // Faculty Info
    position: "",
    departmentAssigned: "",
    yearsOfService: "",
    messageToStudents: "",

    // Additional Info
    courses: "",
    additionalRoles: "",
    bio: "",

    // Yearbook Info
    profilePicture: "",
    sayingMotto: "",

    // Social Media
    socialMediaFacebook: "",
    socialMediaInstagram: "",
    socialMediaTwitter: "",
  })

  const addAchievement = () => {
    if (newAchievement.trim() && !achievements.includes(newAchievement.trim())) {
      setAchievements(prev => [...prev, newAchievement.trim()])
      setNewAchievement("")
    }
  }

  const removeAchievement = (index: number) => {
    setAchievements(prev => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      toast({
        title: "Invalid Image",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    try {
      const imageUrl = await uploadProfileImage(file)
      setProfilePhoto(imageUrl)
      handleInputChange("profilePicture", imageUrl)
      toast({
        title: "Success",
        description: "Profile picture uploaded successfully!",
      })
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

    // Required fields for faculty
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.nickname.trim()) newErrors.nickname = "Nickname is required"
    if (!formData.age.trim()) newErrors.age = "Age is required"
    if (!formData.gender.trim()) newErrors.gender = "Gender is required"
    if (!formData.birthday.trim()) newErrors.birthday = "Birthday is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.position.trim()) newErrors.position = "Position is required"
    if (!formData.departmentAssigned.trim()) newErrors.departmentAssigned = "Department is required"
    if (!formData.yearsOfService.trim()) newErrors.yearsOfService = "Years of service is required"

    // Debug logging
    console.log("[Faculty Form] Validation check:", {
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
        userType: "faculty",
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
          description: "Faculty profile created successfully!",
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Faculty Profile Setup</h2>
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
                  src={profilePhoto || getImagePreviewUrl(formData.profilePicture) || "/placeholder-user.jpg"}
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

      {/* Faculty Information */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0 pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-green-600" />
            Faculty Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position/Role *</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => {
                  handleInputChange("position", value)
                  // Reset department when position changes
                  handleInputChange("departmentAssigned", "")
                }}
              >
                <SelectTrigger className={errors.position ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select position/role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Department Head">Department Head</SelectItem>
                  <SelectItem value="Subject Teacher">Subject Teacher</SelectItem>
                  <SelectItem value="Teacher Adviser">Teacher Adviser</SelectItem>
                </SelectContent>
              </Select>
              {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentAssigned">Department Assigned *</Label>
              <Select value={formData.departmentAssigned} onValueChange={(value) => handleInputChange("departmentAssigned", value)}>
                <SelectTrigger className={errors.departmentAssigned ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {/* Same department options for all faculty roles */}
                  <SelectItem value="College of Computer Studies">College of Computer Studies</SelectItem>
                  <SelectItem value="College of Hospitality Management">College of Hospitality Management</SelectItem>
                  <SelectItem value="College of Education">College of Education</SelectItem>
                  <SelectItem value="College of Agriculture">College of Agriculture</SelectItem>
                  <SelectItem value="Elementary Department">Elementary Department</SelectItem>
                  <SelectItem value="Junior High School Department">Junior High School Department</SelectItem>
                  <SelectItem value="Senior High School Department">Senior High School Department</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                </SelectContent>
              </Select>
              {errors.departmentAssigned && <p className="text-sm text-red-500">{errors.departmentAssigned}</p>}
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
              {errors.yearsOfService && <p className="text-sm text-red-500">{errors.yearsOfService}</p>}
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
              <Label htmlFor="additionalRoles">Additional Roles</Label>
              <Textarea
                id="additionalRoles"
                placeholder="Any additional roles or responsibilities"
                value={formData.additionalRoles}
                onChange={(e) => handleInputChange("additionalRoles", e.target.value)}
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
    </div>
  )
}
