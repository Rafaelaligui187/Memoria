// Gallery Likes Service - Handles user likes on albums
import { connectToDatabase } from './gallery-database'

export interface AlbumLike {
  _id?: string
  id: string
  userId: string
  albumId: string
  createdAt: string
  userEmail?: string
  userSchoolId?: string
}

export interface LikeStats {
  albumId: string
  totalLikes: number
  isLikedByUser: boolean
}

// Create a new like
export async function createAlbumLike(userId: string, albumId: string, userEmail?: string, userSchoolId?: string): Promise<AlbumLike> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_likes')
    
    // Check if user already liked this album
    const existingLike = await collection.findOne({ userId, albumId })
    if (existingLike) {
      throw new Error('User has already liked this album')
    }
    
    const like: AlbumLike = {
      id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      albumId,
      createdAt: new Date().toISOString(),
      userEmail,
      userSchoolId
    }
    
    const result = await collection.insertOne(like)
    if (result.insertedId) {
      like._id = result.insertedId.toString()
    }
    
    return like
  } catch (error) {
    console.error('Error creating album like:', error)
    throw error
  }
}

// Remove a like
export async function removeAlbumLike(userId: string, albumId: string): Promise<boolean> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_likes')
    
    const result = await collection.deleteOne({ userId, albumId })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error removing album like:', error)
    throw error
  }
}

// Check if user liked an album
export async function isAlbumLikedByUser(userId: string, albumId: string): Promise<boolean> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_likes')
    
    const like = await collection.findOne({ userId, albumId })
    return !!like
  } catch (error) {
    console.error('Error checking album like:', error)
    return false
  }
}

// Get all albums liked by a user
export async function getUserLikedAlbums(userId: string): Promise<string[]> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_likes')
    
    const likes = await collection.find({ userId }).toArray()
    return likes.map(like => like.albumId)
  } catch (error) {
    console.error('Error getting user liked albums:', error)
    return []
  }
}

// Get like statistics for an album
export async function getAlbumLikeStats(albumId: string, userId?: string): Promise<LikeStats> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_likes')
    
    const totalLikes = await collection.countDocuments({ albumId })
    let isLikedByUser = false
    
    if (userId) {
      const userLike = await collection.findOne({ userId, albumId })
      isLikedByUser = !!userLike
    }
    
    return {
      albumId,
      totalLikes,
      isLikedByUser
    }
  } catch (error) {
    console.error('Error getting album like stats:', error)
    return {
      albumId,
      totalLikes: 0,
      isLikedByUser: false
    }
  }
}

// Get like statistics for multiple albums
export async function getMultipleAlbumLikeStats(albumIds: string[], userId?: string): Promise<LikeStats[]> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_likes')
    
    const stats: LikeStats[] = []
    
    for (const albumId of albumIds) {
      const totalLikes = await collection.countDocuments({ albumId })
      let isLikedByUser = false
      
      if (userId) {
        const userLike = await collection.findOne({ userId, albumId })
        isLikedByUser = !!userLike
      }
      
      stats.push({
        albumId,
        totalLikes,
        isLikedByUser
      })
    }
    
    return stats
  } catch (error) {
    console.error('Error getting multiple album like stats:', error)
    return albumIds.map(albumId => ({
      albumId,
      totalLikes: 0,
      isLikedByUser: false
    }))
  }
}

// Delete all likes for an album (when album is deleted)
export async function deleteAlbumLikes(albumId: string): Promise<boolean> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_likes')
    
    const result = await collection.deleteMany({ albumId })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting album likes:', error)
    return false
  }
}

// Delete all likes by a user (when user account is deleted)
export async function deleteUserLikes(userId: string): Promise<boolean> {
  try {
    const db = await connectToDatabase()
    const collection = db.collection('album_likes')
    
    const result = await collection.deleteMany({ userId })
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting user likes:', error)
    return false
  }
}
