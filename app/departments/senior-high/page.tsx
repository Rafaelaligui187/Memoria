"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SeniorHighDepartmentPage() {

  // Mock data - replace with actual data fetching
  const strands = [
    {
      id: "stem",
      name: "STEM",
      fullName: "Science, Technology, Engineering, and Mathematics",
      students: 180,
      image: "/placeholder.svg?height=200&width=300&text=STEM",
    },
    {
      id: "abm",
      name: "ABM",
      fullName: "Accountancy, Business, and Management",
      students: 150,
      image: "/placeholder.svg?height=200&width=300&text=ABM",
    },
    {
      id: "humss",
      name: "HUMSS",
      fullName: "Humanities and Social Sciences",
      students: 120,
      image: "/placeholder.svg?height=200&width=300&text=HUMSS",
    },
    {
      id: "gas",
      name: "GAS",
      fullName: "General Academic Strand",
      students: 90,
      image: "/placeholder.svg?height=200&width=300&text=GAS",
    },
    {
      id: "tvl",
      name: "TVL",
      fullName: "Technical-Vocational-Livelihood",
      students: 100,
      image: "/placeholder.svg?height=200&width=300&text=TVL",
    },
    {
      id: "arts",
      name: "Arts and Design",
      fullName: "Arts and Design Track",
      students: 60,
      image: "/placeholder.svg?height=200&width=300&text=Arts+and+Design",
    },
  ]

  const academicYears: string[] = []

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 to-yellow-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[url('/placeholder.svg?height=500&width=1000&text=Pattern')] bg-repeat"></div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Senior High School Department</h1>
          <p className="mt-6 max-w-3xl text-xl">
            Preparing students for college and career through specialized academic tracks and holistic development.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-amber-800">
              Department Handbook
            </Button>
          </div>
        </div>
      </div>

      {/* Academic Strands Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <span className="bg-amber-600 w-2 h-8 mr-3 rounded"></span>
          Academic Strands
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {strands.map((strand) => (
            <Link key={strand.id} href={`/departments/senior-high/${strand.id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 border border-amber-100 h-full flex flex-col">
                <div className="h-40 overflow-hidden">
                  <img
                    src={strand.image || "/placeholder.svg"}
                    alt={strand.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{strand.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{strand.fullName}</p>
                  <p className="text-sm text-gray-600 mb-4">{strand.students} Students</p>
                  <div className="mt-4 pt-4 border-t border-amber-100">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700">View Strand</Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-amber-600 w-2 h-8 mr-3 rounded"></span>
                About Our Senior High School Department
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our Senior High School Department offers specialized academic tracks designed to prepare students for
                college and career. Through a comprehensive curriculum and hands-on learning experiences, we help
                students discover their passions and develop the skills they need to succeed in their chosen fields.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With dedicated teachers and industry partnerships, we ensure that our students receive quality education
                and real-world exposure that will give them a competitive edge in college and beyond.
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Industry Partnerships</h3>
                    <p className="text-sm text-gray-600">Connections with leading companies</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-amber-600"
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
                    <h3 className="font-semibold text-gray-900">Specialized Curriculum</h3>
                    <p className="text-sm text-gray-600">Tailored to each academic track</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100 flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">College Preparation</h3>
                    <p className="text-sm text-gray-600">Guidance for college applications and career planning</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <img
                src="/placeholder.svg?height=400&width=600&text=Senior+High+Students"
                alt="Senior High Students"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
