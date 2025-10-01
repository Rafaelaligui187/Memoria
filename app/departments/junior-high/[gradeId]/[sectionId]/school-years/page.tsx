"use client"

import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { juniorHighData } from "@/lib/junior-high-data"

export default function JuniorHighSchoolYearsPage({
  params,
}: {
  params: { gradeId: string; sectionId: string }
}) {
  const gradeNames: Record<string, string> = {
    "grade-7": "Grade 7",
    "grade-8": "Grade 8",
    "grade-9": "Grade 9",
    "grade-10": "Grade 10",
  }

  const sectionNames: Record<string, string> = {
    "section-a": "Section A",
    "section-b": "Section B",
    "section-c": "Section C",
    "section-d": "Section D",
  }

  const gradeName = gradeNames[params.gradeId] || "Grade"
  const sectionName = sectionNames[params.sectionId] || "Section"

  // Derive available school years from data to prevent 404s
  const grade = (juniorHighData as any)[params.gradeId]
  const section = grade?.sections?.[params.sectionId]
  const schoolYearKeys: string[] = section?.schoolYears ? Object.keys(section.schoolYears) : []
  const schoolYears = schoolYearKeys.map((id) => ({ id, label: `School Year ${id.replace("-", " - ")}` }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/departments/junior-high/${params.gradeId}`}
            className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to {gradeName} Sections
          </Link>
        </div>
      </div>

      {/* Hero Section */}
<div className="relative bg-gradient-to-r from-emerald-600 to-green-700 py-24 px-4 sm:px-6 lg:px-8 text-white">
  <div className="relative max-w-7xl mx-auto text-center">
    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-2">{gradeName}</h1>
    <p className="text-2xl font-semibold text-emerald-100">{sectionName}</p>
  </div>
</div>



      {/* School Years */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Available School Years</h2>

        <div className="space-y-8">
          {schoolYears.map((year) => (
            <div
              key={year.id}
              className="bg-white rounded-xl shadow-sm border border-emerald-100 p-8 flex items-center justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{year.label}</h3>
                <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-2" />
                  <span>Yearbook Records</span>
                </div>
              </div>
              <Link
                href={`/departments/junior-high/${params.gradeId}/${params.sectionId}/${year.id}`}
                className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
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
