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
  params: { schoolYearId: string; gradeId: string; sectionId: string }
}) {
  const router = useRouter()

  const normalizedGradeId = normalizeGradeId(params.gradeId)
  const urlGradeId = toUrlGradeId(normalizedGradeId)
  const grade = (elementaryData as any)[normalizedGradeId]
  const section = grade?.sections?.[params.sectionId]

  useEffect(() => {
    // Always redirect to yearbook, regardless of data structure
    router.replace(
      `/school-years-elementary/${params.schoolYearId}/departments/elementary/${urlGradeId}/${params.sectionId}/yearbook`
    )
  }, [normalizedGradeId, params.sectionId, router, urlGradeId, params.schoolYearId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to yearbook...</p>
      </div>
    </div>
  )
}
