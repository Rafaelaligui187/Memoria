"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, LogOut, Menu, Search, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function CollegeFacultyDirectoryPage({ params }: { params: { courseId: string } }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Map course IDs to their display names
  const courseNames: Record<string, string> = {
    bsit: "Bachelor of Science in Information Technology",
    beed: "Bachelor of Elementary Education",
    bsed: "Bachelor of Secondary Education",
    bshm: "Bachelor of Science in Hospitality Management",
    bsentrep: "Bachelor of Science in Entrepreneurship",
  }

  const courseAbbr: Record<string, string> = {
    bsit: "BSIT",
    beed: "BEED",
    bsed: "BSED",
    bshm: "BSHM",
    bsentrep: "BSENTREP",
  }

  const courseIcons: Record<string, string> = {
    bsit: "💻",
    beed: "📚",
    bsed: "🎓",
    bshm: "🏨",
    bsentrep: "💼",
  }

  const courseColors: Record<string, string> = {
    bsit: "from-purple-500 to-indigo-600",
    beed: "from-blue-500 to-cyan-600",
    bsed: "from-green-500 to-emerald-600",
    bshm: "from-orange-500 to-amber-600",
    bsentrep: "from-red-500 to-rose-600",
  }

  const courseName = courseNames[params.courseId] || "Course"
  const courseAbbrName = courseAbbr[params.courseId] || "Course"
  const courseIcon = courseIcons[params.courseId] || "📋"
  const courseColor = courseColors[params.courseId] || "from-purple-500 to-indigo-600"

  // Sample faculty data
  const facultyMembers = [
    {
      id: 1,
      name: "Dr. Maria Santos",
      photo: "/placeholder.svg?height=300&width=300&text=Dr.+Santos",
      position: "Department Chair",
      specialization: "Software Engineering",
      education: "Ph.D. in Computer Science",
      yearsOfService: 12,
    },
    {
      id: 2,
      name: "Prof. John Reyes",
      photo: "/placeholder.svg?height=300&width=300&text=Prof.+Reyes",
      position: "Associate Professor",
      specialization: "Database Systems",
      education: "M.S. in Information Technology",
      yearsOfService: 8,
    },
    {
      id: 3,
      name: "Prof. Anna Cruz",
      photo: "/placeholder.svg?height=300&width=300&text=Prof.+Cruz",
      position: "Assistant Professor",
      specialization: "Web Development",
      education: "M.S. in Computer Science",
      yearsOfService: 5,
    },
    {
      id: 4,
      name: "Dr. Carlos Bautista",
      photo: "/placeholder.svg?height=300&width=300&text=Dr.+Bautista",
      position: "Professor",
      specialization: "Networking and Security",
      education: "Ph.D. in Information Security",
      yearsOfService: 10,
    },
    {
      id: 5,
      name: "Prof. Elena Lim",
      photo: "/placeholder.svg?height=300&width=300&text=Prof.+Lim",
      position: "Instructor",
      specialization: "Mobile Development",
      education: "M.S. in Software Engineering",
      yearsOfService: 3,
    },
    {
      id: 6,
      name: "Dr. Roberto Tan",
      photo: "/placeholder.svg?height=300&width=300&text=Dr.+Tan",
      position: "Professor",
      specialization: "Artificial Intelligence",
      education: "Ph.D. in Computer Science",
      yearsOfService: 15,
    },
  ]

  // Filter faculty based on search query
  const filteredFaculty = facultyMembers.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.specialization.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-purple-600">Memoria</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="/gallery" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Gallery
            </Link>
            <Link href="/memory-wall" className="text-sm font-medium hover:text-purple-600 transition-colors">
              Memory Wall
            </Link>
            <div className="flex items-center gap-2 border-l pl-4 ml-2">
              <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center text-purple-600 font-bold">
                J
              </div>
              <span className="text-sm font-medium">John Doe</span>
            </div>
            <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 px-6 bg-white">
            <nav className="flex flex-col space-y-4">
              <Link href="/dashboard" className="text-sm font-medium hover:text-purple-600">
                Home
              </Link>
              <Link href="/gallery" className="text-sm font-medium hover:text-purple-600">
                Gallery
              </Link>
              <Link href="/memory-wall" className="text-sm font-medium hover:text-purple-600">
                Memory Wall
              </Link>
              <div className="flex items-center gap-2 py-2 border-t">
                <div className="bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center text-purple-600 font-bold">
                  J
                </div>
                <span className="text-sm font-medium">John Doe</span>
              </div>
              <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50 w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 py-10">
        <div className="container">
          <div className="flex items-center gap-2 mb-8">
            <Link
              href={`/departments/college/${params.courseId}`}
              className="text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/departments/college" className="text-purple-600 hover:text-purple-800 transition-colors">
              College
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href={`/departments/college/${params.courseId}`}
              className="text-purple-600 hover:text-purple-800 transition-colors"
            >
              {courseAbbrName}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-900 font-medium">Faculty</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-r ${courseColor} flex items-center justify-center text-white text-3xl flex-shrink-0`}
              >
                <span>{courseIcon}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-purple-600 inline md:hidden" />
                  {courseAbbrName} Faculty
                </h1>
                <p className="text-gray-600">{courseName} Department</p>
              </div>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search faculty..."
                className="pl-9 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((faculty) => (
              <Card
                key={faculty.id}
                className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] h-full border-0 shadow-md"
              >
                <div className="relative h-64">
                  <Image src={faculty.photo || "/placeholder.svg"} alt={faculty.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-xl">{faculty.name}</h3>
                    <p className="text-white/90 text-sm">{faculty.position}</p>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Specialization</p>
                      <p className="text-gray-900">{faculty.specialization}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Education</p>
                      <p className="text-gray-900">{faculty.education}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Years of Service</p>
                      <p className="text-gray-900">{faculty.yearsOfService} years</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFaculty.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty members found</h3>
              <p className="text-gray-600">Try adjusting your search query</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-bold text-purple-600">Memoria</span>
            </div>
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Consolatrix College of Toledo City, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
