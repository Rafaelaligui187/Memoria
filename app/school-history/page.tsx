"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import {
  BookOpen,
  Calendar,
  Award,
  Building,
  ChevronRight,
  ChevronLeft,
  Clock,
  Star,
  Heart,
  Lightbulb,
  Camera,
  Play,
  Pause,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { isAuthenticated } from "@/lib/auth"

export default function SchoolHistoryPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [showVirtualTour, setShowVirtualTour] = useState(false)
  const [activeTab, setActiveTab] = useState("mission")
  const timelineRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setAuthenticated(isAuthenticated())
  }, [])

  const timelineEvents = [
    {
      year: "1960",
      title: "Foundation",
      description:
        "The school was founded in a very humble way as a response to the call of the church in general and to the invitation of the bishops of the archdiocese of Cebu for the religious and moral development of the youth of Toledo City in particular.",
      image: "/historic-school-building-foundation.png",
      icon: Building,
      color: "from-amber-600 to-amber-500",
      facts: [
        "Initial enrollment of 129 high school students",
        "Only Catholic school in the city",
        "First class started in June, 1961.",
      ],
      quote: "From humble beginnings, great things grow.",
      achievement: "🏛️ First Catholic Educational Institution in Toledo City",
    },
    {
      year: "1998",
      title: "College Status",
      description:
        "Consolatrix Academy changed its name to Consolatrix College of Toledo City and widened her horizon of service to the locality",
      image: "/modern-college-campus-graduation.png",
      icon: Award,
      color: "from-blue-600 to-blue-500",
      facts: [
        "Accredited by the Department of Education",
        "Introduced 5 new degree programs",
        "Student population reached 1,200",
      ],
      quote: "Education is the passport to the future.",
      achievement: "🎓 Elevated to College Status",
    },
    {
      year: "2010",
      title: "Golden Jubilee",
      description:
        "From its humble beginnings like the pebbles along the dusty road, the pebbles turned to precious stones.",
      image: "/celebration-golden-anniversary-school.png",
      icon: Calendar,
      color: "from-yellow-500 to-yellow-400",
      facts: [
        "Grand alumni homecoming with 2,000+ attendees",
        "Published 50th anniversary commemorative book",
        "Launched scholarship fund for underprivileged students",
      ],
      quote: "50 years of excellence, countless dreams fulfilled.",
      achievement: "🏆 Golden Jubilee Celebration",
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description:
        "The college implemented a comprehensive digital transformation, enhancing online learning capabilities and administrative systems.",
      image: "/modern-technology-online-learning.png",
      icon: Lightbulb,
      color: "from-purple-600 to-purple-500",
      facts: [
        "Full Learning Management System implementation",
        "Campus-wide WiFi and digital infrastructure",
        "Virtual classrooms and hybrid learning options",
      ],
      quote: "Embracing technology to enhance education.",
      achievement: "💻 Complete Digital Infrastructure",
    },
    {
      year: "Present",
      title: "Continuing Excellence",
      description:
        "Today, Consolatrix College continues to uphold its tradition of academic excellence while adapting to the changing educational landscape.",
      image: "/modern-students-diverse-campus-life.png",
      icon: Star,
      color: "from-green-600 to-green-500",
      facts: [
        "Over 10,000 alumni worldwide",
        "Ranked among top 20 colleges in the region",
        "Expanding international exchange programs",
      ],
      quote: "Building tomorrow's leaders today.",
      achievement: "🌟 Regional Excellence Recognition",
    },
  ]

  const testimonials = [
    {
      name: "Maria Santos",
      year: "Class of 1985",
      role: "CEO, Santos Industries",
      quote:
        "Consolatrix College shaped not just my career, but my character. The values I learned here guide me every day.",
      image: "/professional-woman-portrait.png",
    },
    {
      name: "Dr. Juan Dela Cruz",
      year: "Class of 1992",
      role: "Medical Director",
      quote: "The foundation I received at CCTC prepared me for the challenges of medical school and beyond.",
      image: "/professional-doctor.png",
    },
    {
      name: "Sister Catherine Rodriguez",
      year: "Class of 1978",
      role: "Educational Administrator",
      quote: "My calling to serve in education was nurtured within these walls. Forever grateful to my alma mater.",
      image: "/nun-educator-portrait.png",
    },
  ]

  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setActiveTimelineIndex((prev) => (prev + 1) % timelineEvents.length)
      }, 4000)
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, timelineEvents.length])

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(testimonialInterval)
  }, [testimonials.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (timelineRef.current) {
      observer.observe(timelineRef.current)
    }

    return () => {
      if (timelineRef.current) {
        observer.unobserve(timelineRef.current)
      }
    }
  }, [])

  const handlePrevTimeline = () => {
    setActiveTimelineIndex((prev) => (prev > 0 ? prev - 1 : timelineEvents.length - 1))
  }

  const handleNextTimeline = () => {
    setActiveTimelineIndex((prev) => (prev < timelineEvents.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      <Header />

      <main className="flex-1">
        <div className="relative h-[80vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/95 via-orange-800/90 to-yellow-700/85 z-10" />
          <div className="absolute inset-0 bg-[url('/beautiful-school-campus-aerial-view.png')] bg-cover bg-center bg-no-repeat">
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="absolute inset-0 z-5">
            <div className="absolute top-20 left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-40 right-20 w-24 h-24 bg-orange-400/10 rounded-full blur-2xl animate-bounce" />
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
          </div>

          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="max-w-5xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-6"
              >
                <Badge className="bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border-amber-400/30 border px-4 py-2 text-lg">
                  <Clock className="w-4 h-4 mr-2" />
                  Est. 1960 • 64+ Years of Excellence
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight"
              >
                Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-300">
                  Journey
                </span>{" "}
                Through Time
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-white/90 text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8"
              >
                From humble beginnings to educational excellence - discover the remarkable story of Consolatrix College
                and its lasting impact on thousands of lives.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button
                  size="lg"
                  asChild
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <a
                    href="https://youtu.be/UGRVJY6vvOY?si=iLAEvZD5YM9SJsNH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Virtual Campus Tour
                  </a>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full text-lg font-semibold backdrop-blur-sm bg-transparent"
                  onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Our History
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="container px-4 mx-auto py-20">
          <div className="mb-32">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <Badge className="bg-amber-100 text-amber-800 mb-6 px-4 py-2 text-lg">
                  <Heart className="w-4 h-4 mr-2" />
                  OUR HERITAGE
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  A Pillar of <span className="text-amber-600">Education</span> in Toledo City
                </h2>

                <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                  <p>
                    Consolatrix College of Toledo City, the then Consolatrix Academy takes steps constantly as it
                    journeys and travels through the endless boundary of excellence, personality development and
                    formation of the young.
                  </p>
                  <p>
                    With wisdom that emanates from God alone and inspired by the virtues of faith, hope, and love,
                    Consolatrix College of Toledo City stood the tests of time. The former administrators experienced
                    this development and are determined to move forward towards excellent service to its clientele.
                  </p>
                  <p>
                    This only Catholic school in the city is owned and managed by the Congregation of the Augustinian
                    Recollect Sisters since its foundation in the 1960.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/vintage-school-building-students.png"
                    alt="Historic Campus"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <Badge className="bg-amber-500/20 text-amber-200 border-amber-400/30 border mb-3 px-3 py-1">
                      1960
                    </Badge>
                    <h3 className="text-2xl font-bold text-white mb-2">Original Campus Building</h3>
                    <p className="text-white/80">Where our journey began with 129 students</p>
                  </div>
                </div>

                <div className="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse" />
              </motion.div>
            </div>
          </div>

          <div className="mb-32" ref={timelineRef} id="timeline">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 1 }}
              className="text-center max-w-4xl mx-auto mb-16"
            >
              <Badge className="bg-amber-100 text-amber-800 mb-6 px-4 py-2 text-lg">
                <Clock className="w-4 h-4 mr-2" />
                JOURNEY THROUGH TIME
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Our Historical Timeline</h2>
              <p className="text-gray-700 text-xl leading-relaxed mb-8">
                Explore the key moments that have shaped Consolatrix College from its founding to the present day, and
                discover the rich heritage that continues to inspire our future.
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="rounded-full px-6"
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isAutoPlaying ? "Pause" : "Auto Play"}
                </Button>
              </div>
            </motion.div>

            <div className="relative mb-16 overflow-hidden">
              <div className="absolute left-0 right-0 h-2 bg-gray-200 top-1/2 -translate-y-1/2 z-0 rounded-full" />
              <motion.div
                className="absolute left-0 h-2 bg-gradient-to-r from-amber-600 to-orange-500 top-1/2 -translate-y-1/2 z-5 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((activeTimelineIndex + 1) / timelineEvents.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
              <div className="relative z-10 flex justify-between max-w-6xl mx-auto px-4">
                {timelineEvents.map((event, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`flex flex-col items-center transition-all duration-500 ${
                      index === activeTimelineIndex
                        ? "scale-125 z-20"
                        : "opacity-70 hover:opacity-100 scale-100 hover:scale-110"
                    }`}
                    onClick={() => setActiveTimelineIndex(index)}
                    whileHover={{ scale: index === activeTimelineIndex ? 1.25 : 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className={`w-6 h-6 rounded-full border-4 border-white shadow-lg ${
                        index === activeTimelineIndex ? "bg-gradient-to-r from-amber-600 to-orange-500" : "bg-gray-400"
                      }`}
                      animate={
                        index === activeTimelineIndex
                          ? {
                              boxShadow: ["0 0 0 0 rgba(245, 158, 11, 0.4)", "0 0 0 20px rgba(245, 158, 11, 0)"],
                            }
                          : {}
                      }
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <span
                      className={`text-sm font-bold mt-2 ${
                        index === activeTimelineIndex ? "text-amber-600" : "text-gray-500"
                      }`}
                    >
                      {event.year}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTimelineIndex}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
              >
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-96 lg:h-auto">
                    <Image
                      src={timelineEvents[activeTimelineIndex].image || "/placeholder.svg"}
                      alt={timelineEvents[activeTimelineIndex].title}
                      fill
                      className="object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${timelineEvents[activeTimelineIndex].color} opacity-70`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                      <div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4"
                        >
                          <Clock className="h-4 w-4" />
                          {timelineEvents[activeTimelineIndex].year}
                        </motion.div>
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="text-4xl font-bold text-white mb-2"
                        >
                          {timelineEvents[activeTimelineIndex].title}
                        </motion.h3>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-2xl text-amber-200 font-medium"
                        >
                          {timelineEvents[activeTimelineIndex].achievement}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className={`inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${timelineEvents[activeTimelineIndex].color} text-white mb-6 shadow-lg`}
                    >
                      {timelineEvents[activeTimelineIndex].icon &&
                        (() => {
                          const IconComponent = timelineEvents[activeTimelineIndex].icon
                          return <IconComponent className="h-8 w-8" />
                        })()}
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-4"
                    >
                      {timelineEvents[activeTimelineIndex].title}
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl text-amber-600 font-medium mb-6 italic"
                    >
                      "{timelineEvents[activeTimelineIndex].quote}"
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-700 leading-relaxed mb-8 text-lg"
                    >
                      {timelineEvents[activeTimelineIndex].description}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8"
                    >
                      <h4 className="font-bold text-gray-900 mb-4 text-lg">Key Highlights</h4>
                      <ul className="space-y-3">
                        {timelineEvents[activeTimelineIndex].facts.map((fact, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + idx * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-1 text-amber-500">
                              <ChevronRight className="h-5 w-5" />
                            </div>
                            <span className="text-gray-700 text-lg">{fact}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex gap-4"
                    >
                      <Button
                        variant="outline"
                        onClick={handlePrevTimeline}
                        className="rounded-full px-6 py-3 border-amber-200 hover:bg-amber-50 bg-transparent"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleNextTimeline}
                        className="rounded-full px-6 py-3 border-amber-200 hover:bg-amber-50 bg-transparent"
                      >
                        Next <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mission, Vision, Core Values - Tabbed Design */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Foundation</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The guiding principles that shape our educational journey and community spirit
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="flex bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setActiveTab("mission")}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      activeTab === "mission"
                        ? "bg-amber-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-amber-600"
                    }`}
                  >
                    Our Mission
                  </button>
                  <button
                    onClick={() => setActiveTab("vision")}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      activeTab === "vision" ? "bg-blue-600 text-white shadow-lg" : "text-gray-600 hover:text-blue-600"
                    }`}
                  >
                    Our Vision
                  </button>
                  <button
                    onClick={() => setActiveTab("values")}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      activeTab === "values"
                        ? "bg-emerald-600 text-white shadow-lg"
                        : "text-gray-600 hover:text-emerald-600"
                    }`}
                  >
                    Core Values
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[400px]"
                >
                  {activeTab === "mission" && (
                    <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                      <CardContent className="p-10 text-xl">
                        <div className="relative h-32 bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center">
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="relative text-center">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white mb-2">
                              <BookOpen className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Our Mission</h3>
                          </div>
                        </div>
                        <div className="p-8">
                          <div className="space-y-4 text-gray-700">
                            <p className="flex items-start gap-3">
                              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>
                                Strengthen fraternal charity through God-filled friendship and renewed evangelization
                              </span>
                            </p>
                            <p className="flex items-start gap-3">
                              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>
                                Facilitate integral development of learners through current research and relevant
                                curricula
                              </span>
                            </p>
                            <p className="flex items-start gap-3">
                              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>
                                Fortify leadership development through continuing education and Augustinian Recollect
                                Spirituality
                              </span>
                            </p>
                            <p className="flex items-start gap-3">
                              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>
                                Develop Christ-centered Augustinian Recollect Stewards who are environmentally caring
                              </span>
                            </p>
                            <p className="flex items-start gap-3">
                              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>Nurture shared mission for sustainability and social relevance of programs</span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === "vision" && (
                    <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                      <CardContent className="p-10 text-xl">
                        <div className="relative h-32 bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center">
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="relative text-center">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white mb-2">
                              <Star className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                          </div>
                        </div>
                        <div className="p-8 flex items-center justify-center min-h-[280px]">
                          <p className="text-gray-700 text-center leading-relaxed text-lg">
                            Consolatrix College of Toledo City, Inc. envisions a life-giving and innovating education
                            ministry committed to transforming community of learners into Christ-centered Augustinian
                            Recollect Stewards.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === "values" && (
                    <Card className="border-none shadow-xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
                      <CardContent className="p-10 text-xl">
                        <div className="relative h-32 bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center">
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="relative text-center">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white mb-2">
                              <Award className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Core Values</h3>
                            <div className="text-lg font-semibold text-white/90 mt-1">CCTC</div>
                          </div>
                        </div>
                        <div className="p-8">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            <div className="text-center p-4 rounded-xl bg-emerald-100 hover:bg-emerald-200 transition-colors">
                              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white mb-3 text-xl font-bold">
                                C
                              </div>
                              <h4 className="font-semibold text-gray-900">Charity</h4>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-emerald-100 hover:bg-emerald-200 transition-colors">
                              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white mb-3 text-xl font-bold">
                                C
                              </div>
                              <h4 className="font-semibold text-gray-900">Compassion</h4>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-emerald-100 hover:bg-emerald-200 transition-colors">
                              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white mb-3 text-xl font-bold">
                                T
                              </div>
                              <h4 className="font-semibold text-gray-900">Tenacity</h4>
                            </div>
                            <div className="text-center p-4 rounded-xl bg-emerald-100 hover:bg-emerald-200 transition-colors">
                              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white mb-3 text-xl font-bold">
                                C
                              </div>
                              <h4 className="font-semibold text-gray-900">Commitment</h4>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Historical Milestones */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <Badge className="bg-amber-100 text-amber-800 mb-4">KEY ACHIEVEMENTS</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Historical Milestones</h2>
              <p className="text-gray-700 leading-relaxed">
                Significant moments and achievements that have marked our journey through the decades.
              </p>
            </motion.div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border-none">
              <div className="space-y-8">
                {[
                  {
                    year: "1960",
                    title: "Founding of Consolatrix College",
                    description: "Established with just 129 high school students, offering basic education programs.",
                    color: "bg-amber-600",
                  },
                  {
                    year: "1962",
                    title: "Offered 1st and 2nd year High School with Government Recognition",
                    description: "Government Recognition No. 241 series 1962 - June 11, 1962",
                    color: "bg-amber-600",
                  },
                  {
                    year: "1962",
                    title: "Offered 3rd and 4th year High School with Government Recognition",
                    description: "Government Recognition No. 77 series 1964 - Aaugust 03, 1964",
                    color: "bg-amber-600",
                  },
                  {
                    year: "1963",
                    title: "Offered Kindergarten level with Government Recognition",
                    description: "Government Recognition No. 294 series 1963 - July 1, 1963",
                    color: "bg-amber-600",
                  },
                  {
                    year: "1963",
                    title: "Offered Grade 1 level with Government Recognition",
                    description: "Government Recognition No. 295 series 1963 - July 1, 1963",
                    color: "bg-amber-600",
                  },
                  {
                    year: "1964",
                    title: "Offered Grade 2 level with Government Recognition",
                    description: "Government Recognition No. 76 series 1964 - August 3, 1964",
                    color: "bg-amber-600",
                  },
                  {
                    year: "1965",
                    title: "Offered Grade 3 level with Government Recognition",
                    description: "Government Recognition No. 173 series 1965 - July 19, 1965",
                    color: "bg-amber-600",
                  },
                  {
                    year: "1965",
                    title: "Offered Grades 4 and 6 level with Government Recognition",
                    description: "Government Recognition No. 24 series 1967 - July 19, 1965",
                    color: "bg-amber-600",
                  },

                  {
                    year: "1998",
                    title: "Introduction of College Programs",
                    description:
                      "Expanded to offer bachelor's degree programs in Education, Technology, and Hospitality Management.",
                    color: "bg-amber-600",
                  },
                ].map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative pl-8 pb-8 border-l-2 border-amber-200 last:border-0 last:pb-0"
                  >
                    <div
                      className={`absolute left-0 top-0 -translate-x-1/2 w-6 h-6 rounded-full ${milestone.color} border-4 border-white`}
                    />
                    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge className={`${milestone.color} text-white hover:${milestone.color} border-none`}>
                          {milestone.year}
                        </Badge>
                        <h4 className="font-bold text-lg text-gray-900">{milestone.title}</h4>
                      </div>
                      <p className="text-gray-700">{milestone.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
