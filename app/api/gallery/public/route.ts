import { NextRequest, NextResponse } from "next/server"
import { getAlbums } from "@/lib/gallery-database"

// GET /api/gallery/public - Get all public albums for the user gallery
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const yearId = searchParams.get('yearId')
    
    // Get all albums
    const allAlbums = await getAlbums(yearId || undefined)
    
    // Filter only public albums
    const publicAlbums = allAlbums.filter(album => album.isPublic)
    
    return NextResponse.json({
      success: true,
      data: publicAlbums,
      count: publicAlbums.length
    })
  } catch (error) {
    console.error('Error fetching public albums:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery albums' },
      { status: 500 }
    )
  }
}
