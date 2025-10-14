import { NextRequest, NextResponse } from "next/server"
import { 
  getMediaItems, 
  getMediaByAlbumId, 
  addMediaToAlbum, 
  updateMediaStatus,
  deleteMediaItem 
} from "@/lib/gallery-database"

// GET /api/gallery/media - Get all media items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const yearId = searchParams.get('yearId')
    const albumId = searchParams.get('albumId')
    const status = searchParams.get('status')
    
    let mediaItems
    
    if (albumId) {
      mediaItems = await getMediaByAlbumId(albumId)
    } else {
      mediaItems = await getMediaItems(yearId || undefined)
    }
    
    // Filter by status if provided
    if (status) {
      mediaItems = mediaItems.filter(item => item.status === status)
    }
    
    return NextResponse.json({
      success: true,
      data: mediaItems,
      count: mediaItems.length
    })
  } catch (error) {
    console.error('Error fetching media items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch media items' },
      { status: 500 }
    )
  }
}

// POST /api/gallery/media - Add media to album
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.albumId || !body.mediaItems || !Array.isArray(body.mediaItems)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: albumId, mediaItems' },
        { status: 400 }
      )
    }
    
    await addMediaToAlbum(body.albumId, body.mediaItems)
    
    return NextResponse.json({
      success: true,
      message: 'Media added to album successfully'
    })
  } catch (error) {
    console.error('Error adding media to album:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add media to album' },
      { status: 500 }
    )
  }
}
