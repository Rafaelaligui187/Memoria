"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const seniorHighData = {
  stem: {
    name: "STEM",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "dr-anderson",
                name: "Dr. Michael Anderson",
                image: "/placeholder.svg",
                quote: "Science is the key to understanding the world.",
              },
            ],
            students: [
              {
                id: "shs1101",
                name: "Alex Johnson",
                image: "/placeholder.svg",
                quote: "Future engineer.",
                honors: "With High Honors",
              },
              { id: "shs1102", name: "Brenda Lee", image: "/placeholder.svg", quote: "Passionate about robotics." },
              { id: "shs1103", name: "Chris Evans", image: "/placeholder.svg", quote: "Aspiring astrophysicist." },
              { id: "shs1104", name: "Dana Scully", image: "/placeholder.svg", quote: "Loves chemistry experiments." },
              { id: "shs1105", name: "Ethan Hunt", image: "/placeholder.svg", quote: "Problem-solving is my forte." },
            ],
            officers: [
              {
                id: "shs1101",
                name: "Alex Johnson",
                image: "/placeholder.svg",
                position: "President",
                quote: "Leading the STEM path.",
              },
              {
                id: "shs1102",
                name: "Brenda Lee",
                image: "/placeholder.svg",
                position: "Treasurer",
                quote: "Managing our resources.",
              },
            ],
            activities: [
              {
                id: "sha1",
                title: "Robotics Competition",
                image: "/placeholder.svg",
                description: "Annual inter-school robotics challenge.",
                date: "Apr 10, 2025",
              },
              {
                id: "sha2",
                title: "Science Olympiad",
                image: "/placeholder.svg",
                description: "Academic competition in various science fields.",
                date: "May 5, 2025",
              },
            ],
          },
          "section-b": {
            name: "Section B",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "prof-chang",
                name: "Prof. Lisa Chang",
                image: "/placeholder.svg",
                quote: "Innovate, inspire, achieve.",
              },
            ],
            students: [
              { id: "shs1106", name: "Fiona Green", image: "/placeholder.svg", quote: "Mathematics is beautiful." },
              { id: "shs1107", name: "George White", image: "/placeholder.svg", quote: "Exploring computer graphics." },
            ],
            officers: [],
            activities: [],
          },
        },
      },
      "grade-12": {
        name: "Grade 12",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2023-2024",
            advisers: [
              {
                id: "dr-chen",
                name: "Dr. Robert Chen",
                image: "/placeholder.svg",
                quote: "Preparing for university and beyond.",
              },
            ],
            students: [
              { id: "shs1201", name: "Hannah Black", image: "/placeholder.svg", quote: "Physics is my passion." },
              { id: "shs1202", name: "Ian Grey", image: "/placeholder.svg", quote: "Future software developer." },
            ],
            officers: [],
            activities: [],
          },
        },
      },
    },
  },
  abm: {
    name: "ABM",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "ms-business",
                name: "Ms. Patricia Business",
                image: "/placeholder.svg",
                quote: "Building future entrepreneurs.",
              },
            ],
            students: [
              { id: "abm1101", name: "Julia Roberts", image: "/placeholder.svg", quote: "Business is my calling." },
              {
                id: "abm1102",
                name: "Kevin Costner",
                image: "/placeholder.svg",
                quote: "Understanding market trends.",
              },
            ],
            officers: [],
            activities: [],
          },
        },
      },
    },
  },
}

export default function SeniorHighSectionPage({
  params,
}: {
  params: { strandId: string; yearId: string; sectionId: string }
}) {
  const router = useRouter()

  useEffect(() => {
    router.replace(
      `/departments/senior-high/${params.strandId}/${params.yearId}/${params.sectionId}/school-years`,
    )
  }, [params.strandId, params.yearId, params.sectionId, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to school year selection...</p>
      </div>
    </div>
  )
}
