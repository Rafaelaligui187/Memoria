"use client"

import { notFound } from "next/navigation"
import { StudentProfile } from "@/components/student-profile"
import type { UserRole } from "@/types/yearbook"
import { collegeData } from "../../../../../[schoolYear]/page" 
// 👆 adjust this import path — or move `collegeData` to its own file (recommended)

type CourseId = "bsit" | "bscs"
type YearId = "1st-year" | "2nd-year" | "3rd-year" | "4th-year"
type BlockId = "block-a" | "block-b" | "block-c" | "block-d"

export default function StudentProfilePage({
  params,
}: {
  params: { courseId: CourseId; yearId: YearId; blockId: BlockId; schoolYear: string; studentId: string }
}) {
  const { courseId, yearId, blockId, schoolYear, studentId } = params

  // course
  const course = collegeData[courseId]
  if (!course) notFound()

  // year
  const year = course.years[yearId]
  if (!year) notFound()

  // block
  const block = year.blocks[blockId]
  if (!block) notFound()

  // school year
  const schoolYearData = block.schoolYears[schoolYear]
  if (!schoolYearData) notFound()

  // student
  const student = schoolYearData.students.find((s) => s.id === studentId)
  if (!student) notFound()

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
