"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { ArrowLeft } from "lucide-react"

interface SchoolYear {
  _id: string
  yearLabel: string
  startYear: number
  endYear: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function JuniorHighDepartmentPage({ params }: { params: { schoolYearId: string } }) {
  const [schoolYearData, setSchoolYearData] = useState<SchoolYear | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch school year data
  useEffect(() => {
    const fetchSchoolYearData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/school-years/${params.schoolYearId}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch school year: ${response.status}`)
        }
        const result = await response.json()
        if (result.success && result.data) {
          setSchoolYearData(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch school year')
        }
      } catch (err) {
        console.error('Error fetching school year:', err)
        setError(`Failed to load school year: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchSchoolYearData()
  }, [params.schoolYearId])

  const [grades, setGrades] = useState<any[]>([])
  const [gradesLoading, setGradesLoading] = useState(true)

  // Hardcoded Junior High grades
  const juniorHighGrades = [
    { id: "grade-7", name: "Grade 7", image: "/placeholder.svg?height=200&width=300&text=Grade+7" },
    { id: "grade-8", name: "Grade 8", image: "/placeholder.svg?height=200&width=300&text=Grade+8" },
    { id: "grade-9", name: "Grade 9", image: "/placeholder.svg?height=200&width=300&text=Grade+9" },
    { id: "grade-10", name: "Grade 10", image: "/placeholder.svg?height=200&width=300&text=Grade+10" },
  ]

  // Fetch sections for Junior High department
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setGradesLoading(true)
        const response = await fetch(`/api/admin/sections?department=junior-high&schoolYearId=${params.schoolYearId}`)
        const result = await response.json()
        
        if (result.success) {
          // Group sections by grade
          const gradeMap = new Map()
          
          result.data.forEach((section: any) => {
            if (!gradeMap.has(section.grade)) {
              gradeMap.set(section.grade, [])
            }
            gradeMap.get(section.grade).push(section)
          })

          // Create grades array with section counts
          const gradesWithSections = juniorHighGrades.map(grade => ({
            ...grade,
            sections: gradeMap.get(grade.name) || [],
            students: 0, // This could be calculated from student profiles if needed
          }))

          setGrades(gradesWithSections)
        } else {
          // Use hardcoded grades if API fails
          const gradesWithSections = juniorHighGrades.map(grade => ({
            ...grade,
            sections: [],
            students: 0,
          }))
          setGrades(gradesWithSections)
        }
      } catch (error) {
        console.error('Error fetching sections:', error)
        // Use hardcoded grades if API fails
        const gradesWithSections = juniorHighGrades.map(grade => ({
          ...grade,
          sections: [],
          students: 0,
        }))
        setGrades(gradesWithSections)
      } finally {
        setGradesLoading(false)
      }
    }

    if (params.schoolYearId) {
      fetchSections()
    }
  }, [params.schoolYearId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/departments/junior-high"
            className="text-emerald-600 hover:text-emerald-800 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to School Years
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-green-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Junior High School Department
          </h1>
          <p className="mt-6 max-w-3xl text-xl">
            Nurturing young minds through academic excellence, character development, and innovative
            learning experiences.
          </p>
          
          {/* School Year Display */}
          {loading ? (
            <div className="mt-6">
              <div className="animate-pulse">
                <div className="h-6 bg-emerald-200 rounded w-48"></div>
              </div>
            </div>
          ) : error ? (
            <div className="mt-6">
              <p className="text-emerald-200 text-sm">{error}</p>
            </div>
          ) : schoolYearData ? (
            <div className="mt-6 flex items-center gap-4">
              <span className="text-emerald-200 text-lg">
                {schoolYearData.yearLabel} Academic Year
              </span>
              {schoolYearData.isActive && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Active Year
                </span>
              )}
            </div>
          ) : null}

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
        {gradesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden border border-emerald-100 h-full flex flex-col animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-6 flex-grow">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="flex justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-100">
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : grades.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 border border-emerald-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sections Available</h3>
              <p className="text-gray-600 mb-4">No sections have been created for this school year yet.</p>
              <p className="text-sm text-gray-500">Sections will appear here once an admin adds them.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {grades.map((grade) => (
              <Link key={grade.id} href={`/school-years-junior-high/${params.schoolYearId}/departments/junior-high/${grade.id}`}>
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
                      <span>{grade.sections.length} Sections</span>
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
        )}
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
                Our Junior High School Department provides a dynamic learning environment where students are challenged to excel academically while developing essential life skills. We focus on preparing students for the rigors of senior high school through a comprehensive curriculum.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With experienced teachers and innovative teaching methods, we ensure that each student receives personalized attention and guidance to reach their full potential.
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
                    <h3 className="font-semibold text-gray-900">Advanced Curriculum</h3>
                    <p className="text-sm text-gray-600">Preparing for senior high school</p>
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Faculty</h3>
                    <p className="text-sm text-gray-600">Experienced and dedicated teachers</p>
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
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Holistic Development</h3>
                    <p className="text-sm text-gray-600">Academic and character growth</p>
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
