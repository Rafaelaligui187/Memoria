"use client"

import { notFound } from "next/navigation"
import { StudentProfile } from "@/components/student-profile"
import { seniorHighData } from "@/lib/senior-high-data"

export default function SeniorHighStudentProfilePage({
  params,
}: {
  params: {
    strandId: keyof typeof seniorHighData
    yearId: string
    sectionId: string
    schoolYear: string
    studentId: string
  }
}) {
  const { strandId, yearId, sectionId, schoolYear, studentId } = params

  const strand = seniorHighData[strandId]
  if (!strand) notFound()
  const year = strand.years[yearId as keyof typeof strand.years]
  if (!year) notFound()
  const section = year.sections[sectionId as keyof typeof year.sections]
  if (!section) notFound()

  const data = (section as any).schoolYears?.[schoolYear] || {
    academicYear: (section as any).academicYear || schoolYear,
    advisers: (section as any).advisers || [],
    students: (section as any).students || [],
    officers: (section as any).officers || [],
  }

  const student = (data.students || []).find((s: any) => s.id === studentId)
  if (!student) notFound()

  return (
    <StudentProfile
      departmentType="senior-high"
      departmentName="Senior High Department"
      sectionInfo={{ id: sectionId, name: `${strand.name} - ${year.name} - ${section.name}`, academicYear: data.academicYear, adviser: (data.advisers?.[0]?.name) || "" }}
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
      backLink={`/departments/senior-high/${strandId}/${yearId}/${sectionId}/${schoolYear}`}
    />
  )
}
