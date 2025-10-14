"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  MapPin,
  Grid3X3,
  X,
  Eye,
  Star,
  Camera,
  Share2,
  Info,
  User,
  Clock,
  Tag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"

const galleryData = [
  {
    id: 1,
    title: "Foundation Day 2023",
    description:
      "Highlights from the annual Foundation Day celebration. Students and faculty gathered to commemorate the founding of Consolatrix College with various performances, games, and activities that showcased our rich heritage and vibrant community spirit.",
    image:
      "https://scontent.fceb1-5.fna.fbcdn.net/v/t39.30808-6/520400793_24596644679942220_4461935746380245946_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGaXOS-WSq1OXoR7ZBCFDR9904ZG9oQeaH3Thkb2hB5oeRvXbQPDSfz3TNQ2HMiZMqJlqTLLaERN49BIttFXwCE&_nc_ohc=VzV_RuKZFJwQ7kNvwFdTSY1&_nc_oc=Adk6zBpyH0T7zOqrRUDBJDl8QATsXEsL-FVaLDa0hXq2l22CkYqsooUQLPHUi0Y7S_o&_nc_zt=23&_nc_ht=scontent.fceb1-5.fna&_nc_gid=-GprEV38VHSX9nIY_mTnNw&oh=00_AfQ9IuppX8tXOUhe_eGiDh8JldivpKYWW8hZ2qJN0OGBMA&oe=688AD4BE",
    category: "Events",
    subcategory: "Foundation Day",
    year: "2023",
    date: "August 15, 2023",
    tags: ["celebration", "performance", "campus", "heritage", "community"],
    likes: 42,
    views: 156,
    photographer: "Juan Dela Cruz",
    location: "Main Campus Grounds",
    duration: "Full Day Event",
    featured: true,
    relatedImages: [
      "https://scontent.fceb1-4.fna.fbcdn.net/v/t39.30808-6/520082840_24596646053275416_2660576849059642743_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEpQw3fOXlb-yivbMhCW5GpSCxzT1hTrJZILHNPWFOslmoaS-30hUeJYppmPA_uua6C79-lwAwYXTmt35u83944&_nc_ohc=OEDswZsyxLEQ7kNvwGBfRtI&_nc_oc=AdkTb1hhJMNt22QBODdCA_7mCopOBV77gC9YrKuLO-ldO-EZ_tz02VwLmbPk29A4U24&_nc_zt=23&_nc_ht=scontent.fceb1-4.fna&_nc_gid=X_pE_bJ7QsR5xHz1jGJL4w&oh=00_AfSJG9dSr57E7E6hRG8okKVift7qILHWw2_b6jCuSiJCgQ&oe=688ADBF1",
      "https://scontent.fceb1-1.fna.fbcdn.net/v/t39.30808-6/519398170_24596646539942034_4080860876799648114_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHW8_6NTbIt4zJ2rM0OJk3A7gM1bcrMzAPuAzVtyszMA5osz85SIneDYm9gdAwQqRw_-IxT25UnLTW7e5DAz4VD&_nc_ohc=0tM2c47loPQQ7kNvwFKQK_T&_nc_oc=Adm1wmIbyMZZW1KOhLQ_4BCNbil_VrfqDkc-AXoYEuVw15jmIHo9_26JQjO2vK7wQFw&_nc_zt=23&_nc_ht=scontent.fceb1-1.fna&_nc_gid=z_eLaP9cEe1UjBuZharudw&oh=00_AfQzCQ-N0syRRrLTGs-NAso7bDnCulwFSH9CI51aojJ_WA&oe=688ADDB0",
      "https://scontent.fceb1-4.fna.fbcdn.net/v/t39.30808-6/519611868_24596647879941900_4195867799840071945_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGam3_Db1oNCRIgTK4A2-R6je7gCsL9IO6N7uAKwv0g7jwPakikT2iDIF8KpK0uwXuKIx-eR1IuuwNhTNGDS-46&_nc_ohc=RGS8CxJOXMIQ7kNvwFr4rLN&_nc_oc=AdkNf1Zxph901pqPMJAhfAx6Xb4qxz69Ep9GxqGgJYpJjfOFzYJzCkBtmGLsAf8o3qQ&_nc_zt=23&_nc_ht=scontent.fceb1-4.fna&_nc_gid=WTTbAiT9XWGP1hBOmAGwYQ&oh=00_AfTzDTruO97WZqM5UDNUJkJfxp2UNGiOzTLA4mh7k1Otmw&oe=688AEDAF",
      "https://scontent.fceb1-1.fna.fbcdn.net/v/t39.30808-6/518372685_1029465759341510_2360906205928437222_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE23QHMAFIT52EV95vZQE-vHHR9X31DvowcdH1ffUO-jOhhFTQJU-Uak1n4FGXsIvu8_oGDnsdBDrejoWg2uWtH&_nc_ohc=Wsp14JtjJBIQ7kNvwHAnqDO&_nc_oc=AdlrFx8KCcYG3s7vNfHNra97ZrHe_nGvE8mls3lNA30Sl7DVowzfaPWmvsfbn9xPk_Y&_nc_zt=23&_nc_ht=scontent.fceb1-1.fna&_nc_gid=5l1axhZySYPC3L5CgyzJRA&oh=00_AfTK75m1kL9hbBaQVOADbG9D8rly_-lRO4fJUnWdgFeCoQ&oe=688AC9BF",
      "https://scontent.fceb1-1.fna.fbcdn.net/v/t39.30808-6/518366718_1029466709341415_3868106395528531303_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEjcV-Fog3W-_F6t1fl37Ki4ruH83bz1CHiu4fzdvPUIW3m0bTdgqw_EqfVzdbpPzF8zH-E2o8hfLIKVj6_CpF-&_nc_ohc=sNi8W_m3OOQQ7kNvwEqYGdw&_nc_oc=AdnFZxBOwqFQlLY8z5IC2rK-edCKbJ4fNN-W9wc533sEwyVkx2p9n98kagu6S3zsV90&_nc_zt=23&_nc_ht=scontent.fceb1-1.fna&_nc_gid=45CMvzEFwReyqzntXJ1syw&oh=00_AfTCVKAcpdwgQaDJ6QzhctibyrdiS7z7_NR3f9VbaeC1Rg&oe=688AE651",
      "https://scontent.fceb1-2.fna.fbcdn.net/v/t39.30808-6/518371604_1029466859341400_4895207822920436755_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEyOTjFDoRLa6AduWjs5OyiDOoKAkAXxS0M6goCQBfFLQDZBLWitDfXMOMycbVmCoI0sqci0iLIxZHo5w396w6x&_nc_ohc=RJFrSUtFrRIQ7kNvwGMrNwF&_nc_oc=Adk-9GI-9s25vOVOFQxO70Gg_lY5DuEkAZQZvEpfcTdKEWEz2Vncm-QWstKzLVwKSe8&_nc_zt=23&_nc_ht=scontent.fceb1-2.fna&_nc_gid=WU9I8LpLhUAQXk6QR9lniw&oh=00_AfRpumrfDpvfxcD045OLLJacd-Ve8dRrcoUMeI-AX86pJA&oe=688AE92F",
    ],
  },
  {
    id: 2,
    title: "Graduation Ceremony",
    description:
      "College graduation ceremony at the main auditorium. The Class of 2023 celebrated their achievements with proud family members, friends, and faculty in attendance.",
    image: "/placeholder.svg?height=600&width=800&text=Graduation+Ceremony",
    category: "Events",
    subcategory: "Graduation",
    year: "2023",
    date: "March 25, 2023",
    tags: ["graduation", "ceremony", "achievement"],
    likes: 67,
    views: 230,
    photographer: "Maria Santos",
    location: "College Auditorium",
    duration: "2 Hours",
    featured: false,
    relatedImages: [
      "/placeholder.svg?height=300&width=400&text=Related+1",
      "/placeholder.svg?height=300&width=400&text=Related+2",
      "/placeholder.svg?height=300&width=400&text=Related+3",
      "/placeholder.svg?height=300&width=400&text=Related+4",
    ],
  },
  {
    id: 3,
    title: "IT Bootcamp",
    description:
      "3-day intensive coding bootcamp for IT students. Industry professionals taught advanced programming techniques and modern development practices.",
    image: "/placeholder.svg?height=600&width=800&text=IT+Bootcamp",
    category: "Academic",
    subcategory: "Workshops",
    year: "2023",
    date: "January 10, 2023",
    tags: ["technology", "learning", "coding"],
    likes: 35,
    views: 128,
    photographer: "Robert Santos",
    location: "Computer Laboratory",
    duration: "3 Days",
    featured: false,
    relatedImages: [
      "/placeholder.svg?height=300&width=400&text=Related+1",
      "/placeholder.svg?height=300&width=400&text=Related+2",
      "/placeholder.svg?height=300&width=400&text=Related+3",
      "/placeholder.svg?height=300&width=400&text=Related+4",
    ],
  },
]

