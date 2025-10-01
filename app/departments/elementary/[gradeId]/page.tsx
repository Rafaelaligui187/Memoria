"use client"

import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { notFound } from "next/navigation"

const grades = {
  grade1: {
    name: "Grade 1",
    description:
      "Foundation year focusing on basic literacy, numeracy, and social skills development.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 30, adviser: "Ms. Maria Santos" },
      { id: "section-b", name: "Section B", students: 28, adviser: "Ms. Ana Cruz" },
      { id: "section-c", name: "Section C", students: 32, adviser: "Ms. Rosa Garcia" },
    ],
    stats: { totalStudents: 90, sections: 3, subjects: 8 },
  },
  grade2: {
    name: "Grade 2",
    description:
      "Building upon foundational skills with enhanced reading, writing, and mathematical concepts.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 29, adviser: "Ms. Carmen Lopez" },
      { id: "section-b", name: "Section B", students: 31, adviser: "Ms. Elena Rodriguez" },
      { id: "section-c", name: "Section C", students: 28, adviser: "Ms. Sofia Martinez" },
    ],
    stats: { totalStudents: 88, sections: 3, subjects: 8 },
  },
  // ... keep other grades the same
}

export default function ElementaryGradePage({
  params,
}: {
  params: { gradeId: string }
}) {
  const grade = grades[params.gradeId as keyof typeof grades]

  if (!grade) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Back Button - SAME as School Year Selection Page */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/departments/elementary"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Elementary Department
          </Link>
        </div>
      </div>

      {/* Hero Section - untouched */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
            {grade.name}
          </h1>
          <p className="text-2xl font-light tracking-widest text-blue-100">
            {grade.tagline}
          </p>
          <p className="mt-8 max-w-3xl mx-auto text-xl text-blue-50">
            {grade.description}
          </p>
        </div>
      </div>

      {/* Sections list - untouched */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Year Level & Sections
        </h2>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {grade.name}
                </h3>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    {grade.sections.length} Section
                    {grade.sections.length > 1 ? "s" : ""} Available
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {grade.sections.map((section) => (
                  <Link
                    key={section.id}
                    href={`/departments/elementary/${params.gradeId}/${section.id}`}
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
                      {section.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
