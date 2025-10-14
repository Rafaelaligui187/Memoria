import { NextRequest, NextResponse } from "next/server"

// Gallery API Configuration - Dedicated API key for Gallery & Album feature
const GALLERY_API_KEY = '7424c74d99fd750958595adb9268f256'
const GALLERY_API_BASE_URL = 'https://api.imgbb.com/1'

export async function POST(request: NextRequest) {
  try {
    console.log('[Gallery Upload] Starting upload process...')
    
    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string

    console.log('[Gallery Upload] File received:', { 
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: file?.type,
      name 
    })

    if (!file) {
      console.error('[Gallery Upload] No file provided')
      return NextResponse.json({ 
        success: false,
        error: "No file provided" 
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      console.error('[Gallery Upload] Invalid file type:', file.type)
      return NextResponse.json({ 
        success: false,
        error: `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}` 
      }, { status: 400 })
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      console.error('[Gallery Upload] File too large:', file.size)
      return NextResponse.json({ 
        success: false,
        error: `File too large: ${Math.round(file.size / 1024 / 1024)}MB. Maximum size: 10MB` 
      }, { status: 400 })
    }

    console.log('[Gallery Upload] Converting file to base64...')
    // Convert file to base64
    const base64Image = await fileToBase64(file)
    console.log('[Gallery Upload] Base64 conversion complete, length:', base64Image.length)

    // Try ImgBB API first
    try {
      console.log('[Gallery Upload] Attempting ImgBB API upload...')
      
      const uploadFormData = new FormData()
      uploadFormData.append('key', GALLERY_API_KEY)
      uploadFormData.append('image', base64Image)
      if (name) {
        uploadFormData.append('name', name)
      }

      console.log('[Gallery Upload] Uploading to ImgBB API with Gallery API Key...', { 
        apiKey: GALLERY_API_KEY.substring(0, 8) + '...',
        fullApiKey: GALLERY_API_KEY, // Log full key for verification
        base64Length: base64Image.length,
        name 
      })

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch(`${GALLERY_API_BASE_URL}/upload`, {
        method: 'POST',
        body: uploadFormData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log('[Gallery Upload] ImgBB API response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('[Gallery Upload] ImgBB API response:', result)

        if (result.success && result.data) {
          console.log('[Gallery Upload] ImgBB upload successful:', {
            url: result.data.url,
            thumbnailUrl: result.data.thumb.url,
            filename: result.data.image.filename
          })
          
          return NextResponse.json({
            success: true,
            url: result.data.url,
            thumbnailUrl: result.data.thumb.url,
            filename: result.data.image.filename,
          })
        } else {
          console.error('[Gallery Upload] ImgBB upload failed:', result.error)
          throw new Error(result.error?.message || 'ImgBB upload failed')
        }
      } else {
        const errorText = await response.text()
        console.error('[Gallery Upload] ImgBB API error:', errorText)
        throw new Error(`ImgBB API Error (${response.status}): ${errorText}`)
      }
    } catch (imgbbError) {
      console.warn('[Gallery Upload] ImgBB API failed, using fallback:', imgbbError)
      
      // Fallback: Return base64 data URL for local storage
      const dataUrl = `data:${file.type};base64,${base64Image}`
      
      console.log('[Gallery Upload] Using fallback data URL')
      
      return NextResponse.json({
        success: true,
        url: dataUrl,
        thumbnailUrl: dataUrl,
        filename: file.name,
        fallback: true, // Indicate this is a fallback
        warning: 'Image stored locally due to external service unavailability'
      })
    }
  } catch (error) {
    console.error("[Gallery Upload] Upload error:", error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : "Upload failed" 
    }, { status: 500 })
  }
}

async function fileToBase64(file: File): Promise<string> {
  try {
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    
    // Convert ArrayBuffer to Buffer (Node.js)
    const buffer = Buffer.from(arrayBuffer)
    
    // Convert Buffer to base64 string
    const base64 = buffer.toString('base64')
    
    return base64
  } catch (error) {
    console.error('[Gallery Upload] Error converting file to base64:', error)
    throw new Error('Failed to convert file to base64')
  }
}
