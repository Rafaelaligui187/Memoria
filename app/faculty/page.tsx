"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Calendar, ChevronDown, Search, Filter, Star, Award, GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { isAuthenticated } from "@/lib/auth"

const HIERARCHY_ORDER = {
  directress: 1,
  superior: 2,
  department_head: 3,
  office_head: 4,
  faculty: 5,
  staff: 6,
}

export default function FacultyPage() {
  console.log('🎯 Faculty Page Loaded - Hierarchical Structure Active')
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "department" | "hierarchy">("hierarchy")
  const [searchQuery, setSearchQuery] = useState("")
  const [schoolYears, setSchoolYears] = useState<Array<{_id: string, yearLabel: string, isActive: boolean}>>([])
  const [loadingSchoolYears, setLoadingSchoolYears] = useState(true)
  const [facultyData, setFacultyData] = useState<any[]>([])
  const [loadingFaculty, setLoadingFaculty] = useState(true)
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)

  // Fixed department options for role-based filtering
  const departmentFilterOptions = [
    "All",
    "AR Sisters",
    "Faculty", 
    "Staff",
    "Utility"
  ]

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    fetchSchoolYears()
    fetchFacultyData()
    fetchAvailableDepartments()

    // Listen for school year updates from admin interface
    const handleSchoolYearsUpdate = () => {
      console.log('School years updated event received')
      fetchSchoolYears()
    }

    // Listen for faculty profile updates from admin interface
    const handleFacultyUpdate = () => {
      console.log('Faculty profiles updated event received')
      fetchFacultyData()
      fetchAvailableDepartments()
    }

    window.addEventListener('schoolYearsUpdated', handleSchoolYearsUpdate)
    window.addEventListener('facultyProfilesUpdated', handleFacultyUpdate)

    return () => {
      window.removeEventListener('schoolYearsUpdated', handleSchoolYearsUpdate)
      window.removeEventListener('facultyProfilesUpdated', handleFacultyUpdate)
    }
  }, [])

  // Refetch faculty data when school year or department changes
  useEffect(() => {
    if (selectedSchoolYear) {
      fetchFacultyData()
      fetchAvailableDepartments()
    }
  }, [selectedSchoolYear, selectedDepartment])

  const fetchFacultyData = async () => {
    try {
      setLoadingFaculty(true)
      const params = new URLSearchParams()
      
      if (selectedSchoolYear) {
        params.append('schoolYearId', selectedSchoolYear)
      }
      
      if (selectedDepartment && selectedDepartment !== "All") {
        params.append('department', selectedDepartment)
      }

      const response = await fetch(`/api/faculty?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      const result = await response.json()

      if (result.success && result.data) {
        setFacultyData(result.data)
        console.log('[Faculty Page] Loaded faculty data:', result.data.length, 'profiles')
        console.log('[Faculty Page] Faculty years of service:', result.data.map(f => ({ name: f.name, yearsOfService: f.yearsOfService })))
      } else {
        console.error('[Faculty Page] Failed to fetch faculty data:', result.error)
        // Fallback to empty array if API fails
        setFacultyData([])
      }
    } catch (error) {
      console.error('[Faculty Page] Error fetching faculty data:', error)
      // Fallback to empty array if API fails
      setFacultyData([])
    } finally {
      setLoadingFaculty(false)
    }
  }

  const fetchAvailableDepartments = async () => {
    try {
      setLoadingDepartments(true)
      const params = new URLSearchParams()
      
      if (selectedSchoolYear) {
        params.append('schoolYearId', selectedSchoolYear)
      }

      const response = await fetch(`/api/faculty/departments?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      const result = await response.json()

      if (result.success && result.data) {
        setAvailableDepartments(result.data)
        console.log('[Faculty Page] Loaded available departments:', result.data)
      } else {
        console.error('[Faculty Page] Failed to fetch departments:', result.error)
        // Fallback to empty array if API fails
        setAvailableDepartments([])
      }
    } catch (error) {
      console.error('[Faculty Page] Error fetching departments:', error)
      // Fallback to empty array if API fails
      setAvailableDepartments([])
    } finally {
      setLoadingDepartments(false)
    }
  }

  const fetchSchoolYears = async () => {
    try {
      setLoadingSchoolYears(true)
      const response = await fetch('/api/school-years', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const result = await response.json()

      if (result.success && result.data) {
        setSchoolYears(result.data)

        // Set the active school year as default, or first available if none is active
        const activeYear = result.data.find((year: any) => year.isActive)
        if (activeYear) {
          setSelectedSchoolYear(activeYear._id)
        } else if (result.data.length > 0) {
          setSelectedSchoolYear(result.data[0]._id)
        }
      } else {
        console.error('[Faculty Page] Failed to fetch school years:', result.error)
        // Set empty array if API fails - let admin create school years
        setSchoolYears([])
      }
    } catch (error) {
      console.error('[Faculty Page] Error fetching school years:', error)
      // Set empty array if API fails - let admin create school years
      setSchoolYears([])
    } finally {
      setLoadingSchoolYears(false)
    }
  }

  const filteredFaculty = facultyData.filter((faculty) => {
    let matchesDepartment = false
    
    if (selectedDepartment === "All") {
      matchesDepartment = true
    } else if (selectedDepartment === "Faculty") {
      // For Faculty filter, look for teaching positions and exclude staff/utility
      const isTeachingPosition = faculty.position && (
        faculty.position.toLowerCase().includes('teacher') ||
        faculty.position.toLowerCase().includes('instructor') ||
        faculty.position.toLowerCase().includes('professor') ||
        faculty.position.toLowerCase().includes('subject teacher') ||
        faculty.position.toLowerCase().includes('department head')
      )
      
      const isAcademicDepartment = faculty.department && (
        faculty.department.toLowerCase().includes('department') ||
        faculty.department.toLowerCase().includes('college') ||
        faculty.department.toLowerCase().includes('senior high') ||
        faculty.department.toLowerCase().includes('junior high') ||
        faculty.department.toLowerCase().includes('elementary')
      )
      
      const isNotStaffOrUtility = !(
        (faculty.position && (
          faculty.position.toLowerCase().includes('staff') ||
          faculty.position.toLowerCase().includes('librarian') ||
          faculty.position.toLowerCase().includes('utility') ||
          faculty.position.toLowerCase().includes('maintenance') ||
          faculty.position.toLowerCase().includes('electrician')
        )) ||
        (faculty.department && (
          faculty.department.toLowerCase().includes('staff') ||
          faculty.department.toLowerCase().includes('utility')
        ))
      )
      
      matchesDepartment = (isTeachingPosition || isAcademicDepartment) && isNotStaffOrUtility
    } else if (selectedDepartment === "Master Teacher") {
      matchesDepartment = Number(faculty.yearsOfService) >= 15
    } else {
      matchesDepartment = faculty.department === selectedDepartment ||
                         faculty.departmentAssigned === selectedDepartment
    }

    // Debug logging for Faculty filtering
    if (selectedDepartment === "Faculty") {
      console.log('🔍 Faculty Filter Debug:', {
        facultyName: faculty.name,
        position: faculty.position,
        department: faculty.department,
        matchesDepartment,
        selectedDepartment
      })
    }

    // Debug logging for Master Teacher filtering
    if (selectedDepartment === "Master Teacher") {
      console.log('🔍 Master Teacher Filter Debug:', {
        facultyName: faculty.name,
        yearsOfService: faculty.yearsOfService,
        yearsOfServiceType: typeof faculty.yearsOfService,
        yearsOfServiceNumber: Number(faculty.yearsOfService),
        meetsCriteria: Number(faculty.yearsOfService) >= 15,
        selectedDepartment
      })
    }

    // Get the selected school year label for comparison
    const selectedYearLabel = schoolYears.find(year => year._id === selectedSchoolYear)?.yearLabel
    const matchesSchoolYear = !selectedSchoolYear || faculty.schoolYear === selectedYearLabel || faculty.schoolYearId === selectedSchoolYear

    const matchesSearch =
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faculty.department && faculty.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faculty.departmentAssigned && faculty.departmentAssigned.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesDepartment && matchesSchoolYear && matchesSearch
  })

  // Group faculty by hierarchy for the family tree layout
  const arSisters = filteredFaculty.filter(faculty => faculty.isARSister)
  const departmentHeads = filteredFaculty.filter(faculty => 
    faculty.hierarchy === "department_head" && !faculty.isARSister
  )
  const regularFaculty = filteredFaculty.filter(faculty => 
    faculty.hierarchy === "faculty" && !faculty.isARSister
  )
  const allTeachersAndSisters = [...filteredFaculty]

  // Group faculty by departments for department sections
  const facultyByDepartment = filteredFaculty.reduce((acc, faculty) => {
    const department = faculty.department || faculty.departmentAssigned || 'Unassigned'
    if (!acc[department]) {
      acc[department] = []
    }
    acc[department].push(faculty)
    return acc
  }, {} as Record<string, any[]>)

  // Get unique departments (excluding AR Sisters from department grouping)
  const departments = Object.keys(facultyByDepartment).filter(dept => 
    dept !== 'Unassigned' && facultyByDepartment[dept].some(f => !f.isARSister)
  )

  // Debug logging
  console.log('🏢 Departments found:', departments)
  console.log('👥 Faculty by department:', facultyByDepartment)
  console.log('👑 AR Sisters:', arSisters.length, arSisters)
  console.log('🎓 Department Heads:', departmentHeads.length, departmentHeads)
  console.log('👨‍🏫 Regular Faculty:', regularFaculty.length)
  console.log('📊 All Faculty Data:', facultyData)
  console.log('🔍 Filtered Faculty for selected department:', selectedDepartment, filteredFaculty.length, filteredFaculty)

  const sortedFaculty = [...filteredFaculty].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "department":
        return a.department.localeCompare(b.department)
      case "hierarchy":
        return HIERARCHY_ORDER[a.hierarchy as keyof typeof HIERARCHY_ORDER] - HIERARCHY_ORDER[b.hierarchy as keyof typeof HIERARCHY_ORDER]
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Header />

      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-900/80 to-purple-900/90" />

        <div className="container relative py-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wide">Excellence in Education</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
              Faculty & Staff
              <span className="block text-lg text-yellow-300 mt-2">✨ Hierarchical Structure Active</span>
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-12 leading-relaxed">
              Meet the dedicated educators and professionals who inspire excellence and shape the future at Consolatrix College
            </p>

            <div className="inline-flex items-center gap-6 bg-white/20 backdrop-blur-lg p-8 rounded-3xl border-2 border-white/30 shadow-2xl shadow-blue-900/20">
              <Calendar className="h-8 w-8 text-white" />
              <div className="text-left">
                <p className="text-sm text-blue-200 mb-1">Academic Year</p>
                <Select value={selectedSchoolYear} onValueChange={setSelectedSchoolYear} disabled={loadingSchoolYears}>
                  <SelectTrigger className="w-56 h-14 bg-white/25 border-2 border-white/50 text-white hover:bg-white/35 transition-all duration-300 text-xl font-bold shadow-lg backdrop-blur-sm">
                    <SelectValue placeholder={loadingSchoolYears ? "Loading..." : "Select Academic Year"} />
                    <ChevronDown className="h-6 w-6 text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-blue-200 shadow-xl">
                    {schoolYears.map((year) => (
                      <SelectItem key={year._id} value={year._id} className="text-lg font-medium">
                        {year.yearLabel} {year.isActive && "(Active)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="container">
          {/* Loading indicator */}
          {loadingFaculty && (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading faculty profiles...</p>
              </div>
            </div>
          )}

          {/* Faculty content */}
          {!loadingFaculty && (
            <>
              {selectedDepartment === "All" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center mb-16"
                >
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
                    <Award className="h-4 w-4" />
                    <span className="text-sm font-semibold">Our Team</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Leadership</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-6"></div>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Discover our organizational structure and the dedicated Leaders who guide each department
                  </p>
                </motion.div>
              )}

              {/* Always show the main layout structure */}
              <div className="space-y-20">
                {/* School Leadership Section - AR Sisters */}
                {arSisters.length > 0 && selectedDepartment === "All" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full mb-6">
                        <Star className="h-4 w-4" />
                        <span className="text-sm font-semibold">AR Sisters</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">School Leadership</h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mx-auto mb-8"></div>
                      
                      {/* Primary AR Sister (Directress/Superior) - Large card at top */}
                      {arSisters.filter(sister => sister.hierarchy === "directress" || sister.hierarchy === "superior").length > 0 && (
                        <div className="flex justify-center items-center mb-0">
                          <div className="w-full max-w-sm mx-auto">
                            {arSisters.filter(sister => sister.hierarchy === "directress" || sister.hierarchy === "superior").map((sister, index) => (
                              <motion.div
                                key={sister.id}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex justify-center"
                              >
                                <Link href={sister.isARSister ? `/ar-sisters/${sister.id}` : `/faculty/${sister.id}`}>
                                  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-700 bg-white border-2 border-red-200 hover:border-red-400 transform hover:-translate-y-2 w-full max-w-md shadow-lg">
                                    <div className="relative overflow-hidden">
                                      <div className="aspect-square overflow-hidden">
                                        <Image
                                          src={sister.image || "/placeholder.svg"}
                                          alt={sister.name}
                                          width={400}
                                          height={400}
                                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                      </div>
                                      <div className="absolute top-4 right-4">
                                        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-4 py-2 text-sm font-bold shadow-lg">
                                          {sister.position}
                                        </Badge>
                                      </div>
                                    </div>
                                    <CardContent className="p-8 text-center">
                                      <h3 className="font-bold text-2xl text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                                        {sister.name}
                                      </h3>
                                      <p className="text-red-600 font-semibold text-base mb-3">{sister.position}</p>
                                      <div className="flex items-center justify-center gap-2 text-gray-500 text-base">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        <span>{sister.yearsOfService} years of excellence</span>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Vertical line extending from bottom edge of AR Sisters leadership card */}
                      {arSisters.filter(sister => sister.hierarchy !== "directress" && sister.hierarchy !== "superior").length > 0 && (
                        <div className="flex justify-center mt-3 mb-0">
                          <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-400 rounded-full animate-pulse"></div>
                        </div>
                      )}

                      {/* Continuous vertical line with horizontal intersection */}
                      {arSisters.filter(sister => sister.hierarchy !== "directress" && sister.hierarchy !== "superior").length > 0 && (
                        <div className="relative flex justify-center items-center mb-8">
                          {/* Continuous horizontal line */}
                          <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full z-10 animate-pulse"></div>
                          {/* Vertical line extending through horizontal */}
                          <div className="absolute w-1 h-24 bg-gradient-to-b from-purple-500 to-purple-400 rounded-full z-0 animate-pulse"></div>
                        </div>
                      )}

                      {/* Secondary AR Sisters - Horizontal row */}
                      {arSisters.filter(sister => sister.hierarchy !== "directress" && sister.hierarchy !== "superior").length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {arSisters.filter(sister => sister.hierarchy !== "directress" && sister.hierarchy !== "superior").map((sister, index) => (
                            <motion.div
                              key={sister.id}
                              initial={{ opacity: 0, y: 30, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                              <Link href={sister.isARSister ? `/ar-sisters/${sister.id}` : `/faculty/${sister.id}`}>
                                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-700 h-full bg-white border-2 border-gray-100 hover:border-purple-300 transform hover:-translate-y-2">
                                  <div className="relative overflow-hidden">
                                    <div className="aspect-square overflow-hidden">
                                      <Image
                                        src={sister.image || "/placeholder.svg"}
                                        alt={sister.name}
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                      />
                                    </div>
                                    <div className="absolute top-3 right-3">
                                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 px-3 py-1 text-xs font-bold shadow-lg">
                                        {sister.position}
                                      </Badge>
                                    </div>
                                  </div>
                                  <CardContent className="p-4 text-center">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                                      {sister.name}
                                    </h3>
                                    <p className="text-purple-600 font-semibold text-sm mb-2 line-clamp-1">{sister.position}</p>
                                    <div className="flex items-center justify-center gap-1 text-gray-500 text-sm">
                                      <Star className="h-3 w-3 text-yellow-500" />
                                      <span>{sister.yearsOfService} years</span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Visual Separator */}
                  {arSisters.length > 0 && departments.length > 0 && selectedDepartment === "All" && (
                    <div className="flex justify-center my-16">
                      <div className="w-32 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-full"></div>
                    </div>
                  )}

                  {/* Department Sections - Only show when "All" is selected */}
                  {departments.length > 0 && selectedDepartment === "All" ? (
                    departments.map((department, deptIndex) => {
                      const deptFaculty = facultyByDepartment[department].filter(f => !f.isARSister)
                      const deptHead = deptFaculty.find(f => f.hierarchy === "department_head")
                      const deptTeachers = deptFaculty.filter(f => f.hierarchy === "faculty")
                      
                      console.log(`📚 Department: ${department}`, {
                        totalFaculty: deptFaculty.length,
                        departmentHead: deptHead?.name || 'None',
                        teachers: deptTeachers.length
                      })
                      
                      if (deptFaculty.length === 0) return null

                      return (
                        <motion.div
                          key={department}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 + deptIndex * 0.1 }}
                          className="text-center mb-16"
                        >
                          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
                            <GraduationCap className="h-4 w-4" />
                            <span className="text-sm font-semibold">{department}</span>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{department}</h2>
                          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-8"></div>
                        
                          {/* Department Head - Large card at center-top */}
                          {deptHead && (
                            <div className="flex justify-center items-center mb-0">
                              <div className="w-full max-w-sm mx-auto">
                                <motion.div
                                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{ duration: 0.5, delay: deptIndex * 0.1 }}
                                  className="flex justify-center"
                                >
                                  <Link href={`/faculty/${deptHead.id}`}>
                                    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-700 bg-white border-2 border-red-200 hover:border-red-400 transform hover:-translate-y-2 w-full max-w-md shadow-lg">
                                      <div className="relative overflow-hidden">
                                        <div className="aspect-square overflow-hidden">
                                          <Image
                                            src={deptHead.image || "/placeholder.svg"}
                                            alt={deptHead.name}
                                            width={400}
                                            height={400}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                          />
                                        </div>
                                        <div className="absolute top-4 right-4">
                                          <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-4 py-2 text-sm font-bold shadow-lg">
                                            {deptHead.position}
                                          </Badge>
                                        </div>
                                      </div>
                                      <CardContent className="p-8 text-center">
                                        <h3 className="font-bold text-2xl text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                                          {deptHead.name}
                                        </h3>
                                        <p className="text-red-600 font-semibold text-base mb-3">{deptHead.position}</p>
                                        <div className="flex items-center justify-center gap-2 text-gray-500 text-base">
                                          <Star className="h-4 w-4 text-yellow-500" />
                                          <span>{deptHead.yearsOfService} years of excellence</span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </Link>
                                </motion.div>
                              </div>
                            </div>
                          )}

                          {/* Vertical line extending from bottom edge of department head card */}
                          {deptTeachers.length > 0 && (
                            <div className="flex justify-center mt-3 mb-0">
                              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-400 rounded-full animate-pulse"></div>
                            </div>
                          )}

                          {/* Continuous vertical line with horizontal intersection */}
                          {deptTeachers.length > 0 && (
                            <div className="relative flex justify-center items-center mb-8">
                              {/* Continuous horizontal line */}
                              <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full z-10 animate-pulse"></div>
                              {/* Vertical line extending through horizontal */}
                              <div className="absolute w-1 h-24 bg-gradient-to-b from-purple-500 to-purple-400 rounded-full z-0 animate-pulse"></div>
                            </div>
                          )}

                          {/* Department Teachers - Grid layout */}
                          {deptTeachers.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {deptTeachers.map((teacher, index) => (
                                <motion.div
                                  key={teacher.id}
                                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{ duration: 0.5, delay: deptIndex * 0.1 + index * 0.05 }}
                                >
                                  <Link href={`/faculty/${teacher.id}`}>
                                    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-700 h-full bg-white border-2 border-gray-100 hover:border-blue-300 transform hover:-translate-y-2">
                                      <div className="relative overflow-hidden">
                                        <div className="aspect-square overflow-hidden">
                                          <Image
                                            src={teacher.image || "/placeholder.svg"}
                                            alt={teacher.name}
                                            width={200}
                                            height={200}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                          />
                                        </div>
                                        <div className="absolute top-3 right-3">
                                          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-3 py-1 text-xs font-bold shadow-lg">
                                            {teacher.position}
                                          </Badge>
                                        </div>
                                      </div>
                                      <CardContent className="p-4 text-center">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                          {teacher.name}
                                        </h3>
                                        <p className="text-blue-600 font-semibold text-sm mb-2 line-clamp-1">{teacher.position}</p>
                                        <div className="flex items-center justify-center gap-1 text-gray-500 text-sm">
                                          <Star className="h-3 w-3 text-yellow-500" />
                                          <span>{teacher.yearsOfService} years</span>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </Link>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )
                    })
                  ) : (
                    selectedDepartment === "All" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center py-16"
                      >
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                          <GraduationCap className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Departments Found</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                          No department sections are available. Faculty members may not be assigned to specific departments yet.
                        </p>
                      </motion.div>
                    )
                  )}

                  {/* Visual Separator */}
                  {(departments.length > 0 || arSisters.length > 0) && allTeachersAndSisters.length > 0 && selectedDepartment === "All" && (
                    <div className="flex justify-center my-16">
                      <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-emerald-500 rounded-full"></div>
                    </div>
                  )}

                {/* All Teachers & Sisters Section - Always show */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center"
                >
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-semibold">
                          {selectedDepartment === "All" ? "Complete Directory" : selectedDepartment}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {selectedDepartment === "All" ? "All Team Members" : 
                         selectedDepartment === "Master Teacher" ? "Master Teachers (15+ Years)" : 
                         `${selectedDepartment} Faculty`}
                      </h2>
                      <p className="text-gray-600 mb-8">{allTeachersAndSisters.length} dedicated professionals for {schoolYears.find(year => year._id === selectedSchoolYear)?.yearLabel || 'current year'}</p>
                      <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mx-auto mb-8"></div>
                      
                      {/* Filters */}
                      <div className="flex flex-wrap gap-4 mb-8 justify-center">
                        <div className="flex items-center gap-2">
                          <Filter className="h-5 w-5 text-gray-600" />
                          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-48 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {departmentFilterOptions.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Search className="h-5 w-5 text-gray-600" />
                          <Input
                            placeholder="Search faculty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm"
                          />
                        </div>

                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment} disabled={loadingDepartments}>
                          <SelectTrigger className="w-full lg:w-48 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm">
                            <SelectValue placeholder={loadingDepartments ? "Loading..." : "Filter by Department"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="All">All Departments</SelectItem>
                            {availableDepartments.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allTeachersAndSisters.length > 0 ? (
                          allTeachersAndSisters.map((faculty, index) => (
                            <motion.div
                              key={faculty.id}
                              initial={{ opacity: 0, y: 30, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                              <Link href={`/faculty/${faculty.id}`}>
                                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-700 h-full bg-white border-2 border-gray-100 hover:border-green-300 transform hover:-translate-y-2">
                                  <div className="relative overflow-hidden">
                                    <div className="aspect-square overflow-hidden">
                                      <Image
                                        src={faculty.image || "/placeholder.svg"}
                                        alt={faculty.name}
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                      />
                                    </div>
                                    <div className="absolute top-3 right-3">
                                      <Badge className={`${
                                        faculty.isARSister 
                                          ? "bg-gradient-to-r from-purple-500 to-indigo-500" 
                                          : selectedDepartment === "Master Teacher" && Number(faculty.yearsOfService) >= 15
                                          ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                          : "bg-gradient-to-r from-green-500 to-emerald-500"
                                      } text-white border-0 px-3 py-1 text-xs font-bold shadow-lg`}>
                                        {selectedDepartment === "Master Teacher" && Number(faculty.yearsOfService) >= 15 ? "Master Teacher" : faculty.position}
                                      </Badge>
                                    </div>
                                  </div>
                                  <CardContent className="p-4 text-center">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                                      {faculty.name}
                                    </h3>
                                    <p className="text-green-600 font-semibold text-sm mb-2 line-clamp-1">{faculty.position}</p>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                                      {faculty.department || faculty.departmentAssigned || 'Department Not Assigned'}
                                    </p>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                                        <Star className="h-3 w-3 text-yellow-500" />
                                        <span>{faculty.yearsOfService} years</span>
                                      </div>
                                      {faculty.featured && (
                                        <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">⭐ Featured</Badge>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-20">
                            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                              <Users className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No team members found</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                              We couldn't find any faculty or staff matching your current search and filter criteria.
                            </p>
                            <Button
                              onClick={() => {
                                setSelectedDepartment("All")
                                setSelectedSchoolYear("")
                                setSearchQuery("")
                              }}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Clear All Filters
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}