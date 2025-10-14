"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, Menu, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogoutButton } from "@/components/logout-button"
import { clearUnintendedAuth, isAuthenticated } from "@/lib/auth"

// Course data mapping
const courseData = {
  bsit: {
    name: "Bachelor of Science in Information Technology",
    shortName: "BSIT",
    description: "Information Technology program focusing on software development, networking, and IT systems.",
  },
  beed: {
    name: "Bachelor of Elementary Education",
    shortName: "BEED",
    description: "Education program preparing students to become elementary school teachers.",
  },
  bsed: {
    name: "Bachelor of Secondary Education",
    shortName: "BSED",
    description: "Education program preparing students to become high school teachers in various majors.",
  },
  bshm: {
    name: "Bachelor of Science in Hospitality Management",
    shortName: "BSHM",
    description: "Hospitality program focusing on hotel, restaurant, and tourism management.",
  },
  bsentrep: {
    name: "Bachelor of Science in Entrepreneurship",
    shortName: "BSENTREP",
    description: "Business program focusing on developing entrepreneurial skills and business management.",
  },
}

// Faculty data
const allFacultyData = [
  {
    id: 1,
    name: "Dr. Elena Rodriguez",
    position: "College Dean",
    department: "Administration",
    courses: ["bsit", "bsed", "beed", "bshm", "bsentrep"],
    photo: "/placeholder.svg?height=300&width=300&text=Dr.+Rodriguez",
    email: "elena.rodriguez@example.com",
    phone: "(123) 456-7890",
    education: "Ph.D. in Educational Leadership, University of Manila",
    bio: "Dr. Rodriguez has been with Consolatrix College for over 15 years. She has led numerous initiatives to improve academic standards and student experiences.",
  },
  {
    id: 2,
    name: "Dr. Maria Gonzales",
    position: "Department Head",
    department: "Information Technology",
    courses: ["bsit"],
    photo: "/placeholder.svg?height=300&width=300&text=Dr.+Gonzales",
    email: "maria.gonzales@example.com",
    phone: "(123) 456-7891",
    education: "Ph.D. in Computer Science, Cebu Institute of Technology",
    bio: "Dr. Gonzales specializes in artificial intelligence and data science. She has published numerous research papers and mentored many successful IT professionals.",
  },
  {
    id: 3,
    name: "Prof. Robert Santos",
    position: "Programming Instructor",
    department: "Information Technology",
    courses: ["bsit"],
    photo: "/placeholder.svg?height=300&width=300&text=Prof.+Santos",
    email: "robert.santos@example.com",
    phone: "(123) 456-7892",
    education: "Master's in Information Technology, University of Cebu",
    bio: "Prof. Santos brings industry experience to the classroom, having worked as a senior developer for several tech companies before joining academia.",
  },
  {
    id: 4,
    name: "Dr. Michael Tan",
    position: "Department Head",
    department: "Education",
    courses: ["beed", "bsed"],
    photo: "/placeholder.svg?height=300&width=300&text=Dr.+Tan",
    email: "michael.tan@example.com",
    phone: "(123) 456-7893",
    education: "Ed.D. in Curriculum Development, Philippine Normal University",
    bio: "Dr. Tan is passionate about teacher education and has implemented innovative teaching methodologies throughout the Education department.",
  },
  {
    id: 5,
    name: "Prof. Sarah Garcia",
    position: "Teaching Methods Instructor",
    department: "Education",
    courses: ["beed", "bsed"],
    photo: "/placeholder.svg?height=300&width=300&text=Prof.+Garcia",
    email: "sarah.garcia@example.com",
    phone: "(123) 456-7894",
    education: "Master's in Education, University of San Carlos",
    bio: "Prof. Garcia specializes in early childhood education and has developed several programs to enhance learning experiences for young students.",
  },
  {
    id: 6,
    name: "Dr. David Cruz",
    position: "Department Head",
    department: "Hospitality Management",
    courses: ["bshm"],
    photo: "/placeholder.svg?height=300&width=300&text=Dr.+Cruz",
    email: "david.cruz@example.com",
    phone: "(123) 456-7895",
    education: "Ph.D. in Hospitality Management, University of the Philippines",
    bio: "Dr. Cruz has extensive experience in the hospitality industry and maintains strong connections with hotels and resorts to provide internship opportunities for students.",
  },
  {
    id: 7,
    name: "Prof. Carlos Reyes",
    position: "Business Instructor",
    department: "Business Administration",
    courses: ["bsentrep"],
    photo: "/placeholder.svg?height=300&width=300&text=Prof.+Reyes",
    email: "carlos.reyes@example.com",
    phone: "(123) 456-7896",
    education: "MBA, Asian Institute of Management",
    bio: "Prof. Reyes brings real-world business experience to the classroom, having founded several successful startups before joining academia.",
  },
  {
    id: 8,
    name: "Prof. Ana Lim",
    position: "Database Systems Instructor",
    department: "Information Technology",
    courses: ["bsit"],
    photo: "/placeholder.svg?height=300&width=300&text=Prof.+Lim",
    email: "ana.lim@example.com",
    phone: "(123) 456-7897",
    education: "Master's in Computer Science, University of the Philippines",
    bio: "Prof. Lim is an expert in database systems and data management, with extensive experience in both academic and industry settings.",
  },
  {
    id: 9,
    name: "Prof. James Santos",
    position: "Networking Instructor",
    department: "Information Technology",
    courses: ["bsit"],
    photo: "/placeholder.svg?height=300&width=300&text=Prof.+Santos",
    email: "james.santos@example.com",
    phone: "(123) 456-7898",
    education: "Master's in Network Engineering, De La Salle University",
    bio: "Prof. Santos specializes in computer networks and cybersecurity, bringing practical industry knowledge to his teaching.",
  },
  {
    id: 10,
    name: "Prof. Maria Diaz",
    position: "Entrepreneurship Instructor",
    department: "Business Administration",
    courses: ["bsentrep"],
    photo: "/placeholder.svg?height=300&width=300&text=Prof.+Diaz",
    email: "maria.diaz@example.com",
    phone: "(123) 456-7899",
    education: "MBA, University of San Carlos",
    bio: "Prof. Diaz is passionate about fostering entrepreneurial mindsets and has mentored numerous student startups to success.",
  },
]

