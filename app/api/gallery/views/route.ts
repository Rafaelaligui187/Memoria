import { NextRequest, NextResponse } from "next/server"
import { trackAlbumView, getAlbumViewStats, getMultipleAlbumViewStats } from "@/lib/gallery-views-service"

// POST - Track a view for an album
export async function POST(request: NextRequest) {
  try {
    const { albumId, userId } = await request.json()
    
    if (!albumId) {
      return NextResponse.json({
        success: false,
        error: "Album ID is required"
      }, { status: 400 })
    }
    
    // Get user agent and IP for tracking
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    // Track the view
    const view = await trackAlbumView(albumId, userId, userAgent, ipAddress)
    
    // Get updated stats
    const stats = await getAlbumViewStats(albumId, userId)
    
    return NextResponse.json({
      success: true,
      data: {
        view,
        stats
      }
    })
    
  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json({
      success: false,
      error: "Failed to track view"
    }, { status: 500 })
  }
}

// GET - Get view statistics for albums
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const albumId = searchParams.get('albumId')
    const albumIds = searchParams.get('albumIds')
    const userId = searchParams.get('userId')
    
    // Single album view stats
    if (albumId) {
      const stats = await getAlbumViewStats(albumId, userId || undefined)
      return NextResponse.json({
        success: true,
        data: stats
      })
    }
    
    // Multiple albums view stats
    if (albumIds) {
      const albumIdArray = albumIds.split(',')
      const stats = await getMultipleAlbumViewStats(albumIdArray, userId || undefined)
      return NextResponse.json({
        success: true,
        data: stats
      })
    }
    
    return NextResponse.json({
      success: false,
      error: "Album ID or Album IDs required"
    }, { status: 400 })
    
  } catch (error) {
    console.error('Error fetching view stats:', error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch view stats"
    }, { status: 500 })
  }
}
