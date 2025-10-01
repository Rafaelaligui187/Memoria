"use client"

import { notFound } from "next/navigation"
import { ClassYearbookPage } from "@/components/class-yearbook-page"
import type { Person } from "@/types/yearbook"
import { seniorHighData } from "@/lib/senior-high-data"

export default function SeniorHighYearbookPage({
  params,
}: {
  params: { strandId: keyof typeof seniorHighData; yearId: string; sectionId: string; schoolYear: string }
}) {
  const { strandId, yearId, sectionId, schoolYear } = params

  const strand = seniorHighData[strandId]
  if (!strand) notFound()

  const year = strand.years[yearId as keyof typeof strand.years]
  if (!year) notFound()

  const section = year.sections[sectionId as keyof typeof year.sections]
  if (!section) notFound()

  // Support both data shapes: with or without nested schoolYears
  const schoolYearData = (section as any).schoolYears?.[schoolYear] || {
    academicYear: section.academicYear || schoolYear,
    advisers: section.advisers || [],
    students: section.students || [],
    officers: section.officers || [],
    activities: section.activities || [],
  }

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
        department: strand.name,
        yearsOfService: 1,
      }),
    ),
  ]

  return (
    <ClassYearbookPage
      departmentType="senior-high"
      departmentName={strand.name}
      sectionName={`${strand.name} ${year.name} - ${section.name}`}
      academicYear={schoolYearData.academicYear}
      people={people}
      activities={schoolYearData.activities}
      backLink={`/departments/senior-high/${strandId}/${yearId}/${sectionId}/school-years`}
      profileBasePath={`/departments/senior-high/${strandId}/${yearId}/${sectionId}/${schoolYear}`}
      yearId={yearId}
      blockId={sectionId}
      schoolYear={schoolYear}
    />
  )
}
