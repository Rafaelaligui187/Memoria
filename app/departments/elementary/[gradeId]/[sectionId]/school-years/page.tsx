"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"

interface SchoolYear {
  id: string
  label: string
  status: "active" | "archived" | "draft"
  startDate: string
  endDate: string
}

export default function ElementarySchoolYearSelectionPage({
  params,
}: {
  params: { gradeId: string; sectionId: string }
}) {
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [loading, setLoading] = useState(true)

  // Map grade IDs to their display names
  const gradeNames: Record<string, string> = {
    "grade-1": "Grade 1",
    "grade-2": "Grade 2",
    "grade-3": "Grade 3",
    "grade-4": "Grade 4",
    "grade-5": "Grade 5",
    "grade-6": "Grade 6",
  }

  // Map section IDs to their display names
  const sectionNames: Record<string, string> = {
    "section-a": "Section A",
    "section-b": "Section B",
    "section-c": "Section C",
    "section-d": "Section D",
  }

  const gradeName = gradeNames[params.gradeId] || "Grade"
  const sectionName = sectionNames[params.sectionId] || "Section"

  useEffect(() => {
    const fetchSchoolYears = async () => {
      try {
        const response = await fetch("/api/admin/years")
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // Sort years by start date, most recent first
            const sortedYears = data.data.sort(
              (a: SchoolYear, b: SchoolYear) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
            )
            setSchoolYears(sortedYears)
          }
        }
      } catch (error) {
        console.error("Failed to fetch school years:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchoolYears()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center text-sky-700">Loading school years...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Back */}
      <div className="bg-white border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/departments/elementary/${params.gradeId}`}
            className="inline-flex items-center text-sky-600 hover:text-sky-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to {gradeName}
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative bg-gradient-to-r from-sky-600 to-blue-600 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-2">Elementary Department</h1>
          <p className="text-2xl font-light tracking-widest text-sky-100 mb-6">LEARN, GROW, DISCOVER</p>
          <p className="text-2xl font-semibold text-white/90">
            {gradeName} – {sectionName}
          </p>
        </div>
      </div>

      {/* Years list */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Available School Years</h2>
        <div className="space-y-8">
          {schoolYears.map((year) => (
            <div
              key={year.id}
              className="bg-white rounded-xl shadow-sm border border-sky-100 p-8 flex items-center justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{year.label}</h3>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Yearbook Records</span>
                </div>
              </div>
              <Link
                href={`/departments/elementary/${params.gradeId}/${params.sectionId}/${year.id}`}
                className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
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
