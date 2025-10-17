import { NextRequest, NextResponse } from "next/server"
import { fixAlbumCoverImages } from "@/lib/gallery-service"

// POST /api/admin/fix-album-covers - Fix album cover images
export async function POST(request: NextRequest) {
  try {
    console.log('[Fix Album Covers API] Starting to fix album cover images...')
    
    const result = await fixAlbumCoverImages()
    
    return NextResponse.json({
      success: true,
      message: `Fixed ${result.fixed} out of ${result.total} albums`,
      data: result
    })
  } catch (error) {
    console.error('[Fix Album Covers API] Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fix album cover images' 
      },
      { status: 500 }
    )
  }
}
