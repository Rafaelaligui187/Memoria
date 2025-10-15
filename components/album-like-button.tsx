"use client"

import { useState, useEffect } from "react"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUserClient } from "@/lib/auth-client"
import { useAlbumLikes } from "@/contexts/album-likes-context"

interface AlbumLikeButtonProps {
  albumId: string
  initialLikeCount?: number
  initialIsLiked?: boolean
  className?: string
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  onLikeChange?: (isLiked: boolean, count: number) => void
}

interface LikeStats {
  albumId: string
  totalLikes: number
  isLikedByUser: boolean
}

export function AlbumLikeButton({
  albumId,
  initialLikeCount = 0,
  initialIsLiked = false,
  className,
  size = "md",
  showCount = true,
  onLikeChange
}: AlbumLikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()
  const { isAlbumLiked, toggleLike, isLoading: contextLoading } = useAlbumLikes()
  
  const isLiked = isAlbumLiked(albumId)

  // Load initial like count
  useEffect(() => {
    const loadInitialLikeCount = async () => {
      try {
        const currentUser = getCurrentUserClient()
        if (!currentUser) return

        const response = await fetch(`/api/gallery/likes?albumId=${albumId}&userId=${currentUser.id}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            const stats: LikeStats = result.data
            setLikeCount(stats.totalLikes)
          }
        }
      } catch (error) {
        console.error('Error loading initial like count:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    loadInitialLikeCount()
  }, [albumId])

  const handleLikeToggle = async () => {
    try {
      // Safety check for getCurrentUser function
      if (typeof getCurrentUserClient !== 'function') {
        console.error('getCurrentUserClient is not a function')
        toast({
          title: "Authentication Error",
          description: "Authentication system is not properly loaded",
          variant: "destructive"
        })
        return
      }

      const currentUser = getCurrentUserClient()
      
      if (!currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please log in to like albums",
          variant: "destructive"
        })
        return
      }

      if (!isInitialized) {
        return
      }

      setIsLoading(true)
      
      if (isLiked) {
        // Unlike the album
        const response = await fetch(`/api/gallery/likes?albumId=${albumId}&userId=${currentUser.id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            const stats: LikeStats = result.data.stats
            toggleLike(albumId, false)
            setLikeCount(stats.totalLikes)
            onLikeChange?.(false, stats.totalLikes)
            
            toast({
              title: "Removed from favorites",
              description: "Album removed from your favorites"
            })
          }
        } else {
          throw new Error('Failed to unlike album')
        }
      } else {
        // Like the album
        const response = await fetch('/api/gallery/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ albumId, userId: currentUser.id })
        })
        
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            const stats: LikeStats = result.data.stats
            toggleLike(albumId, true)
            setLikeCount(stats.totalLikes)
            onLikeChange?.(true, stats.totalLikes)
            
            toast({
              title: "Added to favorites",
              description: "Album added to your favorites"
            })
          }
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to like album')
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update like status",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg"
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  }

  return (
    <Button
      onClick={handleLikeToggle}
      disabled={isLoading || !isInitialized || contextLoading}
      variant="outline"
      className={cn(
        "flex items-center gap-2 transition-all duration-200",
        isLiked && "text-red-600 border-red-200 bg-red-50 hover:bg-red-100",
        !isLiked && "text-blue-600 border-blue-200 hover:bg-blue-50",
        sizeClasses[size],
        className
      )}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSizes[size], "animate-spin")} />
      ) : (
        <Heart className={cn(iconSizes[size], isLiked && "fill-current")} />
      )}
      <span>{isLiked ? "Unlike" : "Like"}</span>
    </Button>
  )
}

// Hook for managing album likes
export function useAlbumLikesData(albumIds: string[]) {
  const [likesData, setLikesData] = useState<Record<string, LikeStats>>({})
  const [isLoading, setIsLoading] = useState(false)

  const loadLikesData = async () => {
    const currentUser = getCurrentUserClient()
    if (!currentUser || albumIds.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/gallery/likes?albumIds=${albumIds.join(',')}&userId=${currentUser.id}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          const stats: LikeStats[] = result.data
          const likesMap: Record<string, LikeStats> = {}
          stats.forEach(stat => {
            likesMap[stat.albumId] = stat
          })
          setLikesData(likesMap)
        }
      }
    } catch (error) {
      console.error('Error loading likes data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLikesData()
  }, [albumIds.join(',')])

  return {
    likesData,
    isLoading,
    refreshLikes: loadLikesData
  }
}
