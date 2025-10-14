import { NextRequest, NextResponse } from "next/server"
import { updateMediaStatus, deleteMediaItem } from "@/lib/gallery-database"

// PUT /api/gallery/media/[id] - Update media status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    if (!body.status || !['approved', 'pending', 'rejected'].includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be approved, pending, or rejected' },
        { status: 400 }
      )
    }
    
    const success = await updateMediaStatus(params.id, body.status)
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Media item not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Media status updated successfully'
    })
  } catch (error) {
    console.error('Error updating media status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update media status' },
      { status: 500 }
    )
  }
}

// DELETE /api/gallery/media/[id] - Delete media item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteMediaItem(params.id)
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Media item not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Media item deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting media item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete media item' },
      { status: 500 }
    )
  }
}
