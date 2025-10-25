"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { ClassYearbookPage } from "@/components/class-yearbook-page"
import { Person } from "@/types/yearbook"
import Header from "@/components/header"
import { seniorHighData } from "@/lib/senior-high-data"
import { useYearbookAutoRefresh } from "@/hooks/use-yearbook-auto-refresh"

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


export default function SeniorHighYearbookPage({
  params,
}: {
  params: { schoolYearId: string; strandId: string; yearId: string; sectionId: string }
}) {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [schoolYearLabel, setSchoolYearLabel] = useState<string>("")
  const [strand, setStrand] = useState<any>(null)
  const [year, setYear] = useState<any>(null)
  const [section, setSection] = useState<any>(null)
  const [classMotto, setClassMotto] = useState<string>("")

  // Fetch strand data from API
  useEffect(() => {
    const fetchStrandData = async () => {
      try {
        const response = await fetch(`/api/admin/strands?department=senior-high&schoolYearId=${params.schoolYearId}`)
        const result = await response.json()
        
        if (result.success) {
          const foundStrand = result.data.find((s: any) => s._id === params.strandId)
          if (foundStrand) {
            setStrand(foundStrand)
            
            // Find the year data
            const yearData = { name: params.yearId === 'grade-11' ? 'Grade 11' : 'Grade 12' }
            setYear(yearData)
            
            // Create section data
            const sectionNumber = params.sectionId.replace('section-', '')
            const sectionData = { name: `${foundStrand.name} ${sectionNumber}` }
            setSection(sectionData)
          } else {
            console.error(`Strand not found: ${params.strandId}`)
            notFound()
          }
        } else {
          console.error('Failed to fetch strand data')
          notFound()
        }
      } catch (err) {
        console.error('Error fetching strand data:', err)
        notFound()
      }
    }

    fetchStrandData()
  }, [params.strandId, params.schoolYearId, params.yearId, params.sectionId])
  
  console.log('Senior High Yearbook Page:', {
    strandId: params.strandId,
    yearId: params.yearId,
    sectionId: params.sectionId,
    schoolYearId: params.schoolYearId,
    strand: strand?.name,
    year: year?.name,
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
    // Don't fetch if strand, year, or section data is not loaded yet
    if (!strand || !year || !section) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Build query parameters for the API
      const queryParams = new URLSearchParams({
        department: 'Senior High',
        schoolYearId: params.schoolYearId,
        status: 'approved',
        yearLevel: year.name,
        courseProgram: strand.name,
        blockSection: section.name.replace(/^(STEM|ABM|HUMSS|TVL|HE|ICT)\s+/, '')
      })

      console.log("[Senior High] Fetching approved profiles with params:", queryParams.toString())

      const response = await fetch(`/api/yearbook?${queryParams.toString()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      const result = await response.json()

      if (result.success && result.data) {
        console.log("[Senior High] Found approved profiles:", result.data.length)
        
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
        console.error("[Senior High] Failed to fetch profiles:", result.error)
        setError(result.error || 'Failed to fetch approved profiles')
      }
    } catch (err) {
      console.error("[Senior High] Error fetching approved profiles:", err)
      setError('Failed to fetch approved profiles')
    } finally {
      setLoading(false)
    }
  }

  // Fetch class motto from advisory profiles
  const fetchClassMotto = async () => {
    try {
      if (!strand || !year || !section) return

      // Build query parameters for advisory profiles
      const queryParams = new URLSearchParams({
        department: 'Senior High',
        schoolYearId: params.schoolYearId,
        status: 'approved',
        yearLevel: year.name,
        courseProgram: strand.name,
        blockSection: section.name?.replace(/^(STEM|ABM|HUMSS|TVL|HE|ICT)\s+/, '') || section.name
      })

      console.log("[Senior High] Fetching class motto with params:", queryParams.toString())

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
          profile.userType === 'advisory' &&
          profile.messageToStudents
        )

        if (advisoryProfile && advisoryProfile.messageToStudents) {
          console.log("[Senior High] Found class motto:", advisoryProfile.messageToStudents)
          setClassMotto(advisoryProfile.messageToStudents)
        } else {
          console.log("[Senior High] No class motto found for this class")
          setClassMotto("")
        }
      } else {
        console.error("[Senior High] Failed to fetch profiles for motto:", result.error)
        setClassMotto("")
      }
    } catch (err) {
      console.error("[Senior High] Error fetching class motto:", err)
      setClassMotto("")
    }
  }

  useEffect(() => {
    fetchApprovedProfiles()
  }, [params.strandId, params.yearId, params.sectionId, params.schoolYearId, strand, year, section])

  // Fetch class motto when strand, year, and section data is available
  useEffect(() => {
    fetchClassMotto()
  }, [strand, year, section, params.schoolYearId])

  // Auto-refresh when profiles are approved or created
  useYearbookAutoRefresh({
    schoolYearId: params.schoolYearId,
    department: 'Senior High',
    filters: {
      yearLevel: year?.name,
      courseProgram: strand?.name,
      blockSection: section?.name?.replace(/^(STEM|ABM|HUMSS|TVL|HE|ICT)\s+/, '')
    },
    onRefresh: fetchApprovedProfiles,
    enabled: !!(strand && year && section)
  })

  // Show loading state
  if (loading || !strand || !year || !section) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading yearbook...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
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
      departmentType="senior-high" // ✅ this automatically applies amber/yellow theme
      departmentName="Senior High Department"
      sectionName={`${strand.name} - ${year.name} - ${section.name}`}
      academicYear={schoolYearLabel || params.schoolYearId}
      people={people}
      activities={[]} // Activities can be added later if needed
      motto={classMotto}
      backLink={`/school-years-senior-high/${params.schoolYearId}/departments/senior-high/${params.strandId}`}
      profileBasePath={`/school-years-senior-high/${params.schoolYearId}/departments/senior-high/${params.strandId}/${params.yearId}/${params.sectionId}/yearbook`}
      yearId={params.yearId}
      blockId={params.sectionId}
      schoolYear={schoolYearLabel || params.schoolYearId}
    />
    </div>
  )
}
