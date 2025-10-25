"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import Header from "@/components/header"

interface SchoolYear {
  _id: string
  yearLabel: string
  startYear: number
  endYear: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function CoursePage({
  params,
}: {
  params: { schoolYearId: string; courseId: string }
}) {
  const { courseId } = params
  const [schoolYearData, setSchoolYearData] = useState<SchoolYear | null>(null)
  const [courseData, setCourseData] = useState<any>(null)
  const [yearLevels, setYearLevels] = useState<any[]>([])
  const [majors, setMajors] = useState<any[]>([])
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)

  // Fetch school year data
  useEffect(() => {
    const fetchSchoolYearData = async () => {
      try {
        // Don't set loading to true here to prevent flickering
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
      }
    }

    fetchSchoolYearData()
  }, [params.schoolYearId])

  // Auto-select first major when majors are loaded
  useEffect(() => {
    if (majors.length > 0 && !selectedMajor) {
      setSelectedMajor(majors[0].name)
      console.log('Auto-selected first major on majors load:', majors[0].name)
    }
  }, [majors, selectedMajor])

  // Optimized data fetching with proper loading states
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        console.log('🔍 [College Course] Starting data fetch for courseId:', courseId)
        setLoading(true)
        setError(null)
        
        // Create fallback course data based on courseId
        const fallbackCourseData = {
          _id: courseId,
          name: courseId.toUpperCase().replace('-', ' '),
          tagline: `${courseId.toUpperCase().replace('-', ' ')} Program`,
          description: `The ${courseId.toUpperCase().replace('-', ' ')} program provides comprehensive education and training in this field.`
        }
        
        // Set fallback data immediately to prevent flickering
        setCourseData(fallbackCourseData)
        
        // Don't set predefined year levels - let API data load first
        // This prevents showing hardcoded blocks before real data
        
        // Make lightweight parallel API calls for better performance
        const [courseResponse, structureResponse] = await Promise.allSettled([
          fetch(`/api/admin/courses?id=${courseId}`),
          fetch(`/api/admin/college/structure?schoolYearId=${params.schoolYearId}&courseId=${courseId}`)
        ])
        
        // Process course data
        if (courseResponse.status === 'fulfilled') {
          try {
            const courseResult = await courseResponse.value.json()
            if (courseResult.success && courseResult.data) {
              setCourseData(courseResult.data)
              console.log('✅ [College Course] Course data loaded from API')
            }
          } catch (courseErr) {
            console.warn('❌ [College Course] Course API failed, using fallback data')
          }
        }
        
