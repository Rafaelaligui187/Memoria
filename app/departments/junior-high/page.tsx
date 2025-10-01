"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function JuniorHighDepartmentPage() {
  // Mock data - replace with actual data fetching
  const grades = [
    {
      id: "grade-7",
      name: "Grade 7",
      sections: 5,
      students: 150,
      image: "/placeholder.svg?height=200&width=300&text=Grade+7",
    },
    {
      id: "grade-8",
      name: "Grade 8",
      sections: 5,
      students: 145,
      image: "/placeholder.svg?height=200&width=300&text=Grade+8",
    },
    {
      id: "grade-9",
      name: "Grade 9",
      sections: 4,
      students: 120,
      image: "/placeholder.svg?height=200&width=300&text=Grade+9",
    },
    {
      id: "grade-10",
      name: "Grade 10",
      sections: 4,
      students: 118,
      image: "/placeholder.svg?height=200&width=300&text=Grade+10",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-green-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        {/* 🔥 removed faded overlay so it matches Grade page exactly */}
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Junior High School Department
          </h1>
          <p className="mt-6 max-w-3xl text-xl">
            Nurturing young minds through academic excellence, character development, and innovative
            learning experiences.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-emerald-900"
            >
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
                Our Junior High School Department provides a dynamic learning environment where students
                are challenged to excel academically while developing essential life skills. We focus on
                preparing students for the rigors of senior high school through a comprehensive curriculum
                and engaging teaching methods.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With dedicated teachers and modern facilities, we ensure that each student receives the
                guidance and resources they need to succeed in their academic journey and beyond.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 flex items-center">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">
                    📘
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Enhanced Curriculum</h3>
                    <p className="text-sm text-gray-600">Aligned with national standards</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 flex items-center">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">🔬</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">STEM Focus</h3>
                    <p className="text-sm text-gray-600">Strong emphasis on science and technology</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 flex items-center">
                  <div className="bg-emerald-100 p-3 rounded-full mr-4">🎓</div>
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
