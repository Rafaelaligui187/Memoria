"use client"

import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"
import { notFound } from "next/navigation"

const grades = {
  "grade-7": {
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
  "grade-8": {
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
  "grade-9": {
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
  "grade-10": {
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
  const grade = grades[params.gradeId as keyof typeof grades]

  if (!grade) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Back Button (matching Elementary style) */}
      <div className="bg-white border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/departments/junior-high"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Junior High Department
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-green-700 py-24 px-4 sm:px-6 lg:px-8 text-white">
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">{grade.name}</h1>
          <p className="text-2xl font-light tracking-widest text-emerald-100">{grade.tagline}</p>
          <p className="mt-8 max-w-3xl mx-auto text-xl text-emerald-50">{grade.description}</p>
        </div>
      </div>

      {/* Sections List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Year Level & Sections</h2>
        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{grade.name}</h3>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>
                    {grade.sections.length} Section{grade.sections.length > 1 ? "s" : ""} Available
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {grade.sections.map((section) => (
                  <Link key={section.id} href={`/departments/junior-high/${params.gradeId}/${section.id}`}>
                    <div className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105">
                      {section.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