        // Process structure data
        if (structureResponse.status === 'fulfilled') {
          try {
            const structureResult = await structureResponse.value.json()
            
            if (structureResult.success && structureResult.data) {
              const course = structureResult.data
              if (course) {
                // Set majors if the course has them
                if (course.majors && course.majors.length > 0) {
                  setMajors(course.majors)
                  setSelectedMajor(course.majors[0].name)
                  console.log('✅ Majors loaded from structure')
                }
                
                // Set year levels with actual data from API
                if (course.majorType === 'has-major' && course.majors && course.majors.length > 0) {
                  const allYearLevels: any[] = []
                  course.majors.forEach((major: any) => {
                    major.yearLevels.forEach((yearLevel: any) => {
                      allYearLevels.push({
                        ...yearLevel,
                        majorName: major.name
                      })
                    })
                  })
                  setYearLevels(allYearLevels)
                  console.log('✅ Year levels loaded from majors')
                } else if (course.yearLevels) {
                  setYearLevels(course.yearLevels)
                  console.log('✅ Year levels loaded from structure')
                }
              }
            }
          } catch (structureErr) {
            console.warn('❌ Structure API failed, will show loading state')
          }
        }
        
      } catch (err) {
        console.error('Error in fetchCourseData:', err)
        setError(`Failed to load course: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        console.log('✅ [College Course] Data loading completed')
        setLoading(false)
        setDataLoaded(true)
      }
    }

    if (params.schoolYearId && courseId) {
      fetchCourseData()
    }
  }, [params.schoolYearId, courseId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      
      {/* Header with Back Button */}
      <div className="bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href={`/school-years-college/${params.schoolYearId}/departments/college`}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
            {!dataLoaded ? (
              <div className="animate-pulse">
                <div className="h-16 bg-purple-200 rounded w-64 mx-auto"></div>
              </div>
            ) : courseData?.name || 'Course Not Found'}
          </h1>
          <div className="text-2xl font-light tracking-widest text-purple-200">
            {!dataLoaded ? (
              <div className="animate-pulse">
                <div className="h-8 bg-purple-200 rounded w-48 mx-auto"></div>
              </div>
            ) : courseData?.tagline || ''}
          </div>
          <div className="mt-8 max-w-3xl mx-auto text-xl text-purple-100">
            {!dataLoaded ? (
              <div className="animate-pulse">
                <div className="h-6 bg-purple-200 rounded w-full mx-auto"></div>
                <div className="h-6 bg-purple-200 rounded w-3/4 mx-auto mt-2"></div>
              </div>
            ) : courseData?.description || ''}
          </div>
          
          {/* School Year Display */}
          {!dataLoaded ? (
            <div className="mt-6">
              <div className="animate-pulse">
                <div className="h-6 bg-purple-200 rounded w-48 mx-auto"></div>
              </div>
            </div>
          ) : error ? (
            <div className="mt-6">
              <p className="text-purple-200 text-sm">{error}</p>
            </div>
          ) : schoolYearData ? (
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="text-purple-200 text-2xl">
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

      {/* Majors Section (if course has majors) */}
      {majors.length > 0 && (
        <div className="bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Available Majors</h2>
              <p className="text-gray-600 mt-2">Choose your specialization within {courseData?.name || 'this course'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {majors.map((major) => (
                <div 
                  key={major.id} 
                  className={`bg-white rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                    selectedMajor === major.name 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-purple-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedMajor(selectedMajor === major.name ? null : major.name)}
                >
                  <div className="text-center">
                    <h3 className={`text-xl font-semibold mb-3 ${
                      selectedMajor === major.name ? 'text-purple-900' : 'text-gray-900'
                    }`}>
                      {major.name}
                    </h3>
                    <div className={`flex items-center justify-center ${
                      selectedMajor === major.name ? 'text-purple-700' : 'text-gray-600'
                    }`}>
                      <Users className="h-4 w-4 mr-2" />
                      <span className="font-medium">
                        {major.yearLevels.length} Year Level{major.yearLevels.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Year Levels Section */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedMajor ? `${selectedMajor} - Year Levels & Blocks` : 'Year Levels & Blocks'}
            </h2>
            {majors.length > 0 && (
              <p className="text-gray-600 mt-2">
                {selectedMajor 
                  ? `Showing year levels and blocks for ${selectedMajor} major` 
                  : 'Select a major above to view specific year levels and blocks'
                }
              </p>
            )}
          </div>

          <div className="space-y-8">
            {(() => {
              // Get year levels dynamically from the data
              const filteredYearLevels = selectedMajor 
                ? yearLevels.filter(year => year.majorName === selectedMajor)
                : yearLevels
              
              // Get unique year levels from the filtered data
              const uniqueYearLevels = [...new Set(filteredYearLevels.map(year => year.level))]
                .sort((a, b) => {
                  // Sort year levels in order
                  const order = ['1st Year', '2nd Year', '3rd Year', '4th Year']
                  return order.indexOf(a) - order.indexOf(b)
                })
              
              return uniqueYearLevels.map((yearLevel) => {
                const yearData = filteredYearLevels.find(year => year.level === yearLevel)
              return (
                <div key={yearLevel} className="bg-white rounded-xl shadow-sm border border-purple-100 p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-6 md:mb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-semibold text-gray-900">{yearLevel}</h3>
                        {yearData?.majorName && (
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                            {yearData.majorName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>
                          {loading ? "Loading..." : yearData ? `${yearData.blocks.length} Block${yearData.blocks.length > 1 ? "s" : ""} Available` : "No blocks available"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {loading ? (
                        <div className="animate-pulse">
                          <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
                        </div>
                      ) : yearData && yearData.blocks.length > 0 ? (
                        yearData.blocks.map((block) => (
                          <Link key={block.id} href={`/school-years-college/${params.schoolYearId}/departments/college/${courseId}/${yearData.id}/${block.id}`}>
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 text-sm">
                              {block.name}
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-gray-500 text-sm">No blocks available</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
            })()}
          </div>
        </div>
      </div>
    </div>
  )
}
