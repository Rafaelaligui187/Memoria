"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { StudentProfile } from "@/components/student-profile"
import Header from "@/components/header"

const grades = {
  "grade-7": {
    name: "Grade 7",
    description: "First year of junior high school, focusing on transition from elementary to secondary education.",
    tagline: "EXPLORE, ACHIEVE, EXCEL",
    sections: [
      { id: "section-a", name: "Section A", students: 35, adviser: "Ms. Jennifer Lopez" },
      { id: "section-b", name: "Section B", students: 33, adviser: "Mr. Robert Johnson" },
      { id: "section-c", name: "Section C", students: 34, adviser: "Ms. Sarah Williams" },
      { id: "section-d", name: "Section D", students: 32, adviser: "Mr. Michael Brown" },
    ],
    color: "emerald",
    stats: { totalStudents: 134, sections: 4, subjects: 12 },
  },
  "grade-8": {
    name: "Grade 8",
    description: "Second year focusing on strengthening academic foundations and developing critical thinking skills.",
    tagline: "EXPLORE, ACHIEVE, EXCEL",
    sections: [
      { id: "section-a", name: "Section A", students: 36, adviser: "Ms. Patricia Davis" },
      { id: "section-b", name: "Section B", students: 34, adviser: "Mr. James Wilson" },
      { id: "section-c", name: "Section C", students: 35, adviser: "Ms. Linda Garcia" },
      { id: "section-d", name: "Section D", students: 33, adviser: "Mr. David Martinez" },
    ],
    color: "emerald",
    stats: { totalStudents: 138, sections: 4, subjects: 12 },
  },
  "grade-9": {
    name: "Grade 9",
    description: "Third year emphasizing advanced academic skills and preparation for senior high school.",
    tagline: "EXPLORE, ACHIEVE, EXCEL",
    sections: [
      { id: "section-a", name: "Section A", students: 37, adviser: "Ms. Maria Rodriguez" },
      { id: "section-b", name: "Section B", students: 35, adviser: "Mr. John Anderson" },
      { id: "section-c", name: "Section C", students: 36, adviser: "Ms. Lisa Thompson" },
      { id: "section-d", name: "Section D", students: 34, adviser: "Mr. Mark Taylor" },
    ],
    color: "emerald",
    stats: { totalStudents: 142, sections: 4, subjects: 12 },
  },
  "grade-10": {
    name: "Grade 10",
    description: "Final year of junior high school, focusing on comprehensive preparation for senior high school.",
    tagline: "EXPLORE, ACHIEVE, EXCEL",
    sections: [
      { id: "section-a", name: "Section A", students: 38, adviser: "Ms. Susan Clark" },
      { id: "section-b", name: "Section B", students: 36, adviser: "Mr. Kevin Lewis" },
      { id: "section-c", name: "Section C", students: 37, adviser: "Ms. Nancy Walker" },
      { id: "section-d", name: "Section D", students: 35, adviser: "Mr. Paul Hall" },
    ],
    color: "emerald",
    stats: { totalStudents: 146, sections: 4, subjects: 12 },
  },
}

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

export default function JuniorHighStudentProfilePage({
  params,
}: {
  params: { schoolYearId: string; gradeId: keyof typeof grades; sectionId: string; studentId: string }
}) {
  const [profile, setProfile] = useState<ComprehensiveProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const grade = (grades as any)[params.gradeId]
  if (!grade) {
    console.error(`Grade not found: ${params.gradeId}`)
    notFound()
  }
  
  // Try to find section by exact ID first, then try with "section-" prefix
  let section = grade.sections?.find((s: any) => s.id === params.sectionId)
  if (!section) {
    section = grade.sections?.find((s: any) => s.id === `section-${params.sectionId.toLowerCase()}`)
  }
  if (!section) {
    console.error(`Section not found: ${params.sectionId} in grade ${params.gradeId}`)
    notFound()
  }

  // Fetch student profile
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[Junior High Profile] Fetching profile for studentId:", params.studentId)
        
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
        console.log("[Junior High Profile] Profile API response:", result)

        if (result.success && result.data) {
          console.log("[Junior High Profile] Profile data received:", result.data)
          setProfile(result.data)
        } else {
          console.log("[Junior High Profile] Profile API returned error:", result)
          setError(result.error || 'Failed to fetch profile data')
        }
      } catch (err) {
        console.error("[Junior High Profile] Error fetching data:", err)
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
        departmentType="junior-high"
        departmentName="Junior High Department"
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
          quote: profile.sayingMotto,
          ambition: undefined,
          hobbies: [],
          achievements: [],
          activities: [],
          bio: profile.bio,
          message: profile.message,
          galleryImages: profile.galleryImages || [],
        }}
        backLink={`/school-years-junior-high/${params.schoolYearId}/departments/junior-high/${params.gradeId}/${params.sectionId}/yearbook`}
      />
    </div>
  )
}
