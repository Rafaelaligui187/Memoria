"use client"

import { notFound } from "next/navigation"
import { ClassYearbookPage } from "@/components/class-yearbook-page"
import type { Person } from "@/types/yearbook"
import { juniorHighData } from "@/lib/junior-high-data"

export default function JuniorHighYearbookPage({
  params,
}: {
  params: { gradeId: keyof typeof juniorHighData; sectionId: string; schoolYear: string }
}) {
  const { gradeId, sectionId, schoolYear } = params

  const grade = (juniorHighData as any)[gradeId]
  if (!grade) notFound()
  const section = grade.sections?.[sectionId]
  if (!section) notFound()
  const schoolYearData = section.schoolYears?.[schoolYear]
  if (!schoolYearData) notFound()

  const people: Person[] = [
    ...(schoolYearData.students || []).map(
      (student: { id: string; name: string; image: string; quote: string; honors?: string }) => ({
        ...student,
        role: "student" as const,
        officerRole:
          schoolYearData.officers?.find((o: { id: string; position: string }) => o.id === student.id)?.position ||
          undefined,
      }),
    ),
    ...(schoolYearData.advisers || []).map(
      (adviser: { id: string; name: string; image: string; quote: string }) => ({
        ...adviser,
        role: "faculty" as const,
        department: "Junior High",
        yearsOfService: 1,
      }),
    ),
  ]

  return (
    <ClassYearbookPage
      departmentType="junior-high" // ✅ this automatically applies emerald/green theme
      departmentName="Junior High Department"
      sectionName={`${grade.name} - ${section.name}`}
      academicYear={schoolYearData.academicYear}
      people={people}
      activities={schoolYearData.activities}
      backLink={`/departments/junior-high/${gradeId}/${sectionId}/school-years`}
      profileBasePath={`/departments/junior-high/${gradeId}/${sectionId}/${schoolYear}`}
      yearId={gradeId}
      blockId={sectionId}
      schoolYear={schoolYear}
    />
  )
}
