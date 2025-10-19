"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { StudentProfile } from "@/components/student-profile"
import { collegeData, type CourseId, type YearId, type BlockId } from "@/lib/college-data"
import Header from "@/components/header"

interface ComprehensiveProfile {
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
  major?: string
  blockSection: string
  schoolYearId: string
  status: string
  officerRole?: string
  
  // Comprehensive profile fields
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

export default function CollegeStudentProfilePage({
  params,
}: {
  params: { schoolYearId: string; courseId: CourseId; yearId: YearId; blockId: BlockId; studentId: string }
}) {
  const [profile, setProfile] = useState<ComprehensiveProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [course, setCourse] = useState<any>(null)
  const [year, setYear] = useState<any>(null)
  const [block, setBlock] = useState<any>(null)

  // Fetch course data from API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        console.log('[College Student Profile] Fetching course data for:', {
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
            console.log('[College Student Profile] Found course by ID:', foundCourse)
          }
        } catch (courseErr) {
          console.warn('[College Student Profile] Failed to fetch course by ID:', courseErr)
        }
        
        // If not found by ID, try to fetch all courses and find by ID
        if (!foundCourse) {
          const response = await fetch(`/api/admin/courses?department=college&schoolYearId=${params.schoolYearId}`)
          const result = await response.json()
          
          console.log('[College Student Profile] Courses API response:', result)
          
          if (result.success && result.data) {
            console.log('[College Student Profile] Available courses:', result.data.map((c: any) => ({ _id: c._id, name: c.name })))
            
            foundCourse = result.data.find((c: any) => c._id === params.courseId)
            if (foundCourse) {
              console.log('[College Student Profile] Found course in list:', foundCourse)
            }
          }
        }
        
        // Fetch block data from sections API using the blockId (ObjectId)
        let foundBlock = null
        try {
          console.log('[College Student Profile] Fetching block data for blockId:', params.blockId)
          const blockResponse = await fetch(`/api/admin/sections?id=${params.blockId}`)
          const blockResult = await blockResponse.json()
          
          if (blockResult.success && blockResult.data) {
            foundBlock = blockResult.data
            console.log('[College Student Profile] Found block by ID:', foundBlock)
          }
        } catch (blockErr) {
          console.warn('[College Student Profile] Failed to fetch block by ID:', blockErr)
        }
        
        // If not found by ID, try to fetch all sections and find by ID
        if (!foundBlock) {
          try {
            const sectionsResponse = await fetch(`/api/admin/sections?department=college&schoolYearId=${params.schoolYearId}`)
            const sectionsResult = await sectionsResponse.json()
            
            if (sectionsResult.success && sectionsResult.data) {
              foundBlock = sectionsResult.data.find((s: any) => s._id === params.blockId)
              if (foundBlock) {
                console.log('[College Student Profile] Found block in sections list:', foundBlock)
              }
            }
          } catch (sectionsErr) {
            console.warn('[College Student Profile] Failed to fetch sections:', sectionsErr)
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
            console.log('[College Student Profile] Set actual block data:', blockData)
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
            console.log('[College Student Profile] Set fallback block data:', blockData)
          }
          
          console.log('[College Student Profile] Set data:', { course: foundCourse, year: yearData, block: foundBlock || 'fallback' })
        } else {
          console.error(`[College Student Profile] Course not found: ${params.courseId}`)
          
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
          
          console.log('[College Student Profile] Using fallback data:', { course: fallbackCourse, year: yearData, block: foundBlock || 'fallback' })
          setCourse(fallbackCourse)
          setYear(yearData)
        }
      } catch (err) {
        console.error('[College Student Profile] Error fetching course data:', err)
        
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
        
        console.log('[College Student Profile] Using fallback data after error:', { course: fallbackCourse, year: yearData, block: blockData })
        setCourse(fallbackCourse)
        setYear(yearData)
        setBlock(blockData)
      }
    }

    fetchCourseData()
  }, [params.courseId, params.schoolYearId, params.yearId, params.blockId])

  // Fetch student profile
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[College Profile] Fetching profile for studentId:", params.studentId)
        
        const response = await fetch(`/api/yearbook/profile/${params.studentId}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch profile data: ${response.status}`)
        }

        const result = await response.json()
        console.log("[College Profile] Profile API response:", result)

        if (result.success && result.data) {
          console.log("[College Profile] Profile data received:", result.data)
          setProfile(result.data)
        } else {
          console.log("[College Profile] Profile API returned error:", result)
          setError(result.error || 'Failed to fetch profile data')
        }
      } catch (err) {
        console.error("[College Profile] Error fetching data:", err)
        setError(`Failed to fetch profile data: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    // Only fetch profile if we have course data
    if (course) {
      fetchStudentProfile()
    }
  }, [params.studentId, course])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student profile...</p>
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

  // Show not found state
  if (!profile) {
    notFound()
  }

  return (
    <div>
      <Header />
      <StudentProfile
        departmentType="college"
        departmentName={course?.fullName || course?.name || 'College Department'}
        sectionInfo={{
          id: params.blockId,
          name: `${course?.name || 'Course'} ${year?.name || params.yearId} - ${block?.name || params.blockId}`,
          academicYear: params.schoolYearId,
          adviser: "", // Could be fetched from API if needed
        }}
        student={{
          id: profile._id,
          name: profile.fullName,
          photoUrl: profile.profilePicture || '/placeholder.svg',
          nickname: profile.nickname,
          age: profile.age,
          birthday: profile.birthday,
          address: profile.address,
          mottoSaying: profile.sayingMotto,
          dreamJob: profile.dreamJob,
          fatherGuardianName: profile.fatherGuardianName,
          motherGuardianName: profile.motherGuardianName,
          facebook: profile.socialMediaFacebook,
          instagram: profile.socialMediaInstagram,
          twitter: profile.socialMediaTwitter,
          quote: profile.sayingMotto || '',
          ambition: profile.ambition,
          hobbies: profile.hobbies ? profile.hobbies.split(',').map(h => h.trim()) : [],
          achievements: profile.achievements || [],
          activities: profile.activities || [],
          bio: profile.bio,
          message: profile.messageToStudents,
          galleryImages: [], // Could be fetched from API if needed
          course: profile.courseProgram,
          yearLevel: profile.yearLevel,
          sectionBlock: profile.blockSection,
          honors: profile.honors,
          officerRole: profile.officerRole,
          email: profile.email,
          phone: profile.phone,
          socialMediaFacebook: profile.socialMediaFacebook,
          socialMediaInstagram: profile.socialMediaInstagram,
          socialMediaTwitter: profile.socialMediaTwitter,
          sayingMotto: profile.sayingMotto,
          department: profile.department,
          courseProgram: profile.courseProgram,
          blockSection: profile.blockSection,
          profilePictureUrl: profile.profilePicture,
          major: profile.major,
        }}
        backLink={`/school-years-college/${params.schoolYearId}/departments/college/${params.courseId}/${params.yearId}/${params.blockId}/yearbook`}
        courseId={params.courseId}
        yearId={params.yearId}
        blockId={params.blockId}
      />
    </div>
  )
}
