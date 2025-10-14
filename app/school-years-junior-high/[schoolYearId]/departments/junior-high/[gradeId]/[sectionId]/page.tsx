"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { juniorHighData } from "@/lib/junior-high-data"
import { Header } from "@/components/header"

export default function JuniorHighSectionPage({ 
  params 
}: { 
  params: { schoolYearId: string; gradeId: string; sectionId: string } 
}) {
  const router = useRouter()

  const grade = (juniorHighData as any)[params.gradeId]
  const section = grade?.sections?.[params.sectionId]

  useEffect(() => {
    // Always redirect to yearbook, regardless of data structure
    router.replace(`/school-years-junior-high/${params.schoolYearId}/departments/junior-high/${params.gradeId}/${params.sectionId}/yearbook`)
  }, [params.schoolYearId, params.gradeId, params.sectionId, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to yearbook...</p>
      </div>
    </div>
  )
}
