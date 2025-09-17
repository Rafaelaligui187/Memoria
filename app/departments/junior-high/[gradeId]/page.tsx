"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users } from "lucide-react"
import { notFound } from "next/navigation"
import { useRouter } from "next/navigation"

const grades = {
  grade7: {
    name: "Grade 7",
    description: "First year of junior high school, focusing on transition from elementary to secondary education.",
    tagline: "EXPLORE, ACHIEVE, EXCEL",
    sections: [
      { id: "section-a", name: "Section A", students: 35, adviser: "Ms. Jennifer Lopez" },
      { id: "section-b", name: "Section B", students: 33, adviser: "Mr. Robert Johnson" },
      { id: "section-c", name: "Section C", students: 34, adviser: "Ms. Sarah Williams" },
      { id: "section-d", name: "Section D", students: 32, adviser: "Mr. Michael Brown" },
    ],
    color: "emerald",
    stats: { totalStudents: 134, sections: 4, subjects: 12 },
  },
  grade8: {
    name: "Grade 8",
    description: "Second year focusing on strengthening academic foundations and developing critical thinking skills.",
    tagline: "EXPLORE, ACHIEVE, EXCEL",
    sections: [
      { id: "section-a", name: "Section A", students: 36, adviser: "Ms. Patricia Davis" },
      { id: "section-b", name: "Section B", students: 34, adviser: "Mr. James Wilson" },
      { id: "section-c", name: "Section C", students: 35, adviser: "Ms. Linda Garcia" },
      { id: "section-d", name: "Section D", students: 33, adviser: "Mr. David Martinez" },
    ],
    color: "emerald",
    stats: { totalStudents: 138, sections: 4, subjects: 13 },
  },
  grade9: {
    name: "Grade 9",
    description: "Third year emphasizing advanced academic concepts and preparation for senior high school.",
    tagline: "EXPLORE, ACHIEVE, EXCEL",
    sections: [
      { id: "section-a", name: "Section A", students: 34, adviser: "Ms. Maria Rodriguez" },
      { id: "section-b", name: "Section B", students: 36, adviser: "Mr. Carlos Hernandez" },
      { id: "section-c", name: "Section C", students: 35, adviser: "Ms. Ana Lopez" },
    ],
    color: "emerald",
    stats: { totalStudents: 105, sections: 3, subjects: 14 },
  },
  grade10: {
    name: "Grade 10",
    description: "Final year of junior high school, preparing students for senior high school track selection.",
    tagline: "EXPLORE, ACHIEVE, EXCEL",
    sections: [
      { id: "section-a", name: "Section A", students: 35, adviser: "Ms. Carmen Gonzalez" },
      { id: "section-b", name: "Section B", students: 37, adviser: "Mr. Luis Perez" },
      { id: "section-c", name: "Section C", students: 34, adviser: "Ms. Rosa Sanchez" },
    ],
    color: "emerald",
    stats: { totalStudents: 106, sections: 3, subjects: 15 },
  },
}

export default function JuniorHighGradePage({ params }: { params: { gradeId: string } }) {
  const router = useRouter()
  const grade = grades[params.gradeId as keyof typeof grades]

  if (!grade) {
    notFound()
  }

  const handleBackClick = () => {
    router.push("/departments/junior-high")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Junior High Department
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">{grade.name}</h1>
          <p className="text-emerald-100 text-lg mb-6 tracking-widest">{grade.tagline}</p>
          <p className="text-emerald-100 max-w-2xl mx-auto text-lg">{grade.description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Sections & Classes</h2>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {grade.sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{section.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{section.students} Students Available</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link href={`/departments/junior-high/${params.gradeId}/${section.id}`}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium">
                    {section.name}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
