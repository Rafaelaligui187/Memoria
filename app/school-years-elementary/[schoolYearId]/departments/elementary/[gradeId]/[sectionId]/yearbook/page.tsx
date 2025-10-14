"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { ClassYearbookPage } from "@/components/class-yearbook-page"
import { Person } from "@/types/yearbook"
import Header from "@/components/header"
import { useYearbookAutoRefresh } from "@/hooks/use-yearbook-auto-refresh"

const grades = {
  grade1: {
    name: "Grade 1",
    description: "Foundation year focusing on basic literacy, numeracy, and social skills development.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 30, adviser: "Ms. Maria Santos" },
      { id: "section-b", name: "Section B", students: 28, adviser: "Ms. Ana Cruz" },
      { id: "section-c", name: "Section C", students: 32, adviser: "Ms. Rosa Garcia" },
    ],
    stats: { totalStudents: 90, sections: 3, subjects: 8 },
  },
  grade2: {
    name: "Grade 2",
    description: "Building upon foundational skills with enhanced reading, writing, and mathematical concepts.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 29, adviser: "Ms. Carmen Lopez" },
      { id: "section-b", name: "Section B", students: 31, adviser: "Ms. Elena Rodriguez" },
      { id: "section-c", name: "Section C", students: 28, adviser: "Ms. Sofia Martinez" },
    ],
    stats: { totalStudents: 88, sections: 3, subjects: 8 },
  },
  grade3: {
    name: "Grade 3",
    description: "Expanding knowledge base with more complex subjects and critical thinking skills.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 30, adviser: "Ms. Patricia Reyes" },
      { id: "section-b", name: "Section B", students: 29, adviser: "Ms. Isabel Torres" },
      { id: "section-c", name: "Section C", students: 31, adviser: "Ms. Lucia Fernandez" },
    ],
    stats: { totalStudents: 90, sections: 3, subjects: 9 },
  },
  grade4: {
    name: "Grade 4",
    description: "Developing advanced skills in all subject areas with increased independence.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 28, adviser: "Ms. Beatriz Morales" },
      { id: "section-b", name: "Section B", students: 30, adviser: "Ms. Consuelo Herrera" },
      { id: "section-c", name: "Section C", students: 29, adviser: "Ms. Dolores Jimenez" },
    ],
    stats: { totalStudents: 87, sections: 3, subjects: 9 },
  },
  grade5: {
    name: "Grade 5",
    description: "Preparing for middle school with advanced curriculum and leadership opportunities.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 31, adviser: "Ms. Esperanza Ruiz" },
      { id: "section-b", name: "Section B", students: 29, adviser: "Ms. Felicidad Castro" },
      { id: "section-c", name: "Section C", students: 30, adviser: "Ms. Gloria Ortega" },
    ],
    stats: { totalStudents: 90, sections: 3, subjects: 10 },
  },
  grade6: {
    name: "Grade 6",
    description: "Final year of elementary with comprehensive preparation for junior high school.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 30, adviser: "Ms. Herminia Vargas" },
      { id: "section-b", name: "Section B", students: 28, adviser: "Ms. Ines Mendoza" },
      { id: "section-c", name: "Section C", students: 32, adviser: "Ms. Josefina Paredes" },
    ],
    stats: { totalStudents: 90, sections: 3, subjects: 10 },
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

export default function ElementaryYearbookPage({
  params,
}: {
  params: { schoolYearId: string; gradeId: string; sectionId: string }
}) {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schoolYearLabel, setSchoolYearLabel] = useState<string>("")

  // Normalize gradeId (convert "grade-1" to "grade1")
  const normalizedGradeId = params.gradeId.replace('grade-', 'grade')
  const grade = (grades as any)[normalizedGradeId]
  if (!grade) {
    console.error(`Grade not found: ${normalizedGradeId} (original: ${params.gradeId})`)
    notFound()
  }

  // Try to find section by exact ID first, then try with "section-" prefix
  let section = grade.sections?.find((s: any) => s.id === params.sectionId)
  if (!section) {
    section = grade.sections?.find((s: any) => s.id === `section-${params.sectionId.toLowerCase()}`)
  }
  if (!section) {
    console.error(`Section not found: ${params.sectionId} in grade ${normalizedGradeId}`)
    notFound()
  }
  
  console.log('Elementary Yearbook Page:', {
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
        department: 'Elementary',
        schoolYearId: params.schoolYearId,
        status: 'approved',
        yearLevel: grade.name,
        courseProgram: 'Elementary',
        blockSection: section.name === 'Section A' ? 'A' : section.name === 'Section B' ? 'B' : section.name
      })

      console.log("[v0] Fetching approved profiles with params:", queryParams.toString())

      const response = await fetch(`/api/yearbook?${queryParams.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      const result = await response.json()

      if (result.success && result.data) {
        console.log("[v0] Found approved profiles:", result.data.length)
        
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
        console.error("[v0] Failed to fetch profiles:", result.error)
        setError(result.error || 'Failed to fetch approved profiles')
      }
    } catch (err) {
      console.error("[v0] Error fetching approved profiles:", err)
      setError('Failed to fetch approved profiles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApprovedProfiles()
  }, [params.gradeId, params.sectionId, params.schoolYearId, grade.name, section.name])

  // Auto-refresh when profiles are approved or created
  useYearbookAutoRefresh({
    schoolYearId: params.schoolYearId,
    department: 'Elementary',
    filters: {
      yearLevel: grade?.name,
      courseProgram: 'Elementary',
      blockSection: section?.name === 'Section A' ? 'A' : section?.name === 'Section B' ? 'B' : section?.name
    },
    onRefresh: fetchApprovedProfiles,
    enabled: !!(grade && section)
  })

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading yearbook...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
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
      <ClassYearbookPage
        departmentType="elementary"
        departmentName="Elementary Department"
        sectionName={`${grade.name} - ${section.name}`}
        academicYear={schoolYearLabel || params.schoolYearId}
        people={people}
        activities={[]} // Activities can be added later if needed
        backLink={`/school-years-elementary/${params.schoolYearId}/departments/elementary/${params.gradeId}`}
        profileBasePath={`/school-years-elementary/${params.schoolYearId}/departments/elementary/${params.gradeId}/${params.sectionId}/yearbook`}
        yearId={params.gradeId}
        blockId={params.sectionId}
        schoolYear={schoolYearLabel || params.schoolYearId}
      />
    </div>
  )
}
