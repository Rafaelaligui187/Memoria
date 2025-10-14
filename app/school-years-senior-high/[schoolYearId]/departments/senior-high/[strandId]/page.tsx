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

export default function SeniorHighStrandPage({
  params,
}: {
  params: { schoolYearId: string; strandId: string }
}) {
  const [strand, setStrand] = useState<any>(null)
  const [strandLoading, setStrandLoading] = useState(true)
  const [sections, setSections] = useState<any[]>([])
  const [sectionsLoading, setSectionsLoading] = useState(true)
  const [schoolYearData, setSchoolYearData] = useState<SchoolYear | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch strand data
  useEffect(() => {
    const fetchStrandData = async () => {
      try {
        setStrandLoading(true)
        const response = await fetch(`/api/admin/strands?department=senior-high&schoolYearId=${params.schoolYearId}`)
        const result = await response.json()
        
        if (result.success) {
          const foundStrand = result.data.find((s: any) => s._id === params.strandId)
          setStrand(foundStrand || null)
        } else {
          setStrand(null)
        }
      } catch (error) {
        console.error('Error fetching strand data:', error)
        setStrand(null)
      } finally {
        setStrandLoading(false)
      }
    }

    if (params.schoolYearId && params.strandId) {
      fetchStrandData()
    }
  }, [params.schoolYearId, params.strandId])

  // Listen for strand updates
  useEffect(() => {
    const handleStrandUpdate = () => {
      if (params.schoolYearId && params.strandId) {
        const fetchStrandData = async () => {
          try {
            const response = await fetch(`/api/admin/strands?department=senior-high&schoolYearId=${params.schoolYearId}`)
            const result = await response.json()
            
            if (result.success) {
              const foundStrand = result.data.find((s: any) => s._id === params.strandId)
              setStrand(foundStrand || null)
            }
          } catch (error) {
            console.error('Error fetching strand data:', error)
          }
        }
        fetchStrandData()
      }
    }

    window.addEventListener('strandUpdated', handleStrandUpdate)
    
    return () => {
      window.removeEventListener('strandUpdated', handleStrandUpdate)
    }
  }, [params.schoolYearId, params.strandId])

  // Fetch sections data
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setSectionsLoading(true)
        // First get the strand to get its name, then fetch sections by strand name
        const strandResponse = await fetch(`/api/admin/strands?department=senior-high&schoolYearId=${params.schoolYearId}`)
        const strandResult = await strandResponse.json()
        
        if (strandResult.success) {
          const foundStrand = strandResult.data.find((s: any) => s._id === params.strandId)
          if (foundStrand) {
            const response = await fetch(`/api/admin/sections?department=senior-high&schoolYearId=${params.schoolYearId}&strandName=${foundStrand.name}`)
            const result = await response.json()
            
            if (result.success) {
              setSections(result.data)
            } else {
              setSections([])
            }
          } else {
            setSections([])
          }
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

    if (params.schoolYearId && params.strandId) {
      fetchSections()
    }
  }, [params.schoolYearId, params.strandId])

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


  if (strandLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!strand) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Header />

      {/* Back Button */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/school-years-senior-high/${params.schoolYearId}/departments/senior-high`}
            className="text-amber-600 hover:text-amber-800 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Academic Strands
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 to-yellow-700 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">{strand.name}</h1>
          <p className="text-2xl font-light tracking-widest text-amber-100 mb-6">{strand.tagline || 'ACADEMIC EXCELLENCE'}</p>
          <p className="mt-8 max-w-3xl mx-auto text-xl text-amber-50">{strand.description || strand.fullName}</p>
          
          {/* School Year Display */}
          {loading ? (
            <div className="mt-6">
              <div className="animate-pulse">
                <div className="h-6 bg-amber-200 rounded w-48 mx-auto"></div>
              </div>
            </div>
          ) : error ? (
            <div className="mt-6">
              <p className="text-amber-200 text-sm">{error}</p>
            </div>
          ) : schoolYearData ? (
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="text-amber-200 text-2xl">
                {schoolYearData.yearLabel} Academic Year
              </span>
              {schoolYearData.isActive && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Active Year
                </span>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Year Levels & Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Year Levels & Sections</h2>
        <div className="space-y-8">
          {['Grade 11', 'Grade 12'].map((grade) => {
            const gradeSections = sections.filter(section => section.grade === grade)
            return (
              <div key={grade} className="bg-white rounded-xl shadow-sm border border-amber-100 p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{grade}</h3>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                        {sectionsLoading ? "Loading..." : `${gradeSections.length} Section${gradeSections.length > 1 ? "s" : ""} Available`}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {sectionsLoading ? (
                      <div className="animate-pulse">
                        <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
                      </div>
                    ) : gradeSections.length > 0 ? (
                      gradeSections.map((section, i) => {
                        // Convert grade to proper yearId format
                        const yearId = grade.toLowerCase().replace(' ', '-')
                        // Convert section name to proper sectionId format (section-X)
                        const sectionId = `section-${i + 1}`
                        
                        return (
                          <Link key={section._id} href={`/school-years-senior-high/${params.schoolYearId}/departments/senior-high/${params.strandId}/${yearId}/${sectionId}`}>
                            <div className="bg-gradient-to-r from-amber-600 to-yellow-700 hover:from-amber-700 hover:to-yellow-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
                              {strand ? `${strand.name} ${section.name}` : section.name}
                            </div>
                          </Link>
                        )
                      })
                    ) : (
                      <div className="text-gray-500 text-sm">No sections available</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
