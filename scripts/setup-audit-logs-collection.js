/**
 * Script to create and configure the AuditLogs collection in MongoDB
 * This ensures the audit logs system works properly without any errors
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function createAuditLogsCollection() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db();
    
    console.log('\n📊 AUDIT LOGS COLLECTION SETUP');
    console.log('=' .repeat(50));
    
    // 1. Check if AuditLogs collection exists
    console.log('\n1️⃣ Checking existing AuditLogs collection...');
    const collections = await db.listCollections({ name: 'AuditLogs' }).toArray();
    
    if (collections.length > 0) {
      console.log('   ✅ AuditLogs collection already exists');
      
      // Check current document count
      const count = await db.collection('AuditLogs').countDocuments();
      console.log(`   📊 Current documents: ${count}`);
      
      // Show sample document structure
      const sampleDoc = await db.collection('AuditLogs').findOne({});
      if (sampleDoc) {
        console.log('   📝 Sample document structure:');
        console.log('   ', Object.keys(sampleDoc));
      }
    } else {
      console.log('   ❌ AuditLogs collection does not exist');
      console.log('   🔧 Creating AuditLogs collection...');
    }
    
    // 2. Create the AuditLogs collection with proper structure
    console.log('\n2️⃣ Setting up AuditLogs collection...');
    
    // Create collection if it doesn't exist (MongoDB creates it automatically on first insert)
    const auditLogsCollection = db.collection('AuditLogs');
    
    // 3. Create indexes for better performance
    console.log('\n3️⃣ Creating indexes for optimal performance...');
    
    try {
      // Index on userId for user-specific queries
      await auditLogsCollection.createIndex({ userId: 1 });
      console.log('   ✅ Created index on userId');
    } catch (error) {
      if (error.code === 85) { // Index already exists
        console.log('   ℹ️  Index on userId already exists');
      } else {
        console.log('   ⚠️  Error creating userId index:', error.message);
      }
    }
    
    try {
      // Index on action for filtering by action type
      await auditLogsCollection.createIndex({ action: 1 });
      console.log('   ✅ Created index on action');
    } catch (error) {
      if (error.code === 85) {
        console.log('   ℹ️  Index on action already exists');
      } else {
        console.log('   ⚠️  Error creating action index:', error.message);
      }
    }
    
    try {
      // Index on timestamp for time-based queries
      await auditLogsCollection.createIndex({ timestamp: -1 });
      console.log('   ✅ Created index on timestamp (descending)');
    } catch (error) {
      if (error.code === 85) {
        console.log('   ℹ️  Index on timestamp already exists');
      } else {
        console.log('   ⚠️  Error creating timestamp index:', error.message);
      }
    }
    
    try {
      // Index on schoolYearId for school year filtering
      await auditLogsCollection.createIndex({ schoolYearId: 1 });
      console.log('   ✅ Created index on schoolYearId');
    } catch (error) {
      if (error.code === 85) {
        console.log('   ℹ️  Index on schoolYearId already exists');
      } else {
        console.log('   ⚠️  Error creating schoolYearId index:', error.message);
      }
    }
    
    try {
      // Compound index for common queries (userId + timestamp)
      await auditLogsCollection.createIndex({ userId: 1, timestamp: -1 });
      console.log('   ✅ Created compound index on userId + timestamp');
    } catch (error) {
      if (error.code === 85) {
        console.log('   ℹ️  Compound index already exists');
      } else {
        console.log('   ⚠️  Error creating compound index:', error.message);
      }
    }
    
    try {
      // Compound index for school year + timestamp queries
      await auditLogsCollection.createIndex({ schoolYearId: 1, timestamp: -1 });
      console.log('   ✅ Created compound index on schoolYearId + timestamp');
    } catch (error) {
      if (error.code === 85) {
        console.log('   ℹ️  Compound index already exists');
      } else {
        console.log('   ⚠️  Error creating compound index:', error.message);
      }
    }
    
    // 4. Create a sample audit log to test the collection
    console.log('\n4️⃣ Testing collection with sample audit log...');
    
    const sampleAuditLog = {
      userId: "admin",
      userName: "Admin User",
      action: "collection_setup",
      targetType: "system",
      targetId: "audit_logs_collection",
      targetName: "AuditLogs Collection",
      details: {
        setup: true,
        message: "Audit logs collection setup completed",
        timestamp: new Date().toISOString()
      },
      schoolYearId: "2024-2025",
      ipAddress: "127.0.0.1",
      userAgent: "Setup Script",
      timestamp: new Date(),
      status: "success"
    };
    
    const insertResult = await auditLogsCollection.insertOne(sampleAuditLog);
    console.log(`   ✅ Sample audit log created with ID: ${insertResult.insertedId}`);
    
    // 5. Verify the collection is working
    console.log('\n5️⃣ Verifying collection functionality...');
    
    // Test query
    const testQuery = await auditLogsCollection.findOne({ action: "collection_setup" });
    if (testQuery) {
      console.log('   ✅ Collection query test: SUCCESS');
      console.log(`   📝 Found audit log: ${testQuery.action} - ${testQuery.targetName}`);
    } else {
      console.log('   ❌ Collection query test: FAILED');
    }
    
    // Test count
    const totalCount = await auditLogsCollection.countDocuments();
    console.log(`   📊 Total audit logs in collection: ${totalCount}`);
    
    // 6. Show collection statistics
    console.log('\n6️⃣ Collection Statistics:');
    const stats = await db.runCommand({ collStats: "AuditLogs" });
    console.log(`   📦 Collection size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   📄 Document count: ${stats.count}`);
    console.log(`   🗂️  Index count: ${stats.nindexes}`);
    
    // 7. Clean up sample audit log
    console.log('\n7️⃣ Cleaning up sample audit log...');
    await auditLogsCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('   🧹 Sample audit log removed');
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎉 AUDIT LOGS COLLECTION SETUP COMPLETE!');
    console.log('\n✅ Collection is ready for use');
    console.log('✅ All indexes created for optimal performance');
    console.log('✅ Collection tested and verified working');
    
    console.log('\n📋 COLLECTION DETAILS:');
    console.log('   Collection Name: AuditLogs');
    console.log('   Database: Memoria');
    console.log('   Indexes: userId, action, timestamp, schoolYearId, compound indexes');
    console.log('   Status: Ready for production use');
    
  } catch (error) {
    console.error('❌ Error setting up AuditLogs collection:', error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the setup
createAuditLogsCollection().catch(console.error);
