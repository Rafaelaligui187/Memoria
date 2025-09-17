"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function JuniorHighDepartmentPage() {

  // Mock data - replace with actual data fetching
  const grades = [
    {
      id: "grade7",
      name: "Grade 7",
      sections: 5,
      students: 150,
      image: "/placeholder.svg?height=200&width=300&text=Grade+7",
    },
    {
      id: "grade8",
      name: "Grade 8",
      sections: 5,
      students: 145,
      image: "/placeholder.svg?height=200&width=300&text=Grade+8",
    },
    {
      id: "grade9",
      name: "Grade 9",
      sections: 4,
      students: 120,
      image: "/placeholder.svg?height=200&width=300&text=Grade+9",
    },
    {
      id: "grade10",
      name: "Grade 10",
      sections: 4,
      students: 118,
      image: "/placeholder.svg?height=200&width=300&text=Grade+10",
    },
  ]

  const academicYears: string[] = []

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-green-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Junior High School Department</h1>
          <p className="mt-6 max-w-3xl text-xl">
            Nurturing young minds through academic excellence, character development, and innovative learning
            experiences.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-emerald-800">
              Department Handbook
            </Button>
          </div>
        </div>
      </div>

      {/* Grade Levels Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <span className="bg-emerald-600 w-2 h-8 mr-3 rounded"></span>
          Grade Levels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {grades.map((grade) => (
            <Link key={grade.id} href={`/departments/junior-high/${grade.id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 border border-emerald-100 h-full flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img
                    src={grade.image || "/placeholder.svg"}
                    alt={grade.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{grade.name}</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>{grade.sections} Sections</span>
                    <span>{grade.students} Students</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-100">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">View Classes</Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-emerald-600 w-2 h-8 mr-3 rounded"></span>
                About Our Junior High School Department
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our Junior High School Department provides a dynamic learning environment where students are challenged
                to excel academically while developing essential life skills. We focus on preparing students for the
                rigors of senior high school through a comprehensive curriculum and engaging teaching methods.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With dedicated teachers and modern facilities, we ensure that each student receives the guidance and
                resources they need to succeed in their academic journey and beyond.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 flex items-center">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Enhanced Curriculum</h3>
                    <p className="text-sm text-gray-600">Aligned with national standards</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 flex items-center">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">STEM Focus</h3>
                    <p className="text-sm text-gray-600">Strong emphasis on science and technology</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 flex items-center">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Career Exploration</h3>
                    <p className="text-sm text-gray-600">Early guidance for future academic paths</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <img
                src="/placeholder.svg?height=400&width=600&text=Junior+High+Students"
                alt="Junior High Students"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
