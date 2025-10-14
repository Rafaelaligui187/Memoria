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

export default function SeniorHighDepartmentPage({ params }: { params: { schoolYearId: string } }) {
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

  const [strands, setStrands] = useState<any[]>([])
  const [strandsLoading, setStrandsLoading] = useState(true)

  // Fetch strands for Senior High department
  useEffect(() => {
    const fetchStrands = async () => {
      try {
        setStrandsLoading(true)
        const response = await fetch(`/api/admin/strands?department=senior-high&schoolYearId=${params.schoolYearId}`)
        const result = await response.json()
        
        if (result.success) {
          setStrands(result.data)
        } else {
          setStrands([])
        }
      } catch (error) {
        console.error('Error fetching strands:', error)
        setStrands([])
      } finally {
        setStrandsLoading(false)
      }
    }

    if (params.schoolYearId) {
      fetchStrands()
    }
  }, [params.schoolYearId])

  // Listen for strand updates from localStorage (for real-time updates)
  useEffect(() => {
    const handleStorageChange = () => {
      if (params.schoolYearId) {
        const fetchStrands = async () => {
          try {
            const response = await fetch(`/api/admin/strands?department=senior-high&schoolYearId=${params.schoolYearId}`)
            const result = await response.json()
            
            if (result.success) {
              setStrands(result.data)
            }
          } catch (error) {
            console.error('Error fetching strands:', error)
          }
        }
        fetchStrands()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('strandUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('strandUpdated', handleStorageChange)
    }
  }, [params.schoolYearId])


  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/departments/senior-high"
            className="text-amber-600 hover:text-amber-800 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to School Years
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 to-yellow-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Senior High School Department
          </h1>
          <p className="mt-6 max-w-3xl text-xl">
            Preparing students for college and career through specialized academic tracks and holistic development.
          </p>
          
          {/* School Year Display */}
          {loading ? (
            <div className="mt-6">
              <div className="animate-pulse">
                <div className="h-6 bg-amber-200 rounded w-48"></div>
              </div>
            </div>
          ) : error ? (
            <div className="mt-6">
              <p className="text-amber-200 text-sm">{error}</p>
            </div>
          ) : schoolYearData ? (
            <div className="mt-6 flex items-center gap-4">
              <span className="text-amber-200 text-lg">
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
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-amber-800">
              Department Handbook
            </Button>
          </div>
        </div>
      </div>

      {/* Academic Strands Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <span className="bg-amber-600 w-2 h-8 mr-3 rounded"></span>
          Academic Strands
        </h2>
        {strandsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden border border-amber-100 h-full flex flex-col animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-6 flex-grow">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="mt-4 pt-4 border-t border-amber-100">
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : strands.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 border border-amber-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Strands Available</h3>
              <p className="text-gray-600 mb-4">No strands have been created for this school year yet.</p>
              <p className="text-sm text-gray-500">Strands will appear here once an admin adds them.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {strands.map((strand) => (
              <Link key={strand._id} href={`/school-years-senior-high/${params.schoolYearId}/departments/senior-high/${strand._id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 border border-amber-100 h-full flex flex-col">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=200&width=300&text=${encodeURIComponent(strand.name)}`}
                      alt={strand.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{strand.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{strand.tagline || strand.fullName}</p>
                    <div className="mt-4 pt-4 border-t border-amber-100">
                      <Button className="w-full bg-amber-600 hover:bg-amber-700">View Strand</Button>
                    </div>
                  </div>
                </div>
              </Link>
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
