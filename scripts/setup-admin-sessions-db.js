// Database setup script for admin sessions collection
// This script creates the admin_sessions collection with proper indexes

const { MongoClient } = require('mongodb');

async function setupAdminSessionsCollection() {
  let client;
  
  try {
    console.log('🔧 Setting up admin_sessions collection...');
    
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/memoria';
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('memoria');
    const sessionsCollection = db.collection('admin_sessions');
    
    // Create indexes for better performance
    const indexes = [
      { adminEmail: 1 },
      { isActive: 1 },
      { loginTime: -1 },
      { adminEmail: 1, isActive: 1 },
      { sessionId: 1 }
    ];
    
    console.log('📊 Creating indexes...');
    for (const index of indexes) {
      try {
        await sessionsCollection.createIndex(index);
        console.log(`✅ Created index:`, index);
      } catch (error) {
        if (error.code === 85) {
          console.log(`✅ Index already exists:`, index);
        } else {
          console.error(`❌ Failed to create index:`, index, error.message);
        }
      }
    }
    
    console.log('🎉 Admin sessions collection setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run setup
setupAdminSessionsCollection()
  .then(() => {
    console.log('✅ Admin sessions collection setup finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
