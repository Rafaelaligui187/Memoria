"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { Header } from "@/components/header"

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
            ],
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
                id: "ms-garcia",
                name: "Ms. Sarah Garcia",
                image: "/placeholder.svg",
                quote: "Business is about creating value.",
              },
            ],
            students: [
              {
                id: "shs1102",
                name: "Maria Santos",
                image: "/placeholder.svg",
                quote: "Future entrepreneur.",
                honors: "With Honors",
              },
            ],
          },
        },
      },
    },
  },
  humss: {
    name: "HUMSS",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "mr-cruz",
                name: "Mr. Juan Cruz",
                image: "/placeholder.svg",
                quote: "Education is the foundation of society.",
              },
            ],
            students: [
              {
                id: "shs1103",
                name: "Ana Reyes",
                image: "/placeholder.svg",
                quote: "Future teacher.",
                honors: "With High Honors",
              },
            ],
          },
        },
      },
    },
  },
  tvl: {
    name: "TVL",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "ms-lopez",
                name: "Ms. Elena Lopez",
                image: "/placeholder.svg",
                quote: "Skills are the currency of the future.",
              },
            ],
            students: [
              {
                id: "shs1104",
                name: "Carlos Martinez",
                image: "/placeholder.svg",
                quote: "Future technician.",
                honors: "With Honors",
              },
            ],
          },
        },
      },
    },
  },
  he: {
    name: "HE",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "ms-torres",
                name: "Ms. Rosa Torres",
                image: "/placeholder.svg",
                quote: "Home is where the heart is.",
              },
            ],
            students: [
              {
                id: "shs1105",
                name: "Liza Fernandez",
                image: "/placeholder.svg",
                quote: "Future chef.",
                honors: "With High Honors",
              },
            ],
          },
        },
      },
    },
  },
  ict: {
    name: "ICT",
    years: {
      "grade-11": {
        name: "Grade 11",
        sections: {
          "section-a": {
            name: "Section A",
            academicYear: "2024-2025",
            advisers: [
              {
                id: "mr-dela-cruz",
                name: "Mr. Jose Dela Cruz",
                image: "/placeholder.svg",
                quote: "Technology is the future.",
              },
            ],
            students: [
              {
                id: "shs1106",
                name: "Mark Villanueva",
                image: "/placeholder.svg",
                quote: "Future programmer.",
                honors: "With Honors",
              },
            ],
          },
        },
      },
    },
  },
}

export default function SeniorHighSectionPage({ 
  params 
}: { 
  params: { schoolYearId: string; strandId: string; yearId: string; sectionId: string } 
}) {
  const router = useRouter()

  const strand = (seniorHighData as any)[params.strandId]
  const year = strand?.years?.[params.yearId]
  // For now, we'll create a dummy section since the data structure is different
  const section = { name: params.sectionId.replace('section-', 'Section ').replace(/\b\w/g, l => l.toUpperCase()) }

  useEffect(() => {
    // Always redirect to yearbook, regardless of data structure
    router.replace(`/school-years-senior-high/${params.schoolYearId}/departments/senior-high/${params.strandId}/${params.yearId}/${params.sectionId}/yearbook`)
  }, [params.schoolYearId, params.strandId, params.yearId, params.sectionId, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to yearbook...</p>
      </div>
    </div>
  )
}
