/**
 * Clean up phantom audit logs script
 * This script removes test/phantom audit logs that shouldn't exist
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function cleanupPhantomAuditLogs() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db();
    const auditLogsCollection = db.collection('AuditLogs');
    
    console.log('\n📊 Current audit logs in database:');
    
    // Get all audit logs
    const allLogs = await auditLogsCollection.find({}).toArray();
    console.log(`Total audit logs: ${allLogs.length}`);
    
    // Show details of existing logs
    allLogs.forEach((log, index) => {
      console.log(`${index + 1}. ${log.action} - ${log.targetName} (${log.userName}) - ${log.timestamp}`);
    });
    
    // Check for phantom logs (logs without corresponding profiles)
    console.log('\n🔍 Checking for phantom audit logs...');
    
    const phantomLogs = [];
    
    for (const log of allLogs) {
      if (log.action === 'profile_approved' || log.action === 'profile_rejected') {
        // Check if the target profile actually exists
        const collectionsToCheck = [
          'College_yearbook',
          'SeniorHigh_yearbook', 
          'JuniorHigh_yearbook',
          'Elementary_yearbook',
          'Alumni_yearbook',
          'FacultyStaff_yearbook'
        ];
        
        let profileExists = false;
        
        for (const collectionName of collectionsToCheck) {
          const collection = db.collection(collectionName);
          const profile = await collection.findOne({
            _id: new ObjectId(log.targetId),
            schoolYearId: log.schoolYearId
          });
          
          if (profile) {
            profileExists = true;
            break;
          }
        }
        
        if (!profileExists) {
          phantomLogs.push(log);
          console.log(`❌ Phantom log found: ${log.action} for ${log.targetName} (ID: ${log.targetId})`);
        }
      }
    }
    
    console.log(`\n📈 Found ${phantomLogs.length} phantom audit logs`);
    
    if (phantomLogs.length > 0) {
      console.log('\n🧹 Cleaning up phantom audit logs...');
      
      const phantomIds = phantomLogs.map(log => log._id);
      const deleteResult = await auditLogsCollection.deleteMany({
        _id: { $in: phantomIds }
      });
      
      console.log(`✅ Deleted ${deleteResult.deletedCount} phantom audit logs`);
      
      // Show remaining logs
      const remainingLogs = await auditLogsCollection.find({}).toArray();
      console.log(`\n📊 Remaining audit logs: ${remainingLogs.length}`);
      
      remainingLogs.forEach((log, index) => {
        console.log(`${index + 1}. ${log.action} - ${log.targetName} (${log.userName}) - ${log.timestamp}`);
      });
    } else {
      console.log('✅ No phantom audit logs found');
    }
    
    // Also check for test audit logs
    console.log('\n🔍 Checking for test audit logs...');
    
    const testLogs = await auditLogsCollection.find({
      $or: [
        { action: 'test_action' },
        { userName: { $regex: /test/i } },
        { targetName: { $regex: /test/i } },
        { details: { $regex: /test/i } }
      ]
    }).toArray();
    
    if (testLogs.length > 0) {
      console.log(`Found ${testLogs.length} test audit logs:`);
      testLogs.forEach((log, index) => {
        console.log(`${index + 1}. ${log.action} - ${log.targetName} (${log.userName})`);
      });
      
      console.log('\n🧹 Cleaning up test audit logs...');
      const testIds = testLogs.map(log => log._id);
      const deleteTestResult = await auditLogsCollection.deleteMany({
        _id: { $in: testIds }
      });
      
      console.log(`✅ Deleted ${deleteTestResult.deletedCount} test audit logs`);
    } else {
      console.log('✅ No test audit logs found');
    }
    
    console.log('\n🎉 Audit log cleanup completed!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupPhantomAuditLogs().catch(console.error);
