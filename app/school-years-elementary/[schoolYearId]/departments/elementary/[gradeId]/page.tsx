"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"

interface SchoolYear {
  _id: string
  yearLabel: string
  startYear: number
  endYear: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const grades = {
  grade1: {
    name: "Grade 1",
    description:
      "Foundation year focusing on basic literacy, numeracy, and social skills development.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [],
    stats: { totalStudents: 0, sections: 0, subjects: 8 },
  },
  grade2: {
    name: "Grade 2",
    description:
      "Building upon foundational skills with enhanced reading, writing, and mathematical concepts.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [],
    stats: { totalStudents: 0, sections: 0, subjects: 8 },
  },
  grade3: {
    name: "Grade 3",
    description:
      "Expanding knowledge base with more complex subjects and critical thinking skills.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [],
    stats: { totalStudents: 0, sections: 0, subjects: 8 },
  },
  grade4: {
    name: "Grade 4",
    description:
      "Developing independence and responsibility while mastering core academic subjects.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [],
    stats: { totalStudents: 0, sections: 0, subjects: 8 },
  },
  grade5: {
    name: "Grade 5",
    description:
      "Preparing for middle school with advanced subjects and leadership opportunities.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [],
    stats: { totalStudents: 0, sections: 0, subjects: 8 },
  },
  grade6: {
    name: "Grade 6",
    description:
      "Final year of elementary education, focusing on comprehensive preparation for high school.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [],
    stats: { totalStudents: 0, sections: 0, subjects: 8 },
  },
}

export default function ElementaryGradePage({
  params,
}: {
  params: { schoolYearId: string; gradeId: string }
}) {
  const grade = grades[params.gradeId as keyof typeof grades]
  const [schoolYearData, setSchoolYearData] = useState<SchoolYear | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sections, setSections] = useState<any[]>([])
  const [sectionsLoading, setSectionsLoading] = useState(true)

  // Fetch school year data
  useEffect(() => {
    const fetchSchoolYearData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/school-years/${params.schoolYearId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch school year data: ${response.statusText}`)
        }
        const result = await response.json()
        if (result.success && result.data) {
          setSchoolYearData(result.data)
        } else {
          setError(result.error || "School year not found.")
        }
      } catch (err) {
        console.error("Error fetching school year data:", err)
        setError(`Error: ${err instanceof Error ? err.message : "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }
    fetchSchoolYearData()
  }, [params.schoolYearId])

  // Fetch sections data
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setSectionsLoading(true)
        const response = await fetch(`/api/admin/sections?department=elementary&schoolYearId=${params.schoolYearId}&grade=${grade.name}`)
        const result = await response.json()
        
        if (result.success) {
          setSections(result.data)
        } else {
          setSections([])
        }
      } catch (error) {
        console.error('Error fetching sections:', error)
        setSections([])
      } finally {
        setSectionsLoading(false)
      }
    }

    if (params.schoolYearId && grade) {
      fetchSections()
    }
  }, [params.schoolYearId, grade])

  if (!grade) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/school-years-elementary/${params.schoolYearId}/departments/elementary`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Elementary Department
          </Link>
        </div>
      </div>

      {/* Hero Section */}
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
          
          {/* School Year Display */}
          {loading ? (
            <div className="mt-6">
              <div className="animate-pulse">
                <div className="h-6 bg-blue-200 rounded w-48 mx-auto"></div>
              </div>
            </div>
          ) : error ? (
            <div className="mt-6">
              <p className="text-blue-200 text-sm">{error}</p>
            </div>
          ) : schoolYearData ? (
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="text-blue-100 text-2xl">
                {schoolYearData.yearLabel} Academic Year
              </span>
              {schoolYearData.isActive && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Active Year
                </span>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Sections list */}
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
                    {sectionsLoading ? "Loading..." : `${sections.length} Section${sections.length > 1 ? "s" : ""} Available`}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {sectionsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
                  </div>
                ) : sections.length > 0 ? (
                  sections.map((section) => (
                    <Link
                      key={section._id}
                      href={`/school-years-elementary/${params.schoolYearId}/departments/elementary/${params.gradeId}/${section.name}`}
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
                        {section.name}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm">No sections available</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
