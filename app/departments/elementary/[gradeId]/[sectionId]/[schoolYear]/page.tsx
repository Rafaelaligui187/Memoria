"use client"

import { notFound } from "next/navigation"
import { ClassYearbookPage } from "@/components/class-yearbook-page"
import type { Person } from "@/types/yearbook"
import { elementaryData } from "@/lib/elementary-data"

function normalizeGradeId(id: string) {
  if (id.startsWith("grade") && !id.includes("-")) {
    const num = id.replace("grade", "")
    return `grade-${num}`
  }
  return id
}

export default function ElementaryYearbookPage({
  params,
}: {
  params: { gradeId: string; sectionId: string; schoolYear: string }
}) {
  const normalizedGradeId = normalizeGradeId(params.gradeId)
  const grade = (elementaryData as any)[normalizedGradeId]
  if (!grade) notFound()

  const section = grade.sections?.[params.sectionId]
  if (!section) notFound()

  const schoolYearData = section.schoolYears?.[params.schoolYear]
  if (!schoolYearData) notFound()

  const people: Person[] = [
    ...(schoolYearData.students || []).map(
      (student: { id: string; name: string; image: string; quote: string; honors?: string }) => ({
        ...student,
        role: "student" as const,
        officerRole:
          schoolYearData.officers?.find((o: { id: string; position: string }) => o.id === student.id)
            ?.position || undefined,
      })
    ),
    ...(schoolYearData.advisers || []).map(
      (adviser: { id: string; name: string; image: string; quote: string }) => ({
        ...adviser,
        role: "faculty" as const,
        department: "Elementary",
        yearsOfService: 1,
      })
    ),
  ]

  return (
    <ClassYearbookPage
      departmentType="elementary"
      departmentName="Elementary Department"
      sectionName={`${grade.name} - ${section.name}`}
      academicYear={schoolYearData.academicYear}
      people={people}
      activities={schoolYearData.activities}
      backLink={`/departments/elementary/${normalizedGradeId}/${params.sectionId}/school-years`}
      profileBasePath={`/departments/elementary/${normalizedGradeId}/${params.sectionId}/${params.schoolYear}`}
      yearId={normalizedGradeId}
      blockId={params.sectionId}
      schoolYear={params.schoolYear}
    />
  )
}
