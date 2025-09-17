"use client"
import { StudentProfile } from "@/components/student-profile"

// Mock data - replace with actual data fetching
const getMockStudentData = (strandId: string, yearId: string, sectionId: string, studentId: string) => {
  const strandName =
    strandId === "stem"
      ? "STEM"
      : strandId === "abm"
        ? "ABM"
        : strandId === "humss"
          ? "HUMSS"
          : strandId === "gas"
            ? "GAS"
            : strandId.toUpperCase()

  const yearName = yearId === "grade-11" ? "Grade 11" : yearId === "grade-12" ? "Grade 12" : "Unknown Year"

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
    departmentType: "senior-high" as const,
    departmentName: "Senior High Department",
    sectionInfo: {
      id: sectionId,
      name: `${strandName} - ${yearName} - ${sectionName}`,
      academicYear: "2023-2024",
      adviser: "Dr. Patricia Williams",
    },
    student: {
      id: studentId,
      name: `Student ${studentNumber}`,
      photoUrl: `/placeholder.svg?height=500&width=500&text=Student+${studentNumber}`,
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      ambition:
        "To pursue higher education in my chosen field and eventually become a leader who can make a positive impact in society.",
      hobbies: ["Research", "Debate", "Volunteering", "Photography"],
      achievements: [
        {
          title: isOfficer ? "Class Officer" : "Academic Excellence",
          description: isOfficer
            ? "Served as a class officer for the academic year 2023-2024"
            : "Consistently achieved high grades across all subjects",
        },
        {
          title: "Research Competition Winner",
          description: "First place in the regional research competition",
        },
      ],
      activities: [
        {
          name: "Debate Society",
          role: isOfficer ? "President" : "Active Member",
        },
        {
          name: "Community Service Club",
          role: "Volunteer",
        },
      ],
      favoriteMemory:
        "Our research defense presentation where months of hard work finally paid off. Seeing our teachers proud and our classmates cheering was an unforgettable moment that showed me what teamwork can achieve.",
      message:
        "To my incredible classmates, as we prepare for the next chapter of our lives, I want to thank you for making these senior high years so meaningful. From late-night study sessions to celebrating our victories together, you've made this journey unforgettable. Let's continue to support each other as we pursue our dreams!",
      galleryImages: [
        "/placeholder.svg?height=400&width=600&text=Research+Defense",
        "/placeholder.svg?height=400&width=600&text=Graduation+Prep",
        "/placeholder.svg?height=400&width=600&text=Community+Service",
      ],
    },
  }
}

export default function SeniorHighStudentProfilePage({
  params,
}: {
  params: { strandId: string; yearId: string; sectionId: string; id: string }
}) {
  const { strandId, yearId, sectionId, id } = params
  const data = getMockStudentData(strandId, yearId, sectionId, id)

  return (
    <StudentProfile
      departmentType={data.departmentType}
      departmentName={data.departmentName}
      sectionInfo={data.sectionInfo}
      student={data.student}
      backLink={`/departments/senior-high/${strandId}/${yearId}/${sectionId}`}
    />
  )
}
