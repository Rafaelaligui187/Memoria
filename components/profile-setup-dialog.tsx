"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, Save, User, GraduationCap, Briefcase, Users, Wrench } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ProfileSetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type UserRole = "student" | "faculty" | "alumni" | "staff" | "utility"

export function ProfileSetupDialog({ open, onOpenChange }: ProfileSetupDialogProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [achievements, setAchievements] = useState<string[]>([])
  const [activities, setActivities] = useState<string[]>([])
  const [newAchievement, setNewAchievement] = useState("")
  const [newActivity, setNewActivity] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    course: "",
    yearLevel: "",
    block: "",
    quote: "",
    ambition: "",
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
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
    console.log("[v0] Submitting profile data:", { formData, selectedRole, achievements, activities })

    if (!formData.fullName.trim()) {
      toast({
        title: "Full name required",
        description: "Please enter your full name to continue.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Profile saved successfully!",
      description: "Your yearbook profile has been updated.",
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course / Program</Label>
                <Input
                  id="course"
                  placeholder="e.g., Computer Science"
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearLevel">Year Level</Label>
                <Select value={formData.yearLevel} onValueChange={(value) => handleInputChange("yearLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
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
              <Label htmlFor="block">Block / Section</Label>
              <Input
                id="block"
                placeholder="e.g., Block A"
                value={formData.block}
                onChange={(e) => handleInputChange("block", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">Quote / Message to Classmates</Label>
              <Textarea
                id="quote"
                placeholder="Your message to your classmates..."
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
                  placeholder="Your future goals..."
                  value={formData.ambition}
                  onChange={(e) => handleInputChange("ambition", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hobbies">Hobbies</Label>
                <Input
                  id="hobbies"
                  placeholder="Your hobbies and interests..."
                  value={formData.hobbies}
                  onChange={(e) => handleInputChange("hobbies", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="honors">Honors / Awards</Label>
              <Input
                id="honors"
                placeholder="Academic honors, awards, recognitions..."
                value={formData.honors}
                onChange={(e) => handleInputChange("honors", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="officerRole">Officer Role (Optional)</Label>
              <Select value={formData.officerRole} onValueChange={(value) => handleInputChange("officerRole", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select officer role (if applicable)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Mayor">Mayor</SelectItem>
                  <SelectItem value="Vice Mayor">Vice Mayor</SelectItem>
                  <SelectItem value="Secretary">Secretary</SelectItem>
                  <SelectItem value="Treasurer">Treasurer</SelectItem>
                  <SelectItem value="Auditor">Auditor</SelectItem>
                  <SelectItem value="Business Manager">Business Manager</SelectItem>
                  <SelectItem value="P.I.O">P.I.O</SelectItem>
                  <SelectItem value="Peace Officer">Peace Officer</SelectItem>
                  <SelectItem value="Representative">Representative</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "faculty":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department / Program</Label>
                <Input
                  id="department"
                  placeholder="e.g., Computer Science Department"
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position / Role</Label>
                <Input
                  id="position"
                  placeholder="e.g., Professor, Department Head"
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
                placeholder="e.g., 10"
                value={formData.yearsOfService}
                onChange={(e) => handleInputChange("yearsOfService", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legacy">Legacy / Contribution Statement</Label>
              <Textarea
                id="legacy"
                placeholder="Describe your contributions to the institution..."
                value={formData.legacy}
                onChange={(e) => handleInputChange("legacy", e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="messageToStudents">Message to Students</Label>
              <Textarea
                id="messageToStudents"
                placeholder="Your message to current and future students..."
                value={formData.messageToStudents}
                onChange={(e) => handleInputChange("messageToStudents", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )

      case "alumni":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course / Program</Label>
                <Input
                  id="course"
                  placeholder="e.g., Computer Science"
                  value={formData.course}
                  onChange={(e) => handleInputChange("course", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Batch / Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  placeholder="e.g., 2020"
                  value={formData.graduationYear}
                  onChange={(e) => handleInputChange("graduationYear", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">Quote / Message to Batch Mates</Label>
              <Textarea
                id="quote"
                placeholder="Your message to your batch mates..."
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
                  placeholder="Your goals and aspirations..."
                  value={formData.ambition}
                  onChange={(e) => handleInputChange("ambition", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hobbies">Hobbies</Label>
                <Input
                  id="hobbies"
                  placeholder="Your hobbies and interests..."
                  value={formData.hobbies}
                  onChange={(e) => handleInputChange("hobbies", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="honors">Honors / Awards (During Studies)</Label>
              <Input
                id="honors"
                placeholder="Academic honors, awards, recognitions..."
                value={formData.honors}
                onChange={(e) => handleInputChange("honors", e.target.value)}
              />
            </div>

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
                      placeholder="e.g., Software Engineer"
                      value={formData.work}
                      onChange={(e) => handleInputChange("work", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company / Organization</Label>
                    <Input
                      id="company"
                      placeholder="e.g., Tech Corp"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Manila, Philippines"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advice">Advice to Future Generations</Label>
                  <Textarea
                    id="advice"
                    placeholder="Your advice to current students..."
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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department / Office</Label>
                <Input
                  id="department"
                  placeholder={selectedRole === "utility" ? "e.g., Maintenance, Security" : "e.g., Registrar's Office"}
                  value={formData.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position / Role</Label>
                <Input
                  id="position"
                  placeholder={
                    selectedRole === "utility" ? "e.g., Janitor, Security Guard" : "e.g., Administrative Assistant"
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
                placeholder="e.g., 5"
                value={formData.yearsOfService}
                onChange={(e) => handleInputChange("yearsOfService", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contribution">Contribution / Role Description</Label>
              <Textarea
                id="contribution"
                placeholder="Describe your role and contributions to the institution..."
                value={formData.contribution}
                onChange={(e) => handleInputChange("contribution", e.target.value)}
                rows={4}
              />
            </div>
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
          <DialogTitle className="text-xl font-bold text-primary">Set Up Your Yearbook Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create your personalized yearbook profile. Fields will change based on your selected role.
          </DialogDescription>
        </DialogHeader>

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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
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

          <Card className="border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {getRoleIcon(selectedRole)}
                Role-Specific Information
              </CardTitle>
            </CardHeader>
            <CardContent>{renderRoleSpecificFields()}</CardContent>
          </Card>

          {(selectedRole === "student" ||
            selectedRole === "faculty" ||
            selectedRole === "alumni" ||
            selectedRole === "staff" ||
            selectedRole === "utility") && (
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
              Save Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
