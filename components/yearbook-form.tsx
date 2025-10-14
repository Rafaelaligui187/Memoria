'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Department, YearbookEntry } from '@/lib/yearbook-schemas'

interface YearbookFormProps {
  department: Department
  schoolYearId: string
  onSuccess?: (entry: YearbookEntry) => void
  onError?: (error: string) => void
  initialData?: Partial<YearbookEntry>
  isEditing?: boolean
}

interface FormData {
  // Personal Info
  fullName: string
  nickname: string
  age: string
  gender: string
  birthday: string
  address: string
  email: string
  phone: string
  profilePicture: string
  
  // Family Info
  fatherGuardianName: string
  motherGuardianName: string
  
  // Academic Info
  department: string
  yearLevel: string
  courseProgram: string
  blockSection: string
  
  // Extras
  sayingMotto: string
  dreamJob: string
  officerRole: string
  bio: string
  hobbies: string
  honors: string
  achievements: string
  
  // Social Media
  facebook: string
  twitter: string
  instagram: string
  linkedin: string
  tiktok: string
  
  // Alumni specific
  graduationYear: string
  currentJobTitle: string
  currentEmployer: string
  currentLocation: string
  
  // Faculty & Staff specific
  position: string
  yearsOfService: string
  office: string
  courses: string
  additionalRoles: string
}

const initialFormData: FormData = {
  fullName: '',
  nickname: '',
  age: '',
  gender: '',
  birthday: '',
  address: '',
  email: '',
  phone: '',
  profilePicture: '',
  fatherGuardianName: '',
  motherGuardianName: '',
  department: '',
  yearLevel: '',
  courseProgram: '',
  blockSection: '',
  sayingMotto: '',
  dreamJob: '',
  officerRole: '',
  bio: '',
  hobbies: '',
  honors: '',
  achievements: '',
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  tiktok: '',
  graduationYear: '',
  currentJobTitle: '',
  currentEmployer: '',
  currentLocation: '',
  position: '',
  yearsOfService: '',
  office: '',
  courses: '',
  additionalRoles: ''
}

