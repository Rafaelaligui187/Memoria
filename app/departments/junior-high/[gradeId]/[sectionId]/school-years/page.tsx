"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Loader2 } from "lucide-react"

interface SchoolYear {
  _id: string
  yearLabel: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function JuniorHighSchoolYearsPage({
  params,
}: {
  params: { gradeId: string; sectionId: string }
}) {
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    "section-e": "Section E",
    "section-f": "Section F",
  }

  const gradeName = gradeNames[params.gradeId] || "Grade"
  const sectionName = sectionNames[params.sectionId] || "Section"

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
        
        const result = await response.json()
        
        if (result.success && result.data) {
          setSchoolYears(result.data)
        } else {
          setError(result.error || 'Failed to fetch school years')
        }
      } catch (err) {
        console.error('Error fetching school years:', err)
        setError('Failed to fetch school years')
      } finally {
        setLoading(false)
      }
    }

    fetchSchoolYears()
  }, [])

  // Listen for school year updates (when admin adds new ones)
  useEffect(() => {
    const handleSchoolYearUpdate = () => {
      // Refetch school years when admin adds new ones
      const fetchSchoolYears = async () => {
        try {
          const response = await fetch('/api/school-years', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          })
          
          const result = await response.json()
          
          if (result.success && result.data) {
            setSchoolYears(result.data)
          }
        } catch (err) {
          console.error('Error refetching school years:', err)
        }
      }

      fetchSchoolYears()
    }

    // Listen for custom events when school years are updated
    window.addEventListener('schoolYearUpdated', handleSchoolYearUpdate)
    
    return () => {
      window.removeEventListener('schoolYearUpdated', handleSchoolYearUpdate)
    }
  }, [])

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

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-gray-600">Loading school years...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
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
                className="bg-white rounded-xl shadow-sm border border-emerald-100 p-8 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{year.yearLabel}</h3>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Yearbook Records</span>
                    {year.isActive && (
                      <span className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/school-years-junior-high/${year._id}/departments/junior-high/${params.gradeId}/${params.sectionId}/yearbook`}
                  className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
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
