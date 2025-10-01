"use client"

import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"

export default function SeniorHighSchoolYearSelectionPage({
  params,
}: {
  params: { strandId: string; yearId: string; sectionId: string }
}) {
  // Strand names + full names + taglines
  const strands: Record<
    string,
    { short: string; full: string; tagline: string }
  > = {
    stem: {
      short: "STEM",
      full: "Science, Technology, Engineering, and Mathematics",
      tagline: "BUILD, SOLVE, CONNECT",
    },
    abm: {
      short: "ABM",
      full: "Accountancy, Business, and Management",
      tagline: "LEAD, INNOVATE, SUCCEED",
    },
    humss: {
      short: "HUMSS",
      full: "Humanities and Social Sciences",
      tagline: "THINK, ANALYZE, COMMUNICATE",
    },
    gas: {
      short: "GAS",
      full: "General Academic Strand",
      tagline: "EXPLORE, DISCOVER, EXCEL",
    },
    tvl: {
      short: "TVL",
      full: "Technical-Vocational-Livelihood",
      tagline: "CREATE, BUILD, ACHIEVE",
    },
    arts: {
      short: "Arts",
      full: "Arts and Design Track",
      tagline: "CREATE, INSPIRE, EXPRESS",
    },
  }

  const yearNames: Record<string, string> = {
    "grade-11": "Grade 11",
    "grade-12": "Grade 12",
  }

  const sectionNames: Record<string, string> = {
    "section-a": "Section A",
    "section-b": "Section B",
    "section-c": "Section C",
    "section-d": "Section D",
  }

  const strand = strands[params.strandId] || {
    short: "Strand",
    full: "Strand Program",
    tagline: "MEMORIA YEARBOOK",
  }
  const yearName = yearNames[params.yearId] || "Year"
  const sectionName = sectionNames[params.sectionId] || "Section"

  // Mock school years (replace with API later)
  const schoolYears = [
    { id: "2021-2022", label: "School Year 2021 - 2022" },
    { id: "2022-2023", label: "School Year 2022 - 2023" },
    { id: "2023-2024", label: "School Year 2023 - 2024" },
    { id: "2024-2025", label: "School Year 2024 - 2025" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
  href={`/departments/senior-high/${params.strandId}`}
  className="inline-flex items-center text-amber-600 hover:text-amber-800 transition-colors"
>
  <ArrowLeft className="h-5 w-5 mr-2" />
  Back to {strand.short} Sections
</Link>

        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 to-yellow-600 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-2">
            {strand.full}
          </h1>
          <p className="text-2xl font-light tracking-widest text-amber-200 mb-6">
            {strand.tagline}
          </p>
          <p className="text-2xl font-semibold text-amber-100">
            {yearName} – {sectionName}
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
              className="bg-white rounded-xl shadow-sm border border-amber-100 p-8 flex items-center justify-between"
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
                href={`/departments/senior-high/${params.strandId}/${params.yearId}/${params.sectionId}/${year.id}`}
                className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
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
