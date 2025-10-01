"use client"

import { notFound } from "next/navigation"
import { StudentProfile } from "@/components/student-profile"
import { elementaryData } from "@/lib/elementary-data"

export default function ElementaryStudentProfilePage({
  params,
}: {
  params: { gradeId: keyof typeof elementaryData; sectionId: string; schoolYear: string; studentId: string }
}) {
  const { gradeId, sectionId, schoolYear, studentId } = params

  const normalizedGradeId = (gradeId as string) as keyof typeof elementaryData
  const grade = elementaryData[normalizedGradeId]
  if (!grade) notFound()
  const section = grade.sections[sectionId as keyof typeof grade.sections]
  if (!section) notFound()

  const data = (section as any).schoolYears?.[schoolYear]
  if (!data) notFound()

  const student = (data.students || []).find((s: any) => s.id === studentId)
  if (!student) notFound()

  return (
    <StudentProfile
      departmentType="elementary"
      departmentName="Elementary Department"
      sectionInfo={{ id: sectionId, name: `${grade.name} - ${section.name}`, academicYear: data.academicYear, adviser: (data.advisers?.[0]?.name) || "" }}
      student={{
        id: student.id,
        name: student.name,
        photoUrl: student.image,
        quote: student.quote,
        ambition: undefined,
        hobbies: [],
        achievements: [],
        activities: [],
        favoriteMemory: undefined,
        message: undefined,
        galleryImages: [],
      }}
      backLink={`/departments/elementary/${normalizedGradeId}/${sectionId}/${schoolYear}`}
    />
  )
}
