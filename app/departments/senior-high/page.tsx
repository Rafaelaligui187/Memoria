"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, Loader2, GraduationCap } from "lucide-react"

interface SchoolYear {
  _id: string
  yearLabel: string
  startYear: number
  endYear: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function SeniorHighDepartmentPage() {
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch school years from API
  useEffect(() => {
    const fetchSchoolYears = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/school-years', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch school years: ${response.status}`)
        }

        const result = await response.json()
        
        if (result.success && result.data) {
          setSchoolYears(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch school years')
        }
      } catch (err) {
        console.error('Error fetching school years:', err)
        setError(`Failed to load school years: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchSchoolYears()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 to-yellow-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-2">
            Senior High Department
          </h1>
          <p className="text-2xl font-light tracking-widest text-amber-200 mb-6">
            PREPARE, EXCEL, SUCCEED
          </p>
        </div>
      </div>

      {/* School Years Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Available School Years
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
            <span className="ml-2 text-gray-600">Loading school years...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : schoolYears.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No school years available yet.</p>
            <p className="text-gray-500 text-sm mt-2">School years will appear here once an admin adds them.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {schoolYears.map((year) => (
              <div
                key={year._id}
                className="bg-white rounded-xl shadow-sm border border-amber-100 p-8 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {year.yearLabel}
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <span>Senior High Yearbook Records</span>
                    {year.isActive && (
                      <span className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/school-years-senior-high/${year._id}/departments/senior-high`}
                  className="bg-gradient-to-r from-amber-600 to-yellow-700 hover:from-amber-700 hover:to-yellow-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  View Yearbook
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-amber-600 w-2 h-8 mr-3 rounded"></span>
                About Our Senior High School Department
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our Senior High School Department offers specialized academic tracks designed to prepare students for
                college and career. Through a comprehensive curriculum and hands-on learning experiences, we help
                students discover their passions and develop the skills they need to succeed in their chosen fields.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With dedicated teachers and industry partnerships, we ensure that our students receive quality education
                and real-world exposure that will give them a competitive edge in college and beyond.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Industry Partnerships</h3>
                    <p className="text-sm text-gray-600">Connections with leading companies</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-amber-600"
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
                    <h3 className="font-semibold text-gray-900">Specialized Curriculum</h3>
                    <p className="text-sm text-gray-600">Tailored to each academic track</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-amber-600"
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
                    <h3 className="font-semibold text-gray-900">College Preparation</h3>
                    <p className="text-sm text-gray-600">Guidance for college applications and career planning</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <img
                src="/placeholder.svg?height=400&width=600&text=Senior+High+Students"
                alt="Senior High Students"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
