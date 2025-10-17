import { NextRequest, NextResponse } from "next/server"

// Message Attachments API Configuration - Dedicated API key for message attachments
const MESSAGE_API_KEY = '7424c74d99fd750958595adb9268f256'
const MESSAGE_API_BASE_URL = 'https://api.imgbb.com/1'

export async function POST(request: NextRequest) {
  try {
    console.log('[Message Attachments Upload] Starting upload process...')
    
    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string

    console.log('[Message Attachments Upload] File received:', { 
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: file?.type,
      name 
    })

    if (!file) {
      console.error('[Message Attachments Upload] No file provided')
      return NextResponse.json({ 
        success: false,
        error: "No file provided" 
      }, { status: 400 })
    }

    // Validate file type - support images and PDFs for message attachments
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "application/pdf"]
    if (!allowedTypes.includes(file.type)) {
      console.error('[Message Attachments Upload] Invalid file type:', file.type)
      return NextResponse.json({ 
        success: false,
        error: `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}` 
      }, { status: 400 })
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      console.error('[Message Attachments Upload] File too large:', file.size)
      return NextResponse.json({ 
        success: false,
        error: `File too large: ${Math.round(file.size / 1024 / 1024)}MB. Maximum size: 10MB` 
      }, { status: 400 })
    }

    console.log('[Message Attachments Upload] Converting file to base64...')
    // Convert file to base64
    const base64File = await fileToBase64(file)
    console.log('[Message Attachments Upload] Base64 conversion complete, length:', base64File.length)

    // Try ImgBB API first (works for images, may work for PDFs too)
    try {
      const formDataImgBB = new FormData()
      formDataImgBB.append('key', MESSAGE_API_KEY)
      formDataImgBB.append('image', base64File)
      formDataImgBB.append('name', name || file.name)

      console.log('[Message Attachments Upload] Uploading to ImgBB...')
      
      // Set timeout for the request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch(`${MESSAGE_API_BASE_URL}/upload`, {
        method: 'POST',
        body: formDataImgBB,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('[Message Attachments Upload] ImgBB API response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('[Message Attachments Upload] ImgBB API response:', result)

        if (result.success && result.data) {
          console.log('[Message Attachments Upload] ImgBB upload successful:', {
            url: result.data.url,
            thumbnailUrl: result.data.thumb?.url || result.data.url,
            filename: result.data.image.filename
          })
          
          return NextResponse.json({
            success: true,
            url: result.data.url,
            thumbnailUrl: result.data.thumb?.url || result.data.url,
            filename: result.data.image.filename,
          })
        } else {
          console.error('[Message Attachments Upload] ImgBB upload failed:', result.error)
          throw new Error(result.error?.message || 'ImgBB upload failed')
        }
      } else {
        const errorText = await response.text()
        console.error('[Message Attachments Upload] ImgBB API error:', errorText)
        throw new Error(`ImgBB API Error (${response.status}): ${errorText}`)
      }
    } catch (imgbbError) {
      console.warn('[Message Attachments Upload] ImgBB API failed, using fallback:', imgbbError)
      
      // Fallback: Return base64 data URL for local storage
      const dataUrl = `data:${file.type};base64,${base64File}`
      
      console.log('[Message Attachments Upload] Using fallback data URL')
      
      return NextResponse.json({
        success: true,
        url: dataUrl,
        thumbnailUrl: dataUrl,
        filename: file.name,
        fallback: true, // Indicate this is a fallback
        warning: 'File stored locally due to external service unavailability'
      })
    }
  } catch (error) {
    console.error("[Message Attachments Upload] Upload error:", error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : "Upload failed" 
    }, { status: 500 })
  }
}

async function fileToBase64(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    return base64
  } catch (error) {
    console.error('[Message Attachments Upload] Error converting file to base64:', error)
    throw new Error('Failed to convert file to base64')
  }
}
