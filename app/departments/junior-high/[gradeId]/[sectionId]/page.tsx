"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const juniorHighData = {
  grade7: {
    name: "Grade 7",
    sections: {
      "section-a": {
        name: "Section A",
        academicYear: "2024-2025",
        advisers: [
          {
            id: "ms-lopez-jh",
            name: "Ms. Jennifer Lopez",
            image: "/placeholder.svg",
            quote: "Embrace challenges, find success.",
          },
        ],
        students: [
          {
            id: "jh701",
            name: "Daniel White",
            image: "/placeholder.svg",
            quote: "Exploring new subjects.",
            honors: "Honor Student",
          },
          { id: "jh702", name: "Chloe Harris", image: "/placeholder.svg", quote: "Passionate about science." },
          { id: "jh703", name: "Benjamin Clark", image: "/placeholder.svg", quote: "Future athlete." },
          { id: "jh704", name: "Sophie Lewis", image: "/placeholder.svg", quote: "Love to read fantasy books." },
          { id: "jh705", name: "Samuel King", image: "/placeholder.svg", quote: "Into video games and coding." },
        ],
        officers: [
          {
            id: "jh701",
            name: "Daniel White",
            image: "/placeholder.svg",
            position: "Class President",
            quote: "Leading with integrity.",
          },
          {
            id: "jh702",
            name: "Chloe Harris",
            image: "/placeholder.svg",
            position: "Secretary",
            quote: "Organizing for success.",
          },
        ],
        activities: [
          {
            id: "jha1",
            title: "Science Fair",
            image: "/placeholder.svg",
            description: "Showcasing innovative science projects.",
            date: "Mar 15, 2025",
          },
          {
            id: "jha2",
            title: "Sports Fest",
            image: "/placeholder.svg",
            description: "Annual inter-section sports competition.",
            date: "Feb 20-22, 2025",
          },
        ],
      },
      "section-b": {
        name: "Section B",
        academicYear: "2024-2025",
        advisers: [
          {
            id: "mr-johnson-jh",
            name: "Mr. Robert Johnson",
            image: "/placeholder.svg",
            quote: "Inspiring young minds.",
          },
        ],
        students: [
          { id: "jh706", name: "Lily Wright", image: "/placeholder.svg", quote: "Art is my passion." },
          { id: "jh707", name: "Joseph Scott", image: "/placeholder.svg", quote: "Learning about history." },
        ],
        officers: [],
        activities: [],
      },
    },
  },
  grade8: {
    name: "Grade 8",
    sections: {
      "section-a": {
        name: "Section A",
        academicYear: "2024-2025",
        advisers: [
          {
            id: "ms-davis-jh",
            name: "Ms. Patricia Davis",
            image: "/placeholder.svg",
            quote: "Guiding students to excel.",
          },
        ],
        students: [
          { id: "jh801", name: "Grace Adams", image: "/placeholder.svg", quote: "Mathematics is fascinating." },
          { id: "jh802", name: "David Baker", image: "/placeholder.svg", quote: "Exploring new technologies." },
        ],
        officers: [],
        activities: [],
      },
    },
  },
}

export default function JuniorHighSectionPage({
  params,
}: {
  params: { gradeId: string; sectionId: string }
}) {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/departments/junior-high/${params.gradeId}/${params.sectionId}/school-years`)
  }, [params.gradeId, params.sectionId, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to school year selection...</p>
      </div>
    </div>
  )
}
