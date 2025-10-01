"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { elementaryData } from "@/lib/elementary-data"

// Utility: normalize gradeId (allow "grade1" → "grade-1")
function normalizeGradeId(id: string) {
  if (id.startsWith("grade") && !id.includes("-")) {
    const num = id.replace("grade", "")
    return `grade-${num}`
  }
  return id
}

// Convert "grade-1" → "grade1" for URLs
function toUrlGradeId(id: string) {
  return id.replace("grade-", "grade")
}

export default function ElementarySectionPage({
  params,
}: {
  params: { gradeId: string; sectionId: string }
}) {
  const router = useRouter()

  const normalizedGradeId = normalizeGradeId(params.gradeId)
  const urlGradeId = toUrlGradeId(normalizedGradeId)
  const grade = (elementaryData as any)[normalizedGradeId]
  const section = grade?.sections?.[params.sectionId]

  useEffect(() => {
    if (!grade || !section) return
    router.replace(
      `/departments/elementary/${urlGradeId}/${params.sectionId}/school-years`
    )
  }, [normalizedGradeId, params.sectionId, router, grade, section, urlGradeId])

  if (!grade || !section) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href={`/departments/elementary/${urlGradeId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Grade
          </Link>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-8 text-center">
            <p className="text-gray-700">Section not found for this grade.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to school year selection...</p>
      </div>
    </div>
  )
}
