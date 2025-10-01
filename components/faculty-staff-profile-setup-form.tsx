"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Save, User, Briefcase, Heart, ArrowLeft, AlertCircle, Share2, Award } from "lucide-react"
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
  })

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
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  placeholder={userRole === "faculty" ? "Professor" : "Administrative Assistant"}
                  value={formData.position}
                  onChange={(e) => handleInputChange("position", e.target.value)}
                  className={errors.position ? "border-red-500" : ""}
                />
                {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  placeholder="Computer Science Department"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className={errors.department ? "border-red-500" : ""}
                />
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
    </div>
  )
}
