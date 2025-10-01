import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const albumId = formData.get("albumId") as string
    const caption = (formData.get("caption") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `${params.yearId}/${albumId}/${timestamp}-${file.name}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    // Save to database
    const db = getDatabase()
    const mediaItem = {
      id: `media_${timestamp}`,
      albumId,
      filename: file.name,
      url: blob.url,
      caption,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "admin", // TODO: Get from auth context
    }

    db.media.push(mediaItem)

    return NextResponse.json({
      success: true,
      media: mediaItem,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
