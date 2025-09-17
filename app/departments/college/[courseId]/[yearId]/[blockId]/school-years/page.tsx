"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"

export default function SchoolYearsPage({
  params,
}: {
  params: { courseId: string; yearId: string; blockId: string }
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Course map
  const courseFullNames: Record<string, string> = {
    bsit: "Bachelor of Science in Information Technology",
    beed: "Bachelor of Elementary Education",
    bsed: "Bachelor of Secondary Education",
    bshm: "Bachelor of Science in Hospitality Management",
    bsentrep: "Bachelor of Science in Entrepreneurship",
    bscs: "Bachelor of Science in Computer Science",
  }

  const courseNames: Record<string, string> = {
    bsit: "BSIT",
    beed: "BEED",
    bsed: "BSED",
    bshm: "BSHM",
    bsentrep: "BSENTREP",
    bscs: "BSCS",
  }

  // Year names
  const yearNames: Record<string, string> = {
    "1st-year": "First Year",
    "2nd-year": "Second Year",
    "3rd-year": "Third Year",
    "4th-year": "Fourth Year",
  }

  // Block names
  const blockNames: Record<string, string> = {
    "block-a": "Block A",
    "block-b": "Block B",
    "block-c": "Block C",
    "block-d": "Block D",
  }

  const courseFullName = courseFullNames[params.courseId] || "Course"
  const courseName = courseNames[params.courseId] || "Course"
  const yearName = yearNames[params.yearId] || "Year"
  const blockName = blockNames[params.blockId] || "Block"

  // Sample school years (replace with API later)
  const schoolYears = [
    { id: "2021-2022", label: "School Year 2021 - 2022" },
    { id: "2022-2023", label: "School Year 2022 - 2023" },
    { id: "2023-2024", label: "School Year 2023 - 2024" },
    { id: "2024-2025", label: "School Year 2024 - 2025" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/departments/college/${params.courseId}`}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to {courseName}
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-2">
            {courseFullName}
          </h1>
          <p className="text-2xl font-light tracking-widest text-purple-200 mb-6">
            BUILD, SOLVE, CONNECT
          </p>
          <p className="text-2xl font-semibold text-purple-100">
            {yearName} – {blockName}
          </p>
        </div>
      </div>

      {/* School Years Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Available School Years
        </h2>

        <div className="space-y-8">
          {schoolYears.map((year) => (
            <div
              key={year.id}
              className="bg-white rounded-xl shadow-sm border border-purple-100 p-8 flex items-center justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {year.label}
                </h3>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Yearbook Records</span>
                </div>
              </div>
              <Link
                href={`/departments/college/${params.courseId}/${params.yearId}/${params.blockId}/${year.id}`}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                View Yearbook
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
