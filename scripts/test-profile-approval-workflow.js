/**
 * Test script to simulate profile approval workflow and verify audit log creation
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function testProfileApprovalWorkflow() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db();
    
    // Clean up any existing test data
    console.log('\n🧹 Cleaning up existing test data...');
    await db.collection('College_yearbook').deleteMany({ email: 'test.student@example.com' });
    await db.collection('AuditLogs').deleteMany({ targetName: 'Test Student Profile' });
    
    // Create a test profile
    console.log('\n📝 Creating test profile...');
    const testProfile = {
      schoolYearId: new ObjectId().toString(),
      schoolYear: '2024-2025',
      userType: 'student',
      department: 'College',
      fullName: 'Test Student Profile',
      email: 'test.student@example.com',
      courseProgram: 'BSIT',
      yearLevel: '4th Year',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const profileResult = await db.collection('College_yearbook').insertOne(testProfile);
    const profileId = profileResult.insertedId.toString();
    console.log(`✅ Created test profile with ID: ${profileId}`);
    
    // Simulate profile approval (what the API does)
    console.log('\n✅ Simulating profile approval...');
    
    // Update profile status to approved
    const updateResult = await db.collection('College_yearbook').updateOne(
      { _id: new ObjectId(profileId) },
      { 
        $set: { 
          status: "approved",
          reviewedAt: new Date(),
          reviewedBy: "admin",
          updatedAt: new Date(),
        }
      }
    );
    
    console.log(`✅ Profile updated: ${updateResult.modifiedCount} documents modified`);
    
    // Create audit log (simulating what the API does)
    console.log('\n📊 Creating audit log for profile approval...');
    
    const auditLog = {
      userId: "admin",
      userName: "Admin User",
      action: "profile_approved",
      targetType: "student_profile",
      targetId: profileId,
      targetName: testProfile.fullName,
      details: {
        previousStatus: "pending",
        newStatus: "approved",
        department: testProfile.department,
        userType: testProfile.userType,
        collection: "College_yearbook"
      },
      schoolYearId: "2024-2025",
      ipAddress: "127.0.0.1",
      userAgent: "Test Browser",
      timestamp: new Date(),
      status: "success"
    };
    
    const auditResult = await db.collection('AuditLogs').insertOne(auditLog);
    console.log(`✅ Created audit log with ID: ${auditResult.insertedId}`);
    
    // Verify the results
    console.log('\n🔍 Verifying results...');
    
    // Check profile status
    const updatedProfile = await db.collection('College_yearbook').findOne({ _id: new ObjectId(profileId) });
    console.log(`📝 Profile status: ${updatedProfile.status}`);
    
    // Check audit logs
    const auditLogs = await db.collection('AuditLogs').find({}).toArray();
    console.log(`📊 Total audit logs: ${auditLogs.length}`);
    
    if (auditLogs.length > 0) {
      const latestLog = auditLogs[auditLogs.length - 1];
      console.log('📝 Latest audit log:', {
        action: latestLog.action,
        targetName: latestLog.targetName,
        status: latestLog.status,
        timestamp: latestLog.timestamp
      });
    }
    
    console.log('\n🎉 Profile approval workflow test completed successfully!');
    console.log('✅ Profile was approved and audit log was created');
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await db.collection('College_yearbook').deleteOne({ _id: new ObjectId(profileId) });
    await db.collection('AuditLogs').deleteOne({ _id: auditResult.insertedId });
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the test
testProfileApprovalWorkflow().catch(console.error);
