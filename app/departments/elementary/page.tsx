"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ElementaryDepartmentPage() {

  // Mock data - replace with actual data fetching
  const grades = [
    {
      id: "grade1",
      name: "Grade 1",
      sections: 4,
      students: 120,
      image: "/placeholder.svg?height=200&width=300&text=Grade+1",
    },
    {
      id: "grade2",
      name: "Grade 2",
      sections: 4,
      students: 118,
      image: "/placeholder.svg?height=200&width=300&text=Grade+2",
    },
    {
      id: "grade3",
      name: "Grade 3",
      sections: 3,
      students: 90,
      image: "/placeholder.svg?height=200&width=300&text=Grade+3",
    },
    {
      id: "grade4",
      name: "Grade 4",
      sections: 3,
      students: 92,
      image: "/placeholder.svg?height=200&width=300&text=Grade+4",
    },
    {
      id: "grade5",
      name: "Grade 5",
      sections: 3,
      students: 88,
      image: "/placeholder.svg?height=200&width=300&text=Grade+5",
    },
    {
      id: "grade6",
      name: "Grade 6",
      sections: 3,
      students: 85,
      image: "/placeholder.svg?height=200&width=300&text=Grade+6",
    },
  ]

  const academicYears: string[] = []

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-sky-600 to-blue-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Elementary Department</h1>
          <p className="mt-6 max-w-3xl text-xl">
            Building a strong foundation for lifelong learning through creativity, curiosity, and character development.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-sky-800">
              Department Handbook
            </Button>
          </div>
        </div>
      </div>

      {/* Grade Levels Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <span className="bg-sky-600 w-2 h-8 mr-3 rounded"></span>
          Grade Levels
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {grades.map((grade) => (
            <Link key={grade.id} href={`/departments/elementary/${grade.id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 border border-sky-100 h-full flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img
                    src={grade.image || "/placeholder.svg"}
                    alt={grade.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{grade.name}</h3>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>{grade.sections} Sections</span>
                    <span>{grade.students} Students</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-sky-100">
                    <Button className="w-full bg-sky-600 hover:bg-sky-700">View Classes</Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-sky-600 w-2 h-8 mr-3 rounded"></span>
                About Our Elementary Department
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our Elementary Department provides a nurturing environment where young minds are encouraged to explore,
                discover, and grow. We focus on developing essential academic skills while fostering creativity,
                critical thinking, and character development.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With dedicated teachers and a comprehensive curriculum, we ensure that each child receives the attention
                and guidance they need to thrive academically and personally.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100 flex items-center">
                  <div className="bg-sky-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-sky-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Comprehensive Curriculum</h3>
                    <p className="text-sm text-gray-600">Aligned with national standards</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100 flex items-center">
                  <div className="bg-sky-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-sky-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Small Class Sizes</h3>
                    <p className="text-sm text-gray-600">Personalized attention for each student</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-sky-100 flex items-center">
                  <div className="bg-sky-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-sky-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Holistic Development</h3>
                    <p className="text-sm text-gray-600">Focus on academic, social, and emotional growth</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <img
                src="/placeholder.svg?height=400&width=600&text=Elementary+Students"
                alt="Elementary Students"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}