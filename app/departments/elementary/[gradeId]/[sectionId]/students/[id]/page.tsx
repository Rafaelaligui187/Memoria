"use client"
import { StudentProfile } from "@/components/student-profile"

// Mock data - replace with actual data fetching
const getMockStudentData = (gradeId: string, sectionId: string, studentId: string) => {
  const gradeName =
    gradeId === "grade-1"
      ? "Grade 1"
      : gradeId === "grade-2"
        ? "Grade 2"
        : gradeId === "grade-3"
          ? "Grade 3"
          : gradeId === "grade-4"
            ? "Grade 4"
            : gradeId === "grade-5"
              ? "Grade 5"
              : gradeId === "grade-6"
                ? "Grade 6"
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
    departmentType: "elementary" as const,
    departmentName: "Elementary Department",
    sectionInfo: {
      id: sectionId,
      name: `${gradeName} - ${sectionName}`,
      academicYear: "2023-2024",
      adviser: "Ms. Sarah Johnson",
    },
    student: {
      id: studentId,
      name: `Student ${studentNumber}`,
      photoUrl: `/placeholder.svg?height=500&width=500&text=Student+${studentNumber}`,
      quote: "Learning is fun and I love going to school every day!",
      ambition: "I want to become a teacher when I grow up so I can help other children learn new things.",
      hobbies: ["Drawing", "Reading", "Playing", "Singing"],
      achievements: [
        {
          title: isOfficer ? "Class Officer" : "Honor Student",
          description: isOfficer
            ? "Served as a class officer for the academic year 2023-2024"
            : "Achieved excellent grades in all subjects",
        },
        {
          title: "Perfect Attendance",
          description: "Never missed a day of school this year",
        },
      ],
      activities: [
        {
          name: "School Choir",
          role: "Member",
        },
        {
          name: "Art Club",
          role: isOfficer ? "Officer" : "Member",
        },
      ],
      favoriteMemory:
        "Our field trip to the zoo where we learned about different animals and had so much fun with my classmates!",
      message:
        "To my wonderful classmates, thank you for being such good friends! We had so much fun learning together, playing during recess, and helping each other with our homework. I hope we can stay friends forever!",
      galleryImages: [
        "/placeholder.svg?height=400&width=600&text=Field+Trip",
        "/placeholder.svg?height=400&width=600&text=Art+Class",
        "/placeholder.svg?height=400&width=600&text=Sports+Day",
      ],
    },
  }
}

export default function ElementaryStudentProfilePage({
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
      backLink={`/departments/elementary/${gradeId}/${sectionId}`}
    />
  )
}
