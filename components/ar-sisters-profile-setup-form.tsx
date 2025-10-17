"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Upload, Save, User, Heart, ArrowLeft, AlertCircle, Share2, Award, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface ARSistersProfileSetupFormProps {
  schoolYearId: string
  isEditing?: boolean
  onBack: () => void
  onSave: () => void
}

export function ARSistersProfileSetupForm({
  schoolYearId,
  isEditing = false,
  onBack,
  onSave,
}: ARSistersProfileSetupFormProps) {
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
    // AR Sisters specific fields
    position: "",
    department: "",
    customDepartment: "",
    yearsOfService: "",
    bio: "",
    additionalRoles: "",
    messageToStudents: "",
    customPosition: "",
    vowsDate: "",
    specialization: "",
    education: "",
    publications: "",
    research: "",
    classesHandled: "",
    gallery: "",
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

    // Required for all AR Sisters
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

    // AR Sisters specific required fields
    if (!formData.position.trim()) {
      newErrors.position = "Position is required"
    } else if (formData.position === "Others" && !formData.customPosition.trim()) {
      newErrors.customPosition = "Please enter your specific position/role"
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required"
    } else if (formData.department === "Others" && !formData.customDepartment.trim()) {
      newErrors.customDepartment = "Please enter the correct department name"
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

    console.log("[v0] Submitting AR Sisters profile data:", {
      formData,
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
            {isEditing ? "Edit" : "Create"} AR Sisters Profile
          </h3>
          <p className="text-sm text-muted-foreground">School Year {getSchoolYearLabel(schoolYearId)}</p>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-purple-800">
            <p className="font-medium mb-1">Admin Approval Required</p>
            <p className="text-purple-700">
              {isEditing
                ? "Any changes to your profile will be submitted for admin review before being published."
                : "Your profile will be submitted for admin review before being published in the AR Sisters section."}
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
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-purple-200">
                {profilePhoto ? (
                  <Image src={profilePhoto || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-100 text-purple-400">
                    <Users className="h-12 w-12" />
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
                    <Users className="h-4 w-4" />
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
                  {formData.religiousOrder && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span>{formData.religiousOrder}</span>
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
                  placeholder="Sister Maria Dela Cruz"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={`h-11 ${errors.fullName ? "border-red-500" : ""}`}
                />
                {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nickname">Religious Name/Nickname</Label>
                  <Input
                    id="nickname"
                    placeholder="Sister Maria"
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

          {/* Religious & Professional Information */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Religious & Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-4">
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
                    // Reset department when position changes
                    handleInputChange("department", "")
                    handleInputChange("customDepartment", "")
                    if (value !== "Others") {
                      handleInputChange("customPosition", "")
                    }
                  }}
                >
                  <SelectTrigger className={errors.position ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select position/role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="School Directress">School Directress</SelectItem>
                    <SelectItem value="Department Head">Department Head</SelectItem>
                    <SelectItem value="Teacher">Teacher</SelectItem>
                    <SelectItem value="Guidance Counselor">Guidance Counselor</SelectItem>
                    <SelectItem value="Librarian">Librarian</SelectItem>
                    <SelectItem value="Registrar">Registrar</SelectItem>
                    <SelectItem value="Finance Officer">Finance Officer</SelectItem>
                    <SelectItem value="HR Officer">HR Officer</SelectItem>
                    <SelectItem value="Others">Others</SelectItem>
                  </SelectContent>
                </Select>
                {errors.position && <p className="text-sm text-red-600">{errors.position}</p>}
                
                {formData.position === "Others" && (
                  <div className="mt-2">
                    <Label htmlFor="customPosition">Enter Specific Position/Role *</Label>
                    <Input
                      id="customPosition"
                      placeholder="Enter your specific position/role"
                      value={formData.customPosition}
                      onChange={(e) => handleInputChange("customPosition", e.target.value)}
                      className={errors.customPosition ? "border-red-500" : ""}
                    />
                    {errors.customPosition && <p className="text-sm text-red-600">{errors.customPosition}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department Assigned *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => {
                    handleInputChange("department", value)
                    if (value !== "Others") {
                      handleInputChange("customDepartment", "")
                    }
                  }}
                >
                  <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Dynamic department options based on position */}
                    {formData.position === "School Directress" ? (
                      <SelectItem value="School Dean">School Dean</SelectItem>
                    ) : (formData.position === "Department Head" || formData.position === "Teacher") ? (
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
                {errors.department && <p className="text-sm text-red-600">{errors.department}</p>}
                
                {formData.department === "Others" && (
                  <div className="mt-2">
                    <Label htmlFor="customDepartment">Enter Correct Department Assigned *</Label>
                    <Input
                      id="customDepartment"
                      placeholder="Enter department name"
                      value={formData.customDepartment}
                      onChange={(e) => handleInputChange("customDepartment", e.target.value)}
                      className={errors.customDepartment ? "border-red-500" : ""}
                    />
                    {errors.customDepartment && <p className="text-sm text-red-600">{errors.customDepartment}</p>}
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

              <div className="space-y-2">
                <Label htmlFor="education">Educational Background</Label>
                <Textarea
                  id="education"
                  placeholder="Bachelor of Education, Master of Arts in Education"
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  rows={2}
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

          {/* Academic & Research Information */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Academic & Research Information
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-4">
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
                    placeholder="@sister.maria"
                    value={formData.facebook}
                    onChange={(e) => handleInputChange("facebook", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="@sistermaria"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange("instagram", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X</Label>
                  <Input
                    id="twitter"
                    placeholder="@sistermaria"
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
