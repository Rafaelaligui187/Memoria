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
    academicYearLevels: string | string[]
    academicCourseProgram: string
    academicSections: string | string[]
    messageToStudents?: string
  }
  onInputChange: (field: string, value: string | string[]) => void
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
  const [availableAcademicSections, setAvailableAcademicSections] = useState<{name: string, yearLevel: string}[]>([])

  // Helper functions to handle both string and array formats
  const parseArrayField = (value: string | string[]): string[] => {
    if (Array.isArray(value)) return value
    try {
      return JSON.parse(value || "[]")
    } catch {
      return []
    }
  }

  const formatArrayField = (value: string[]): string => {
    return JSON.stringify(value)
  }

  // Get current values as arrays using useMemo to prevent infinite loops
  const currentYearLevels = useMemo(() => parseArrayField(formData.academicYearLevels), [formData.academicYearLevels])
  const currentSections = useMemo(() => parseArrayField(formData.academicSections), [formData.academicSections])

  // Fetch dynamic form data
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`/api/admin/form-data?schoolYearId=${schoolYearId}`)
        const result = await response.json()
        
        if (result.success) {
          setDepartmentData(result.data.departments)
          console.log('Dynamic form data loaded for advisory form:', result.data.departments)
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

    fetchFormData()
  }, [schoolYearId])

  // Academic Information dynamic dropdown logic
  useEffect(() => {
    if (departmentData && formData.academicDepartment && departmentData[formData.academicDepartment]) {
      const deptData = departmentData[formData.academicDepartment]
      setAvailableAcademicYearLevels(deptData.yearLevels || [])
      setAvailableAcademicPrograms(deptData.programs || [])
      
      // Reset dependent fields when department changes
      onInputChange("academicYearLevels", formatArrayField([]))
      onInputChange("academicCourseProgram", "")
      onInputChange("academicSections", formatArrayField([]))
      setAvailableAcademicSections([]) // Clear sections initially
    }
  }, [formData.academicDepartment, departmentData, onInputChange])

  // Fetch filtered academic sections when course/program and year levels are selected
  useEffect(() => {
    const fetchFilteredAcademicSections = async () => {
      if (formData.academicDepartment && formData.academicCourseProgram && currentYearLevels.length > 0) {
        try {
          // Make multiple API calls for each selected year level
          const sectionPromises = currentYearLevels.map(async (yearLevel) => {
            const params = new URLSearchParams({
              schoolYearId: schoolYearId,
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
            const validSections = currentSections.filter((section: string) => 
              availableSectionKeys.includes(section)
            )
            if (validSections.length !== currentSections.length) {
              onInputChange("academicSections", formatArrayField(validSections))
            }
          }
        } catch (error) {
          console.error('Error fetching filtered academic sections:', error)
        }
      } else {
        // If not all required fields are selected, clear sections
        setAvailableAcademicSections([])
        if (currentSections.length > 0) {
          onInputChange("academicSections", formatArrayField([]))
        }
      }
    }

    fetchFilteredAcademicSections()
  }, [formData.academicDepartment, formData.academicCourseProgram, formData.academicYearLevels, schoolYearId, onInputChange])

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
                onInputChange("academicDepartment", value)
                // Reset dependent fields when department changes
                onInputChange("academicYearLevels", formatArrayField([]))
                onInputChange("academicCourseProgram", "")
                onInputChange("academicSections", formatArrayField([]))
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
                // Reset sections when course changes
                onInputChange("academicSections", formatArrayField([]))
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="academicYearLevels">Year Levels (Multiple Selection)</Label>
            <div className="space-y-2">
              {availableAcademicYearLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`year-${level}`}
                    checked={currentYearLevels.includes(level)}
                    onChange={(e) => {
                      const currentLevels = currentYearLevels
                      const newLevels = e.target.checked
                        ? [...currentLevels, level]
                        : currentLevels.filter((l: string) => l !== level)
                      onInputChange("academicYearLevels", formatArrayField(newLevels))
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor={`year-${level}`} className="text-sm font-normal">
                    {level}
                  </Label>
                </div>
              ))}
            </div>
            {errors.academicYearLevels && <p className="text-sm text-red-500">{errors.academicYearLevels}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicSections">Sections/Blocks (Multiple Selection)</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableAcademicSections.map((section) => (
                <div key={`${section.name}-${section.yearLevel}`} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`section-${section.name}-${section.yearLevel}`}
                    checked={currentSections.includes(`${section.name}-${section.yearLevel}`)}
                    onChange={(e) => {
                      const currentSectionsArray = currentSections
                      const sectionKey = `${section.name}-${section.yearLevel}`
                      const newSections = e.target.checked
                        ? [...currentSectionsArray, sectionKey]
                        : currentSectionsArray.filter((s: string) => s !== sectionKey)
                      onInputChange("academicSections", formatArrayField(newSections))
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
            {errors.academicSections && <p className="text-sm text-red-500">{errors.academicSections}</p>}
          </div>
        </div>

        {/* Message to Students */}
        <div className="space-y-2">
          <Label htmlFor="messageToStudents">Message to Students *</Label>
          <textarea
            id="messageToStudents"
            value={formData.messageToStudents || ""}
            onChange={(e) => onInputChange("messageToStudents", e.target.value)}
            placeholder="Share your message, advice, or encouragement to students..."
            className={`w-full p-3 border rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.messageToStudents ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.messageToStudents && <p className="text-sm text-red-500">{errors.messageToStudents}</p>}
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
  )
}
