"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
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
  const [classMotto, setClassMotto] = useState<string>("")

  console.log("[College] Yearbook params:", params)

  // Fetch course data from API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        console.log('[College Yearbook] Fetching course data for:', {
          courseId: params.courseId,
          schoolYearId: params.schoolYearId,
          yearId: params.yearId,
          blockId: params.blockId
        })
        
        // Try to fetch course by ID first
        let foundCourse = null
        try {
          const courseResponse = await fetch(`/api/admin/courses?id=${params.courseId}`)
          const courseResult = await courseResponse.json()
          
          if (courseResult.success && courseResult.data) {
            foundCourse = courseResult.data
            console.log('[College Yearbook] Found course by ID:', foundCourse)
          }
        } catch (courseErr) {
          console.warn('[College Yearbook] Failed to fetch course by ID:', courseErr)
        }
        
        // If not found by ID, try to fetch all courses and find by ID
        if (!foundCourse) {
          const response = await fetch(`/api/admin/courses?department=college&schoolYearId=${params.schoolYearId}`)
          const result = await response.json()
          
          console.log('[College Yearbook] Courses API response:', result)
          
          if (result.success && result.data) {
            console.log('[College Yearbook] Available courses:', result.data.map((c: any) => ({ _id: c._id, name: c.name })))
            
            foundCourse = result.data.find((c: any) => c._id === params.courseId)
            if (foundCourse) {
              console.log('[College Yearbook] Found course in list:', foundCourse)
            }
          }
        }
        
        // Fetch block data from sections API using the blockId (ObjectId)
        let foundBlock = null
        try {
          console.log('[College Yearbook] Fetching block data for blockId:', params.blockId)
          const blockResponse = await fetch(`/api/admin/sections?id=${params.blockId}`)
          const blockResult = await blockResponse.json()
          
          if (blockResult.success && blockResult.data) {
            foundBlock = blockResult.data
            console.log('[College Yearbook] Found block by ID:', foundBlock)
          }
        } catch (blockErr) {
          console.warn('[College Yearbook] Failed to fetch block by ID:', blockErr)
        }
        
        // If not found by ID, try to fetch all sections and find by ID
        if (!foundBlock) {
          try {
            const sectionsResponse = await fetch(`/api/admin/sections?department=college&schoolYearId=${params.schoolYearId}`)
            const sectionsResult = await sectionsResponse.json()
            
            if (sectionsResult.success && sectionsResult.data) {
              foundBlock = sectionsResult.data.find((s: any) => s._id === params.blockId)
              if (foundBlock) {
                console.log('[College Yearbook] Found block in sections list:', foundBlock)
              }
            }
          } catch (sectionsErr) {
            console.warn('[College Yearbook] Failed to fetch sections:', sectionsErr)
          }
        }
        
        if (foundCourse) {
          setCourse(foundCourse)
          
          // Create year data - handle different year formats
          const yearName = params.yearId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
          const yearData = { name: yearName }
          setYear(yearData)
          
          // Use actual block data if found, otherwise create fallback
          if (foundBlock) {
            const blockData = { 
              name: foundBlock.name,
              id: foundBlock._id,
              grade: foundBlock.grade,
              courseId: foundBlock.courseId,
              courseName: foundBlock.courseName
            }
            setBlock(blockData)
            console.log('[College Yearbook] Set actual block data:', blockData)
          } else {
            // Create fallback block data
            let blockName = params.blockId
            if (params.blockId.includes('block-')) {
              const blockLetter = params.blockId.split('-')[1].toUpperCase()
              blockName = `Block ${blockLetter}`
            } else if (params.blockId.length === 1) {
              blockName = `Block ${params.blockId.toUpperCase()}`
            } else {
              // If it's an ObjectId, use a generic name
              blockName = `Block ${params.blockId.slice(-1).toUpperCase()}`
            }
            const blockData = { name: blockName, id: params.blockId }
            setBlock(blockData)
            console.log('[College Yearbook] Set fallback block data:', blockData)
          }
          
          console.log('[College Yearbook] Set data:', { course: foundCourse, year: yearData, block: foundBlock || 'fallback' })
        } else {
          console.error(`[College Yearbook] Course not found: ${params.courseId}`)
          
          // Create fallback data to prevent the page from breaking
          const fallbackCourse = {
            _id: params.courseId,
            name: params.courseId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            fullName: params.courseId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `Course: ${params.courseId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
          }
          
          const yearName = params.yearId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
          const yearData = { name: yearName }
          
          // Use actual block data if found, otherwise create fallback
          if (foundBlock) {
            const blockData = { 
              name: foundBlock.name,
              id: foundBlock._id,
              grade: foundBlock.grade,
              courseId: foundBlock.courseId,
              courseName: foundBlock.courseName
            }
            setBlock(blockData)
          } else {
            let blockName = params.blockId
            if (params.blockId.includes('block-')) {
              const blockLetter = params.blockId.split('-')[1].toUpperCase()
              blockName = `Block ${blockLetter}`
            } else if (params.blockId.length === 1) {
              blockName = `Block ${params.blockId.toUpperCase()}`
            } else {
              blockName = `Block ${params.blockId.slice(-1).toUpperCase()}`
            }
            const blockData = { name: blockName, id: params.blockId }
            setBlock(blockData)
          }
          
          console.log('[College Yearbook] Using fallback data:', { course: fallbackCourse, year: yearData, block: foundBlock || 'fallback' })
          setCourse(fallbackCourse)
          setYear(yearData)
        }
      } catch (err) {
        console.error('[College Yearbook] Error fetching course data:', err)
        
        // Create fallback data even on error
        const fallbackCourse = {
          _id: params.courseId,
          name: params.courseId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          fullName: params.courseId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `Course: ${params.courseId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
        }
        
        const yearName = params.yearId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        const yearData = { name: yearName }
        
        let blockName = params.blockId
        if (params.blockId.includes('block-')) {
          const blockLetter = params.blockId.split('-')[1].toUpperCase()
          blockName = `Block ${blockLetter}`
        } else if (params.blockId.length === 1) {
          blockName = `Block ${params.blockId.toUpperCase()}`
        } else {
          blockName = `Block ${params.blockId.slice(-1).toUpperCase()}`
        }
        const blockData = { name: blockName, id: params.blockId }
        
        console.log('[College Yearbook] Using fallback data after error:', { course: fallbackCourse, year: yearData, block: blockData })
        setCourse(fallbackCourse)
        setYear(yearData)
        setBlock(blockData)
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
        courseProgram: course.name || course.fullName || params.courseId,
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
        console.log("[College] Raw profiles data:", result.data.map(p => ({
          name: p.fullName,
          yearLevel: p.yearLevel,
          courseProgram: p.courseProgram,
          blockSection: p.blockSection,
          status: p.status,
          userType: p.userType
        })))
        
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

        console.log("[College] Transformed people:", transformedPeople.length, "profiles")
        setPeople(transformedPeople)
      } else {
        console.error("[College] Yearbook API error:", result.error)
        console.error("[College] API response:", result)
        
        // If no profiles found, show a helpful message instead of error
        if (result.data && result.data.length === 0) {
          console.log("[College] No profiles found for this class")
          setPeople([])
          setError(null) // Clear any previous errors
        } else {
          setError(result.error || 'Failed to fetch profiles')
        }
      }
    } catch (err) {
      console.error("[v0] College yearbook fetch error:", err)
      setError('Failed to fetch profiles')
    } finally {
      setLoading(false)
    }
  }

  // Fetch class motto from advisory profiles
  const fetchClassMotto = async () => {
    try {
      if (!course || !year || !block) return

      // Build query parameters for advisory profiles
      const queryParams = new URLSearchParams({
        department: 'College',
        schoolYearId: params.schoolYearId,
        status: 'approved',
        yearLevel: year.name,
        courseProgram: course.name || course.fullName || params.courseId,
        blockSection: block.name === 'Block A' ? 'A' : block.name === 'Block B' ? 'B' : block.name === 'Block C' ? 'C' : block.name === 'Block D' ? 'D' : block.name === 'Block E' ? 'E' : block.name === 'Block F' ? 'F' : block.name
      })

      console.log("[College] Fetching class motto with params:", queryParams.toString())

      const response = await fetch(`/api/yearbook?${queryParams.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      const result = await response.json()

      if (result.success && result.data) {
        // Find advisory profile for this class
        const advisoryProfile = result.data.find((profile: any) => 
          profile.isAdvisoryEntry && 
          profile.userType === 'advisory' &&
          profile.messageToStudents
        )

        if (advisoryProfile && advisoryProfile.messageToStudents) {
          console.log("[College] Found class motto:", advisoryProfile.messageToStudents)
          setClassMotto(advisoryProfile.messageToStudents)
        } else {
          console.log("[College] No class motto found for this class")
          setClassMotto("")
        }
      } else {
        console.error("[College] Failed to fetch profiles for motto:", result.error)
        setClassMotto("")
      }
    } catch (err) {
      console.error("[College] Error fetching class motto:", err)
      setClassMotto("")
    }
  }

  useEffect(() => {
    fetchApprovedProfiles()
  }, [params.courseId, params.yearId, params.blockId, params.schoolYearId, course, year, block])

  // Fetch class motto when course, year, and block data is available
  useEffect(() => {
    fetchClassMotto()
  }, [course, year, block, params.schoolYearId])

  // Auto-refresh when profiles are approved or created
  useYearbookAutoRefresh({
    schoolYearId: params.schoolYearId,
    department: 'College',
    filters: {
      yearLevel: year?.name,
      courseProgram: course?.name || course?.fullName || params.courseId,
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
        motto={classMotto}
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

