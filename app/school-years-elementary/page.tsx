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

export default function SchoolYearsPage() {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-2">
            Elementary Department
          </h1>
          <p className="text-2xl font-light tracking-widest text-blue-200 mb-6">
            LEARN, GROW, DISCOVER
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
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading school years...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                className="bg-white rounded-xl shadow-sm border border-blue-100 p-8 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {year.yearLabel}
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <span>Elementary Yearbook Records</span>
                    {year.isActive && (
                      <span className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/school-years-elementary/${year._id}/departments/elementary`}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  View Yearbook
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
