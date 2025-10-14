"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RedirectElementaryYearbookPage({
  params,
}: {
  params: { gradeId: string; sectionId: string; schoolYear: string }
}) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to new structure: /school-years-elementary/[schoolYear]/departments/elementary/[gradeId]/[sectionId]/yearbook
    router.replace(`/school-years-elementary/${params.schoolYear}/departments/elementary/${params.gradeId}/${params.sectionId}/yearbook`)
  }, [router, params.schoolYear, params.gradeId, params.sectionId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to new structure...</p>
      </div>
    </div>
  )
}