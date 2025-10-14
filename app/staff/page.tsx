"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Users, Calendar, ChevronDown, Search, Filter, Star, Award, Briefcase } from "lucide-react"

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

export default function StaffPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "department" | "hierarchy">("hierarchy")
  const [searchQuery, setSearchQuery] = useState("")
  const [schoolYears, setSchoolYears] = useState<Array<{_id: string, yearLabel: string, isActive: boolean}>>([])
  const [loadingSchoolYears, setLoadingSchoolYears] = useState(true)
  const [staffData, setStaffData] = useState<any[]>([])
  const [loadingStaff, setLoadingStaff] = useState(true)

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
  }, [])

  useEffect(() => {
    if (selectedSchoolYear) {
      fetchStaffData()
    }
  }, [selectedSchoolYear, selectedDepartment])

  const fetchStaffData = async () => {
    try {
      setLoadingStaff(true)
      const params = new URLSearchParams()
      
      if (selectedSchoolYear) {
        params.append('schoolYearId', selectedSchoolYear)
      }
      
      // Filter for staff only
      params.append('department', 'Staff')

      const response = await fetch(`/api/faculty?${params.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      const result = await response.json()

      if (result.success && result.data) {
        // Filter for staff profiles only
        const staffProfiles = result.data.filter((profile: any) => 
          profile.hierarchy === 'staff' || profile.userType === 'staff'
        )
        setStaffData(staffProfiles)
        console.log('[Staff Page] Loaded staff data:', staffProfiles.length, 'profiles')
      } else {
        console.error('[Staff Page] Failed to fetch staff data:', result.error)
        setStaffData([])
      }
    } catch (error) {
      console.error('[Staff Page] Error fetching staff data:', error)
      setStaffData([])
    } finally {
      setLoadingStaff(false)
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
        console.error('[Staff Page] Failed to fetch school years:', result.error)
      }
    } catch (error) {
      console.error('[Staff Page] Error fetching school years:', error)
    } finally {
      setLoadingSchoolYears(false)
    }
  }

  // Filter and sort staff data
  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch = staff.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (staff.departmentAssigned || staff.department || "").toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDepartment = selectedDepartment === "All" || 
                            staff.departmentAssigned === selectedDepartment ||
                            staff.department === selectedDepartment ||
                            (selectedDepartment === "Staff" && (staff.hierarchy === "staff" || staff.userType === "staff"))
    
    return matchesSearch && matchesDepartment
  })

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.fullName.localeCompare(b.fullName)
      case "department":
        return (a.departmentAssigned || a.department || "").localeCompare(b.departmentAssigned || b.department || "")
      case "hierarchy":
        return (HIERARCHY_ORDER[a.hierarchy as keyof typeof HIERARCHY_ORDER] || 999) - 
               (HIERARCHY_ORDER[b.hierarchy as keyof typeof HIERARCHY_ORDER] || 999)
      default:
        return 0
    }
  })

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">Please log in to view the staff directory.</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/10 rounded-full blur-md"></div>

        <div className="container relative py-24 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm font-semibold">Staff Directory</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Our Dedicated Staff
            </h1>
            <div className="w-24 h-1 bg-white rounded-full mx-auto mb-6"></div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Meet the hardworking staff members who keep our institution running smoothly
            </p>
          </motion.div>
        </div>
      </div>

      <div className="bg-white py-20">
        <div className="container">
          {/* Loading indicator */}
          {loadingStaff && (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Loading staff profiles...</p>
              </div>
            </div>
          )}

          {/* Staff content */}
          {!loadingStaff && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full mb-6">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-semibold">Our Team</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Staff Directory</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mx-auto mb-6"></div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Meet our dedicated staff members who support our educational mission
                </p>
              </motion.div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-8 justify-center">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-gray-500" />
                  <Input
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl shadow-sm"
                  />
                </div>

                <Select value={sortBy} onValueChange={(value: "name" | "department" | "hierarchy") => setSortBy(value)}>
                  <SelectTrigger className="w-full lg:w-48 h-12 border-2 border-gray-200 focus:border-indigo-500 rounded-xl shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hierarchy">Sort by Hierarchy</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="department">Sort by Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {sortedStaff.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {sortedStaff.map((staff, index) => (
                    <motion.div
                      key={staff.id}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Link href={`/staff/${staff.id}`}>
                        <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-700 h-full bg-white border-2 border-gray-100 hover:border-indigo-300 transform hover:-translate-y-3 hover:rotate-1">
                          <div className="relative overflow-hidden">
                            <div className="aspect-[4/3] overflow-hidden">
                              <Image
                                src={staff.image || "/placeholder.svg"}
                                alt={staff.fullName}
                                width={400}
                                height={300}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
                                Staff
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                              {staff.fullName}
                            </h3>
                            <p className="text-indigo-600 font-semibold mb-2">{staff.position}</p>
                            <p className="text-gray-600 text-sm mb-4">
                              {staff.hierarchy === 'staff' || staff.hierarchy === 'utility' 
                                ? staff.office || staff.officeAssigned || 'Office Not Assigned'
                                : staff.departmentAssigned || staff.department
                              }
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {staff.schoolYear}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4" />
                                {staff.yearsOfService} years
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Staff Found</h3>
                  <p className="text-gray-500">No staff members match your current filters.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
