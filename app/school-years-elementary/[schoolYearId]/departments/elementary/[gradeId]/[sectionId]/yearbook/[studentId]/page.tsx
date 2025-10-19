"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { StudentProfile } from "@/components/student-profile"
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
  blockSection: string
  schoolYearId: string
  status: string
  officerRole?: string
  bio?: string
  message?: string
  galleryImages?: string[]
}

export default function ElementaryStudentProfilePage({
  params,
}: {
  params: { schoolYearId: string; gradeId: string; sectionId: string; studentId: string }
}) {
  const [profile, setProfile] = useState<ComprehensiveProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log("[Elementary Profile] Student profile params:", params)

  // Fetch comprehensive profile data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[Elementary Profile] Fetching profile for studentId:", params.studentId)
        
        // Fetch profile data
        const profileResponse = await fetch(`/api/yearbook/profile/${params.studentId}`)
        
        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch profile data: ${profileResponse.status}`)
        }

        const profileResult = await profileResponse.json()
        console.log("[Elementary Profile] Profile API response:", profileResult)

        if (profileResult.success && profileResult.data) {
          console.log("[Elementary Profile] Profile data received:", profileResult.data)
          setProfile(profileResult.data)
        } else {
          console.log("[Elementary Profile] Profile API returned error:", profileResult)
          setError(profileResult.error || 'Failed to fetch profile data')
        }
      } catch (err) {
        console.error("[Elementary Profile] Error fetching data:", err)
        setError(`Failed to fetch profile data: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.studentId])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
      <StudentProfile
        departmentType="elementary"
        departmentName="Elementary Department"
        sectionInfo={{ 
          id: params.sectionId, 
          name: `${profile.yearLevel} - ${profile.blockSection}`, 
          academicYear: params.schoolYearId, 
          adviser: "Adviser" 
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
          quote: profile.sayingMotto,
          ambition: profile.ambition,
          hobbies: profile.hobbies ? profile.hobbies.split(',').map(h => h.trim()) : [],
          achievements: profile.achievements || [],
          activities: profile.activities || [],
          bio: profile.bio,
          message: profile.message,
          galleryImages: profile.galleryImages || [],
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
        backLink={`/school-years-elementary/${params.schoolYearId}/departments/elementary/${params.gradeId}/${params.sectionId}/yearbook`}
      />
    </div>
  )
}
