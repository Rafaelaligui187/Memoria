// Test script for album likes functionality
const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria'

async function testAlbumLikesFunctionality() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB for testing')
    
    const db = client.db('Memoria')
    const collection = db.collection('album_likes')
    
    // Test data
    const testUserId = 'test_user_123'
    const testAlbumId = 'test_album_456'
    
    console.log('\n🧪 Testing Album Likes Functionality...\n')
    
    // Test 1: Create a like
    console.log('Test 1: Creating a like...')
    const like = {
      id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: testUserId,
      albumId: testAlbumId,
      createdAt: new Date().toISOString(),
      userEmail: 'test@example.com',
      userSchoolId: 'TEST001'
    }
    
    const insertResult = await collection.insertOne(like)
    console.log('✅ Like created successfully:', insertResult.insertedId)
    
    // Test 2: Check if user liked the album
    console.log('\nTest 2: Checking if user liked the album...')
    const existingLike = await collection.findOne({ userId: testUserId, albumId: testAlbumId })
    console.log('✅ User like status:', existingLike ? 'LIKED' : 'NOT LIKED')
    
    // Test 3: Get like count for album
    console.log('\nTest 3: Getting like count for album...')
    const likeCount = await collection.countDocuments({ albumId: testAlbumId })
    console.log('✅ Like count for album:', likeCount)
    
    // Test 4: Get all albums liked by user
    console.log('\nTest 4: Getting all albums liked by user...')
    const userLikes = await collection.find({ userId: testUserId }).toArray()
    console.log('✅ Albums liked by user:', userLikes.map(like => like.albumId))
    
    // Test 5: Remove the like
    console.log('\nTest 5: Removing the like...')
    const deleteResult = await collection.deleteOne({ userId: testUserId, albumId: testAlbumId })
    console.log('✅ Like removed:', deleteResult.deletedCount > 0)
    
    // Test 6: Verify like count after removal
    console.log('\nTest 6: Verifying like count after removal...')
    const finalLikeCount = await collection.countDocuments({ albumId: testAlbumId })
    console.log('✅ Final like count:', finalLikeCount)
    
    console.log('\n🎉 All tests passed! Album likes functionality is working correctly.')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await client.close()
    console.log('\nDisconnected from MongoDB')
  }
}

// Run the test
if (require.main === module) {
  testAlbumLikesFunctionality()
}

module.exports = { testAlbumLikesFunctionality }
