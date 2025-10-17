"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Camera, History, Users, Sparkles, GraduationCap, Clock, Heart, ChevronRight } from "lucide-react"

import { Lock, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getPublicAlbums, type AlbumData } from "@/lib/gallery-service"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const shimmer = {
  hidden: { backgroundPosition: "200% 0" },
  visible: {
    backgroundPosition: "0% 0",
    transition: {
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "mirror",
      duration: 1.5,
      ease: "linear",
    },
  },
}

export default function Home() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [galleryAlbums, setGalleryAlbums] = useState<AlbumData[]>([])
  const [galleryLoading, setGalleryLoading] = useState(true)

  useEffect(() => {
    if (searchParams.get("unauthorized") === "true") {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      })
      // Clean up the URL
      window.history.replaceState({}, "", "/")
    }
  }, [searchParams, toast])

  useEffect(() => {
    const loadGalleryAlbums = async () => {
      try {
        setGalleryLoading(true)
        const albums = await getPublicAlbums()
        // Get the first 8 FEATURED albums for the highlights section
        const featuredAlbums = albums.filter(album => album.isFeatured)
        setGalleryAlbums(featuredAlbums.slice(0, 8))
      } catch (error) {
        console.error('Error loading gallery albums:', error)
        // Keep empty array on error
        setGalleryAlbums([])
      } finally {
        setGalleryLoading(false)
      }
    }

    loadGalleryAlbums()
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute inset-0 bg-[url('/images/ccmain.jpg')] bg-cover bg-center" />

          {/* Animated particles */}
          <div className="absolute inset-0 z-10 opacity-20">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: Math.random() * 0.3 + 0.2,
                }}
                animate={{
                  y: [null, "-20px", null],
                  opacity: [null, 0.5, null],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>

          <div className="container relative z-20 py-20 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-white">
                <motion.div
                  variants={fadeIn}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6 border border-white/30"
                >
                  <Sparkles className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium">Digital Yearbook</span>
                </motion.div>

                <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                  Consolatricians <br />
                  <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                    Making a Difference
                  </span>
                </motion.h1>

                <motion.p variants={fadeIn} className="text-xl md:text-2xl mb-8 text-gray-100 max-w-xl">
                  Preserving moments, celebrating achievements, and connecting generations through our interactive
                  yearbook experience.
                </motion.p>

                <motion.div
                  variants={fadeIn}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6 w-fit border border-white/30"
                >
                  <Lock className="h-4 w-4 text-white" />
                  <span className="text-sm font-medium">Login required for full access</span>
                </motion.div>

                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-blue-600 text-white hover:bg-blue-700 transition-colors group shadow-lg"
                    >
                      Sign Up Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 transition-colors bg-white/10 backdrop-blur-sm"
                    >
                      Log In
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative hidden md:block"
              >
                <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-blue-500/30 to-white/30 opacity-50 blur-xl" />
                <div className="relative bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/images/logoCCTC.png" // Changed to school logo
                    width={400}
                    height={400} // Adjusted height for logo aspect ratio
                    alt="Consolatrix College Logo"
                    className="rounded-lg shadow-lg object-contain" // Use object-contain to fit logo
                    priority
                  />
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg shadow-lg">
                    <span className="font-bold">Class of 2024</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Fixed Wave divider */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 120"
              className="w-full h-auto block"
              preserveAspectRatio="none"
            >
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              />
            </svg>
          </div>
        </section>

        {/* Departments Quick Access */}
        <section className="py-16 bg-white">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4 text-gray-900">
                Explore Departments
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
                Navigate through different academic departments and discover students, faculty, and memorable moments
              </motion.p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 max-w-2xl mx-auto"
            >
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Note:</span> You'll need to sign up or log in to access the complete
                  yearbook content, including departments, student profiles, and more.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
            >
              {[
                {
                  title: "Elementary",
                  icon: <GraduationCap className="h-6 w-6" />,
                  color: "from-green-500 to-emerald-600",
                  link: "/school-years-elementary",
                },
                {
                  title: "Junior High",
                  icon: <GraduationCap className="h-6 w-6" />,
                  color: "from-blue-500 to-cyan-600",
                  link: "/departments/junior-high",
                },
                {
                  title: "Senior High",
                  icon: <GraduationCap className="h-6 w-6" />,
                  color: "from-yellow-500 to-amber-600",
                  link: "/departments/senior-high",
                },
                {
                  title: "College",
                  icon: <GraduationCap className="h-6 w-6" />,
                  color: "from-blue-500 to-blue-600",
                  link: "/departments/college",
                },
              ].map((dept, index) => (
                <motion.div key={dept.title} variants={fadeIn} whileHover={{ y: -5 }} className="group">
                  <Link href="/login" className="block">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <div
                        className={`bg-gradient-to-r ${dept.color} h-24 flex items-center justify-center text-white`}
                      >
                        {dept.icon}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{dept.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                          <span>Explore</span>
                          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4 text-gray-900">
                Yearbook Features
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover all the interactive features our digital yearbook has to offer
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
              <motion.div
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Photo Gallery</h3>
                <p className="text-gray-600 mb-4">
                  Browse through memories captured during Foundation Days, Sports Events, Graduation Ceremonies, and
                  more.
                </p>
                <Link href="/gallery">
                  <Button variant="link" className="text-blue-600 p-0 group">
                    View Gallery <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Faculty & Staff</h3>
                <p className="text-gray-600 mb-4">
                  Meet the people behind the school's success - our dedicated administrators, faculty members, and
                  staff.
                </p>
                <Link href="/faculty">
                  <Button variant="link" className="text-indigo-600 p-0 group">
                    View Faculty & Staff{" "}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <History className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">School History</h3>
                <p className="text-gray-600 mb-4">
                  Discover interesting details about the school's founding, growth, and achievements over the years.
                </p>
                <Link href="/school-history">
                  <Button variant="link" className="text-blue-600 p-0 group">
                    Learn Our History{" "}
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Gallery Preview Section */}
        <section className="py-16 bg-white">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-12"
            >
              <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4 text-gray-900">
                Gallery Highlights
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                A glimpse of the memorable moments captured throughout the academic year
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {galleryLoading ? (
                // Loading skeleton
                Array.from({ length: 8 }).map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    variants={fadeIn}
                    className="relative overflow-hidden rounded-xl shadow-md bg-gray-200 animate-pulse"
                  >
                    <div className="w-full h-64 bg-gray-300"></div>
                  </motion.div>
                ))
              ) : galleryAlbums.length > 0 ? (
                // Dynamic album data
                galleryAlbums.map((album, index) => (
                  <motion.div
                    key={album.id}
                    variants={fadeIn}
                    whileHover={{ scale: 1.03 }}
                    className="relative group overflow-hidden rounded-xl shadow-md"
                  >
                    <Link href={`/gallery/${album.id}`}>
                      <Image
                        src={album.coverImage || "/placeholder.jpg"}
                        width={400}
                        height={300}
                        alt={album.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          // Fallback to a default image if cover image fails to load
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.jpg"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4">
                          <h3 className="text-white font-bold">{album.title}</h3>
                          <p className="text-blue-200 text-sm">
                            {new Date(album.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </p>
                          {album.location && (
                            <p className="text-blue-200 text-xs mt-1">{album.location}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                // No featured albums available
                <div className="col-span-full text-center py-12">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Featured Albums Available</h3>
                  <p className="text-gray-500">Check back later for featured gallery content.</p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center mt-10"
            >
              <Link href="/gallery">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:opacity-90 transition-opacity">
                  View Full Gallery <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            >
              {[
                { number: "1,200+", label: "Students", icon: <Users className="h-6 w-6 mb-2 mx-auto" /> },
                { number: "120+", label: "Faculty Members", icon: <GraduationCap className="h-6 w-6 mb-2 mx-auto" /> },
                { number: "50+", label: "Years of Excellence", icon: <Clock className="h-6 w-6 mb-2 mx-auto" /> },
                { number: "5,000+", label: "Alumni", icon: <Heart className="h-6 w-6 mb-2 mx-auto" /> },
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeIn} className="p-6">
                  {stat.icon}
                  <motion.h3
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                    className="text-3xl md:text-4xl font-bold mb-2"
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-blue-200">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
