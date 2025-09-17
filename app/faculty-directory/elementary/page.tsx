"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen } from "lucide-react"

import { Card } from "@/components/ui/card"
import { PublicHeader } from "@/components/public-header"

// Elementary Faculty data
const facultyData = [
  {
    id: 101,
    name: "Ms. Patricia Reyes",
    position: "Elementary Department Head",
    photo: "/placeholder.svg?height=300&width=300&text=Ms.+Reyes",
    email: "patricia.reyes@example.com",
    phone: "(123) 456-8001",
    education: "Master's in Elementary Education, University of San Carlos",
    bio: "Ms. Reyes has been leading the Elementary Department for 8 years, implementing innovative teaching methods and curriculum improvements.",
  },
  {
    id: 102,
    name: "Mr. Benjamin Santos",
    position: "Grade 1-2 Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Santos",
    email: "benjamin.santos@example.com",
    phone: "(123) 456-8002",
    education: "Bachelor's in Elementary Education, Cebu Normal University",
    bio: "Mr. Santos specializes in early childhood education and has developed several programs to enhance learning experiences for young students.",
  },
  {
    id: 103,
    name: "Ms. Angela Cruz",
    position: "Grade 3-4 Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Ms.+Cruz",
    email: "angela.cruz@example.com",
    phone: "(123) 456-8003",
    education: "Master's in Child Psychology, University of the Philippines",
    bio: "Ms. Cruz brings her expertise in child psychology to develop age-appropriate learning strategies for elementary students.",
  },
  {
    id: 104,
    name: "Mr. Daniel Lim",
    position: "Grade 5-6 Coordinator",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Lim",
    email: "daniel.lim@example.com",
    phone: "(123) 456-8004",
    education: "Master's in Educational Technology, De La Salle University",
    bio: "Mr. Lim integrates technology into the classroom to prepare upper elementary students for the challenges of junior high school.",
  },
  {
    id: 105,
    name: "Ms. Sophia Garcia",
    position: "English Teacher",
    photo: "/placeholder.svg?height=300&width=300&text=Ms.+Garcia",
    email: "sophia.garcia@example.com",
    phone: "(123) 456-8005",
    education: "Bachelor's in English Education, University of San Jose-Recoletos",
    bio: "Ms. Garcia makes learning English fun and engaging through creative activities and storytelling.",
  },
  {
    id: 106,
    name: "Mr. Joseph Tan",
    position: "Mathematics Teacher",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Tan",
    email: "joseph.tan@example.com",
    phone: "(123) 456-8006",
    education: "Bachelor's in Mathematics Education, University of Cebu",
    bio: "Mr. Tan uses practical examples and hands-on activities to make mathematics accessible and enjoyable for elementary students.",
  },
  {
    id: 107,
    name: "Ms. Maria Fernandez",
    position: "Science Teacher",
    photo: "/placeholder.svg?height=300&width=300&text=Ms.+Fernandez",
    email: "maria.fernandez@example.com",
    phone: "(123) 456-8007",
    education: "Master's in Science Education, Philippine Normal University",
    bio: "Ms. Fernandez inspires young scientists through interactive experiments and nature exploration activities.",
  },
  {
    id: 108,
    name: "Mr. Antonio Reyes",
    position: "Filipino Teacher",
    photo: "/placeholder.svg?height=300&width=300&text=Mr.+Reyes",
    email: "antonio.reyes@example.com",
    phone: "(123) 456-8008",
    education: "Bachelor's in Filipino Education, University of San Carlos",
    bio: "Mr. Reyes promotes Filipino language and culture through engaging lessons and cultural activities.",
  },
]

export default function ElementaryFacultyPage() {
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
            <Link href="/departments/elementary" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-900 font-medium">Elementary Faculty</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Elementary Department Faculty</h1>
            <p className="text-gray-600">Meet our dedicated elementary school teachers who nurture young minds</p>
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
