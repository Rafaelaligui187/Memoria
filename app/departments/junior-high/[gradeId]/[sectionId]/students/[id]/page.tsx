"use client"
import { StudentProfile } from "@/components/student-profile"

// Mock data - replace with actual data fetching
const getMockStudentData = (gradeId: string, sectionId: string, studentId: string) => {
  const gradeName =
    gradeId === "grade-7"
      ? "Grade 7"
      : gradeId === "grade-8"
        ? "Grade 8"
        : gradeId === "grade-9"
          ? "Grade 9"
          : gradeId === "grade-10"
            ? "Grade 10"
            : "Unknown Grade"

  const sectionName =
    sectionId === "section-a"
      ? "Section A"
      : sectionId === "section-b"
        ? "Section B"
        : sectionId === "section-c"
          ? "Section C"
          : sectionId.toUpperCase()

  const studentNumber = studentId.split("-")[1] || "1"
  const isOfficer = Number.parseInt(studentNumber) <= 4

  return {
    departmentType: "junior-high" as const,
    departmentName: "Junior High Department",
    sectionInfo: {
      id: sectionId,
      name: `${gradeName} - ${sectionName}`,
      academicYear: "2023-2024",
      adviser: "Mr. Michael Rodriguez",
    },
    student: {
      id: studentId,
      name: `Student ${studentNumber}`,
      photoUrl: `/placeholder.svg?height=500&width=500&text=Student+${studentNumber}`,
      quote: "The future belongs to those who believe in the beauty of their dreams.",
      ambition:
        "To become a scientist and discover new things that can help make the world a better place for everyone.",
      hobbies: ["Basketball", "Reading", "Gaming", "Music"],
      achievements: [
        {
          title: isOfficer ? "Class Officer" : "Honor Roll",
          description: isOfficer
            ? "Served as a class officer for the academic year 2023-2024"
            : "Maintained high academic performance throughout the year",
        },
        {
          title: "Science Fair Winner",
          description: "First place in the school science fair competition",
        },
      ],
      activities: [
        {
          name: "Student Government",
          role: isOfficer ? "Executive Officer" : "Member",
        },
        {
          name: "Basketball Team",
          role: "Player",
        },
      ],
      favoriteMemory:
        "Our science experiment where we built a volcano that actually erupted! It was amazing to see all our hard work pay off and everyone was so excited.",
      message:
        "To my awesome classmates, these junior high years have been incredible! From our first day being nervous about changing classes to now feeling confident about high school. Thanks for all the laughs, study sessions, and memories we've made together!",
      galleryImages: [
        "/placeholder.svg?height=400&width=600&text=Science+Fair",
        "/placeholder.svg?height=400&width=600&text=Basketball+Game",
        "/placeholder.svg?height=400&width=600&text=Class+Party",
      ],
    },
  }
}

export default function JuniorHighStudentProfilePage({
  params,
}: {
  params: { gradeId: string; sectionId: string; id: string }
}) {
  const { gradeId, sectionId, id } = params
  const data = getMockStudentData(gradeId, sectionId, id)

  return (
    <StudentProfile
      departmentType={data.departmentType}
      departmentName={data.departmentName}
      sectionInfo={data.sectionInfo}
      student={data.student}
      backLink={`/departments/junior-high/${gradeId}/${sectionId}`}
    />
  )
}
