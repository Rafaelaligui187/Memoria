"use client"

import { notFound } from "next/navigation"
import { ClassYearbookPage } from "@/components/class-yearbook-page"
import type { Person } from "@/types/yearbook"
import { collegeData, type CourseId, type YearId, type BlockId } from "@/lib/college-data"

export default function CollegeYearbookPage({
  params,
}: {
  params: { courseId: CourseId; yearId: YearId; blockId: BlockId; schoolYear: string }
}) {
  console.log("[v0] College yearbook params:", params)

  const course = collegeData[params.courseId]
  if (!course) {
    console.log("[v0] Course not found:", params.courseId)
    notFound()
  }

  const year = course.years[params.yearId as keyof typeof course.years]
  if (!year) {
    console.log("[v0] Year not found:", params.yearId)
    notFound()
  }

  const block = year.blocks[params.blockId as keyof typeof year.blocks]
  if (!block) {
    console.log("[v0] Block not found:", params.blockId)
    notFound()
  }

  const schoolYearData = block.schoolYears[params.schoolYear as keyof typeof block.schoolYears]
  if (!schoolYearData) {
    console.log("[v0] School year data not found:", params.schoolYear)
    notFound()
  }

  console.log("[v0] Found school year data:", schoolYearData.academicYear)

  const people: Person[] = [
    // Add students with role and officerRole properties
    ...(schoolYearData.students || []).map(
      (student: { id: string; name: string; image: string; quote: string; honors?: string }) => ({
        ...student,
        role: "student" as const,
        officerRole:
          schoolYearData.officers?.find((officer: { id: string; position: string }) => officer.id === student.id)
            ?.position || undefined,
      }),
    ),
    // Add advisers as faculty
    ...(schoolYearData.advisers || []).map((adviser: { id: string; name: string; image: string; quote: string }) => ({
      ...adviser,
      role: "faculty" as const,
      position: "Adviser",
      department: course.fullName,
      yearsOfService: 1,
    })),
  ]

  return (
    <ClassYearbookPage
      departmentType="college"
      departmentName={course.fullName}
      sectionName={`${course.name} ${year.name} - ${block.name}`}
      academicYear={schoolYearData.academicYear}
      people={people}
      activities={schoolYearData.activities}
      backLink={`/departments/college/${params.courseId}/${params.yearId}/${params.blockId}/school-years`}
      profileBasePath={`/departments/college/${params.courseId}/${params.yearId}/${params.blockId}/${params.schoolYear}`}
      courseId={params.courseId}
      yearId={params.yearId}
      blockId={params.blockId}
      schoolYear={params.schoolYear}
    />
  )
}
