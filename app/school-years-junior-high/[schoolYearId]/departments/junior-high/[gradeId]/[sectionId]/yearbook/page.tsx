"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { ClassYearbookPage } from "@/components/class-yearbook-page"
import { Person } from "@/types/yearbook"
import Header from "@/components/header"
import { useYearbookAutoRefresh } from "@/hooks/use-yearbook-auto-refresh"

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
    stats: { totalStudents: 138, sections: 4, subjects: 13 },
  },
  "grade-9": {
    name: "Grade 9",
    description: "Third year emphasizing advanced academic concepts and preparation for senior high school.",
    tagline: "EXPLORE, ACHIEVE, EXCEL",
    sections: [
      { id: "section-a", name: "Section A", students: 34, adviser: "Ms. Maria Rodriguez" },
      { id: "section-b", name: "Section B", students: 36, adviser: "Mr. Carlos Hernandez" },
      { id: "section-c", name: "Section C", students: 35, adviser: "Ms. Ana Lopez" },
    ],
    color: "emerald",
    stats: { totalStudents: 105, sections: 3, subjects: 14 },
  },
  "grade-10": {
    name: "Grade 10",
    description: "Final year of junior high school, preparing students for senior high school track selection.",
    tagline: "EXPLORE, ACHIEVE, EXCEL",
    sections: [
      { id: "section-a", name: "Section A", students: 35, adviser: "Ms. Carmen Gonzalez" },
      { id: "section-b", name: "Section B", students: 37, adviser: "Mr. Luis Perez" },
      { id: "section-c", name: "Section C", students: 34, adviser: "Ms. Rosa Sanchez" },
    ],
    color: "emerald",
    stats: { totalStudents: 106, sections: 3, subjects: 15 },
  },
}

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
}

export default function JuniorHighYearbookPage({
  params,
}: {
  params: { schoolYearId: string; gradeId: keyof typeof grades; sectionId: string }
}) {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schoolYearLabel, setSchoolYearLabel] = useState<string>("")
  const [classMotto, setClassMotto] = useState<string>("")

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
  
  console.log('Junior High Yearbook Page:', {
    gradeId: params.gradeId,
    sectionId: params.sectionId,
    schoolYearId: params.schoolYearId,
    grade: grade?.name,
    section: section?.name
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
    try {
      setLoading(true)
      setError(null)

      // Build query parameters for the API
      const queryParams = new URLSearchParams({
        department: 'Junior High',
        schoolYearId: params.schoolYearId,
        status: 'approved',
        yearLevel: grade.name,
        courseProgram: 'Junior High',
        blockSection: section.name === 'Section A' ? 'A' : section.name === 'Section B' ? 'B' : section.name
      })

      console.log("[Junior High] Fetching approved profiles with params:", queryParams.toString())

      const response = await fetch(`/api/yearbook?${queryParams.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      const result = await response.json()

      if (result.success && result.data) {
        console.log("[Junior High] Found approved profiles:", result.data.length)
        
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
        console.error("[Junior High] Failed to fetch profiles:", result.error)
        setError(result.error || 'Failed to fetch approved profiles')
      }
    } catch (err) {
      console.error("[Junior High] Error fetching approved profiles:", err)
      setError('Failed to fetch approved profiles')
    } finally {
      setLoading(false)
    }
  }

  // Fetch class motto from advisory profiles
  const fetchClassMotto = async () => {
    try {
      if (!grade || !section) return

      // Build query parameters for advisory profiles
      const queryParams = new URLSearchParams({
        department: 'Junior High',
        schoolYearId: params.schoolYearId,
        status: 'approved',
        yearLevel: grade.name,
        courseProgram: 'Junior High',
        blockSection: section.name === 'Section A' ? 'A' : section.name === 'Section B' ? 'B' : section.name
      })

      console.log("[Junior High] Fetching class motto with params:", queryParams.toString())

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
          console.log("[Junior High] Found class motto:", advisoryProfile.messageToStudents)
          setClassMotto(advisoryProfile.messageToStudents)
        } else {
          console.log("[Junior High] No class motto found for this class")
          setClassMotto("")
        }
      } else {
        console.error("[Junior High] Failed to fetch profiles for motto:", result.error)
        setClassMotto("")
      }
    } catch (err) {
      console.error("[Junior High] Error fetching class motto:", err)
      setClassMotto("")
    }
  }

  useEffect(() => {
    fetchApprovedProfiles()
  }, [params.gradeId, params.sectionId, params.schoolYearId, grade.name, section.name])

  // Fetch class motto when grade and section data is available
  useEffect(() => {
    fetchClassMotto()
  }, [grade, section, params.schoolYearId])

  // Auto-refresh when profiles are approved or created
  useYearbookAutoRefresh({
    schoolYearId: params.schoolYearId,
    department: 'Junior High',
    filters: {
      yearLevel: grade?.name,
      courseProgram: 'Junior High',
      blockSection: section?.name === 'Section A' ? 'A' : section?.name === 'Section B' ? 'B' : section?.name
    },
    onRefresh: fetchApprovedProfiles,
    enabled: !!(grade && section)
  })

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading yearbook...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
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
      departmentType="junior-high" // ✅ this automatically applies emerald/green theme
      departmentName="Junior High Department"
      sectionName={`${grade.name} - ${section.name}`}
      academicYear={schoolYearLabel || params.schoolYearId}
      people={people}
      activities={[]} // Activities can be added later if needed
      motto={classMotto}
      backLink={`/school-years-junior-high/${params.schoolYearId}/departments/junior-high/${params.gradeId}`}
      profileBasePath={`/school-years-junior-high/${params.schoolYearId}/departments/junior-high/${params.gradeId}/${params.sectionId}/yearbook`}
      yearId={params.gradeId}
      blockId={params.sectionId}
      schoolYear={schoolYearLabel || params.schoolYearId}
    />
    </div>
  )
}
