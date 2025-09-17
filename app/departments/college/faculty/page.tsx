"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, LogOut, Menu, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function CollegeFacultyPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const facultyMembers = [
    {
      id: 1,
      name: "Dr. Elena Rodriguez",
      position: "College Dean",
      department: "Administration",
      photo: "/placeholder.svg?height=300&width=300&text=Dr.+Rodriguez",
      quote: "Education is the most powerful weapon which you can use to change the world.",
      email: "elena.rodriguez@example.com",
    },
    {
      id: 2,
      name: "Dr. Maria Gonzales",
      position: "Department Head",
      department: "Information Technology",
      photo: "/placeholder.svg?height=300&width=300&text=Dr.+Gonzales",
      quote: "Technology is best when it brings people together.",
      email: "maria.gonzales@example.com",
    },
    {
      id: 3,
      name: "Prof. Robert Santos",
      position: "Programming Instructor",
      department: "Information Technology",
      photo: "/placeholder.svg?height=300&width=300&text=Prof.+Santos",
      quote: "Code is like humor. When you have to explain it, it's bad.",
      email: "robert.santos@example.com",
    },
    {
      id: 4,
      name: "Engr. Anna Lim",
      position: "Networking Instructor",
      department: "Information Technology",
      photo: "/placeholder.svg?height=300&width=300&text=Engr.+Lim",
      quote: "The Internet is becoming the town square for the global village of tomorrow.",
      email: "anna.lim@example.com",
    },
    {
      id: 5,
      name: "Prof. James Reyes",
      position: "Database Instructor",
      department: "Information Technology",
      photo: "/placeholder.svg?height=300&width=300&text=Prof.+Reyes",
      quote: "Data is the new oil of the digital economy.",
      email: "james.reyes@example.com",
    },
    {
      id: 6,
      name: "Dr. Michael Tan",
      position: "Department Head",
      department: "Education",
      photo: "/placeholder.svg?height=300&width=300&text=Dr.+Tan",
      quote: "The function of education is to teach one to think intensively and to think critically.",
      email: "michael.tan@example.com",
    },
    {
      id: 7,
      name: "Prof. Sarah Garcia",
      position: "Teaching Methods Instructor",
      department: "Education",
      photo: "/placeholder.svg?height=300&width=300&text=Prof.+Garcia",
      quote: "Education is not the filling of a pail, but the lighting of a fire.",
      email: "sarah.garcia@example.com",
    },
    {
      id: 8,
      name: "Dr. David Cruz",
      position: "Department Head",
      department: "Hospitality Management",
      photo: "/placeholder.svg?height=300&width=300&text=Dr.+Cruz",
      quote: "Hospitality is making your guests feel at home, even if you wish they were.",
      email: "david.cruz@example.com",
    },
    {
      id: 9,
      name: "Prof. Lisa Mendoza",
      position: "Department Head",
      department: "Entrepreneurship",
      photo: "/placeholder.svg?height=300&width=300&text=Prof.+Mendoza",
      quote: "The best way to predict the future is to create it.",
      email: "lisa.mendoza@example.com",
    },
  ]

  // Filter faculty members based on search query
  const filteredFaculty = facultyMembers.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Group faculty members by department
  const departmentGroups = filteredFaculty.reduce(
    (groups, faculty) => {
      const department = faculty.department
      if (!groups[department]) {
        groups[department] = []
      }
      groups[department].push(faculty)
      return groups
    },
    {} as Record<string, typeof facultyMembers>,
  )

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
            <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600">
              Home
            </Link>
            <Link href="/gallery" className="text-sm font-medium hover:text-blue-600">
              Gallery
            </Link>
            <Link href="/memory-wall" className="text-sm font-medium hover:text-blue-600">
              Memory Wall
            </Link>
            <div className="flex items-center gap-2 border-l pl-4 ml-2">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold">
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
              <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600">
                Home
              </Link>
              <Link href="/gallery" className="text-sm font-medium hover:text-blue-600">
                Gallery
              </Link>
              <Link href="/memory-wall" className="text-sm font-medium hover:text-blue-600">
                Memory Wall
              </Link>
              <div className="flex items-center gap-2 py-2 border-t">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold">
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
      <main className="flex-1 py-10 bg-gray-50">
        <div className="container">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/departments/college" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/departments/college" className="text-blue-600 hover:text-blue-800">
              College Department
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-900 font-medium">Faculty</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">College Faculty & Staff</h1>
            <p className="text-gray-600">Meet the dedicated educators of Consolatrix College</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search faculty by name, position, or department..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Faculty Members by Department */}
          {Object.keys(departmentGroups).length > 0 ? (
            Object.entries(departmentGroups).map(([department, members]) => (
              <div key={department} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-2 h-6 bg-blue-600 mr-3 rounded-sm"></span>
                  {department} Department
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((faculty) => (
                    <Card
                      key={faculty.id}
                      className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-blue-300"
                    >
                      <div className="flex md:flex-col lg:flex-row items-center p-6 gap-4">
                        <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-24 lg:h-24 flex-shrink-0">
                          <Image
                            src={faculty.photo || "/placeholder.svg"}
                            alt={faculty.name}
                            fill
                            className="object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{faculty.name}</h3>
                          <p className="text-blue-600 text-sm">{faculty.position}</p>
                          <p className="text-gray-600 text-sm mt-1">{faculty.email}</p>
                          <p className="text-gray-600 text-sm italic mt-3">"{faculty.quote}"</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No faculty members found matching your search.</p>
              <Button
                variant="outline"
                className="mt-4 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
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