export default function CourseFacultyPage({ params }: { params: { courseId: string } }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const isLoggedIn = isAuthenticated()

  // Prevent unintended authentication on public pages
  useEffect(() => {
    clearUnintendedAuth()
  }, [])

  // Get course data based on courseId
  const courseId = params.courseId as keyof typeof courseData
  const course = courseData[courseId] || {
    name: "Unknown Course",
    shortName: "Unknown",
    description: "Course details not found.",
  }

  // Filter faculty for this course
  const facultyData = allFacultyData.filter((faculty) => faculty.courses.includes(courseId))

  // Filter faculty based on search query
  const filteredFaculty = facultyData.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group faculty by department
  const departments = Array.from(new Set(facultyData.map((faculty) => faculty.department)))

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">Memoria</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href={isLoggedIn ? "/dashboard" : "/"} className="text-sm font-medium hover:text-blue-600">
              Home
            </Link>
            <Link href="/gallery" className="text-sm font-medium hover:text-blue-600">
              Gallery
            </Link>
            <Link href="/memory-wall" className="text-sm font-medium hover:text-blue-600">
              Memory Wall
            </Link>
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 border-l pl-4 ml-2">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold">
                    J
                  </div>
                  <span className="text-sm font-medium">John Doe</span>
                </div>
                <LogoutButton />
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">Sign Up</Button>
                </Link>
              </div>
            )}
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
              <Link href={isLoggedIn ? "/dashboard" : "/"} className="text-sm font-medium hover:text-blue-600">
                Home
              </Link>
              <Link href="/gallery" className="text-sm font-medium hover:text-blue-600">
                Gallery
              </Link>
              <Link href="/memory-wall" className="text-sm font-medium hover:text-blue-600">
                Memory Wall
              </Link>
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 py-2 border-t">
                    <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold">
                      J
                    </div>
                    <span className="text-sm font-medium">John Doe</span>
                  </div>
                  <LogoutButton className="w-full" />
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t">
                  <Link href="/login">
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">Sign Up</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 py-10 bg-gray-50">
        <div className="container">
          <div className="flex items-center gap-2 mb-8">
            <Link href={`/departments/college/${courseId}`} className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/departments/college" className="text-gray-600 hover:text-blue-600">
              College Department
            </Link>
            <span className="text-gray-600">/</span>
            <Link href={`/departments/college/${courseId}`} className="text-gray-600 hover:text-blue-600">
              {course.shortName}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-900 font-medium">Faculty</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.shortName} Faculty</h1>
            <p className="text-gray-600">Meet the dedicated educators of the {course.name} program</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search by name, position, or department..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredFaculty.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No faculty found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFaculty.map((faculty) => (
                <Link href={`/faculty/${faculty.id}`} key={faculty.id}>
                  <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-blue-300">
                    <div className="p-6">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="relative w-32 h-32 mb-4">
                          <Image
                            src={faculty.photo || "/placeholder.svg"}
                            alt={faculty.name}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                        <h3 className="font-bold text-xl">{faculty.name}</h3>
                        <p className="text-blue-600 text-sm">{faculty.position}</p>
                        <p className="text-gray-600 text-sm">{faculty.department}</p>
                      </div>
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-700">{faculty.bio.substring(0, 120)}...</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-600">Memoria</span>
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
