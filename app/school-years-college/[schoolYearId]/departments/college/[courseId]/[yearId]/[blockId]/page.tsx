"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CollegeBlockPage({
  params,
}: {
  params: { schoolYearId: string; courseId: string; yearId: string; blockId: string }
}) {
  const router = useRouter()

  useEffect(() => {
    // Always redirect to yearbook, regardless of data structure
    router.replace(`/school-years-college/${params.schoolYearId}/departments/college/${params.courseId}/${params.yearId}/${params.blockId}/yearbook`)
  }, [params.schoolYearId, params.courseId, params.yearId, params.blockId, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to yearbook...</p>
      </div>
    </div>
  )
}
