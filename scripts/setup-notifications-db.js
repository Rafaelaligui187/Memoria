// Database setup script for notifications collection
// This script creates the notifications collection with proper indexes

const { MongoClient } = require('mongodb');

async function setupNotificationsCollection() {
  let client;
  
  try {
    console.log('🔧 Setting up notifications collection...');
    
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/memoria';
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('memoria');
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
    
    // Create sample notification
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
    
    // Check if sample exists
    const existingSample = await notificationsCollection.findOne({ 
      metadata: { isWelcome: true } 
    });
    
    if (!existingSample) {
      await notificationsCollection.insertOne(sampleNotification);
      console.log('✅ Created sample welcome notification');
    } else {
      console.log('✅ Sample notification already exists');
    }
    
    console.log('✅ Notifications collection setup completed!');
    
    // Show stats
    const count = await notificationsCollection.countDocuments();
    const unreadCount = await notificationsCollection.countDocuments({ read: false });
    const urgentCount = await notificationsCollection.countDocuments({ 
      read: false, 
      priority: 'urgent' 
    });
    
    console.log(`📊 Collection Stats:`);
    console.log(`   Total notifications: ${count}`);
    console.log(`   Unread notifications: ${unreadCount}`);
    console.log(`   Urgent notifications: ${urgentCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run setup
setupNotificationsCollection()
  .then(() => {
    console.log('Setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
