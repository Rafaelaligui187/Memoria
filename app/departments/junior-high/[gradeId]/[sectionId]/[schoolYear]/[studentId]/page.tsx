"use client"

import { notFound } from "next/navigation"
import { StudentProfile } from "@/components/student-profile"
import { juniorHighData } from "@/lib/junior-high-data"

export default function JuniorHighStudentProfilePage({
  params,
}: {
  params: { gradeId: keyof typeof juniorHighData; sectionId: string; schoolYear: string; studentId: string }
}) {
  const { gradeId, sectionId, schoolYear, studentId } = params

  const grade = (juniorHighData as any)[gradeId]
  if (!grade) notFound()
  const section = grade.sections?.[sectionId]
  if (!section) notFound()

  const data = section?.schoolYears?.[schoolYear]
  if (!data) notFound()

  const student = (data.students || []).find((s: any) => s.id === studentId)
  if (!student) notFound()

  return (
    <StudentProfile
      departmentType="junior-high"
      departmentName="Junior High Department"
      sectionInfo={{
        id: sectionId,
        name: `${grade.name} - ${section.name}`,
        academicYear: data.academicYear,
        adviser: data.advisers?.[0]?.name || "",
      }}
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
      backLink={`/departments/junior-high/${gradeId}/${sectionId}/${schoolYear}`}
    />
  )
}
