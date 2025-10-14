/**
 * Diagnostic script to help troubleshoot audit log creation issues
 * This script will help identify why audit logs aren't being created during profile approval
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function diagnoseAuditLogIssues() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db();
    
    console.log('\n📊 DIAGNOSTIC REPORT - Audit Log System');
    console.log('=' .repeat(50));
    
    // 1. Check current audit logs
    console.log('\n1️⃣ Current Audit Logs:');
    const auditLogs = await db.collection('AuditLogs').find({}).toArray();
    console.log(`   Total audit logs: ${auditLogs.length}`);
    
    if (auditLogs.length > 0) {
      console.log('   Recent audit logs:');
      auditLogs.slice(-3).forEach((log, index) => {
        console.log(`   ${index + 1}. ${log.action} - ${log.targetName} (${log.timestamp})`);
      });
    }
    
    // 2. Check pending profiles
    console.log('\n2️⃣ Pending Profiles:');
    const collections = [
      'College_yearbook',
      'SeniorHigh_yearbook', 
      'JuniorHigh_yearbook',
      'Elementary_yearbook',
      'Alumni_yearbook',
      'FacultyStaff_yearbook'
    ];
    
    let totalPending = 0;
    for (const collectionName of collections) {
      const pendingCount = await db.collection(collectionName).countDocuments({ status: 'pending' });
      if (pendingCount > 0) {
        console.log(`   ${collectionName}: ${pendingCount} pending profiles`);
        totalPending += pendingCount;
      }
    }
    
    if (totalPending === 0) {
      console.log('   ❌ No pending profiles found');
      console.log('   💡 Create a test profile first to test approval workflow');
    } else {
      console.log(`   ✅ Total pending profiles: ${totalPending}`);
    }
    
    // 3. Check approved profiles
    console.log('\n3️⃣ Approved Profiles:');
    let totalApproved = 0;
    for (const collectionName of collections) {
      const approvedCount = await db.collection(collectionName).countDocuments({ status: 'approved' });
      if (approvedCount > 0) {
        console.log(`   ${collectionName}: ${approvedCount} approved profiles`);
        totalApproved += approvedCount;
      }
    }
    console.log(`   Total approved profiles: ${totalApproved}`);
    
    // 4. Check school years
    console.log('\n4️⃣ School Years:');
    const schoolYears = await db.collection('SchoolYears').find({}).toArray();
    console.log(`   Total school years: ${schoolYears.length}`);
    schoolYears.forEach(year => {
      console.log(`   - ${year.yearLabel} (${year.isActive ? 'Active' : 'Inactive'})`);
    });
    
    // 5. Test audit log creation directly
    console.log('\n5️⃣ Testing Direct Audit Log Creation:');
    try {
      const testLog = {
        userId: "admin",
        userName: "Admin User",
        action: "test_diagnostic",
        targetType: "test",
        targetId: new ObjectId().toString(),
        targetName: "Diagnostic Test",
        details: { test: true },
        schoolYearId: "2024-2025",
        timestamp: new Date(),
        status: "success"
      };
      
      const result = await db.collection('AuditLogs').insertOne(testLog);
      console.log(`   ✅ Direct audit log creation: SUCCESS (ID: ${result.insertedId})`);
      
      // Clean up test log
      await db.collection('AuditLogs').deleteOne({ _id: result.insertedId });
      console.log('   🧹 Test log cleaned up');
      
    } catch (error) {
      console.log(`   ❌ Direct audit log creation: FAILED - ${error.message}`);
    }
    
    // 6. Recommendations
    console.log('\n6️⃣ RECOMMENDATIONS:');
    
    if (totalPending === 0) {
      console.log('   🔧 Create a test profile to test the approval workflow');
      console.log('   📝 Use the profile submission form to create a pending profile');
    }
    
    if (auditLogs.length === 0) {
      console.log('   🔧 No audit logs found - this is normal for a clean system');
      console.log('   📝 Try approving a profile to generate audit logs');
    }
    
    console.log('\n7️⃣ TROUBLESHOOTING STEPS:');
    console.log('   1. Create a test profile through the web interface');
    console.log('   2. Go to admin dashboard and approve the profile');
    console.log('   3. Check if audit log appears in the audit logs section');
    console.log('   4. If no audit log appears, check browser console for errors');
    console.log('   5. Check server logs for any error messages');
    
    console.log('\n8️⃣ MANUAL TEST:');
    console.log('   To manually test profile approval:');
    console.log('   1. Create a profile with status "pending"');
    console.log('   2. Call the approval API: POST /api/admin/[yearId]/profiles/[profileId]/approve');
    console.log('   3. Check if audit log is created');
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎯 DIAGNOSTIC COMPLETE');
    
  } catch (error) {
    console.error('❌ Error during diagnostic:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the diagnostic
diagnoseAuditLogIssues().catch(console.error);
