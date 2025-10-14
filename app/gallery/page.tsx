"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Camera, Calendar, Filter, Grid3X3, Grid, Search, Star, Eye, Heart, MapPin, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Header } from "@/components/header"
import { clearUnintendedAuth, isAuthenticated } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const GALLERY_EVENTS = [
  {
    id: 1,
    title: "Foundation Day Celebration",
    date: "August 15, 2023",
    imageCount: 24,
    coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLAjR0cJP0QRzToK_y8UPpyxV8sqvmMQXgNg&s",
    category: "Events",
    featured: true,
    likes: 156,
    views: 2340,
    photographer: "Juan Dela Cruz",
    location: "Main Campus",
    description:
      "Annual celebration commemorating the founding of our beloved institution with performances, activities, and community spirit.",
  },
  {
    id: 2,
    title: "Christmas Party",
    date: "September 22, 2023",
    imageCount: 36,
    coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOwfseZSorZuP-QVpxdiYGXEh05Bal2wd_ng&s",
    category: "Events",
    featured: false,
    likes: 89,
    views: 1567,
    photographer: "Maria Santos",
    location: "College Auditorium",
    description: "Festive holiday celebration bringing together students, faculty, and staff in joyous commemoration.",
  },
  {
    id: 3,
    title: "College Department Recognition Day",
    date: "April 23, 2025",
    imageCount: 18,
    coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdSmul9w2EFy9k0jflk_6CyWk1QMMsSW2G-g&s",
    category: "Academic",
    featured: false,
    likes: 67,
    views: 1234,
    photographer: "Robert Cruz",
    location: "Academic Hall",
    description:
      "Honoring academic excellence and celebrating the achievements of our outstanding students and faculty.",
  },
  {
    id: 4,
    title: "Laudato Si': Care for Creation",
    date: "December 18, 2023",
    imageCount: 42,
    coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqSSPbjzSsRyjjibeDC0K23wyKjFQ2MeBbyg&s",
    category: "Events",
    featured: true,
    likes: 203,
    views: 3456,
    photographer: "Ana Rodriguez",
    location: "Campus Grounds",
    description: "Environmental awareness program promoting ecological responsibility and sustainable practices.",
  },
  {
    id: 5,
    title: "Annual Faculty and Staff Recollection 2025",
    date: "July 19, 2025",
    imageCount: 56,
    coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU0PZCzjbApo83U9ybxCXMG6DVqo2ybCJ9qQ&s",
    category: "Faculty",
    featured: true,
    likes: 134,
    views: 2890,
    photographer: "Father Miguel",
    location: "Retreat Center",
    description:
      "Spiritual renewal and professional development gathering for our dedicated faculty and staff members.",
  },
  {
    id: 6,
    title: "Wandering Minds",
    date: "March 15, 2024",
    imageCount: 32,
    coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm2HBJ-gR4O-0CO-w6-i-SjYLT6Lchh1Rctw&s",
    category: "Academic",
    featured: false,
    likes: 78,
    views: 1678,
    photographer: "Dr. Elena Vasquez",
    location: "Science Building",
    description:
      "Intellectual exploration and creative thinking showcase featuring innovative student projects and research.",
  },
]

const categories = ["All", ...new Set(GALLERY_EVENTS.map((event) => event.category))]

export default function GalleryPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "masonry">("masonry")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    clearUnintendedAuth()
    setAuthenticated(isAuthenticated())
  }, [])

  const filteredEvents = GALLERY_EVENTS.filter((event) => {
    const matchesCategory = activeCategory === "All" || event.category === activeCategory
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredEvents = GALLERY_EVENTS.filter((event) => event.featured).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Header />

      <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="container relative py-32 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full mb-8 border border-white/20">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold tracking-wide">MEMORIA GALLERY</span>
              <Camera className="h-5 w-5" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Captured Memories
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-12">
              Journey through our most treasured moments, where every photograph tells a story of growth, celebration,
              and community spirit
            </p>

            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search memories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border-white/20 rounded-full text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <main className="flex-1 py-20">
        <div className="container px-4">
          {activeCategory === "All" && (
            <section className="mb-20">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 text-sm mb-6">
                    <Star className="h-4 w-4 mr-2" />
                    Featured Collections
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Our Most{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Cherished
                    </span>{" "}
                    Moments
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Discover the highlights of our academic year through these carefully curated collections
                  </p>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featuredEvents.map((event, index) => (
                  <Link key={event.id} href={`/gallery/${event.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.15 }}
                      className="group relative h-96 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                      <Image
                        src={event.coverImage || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Enhanced overlay content */}
                      <div className="absolute inset-0 p-8 z-20 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-4 py-2">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                          <div className="flex gap-2">
                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {event.views.toLocaleString()}
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {event.likes}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-blue-100 text-sm mb-4 line-clamp-2">{event.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-blue-100 text-sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-blue-100 text-sm">
                              <Camera className="h-4 w-4 mr-2" />
                              {event.imageCount} photos
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                {activeCategory === "All" ? "All Collections" : `${activeCategory} Collections`}
              </h2>
              <p className="text-gray-600 text-lg">
                {filteredEvents.length} {filteredEvents.length === 1 ? "collection" : "collections"} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {/* Enhanced category filters */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "transition-all duration-300 px-6 py-2 rounded-full font-medium",
                      activeCategory === category
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                        : "border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300",
                    )}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Enhanced view mode toggle */}
              <div className="flex items-center border-2 border-blue-200 rounded-full overflow-hidden bg-white">
                <button
                  className={cn(
                    "p-3 transition-all duration-200",
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "bg-white text-blue-600 hover:bg-blue-50",
                  )}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  className={cn(
                    "p-3 transition-all duration-200",
                    viewMode === "masonry"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "bg-white text-blue-600 hover:bg-blue-50",
                  )}
                  onClick={() => setViewMode("masonry")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div
              className={cn(
                "gap-8",
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 space-y-8",
              )}
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className={cn(viewMode === "masonry" && "mb-8 break-inside-avoid")}
                >
                  <Link href={`/gallery/${event.id}`}>
                    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-1">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={event.coverImage || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Enhanced badges and stats */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          <Badge className="bg-white/95 text-blue-600 backdrop-blur-sm border border-blue-100 font-medium">
                            <Camera className="h-3 w-3 mr-1" />
                            {event.imageCount}
                          </Badge>
                          {event.featured && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>

                        {/* Hover overlay with stats */}
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex gap-3">
                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {event.views.toLocaleString()}
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs flex items-center">
                              <Heart className="h-3 w-3 mr-1" />
                              {event.likes}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                            {event.category}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                        </div>

                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
                          {event.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {event.date}
                          </span>
                          <span className="text-sm text-blue-600 font-semibold group-hover:text-blue-700">
                            View Gallery →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
                <Filter className="h-12 w-12 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No matching galleries found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We couldn't find any galleries matching your search criteria. Try adjusting your filters or search
                terms.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => {
                    setActiveCategory("All")
                    setSearchQuery("")
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8"
                >
                  Clear All Filters
                </Button>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
