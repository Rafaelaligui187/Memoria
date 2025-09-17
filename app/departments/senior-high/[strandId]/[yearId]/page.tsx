"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, LogOut, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SeniorHighStrandYearPage({
  params,
}: {
  params: { strandId: string; yearId: string }
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Map strand IDs to their display names and full names
  const strandInfo: Record<string, { name: string; fullName: string }> = {
    stem: {
      name: "STEM",
      fullName: "Science, Technology, Engineering, and Mathematics",
    },
    abm: {
      name: "ABM",
      fullName: "Accountancy, Business, and Management",
    },
    humss: {
      name: "HUMSS",
      fullName: "Humanities and Social Sciences",
    },
    gas: {
      name: "GAS",
      fullName: "General Academic Strand",
    },
    tvl: {
      name: "TVL",
      fullName: "Technical-Vocational-Livelihood",
    },
    arts: {
      name: "Arts and Design",
      fullName: "Arts and Design Track",
    },
  }

  // Map year IDs to their display names
  const yearNames: Record<string, string> = {
    grade11: "Grade 11",
    grade12: "Grade 12",
  }

  const strandName = strandInfo[params.strandId]?.name || "Strand"
  const strandFullName = strandInfo[params.strandId]?.fullName || "Senior High School Strand"
  const yearName = yearNames[params.yearId] || "Year"

  // Sample sections for the selected strand and year
  const sections = [
    {
      id: "section-a",
      name: "Section A",
      description: `${yearName} ${strandName} students in Section A`,
      image: `/placeholder.svg?height=200&width=400&text=${strandName}+${yearName}+Section+A`,
      adviser: "Ms. Maria Santos",
    },
    {
      id: "section-b",
      name: "Section B",
      description: `${yearName} ${strandName} students in Section B`,
      image: `/placeholder.svg?height=200&width=400&text=${strandName}+${yearName}+Section+B`,
      adviser: "Mr. John Reyes",
    },
    {
      id: "section-c",
      name: "Section C",
      description: `${yearName} ${strandName} students in Section C`,
      image: `/placeholder.svg?height=200&width=400&text=${strandName}+${yearName}+Section+C`,
      adviser: "Ms. Anna Cruz",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">Memoria</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600">
              Home
            </Link>
            <Link href="/gallery" className="text-sm font-medium hover:text-blue-600">
              Gallery
            </Link>
            <Link href="/memory-wall" className="text-sm font-medium hover:text-blue-600">
              Memory Wall
            </Link>
            <div className="flex items-center gap-2 border-l pl-4 ml-2">
              <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold">
                J
              </div>
              <span className="text-sm font-medium">John Doe</span>
            </div>
            <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 px-6 bg-white">
            <nav className="flex flex-col space-y-4">
              <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600">
                Home
              </Link>
              <Link href="/gallery" className="text-sm font-medium hover:text-blue-600">
                Gallery
              </Link>
              <Link href="/memory-wall" className="text-sm font-medium hover:text-blue-600">
                Memory Wall
              </Link>
              <div className="flex items-center gap-2 py-2 border-t">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center text-blue-600 font-bold">
                  J
                </div>
                <span className="text-sm font-medium">John Doe</span>
              </div>
              <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50 w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 py-10 bg-gray-50">
        <div className="container">
          <div className="flex items-center gap-2 mb-8">
            <Link href={`/departments/senior-high/${params.strandId}`} className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/departments/senior-high" className="text-blue-600 hover:text-blue-800">
              Senior High
            </Link>
            <span className="text-gray-600">/</span>
            <Link href={`/departments/senior-high/${params.strandId}`} className="text-blue-600 hover:text-blue-800">
              {strandName}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-900 font-medium">{yearName}</span>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {strandName} - {yearName}
            </h1>
            <p className="text-gray-600">Select a section to view students</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Link
                href={`/departments/senior-high/${params.strandId}/${params.yearId}/${section.id}`}
                key={section.id}
              >
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-blue-300 h-full">
                  <div className="relative h-48">
                    <Image src={section.image || "/placeholder.svg"} alt={section.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <h3 className="text-white font-bold text-xl p-4">{section.name}</h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-gray-600 text-sm mb-2">{section.description}</p>
                    <p className="text-sm font-medium">Adviser: {section.adviser}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Year Highlights */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {strandName} - {yearName} Highlights
            </h2>
            <div className="bg-white p-6 rounded-lg border">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-4">Academic Achievements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>
                        {params.strandId === "stem" && "First Place in the Regional Science Quiz Bowl"}
                        {params.strandId === "abm" && "Champion in the Business Plan Competition"}
                        {params.strandId === "humss" && "Best Research Paper in Social Sciences"}
                        {params.strandId === "gas" && "Excellence in Academic Performance"}
                        {params.strandId === "tvl" && "Skills Competition Gold Medalist"}
                        {params.strandId === "arts" && "Best in Visual Arts Exhibition"}
                        {!params.strandId && "Academic Excellence Award"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>
                        {params.strandId === "stem" && "Robotics Competition Finalist"}
                        {params.strandId === "abm" && "Young Entrepreneurs Challenge Winner"}
                        {params.strandId === "humss" && "Champion in Debate Competition"}
                        {params.strandId === "gas" && "Best in Research and Project Development"}
                        {params.strandId === "tvl" && "Technical Skills Excellence Award"}
                        {params.strandId === "arts" && "Digital Arts Competition Winner"}
                        {!params.strandId && "Research Excellence Award"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>
                        {params.strandId === "stem" && "Mathematics Olympiad Medalist"}
                        {params.strandId === "abm" && "Accounting Quiz Bee Champion"}
                        {params.strandId === "humss" && "Essay Writing Contest Winner"}
                        {params.strandId === "gas" && "Academic Quiz Bowl Finalist"}
                        {params.strandId === "tvl" && "Best in Work Immersion"}
                        {params.strandId === "arts" && "Best in Traditional Arts Category"}
                        {!params.strandId && "Leadership Excellence Award"}
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4">Special Activities</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>
                        {params.strandId === "stem" && "Science and Technology Fair"}
                        {params.strandId === "abm" && "Business Summit and Networking Event"}
                        {params.strandId === "humss" && "Social Issues Forum"}
                        {params.strandId === "gas" && "Career Exploration Week"}
                        {params.strandId === "tvl" && "Skills Demonstration Day"}
                        {params.strandId === "arts" && "Arts and Design Exhibition"}
                        {!params.strandId && "Field Trip and Industry Visit"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>
                        {params.strandId === "stem" && "Industry Immersion in Tech Companies"}
                        {params.strandId === "abm" && "Financial Literacy Workshop"}
                        {params.strandId === "humss" && "Community Outreach Program"}
                        {params.strandId === "gas" && "College Readiness Seminar"}
                        {params.strandId === "tvl" && "Industry Partnership Program"}
                        {params.strandId === "arts" && "Creative Workshop Series"}
                        {!params.strandId && "Community Service Project"}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>
                        {params.strandId === "stem" && "Research Symposium"}
                        {params.strandId === "abm" && "Business Case Competition"}
                        {params.strandId === "humss" && "Cultural Awareness Program"}
                        {params.strandId === "gas" && "Academic Excellence Recognition"}
                        {params.strandId === "tvl" && "Skills Enhancement Workshop"}
                        {params.strandId === "arts" && "Collaborative Art Installation"}
                        {!params.strandId && "Academic Conference Participation"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
