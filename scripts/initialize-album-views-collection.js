// Database initialization script for album views collection
const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria'

async function initializeAlbumViewsCollection() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('Memoria')
    
    // Create the album_views collection
    const collection = db.collection('album_views')
    
    // Create indexes for better performance
    await collection.createIndex({ albumId: 1 })
    await collection.createIndex({ userId: 1 })
    await collection.createIndex({ viewedAt: 1 })
    await collection.createIndex({ albumId: 1, userId: 1 }, { unique: true })
    
    console.log('Album views collection initialized with indexes:')
    console.log('- Index on albumId for quick album lookups')
    console.log('- Index on userId for quick user lookups')
    console.log('- Index on viewedAt for chronological queries')
    console.log('- Unique compound index on albumId and userId to prevent duplicate views')
    
    // Verify the collection exists
    const collections = await db.listCollections({ name: 'album_views' }).toArray()
    if (collections.length > 0) {
      console.log('✅ album_views collection created successfully')
    } else {
      console.log('❌ Failed to create album_views collection')
    }
    
  } catch (error) {
    console.error('Error initializing album views collection:', error)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

// Run the initialization
if (require.main === module) {
  initializeAlbumViewsCollection()
}

module.exports = { initializeAlbumViewsCollection }