export default function GalleryDetailPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const { toast } = useToast()

  const photoId = Number.parseInt(params.id)
  const photo = galleryData.find((item) => item.id === photoId) || galleryData[0]

  const currentIndex = galleryData.findIndex((item) => item.id === photoId)
  const prevPhoto = currentIndex > 0 ? galleryData[currentIndex - 1] : null
  const nextPhoto = currentIndex < galleryData.length - 1 ? galleryData[currentIndex + 1] : null

  const allImages = [photo.image, ...photo.relatedImages]

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [currentImageIndex])

  const handleLike = () => {
    setIsLiked(!isLiked)
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Photo removed from your favorites" : "Photo added to your favorites",
    })
  }

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your photo is being downloaded",
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Gallery link copied to clipboard",
      })
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + allImages.length) % allImages.length)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <Header />

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            {/* Enhanced control buttons */}
            <button
              className="absolute top-6 right-6 text-white bg-black/60 backdrop-blur-sm p-3 rounded-full hover:bg-black/80 z-10 transition-all duration-200"
              onClick={toggleFullscreen}
            >
              <X className="h-6 w-6" />
            </button>

            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-4 rounded-full hover:bg-black/80 z-10 transition-all duration-200"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm text-white p-4 rounded-full hover:bg-black/80 z-10 transition-all duration-200"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Enhanced image counter and info */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm flex items-center gap-4">
              <span>
                {currentImageIndex + 1} / {allImages.length}
              </span>
              <div className="w-px h-4 bg-white/30"></div>
              <span className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                {photo.title}
              </span>
            </div>

            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={allImages[currentImageIndex] || "/placeholder.svg"}
                alt={`${photo.title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 py-12">
        <div className="container px-4">
          <div className="flex items-center gap-3 mb-10">
            <Link
              href="/gallery"
              className="text-blue-600 hover:text-blue-800 flex items-center font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Gallery
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700 font-medium">{photo.category}</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-semibold truncate max-w-xs">{photo.title}</span>
          </div>

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8 shadow-xl"
            >
              <div className="relative aspect-[3/2] bg-gradient-to-br from-gray-100 to-gray-200">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                )}

                <Image
                  src={allImages[currentImageIndex] || "/placeholder.svg"}
                  alt={photo.title}
                  fill
                  className={cn(
                    "object-contain transition-all duration-500",
                    isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100",
                  )}
                  onLoad={() => setIsLoading(false)}
                />

                {/* Enhanced navigation arrows */}
                <button
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-4 rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-800 p-4 rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Enhanced control buttons */}
                <div className="absolute top-6 right-6 flex gap-3">
                  <button
                    className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                    onClick={() => setShowInfo(!showInfo)}
                  >
                    <Info className="h-5 w-5" />
                  </button>
                  <button
                    className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                    onClick={toggleFullscreen}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                </div>

                {/* Enhanced image counter */}
                <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {allImages.length}
                </div>

                {/* Photo info overlay */}
                <AnimatePresence>
                  {showInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm text-white p-4 rounded-xl max-w-sm"
                    >
                      <p className="text-sm font-medium mb-1">{photo.title}</p>
                      <p className="text-xs text-gray-300">
                        Photo {currentImageIndex + 1} of {allImages.length}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-8 border-t bg-gradient-to-r from-gray-50 to-blue-50/30">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      className={cn(
                        "relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300",
                        currentImageIndex === index
                          ? "ring-4 ring-blue-500 ring-offset-2 scale-110 shadow-lg"
                          : "opacity-60 hover:opacity-100 hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 hover:scale-105",
                      )}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {currentImageIndex === index && (
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 to-transparent" />
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4 mb-8 justify-center"
            >
              <Button
                variant="outline"
                className={cn(
                  "border-2 transition-all duration-300 px-6 py-3",
                  isLiked
                    ? "bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
                    : "border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400",
                )}
                onClick={handleLike}
              >
                <Heart className="h-4 w-4 mr-2" fill={isLiked ? "currentColor" : "none"} />
                {isLiked ? "Liked" : "Like"}
              </Button>
              <Button
                variant="outline"
                className="border-2 border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 px-6 py-3 bg-transparent"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 px-6 py-3 bg-transparent"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                className="border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 px-6 py-3 bg-transparent"
                onClick={toggleFullscreen}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl"
              >
                {/* Header with badges */}
                <div className="flex items-center gap-3 mb-6">
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2">
                    {photo.category}
                  </Badge>
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2">
                    {photo.subcategory}
                  </Badge>
                  {photo.featured && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{photo.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">{photo.description}</p>

                {/* Enhanced tags */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-500 font-medium">Tags</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {photo.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/gallery?tag=${tag}`}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-sm hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white rounded-2xl border border-gray-200 p-8 shadow-xl"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Photo Details</h2>

                {/* Enhanced metadata grid */}
                <div className="grid gap-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Date</p>
                      <p className="font-semibold text-gray-900">{photo.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Location</p>
                      <p className="font-semibold text-gray-900">{photo.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Photographer</p>
                      <p className="font-semibold text-gray-900">{photo.photographer}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Duration</p>
                      <p className="font-semibold text-gray-900">{photo.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Heart className="h-5 w-5 text-red-500 mr-1" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{photo.likes + (isLiked ? 1 : 0)}</p>
                    <p className="text-sm text-gray-600">Likes</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Eye className="h-5 w-5 text-blue-500 mr-1" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{photo.views}</p>
                    <p className="text-sm text-gray-600">Views</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid md:grid-cols-2 gap-4"
            >
              {prevPhoto && (
                <Link href={`/gallery/${prevPhoto.id}`}>
                  <div className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <ChevronLeft className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Previous Album</p>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                          {prevPhoto.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {nextPhoto && (
                <Link href={`/gallery/${nextPhoto.id}`}>
                  <div className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Next Album</p>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                          {nextPhoto.title}
                        </p>
                      </div>
                      <ChevronRight className="h-6 w-6 text-blue-600 group-hover:text-blue-700" />
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
