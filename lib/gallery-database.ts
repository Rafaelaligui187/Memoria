import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria'

export interface AlbumData {
  _id?: string
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  date: string
  location: string
  photographer: string
  duration: string
  isFeatured: boolean
  isPublic: boolean
  coverImage?: string
  mediaCount: number
  createdAt: string
  yearId: string
}

export interface MediaItem {
  _id?: string
  id: string
  albumId: string
  filename: string
  url: string
  thumbnailUrl: string
  caption: string
  fileSize: number
  mimeType: string
  uploadedAt: string
  uploadedBy: string
  status: 'approved' | 'pending' | 'rejected'
  yearId: string
}

export async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  return client.db('Memoria')
}

export async function createAlbum(albumData: Omit<AlbumData, 'id' | 'createdAt' | 'mediaCount'>): Promise<AlbumData> {
  try {
    console.log('[Gallery DB] Starting album creation...')
    console.log('[Gallery DB] Album data:', albumData)
    
    const db = await connectToDatabase()
    console.log('[Gallery DB] Connected to database')
    
    const collection = db.collection('gallery_albums')
    console.log('[Gallery DB] Got collection: gallery_albums')
    
    const album: AlbumData = {
      ...albumData,
      id: `album_${Date.now()}`,
      createdAt: new Date().toISOString(),
      mediaCount: 0,
    }

    console.log('[Gallery DB] Album object to insert:', album)

    const result = await collection.insertOne(album)
    console.log('[Gallery DB] Insert result:', result)
    
    if (result.insertedId) {
      album._id = result.insertedId.toString()
      console.log('[Gallery DB] Album created with ID:', album._id)
    }

    return album
  } catch (error) {
    console.error('[Gallery DB] Error creating album:', error)
    throw error
  }
}

export async function getAlbums(yearId?: string): Promise<AlbumData[]> {
  const db = await connectToDatabase()
  const collection = db.collection('gallery_albums')
  
  const query = yearId ? { yearId } : {}
  const albums = await collection.find(query).sort({ createdAt: -1 }).toArray()
  
  return albums.map(album => ({
    ...album,
    _id: album._id?.toString()
  }))
}

export async function getAlbumById(id: string): Promise<AlbumData | null> {
  const db = await connectToDatabase()
  const collection = db.collection('gallery_albums')
  
  const album = await collection.findOne({ id })
  
  if (!album) return null
  
  return {
    ...album,
    _id: album._id?.toString()
  }
}

export async function updateAlbum(id: string, updates: Partial<AlbumData>): Promise<AlbumData | null> {
  const db = await connectToDatabase()
  const collection = db.collection('gallery_albums')
  
  const result = await collection.findOneAndUpdate(
    { id },
    { $set: updates },
    { returnDocument: 'after' }
  )
  
  if (!result) return null
  
  return {
    ...result,
    _id: result._id?.toString()
  }
}

export async function deleteAlbum(id: string): Promise<boolean> {
  const db = await connectToDatabase()
  const albumsCollection = db.collection('gallery_albums')
  const mediaCollection = db.collection('gallery_media')
  
  // Delete all media associated with this album
  await mediaCollection.deleteMany({ albumId: id })
  
  // Delete the album
  const result = await albumsCollection.deleteOne({ id })
  
  return result.deletedCount > 0
}

// Media management functions
export async function addMediaToAlbum(albumId: string, mediaItems: MediaItem[]): Promise<void> {
  const db = await connectToDatabase()
  const mediaCollection = db.collection('gallery_media')
  const albumsCollection = db.collection('gallery_albums')
  
  // Insert media items
  if (mediaItems.length > 0) {
    await mediaCollection.insertMany(mediaItems)
  }

  // Update album media count
  await albumsCollection.updateOne(
    { id: albumId },
    { $inc: { mediaCount: mediaItems.length } }
  )
}

export async function getMediaItems(yearId?: string): Promise<MediaItem[]> {
  const db = await connectToDatabase()
  const collection = db.collection('gallery_media')
  
  const query = yearId ? { yearId } : {}
  const mediaItems = await collection.find(query).sort({ uploadedAt: -1 }).toArray()
  
  return mediaItems.map(item => ({
    ...item,
    _id: item._id?.toString()
  }))
}

export async function getMediaByAlbumId(albumId: string): Promise<MediaItem[]> {
  const db = await connectToDatabase()
  const collection = db.collection('gallery_media')
  
  const mediaItems = await collection.find({ albumId }).sort({ uploadedAt: -1 }).toArray()
  
  return mediaItems.map(item => ({
    ...item,
    _id: item._id?.toString()
  }))
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  const db = await connectToDatabase()
  const collection = db.collection('gallery_media')
  
  const result = await collection.deleteOne({ id })
  return result.deletedCount > 0
}

export async function updateMediaStatus(id: string, status: 'approved' | 'pending' | 'rejected'): Promise<boolean> {
  const db = await connectToDatabase()
  const collection = db.collection('gallery_media')
  
  const result = await collection.updateOne(
    { id },
    { $set: { status } }
  )
  
  return result.modifiedCount > 0
}
