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
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"
import { getAlbumById, getMediaByAlbumId, type AlbumData, type MediaItem } from "@/lib/gallery-service"
import { AlbumLikeButton } from "@/components/album-like-button"
import { getCurrentUserClient } from "@/lib/auth-client"

export default function GalleryDetailPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const [album, setAlbum] = useState<AlbumData | null>(null)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [likeCount, setLikeCount] = useState(0)
  const [viewCount, setViewCount] = useState(0)
  const { toast } = useToast()

  const albumId = params.id

  // Get all images from media items
  const allImages = mediaItems.map(item => item.url)
  const currentImage = allImages[currentImageIndex] || "/placeholder.svg"

  useEffect(() => {
    loadAlbumData()
  }, [albumId])

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [currentImageIndex])

  const loadAlbumData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Fetch album data
      const albumData = await getAlbumById(albumId)
      setAlbum(albumData)
      
      // Fetch media items for this album
      const mediaData = await getMediaByAlbumId(albumId)
      setMediaItems(mediaData)
      
      // Load like and view counts
      await loadCounts()
      
      // Track view
      await trackView()
      
    } catch (err) {
      console.error('Error loading album:', err)
      setError('Failed to load album')
    } finally {
      setIsLoading(false)
    }
  }

  const loadCounts = async () => {
    try {
      const currentUser = getCurrentUserClient()
      
      // Load like count
      const likesResponse = await fetch(`/api/gallery/likes?albumId=${albumId}&userId=${currentUser?.id || ''}`)
      if (likesResponse.ok) {
        const likesResult = await likesResponse.json()
        if (likesResult.success) {
          setLikeCount(likesResult.data.totalLikes)
        }
      }
      
      // Load view count
      const viewsResponse = await fetch(`/api/gallery/views?albumId=${albumId}&userId=${currentUser?.id || ''}`)
      if (viewsResponse.ok) {
        const viewsResult = await viewsResponse.json()
        if (viewsResult.success) {
          setViewCount(viewsResult.data.totalViews)
        }
      }
    } catch (error) {
      console.error('Error loading counts:', error)
    }
  }

  const trackView = async () => {
    try {
      const currentUser = getCurrentUserClient()
      
      await fetch('/api/gallery/views', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          albumId, 
          userId: currentUser?.id 
        })
      })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading album...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !album) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Album not found'}</p>
            <Link href="/gallery">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Gallery
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
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
        title: album.title,
        text: album.description,
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
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white bg-black/60 backdrop-blur-sm p-3 rounded-full hover:bg-black/80 z-10 transition-all duration-200"
              onClick={prevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white bg-black/60 backdrop-blur-sm p-3 rounded-full hover:bg-black/80 z-10 transition-all duration-200"
              onClick={nextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            >
              <Image
                src={currentImage}
                alt={album.title}
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/gallery"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Gallery
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{album.category}</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{album.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Main Image Viewer */}
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            {/* Image Container */}
            <div className="relative aspect-[16/9] bg-gray-100">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentImage}
                    alt={album.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Top Right Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <Info className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all duration-200"
                  onClick={toggleFullscreen}
                >
                  <Grid3X3 className="h-4 w-4 text-gray-700" />
                </button>
              </div>

              {/* Image Counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {allImages.length}
                </div>
              )}
            </div>

                {/* Thumbnail Strip */}
                {allImages.length > 1 && (
                  <div className="p-6 bg-gray-50">
                    <div className="flex gap-4 overflow-x-auto">
                      {allImages.map((image, index) => (
                        <button
                          key={index}
                          className={cn(
                            "relative flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden border-2 transition-all duration-200",
                            currentImageIndex === index
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

          </div>

          {/* Action Buttons - Outside and Centered */}
          <div className="flex justify-center mt-8 mb-12">
            <div className="flex gap-8">
              <AlbumLikeButton
                albumId={albumId}
                size="lg"
                showCount={false}
                className="px-8 py-4 text-lg font-semibold"
                onLikeChange={(isLiked, count) => setLikeCount(count)}
              />
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleDownload}
                className="flex items-center gap-4 px-8 py-4 text-lg font-semibold border-green-200 text-green-600 hover:bg-green-50"
              >
                <Download className="h-6 w-6" />
                Download
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleShare}
                className="flex items-center gap-4 px-8 py-4 text-lg font-semibold border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Share2 className="h-6 w-6" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={toggleFullscreen}
                className="flex items-center gap-4 px-8 py-4 text-lg font-semibold border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <Grid3X3 className="h-6 w-6" />
                Fullscreen
              </Button>
            </div>
          </div>

          {/* Details Section - Now at Bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Event Description */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className="bg-blue-600 text-white px-4 py-2 rounded-full text-base font-semibold">
                  {album.category}
                </Badge>
                {album.tags.slice(0, 1).map((tag, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-base font-semibold">
                    {tag}
                  </Badge>
                ))}
                {album.isFeatured && (
                  <Badge className="bg-orange-500 text-white px-4 py-2 rounded-full text-base font-semibold">
                    <Star className="h-4 w-4 mr-2" />
                    Featured
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">{album.title}</h1>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">{album.description}</p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="h-6 w-6 text-gray-500" />
                  <h3 className="text-xl font-semibold text-gray-600">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {album.tags.map((tag, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-base font-semibold">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Photo Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Photo Details</h2>
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-sm flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-600">Date</span>
                    <span className="text-xl text-gray-900">{album.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-sm flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-600">Location</span>
                    <span className="text-xl text-gray-900">{album.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-sm flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-600">Photographer</span>
                    <span className="text-xl text-gray-900">{album.photographer}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-sm flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-600">Duration</span>
                    <span className="text-xl text-gray-900">{album.duration}</span>
                  </div>
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="bg-red-50 rounded-xl p-8 text-center">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-gray-900">{likeCount}</div>
                  <div className="text-lg text-gray-600">Likes</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-8 text-center">
                  <Eye className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                  <div className="text-4xl font-bold text-gray-900">{viewCount}</div>
                  <div className="text-lg text-gray-600">Views</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}