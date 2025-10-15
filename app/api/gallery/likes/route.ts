import { NextRequest, NextResponse } from "next/server"
import { 
  createAlbumLike, 
  removeAlbumLike, 
  isAlbumLikedByUser, 
  getUserLikedAlbums, 
  getAlbumLikeStats, 
  getMultipleAlbumLikeStats,
  deleteAlbumLikes 
} from "@/lib/gallery-likes-service"

// GET - Get like status for albums
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const albumId = searchParams.get('albumId')
    const albumIds = searchParams.get('albumIds')
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID is required"
      }, { status: 400 })
    }
    
    // Single album like status
    if (albumId) {
      const stats = await getAlbumLikeStats(albumId, userId)
      return NextResponse.json({
        success: true,
        data: stats
      })
    }
    
    // Multiple albums like status
    if (albumIds) {
      const albumIdArray = albumIds.split(',')
      const stats = await getMultipleAlbumLikeStats(albumIdArray, userId)
      return NextResponse.json({
        success: true,
        data: stats
      })
    }
    
    // Get all liked albums by user
    const likedAlbums = await getUserLikedAlbums(userId)
    return NextResponse.json({
      success: true,
      data: likedAlbums
    })
    
  } catch (error) {
    console.error('Error fetching like data:', error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch like data"
    }, { status: 500 })
  }
}

// POST - Like an album
export async function POST(request: NextRequest) {
  try {
    const { albumId, userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID is required"
      }, { status: 400 })
    }
    
    if (!albumId) {
      return NextResponse.json({
        success: false,
        error: "Album ID is required"
      }, { status: 400 })
    }
    
    // Check if already liked
    const alreadyLiked = await isAlbumLikedByUser(userId, albumId)
    if (alreadyLiked) {
      return NextResponse.json({
        success: false,
        error: "Album already liked"
      }, { status: 400 })
    }
    
    // Create the like
    const like = await createAlbumLike(userId, albumId)
    
    // Create notification for album like
    try {
      const { connectToDatabase } = await import('@/lib/mongodb/connection')
      const db = await connectToDatabase()
      const notificationsCollection = db.collection('notifications')
      
      // Get user info for notification
      const usersCollection = db.collection('users')
      const user = await usersCollection.findOne({ _id: new (await import('mongodb')).ObjectId(userId) })
      const userName = user?.name || user?.email || 'Anonymous User'
      
      // Get album info for notification
      const albumsCollection = db.collection('albums')
      const album = await albumsCollection.findOne({ _id: new (await import('mongodb')).ObjectId(albumId) })
      const albumName = album?.title || album?.name || album?.id || 'Unknown Album'
      
      const notificationData = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "info",
        title: "Album Liked",
        message: `${userName} liked the album "${albumName}"`,
        priority: "low",
        category: "album",
        actionUrl: `/gallery/${albumId}`,
        actionLabel: "View Album",
        metadata: { 
          albumId: albumId, 
          userName: userName, 
          albumName: albumName,
          likeId: like.id
        },
        timestamp: new Date(),
        read: false,
      }
      
      await notificationsCollection.insertOne(notificationData)
      
    } catch (notificationError) {
      console.error('Error creating album like notification:', notificationError)
      // Don't fail the like creation if notification fails
    }
    
    // Get updated stats
    const stats = await getAlbumLikeStats(albumId, userId)
    
    return NextResponse.json({
      success: true,
      data: {
        like,
        stats
      }
    })
    
  } catch (error) {
    console.error('Error creating like:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to like album"
    }, { status: 500 })
  }
}

// DELETE - Unlike an album
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const albumId = searchParams.get('albumId')
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID is required"
      }, { status: 400 })
    }
    
    if (!albumId) {
      return NextResponse.json({
        success: false,
        error: "Album ID is required"
      }, { status: 400 })
    }
    
    // Remove the like
    const removed = await removeAlbumLike(userId, albumId)
    
    if (!removed) {
      return NextResponse.json({
        success: false,
        error: "Like not found"
      }, { status: 404 })
    }
    
    // Get updated stats
    const stats = await getAlbumLikeStats(albumId, userId)
    
    return NextResponse.json({
      success: true,
      data: {
        removed,
        stats
      }
    })
    
  } catch (error) {
    console.error('Error removing like:', error)
    return NextResponse.json({
      success: false,
      error: "Failed to unlike album"
    }, { status: 500 })
  }
}
