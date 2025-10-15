import { NextRequest, NextResponse } from "next/server"
import { getAlbumById, updateAlbum, deleteAlbum } from "@/lib/gallery-database"
import { createAuditLog, getClientInfo } from "@/lib/audit-log-utils"

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
    
    // Get the album before updating to capture original data
    const originalAlbum = await getAlbumById(params.id)
    if (!originalAlbum) {
      return NextResponse.json(
        { success: false, error: 'Album not found' },
        { status: 404 }
      )
    }
    
    const album = await updateAlbum(params.id, body)
    
    if (!album) {
      return NextResponse.json(
        { success: false, error: 'Album not found' },
        { status: 404 }
      )
    }
    
    // Create audit log for album update
    try {
      const clientInfo = getClientInfo(request)
      await createAuditLog({
        userId: "admin",
        userName: "Admin",
        action: "album_updated",
        targetType: "album",
        targetId: album.id,
        targetName: album.title,
        details: {
          originalData: {
            title: originalAlbum.title,
            category: originalAlbum.category,
            isPublic: originalAlbum.isPublic,
            isFeatured: originalAlbum.isFeatured,
            description: originalAlbum.description
          },
          updatedData: {
            title: album.title,
            category: album.category,
            isPublic: album.isPublic,
            isFeatured: album.isFeatured,
            description: album.description
          },
          changes: Object.keys(body)
        },
        schoolYearId: album.yearId,
        userAgent: clientInfo.userAgent,
        status: "success"
      })
    } catch (auditError) {
      console.error('[Album API] Failed to create audit log for update:', auditError)
      // Don't fail the album update if audit logging fails
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
    // Get the album before deleting to capture data for audit log
    const album = await getAlbumById(params.id)
    if (!album) {
      return NextResponse.json(
        { success: false, error: 'Album not found' },
        { status: 404 }
      )
    }
    
    const success = await deleteAlbum(params.id)
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Album not found' },
        { status: 404 }
      )
    }
    
    // Create audit log for album deletion
    try {
      const clientInfo = getClientInfo(request)
      await createAuditLog({
        userId: "admin",
        userName: "Admin",
        action: "album_deleted",
        targetType: "album",
        targetId: album.id,
        targetName: album.title,
        details: {
          deletedAlbumData: {
            title: album.title,
            category: album.category,
            yearId: album.yearId,
            isPublic: album.isPublic,
            isFeatured: album.isFeatured,
            description: album.description,
            tags: album.tags,
            location: album.location,
            photographer: album.photographer
          }
        },
        schoolYearId: album.yearId,
        userAgent: clientInfo.userAgent,
        status: "success"
      })
    } catch (auditError) {
      console.error('[Album API] Failed to create audit log for deletion:', auditError)
      // Don't fail the album deletion if audit logging fails
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
