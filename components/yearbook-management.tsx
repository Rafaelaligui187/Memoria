"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { ChevronRight, ChevronDown, Trash2, AlertCircle } from "lucide-react"

interface YearbookManagementProps {
  selectedYear: string
  selectedYearLabel?: string
}

interface Department {
  id: string
  name: string
  type: string
  courses: Course[]
  strands?: Strand[] // For Senior High
}

interface Course {
  id: string
  name: string
  yearLevels: YearLevel[]
}

interface Strand {
  id: string
  name: string
  fullName: string
  description?: string
  tagline?: string
  yearLevels: YearLevel[]
}

interface YearLevel {
  id: string
  level: string
  blocks: Block[]
}

interface Block {
  id: string
  name: string
  studentCount: number
  officerCount: number
  students: Student[]
  officers: Officer[]
}

interface Student {
  id: string
  name: string
  image?: string
  quote?: string
  honors?: string
  profileId?: string
  isOfficer?: boolean
  officerPosition?: string
}

interface Officer {
  id: string
  name: string
  position: string
  image?: string
  quote?: string
}

interface YearbookStructure {
  departments: Department[]
}

// Dynamic data will be fetched from API

export function YearbookManagement({ selectedYear, selectedYearLabel }: YearbookManagementProps) {
  const { toast } = useToast()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedDepartment, setSelectedDepartment] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedStrand, setSelectedStrand] = useState<string>("")
  const [selectedYearLevel, setSelectedYearLevel] = useState<string>("")
  const [selectedBlock, setSelectedBlock] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("structure")

  // Dialog states
  const [addDepartmentOpen, setAddDepartmentOpen] = useState(false)
  const [addCourseOpen, setAddCourseOpen] = useState(false)
  const [addStrandOpen, setAddStrandOpen] = useState(false)
  const [addYearLevelOpen, setAddYearLevelOpen] = useState(false)
  const [addBlockOpen, setAddBlockOpen] = useState(false)
  const [assignOfficerOpen, setAssignOfficerOpen] = useState(false)

  // Form states
  const [newDepartmentName, setNewDepartmentName] = useState("")
  const [newCourseName, setNewCourseName] = useState("")
  const [newStrandName, setNewStrandName] = useState("")
  const [newStrandFullName, setNewStrandFullName] = useState("")
  const [newStrandDescription, setNewStrandDescription] = useState("")
  const [newStrandTagline, setNewStrandTagline] = useState("")
  const [newYearLevelName, setNewYearLevelName] = useState("")
  const [newBlockName, setNewBlockName] = useState("")
  const [newSectionName, setNewSectionName] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [addSectionOpen, setAddSectionOpen] = useState(false)

  // Fetch yearbook structure from API
  useEffect(() => {
    const fetchYearbookStructure = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/admin/yearbook/structure?schoolYearId=${selectedYear}`)
        const result = await response.json()
        
        if (result.success && result.data) {
          setDepartments(result.data.departments)
        } else {
          setError(result.error || 'Failed to fetch yearbook structure')
        }
      } catch (err) {
        console.error('Error fetching yearbook structure:', err)
        setError('Failed to fetch yearbook structure')
      } finally {
        setLoading(false)
      }
    }

    if (selectedYear) {
      fetchYearbookStructure()
    }
  }, [selectedYear])

  const getCurrentDepartment = () => departments.find((d) => d.id === selectedDepartment)
  const getCurrentCourse = () => getCurrentDepartment()?.courses.find((c) => c.id === selectedCourse)
  const getCurrentYearLevel = () => getCurrentCourse()?.yearLevels.find((y) => y.id === selectedYearLevel)
  const getCurrentBlock = () => getCurrentYearLevel()?.blocks.find((b) => b.id === selectedBlock)

  const addDepartment = () => {
    if (!newDepartmentName.trim()) return

    const newDept: Department = {
      id: Date.now().toString(),
      name: newDepartmentName,
      courses: [],
    }

    setDepartments([...departments, newDept])
    setNewDepartmentName("")
    setAddDepartmentOpen(false)

    toast({
      title: "Department Added",
      description: `${newDepartmentName} has been added successfully.`,
    })
  }

  const addYearLevel = () => {
    if (!newYearLevelName.trim() || !selectedCourse) return

    const newYearLevel: YearLevel = {
      id: Date.now().toString(),
      level: newYearLevelName,
      blocks: [],
    }

    setDepartments(
      departments.map((dept) => ({
        ...dept,
        courses: dept.courses.map((course) =>
          course.id === selectedCourse ? { ...course, yearLevels: [...course.yearLevels, newYearLevel] } : course,
        ),
      })),
    )

    setNewYearLevelName("")
    setAddYearLevelOpen(false)

    toast({
      title: "Year Level Added",
      description: `${newYearLevelName} has been added successfully.`,
    })
  }

  const addBlock = () => {
    if (!newBlockName.trim() || !selectedYearLevel) return

    const newBlock: Block = {
      id: Date.now().toString(),
      name: newBlockName,
      students: [],
      officers: [],
    }

    setDepartments(
      departments.map((dept) => ({
        ...dept,
        courses: dept.courses.map((course) => ({
          ...course,
          yearLevels: course.yearLevels.map((yearLevel) =>
            yearLevel.id === selectedYearLevel ? { ...yearLevel, blocks: [...yearLevel.blocks, newBlock] } : yearLevel,
          ),
        })),
      })),
    )

    setNewBlockName("")
    setAddBlockOpen(false)

    toast({
      title: "Block Added",
      description: `${newBlockName} has been added successfully.`,
    })
  }

  const addStrand = async () => {
    if (!newStrandName.trim() || !newStrandTagline.trim()) return

    try {
      const response = await fetch('/api/admin/strands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newStrandName,
          fullName: newStrandName, // Use name as fullName for now
          description: newStrandDescription,
          tagline: newStrandTagline,
          department: 'senior-high',
          schoolYearId: selectedYear,
          schoolYear: selectedYearLabel || selectedYear,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Strand Added",
          description: `${newStrandName} has been added successfully with Grade 11 and Grade 12.`,
        })
        
        // Reset form
        setNewStrandName("")
        setNewStrandFullName("")
        setNewStrandDescription("")
        setNewStrandTagline("")
        setAddStrandOpen(false)
        
        // Refresh the yearbook structure
        const fetchYearbookStructure = async () => {
          try {
            const response = await fetch(`/api/admin/yearbook/structure?schoolYearId=${selectedYear}`)
            const result = await response.json()
            
            if (result.success && result.data) {
              setDepartments(result.data.departments)
            }
          } catch (error) {
            console.error('Error refreshing yearbook structure:', error)
          }
        }
        fetchYearbookStructure()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add strand",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding strand:', error)
      toast({
        title: "Error",
        description: "Failed to add strand",
        variant: "destructive",
      })
    }
  }

  const addSectionToStrand = async () => {
    if (!newSectionName.trim() || !selectedGrade || !selectedStrand) return

    try {
      const response = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department: 'senior-high',
          grade: selectedGrade,
          name: newSectionName,
          schoolYearId: selectedYear,
          schoolYear: selectedYearLabel || selectedYear,
          strandId: selectedStrand,
          strandName: selectedStrand, // Use the selected strand as the strand name
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Section Added",
          description: `${newSectionName} has been added to ${selectedYearLevel.level} successfully.`,
        })
        
        // Reset form
        setNewSectionName("")
        setAddSectionOpen(false)
        
        // Refresh the yearbook structure
        onSectionAdded()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add section",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding section:', error)
      toast({
        title: "Error",
        description: "Failed to add section",
        variant: "destructive",
      })
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Yearbook Management - {selectedYearLabel || selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading yearbook structure...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>
              Yearbook Management - {selectedYearLabel || selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Yearbook Management - {selectedYearLabel || selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="officers">Officers</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-4">
              {/* Dynamic Department Structure */}
              <div className="space-y-4">
                {departments.map((department) => (
                  <DepartmentCard 
                    key={department.id} 
                    department={department} 
                    onDepartmentSelect={setSelectedDepartment}
                    onCourseSelect={setSelectedCourse}
                    onStrandSelect={setSelectedStrand}
                    onYearLevelSelect={setSelectedYearLevel}
                    onBlockSelect={setSelectedBlock}
                    selectedDepartment={selectedDepartment}
                    selectedCourse={selectedCourse}
                    selectedStrand={selectedStrand}
                    selectedYearLevel={selectedYearLevel}
                    selectedBlock={selectedBlock}
                    // Pass section creation props
                    selectedYear={selectedYear}
                    selectedYearLabel={selectedYearLabel}
                    onSectionAdded={() => {
                      // Refresh the yearbook structure
                      const fetchYearbookStructure = async () => {
                        try {
                          const response = await fetch(`/api/admin/yearbook/structure?schoolYearId=${selectedYear}`)
                          const result = await response.json()
                          
                          if (result.success && result.data) {
                            setDepartments(result.data.departments)
                          }
                        } catch (error) {
                          console.error('Error refreshing yearbook structure:', error)
                        }
                      }
                      fetchYearbookStructure()
                    }}
                    // Pass strand creation props for Senior High
                    onStrandAdded={() => {
                      // Refresh the yearbook structure
                      const fetchYearbookStructure = async () => {
                        try {
                          const response = await fetch(`/api/admin/yearbook/structure?schoolYearId=${selectedYear}`)
                          const result = await response.json()
                          
                          if (result.success && result.data) {
                            setDepartments(result.data.departments)
                          }
                        } catch (error) {
                          console.error('Error refreshing yearbook structure:', error)
                        }
                      }
                      fetchYearbookStructure()
                    }}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <div className="text-center py-12">
                <p className="text-gray-600">Student management functionality coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="officers" className="space-y-4">
              <div className="text-center py-12">
                <p className="text-gray-600">Officer management functionality coming soon...</p>
              </div>
            </TabsContent>

            <TabsContent value="pages" className="space-y-4">
              <div className="text-center py-12">
                <p className="text-gray-600">Page management functionality coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Department Card Component
interface DepartmentCardProps {
  department: Department
  onDepartmentSelect: (id: string) => void
  onCourseSelect: (id: string) => void
  onStrandSelect: (id: string) => void
  onYearLevelSelect: (id: string) => void
  onBlockSelect: (id: string) => void
  selectedDepartment: string
  selectedCourse: string
  selectedStrand: string
  selectedYearLevel: string
  selectedBlock: string
  selectedYear: string
  selectedYearLabel?: string
  onSectionAdded: () => void
  onStrandAdded: () => void
}

function DepartmentCard({ 
  department, 
  onDepartmentSelect, 
  onCourseSelect, 
  onStrandSelect,
  onYearLevelSelect, 
  onBlockSelect,
  selectedDepartment,
  selectedCourse,
  selectedStrand,
  selectedYearLevel,
  selectedBlock,
  selectedYear,
  selectedYearLabel,
  onSectionAdded,
  onStrandAdded
}: DepartmentCardProps) {
  const [expandedCourses, setExpandedCourses] = useState<string[]>([])
  const [expandedMajors, setExpandedMajors] = useState<string[]>([])
  const [expandedYearLevels, setExpandedYearLevels] = useState<string[]>([])
  const [expandedBlocks, setExpandedBlocks] = useState<string[]>([])
  
  // Section creation state
  const [addSectionOpen, setAddSectionOpen] = useState(false)
  const [newSectionName, setNewSectionName] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [localSelectedSectionYearLevel, setLocalSelectedSectionYearLevel] = useState("")
  const [localSelectedStrand, setLocalSelectedStrand] = useState("")
  
  // Strand creation state
  const [addStrandOpen, setAddStrandOpen] = useState(false)
  const [newStrandName, setNewStrandName] = useState("")
  const [newStrandTagline, setNewStrandTagline] = useState("")
  const [newStrandDescription, setNewStrandDescription] = useState("")
  
  // Course creation state
  const [addCourseOpen, setAddCourseOpen] = useState(false)
  const [newCourseName, setNewCourseName] = useState("")
  const [newCourseMajor, setNewCourseMajor] = useState("")
  const [newCourseTagline, setNewCourseTagline] = useState("")
  const [newCourseDescription, setNewCourseDescription] = useState("")
  
  // Major management state
  const [addMajorOpen, setAddMajorOpen] = useState(false)
  const [selectedCourseForMajor, setSelectedCourseForMajor] = useState<any>(null)
  const [newMajorName, setNewMajorName] = useState("")
  
  // Block creation state
  const [addBlockOpen, setAddBlockOpen] = useState(false)
  const [newBlockName, setNewBlockName] = useState("")
  const [localSelectedYearLevel, setLocalSelectedYearLevel] = useState("")
  const [localSelectedCourse, setLocalSelectedCourse] = useState("")
  const [localSelectedMajor, setLocalSelectedMajor] = useState<any>(null)
  
  // Delete state
  const [deleteStrandId, setDeleteStrandId] = useState<string>("")
  const [deleteCourseId, setDeleteCourseId] = useState<string>("")
  const [deleteSectionId, setDeleteSectionId] = useState<string>("")
  
  const { toast } = useToast()

  // Hardcoded year levels for Elementary and Junior High
  const departmentYearLevels = {
    elementary: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    "junior-high": ["Grade 7", "Grade 8", "Grade 9", "Grade 10"]
  }

  const toggleCourse = (courseId: string) => {
    setExpandedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  const toggleMajor = (majorId: string) => {
    setExpandedMajors(prev => 
      prev.includes(majorId) 
        ? prev.filter(id => id !== majorId)
        : [...prev, majorId]
    )
  }

  const toggleYearLevel = (yearLevelId: string) => {
    setExpandedYearLevels(prev => 
      prev.includes(yearLevelId) 
        ? prev.filter(id => id !== yearLevelId)
        : [...prev, yearLevelId]
    )
  }

  const toggleBlock = (blockId: string) => {
    setExpandedBlocks(prev => 
      prev.includes(blockId) 
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId]
    )
  }

  const addSection = async () => {
    if (!newSectionName.trim() || !localSelectedSectionYearLevel) return

    if (!selectedYear) {
      toast({
        title: "Error",
        description: "Please select a school year first",
        variant: "destructive",
      })
      return
    }

    try {
      // Find the selected course and year level from the department data
      const selectedCourse = department.courses.find(c => c.id === localSelectedStrand)
      const selectedYearLevel = selectedCourse?.yearLevels.find(yl => yl.id === localSelectedSectionYearLevel)
      
      if (!selectedCourse || !selectedYearLevel) {
        toast({
          title: "Error",
          description: "Course or year level not found. Please try again.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department: department.type,
          grade: selectedYearLevel.level, // Use the selected year level
          name: newSectionName,
          schoolYearId: selectedYear,
          schoolYear: selectedYearLabel || selectedYear,
          ...(department.type === 'senior-high' && {
            strandId: selectedCourse.id,
            strandName: selectedCourse.name
          })
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Section Added",
          description: `${newSectionName} has been added to ${selectedYearLevel.level} successfully.`,
        })
        
        // Reset form
        setNewSectionName("")
        setAddSectionOpen(false)
        
        // Refresh the yearbook structure
        onSectionAdded()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add section",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding section:', error)
      toast({
        title: "Error",
        description: "Failed to add section",
        variant: "destructive",
      })
    }
  }

  const addBlock = async () => {
    if (!newBlockName.trim() || !localSelectedYearLevel) return

    try {
      // Validate required data
      if (!localSelectedYearLevel || !localSelectedCourse) {
        toast({
          title: "Error",
          description: "Unable to determine course or year level information.",
          variant: "destructive",
        })
        return
      }

      // Find the selected course and year level from the department data
      const selectedCourse = department.courses.find(c => c.id === localSelectedCourse)
      let selectedYearLevel = null
      
      // Check if this is a course with majors
      if (selectedCourse?.majorType === 'has-major' && localSelectedMajor) {
        // For courses with majors, find the year level within the major
        selectedYearLevel = localSelectedMajor.yearLevels.find((yl: any) => yl.id === localSelectedYearLevel)
      } else {
        // For courses without majors, find the year level directly under the course
        selectedYearLevel = selectedCourse?.yearLevels.find(yl => yl.id === localSelectedYearLevel)
      }
      
      if (!selectedCourse || !selectedYearLevel) {
        toast({
          title: "Error",
          description: "Course or year level not found. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Validate course data specifically
      const courseId = selectedCourse.id || selectedCourse._id
      const courseName = selectedCourse.name || selectedCourse.fullName
      
      if (!courseId || !courseName) {
        console.error('Missing course data:', { courseId, courseName, selectedCourse })
        toast({
          title: "Error",
          description: "Course information is incomplete. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Prepare the block data for the API
      const blockData = {
        department: 'college',
        grade: selectedYearLevel.level || selectedYearLevel.name || 'Unknown', // Use selected year level
        name: `Block ${newBlockName.toUpperCase()}`, // Format as "Block A", "Block B", etc.
        schoolYearId: selectedYear,
        schoolYear: selectedYearLabel || selectedYear,
        courseId: courseId, // Use validated courseId
        courseName: courseName, // Use validated courseName
        majorName: localSelectedMajor?.name || null, // Include major name if available
        isActive: true
      }

      console.log('Creating block with data:', blockData)
      console.log('Selected year level:', selectedYearLevel)
      console.log('Selected course:', selectedCourse)
      console.log('Validated Course ID:', courseId)
      console.log('Validated Course Name:', courseName)

      // Call the sections API to create the block
      const response = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blockData),
      })

      const result = await response.json()

      if (result.success) {
        // Clear form and close dialog
        setNewBlockName("")
        setAddBlockOpen(false)
        setLocalSelectedMajor(null)

        toast({
          title: "Block Added",
          description: `Block ${newBlockName.toUpperCase()} has been added successfully to ${selectedYearLevel.level || selectedYearLevel.name}.`,
        })

        // Trigger refresh of yearbook structure
        onStrandAdded()
      } else {
        console.error('API Error Response:', result)
        toast({
          title: "Error",
          description: result.error || "Failed to add block",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding block:', error)
      toast({
        title: "Error",
        description: "Failed to add block. Please try again.",
        variant: "destructive",
      })
    }
  }

  const addStrand = async () => {
    if (!newStrandName.trim() || !newStrandTagline.trim()) return

    if (!selectedYear) {
      toast({
        title: "Error",
        description: "Please select a school year first",
        variant: "destructive",
      })
      return
    }

    try {
      const requestBody = {
        name: newStrandName,
        fullName: newStrandName,
        description: newStrandDescription,
        tagline: newStrandTagline,
        department: 'senior-high',
        schoolYearId: selectedYear,
        schoolYear: selectedYearLabel || selectedYear,
      }

      const response = await fetch('/api/admin/strands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Strand Added",
          description: `${newStrandName} has been added successfully with Grade 11 and Grade 12.`,
        })
        
        // Reset form
        setNewStrandName("")
        setNewStrandTagline("")
        setNewStrandDescription("")
        setAddStrandOpen(false)
        
        // Refresh the yearbook structure
        onStrandAdded()
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('strandUpdated'))
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add strand",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding strand:', error)
      toast({
        title: "Error",
        description: "Failed to add strand",
        variant: "destructive",
      })
    }
  }

  const addCourse = async () => {
    if (!newCourseName.trim() || !newCourseTagline.trim()) return

    if (!selectedYear) {
      toast({
        title: "Error",
        description: "Please select a school year first",
        variant: "destructive",
      })
      return
    }

    try {
      console.log('Adding course:', { newCourseName, newCourseMajor, newCourseTagline, newCourseDescription, selectedYear })
      
      const requestBody = {
        name: newCourseName,
        fullName: newCourseName,
        majorType: newCourseMajor,
        description: newCourseDescription,
        tagline: newCourseTagline,
        department: 'college',
        schoolYearId: selectedYear,
        schoolYear: selectedYearLabel || selectedYear,
      }

      console.log('Request body:', requestBody)

      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()
      console.log('Add course response:', result)

      if (result.success) {
        toast({
          title: "Course Added",
          description: `${newCourseName} has been added successfully.`,
        })
        
        // Reset form
        setNewCourseName("")
        setNewCourseMajor("")
        setNewCourseTagline("")
        setNewCourseDescription("")
        setAddCourseOpen(false)
        
        // Refresh the yearbook structure
        onStrandAdded() // Reuse the same callback for now
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('courseUpdated'))
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add course",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding course:', error)
      toast({
        title: "Error",
        description: "Failed to add course",
        variant: "destructive",
      })
    }
  }

  const addMajor = async () => {
    if (!newMajorName.trim()) return

    if (!selectedCourseForMajor) {
      toast({
        title: "Error",
        description: "No course selected for adding major.",
        variant: "destructive",
      })
      return
    }

    try {
      const requestBody = {
        courseId: selectedCourseForMajor.id, // Use 'id' instead of '_id' since yearbook structure returns 'id'
        courseName: selectedCourseForMajor.name,
        majorName: newMajorName.trim(),
        schoolYearId: selectedYear,
        schoolYear: selectedYearLabel || selectedYear
      }

      const response = await fetch('/api/admin/course-majors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Major Added",
          description: `${newMajorName} has been added to ${selectedCourseForMajor.name}.`,
        })
        
        // Reset form
        setNewMajorName("")
        setSelectedCourseForMajor(null)
        setAddMajorOpen(false)
        
        // Refresh the yearbook structure
        onStrandAdded()
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('yearbookStructureUpdated'))
      } else {
        console.error('Failed to add major:', result.error)
        toast({
          title: "Error",
          description: result.error || "Failed to add major",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error adding major:', error)
      toast({
        title: "Error",
        description: "Failed to add major. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteCourse = async (courseId: string) => {
    try {
      console.log('Attempting to delete course with ID:', courseId)
      
      const response = await fetch(`/api/admin/courses?id=${courseId}`, {
        method: 'DELETE',
      })

      const result = await response.json()
      console.log('Delete course response:', result)

      if (result.success) {
        toast({
          title: "Course Deleted",
          description: "Course has been deleted successfully.",
        })
        
        // Refresh the yearbook structure
        onStrandAdded() // Reuse the same callback for now
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('courseUpdated'))
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete course",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting course:', error)
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      })
    }
  }

  const deleteStrand = async (strandId: string) => {
    try {
      const response = await fetch(`/api/admin/strands?id=${strandId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Strand Deleted",
          description: "Strand has been deleted successfully.",
        })
        
        // Refresh the yearbook structure
        onStrandAdded()
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('strandUpdated'))
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete strand",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting strand:', error)
      toast({
        title: "Error",
        description: "Failed to delete strand",
        variant: "destructive",
      })
    }
  }

  const deleteSection = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/admin/sections?id=${sectionId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Section Deleted",
          description: "Section has been deleted successfully.",
        })
        
        // Refresh the yearbook structure
        onSectionAdded()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete section",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting section:', error)
      toast({
        title: "Error",
        description: "Failed to delete section",
        variant: "destructive",
      })
    }
  }


  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle 
          className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
          onClick={() => onDepartmentSelect(department.id)}
        >
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">{department.name}</span>
            <Badge variant="secondary" className="ml-2">
              {department.courses.length} {department.courses.length === 1 ? 'course' : 'courses'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {/* Add Strand Button for Senior High */}
            {department.type === 'senior-high' && (
              <Dialog open={addStrandOpen} onOpenChange={setAddStrandOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Add Strand
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Strand</DialogTitle>
                    <DialogDescription>
                      Add a new academic strand for Senior High School.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="strandName">Strand Name</Label>
                      <Input
                        id="strandName"
                        value={newStrandName}
                        onChange={(e) => setNewStrandName(e.target.value)}
                        placeholder="e.g., STEM, ABM, HUMSS, TVL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="strandTagline">Quote/Tagline</Label>
                      <Input
                        id="strandTagline"
                        value={newStrandTagline}
                        onChange={(e) => setNewStrandTagline(e.target.value)}
                        placeholder="e.g., INNOVATION THROUGH SCIENCE"
                      />
                    </div>
                    <div>
                      <Label htmlFor="strandDescription">Description (Optional)</Label>
                      <Input
                        id="strandDescription"
                        value={newStrandDescription}
                        onChange={(e) => setNewStrandDescription(e.target.value)}
                        placeholder="Brief description of the strand"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddStrandOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addStrand} disabled={!newStrandName.trim() || !newStrandTagline.trim()}>
                      Add Strand
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Add Course Button for College */}
            {department.type === 'college' && (
              <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Course</DialogTitle>
                    <DialogDescription>
                      Add a new academic course for College Department.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="courseName">Course Name</Label>
                      <Input
                        id="courseName"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        placeholder="e.g., BSIT, BSCS, BEED, BSED"
                      />
                    </div>
                    <div>
                      <Label htmlFor="courseMajorType">Major Type</Label>
                      <Select
                        value={newCourseMajor}
                        onValueChange={(value) => setNewCourseMajor(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select major type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-major">No Major</SelectItem>
                          <SelectItem value="has-major">Has Major</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="courseTagline">Quote/Tagline</Label>
                      <Input
                        id="courseTagline"
                        value={newCourseTagline}
                        onChange={(e) => setNewCourseTagline(e.target.value)}
                        placeholder="e.g., INNOVATE, CREATE, LEAD"
                      />
                    </div>
                    <div>
                      <Label htmlFor="courseDescription">Description (Optional)</Label>
                      <Input
                        id="courseDescription"
                        value={newCourseDescription}
                        onChange={(e) => setNewCourseDescription(e.target.value)}
                        placeholder="Brief description of the course"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddCourseOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addCourse} disabled={!newCourseName.trim() || !newCourseTagline.trim()}>
                      Add Course
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Add Major Modal */}
            {department.type === 'college' && (
              <Dialog open={addMajorOpen} onOpenChange={setAddMajorOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Major</DialogTitle>
                    <DialogDescription>
                      Add a new major for {selectedCourseForMajor?.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="majorName">Major Name</Label>
                      <Input
                        id="majorName"
                        value={newMajorName}
                        onChange={(e) => setNewMajorName(e.target.value)}
                        placeholder="e.g., Software Development, Network Administration"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setAddMajorOpen(false)
                      setNewMajorName("")
                      setSelectedCourseForMajor(null)
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={addMajor} disabled={!newMajorName.trim()}>
                      Add Major
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <ChevronRight className="h-4 w-4" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {department.courses.map((course) => (
            <div key={course.id} className="ml-4">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => toggleCourse(course.id)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{course.name}</span>
                    {course.majors && course.majors.length > 0 && (
                      <div className="text-sm text-gray-600 mt-1">
                        {course.majors.map((major, index) => (
                          <span key={major.name || major}>
                            {major.name || major}
                            {index < course.majors.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {course.majorType === 'has-major' 
                      ? (course.majors?.length || 0) + ' ' + ((course.majors?.length || 0) === 1 ? 'major' : 'majors')
                      : course.yearLevels.length + ' ' + (course.yearLevels.length === 1 ? 'year level' : 'year levels')
                    }
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {/* Delete Strand Button for Senior High */}
                  {department.type === 'senior-high' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-6 w-6 p-0 bg-red-100 hover:bg-red-200 border-red-300 text-red-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Strand</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the "{course.name}" strand? This action cannot be undone and will also delete all associated sections.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteStrand(course.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Strand
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {/* Add Major Button for College courses with has-major */}
                  {department.type === 'college' && course.majorType === 'has-major' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-blue-100 hover:bg-blue-200 border-blue-300 text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCourseForMajor(course)
                        setAddMajorOpen(true)
                      }}
                    >
                      Add Major
                    </Button>
                  )}

                  {/* Delete Course Button for College */}
                  {department.type === 'college' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-6 w-6 p-0 bg-red-100 hover:bg-red-200 border-red-300 text-red-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Course</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the "{course.name}" course? This action cannot be undone and will also delete all associated year levels and blocks.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCourse(course.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Course
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {expandedCourses.includes(course.id) ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                  }
                </div>
              </div>
              
              {expandedCourses.includes(course.id) && (
                <div className="ml-6 space-y-2 mt-2">
                  {/* For courses with majorType "has-major" */}
                  {course.majorType === 'has-major' && (
                    <div className="space-y-2">
                      {/* Show message if no majors added yet */}
                      {(!course.majors || course.majors.length === 0) && (
                        <div className="ml-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <div className="flex items-center gap-2 text-yellow-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">No majors added yet</span>
                          </div>
                          <p className="text-sm text-yellow-700 mt-1">
                            Please add at least one major before year levels can be displayed.
                          </p>
                        </div>
                      )}
                      
                      {/* Show majors if they exist */}
                      {course.majors && course.majors.length > 0 && (
                        <div className="space-y-2">
                          {course.majors.map((major) => (
                            <div key={major.id} className="ml-4">
                              <div 
                                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                                onClick={() => toggleMajor(major.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{major.name}</span>
                                  <Badge variant="outline" className="ml-2">
                                    {major.yearLevels.length} {major.yearLevels.length === 1 ? 'year level' : 'year levels'}
                                  </Badge>
                                </div>
                                {expandedMajors.includes(major.id) ? 
                                  <ChevronDown className="h-4 w-4" /> : 
                                  <ChevronRight className="h-4 w-4" />
                                }
                              </div>
                              
                              {expandedMajors.includes(major.id) && (
                                <div className="ml-6 space-y-2 mt-2">
                                  {major.yearLevels.map((yearLevel) => (
                                    <div key={yearLevel.id} className="ml-4">
                                      <div 
                                        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                                        onClick={() => toggleYearLevel(yearLevel.id)}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">{yearLevel.level}</span>
                                          <Badge variant="outline" className="ml-2">
                                            {yearLevel.blocks.length} {yearLevel.blocks.length === 1 ? 'block' : 'blocks'}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {/* Add Block Button for Major Year Levels */}
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            className="h-6 w-6 p-0 bg-green-100 hover:bg-green-200 border-green-300 text-green-700"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setLocalSelectedYearLevel(yearLevel.id)
                                              setLocalSelectedCourse(course.id)
                                              setLocalSelectedMajor(major)
                                              setAddBlockOpen(true)
                                            }}
                                            title={`Add Block to ${yearLevel.level} - ${major.name}`}
                                          >
                                            +
                                          </Button>
                                          {expandedYearLevels.includes(yearLevel.id) ? 
                                            <ChevronDown className="h-4 w-4" /> : 
                                            <ChevronRight className="h-4 w-4" />
                                          }
                                        </div>
                                      </div>
                                      
                                      {expandedYearLevels.includes(yearLevel.id) && (
                                        <div className="ml-6 space-y-2 mt-2">
                                          {yearLevel.blocks.map((block) => (
                                            <div key={block.id} className="ml-4">
                                              <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                                                <div className="flex items-center gap-2">
                                                  <span className="font-medium">{block.name}</span>
                                                  <Badge variant="outline" className="ml-2">
                                                    {block.studentCount} {block.studentCount === 1 ? 'student' : 'students'}
                                                  </Badge>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Show year levels for courses without majorType or with majorType "no-major" */}
                  {(!course.majorType || course.majorType === 'no-major') && course.yearLevels.map((yearLevel) => (
                    <div key={yearLevel.id} className="ml-4">
                      <div 
                        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded"
                        onClick={() => toggleYearLevel(yearLevel.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{yearLevel.level}</span>
                          <Badge variant="outline" className="ml-2">
                            {yearLevel.blocks.length} {yearLevel.blocks.length === 1 ? 'block' : 'blocks'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Add Section Button for Elementary, Junior High, and Senior High year levels */}
                          {(department.type === 'elementary' || department.type === 'junior-high' || department.type === 'senior-high') && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-6 w-6 p-0 bg-green-100 hover:bg-green-200 border-green-300 text-green-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                setLocalSelectedSectionYearLevel(yearLevel.id)
                                setLocalSelectedStrand(course.id)
                                setSelectedGrade(yearLevel.level)
                                if (department.type === 'senior-high') {
                                  onStrandSelect(course.name) // Use course name as strand for Senior High
                                }
                                setAddSectionOpen(true)
                              }}
                            >
                              +
                            </Button>
                          )}

                          {/* Add Block Button for College year levels */}
                          {department.type === 'college' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="h-6 w-6 p-0 bg-green-100 hover:bg-green-200 border-green-300 text-green-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                setLocalSelectedYearLevel(yearLevel.id)
                                setLocalSelectedCourse(course.id)
                                setAddBlockOpen(true)
                              }}
                            >
                              +
                            </Button>
                          )}
                          {expandedYearLevels.includes(yearLevel.id) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </div>
                      </div>
                      
                      {expandedYearLevels.includes(yearLevel.id) && (
                        <div className="ml-6 space-y-2 mt-2">
                          {yearLevel.blocks.map((block) => (
                            <div key={block.id} className="ml-4">
                              <div 
                                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded border rounded-lg"
                                onClick={() => toggleBlock(block.id)}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{block.name}</span>
                                  <Badge variant="secondary" className="ml-2">
                                    {block.studentCount} students, {block.officerCount} officers
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  {/* Delete Section Button */}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="h-6 w-6 p-0 bg-red-100 hover:bg-red-200 border-red-300 text-red-700"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Section</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete the "{block.name}" section? This action cannot be undone and will also delete all associated student profiles.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => deleteSection(block.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete Section
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  {expandedBlocks.includes(block.id) ? 
                                    <ChevronDown className="h-4 w-4" /> : 
                                    <ChevronRight className="h-4 w-4" />
                                  }
                                </div>
                              </div>
                              
                              {expandedBlocks.includes(block.id) && (
                                <div className="ml-6 space-y-2 mt-2 p-3 bg-gray-50 rounded-lg">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-700 mb-2">Students ({block.studentCount})</h4>
                                      <div className="space-y-1">
                                        {block.students.map((student) => (
                                          <div key={student.id} className="flex items-center gap-2 text-sm">
                                            <span>{student.name}</span>
                                            {student.honors && (
                                              <Badge variant="outline" className="text-xs">
                                                {student.honors}
                                              </Badge>
                                            )}
                                          </div>
                                        ))}
                                        {block.students.length === 0 && (
                                          <p className="text-gray-500 text-sm">No students enrolled</p>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-sm text-gray-700 mb-2">Officers ({block.officerCount})</h4>
                                      <div className="space-y-1">
                                        {block.officers.map((officer) => (
                                          <div key={officer.id} className="flex items-center gap-2 text-sm">
                                            <span>{officer.name}</span>
                                            <Badge variant="outline" className="text-xs">
                                              {officer.position}
                                            </Badge>
                                          </div>
                                        ))}
                                        {block.officers.length === 0 && (
                                          <p className="text-gray-500 text-sm">No officers assigned</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      
      {/* Add Section Dialog - Outside the map loops to avoid year level conflicts */}
      {(department.type === 'elementary' || department.type === 'junior-high' || department.type === 'senior-high') && (
        <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Section</DialogTitle>
              <DialogDescription>
                Add a new section for {(() => {
                  // Find the selected year level from the course
                  const selectedCourse = department.courses.find(c => c.id === localSelectedStrand)
                  const selectedYearLevel = selectedCourse?.yearLevels.find(yl => yl.id === localSelectedSectionYearLevel)
                  return selectedYearLevel?.level || 'Unknown Year Level'
                })()} in {department.name} department.
                {department.type === 'senior-high' && ` (${(() => {
                  const selectedCourse = department.courses.find(c => c.id === localSelectedStrand)
                  return selectedCourse?.name || 'Unknown Strand'
                })()} strand)`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={(() => {
                    const selectedCourse = department.courses.find(c => c.id === localSelectedStrand)
                    const selectedYearLevel = selectedCourse?.yearLevels.find(yl => yl.id === localSelectedSectionYearLevel)
                    return selectedYearLevel?.level || 'Unknown Year Level'
                  })()}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              {department.type === 'senior-high' && (
                <div>
                  <Label htmlFor="strand">Strand</Label>
                  <Input
                    id="strand"
                    value={(() => {
                      const selectedCourse = department.courses.find(c => c.id === localSelectedStrand)
                      return selectedCourse?.name || 'Unknown Strand'
                    })()}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              )}
              <div>
                <Label htmlFor="sectionName">Section Name</Label>
                <Input
                  id="sectionName"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder={department.type === 'senior-high' ? "e.g., Section 1, Section 2" : "e.g., Section A, Section B"}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddSectionOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addSection} disabled={!newSectionName.trim()}>
                Add Section
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Block Dialog - Outside the map loops to avoid year level conflicts */}
      {department.type === 'college' && (
        <Dialog open={addBlockOpen} onOpenChange={setAddBlockOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Block</DialogTitle>
              <DialogDescription>
                Add a new block for {(() => {
                  // Find the selected year level from the course
                  const selectedCourse = department.courses.find(c => c.id === localSelectedCourse)
                  let selectedYearLevel = null
                  
                  // Check if this is a course with majors
                  if (selectedCourse?.majorType === 'has-major' && localSelectedMajor) {
                    // For courses with majors, find the year level within the major
                    selectedYearLevel = localSelectedMajor.yearLevels.find((yl: any) => yl.id === localSelectedYearLevel)
                  } else {
                    // For courses without majors, find the year level directly under the course
                    selectedYearLevel = selectedCourse?.yearLevels.find(yl => yl.id === localSelectedYearLevel)
                  }
                  
                  return selectedYearLevel?.level || 'Unknown Year Level'
                })()} in {(() => {
                  // Find the selected course
                  const selectedCourse = department.courses.find(c => c.id === localSelectedCourse)
                  const courseName = selectedCourse?.name || 'Unknown Course'
                  if (localSelectedMajor) {
                    return `${courseName} - ${localSelectedMajor.name}`
                  }
                  return courseName
                })()} course. Enter a single letter (e.g., A, B, C).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="yearLevel">Year Level</Label>
                <Input
                  id="yearLevel"
                  value={(() => {
                    const selectedCourse = department.courses.find(c => c.id === localSelectedCourse)
                    let selectedYearLevel = null
                    
                    // Check if this is a course with majors
                    if (selectedCourse?.majorType === 'has-major' && localSelectedMajor) {
                      // For courses with majors, find the year level within the major
                      selectedYearLevel = localSelectedMajor.yearLevels.find((yl: any) => yl.id === localSelectedYearLevel)
                    } else {
                      // For courses without majors, find the year level directly under the course
                      selectedYearLevel = selectedCourse?.yearLevels.find(yl => yl.id === localSelectedYearLevel)
                    }
                    
                    return selectedYearLevel?.level || 'Unknown Year Level'
                  })()}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  value={(() => {
                    const selectedCourse = department.courses.find(c => c.id === localSelectedCourse)
                    return selectedCourse?.name || 'Unknown Course'
                  })()}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="blockName">Block Letter</Label>
                <Input
                  id="blockName"
                  value={newBlockName}
                  onChange={(e) => setNewBlockName(e.target.value)}
                  placeholder="e.g., A, B, C (will become Block A, Block B, Block C)"
                  maxLength={1}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setAddBlockOpen(false)
                setLocalSelectedMajor(null)
              }}>
                Cancel
              </Button>
              <Button onClick={addBlock} disabled={!newBlockName.trim()}>
                Add Block
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
