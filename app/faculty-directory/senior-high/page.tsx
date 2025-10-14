"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen } from "lucide-react"

import { Card } from "@/components/ui/card"
import { PublicHeader } from "@/components/public-header"

// Senior High Faculty data
const facultyData = [
  {
    id: 301,
    name: "Dr. Victoria Gonzales",
    position: "Senior High School Principal",
    photo: "/placeholder.svg?height=300&width=300&text=Dr.+Gonzales",
    email: "victoria.gonzales@example.com",
    phone: "(123) 456-8201",
    education: "Ph.D. in Educational Administration, University of the Philippines",
    bio: "Dr. Gonzales has been leading the Senior High School since its inception, developing a curriculum that prepares students for college and career.",
  },
  {
    id: 302,
    name: "Mr. Alexander Santos",
    position: "STEM Strand Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Santos",
    email: "alexander.santos@example.com",
    phone: "(123) 456-8202",
    education: "Master's in Physics, Ateneo de Manila University",
    bio: "Mr. Santos oversees the STEM curriculum, ensuring students receive rigorous preparation for science and technology careers.",
  },
  {
    id: 303,
    name: "Ms. Camille Cruz",
    position: "ABM Strand Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Ms.+Cruz",
    email: "camille.cruz@example.com",
    phone: "(123) 456-8203",
    education: "MBA, Asian Institute of Management",
    bio: "Ms. Cruz brings her business expertise to the ABM strand, preparing students for careers in business and finance.",
  },
  {
    id: 304,
    name: "Mr. Nathan Lim",
    position: "HUMSS Strand Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Lim",
    email: "nathan.lim@example.com",
    phone: "(123) 456-8204",
    education: "Master's in Philosophy, University of San Carlos",
    bio: "Mr. Lim guides HUMSS students in developing critical thinking and communication skills for careers in the humanities and social sciences.",
  },
  {
    id: 306,
    name: "Mr. Diego Tan",
    position: "TVL Strand Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Tan",
    email: "diego.tan@example.com",
    phone: "(123) 456-8206",
    education: "Bachelor's in Industrial Technology, Technological University of the Philippines",
    bio: "Mr. Tan oversees technical-vocational education, ensuring students develop practical skills for immediate employment.",
  },
  {
    id: 307,
    name: "Ms. Carmen Lopez",
    position: "HE Strand Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Ms.+Lopez",
    email: "carmen.lopez@example.com",
    phone: "(123) 456-8207",
    education: "Master's in Home Economics, University of the Philippines",
    bio: "Ms. Lopez leads the Home Economics strand, focusing on culinary arts, hospitality, and family sciences education.",
  },
  {
    id: 308,
    name: "Mr. Miguel Torres",
    position: "ICT Strand Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Torres",
    email: "miguel.torres@example.com",
    phone: "(123) 456-8208",
    education: "Master's in Information Technology, University of San Carlos",
    bio: "Mr. Torres leads the ICT strand, focusing on programming, web development, cybersecurity, and digital innovation.",
  },
  {
    id: 309,
    name: "Dr. Marco Reyes",
    position: "Research Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Dr.+Reyes",
    email: "marco.reyes@example.com",
    phone: "(123) 456-8209",
    education: "Ph.D. in Research Methodology, University of San Carlos",
    bio: "Dr. Reyes guides senior high school students in conducting research projects across all strands.",
  },
  {
    id: 310,
    name: "Ms. Olivia Santos",
    position: "Career Guidance Counselor",
    photo: "/placeholder.svg?height=300&width=300&text=Ms.+Santos",
    email: "olivia.santos@example.com",
    phone: "(123) 456-8209",
    education: "Master's in Guidance and Counseling, University of Santo Tomas",
    bio: "Ms. Santos helps students make informed decisions about college and career paths through assessments and counseling.",
  },
]

export default function SeniorHighFacultyPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter faculty based on search query
  const filteredFaculty = facultyData.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.position.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 py-10 bg-gray-50">
        <div className="container">
          <div className="flex items-center gap-2 mb-8">
            <Link href="/departments/senior-high" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-900 font-medium">Senior High School Faculty</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Senior High School Faculty</h1>
            <p className="text-gray-600">
              Meet our dedicated senior high school teachers who prepare students for college and career
            </p>
          </div>

          {/* Faculty Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((faculty) => (
              <Link href={`/faculty/${faculty.id}`} key={faculty.id}>
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-blue-300 h-full">
                  <div className="p-6">
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="relative w-32 h-32 mb-4">
                        <Image
                          src={faculty.photo || "/placeholder.svg"}
                          alt={faculty.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                      <h3 className="font-bold text-xl">{faculty.name}</h3>
                      <p className="text-blue-600 text-sm">{faculty.position}</p>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-700 line-clamp-3">{faculty.bio}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-600">Memoria</span>
            </div>
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Consolatrix College of Toledo City, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
