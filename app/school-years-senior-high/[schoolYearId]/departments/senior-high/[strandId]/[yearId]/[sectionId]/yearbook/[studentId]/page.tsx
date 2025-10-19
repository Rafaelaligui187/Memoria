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
  bio?: string
  message?: string
  galleryImages?: string[]
  yearLevel?: string
  blockSection?: string
}

const seniorHighData = {
  stem: {
    name: "STEM",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "dr-anderson",
                name: "Dr. Michael Anderson",
                image: "/placeholder.svg",
                quote: "Science is the key to understanding the world.",
              },
            ],
            students: [
              {
                id: "shs1101",
                name: "Alex Johnson",
                image: "/placeholder.svg",
                quote: "Future engineer.",
                honors: "With High Honors",
              },
            ],
          },
        },
      },
    },
  },
  abm: {
    name: "ABM",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "ms-garcia",
                name: "Ms. Sarah Garcia",
                image: "/placeholder.svg",
                quote: "Business is about creating value.",
              },
            ],
            students: [
              {
                id: "shs1102",
                name: "Maria Santos",
                image: "/placeholder.svg",
                quote: "Future entrepreneur.",
                honors: "With Honors",
              },
            ],
          },
        },
      },
    },
  },
  humss: {
    name: "HUMSS",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "mr-cruz",
                name: "Mr. Juan Cruz",
                image: "/placeholder.svg",
                quote: "Education is the foundation of society.",
              },
            ],
            students: [
              {
                id: "shs1103",
                name: "Ana Reyes",
                image: "/placeholder.svg",
                quote: "Future teacher.",
                honors: "With High Honors",
              },
            ],
          },
        },
      },
    },
  },
  tvl: {
    name: "TVL",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "ms-lopez",
                name: "Ms. Elena Lopez",
                image: "/placeholder.svg",
                quote: "Skills are the currency of the future.",
              },
            ],
            students: [
              {
                id: "shs1104",
                name: "Carlos Martinez",
                image: "/placeholder.svg",
                quote: "Future technician.",
                honors: "With Honors",
              },
            ],
          },
        },
      },
    },
  },
  he: {
    name: "HE",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "ms-torres",
                name: "Ms. Rosa Torres",
                image: "/placeholder.svg",
                quote: "Home is where the heart is.",
              },
            ],
            students: [
              {
                id: "shs1105",
                name: "Liza Fernandez",
                image: "/placeholder.svg",
                quote: "Future chef.",
                honors: "With High Honors",
              },
            ],
          },
        },
      },
    },
  },
  ict: {
    name: "ICT",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "mr-dela-cruz",
                name: "Mr. Jose Dela Cruz",
                image: "/placeholder.svg",
                quote: "Technology is the future.",
              },
            ],
            students: [
              {
                id: "shs1106",
                name: "Mark Villanueva",
                image: "/placeholder.svg",
                quote: "Future programmer.",
                honors: "With Honors",
              },
            ],
          },
        },
      },
    },
  },
}

export default function SeniorHighStudentProfilePage({
  params,
}: {
  params: { schoolYearId: string; strandId: keyof typeof seniorHighData; yearId: string; sectionId: string; studentId: string }
}) {
  const [profile, setProfile] = useState<ComprehensiveProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Note: Senior High uses API data, not static data
  // We'll create section info from the profile data when it loads

  // Fetch student profile
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[Senior High Profile] Fetching profile for studentId:", params.studentId)
        
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
        console.log("[Senior High Profile] Profile API response:", result)

        if (result.success && result.data) {
          console.log("[Senior High Profile] Profile data received:", result.data)
          setProfile(result.data)
        } else {
          console.log("[Senior High Profile] Profile API returned error:", result)
          setError(result.error || 'Failed to fetch profile data')
        }
      } catch (err) {
        console.error("[Senior High Profile] Error fetching data:", err)
        setError(`Failed to fetch profile data: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentProfile()
  }, [params.studentId])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
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
        departmentType="senior-high"
        departmentName="Senior High Department"
        sectionInfo={{
          id: params.sectionId,
          name: `${profile.yearLevel} - ${profile.blockSection}`,
          academicYear: params.schoolYearId,
          adviser: "Adviser",
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
        backLink={`/school-years-senior-high/${params.schoolYearId}/departments/senior-high/${params.strandId}/${params.yearId}/${params.sectionId}/yearbook`}
      />
    </div>
  )
}
