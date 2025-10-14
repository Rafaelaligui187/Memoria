"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, Loader2, GraduationCap } from "lucide-react"
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

export default function SchoolYearsJuniorHighPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-2">
            Junior High Department
          </h1>
          <p className="text-2xl font-light tracking-widest text-green-200 mb-6">
            EXPLORE, LEARN, ACHIEVE
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
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading school years...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
                className="bg-white rounded-xl shadow-sm border border-green-100 p-8 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {year.yearLabel}
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <span>Junior High Yearbook Records</span>
                    {year.isActive && (
                      <span className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/school-years-junior-high/${year._id}/departments/junior-high`}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  View Yearbook
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-600 w-2 h-8 mr-3 rounded"></span>
                About Our Junior High School Department
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our Junior High School Department provides a comprehensive educational experience that bridges elementary
                and senior high school. We focus on developing critical thinking skills, fostering independence, and
                preparing students for the challenges of senior high school.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Through innovative teaching methods and a supportive environment, we help students discover their
                interests and develop the academic foundation they need for future success.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Critical Thinking</h3>
                    <p className="text-sm text-gray-600">Developing analytical and problem-solving skills</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
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
                    <h3 className="font-semibold text-gray-900">Academic Foundation</h3>
                    <p className="text-sm text-gray-600">Building strong fundamentals for future learning</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100 flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
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
                    <h3 className="font-semibold text-gray-900">Social Development</h3>
                    <p className="text-sm text-gray-600">Building relationships and communication skills</p>
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
