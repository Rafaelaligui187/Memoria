"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap, LogOut, Menu, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CollegeCourseYearPage({ params }: { params: { courseId: string; yearId: string } }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Map course IDs to their display names
  const courseNames: Record<string, string> = {
    bsit: "BSIT",
    beed: "BEED",
    bsed: "BSED",
    bshm: "BSHM",
    bsentrep: "BSENTREP",
  }

  const courseFullNames: Record<string, string> = {
    bsit: "Bachelor of Science in Information Technology",
    beed: "Bachelor of Elementary Education",
    bsed: "Bachelor of Secondary Education",
    bshm: "Bachelor of Science in Hospitality Management",
    bsentrep: "Bachelor of Science in Entrepreneurship",
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

  // Map year IDs to their display names
  const yearNames: Record<string, string> = {
    "1st-year": "1st Year",
    "2nd-year": "2nd Year",
    "3rd-year": "3rd Year",
    "4th-year": "4th Year",
  }

  const courseName = courseNames[params.courseId] || "Course"
  const courseFullName = courseFullNames[params.courseId] || "Course"
  const yearName = yearNames[params.yearId] || "Year"
  const courseIcon = courseIcons[params.courseId] || "📋"
  const courseColor = courseColors[params.courseId] || "from-purple-500 to-indigo-600"

  // Sample blocks/sections for the selected course and year
  const blocks = [
    {
      id: "block-a",
      name: "Block A",
      description: `${yearName} ${courseName} students in Block A`,
      image: `/placeholder.svg?height=200&width=400&text=${courseName}+${yearName}+Block+A`,
      adviser: "Prof. Maria Santos",
      students: 15,
      schedule: "MWF 8:00 AM - 11:00 AM",
    },
    {
      id: "block-b",
      name: "Block B",
      description: `${yearName} ${courseName} students in Block B`,
      image: `/placeholder.svg?height=200&width=400&text=${courseName}+${yearName}+Block+B`,
      adviser: "Prof. John Reyes",
      students: 16,
      schedule: "MWF 1:00 PM - 4:00 PM",
    },
    {
      id: "block-c",
      name: "Block C",
      description: `${yearName} ${courseName} students in Block C`,
      image: `/placeholder.svg?height=200&width=400&text=${courseName}+${yearName}+Block+C`,
      adviser: "Prof. Anna Cruz",
      students: 14,
      schedule: "TTh 8:00 AM - 12:00 PM",
    },
  ]

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
              {courseName}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-900 font-medium">{yearName}</span>
          </div>

          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-r ${courseColor} flex items-center justify-center text-white text-3xl flex-shrink-0`}
              >
                <span>{courseIcon}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {courseName} - {yearName}
                </h1>
                <p className="text-gray-600">Select a block to view students</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blocks.map((block) => (
              <Link href={`/departments/college/${params.courseId}/${params.yearId}/${block.id}`} key={block.id}>
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] h-full border-0 shadow-md">
                  <div className="relative h-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-indigo-900/80 z-10"></div>
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-20"></div>
                    <div className="absolute top-4 left-4 z-20">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
                        {block.name}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <h3 className="text-white font-bold text-xl">{block.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-white text-xs flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {block.students} Students
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 z-0">
                      <Image src={block.image || "/placeholder.svg"} alt={block.name} fill className="object-cover" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900">Adviser:</p>
                        <p className="text-sm text-gray-700">{block.adviser}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-900">Schedule:</p>
                        <p className="text-sm text-gray-700">{block.schedule}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <span className="text-purple-600 font-medium text-sm flex items-center">
                        View Students
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Year Highlights */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <GraduationCap className="h-6 w-6 mr-2 text-purple-600" />
              {courseName} - {yearName} Highlights
            </h2>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg mb-4 text-purple-800">Academic Achievements</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <p className="text-gray-700">
                        {courseName === "BSIT" && "First Place in the Programming Contest"}
                        {courseName === "BEED" && "Best Teaching Demo Award"}
                        {courseName === "BSED" && "Excellence in Research Paper"}
                        {courseName === "BSHM" && "Culinary Competition Winners"}
                        {courseName === "BSENTREP" && "Outstanding Business Plan"}
                        {!courseName && "Academic Excellence Award"}
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <p className="text-gray-700">
                        {courseName === "BSIT" && "Web Development Challenge Champions"}
                        {courseName === "BEED" && "Innovative Teaching Materials Award"}
                        {courseName === "BSED" && "Best Thesis Award"}
                        {courseName === "BSHM" && "Hotel Management Simulation Winners"}
                        {courseName === "BSENTREP" && "Entrepreneurship Pitch Competition Winners"}
                        {!courseName && "Research Excellence Award"}
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <p className="text-gray-700">
                        {courseName === "BSIT" && "Software Development Team Award"}
                        {courseName === "BEED" && "Literacy Program Implementation Award"}
                        {courseName === "BSED" && "Teaching Skills Competition Champions"}
                        {courseName === "BSHM" && "Food and Beverage Service Excellence"}
                        {courseName === "BSENTREP" && "Social Enterprise Development Award"}
                        {!courseName && "Leadership Excellence Award"}
                      </p>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4 text-purple-800">Special Activities</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <p className="text-gray-700">
                        {courseName === "BSIT" && "IT Bootcamp and Technology Workshop"}
                        {courseName === "BEED" && "Teaching Practice in Elementary Schools"}
                        {courseName === "BSED" && "Educational Materials Development Workshop"}
                        {courseName === "BSHM" && "Industry Immersion in Local Hotels"}
                        {courseName === "BSENTREP" && "Business Incubation Program"}
                        {!courseName && "Field Trip and Industry Visit"}
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <p className="text-gray-700">
                        {courseName === "BSIT" && "Hackathon and Coding Marathon"}
                        {courseName === "BEED" && "Children's Reading Program"}
                        {courseName === "BSED" && "Teaching Skills Enhancement Workshop"}
                        {courseName === "BSHM" && "Food Festival Organization"}
                        {courseName === "BSENTREP" && "Product Development Showcase"}
                        {!courseName && "Community Service Project"}
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <p className="text-gray-700">
                        {courseName === "BSIT" && "IT Industry Link Seminars"}
                        {courseName === "BEED" && "Educational Materials Exhibition"}
                        {courseName === "BSED" && "Teaching Methodology Conference"}
                        {courseName === "BSHM" && "Tourism and Hospitality Symposium"}
                        {courseName === "BSENTREP" && "Business Networking Event"}
                        {!courseName && "Academic Conference Participation"}
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
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
