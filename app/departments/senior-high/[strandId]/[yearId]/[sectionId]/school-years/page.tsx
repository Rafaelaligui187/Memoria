"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Calendar, LogOut, Menu, X, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SchoolYear {
  id: string
  label: string
  status: "active" | "archived" | "draft"
  startDate: string
  endDate: string
}

export default function SeniorHighSchoolYearSelectionPage({
  params,
}: {
  params: { strandId: string; yearId: string; sectionId: string }
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [loading, setLoading] = useState(true)

  // Map strand IDs to their display names
  const strandNames: Record<string, string> = {
    stem: "STEM",
    abm: "ABM",
    humss: "HUMSS",
    gas: "GAS",
    tvl: "TVL",
    arts: "Arts and Design",
  }

  // Map year IDs to their display names
  const yearNames: Record<string, string> = {
    grade11: "Grade 11",
    grade12: "Grade 12",
  }

  // Map section IDs to their display names
  const sectionNames: Record<string, string> = {
    "section-a": "Section A",
    "section-b": "Section B",
    "section-c": "Section C",
    "section-d": "Section D",
  }

  const strandName = strandNames[params.strandId] || "Strand"
  const yearName = yearNames[params.yearId] || "Year"
  const sectionName = sectionNames[params.sectionId] || "Section"

  useEffect(() => {
    const fetchSchoolYears = async () => {
      try {
        const response = await fetch("/api/admin/years")
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // Sort years by start date, most recent first
            const sortedYears = data.data.sort(
              (a: SchoolYear, b: SchoolYear) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
            )
            setSchoolYears(sortedYears)
          }
        }
      } catch (error) {
        console.error("Failed to fetch school years:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchoolYears()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-amber-600" />
              <span className="text-xl font-bold text-amber-600">Memoria</span>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading school years...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-amber-600" />
            <span className="text-xl font-bold text-amber-600">Memoria</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-amber-600 transition-colors">
              Home
            </Link>
            <Link href="/gallery" className="text-sm font-medium hover:text-amber-600 transition-colors">
              Gallery
            </Link>
            <Link href="/memory-wall" className="text-sm font-medium hover:text-amber-600 transition-colors">
              Memory Wall
            </Link>
            <div className="flex items-center gap-2 border-l pl-4 ml-2">
              <div className="bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center text-amber-600 font-bold">
                J
              </div>
              <span className="text-sm font-medium">John Doe</span>
            </div>
            <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent">
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
              <Link href="/dashboard" className="text-sm font-medium hover:text-amber-600">
                Home
              </Link>
              <Link href="/gallery" className="text-sm font-medium hover:text-amber-600">
                Gallery
              </Link>
              <Link href="/memory-wall" className="text-sm font-medium hover:text-amber-600">
                Memory Wall
              </Link>
              <div className="flex items-center gap-2 py-2 border-t">
                <div className="bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center text-amber-600 font-bold">
                  J
                </div>
                <span className="text-sm font-medium">John Doe</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-600 text-red-600 hover:bg-red-50 w-full bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 py-10">
        <div className="container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link
              href={`/departments/senior-high/${params.strandId}/${params.yearId}`}
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/departments/senior-high" className="text-amber-600 hover:text-amber-800 transition-colors">
              Senior High
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href={`/departments/senior-high/${params.strandId}`}
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              {strandName}
            </Link>
            <span className="text-gray-600">/</span>
            <Link
              href={`/departments/senior-high/${params.strandId}/${params.yearId}`}
              className="text-amber-600 hover:text-amber-800 transition-colors"
            >
              {yearName}
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-gray-900 font-medium">{sectionName}</span>
          </div>

          {/* Header Section */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 flex items-center justify-center text-white text-2xl flex-shrink-0">
                <Calendar className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Select School Year</h1>
                <p className="text-gray-600">
                  Choose a school year to view the yearbook for {strandName} {yearName} - {sectionName}
                </p>
              </div>
            </div>
          </div>

          {/* School Years Grid */}
          {schoolYears.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schoolYears.map((year) => (
                <Link
                  href={`/departments/senior-high/${params.strandId}/${params.yearId}/${params.sectionId}/${year.id}`}
                  key={year.id}
                >
                  <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] h-full border-0 shadow-md">
                    <div className="relative h-32">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-600/90 to-yellow-600/90 z-10"></div>
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-20"></div>
                      <div className="absolute top-4 left-4 z-20">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            year.status === "active"
                              ? "bg-green-500/20 text-green-100 border border-green-400/30"
                              : year.status === "archived"
                                ? "bg-gray-500/20 text-gray-100 border border-gray-400/30"
                                : "bg-yellow-500/20 text-yellow-100 border border-yellow-400/30"
                          }`}
                        >
                          {year.status.charAt(0).toUpperCase() + year.status.slice(1)}
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <h3 className="text-white font-bold text-xl">{year.label}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-white text-xs flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(year.startDate).getFullYear()} - {new Date(year.endDate).getFullYear()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-gray-900">Academic Year:</p>
                          <p className="text-sm text-gray-700">{year.label}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-gray-900">Period:</p>
                          <p className="text-sm text-gray-700">
                            {new Date(year.startDate).toLocaleDateString()} -{" "}
                            {new Date(year.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <span className="text-amber-600 font-medium text-sm flex items-center">
                          View Yearbook
                          <Users className="h-4 w-4 ml-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No yearbooks available for this section yet.</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                School years will appear here once they are added by the administration. Please check back later.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-bold text-amber-600">Memoria</span>
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
