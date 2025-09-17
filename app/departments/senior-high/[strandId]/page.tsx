"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users } from "lucide-react"
import { notFound } from "next/navigation"
import { useRouter } from "next/navigation"

const strands = {
  stem: {
    name: "STEM",
    fullName: "Science, Technology, Engineering, and Mathematics",
    description:
      "Preparing students for careers in information technology, software development, and digital innovation.",
    tagline: "BUILD, SOLVE, CONNECT",
    years: [
      {
        id: "grade-11",
        name: "Grade 11",
        sections: [
          { id: "section-a", name: "Section A", students: 38, adviser: "Dr. Michael Anderson" },
          { id: "section-b", name: "Section B", students: 36, adviser: "Prof. Lisa Chang" },
        ],
      },
      {
        id: "grade-12",
        name: "Grade 12",
        sections: [{ id: "section-a", name: "Section A", students: 35, adviser: "Dr. Robert Chen" }],
      },
    ],
    color: "amber",
    stats: { totalStudents: 109, sections: 3, subjects: 18 },
  },
  abm: {
    name: "ABM",
    fullName: "Accountancy, Business, and Management",
    description: "Preparing students for careers in business, entrepreneurship, and financial management.",
    tagline: "LEAD, INNOVATE, SUCCEED",
    years: [
      {
        id: "grade-11",
        name: "Grade 11",
        sections: [
          { id: "section-a", name: "Section A", students: 35, adviser: "Ms. Patricia Business" },
          { id: "section-b", name: "Section B", students: 33, adviser: "Mr. Carlos Finance" },
        ],
      },
      {
        id: "grade-12",
        name: "Grade 12",
        sections: [{ id: "section-a", name: "Section A", students: 34, adviser: "Ms. Maria Commerce" }],
      },
    ],
    color: "amber",
    stats: { totalStudents: 102, sections: 3, subjects: 16 },
  },
  humss: {
    name: "HUMSS",
    fullName: "Humanities and Social Sciences",
    description:
      "Developing critical thinking and communication skills through the study of humanities and social sciences.",
    tagline: "THINK, ANALYZE, COMMUNICATE",
    years: [
      {
        id: "grade-11",
        name: "Grade 11",
        sections: [{ id: "section-a", name: "Section A", students: 32, adviser: "Ms. Patricia Davis" }],
      },
      {
        id: "grade-12",
        name: "Grade 12",
        sections: [{ id: "section-a", name: "Section A", students: 30, adviser: "Mr. James Literature" }],
      },
    ],
    color: "amber",
    stats: { totalStudents: 62, sections: 2, subjects: 15 },
  },
  gas: {
    name: "GAS",
    fullName: "General Academic Strand",
    description:
      "Providing a broad foundation across various academic disciplines for students exploring different career paths.",
    tagline: "EXPLORE, DISCOVER, EXCEL",
    years: [
      {
        id: "grade-11",
        name: "Grade 11",
        sections: [{ id: "section-a", name: "Section A", students: 28, adviser: "Ms. Ana General" }],
      },
      {
        id: "grade-12",
        name: "Grade 12",
        sections: [{ id: "section-a", name: "Section A", students: 26, adviser: "Mr. Luis Academic" }],
      },
    ],
    color: "amber",
    stats: { totalStudents: 54, sections: 2, subjects: 14 },
  },
  tvl: {
    name: "TVL",
    fullName: "Technical-Vocational-Livelihood",
    description:
      "Developing technical and vocational skills for immediate employment or entrepreneurship opportunities.",
    tagline: "CREATE, BUILD, ACHIEVE",
    years: [
      {
        id: "grade-11",
        name: "Grade 11",
        sections: [{ id: "section-a", name: "Section A", students: 30, adviser: "Mr. Technical Vocational" }],
      },
      {
        id: "grade-12",
        name: "Grade 12",
        sections: [{ id: "section-a", name: "Section A", students: 28, adviser: "Ms. Skills Development" }],
      },
    ],
    color: "amber",
    stats: { totalStudents: 58, sections: 2, subjects: 16 },
  },
  arts: {
    name: "Arts and Design",
    fullName: "Arts and Design Track",
    description: "Nurturing creativity and artistic expression through various forms of visual and performing arts.",
    tagline: "CREATE, INSPIRE, EXPRESS",
    years: [
      {
        id: "grade-11",
        name: "Grade 11",
        sections: [{ id: "section-a", name: "Section A", students: 25, adviser: "Ms. Creative Arts" }],
      },
      {
        id: "grade-12",
        name: "Grade 12",
        sections: [{ id: "section-a", name: "Section A", students: 23, adviser: "Mr. Design Studio" }],
      },
    ],
    color: "amber",
    stats: { totalStudents: 48, sections: 2, subjects: 17 },
  },
}

export default function SeniorHighStrandPage({ params }: { params: { strandId: string } }) {
  const router = useRouter()
  const strand = strands[params.strandId as keyof typeof strands]

  if (!strand) {
    notFound()
  }

  const handleBackClick = () => {
    router.push("/departments/senior-high")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Senior High Department
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">{strand.name}</h1>
          <p className="text-amber-100 text-lg mb-6 tracking-widest">{strand.tagline}</p>
          <p className="text-amber-100 max-w-2xl mx-auto text-lg">{strand.description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Year Levels & Blocks</h2>
        </div>

        {/* Year Levels & Sections */}
        <div className="space-y-6">
          {strand.years.map((year) => (
            <div
              key={year.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{year.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{year.sections.length} Blocks Available</span>
                </div>
              </div>
              <div className="flex space-x-3">
                {year.sections.map((section) => (
                  <Link key={section.id} href={`/departments/senior-high/${params.strandId}/${year.id}/${section.id}`}>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium">
                      Block {section.name.split(" ")[1]}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
