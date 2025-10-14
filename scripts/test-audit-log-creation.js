/**
 * Test script to verify audit log creation is working
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function testAuditLogCreation() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db();
    const auditLogsCollection = db.collection('AuditLogs');
    
    console.log('\n📊 Current audit logs in database:');
    const allLogs = await auditLogsCollection.find({}).toArray();
    console.log(`Total audit logs: ${allLogs.length}`);
    
    // Test creating a new audit log
    console.log('\n🧪 Testing audit log creation...');
    
    const testAuditLog = {
      userId: "admin",
      userName: "Admin User",
      action: "profile_approved",
      targetType: "student_profile",
      targetId: new ObjectId().toString(),
      targetName: "Test Profile",
      details: {
        test: true,
        message: "Testing audit log creation"
      },
      schoolYearId: "2024-2025",
      ipAddress: "127.0.0.1",
      userAgent: "Test Browser",
      timestamp: new Date(),
      status: "success"
    };
    
    const result = await auditLogsCollection.insertOne(testAuditLog);
    console.log(`✅ Created test audit log with ID: ${result.insertedId}`);
    
    // Check if it was created
    const newLogs = await auditLogsCollection.find({}).toArray();
    console.log(`📊 Total audit logs after creation: ${newLogs.length}`);
    
    // Show the new log
    const newLog = await auditLogsCollection.findOne({ _id: result.insertedId });
    console.log('📝 New audit log:', {
      id: newLog._id,
      action: newLog.action,
      targetName: newLog.targetName,
      timestamp: newLog.timestamp
    });
    
    console.log('\n🎉 Audit log creation test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test
testAuditLogCreation().catch(console.error);
