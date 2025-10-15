// Album Views Service - Handles album view tracking
import { connectToDatabase } from './gallery-database'

export interface AlbumView {
  _id?: string
  id: string
  userId?: string
  albumId: string
  viewedAt: string
  userAgent?: string
  ipAddress?: string
}

export interface ViewStats {
  albumId: string
  totalViews: number
  uniqueViews: number
  hasViewedByUser: boolean
}

// Track a view for an album
export async function trackAlbumView(albumId: string, userId?: string, userAgent?: string, ipAddress?: string): Promise<AlbumView> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_views')
    
    // Check if user already viewed this album (if userId provided)
    if (userId) {
      const existingView = await collection.findOne({ albumId, userId })
      if (existingView) {
        // Update the view timestamp
        await collection.updateOne(
          { albumId, userId },
          { $set: { viewedAt: new Date().toISOString() } }
        )
        return existingView
      }
    }
    
    const view: AlbumView = {
      id: `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      albumId,
      viewedAt: new Date().toISOString(),
      userAgent,
      ipAddress
    }
    
    const result = await collection.insertOne(view)
    if (result.insertedId) {
      view._id = result.insertedId.toString()
    }
    
    return view
  } catch (error) {
    console.error('Error tracking album view:', error)
    throw error
  }
}

// Get view statistics for an album
export async function getAlbumViewStats(albumId: string, userId?: string): Promise<ViewStats> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_views')
    
    // Get total views (including duplicates)
    const totalViews = await collection.countDocuments({ albumId })
    
    // Get unique views (distinct users)
    const uniqueViews = await collection.distinct('userId', { albumId, userId: { $exists: true } }).then(users => users.length)
    
    // Check if current user has viewed
    let hasViewedByUser = false
    if (userId) {
      const userView = await collection.findOne({ albumId, userId })
      hasViewedByUser = !!userView
    }
    
    return {
      albumId,
      totalViews,
      uniqueViews,
      hasViewedByUser
    }
  } catch (error) {
    console.error('Error getting album view stats:', error)
    return {
      albumId,
      totalViews: 0,
      uniqueViews: 0,
      hasViewedByUser: false
    }
  }
}

// Get view statistics for multiple albums
export async function getMultipleAlbumViewStats(albumIds: string[], userId?: string): Promise<ViewStats[]> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_views')
    
    const stats: ViewStats[] = []
    
    for (const albumId of albumIds) {
      const totalViews = await collection.countDocuments({ albumId })
      const uniqueViews = await collection.distinct('userId', { albumId, userId: { $exists: true } }).then(users => users.length)
      
      let hasViewedByUser = false
      if (userId) {
        const userView = await collection.findOne({ albumId, userId })
        hasViewedByUser = !!userView
      }
      
      stats.push({
        albumId,
        totalViews,
        uniqueViews,
        hasViewedByUser
      })
    }
    
    return stats
  } catch (error) {
    console.error('Error getting multiple album view stats:', error)
    return albumIds.map(albumId => ({
      albumId,
      totalViews: 0,
      uniqueViews: 0,
      hasViewedByUser: false
    }))
  }
}

// Delete all views for an album (when album is deleted)
export async function deleteAlbumViews(albumId: string): Promise<boolean> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_views')
    
    const result = await collection.deleteMany({ albumId })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting album views:', error)
    return false
  }
}

// Delete all views by a user (when user account is deleted)
export async function deleteUserViews(userId: string): Promise<boolean> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_views')
    
    const result = await collection.deleteMany({ userId })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting user views:', error)
    return false
  }
}
