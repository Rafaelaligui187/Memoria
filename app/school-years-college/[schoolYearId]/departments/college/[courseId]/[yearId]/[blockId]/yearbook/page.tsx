"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { ClassYearbookPage } from "@/components/class-yearbook-page"
import type { Person } from "@/types/yearbook"
import { collegeData, type CourseId, type YearId, type BlockId } from "@/lib/college-data"
import { useYearbookAutoRefresh } from "@/hooks/use-yearbook-auto-refresh"
import Header from "@/components/header"

interface ApprovedProfile {
  _id: string
  fullName: string
  nickname?: string
  profilePicture?: string
  sayingMotto?: string
  honors?: string
  userType: string
  department: string
  yearLevel: string
  courseProgram: string
  blockSection: string
  schoolYearId: string
  status: string
  officerRole?: string
  
  // Comprehensive profile fields for StudentProfile
  age?: number
  gender?: string
  birthday?: string
  address?: string
  email?: string
  phone?: string
  fatherGuardianName?: string
  motherGuardianName?: string
  graduationYear?: string
  dreamJob?: string
  messageToStudents?: string
  socialMediaFacebook?: string
  socialMediaInstagram?: string
  socialMediaTwitter?: string
  socialMediaLinkedin?: string
  achievements?: string[]
  activities?: string[]
  ambition?: string
  hobbies?: string
  bio?: string
  legacy?: string
  contribution?: string
  advice?: string
  work?: string
  company?: string
  location?: string
}

export default function CollegeYearbookPage({
  params,
}: {
  params: { schoolYearId: string; courseId: string; yearId: string; blockId: string }
}) {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schoolYearLabel, setSchoolYearLabel] = useState<string>("")
  const [course, setCourse] = useState<any>(null)
  const [year, setYear] = useState<any>(null)
  const [block, setBlock] = useState<any>(null)

  console.log("[College] Yearbook params:", params)

  // Fetch course data from API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/admin/courses?department=college&schoolYearId=${params.schoolYearId}`)
        const result = await response.json()
        
        if (result.success) {
          const foundCourse = result.data.find((c: any) => c._id === params.courseId)
          if (foundCourse) {
            setCourse(foundCourse)
            
            // Create year data
            const yearData = { name: params.yearId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) }
            setYear(yearData)
            
            // Create block data
            const blockLetter = params.blockId.split('-')[1].toUpperCase()
            const blockData = { name: `Block ${blockLetter}` }
            setBlock(blockData)
          } else {
            console.error(`Course not found: ${params.courseId}`)
            notFound()
          }
        } else {
          console.error('Failed to fetch course data')
          notFound()
        }
      } catch (err) {
        console.error('Error fetching course data:', err)
        notFound()
      }
    }

    fetchCourseData()
  }, [params.courseId, params.schoolYearId, params.yearId, params.blockId])

  console.log("[College] Yearbook mapping:", {
    courseId: params.courseId,
    yearId: params.yearId,
    blockId: params.blockId,
    schoolYearId: params.schoolYearId,
    course: course?.name,
    year: year?.name,
    block: block?.name
  })

  // Fetch school year label
  useEffect(() => {
    const fetchSchoolYearLabel = async () => {
      try {
        const response = await fetch(`/api/school-years/${params.schoolYearId}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })
        
        const result = await response.json()
        
        if (result.success && result.data) {
          setSchoolYearLabel(result.data.yearLabel || params.schoolYearId)
        } else {
          // Fallback to the ID if API fails
          setSchoolYearLabel(params.schoolYearId)
        }
      } catch (err) {
        console.error('Error fetching school year label:', err)
        // Fallback to the ID if API fails
        setSchoolYearLabel(params.schoolYearId)
      }
    }

    fetchSchoolYearLabel()
  }, [params.schoolYearId])

  // Fetch approved profiles from API
  const fetchApprovedProfiles = async () => {
    // Don't fetch if course, year, or block data is not loaded yet
    if (!course || !year || !block) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Build query parameters for the API
      const queryParams = new URLSearchParams({
        department: 'College',
        schoolYearId: params.schoolYearId,
        status: 'approved',
        yearLevel: year.name,
        courseProgram: course.name,
        blockSection: block.name === 'Block A' ? 'A' : block.name === 'Block B' ? 'B' : block.name === 'Block C' ? 'C' : block.name === 'Block D' ? 'D' : block.name === 'Block E' ? 'E' : block.name === 'Block F' ? 'F' : block.name
      })

      console.log("[College] Yearbook API query:", queryParams.toString())

      const response = await fetch(`/api/yearbook?${queryParams}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      const result = await response.json()

      if (result.success && result.data) {
        console.log("[College] Yearbook API response:", result.data.length, "profiles")
        
        // Transform approved profiles to Person format
        const transformedPeople: Person[] = result.data.map((profile: ApprovedProfile) => ({
          id: profile._id,
          name: profile.fullName,
          nickname: profile.nickname,
          image: profile.profilePicture || '/placeholder.svg',
          quote: profile.sayingMotto || '',
          honors: profile.honors,
          role: profile.userType === 'student' ? 'student' as const : 'faculty' as const,
          department: profile.department,
          position: profile.userType === 'faculty' ? 'Adviser' : undefined,
          yearsOfService: profile.userType === 'faculty' ? 1 : undefined,
          officerRole: profile.userType === 'student' ? profile.officerRole : undefined,
        }))

        setPeople(transformedPeople)
      } else {
        console.error("[v0] College yearbook API error:", result.error)
        setError(result.error || 'Failed to fetch profiles')
      }
    } catch (err) {
      console.error("[v0] College yearbook fetch error:", err)
      setError('Failed to fetch profiles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovedProfiles()
  }, [params.courseId, params.yearId, params.blockId, params.schoolYearId, course, year, block])

  // Auto-refresh when profiles are approved or created
  useYearbookAutoRefresh({
    schoolYearId: params.schoolYearId,
    department: 'College',
    filters: {
      yearLevel: year?.name,
      courseProgram: course?.name,
      blockSection: block?.name === 'Block A' ? 'A' : block?.name === 'Block B' ? 'B' : block?.name === 'Block C' ? 'C' : block?.name === 'Block D' ? 'D' : block?.name === 'Block E' ? 'E' : block?.name === 'Block F' ? 'F' : block?.name
    },
    onRefresh: fetchApprovedProfiles,
    enabled: !!(course && year && block)
  })

  // Show loading state
  if (loading || !course || !year || !block) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading yearbook...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <ClassYearbookPage
        departmentType="college"
        departmentName={course.name}
        sectionName={`${course.name} ${year.name} - ${block.name}`}
        academicYear={schoolYearLabel || params.schoolYearId}
        people={people}
        activities={[]} // Activities can be added later if needed
        backLink={`/school-years-college/${params.schoolYearId}/departments/college/${params.courseId}`}
        profileBasePath={`/school-years-college/${params.schoolYearId}/departments/college/${params.courseId}/${params.yearId}/${params.blockId}/yearbook`}
        courseId={params.courseId}
        yearId={params.yearId}
        blockId={params.blockId}
        schoolYear={schoolYearLabel || params.schoolYearId}
      />
    </div>
  )
}
