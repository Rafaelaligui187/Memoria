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
          quote: profile.sayingMotto || '',
          ambition: profile.ambition,
          hobbies: profile.hobbies ? profile.hobbies.split(',').map(h => h.trim()) : [],
          achievements: profile.achievements || [],
          activities: profile.activities || [],
          bio: profile.bio,
          message: profile.messageToStudents,
          galleryImages: [], // Could be fetched from API if needed
        }}
        backLink={`/school-years-college/${params.schoolYearId}/departments/college/${params.courseId}/${params.yearId}/${params.blockId}/yearbook`}
        courseId={params.courseId}
        yearId={params.yearId}
        blockId={params.blockId}
      />
    </div>
  )
}
