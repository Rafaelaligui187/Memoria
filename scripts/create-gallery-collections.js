const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria'

async function createGalleryCollections() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db('Memoria')
    
    // Create gallery_albums collection
    const albumsCollection = db.collection('gallery_albums')
    
    // Create indexes for better performance
    await albumsCollection.createIndex({ yearId: 1 })
    await albumsCollection.createIndex({ category: 1 })
    await albumsCollection.createIndex({ isFeatured: 1 })
    await albumsCollection.createIndex({ isPublic: 1 })
    await albumsCollection.createIndex({ createdAt: -1 })
    
    console.log('✅ Created gallery_albums collection with indexes')
    
    // Create gallery_media collection
    const mediaCollection = db.collection('gallery_media')
    
    // Create indexes for better performance
    await mediaCollection.createIndex({ albumId: 1 })
    await mediaCollection.createIndex({ yearId: 1 })
    await mediaCollection.createIndex({ status: 1 })
    await mediaCollection.createIndex({ uploadedAt: -1 })
    await mediaCollection.createIndex({ uploadedBy: 1 })
    
    console.log('✅ Created gallery_media collection with indexes')
    
    // Check if collections exist
    const collections = await db.listCollections().toArray()
    const albumCollectionExists = collections.some(col => col.name === 'gallery_albums')
    const mediaCollectionExists = collections.some(col => col.name === 'gallery_media')
    
    console.log(`📊 Collections status:`)
    console.log(`   - gallery_albums: ${albumCollectionExists ? '✅ Exists' : '❌ Missing'}`)
    console.log(`   - gallery_media: ${mediaCollectionExists ? '✅ Exists' : '❌ Missing'}`)
    
    if (albumCollectionExists && mediaCollectionExists) {
      console.log('🎉 Gallery collections are ready!')
    } else {
      console.log('⚠️  Some collections are missing. Please check the setup.')
    }
    
  } catch (error) {
    console.error('❌ Error creating gallery collections:', error)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

// Run the script
createGalleryCollections()
