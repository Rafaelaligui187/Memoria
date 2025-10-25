"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"

interface AdvisoryFormProps {
  schoolYearId: string
  formData: {
    academicDepartment: string
    academicYearLevel: string
    academicCourseProgram: string
    academicSection: string
    academicMajor?: string
    messageToStudents?: string
  }
  onInputChange: (field: string, value: string) => void
  errors?: Record<string, string>
}

export function AdvisoryForm({
  schoolYearId,
  formData,
  onInputChange,
  errors = {}
}: AdvisoryFormProps) {
  const [departmentData, setDepartmentData] = useState<any>(null)
  const [availableAcademicYearLevels, setAvailableAcademicYearLevels] = useState<string[]>([])
  const [availableAcademicPrograms, setAvailableAcademicPrograms] = useState<string[]>([])
  const [availableAcademicSections, setAvailableAcademicSections] = useState<string[]>([])
  const [availableAcademicMajors, setAvailableAcademicMajors] = useState<string[]>([])
  const [showMajorsDropdown, setShowMajorsDropdown] = useState(false)
  const [isLoadingFormData, setIsLoadingFormData] = useState(true)
  const [formDataError, setFormDataError] = useState<string | null>(null)

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
          console.log('Dynamic form data loaded for advisory form:', result.data.departments)
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

  // Academic Information dynamic dropdown logic
  useEffect(() => {
    if (departmentData && formData.academicDepartment && departmentData[formData.academicDepartment]) {
      const deptData = departmentData[formData.academicDepartment]
      setAvailableAcademicYearLevels(deptData.yearLevels || [])
      setAvailableAcademicPrograms(deptData.programs || [])
      
      // Check if BSED is selected to show majors dropdown
      if (formData.academicCourseProgram === "BSED") {
        setShowMajorsDropdown(true)
        setAvailableAcademicMajors(["English", "Math", "Science"])
      } else {
        setShowMajorsDropdown(false)
        setAvailableAcademicMajors([])
      }
      
      // Reset dependent fields when department changes
      onInputChange("academicYearLevel", "")
      onInputChange("academicCourseProgram", "")
      onInputChange("academicSection", "")
      onInputChange("academicMajor", "")
      setAvailableAcademicSections([]) // Clear sections initially
    }
  }, [formData.academicDepartment, departmentData, onInputChange])

  // Handle course/program change to show/hide majors dropdown
  useEffect(() => {
    if (formData.academicCourseProgram === "BSED") {
      setShowMajorsDropdown(true)
      setAvailableAcademicMajors(["English", "Math", "Science"])
    } else {
      setShowMajorsDropdown(false)
      setAvailableAcademicMajors([])
      // Reset major field when course changes
      if (formData.academicMajor) {
        onInputChange("academicMajor", "")
      }
    }
  }, [formData.academicCourseProgram, onInputChange])

  // Fetch filtered academic sections when course/program and year level are selected
  useEffect(() => {
    const fetchFilteredAcademicSections = async () => {
      // For BSED courses, we need major to be selected as well
      const shouldFetchSections = formData.academicDepartment && 
        formData.academicCourseProgram && 
        formData.academicYearLevel &&
        (formData.academicCourseProgram !== "BSED" || formData.academicMajor)
      
      if (shouldFetchSections) {
        try {
          const params = new URLSearchParams({
            schoolYearId: schoolYearId,
            department: formData.academicDepartment,
            program: formData.academicCourseProgram,
            yearLevel: formData.academicYearLevel
          })
          
          // Add major parameter for BSED courses
          if (formData.academicCourseProgram === "BSED" && formData.academicMajor) {
            params.append('major', formData.academicMajor)
          }
          
          const response = await fetch(`/api/admin/form-data?${params}`)
          const result = await response.json()
          
          if (result.success) {
            setAvailableAcademicSections(result.data.sections || [])
            console.log(`Filtered academic sections for ${formData.academicDepartment} - ${formData.academicCourseProgram} - ${formData.academicYearLevel}${formData.academicMajor ? ` - ${formData.academicMajor}` : ''}:`, result.data.sections)
            
            // Reset academic section if current selection is not available
            if (formData.academicSection && !result.data.sections.includes(formData.academicSection)) {
              onInputChange("academicSection", "")
            }
          }
        } catch (error) {
          console.error('Error fetching filtered academic sections:', error)
        }
      } else {
        // If not all required fields are selected, clear sections
        setAvailableAcademicSections([])
        if (formData.academicSection) {
          onInputChange("academicSection", "")
        }
      }
    }

    fetchFilteredAcademicSections()
  }, [formData.academicDepartment, formData.academicCourseProgram, formData.academicYearLevel, formData.academicMajor, schoolYearId, onInputChange])

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0 pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-green-600" />
          Advisory Information
          <span className="text-sm font-normal text-gray-500">
            - Fill this section if you serve as an adviser
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0 space-y-4">
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

        {/* Form Content - Only show when data is loaded */}
        {!isLoadingFormData && !formDataError && (
          <>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Academic Information</p>
                  <p>Select the department, year level, course/program, and section/block for your advisory role. Your profile will appear as an adviser on the respective Yearbook pages.</p>
                </div>
              </div>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="academicDepartment">Department</Label>
            <Select 
              value={formData.academicDepartment} 
              onValueChange={(value) => {
                onInputChange("academicDepartment", value)
                // Reset dependent fields when department changes
                onInputChange("academicYearLevel", "")
                onInputChange("academicCourseProgram", "")
                onInputChange("academicSection", "")
              }}
            >
              <SelectTrigger className={errors.academicDepartment ? "border-red-500" : ""}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Elementary">Elementary</SelectItem>
                <SelectItem value="Junior High">Junior High</SelectItem>
                <SelectItem value="Senior High">Senior High</SelectItem>
                <SelectItem value="College">College</SelectItem>
              </SelectContent>
            </Select>
            {errors.academicDepartment && <p className="text-sm text-red-500">{errors.academicDepartment}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicCourseProgram">Course/Program</Label>
            <Select 
              value={formData.academicCourseProgram} 
              onValueChange={(value) => {
                onInputChange("academicCourseProgram", value)
                // Reset sections and major when course changes
                onInputChange("academicSection", "")
                onInputChange("academicMajor", "")
              }}
            >
              <SelectTrigger className={errors.academicCourseProgram ? "border-red-500" : ""}>
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
            {errors.academicCourseProgram && <p className="text-sm text-red-500">{errors.academicCourseProgram}</p>}
          </div>
        </div>

        {/* Selective Majors for BSED */}
        {showMajorsDropdown && (
          <div className="space-y-2">
            <Label htmlFor="academicMajor">Selective Major *</Label>
            <Select 
              value={formData.academicMajor || ""} 
              onValueChange={(value) => onInputChange("academicMajor", value)}
            >
              <SelectTrigger className={errors.academicMajor ? "border-red-500" : ""}>
                <SelectValue placeholder="Select major" />
              </SelectTrigger>
              <SelectContent>
                {availableAcademicMajors.map((major) => (
                  <SelectItem key={major} value={major}>
                    {major}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.academicMajor && <p className="text-sm text-red-500">{errors.academicMajor}</p>}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="academicYearLevel">Year Level</Label>
            <Select 
              value={formData.academicYearLevel} 
              onValueChange={(value) => {
                onInputChange("academicYearLevel", value)
                // Reset section when year level changes
                onInputChange("academicSection", "")
              }}
            >
              <SelectTrigger className={errors.academicYearLevel ? "border-red-500" : ""}>
                <SelectValue placeholder="Select year level" />
              </SelectTrigger>
              <SelectContent>
                {availableAcademicYearLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.academicYearLevel && <p className="text-sm text-red-500">{errors.academicYearLevel}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicSection">Section/Block</Label>
            <Select 
              value={formData.academicSection} 
              onValueChange={(value) => onInputChange("academicSection", value)}
            >
              <SelectTrigger className={errors.academicSection ? "border-red-500" : ""}>
                <SelectValue placeholder="Select section/block" />
              </SelectTrigger>
              <SelectContent>
                {availableAcademicSections.map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.academicSection && <p className="text-sm text-red-500">{errors.academicSection}</p>}
          </div>
        </div>

        {/* Class Motto */}
        <div className="space-y-2">
          <Label htmlFor="messageToStudents">Class Motto *</Label>
          <textarea
            id="messageToStudents"
            value={formData.messageToStudents || ""}
            onChange={(e) => onInputChange("messageToStudents", e.target.value)}
            placeholder="Share your class motto, inspiration, or guiding principle..."
            className={`w-full p-3 border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.messageToStudents ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.messageToStudents && <p className="text-sm text-red-500">{errors.messageToStudents}</p>}
        </div>

        {(formData.academicYearLevel || formData.academicSection) && (
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
          </>
        )}
      </CardContent>
    </Card>
  )
}
