import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: { yearId: string; mediaId: string } }) {
  try {
    const db = getDatabase()
    const mediaItem = db.media.find((m) => m.id === params.mediaId)

    if (!mediaItem) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // Delete from Vercel Blob
    await del(mediaItem.url)

    // Remove from database
    const index = db.media.findIndex((m) => m.id === params.mediaId)
    if (index > -1) {
      db.media.splice(index, 1)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { yearId: string; mediaId: string } }) {
  try {
    const { caption, albumId } = await request.json()
    const db = getDatabase()

    const mediaIndex = db.media.findIndex((m) => m.id === params.mediaId)
    if (mediaIndex === -1) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 })
    }

    // Update media item
    if (caption !== undefined) db.media[mediaIndex].caption = caption
    if (albumId !== undefined) db.media[mediaIndex].albumId = albumId

    return NextResponse.json({
      success: true,
      media: db.media[mediaIndex],
    })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
