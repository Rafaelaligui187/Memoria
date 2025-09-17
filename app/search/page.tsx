"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Calendar, FileText, LogOut, Menu, MessageCircle, Search, User, Users, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function SearchPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>({
    students: [],
    faculty: [],
    gallery: [],
    memories: [],
  })
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  // Get the search query from URL on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get("q")
    if (query) {
      setSearchQuery(query)
      handleSearch(query)
    }
  }, [])

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults({
        students: [],
        faculty: [],
        gallery: [],
        memories: [],
      })
      return
    }

    setIsSearching(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${activeTab}`)
      const data = await response.json()
      setSearchResults(data.results)
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Error",
        description: "An error occurred while searching. Please try again.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)

    // Update URL with search query
    const url = new URL(window.location.href)
    url.searchParams.set("q", searchQuery)
    window.history.pushState({}, "", url.toString())
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    handleSearch(searchQuery)
  }

  // Count total results
  const totalResults =
    (searchResults.students?.length || 0) +
    (searchResults.faculty?.length || 0) +
    (searchResults.gallery?.length || 0) +
    (searchResults.memories?.length || 0)

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
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Yearbook</h1>
            <p className="text-gray-600">Find students, faculty, photos, and memories</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search by name, department, course, etc."
                  className="pl-10 h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 h-12" disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>

          {/* Search Results */}
          {searchQuery && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isSearching ? "Searching..." : `Search Results for "${searchQuery}"`}
                </h2>
                <p className="text-gray-600">{totalResults} results found</p>
              </div>

              <Tabs defaultValue="all" className="mb-10" onValueChange={handleTabChange}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Results</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="faculty">Faculty</TabsTrigger>
                  <TabsTrigger value="gallery">Gallery</TabsTrigger>
                  <TabsTrigger value="memories">Memories</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {totalResults > 0 ? (
                    <div className="space-y-8">
                      {/* Students Section */}
                      {searchResults.students && searchResults.students.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold mb-4 flex items-center">
                            <User className="mr-2 h-5 w-5 text-blue-600" />
                            Students
                          </h3>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchResults.students.slice(0, 3).map((student: any) => (
                              <Link href={student.url} key={student.id}>
                                <Card className="hover:shadow-md transition-shadow">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                          src={student.image || "/placeholder.svg"}
                                          alt={student.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div>
                                        <h4 className="font-bold">{student.name}</h4>
                                        <p className="text-sm text-gray-600">
                                          {student.department} • {student.course || student.grade}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                          </div>
                          {searchResults.students.length > 3 && (
                            <div className="mt-2 text-right">
                              <Button variant="link" className="text-blue-600" onClick={() => setActiveTab("students")}>
                                View all {searchResults.students.length} students
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Faculty Section */}
                      {searchResults.faculty && searchResults.faculty.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold mb-4 flex items-center">
                            <Users className="mr-2 h-5 w-5 text-purple-600" />
                            Faculty
                          </h3>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchResults.faculty.slice(0, 3).map((faculty: any) => (
                              <Link href={faculty.url} key={faculty.id}>
                                <Card className="hover:shadow-md transition-shadow">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                          src={faculty.image || "/placeholder.svg"}
                                          alt={faculty.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div>
                                        <h4 className="font-bold">{faculty.name}</h4>
                                        <p className="text-sm text-gray-600">
                                          {faculty.position} • {faculty.department}
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                          </div>
                          {searchResults.faculty.length > 3 && (
                            <div className="mt-2 text-right">
                              <Button variant="link" className="text-blue-600" onClick={() => setActiveTab("faculty")}>
                                View all {searchResults.faculty.length} faculty members
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Gallery Section */}
                      {searchResults.gallery && searchResults.gallery.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold mb-4 flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-green-600" />
                            Gallery
                          </h3>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchResults.gallery.slice(0, 3).map((item: any) => (
                              <Link href={item.url} key={item.id}>
                                <Card className="hover:shadow-md transition-shadow">
                                  <div className="relative h-40">
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <CardContent className="p-4">
                                    <h4 className="font-bold">{item.title}</h4>
                                    <p className="text-sm text-gray-600 flex items-center mt-1">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {item.date}
                                    </p>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                          </div>
                          {searchResults.gallery.length > 3 && (
                            <div className="mt-2 text-right">
                              <Button variant="link" className="text-blue-600" onClick={() => setActiveTab("gallery")}>
                                View all {searchResults.gallery.length} gallery items
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Memories Section */}
                      {searchResults.memories && searchResults.memories.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold mb-4 flex items-center">
                            <MessageCircle className="mr-2 h-5 w-5 text-red-600" />
                            Memories
                          </h3>
                          <div className="space-y-4">
                            {searchResults.memories.slice(0, 3).map((memory: any) => (
                              <Link href={memory.url} key={memory.id}>
                                <Card className="hover:shadow-md transition-shadow">
                                  <CardContent className="p-4">
                                    <p className="text-gray-800 whitespace-pre-line mb-2">"{memory.content}"</p>
                                    <div className="flex justify-between items-center">
                                      <p className="font-medium">{memory.author}</p>
                                      <p className="text-sm text-gray-600">{memory.date}</p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                          </div>
                          {searchResults.memories.length > 3 && (
                            <div className="mt-2 text-right">
                              <Button variant="link" className="text-blue-600" onClick={() => setActiveTab("memories")}>
                                View all {searchResults.memories.length} memories
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg border">
                      <div className="max-w-md mx-auto">
                        <h3 className="text-xl font-bold mb-2">No results found</h3>
                        <p className="text-gray-600 mb-6">
                          We couldn't find any matches for "{searchQuery}". Please try a different search term or browse
                          the yearbook categories.
                        </p>
                        <Link href="/dashboard">
                          <Button className="bg-blue-600 hover:bg-blue-700">Return to Dashboard</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="students">
                  {searchResults.students && searchResults.students.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.students.map((student: any) => (
                        <Link href={student.url} key={student.id}>
                          <Card className="hover:shadow-md transition-shadow h-full">
                            <CardContent className="p-6">
                              <div className="flex flex-col items-center text-center">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                                  <Image
                                    src={student.image || "/placeholder.svg"}
                                    alt={student.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <h4 className="font-bold text-lg mb-1">{student.name}</h4>
                                <p className="text-blue-600 mb-2">
                                  {student.course || student.grade} {student.section && `- ${student.section}`}
                                </p>
                                <p className="text-sm text-gray-600">{student.department}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg border">
                      <p className="text-gray-600">No students found matching your search criteria.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="faculty">
                  {searchResults.faculty && searchResults.faculty.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.faculty.map((faculty: any) => (
                        <Link href={faculty.url} key={faculty.id}>
                          <Card className="hover:shadow-md transition-shadow h-full">
                            <CardContent className="p-6">
                              <div className="flex flex-col items-center text-center">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                                  <Image
                                    src={faculty.image || "/placeholder.svg"}
                                    alt={faculty.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <h4 className="font-bold text-lg mb-1">{faculty.name}</h4>
                                <p className="text-blue-600 mb-2">{faculty.position}</p>
                                <p className="text-sm text-gray-600">{faculty.department} Department</p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg border">
                      <p className="text-gray-600">No faculty members found matching your search criteria.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="gallery">
                  {searchResults.gallery && searchResults.gallery.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.gallery.map((item: any) => (
                        <Link href={item.url} key={item.id}>
                          <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                            <div className="relative h-48">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-bold mb-1">{item.title}</h4>
                              <p className="text-sm text-blue-600 mb-2">{item.category}</p>
                              <p className="text-xs text-gray-600 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {item.date}
                              </p>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg border">
                      <p className="text-gray-600">No gallery items found matching your search criteria.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="memories">
                  {searchResults.memories && searchResults.memories.length > 0 ? (
                    <div className="space-y-6">
                      {searchResults.memories.map((memory: any) => (
                        <Link href={memory.url} key={memory.id}>
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <p className="text-gray-800 whitespace-pre-line text-lg mb-4">"{memory.content}"</p>
                              <div className="flex justify-between items-center">
                                <p className="font-medium">{memory.author}</p>
                                <p className="text-sm text-gray-600">{memory.date}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg border">
                      <p className="text-gray-600">No memories found matching your search criteria.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Search Tips */}
          {!searchQuery && (
            <div className="bg-white p-6 rounded-lg border mt-8">
              <h3 className="text-xl font-bold mb-4">Search Tips</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-2">Finding Students</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Search by student name</li>
                    <li>• Search by department (Elementary, Junior High, Senior High, College)</li>
                    <li>• Search by course or grade level (BSIT, Grade 5, etc.)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Finding Faculty</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Search by faculty name</li>
                    <li>• Search by position (Dean, Instructor, Adviser, etc.)</li>
                    <li>• Search by department</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Finding Photos</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Search by event name (Foundation Day, Graduation, etc.)</li>
                    <li>• Search by category (Events, Academic, Sports, etc.)</li>
                    <li>• Search by year</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Finding Memories</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Search by content keywords</li>
                    <li>• Search by author name</li>
                    <li>• Search by tags</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
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
