"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users } from "lucide-react"
import { notFound } from "next/navigation"
import { useRouter } from "next/navigation"

const grades = {
  grade1: {
    name: "Grade 1",
    description: "Foundation year focusing on basic literacy, numeracy, and social skills development.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 30, adviser: "Ms. Maria Santos" },
      { id: "section-b", name: "Section B", students: 28, adviser: "Ms. Ana Cruz" },
      { id: "section-c", name: "Section C", students: 32, adviser: "Ms. Rosa Garcia" },
    ],
    color: "sky",
    stats: { totalStudents: 90, sections: 3, subjects: 8 },
  },
  grade2: {
    name: "Grade 2",
    description: "Building upon foundational skills with enhanced reading, writing, and mathematical concepts.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 29, adviser: "Ms. Carmen Lopez" },
      { id: "section-b", name: "Section B", students: 31, adviser: "Ms. Elena Rodriguez" },
      { id: "section-c", name: "Section C", students: 28, adviser: "Ms. Sofia Martinez" },
    ],
    color: "sky",
    stats: { totalStudents: 88, sections: 3, subjects: 8 },
  },
  grade3: {
    name: "Grade 3",
    description: "Developing critical thinking skills and introducing more complex academic concepts.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 30, adviser: "Ms. Isabel Fernandez" },
      { id: "section-b", name: "Section B", students: 29, adviser: "Ms. Patricia Morales" },
      { id: "section-c", name: "Section C", students: 31, adviser: "Ms. Lucia Herrera" },
    ],
    color: "sky",
    stats: { totalStudents: 90, sections: 3, subjects: 9 },
  },
  grade4: {
    name: "Grade 4",
    description: "Strengthening academic foundations and introducing research and project-based learning.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 28, adviser: "Ms. Gabriela Jimenez" },
      { id: "section-b", name: "Section B", students: 30, adviser: "Ms. Valentina Castro" },
      { id: "section-c", name: "Section C", students: 29, adviser: "Ms. Natalia Vargas" },
    ],
    color: "sky",
    stats: { totalStudents: 87, sections: 3, subjects: 10 },
  },
  grade5: {
    name: "Grade 5",
    description: "Preparing students for middle school with advanced academic skills and leadership opportunities.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 31, adviser: "Ms. Andrea Gutierrez" },
      { id: "section-b", name: "Section B", students: 28, adviser: "Ms. Camila Ruiz" },
      { id: "section-c", name: "Section C", students: 30, adviser: "Ms. Victoria Mendez" },
    ],
    color: "sky",
    stats: { totalStudents: 89, sections: 3, subjects: 11 },
  },
  grade6: {
    name: "Grade 6",
    description: "Final elementary year focusing on transition readiness and comprehensive skill mastery.",
    tagline: "LEARN, GROW, DISCOVER",
    sections: [
      { id: "section-a", name: "Section A", students: 29, adviser: "Ms. Daniela Torres" },
      { id: "section-b", name: "Section B", students: 32, adviser: "Ms. Alejandra Silva" },
      { id: "section-c", name: "Section C", students: 27, adviser: "Ms. Mariana Ortega" },
    ],
    color: "sky",
    stats: { totalStudents: 88, sections: 3, subjects: 12 },
  },
}

export default function ElementaryGradePage({ params }: { params: { gradeId: string } }) {
  const router = useRouter()
  const grade = grades[params.gradeId as keyof typeof grades]

  if (!grade) {
    notFound()
  }

  const handleBackClick = () => {
    router.push("/departments/elementary")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button variant="ghost" onClick={handleBackClick} className="text-sky-600 hover:text-sky-700 hover:bg-sky-50">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Elementary Department
        </Button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-5xl font-bold mb-4">{grade.name}</h1>
          <p className="text-sky-100 text-lg mb-6 tracking-widest">{grade.tagline}</p>
          <p className="text-sky-100 max-w-2xl mx-auto text-lg">{grade.description}</p>
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
                <Link href={`/departments/elementary/${params.gradeId}/${section.id}`}>
                  <Button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg font-medium">
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
