import { uploadImageToImgbb, type UploadResult } from './imgbb-service'

export interface ImageUploadOptions {
  maxSize?: number // in bytes, default 5MB
  allowedTypes?: string[] // default ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  quality?: number // for compression, 0-1, default 0.8
}

const DEFAULT_OPTIONS: Required<ImageUploadOptions> = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  quality: 0.8,
}

export async function uploadProfileImage(
  file: File,
  options: ImageUploadOptions = {}
): Promise<UploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  // Validate file type
  if (!opts.allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type. Allowed types: ${opts.allowedTypes.join(', ')}`,
    }
  }
  
  // Validate file size
  if (file.size > opts.maxSize) {
    return {
      success: false,
      error: `File too large. Maximum size: ${Math.round(opts.maxSize / 1024 / 1024)}MB`,
    }
  }
  
  try {
    // Try to upload to ImgBB first
    const processedFile = await compressImage(file, opts.quality)
    const uploadResult = await uploadImageToImgbb(processedFile, `profile_${Date.now()}`)
    
    if (uploadResult.success) {
      return uploadResult
    } else {
      console.warn('[v0] ImgBB upload failed, using local storage fallback:', uploadResult.error)
      
      // Fallback to local storage
      const previewUrl = await getImagePreviewUrl(file)
      const localImageId = `local_profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Store in localStorage as fallback
      if (typeof window !== 'undefined') {
        localStorage.setItem(`profile_image_${localImageId}`, previewUrl)
      }
      
      return {
        success: true,
        url: previewUrl,
        thumbnailUrl: previewUrl,
        filename: file.name,
      }
    }
  } catch (error) {
    console.error('[v0] Image upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function uploadGalleryImage(
  file: File,
  options: ImageUploadOptions = {}
): Promise<UploadResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  // Validate file type
  if (!opts.allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type. Allowed types: ${opts.allowedTypes.join(', ')}`,
    }
  }
  
  // Validate file size
  if (file.size > opts.maxSize) {
    return {
      success: false,
      error: `File too large. Maximum size: ${Math.round(opts.maxSize / 1024 / 1024)}MB`,
    }
  }
  
  // Compress image if needed
  const processedFile = await compressImage(file, opts.quality)
  
  // Upload to ImgBB
  return uploadImageToImgbb(processedFile, `gallery_${Date.now()}`)
}

export async function uploadMultipleImages(
  files: File[],
  options: ImageUploadOptions = {}
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file => uploadGalleryImage(file, options))
  return Promise.all(uploadPromises)
}

function compressImage(file: File, quality: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions (maintain aspect ratio)
      const maxWidth = 1920
      const maxHeight = 1080
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        quality
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

export function validateImageFile(file: File, options: ImageUploadOptions = {}): string | null {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  // Check file type
  if (!opts.allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed types: ${opts.allowedTypes.join(', ')}`
  }
  
  // Check file size
  if (file.size > opts.maxSize) {
    return `File too large. Maximum size: ${Math.round(opts.maxSize / 1024 / 1024)}MB`
  }
  
  return null
}

export function getImagePreviewUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
