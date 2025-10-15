"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { getCurrentUserClient } from "@/lib/auth-client"

interface AlbumLikeContextType {
  likedAlbums: Set<string>
  isLoading: boolean
  toggleLike: (albumId: string, isLiked: boolean) => void
  isAlbumLiked: (albumId: string) => boolean
  refreshLikes: () => Promise<void>
}

const AlbumLikeContext = createContext<AlbumLikeContextType | undefined>(undefined)

interface AlbumLikeProviderProps {
  children: ReactNode
}

export function AlbumLikeProvider({ children }: AlbumLikeProviderProps) {
  const [likedAlbums, setLikedAlbums] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  const loadUserLikes = async () => {
    try {
      const currentUser = getCurrentUserClient()
      
      if (!currentUser) {
        setLikedAlbums(new Set())
        return
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      setLikedAlbums(new Set())
      return
    }

    setIsLoading(true)
    try {
      const currentUser = getCurrentUserClient()
      const response = await fetch(`/api/gallery/likes?userId=${currentUser.id}`)
      
      if (response.ok) {
        const result = await response.json()
        
        if (result.success) {
          const likedAlbumIds: string[] = result.data
          setLikedAlbums(new Set(likedAlbumIds))
        }
      }
    } catch (error) {
      console.error('Error loading user likes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLike = (albumId: string, isLiked: boolean) => {
    setLikedAlbums(prev => {
      const newSet = new Set(prev)
      if (isLiked) {
        newSet.add(albumId)
      } else {
        newSet.delete(albumId)
      }
      return newSet
    })
  }

  const isAlbumLiked = (albumId: string) => {
    return likedAlbums.has(albumId)
  }

  const refreshLikes = async () => {
    await loadUserLikes()
  }

  // Load likes when component mounts or user changes
  useEffect(() => {
    // Add a small delay to ensure the user is properly loaded from localStorage
    const timer = setTimeout(() => {
      loadUserLikes()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  // Also reload when the user data changes in localStorage
  useEffect(() => {
    const checkUserChange = () => {
      const currentUser = getCurrentUserClient()
      if (currentUser) {
        loadUserLikes()
      }
    }

    // Check for user changes every 500ms for the first 5 seconds
    const interval = setInterval(checkUserChange, 500)
    const timeout = setTimeout(() => clearInterval(interval), 5000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'memoria_user') {
        loadUserLikes()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const value: AlbumLikeContextType = {
    likedAlbums,
    isLoading,
    toggleLike,
    isAlbumLiked,
    refreshLikes
  }

  return (
    <AlbumLikeContext.Provider value={value}>
      {children}
    </AlbumLikeContext.Provider>
  )
}

export function useAlbumLikes() {
  const context = useContext(AlbumLikeContext)
  if (context === undefined) {
    throw new Error('useAlbumLikes must be used within an AlbumLikeProvider')
  }
  return context
}
