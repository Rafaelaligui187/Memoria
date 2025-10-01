"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { juniorHighData } from "@/lib/junior-high-data"

// Use shared data from lib/junior-high-data

export default function JuniorHighSectionPage({ params }: { params: { gradeId: string; sectionId: string } }) {
  const router = useRouter()

  const grade = (juniorHighData as any)[params.gradeId]
  const section = grade?.sections?.[params.sectionId]

  useEffect(() => {
    if (!grade || !section) return
    router.replace(`/departments/junior-high/${params.gradeId}/${params.sectionId}/school-years`)
  }, [params.gradeId, params.sectionId, router, grade, section])

  if (!grade || !section) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href={`/departments/junior-high/${params.gradeId}`} className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Grade
          </Link>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-8 text-center">
            <p className="text-gray-700">Section not found for this grade.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to school year selection...</p>
      </div>
    </div>
  )
}
