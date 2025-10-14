"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RedirectCollegeYearbookPage({
  params,
}: {
  params: { courseId: string; yearId: string; blockId: string; schoolYear: string }
}) {
  const router = useRouter()

  useEffect(() => {
    // Redirect to new structure: /school-years-college/[schoolYear]/departments/college/[courseId]/[yearId]/[blockId]/yearbook
    router.replace(`/school-years-college/${params.schoolYear}/departments/college/${params.courseId}/${params.yearId}/${params.blockId}/yearbook`)
  }, [router, params.schoolYear, params.courseId, params.yearId, params.blockId])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to new structure...</p>
      </div>
    </div>
  )
}