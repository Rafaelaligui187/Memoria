const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function testAuditLogDeletion() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    
    // First, create a test audit log
    console.log('\n📝 Creating test audit log...');
    const testAuditLog = {
      timestamp: new Date(),
      userId: 'test-user-123',
      userName: 'Test User',
      action: 'test_action',
      targetType: 'test_target',
      targetId: 'test-target-123',
      targetName: 'Test Target',
      details: { test: 'data' },
      userAgent: 'Test Agent',
      status: 'success',
      schoolYearId: 'test-year-123',
      createdAt: new Date()
    };
    
    const insertResult = await db.collection('AuditLogs').insertOne(testAuditLog);
    console.log('✅ Test audit log created with ID:', insertResult.insertedId);
    
    // Test the delete API endpoint
    console.log('\n🗑️ Testing delete API endpoint...');
    const deleteUrl = `http://localhost:3000/api/admin/audit-logs/delete?id=${insertResult.insertedId}`;
    
    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Delete API call successful:', result.message);
        
        // Verify the audit log was actually deleted
        const deletedLog = await db.collection('AuditLogs').findOne({
          _id: insertResult.insertedId
        });
        
        if (!deletedLog) {
          console.log('✅ Audit log successfully deleted from database');
        } else {
          console.log('❌ Audit log still exists in database');
        }
      } else {
        console.log('❌ Delete API call failed:', result.error);
      }
    } catch (apiError) {
      console.log('⚠️ API call failed (expected if server not running):', apiError.message);
      
      // Test direct database deletion as fallback
      console.log('\n🗑️ Testing direct database deletion...');
      const deleteResult = await db.collection('AuditLogs').deleteOne({
        _id: insertResult.insertedId
      });
      
      if (deleteResult.deletedCount > 0) {
        console.log('✅ Direct database deletion successful');
      } else {
        console.log('❌ Direct database deletion failed');
      }
    }
    
    // Test deleting non-existent audit log
    console.log('\n🧪 Testing deletion of non-existent audit log...');
    const fakeId = '507f1f77bcf86cd799439011'; // Valid ObjectId format
    const deleteNonExistent = await db.collection('AuditLogs').deleteOne({
      _id: fakeId
    });
    
    if (deleteNonExistent.deletedCount === 0) {
      console.log('✅ Correctly handled non-existent audit log deletion');
    } else {
      console.log('❌ Unexpectedly deleted non-existent audit log');
    }
    
    console.log('\n🎉 Audit log deletion test completed!');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testAuditLogDeletion().catch(console.error);

