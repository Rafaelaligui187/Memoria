// Database initialization script for notifications collection
// This script creates the notifications collection with proper indexes

const { MongoClient } = require('mongodb');

async function initializeNotificationsCollection() {
  let client;
  
  try {
    console.log('🔧 Initializing notifications collection...');
    
    // Use the same connection string as your app
    const uri = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority';
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('Memoria');
    const notificationsCollection = db.collection('notifications');
    
    // Create indexes for better performance
    const indexes = [
      { read: 1 },
      { priority: 1 },
      { category: 1 },
      { timestamp: -1 },
      { read: 1, priority: 1 },
      { userId: 1, read: 1 },
      { schoolYearId: 1, timestamp: -1 },
      { id: 1 }
    ];
    
    console.log('📊 Creating indexes...');
    for (const index of indexes) {
      try {
        await notificationsCollection.createIndex(index);
        console.log(`✅ Created index:`, index);
      } catch (error) {
        if (error.code === 85) {
          console.log(`✅ Index already exists:`, index);
        } else {
          console.error(`❌ Failed to create index:`, index, error.message);
        }
      }
    }
    
    // Check if collection has any data
    const count = await notificationsCollection.countDocuments();
    console.log(`📊 Current notification count: ${count}`);
    
    if (count === 0) {
      console.log('📝 Adding sample notification...');
      const sampleNotification = {
        id: `notif_${Date.now()}_sample`,
        type: 'info',
        title: 'Welcome to Memoria Admin',
        message: 'Your notification system is now active! You will receive notifications for profile submissions, album likes, and user reports.',
        timestamp: new Date(),
        read: false,
        priority: 'medium',
        category: 'system',
        actionUrl: '/admin',
        actionLabel: 'Go to Admin Dashboard',
        metadata: { isWelcome: true }
      };
      
      await notificationsCollection.insertOne(sampleNotification);
      console.log('✅ Sample notification added');
    } else {
      console.log('✅ Collection already has data');
    }
    
    console.log('🎉 Notifications collection initialization completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run initialization
initializeNotificationsCollection()
  .then(() => {
    console.log('✅ Initialization completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  });
