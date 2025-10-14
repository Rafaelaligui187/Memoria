import { NextRequest, NextResponse } from "next/server"
import { 
  createAlbum, 
  getAlbums, 
  getAlbumById, 
  updateAlbum, 
  deleteAlbum,
  connectToDatabase 
} from "@/lib/gallery-database"

// GET /api/gallery/albums - Get all albums
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const yearId = searchParams.get('yearId')
    
    const albums = await getAlbums(yearId || undefined)
    
    return NextResponse.json({
      success: true,
      data: albums,
      count: albums.length
    })
  } catch (error) {
    console.error('Error fetching albums:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch albums' },
      { status: 500 }
    )
  }
}

// POST /api/gallery/albums - Create a new album
export async function POST(request: NextRequest) {
  try {
    console.log('[Album API] Starting album creation...')
    
    const body = await request.json()
    console.log('[Album API] Request body received:', body)
    
    // Validate required fields - yearId can be optional for global albums
    if (!body.title || !body.category) {
      console.error('[Album API] Missing required fields:', {
        title: !!body.title,
        category: !!body.category,
        yearId: body.yearId || 'not provided (will use global)',
        body: body
      })
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, category' },
        { status: 400 }
      )
    }
    
    // Use provided yearId or default to "global" for albums that span all years
    const yearId = body.yearId || "global"
    console.log('[Album API] Using yearId:', yearId)
    
    console.log('[Album API] All required fields present, creating album...')
    
    const album = await createAlbum({
      title: body.title,
      description: body.description || '',
      category: body.category,
      tags: body.tags || [],
      date: body.date || '',
      location: body.location || '',
      photographer: body.photographer || '',
      duration: body.duration || '',
      isFeatured: body.isFeatured || false,
      isPublic: body.isPublic !== false, // Default to true
      yearId: yearId,
    })
    
    console.log('[Album API] Album created successfully:', album)
    
    return NextResponse.json({
      success: true,
      data: album
    })
  } catch (error) {
    console.error('[Album API] Error creating album:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create album' },
      { status: 500 }
    )
  }
}
