"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ElementarySectionPage({
  params,
}: {
  params: { gradeId: string; sectionId: string }
}) {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/departments/elementary/${params.gradeId}/${params.sectionId}/school-years`)
  }, [params.gradeId, params.sectionId, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to school year selection...</p>
      </div>
    </div>
  )
}
