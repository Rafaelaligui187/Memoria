// Database initialization script for album likes collection
const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria'

async function initializeAlbumLikesCollection() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('Memoria')
    
    // Create the album_likes collection
    const collection = db.collection('album_likes')
    
    // Create indexes for better performance
    await collection.createIndex({ userId: 1, albumId: 1 }, { unique: true })
    await collection.createIndex({ albumId: 1 })
    await collection.createIndex({ userId: 1 })
    await collection.createIndex({ createdAt: 1 })
    
    console.log('Album likes collection initialized with indexes:')
    console.log('- Unique compound index on userId and albumId')
    console.log('- Index on albumId for quick album lookups')
    console.log('- Index on userId for quick user lookups')
    console.log('- Index on createdAt for chronological queries')
    
    // Verify the collection exists
    const collections = await db.listCollections({ name: 'album_likes' }).toArray()
    if (collections.length > 0) {
      console.log('✅ album_likes collection created successfully')
    } else {
      console.log('❌ Failed to create album_likes collection')
    }
    
  } catch (error) {
    console.error('Error initializing album likes collection:', error)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

// Run the initialization
if (require.main === module) {
  initializeAlbumLikesCollection()
}

module.exports = { initializeAlbumLikesCollection }
