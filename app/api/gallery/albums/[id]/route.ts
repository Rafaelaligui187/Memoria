import { NextRequest, NextResponse } from "next/server"
import { getAlbumById, updateAlbum, deleteAlbum } from "@/lib/gallery-database"

// GET /api/gallery/albums/[id] - Get album by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const album = await getAlbumById(params.id)
    
    if (!album) {
      return NextResponse.json(
        { success: false, error: 'Album not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: album
    })
  } catch (error) {
    console.error('Error fetching album:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch album' },
      { status: 500 }
    )
  }
}

// PUT /api/gallery/albums/[id] - Update album
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const album = await updateAlbum(params.id, body)
    
    if (!album) {
      return NextResponse.json(
        { success: false, error: 'Album not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: album
    })
  } catch (error) {
    console.error('Error updating album:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update album' },
      { status: 500 }
    )
  }
}

// DELETE /api/gallery/albums/[id] - Delete album
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteAlbum(params.id)
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Album not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Album deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting album:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete album' },
      { status: 500 }
    )
  }
}