export function YearbookForm({ 
  department, 
  schoolYearId, 
  onSuccess, 
  onError, 
  initialData, 
  isEditing = false 
}: YearbookFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [schoolYearLabel, setSchoolYearLabel] = useState<string>('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        nickname: initialData.nickname || '',
        age: initialData.age?.toString() || '',
        gender: initialData.gender || '',
        birthday: initialData.birthday ? new Date(initialData.birthday).toISOString().split('T')[0] : '',
        address: initialData.address || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        profilePicture: initialData.profilePicture || '',
        fatherGuardianName: initialData.fatherGuardianName || '',
        motherGuardianName: initialData.motherGuardianName || '',
        department: initialData.department || department,
        yearLevel: initialData.yearLevel || '',
        courseProgram: initialData.courseProgram || '',
        blockSection: initialData.blockSection || '',
        sayingMotto: initialData.sayingMotto || '',
        dreamJob: initialData.dreamJob || '',
        officerRole: initialData.officerRole || '',
        bio: initialData.bio || '',
        hobbies: initialData.hobbies?.join(', ') || '',
        honors: initialData.honors?.join(', ') || '',
        achievements: initialData.achievements?.join(', ') || '',
        facebook: initialData.socialMedia?.facebook || '',
        twitter: initialData.socialMedia?.twitter || '',
        instagram: initialData.socialMedia?.instagram || '',
        linkedin: initialData.socialMedia?.linkedin || '',
        tiktok: initialData.socialMedia?.tiktok || '',
        graduationYear: (initialData as any).graduationYear || '',
        currentJobTitle: (initialData as any).currentJobTitle || '',
        currentEmployer: (initialData as any).currentEmployer || '',
        currentLocation: (initialData as any).currentLocation || '',
        position: (initialData as any).position || '',
        yearsOfService: (initialData as any).yearsOfService?.toString() || '',
        office: (initialData as any).office || '',
        courses: (initialData as any).courses?.join(', ') || '',
        additionalRoles: (initialData as any).additionalRoles?.join(', ') || ''
      })
    }
  }, [initialData, department])

  // Fetch school year label for display
  useEffect(() => {
    const fetchSchoolYearLabel = async () => {
      if (!schoolYearId) return
      
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

    fetchSchoolYearLabel()
  }, [schoolYearId])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Prepare data for submission
      const submissionData: any = {
        fullName: formData.fullName,
        email: formData.email,
        department: department,
        schoolYear: schoolYearLabel, // Include school year label from admin settings
        ...(formData.nickname && { nickname: formData.nickname }),
        ...(formData.age && { age: parseInt(formData.age) }),
        ...(formData.gender && { gender: formData.gender }),
        ...(formData.birthday && { birthday: new Date(formData.birthday) }),
        ...(formData.address && { address: formData.address }),
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.profilePicture && { profilePicture: formData.profilePicture }),
        ...(formData.fatherGuardianName && { fatherGuardianName: formData.fatherGuardianName }),
        ...(formData.motherGuardianName && { motherGuardianName: formData.motherGuardianName }),
        ...(formData.yearLevel && { yearLevel: formData.yearLevel }),
        ...(formData.courseProgram && { courseProgram: formData.courseProgram }),
        ...(formData.blockSection && { blockSection: formData.blockSection }),
        ...(formData.sayingMotto && { sayingMotto: formData.sayingMotto }),
        ...(formData.dreamJob && { dreamJob: formData.dreamJob }),
        ...(formData.officerRole && { officerRole: formData.officerRole }),
        ...(formData.bio && { bio: formData.bio }),
        ...(formData.hobbies && { hobbies: formData.hobbies.split(',').map(h => h.trim()).filter(h => h) }),
        ...(formData.honors && { honors: formData.honors.split(',').map(h => h.trim()).filter(h => h) }),
        ...(formData.achievements && { achievements: formData.achievements.split(',').map(a => a.trim()).filter(a => a) }),
        ...(formData.facebook || formData.twitter || formData.instagram || formData.linkedin || formData.tiktok ? {
          socialMedia: {
            ...(formData.facebook && { facebook: formData.facebook }),
            ...(formData.twitter && { twitter: formData.twitter }),
            ...(formData.instagram && { instagram: formData.instagram }),
            ...(formData.linkedin && { linkedin: formData.linkedin }),
            ...(formData.tiktok && { tiktok: formData.tiktok })
          }
        } : {})
      }

      // Add department-specific fields
      if (department === 'Alumni') {
        if (formData.graduationYear) submissionData.graduationYear = formData.graduationYear
        if (formData.currentJobTitle) submissionData.currentJobTitle = formData.currentJobTitle
        if (formData.currentEmployer) submissionData.currentEmployer = formData.currentEmployer
        if (formData.currentLocation) submissionData.currentLocation = formData.currentLocation
      }

      if (department === 'Faculty & Staff') {
        if (formData.position) submissionData.position = formData.position
        if (formData.yearsOfService) submissionData.yearsOfService = parseInt(formData.yearsOfService)
        if (formData.office) submissionData.office = formData.office
        if (formData.courses) submissionData.courses = formData.courses.split(',').map(c => c.trim()).filter(c => c)
        if (formData.additionalRoles) submissionData.additionalRoles = formData.additionalRoles.split(',').map(r => r.trim()).filter(r => r)
      }

      const url = isEditing && initialData?._id 
        ? `/api/yearbook/${initialData._id}?department=${encodeURIComponent(department)}`
        : '/api/yearbook'
      
      const method = isEditing ? 'PUT' : 'POST'
      
      const body = isEditing 
        ? { department, data: submissionData }
        : { department, schoolYearId, data: submissionData }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to save yearbook entry')
      }

      setMessage({ type: 'success', text: result.message || 'Yearbook entry saved successfully!' })
      onSuccess?.(result.data)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setMessage({ type: 'error', text: errorMessage })
      onError?.(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const isAlumni = department === 'Alumni'
  const isFacultyStaff = department === 'Faculty & Staff'

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit' : 'Create'} {department} Yearbook Entry
        </CardTitle>
        <CardDescription>
          Fill out the form below to {isEditing ? 'update' : 'create'} your yearbook entry.
          {schoolYearLabel && (
            <span className="block mt-2 text-sm font-medium text-blue-600">
              School Year: {schoolYearLabel}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <Alert className={message.type === 'success' ? 'border-green-500' : 'border-red-500'}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nickname">Nickname</Label>
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="birthday">Birthday</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChange('phone', value);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="profilePicture">Profile Picture URL</Label>
                <Input
                  id="profilePicture"
                  value={formData.profilePicture}
                  onChange={(e) => handleInputChange('profilePicture', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
          </div>

          {/* Family Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Family Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fatherGuardianName">Father/Guardian Name</Label>
                <Input
                  id="fatherGuardianName"
                  value={formData.fatherGuardianName}
                  onChange={(e) => handleInputChange('fatherGuardianName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="motherGuardianName">Mother/Guardian Name</Label>
                <Input
                  id="motherGuardianName"
                  value={formData.motherGuardianName}
                  onChange={(e) => handleInputChange('motherGuardianName', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="yearLevel">Year Level *</Label>
                <Input
                  id="yearLevel"
                  value={formData.yearLevel}
                  onChange={(e) => handleInputChange('yearLevel', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="courseProgram">Course/Program *</Label>
                <Input
                  id="courseProgram"
                  value={formData.courseProgram}
                  onChange={(e) => handleInputChange('courseProgram', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="blockSection">Block/Section</Label>
                <Input
                  id="blockSection"
                  value={formData.blockSection}
                  onChange={(e) => handleInputChange('blockSection', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Alumni Specific Fields */}
          {isAlumni && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Alumni Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="graduationYear">Graduation Year *</Label>
                  <Input
                    id="graduationYear"
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentJobTitle">Current Job Title</Label>
                  <Input
                    id="currentJobTitle"
                    value={formData.currentJobTitle}
                    onChange={(e) => handleInputChange('currentJobTitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currentEmployer">Current Employer</Label>
                  <Input
                    id="currentEmployer"
                    value={formData.currentEmployer}
                    onChange={(e) => handleInputChange('currentEmployer', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currentLocation">Current Location</Label>
                  <Input
                    id="currentLocation"
                    value={formData.currentLocation}
                    onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Faculty & Staff Specific Fields */}
          {isFacultyStaff && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Faculty & Staff Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="yearsOfService">Years of Service</Label>
                  <Input
                    id="yearsOfService"
                    type="number"
                    value={formData.yearsOfService}
                    onChange={(e) => handleInputChange('yearsOfService', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="office">Office</Label>
                  <Input
                    id="office"
                    value={formData.office}
                    onChange={(e) => handleInputChange('office', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="courses">Courses (comma-separated)</Label>
                  <Input
                    id="courses"
                    value={formData.courses}
                    onChange={(e) => handleInputChange('courses', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="additionalRoles">Additional Roles (comma-separated)</Label>
                  <Input
                    id="additionalRoles"
                    value={formData.additionalRoles}
                    onChange={(e) => handleInputChange('additionalRoles', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Extras */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sayingMotto">Saying/Motto</Label>
                <Input
                  id="sayingMotto"
                  value={formData.sayingMotto}
                  onChange={(e) => handleInputChange('sayingMotto', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dreamJob">Dream Job</Label>
                <Input
                  id="dreamJob"
                  value={formData.dreamJob}
                  onChange={(e) => handleInputChange('dreamJob', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="officerRole">Officer Role</Label>
                <Input
                  id="officerRole"
                  value={formData.officerRole}
                  onChange={(e) => handleInputChange('officerRole', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="hobbies">Hobbies (comma-separated)</Label>
              <Input
                id="hobbies"
                value={formData.hobbies}
                onChange={(e) => handleInputChange('hobbies', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="honors">Honors (comma-separated)</Label>
              <Input
                id="honors"
                value={formData.honors}
                onChange={(e) => handleInputChange('honors', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="achievements">Achievements (comma-separated)</Label>
              <Input
                id="achievements"
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
              />
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="tiktok">TikTok</Label>
                <Input
                  id="tiktok"
                  value={formData.tiktok}
                  onChange={(e) => handleInputChange('tiktok', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Entry' : 'Create Entry'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
