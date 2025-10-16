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
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "department" | "hierarchy">("hierarchy")
  const [searchQuery, setSearchQuery] = useState("")
  const [schoolYears, setSchoolYears] = useState<Array<{_id: string, yearLabel: string, isActive: boolean}>>([])
  const [loadingSchoolYears, setLoadingSchoolYears] = useState(true)
  const [facultyData, setFacultyData] = useState<any[]>([])
  const [loadingFaculty, setLoadingFaculty] = useState(true)

  // Fixed department options for role-based filtering
  const departments = [
    "All",
    "Faculty", 
    "Staff",
    "Utility"
  ]

  useEffect(() => {
    setAuthenticated(isAuthenticated())
    fetchSchoolYears()
    fetchFacultyData()

    // Listen for school year updates from admin interface
    const handleSchoolYearsUpdate = () => {
      console.log('School years updated event received')
      fetchSchoolYears()
    }

    // Listen for faculty profile updates from admin interface
    const handleFacultyUpdate = () => {
      console.log('Faculty profiles updated event received')
      fetchFacultyData()
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
    const matchesDepartment =
      selectedDepartment === "All" ||
      (selectedDepartment === "Faculty" && faculty.hierarchy === "faculty") ||
      (selectedDepartment === "Staff" && faculty.hierarchy === "staff") ||
      (selectedDepartment === "Utility" && faculty.hierarchy === "utility") ||
      faculty.department === selectedDepartment

    // Get the selected school year label for comparison
    const selectedYearLabel = schoolYears.find(year => year._id === selectedSchoolYear)?.yearLabel
    const matchesSchoolYear = !selectedSchoolYear || faculty.schoolYear === selectedYearLabel || faculty.schoolYearId === selectedSchoolYear

    const matchesSearch =
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDepartment && matchesSchoolYear && matchesSearch
  })

  // Group faculty by hierarchy for the new layout
  const arSisters = filteredFaculty.filter(faculty => faculty.isARSister)
  const departmentHeads = filteredFaculty.filter(faculty => 
    faculty.hierarchy === "department_head" && !faculty.isARSister
  )
  const regularFaculty = filteredFaculty.filter(faculty => 
    faculty.hierarchy === "faculty" && !faculty.isARSister
  )
  const allTeachersAndSisters = [...regularFaculty, ...arSisters.filter(sister => 
    sister.hierarchy !== "directress" && sister.hierarchy !== "superior" && sister.hierarchy !== "department_head"
  )]

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
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Faculty & Staff Directory</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-6"></div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Meet our dedicated educators and staff members
                </p>
              </motion.div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-8 justify-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-48 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
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

                <Select value={sortBy} onValueChange={(value: "name" | "department" | "hierarchy") => setSortBy(value)}>
                  <SelectTrigger className="w-full lg:w-48 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hierarchy">Sort by Hierarchy</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="department">Sort by Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {sortedFaculty.length > 0 ? (
                <div className="space-y-16">
                  {/* AR Sisters Section */}
                  {arSisters.length > 0 && (
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
                      
                      {/* Primary AR Sister (Directress/Superior) */}
                      {arSisters.filter(sister => sister.hierarchy === "directress" || sister.hierarchy === "superior").length > 0 && (
                        <div className="flex justify-center mb-12">
                          <div className="max-w-sm">
                            {arSisters.filter(sister => sister.hierarchy === "directress" || sister.hierarchy === "superior").map((sister, index) => (
                              <motion.div
                                key={sister.id}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                              >
                                <Link href={`/faculty/${sister.id}`}>
                                  <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-700 bg-white border-2 border-gray-100 hover:border-purple-300 transform hover:-translate-y-2">
                                    <div className="relative overflow-hidden">
                                      <div className="aspect-square overflow-hidden">
                                        <Image
                                          src={sister.image || "/placeholder.svg"}
                                          alt={sister.name}
                                          width={300}
                                          height={300}
                                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                      </div>
                                      <div className="absolute top-3 right-3">
                                        <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 px-3 py-1 text-xs font-bold shadow-lg">
                                          {sister.position}
                                        </Badge>
                                      </div>
                                    </div>
                                    <CardContent className="p-6 text-center">
                                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                        {sister.name}
                                      </h3>
                                      <p className="text-purple-600 font-semibold text-sm mb-2">{sister.position}</p>
                                      <div className="flex items-center justify-center gap-1 text-gray-500 text-sm">
                                        <Star className="h-3 w-3 text-yellow-500" />
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

                      {/* Secondary AR Sisters */}
                      {arSisters.filter(sister => sister.hierarchy !== "directress" && sister.hierarchy !== "superior").length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {arSisters.filter(sister => sister.hierarchy !== "directress" && sister.hierarchy !== "superior").map((sister, index) => (
                            <motion.div
                              key={sister.id}
                              initial={{ opacity: 0, y: 30, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                              <Link href={`/faculty/${sister.id}`}>
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

                  {/* Department Heads and Teachers Section */}
                  {(departmentHeads.length > 0 || regularFaculty.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full mb-6">
                        <Award className="h-4 w-4" />
                        <span className="text-sm font-semibold">Department Faculty</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Department Teachers & Heads</h2>
                      <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-8"></div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...departmentHeads, ...regularFaculty].map((faculty, index) => (
                          <motion.div
                            key={faculty.id}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                          >
                            <Link href={`/faculty/${faculty.id}`}>
                              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-700 h-full bg-white border-2 border-gray-100 hover:border-blue-300 transform hover:-translate-y-2">
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
                                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-3 py-1 text-xs font-bold shadow-lg">
                                      {faculty.position}
                                    </Badge>
                                  </div>
                                </div>
                                <CardContent className="p-4 text-center">
                                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {faculty.name}
                                  </h3>
                                  <p className="text-blue-600 font-semibold text-sm mb-2 line-clamp-1">{faculty.position}</p>
                                  <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                                    {faculty.department || faculty.departmentAssigned || 'Department Not Assigned'}
                                  </p>
                                  <div className="flex items-center justify-center gap-1 text-gray-500 text-sm">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    <span>{faculty.yearsOfService} years</span>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* All Teachers and Sisters Section */}
                  {allTeachersAndSisters.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-6">
                        <Users className="h-4 w-4" />
                        <span className="text-sm font-semibold">All Team Members</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">All Teachers & Sisters</h2>
                      <p className="text-gray-600 mb-8">{allTeachersAndSisters.length} dedicated professionals for {schoolYears.find(year => year._id === selectedSchoolYear)?.yearLabel || 'current year'}</p>
                      <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mx-auto mb-8"></div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {allTeachersAndSisters.map((faculty, index) => (
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
                                        : "bg-gradient-to-r from-green-500 to-emerald-500"
                                    } text-white border-0 px-3 py-1 text-xs font-bold shadow-lg`}>
                                      {faculty.position}
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
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
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
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}