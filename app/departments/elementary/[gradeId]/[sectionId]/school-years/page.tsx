"use client"

import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { elementaryData } from "@/lib/elementary-data"

function normalizeGradeId(id: string) {
  if (id.startsWith("grade") && !id.includes("-")) {
    const num = id.replace("grade", "")
    return `grade-${num}`
  }
  return id
}

// helper for URLs (convert "grade-1" → "grade1")
function toUrlGradeId(id: string) {
  return id.replace("grade-", "grade")
}

export default function ElementarySchoolYearSelectionPage({
  params,
}: {
  params: { gradeId: string; sectionId: string }
}) {
  const normalizedGradeId = normalizeGradeId(params.gradeId)
  const urlGradeId = toUrlGradeId(normalizedGradeId)
  const grade = (elementaryData as any)[normalizedGradeId]
  const section = grade?.sections?.[params.sectionId]

  if (!grade || !section) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href={`/departments/elementary/${urlGradeId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Grade
          </Link>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8 text-center">
            <p className="text-gray-700">Section not found for this grade.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Back */}
      <div className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/departments/elementary/${urlGradeId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Sections
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-2">
            Elementary Department
          </h1>
          <p className="text-2xl font-light tracking-widest text-blue-100 mb-6">
            LEARN, GROW, DISCOVER
          </p>
          <p className="text-2xl font-semibold text-white/90">
            {grade.name} – {section.name}
          </p>
        </div>
      </div>

      {/* Years list */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Available School Years
        </h2>
        <div className="space-y-8">
          {Object.entries(section.schoolYears).map(([id, year]: any) => (
            <div
              key={id}
              className="bg-white rounded-xl shadow-sm border border-blue-100 p-8 flex items-center justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  School Year {year.academicYear}
                </h3>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Yearbook Records</span>
                </div>
              </div>
              <Link
                href={`/departments/elementary/${urlGradeId}/${params.sectionId}/${id}`}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
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
