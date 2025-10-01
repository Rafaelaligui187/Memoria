"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen } from "lucide-react"

import { Card } from "@/components/ui/card"
import { PublicHeader } from "@/components/public-header"

// Junior High Faculty data
const facultyData = [
  {
    id: 201,
    name: "Dr. Ricardo Mendoza",
    position: "Junior High School Principal",
    photo: "/placeholder.svg?height=300&width=300&text=Dr.+Mendoza",
    email: "ricardo.mendoza@example.com",
    phone: "(123) 456-8101",
    education: "Ed.D. in Educational Leadership, University of the Philippines",
    bio: "Dr. Mendoza has been leading the Junior High School for 10 years, implementing innovative teaching methods and curriculum improvements.",
  },
  {
    id: 202,
    name: "Ms. Jasmine Santos",
    position: "Grade 7 Level Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Ms.+Santos",
    email: "jasmine.santos@example.com",
    phone: "(123) 456-8102",
    education: "Master's in Education, Cebu Normal University",
    bio: "Ms. Santos specializes in helping students transition from elementary to junior high school education.",
  },
  {
    id: 203,
    name: "Mr. Gabriel Cruz",
    position: "Grade 8 Level Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Cruz",
    email: "gabriel.cruz@example.com",
    phone: "(123) 456-8103",
    education: "Master's in Educational Psychology, University of San Carlos",
    bio: "Mr. Cruz focuses on developing critical thinking skills and fostering independence in Grade 8 students.",
  },
  {
    id: 204,
    name: "Ms. Isabella Lim",
    position: "Grade 9 Level Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Ms.+Lim",
    email: "isabella.lim@example.com",
    phone: "(123) 456-8104",
    education: "Master's in Curriculum Development, De La Salle University",
    bio: "Ms. Lim designs engaging curriculum that prepares students for the challenges of upper junior high school.",
  },
  {
    id: 205,
    name: "Mr. Rafael Garcia",
    position: "Grade 10 Level Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Garcia",
    email: "rafael.garcia@example.com",
    phone: "(123) 456-8105",
    education: "Master's in Educational Administration, University of San Jose-Recoletos",
    bio: "Mr. Garcia prepares Grade 10 students for the transition to senior high school through career guidance and academic excellence.",
  },
  {
    id: 206,
    name: "Ms. Olivia Tan",
    position: "English Department Head",
    photo: "/placeholder.svg?height=300&width=300&text=Ms.+Tan",
    email: "olivia.tan@example.com",
    phone: "(123) 456-8106",
    education: "Master's in English Literature, University of the Philippines",
    bio: "Ms. Tan develops language and communication skills through literature and creative writing activities.",
  },
  {
    id: 207,
    name: "Mr. Samuel Fernandez",
    position: "Mathematics Department Head",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Fernandez",
    email: "samuel.fernandez@example.com",
    phone: "(123) 456-8107",
    education: "Master's in Mathematics Education, Philippine Normal University",
    bio: "Mr. Fernandez makes mathematics engaging through real-world applications and problem-solving activities.",
  },
  {
    id: 208,
    name: "Ms. Sofia Reyes",
    position: "Science Department Head",
    photo: "/placeholder.svg?height=300&width=300&text=Ms.+Reyes",
    email: "sofia.reyes@example.com",
    phone: "(123) 456-8108",
    education: "Master's in Science Education, University of San Carlos",
    bio: "Ms. Reyes inspires scientific inquiry through laboratory experiments and research projects.",
  },
  {
    id: 209,
    name: "Mr. Miguel Santos",
    position: "Social Studies Department Head",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Santos",
    email: "miguel.santos@example.com",
    phone: "(123) 456-8109",
    education: "Master's in History, University of Cebu",
    bio: "Mr. Santos brings history to life through interactive lessons and field trips to historical sites.",
  },
]

export default function JuniorHighFacultyPage() {
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
            <Link href="/departments/junior-high" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-900 font-medium">Junior High School Faculty</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Junior High School Faculty</h1>
            <p className="text-gray-600">
              Meet our dedicated junior high school teachers who guide students through these formative years
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
