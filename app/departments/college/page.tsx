"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CollegeDepartmentPage() {

  // Mock data - replace with actual data fetching
  const courses = [
    {
      id: "bsit",
      name: "BS Information Technology",
      abbr: "BSIT",
      students: 120,
      faculty: 8,
      image: "/images/CSSlogo.png?height=100&width=300&text=BSIT",
    },
    {
      id: "beed",
      name: "Bachelor of Elementary Education",
      abbr: "BEED",
      students: 95,
      faculty: 7,
      image: "/images/Educlogo.png?height=200&width=300&text=BEED",
    },
    {
      id: "bsed",
      name: "Bachelor of Secondary Education",
      abbr: "BSED",
      students: 105,
      faculty: 9,
      image: "/images/Educlogo.png?height=200&width=300&text=BEED",
    },
    {
      id: "bshm",
      name: "BS Hospitality Management",
      abbr: "BSHM",
      students: 85,
      faculty: 6,
      image: "/images/BSHMlogo.png?height=200&width=300&text=BSHM",
    },
    {
      id: "bsentrep",
      name: "BS Entrepreneurship",
      abbr: "BSENTREP",
      students: 75,
      faculty: 5,
      image: "/images/Entreplogo.png?height=200&width=300&text=BSENTREP",
    },
  ]

  const academicYears: string[] = []

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">College Department</h1>
          <p className="mt-6 max-w-3xl text-xl">
            Preparing future professionals through academic excellence, research, and community engagement.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-purple-800">
              Department Handbook
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <span className="bg-purple-600 w-2 h-8 mr-3 rounded"></span>
          Academic Programs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link key={course.id} href={`/departments/college/${course.id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 border border-purple-100 h-full flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.abbr}</h3>
                  <p className="text-sm text-gray-600 mb-4">{course.name}</p>
                  
                  <div className="mt-4 pt-4 border-t border-purple-100">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">View Program</Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-purple-600 w-2 h-8 mr-3 rounded"></span>
                About Our College Department
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our College Department offers a diverse range of academic programs designed to prepare students for
                successful careers and further studies. Through a comprehensive curriculum, research opportunities, and
                industry partnerships, we equip our students with the knowledge and skills they need to excel in their
                chosen fields.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With dedicated faculty members who are experts in their respective disciplines, we provide quality
                education that balances theoretical knowledge with practical applications, ensuring that our graduates
                are well-prepared for the demands of the professional world.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Industry Partnerships</h3>
                    <p className="text-sm text-gray-600">Connections with leading companies</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Research Opportunities</h3>
                    <p className="text-sm text-gray-600">Student-led research initiatives</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100 flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Global Perspective</h3>
                    <p className="text-sm text-gray-600">International exchange programs</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <img
                src="/images/logoCCTC.png?height=400&width=600&text=College+Students"
                alt="College Students"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
