const IMGBB_API_KEY = '4b59f8977ddecb0dae921ba1d6a3654d'
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload'

export interface ImgbbUploadResponse {
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

export interface UploadResult {
  success: boolean
  url?: string
  thumbnailUrl?: string
  filename?: string
  error?: string
}

export async function uploadImageToImgbb(
  imageFile: File | string,
  name?: string
): Promise<UploadResult> {
  try {
    let base64Image: string

    if (typeof imageFile === 'string') {
      // If it's already a base64 string
      base64Image = imageFile
    } else {
      // Convert File to base64
      base64Image = await fileToBase64(imageFile)
    }

    const formData = new FormData()
    formData.append('key', IMGBB_API_KEY)
    formData.append('image', base64Image)
    if (name) {
      formData.append('name', name)
    }

    console.log('[v0] Uploading image to ImgBB...', { name, imageSize: base64Image.length })

    const response = await fetch(IMGBB_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    })

    console.log('[v0] ImgBB response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[v0] ImgBB API error:', errorText)
      return {
        success: false,
        error: `API Error (${response.status}): ${errorText}`,
      }
    }

    const result: ImgbbUploadResponse = await response.json()
    console.log('[v0] ImgBB response:', result)

    if (result.success && result.data) {
      return {
        success: true,
        url: result.data.url,
        thumbnailUrl: result.data.thumb.url,
        filename: result.data.image.filename,
      }
    } else {
      console.error('[v0] ImgBB upload failed:', result.error)
      return {
        success: false,
        error: result.error?.message || 'Upload failed',
      }
    }
  } catch (error) {
    console.error('[v0] Error uploading to ImgBB:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export async function uploadMultipleImages(
  images: (File | string)[],
  names?: string[]
): Promise<UploadResult[]> {
  const uploadPromises = images.map((image, index) =>
    uploadImageToImgbb(image, names?.[index])
  )
  
  return Promise.all(uploadPromises)
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Remove the data:image/...;base64, prefix
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function deleteImageFromImgbb(deleteUrl: string): Promise<boolean> {
  try {
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
    })
    return response.ok
  } catch (error) {
    console.error('[v0] Error deleting image from ImgBB:', error)
    return false
  }
}
