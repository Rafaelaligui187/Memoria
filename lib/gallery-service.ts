// Gallery API Configuration - Dedicated API key for Gallery & Album feature
const GALLERY_API_KEY = '7424c74d99fd750958595adb9268f256'
const GALLERY_API_BASE_URL = 'https://api.imgbb.com/1'

export interface GalleryUploadResponse {
  success: boolean
  data?: {
    id: string
    title: string
    url_viewer: string
    url: string
    display_url: string
    width: string
    height: string
    size: string
    time: string
    expiration: string
    image: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    thumb: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    medium: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    delete_url: string
  }
  error?: {
    message: string
    code: number
  }
}

export interface GalleryUploadResult {
  success: boolean
  url?: string
  thumbnailUrl?: string
  filename?: string
  error?: string
}

export interface AlbumData {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  date: string
  location: string
  photographer: string
  duration: string
  isFeatured: boolean
  isPublic: boolean
  coverImage?: string
  mediaCount: number
  createdAt: string
  yearId: string
}

export interface MediaItem {
  id: string
  albumId: string
  filename: string
  url: string
  thumbnailUrl: string
  caption: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  uploadedBy: string
  status: 'approved' | 'pending' | 'rejected'
  yearId: string
}

export async function uploadImageToGallery(
  imageFile: File,
  name?: string
): Promise<GalleryUploadResult> {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.error('[Gallery] Upload called on server side')
      return {
        success: false,
        error: 'Upload must be called from client side',
      }
    }

    // Check if FileReader is available
    if (typeof FileReader === 'undefined') {
      console.error('[Gallery] FileReader is not available')
      return {
        success: false,
        error: 'FileReader is not available in this environment',
      }
    }

    const formData = new FormData()
    formData.append('file', imageFile)
    if (name) {
      formData.append('name', name)
    }

    console.log('[Gallery] Uploading image to Gallery API...', { 
      name, 
      fileSize: imageFile.size,
      fileType: imageFile.type,
      fileName: imageFile.name,
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext
    })

    const response = await fetch('/api/gallery/upload', {
      method: 'POST',
      body: formData,
    })

    console.log('[Gallery] API response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('[Gallery] API error:', errorData)
      return {
        success: false,
        error: errorData.error || `API Error (${response.status})`,
      }
    }

    const result = await response.json()
    console.log('[Gallery] API response:', result)

    if (result.success) {
      console.log('[Gallery] Upload successful:', {
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        filename: result.filename,
        fallback: result.fallback || false
      })
      
      if (result.fallback) {
        console.warn('[Gallery] Using fallback storage:', result.warning)
      }
    }

    return result
  } catch (error) {
    console.error('[Gallery] Error uploading image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function uploadMultipleImagesToGallery(
  images: File[],
  names?: string[]
): Promise<GalleryUploadResult[]> {
  const uploadPromises = images.map((image, index) =>
    uploadImageToGallery(image, names?.[index])
  )
  
  return Promise.all(uploadPromises)
}

export async function deleteImageFromGallery(deleteUrl: string): Promise<boolean> {
  try {
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
    })
    return response.ok
  } catch (error) {
    console.error('[Gallery] Error deleting image:', error)
    return false
  }
}

// Album management functions
export async function createAlbum(albumData: Omit<AlbumData, 'id' | 'createdAt' | 'mediaCount'>): Promise<AlbumData> {
  try {
    console.log('[Gallery Service] Creating album with data:', albumData)
    console.log('[Gallery Service] Current URL:', typeof window !== 'undefined' ? window.location.href : 'Server side')
    
    const response = await fetch('/api/gallery/albums', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(albumData),
    })

    console.log('[Gallery Service] Response status:', response.status)
    console.log('[Gallery Service] Response URL:', response.url)

    if (!response.ok) {
      const error = await response.json()
      console.error('[Gallery Service] API error:', error)
      throw new Error(error.error || 'Failed to create album')
    }

    const result = await response.json()
    console.log('[Gallery Service] Album created successfully:', result.data)
    return result.data
  } catch (error) {
    console.error('[Gallery Service] Error creating album:', error)
    throw error
  }
}

export async function getAlbums(yearId?: string): Promise<AlbumData[]> {
  try {
    const url = yearId ? `/api/gallery/albums?yearId=${yearId}` : '/api/gallery/albums'
    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch albums')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching albums:', error)
    return []
  }
}

export async function getPublicAlbums(yearId?: string): Promise<AlbumData[]> {
  try {
    const url = yearId ? `/api/gallery/albums?yearId=${yearId}` : '/api/gallery/albums'
    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch albums')
    }

    const result = await response.json()
    // Filter for public albums only
    const publicAlbums = result.data.filter((album: AlbumData) => album.isPublic)
    return publicAlbums
  } catch (error) {
    console.error('Error fetching public albums:', error)
    return []
  }
}

export async function getAlbumById(id: string): Promise<AlbumData | null> {
  try {
    const response = await fetch(`/api/gallery/albums/${id}`)

    if (!response.ok) {
      if (response.status === 404) return null
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch album')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching album:', error)
    return null
  }
}

export async function updateAlbum(id: string, updates: Partial<AlbumData>): Promise<AlbumData | null> {
  try {
    const response = await fetch(`/api/gallery/albums/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      if (response.status === 404) return null
      const error = await response.json()
      throw new Error(error.error || 'Failed to update album')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error updating album:', error)
    return null
  }
}

export async function deleteAlbum(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/gallery/albums/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      if (response.status === 404) return false
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete album')
    }

    return true
  } catch (error) {
    console.error('Error deleting album:', error)
    return false
  }
}

// Media management functions
export async function addMediaToAlbum(albumId: string, mediaItems: MediaItem[]): Promise<void> {
  try {
    const response = await fetch('/api/gallery/media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        albumId,
        mediaItems,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add media to album')
    }
  } catch (error) {
    console.error('Error adding media to album:', error)
    throw error
  }
}

export async function getMediaItems(yearId?: string): Promise<MediaItem[]> {
  try {
    const url = yearId ? `/api/gallery/media?yearId=${yearId}` : '/api/gallery/media'
    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch media items')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching media items:', error)
    return []
  }
}

export async function getMediaByAlbumId(albumId: string): Promise<MediaItem[]> {
  try {
    const response = await fetch(`/api/gallery/media?albumId=${albumId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch media items')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching media items:', error)
    return []
  }
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/gallery/media/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      if (response.status === 404) return false
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete media item')
    }

    return true
  } catch (error) {
    console.error('Error deleting media item:', error)
    return false
  }
}

export async function updateMediaStatus(id: string, status: 'approved' | 'pending' | 'rejected'): Promise<boolean> {
  try {
    const response = await fetch(`/api/gallery/media/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      if (response.status === 404) return false
      const error = await response.json()
      throw new Error(error.error || 'Failed to update media status')
    }

    return true
  } catch (error) {
    console.error('Error updating media status:', error)
    return false
  }
}
