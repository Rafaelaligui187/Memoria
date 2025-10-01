"use client"

import { notFound } from "next/navigation"
import { StudentProfile } from "@/components/student-profile"
import { collegeData, type CourseId, type YearId, type BlockId } from "@/lib/college-data"

export default function StudentProfilePage({
  params,
}: {
  params: { courseId: CourseId; yearId: YearId; blockId: BlockId; schoolYear: string; studentId: string }
}) {
  const { courseId, yearId, blockId, schoolYear, studentId } = params

  console.log("[v0] Student profile params:", params)

  // course
  const course = collegeData[courseId]
  if (!course) {
    console.log("[v0] Course not found:", courseId)
    notFound()
  }

  // year
  const year = course.years[yearId]
  if (!year) {
    console.log("[v0] Year not found:", yearId)
    notFound()
  }

  // block
  const block = year.blocks[blockId]
  if (!block) {
    console.log("[v0] Block not found:", blockId)
    notFound()
  }

  // school year
  const schoolYearData = block.schoolYears[schoolYear]
  if (!schoolYearData) {
    console.log("[v0] School year data not found:", schoolYear)
    notFound()
  }

  // student
  const student = schoolYearData.students.find((s) => s.id === studentId)
  if (!student) {
    console.log("[v0] Student not found:", studentId)
    notFound()
  }

  console.log("[v0] Found student:", student.name)

  return (
    <StudentProfile
      departmentType="college"
      departmentName={course.fullName}
      sectionInfo={{
        id: blockId,
        name: `${course.name} ${year.name} - ${block.name}`,
        academicYear: schoolYearData.academicYear,
        adviser: schoolYearData.advisers[0]?.name || "TBA",
      }}
      student={{
        ...student,
        officerRole: schoolYearData.officers?.find((o) => o.id === studentId)?.position,
        galleryImages: student.galleryImages || [],
        achievements: student.achievements || [],
        activities: student.activities || [],
        hobbies: student.hobbies || [],
      }}
      backLink={`/departments/college/${courseId}/${yearId}/${blockId}/${schoolYear}`}
      courseId={courseId}
      yearId={yearId}
      blockId={blockId}
      schoolYear={schoolYear}
    />
  )
}
