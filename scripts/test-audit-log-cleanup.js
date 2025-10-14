/**
 * Test script to verify audit log cleanup functionality
 * This script demonstrates that when a user is deleted, their audit logs are automatically removed
 */

const { MongoDatabase } = require('./lib/mongodb-database.ts')

async function testAuditLogCleanup() {
  console.log('🧪 Testing Audit Log Cleanup Functionality...\n')
  
  try {
    // Initialize database connection
    const db = new MongoDatabase()
    
    // Test user ID
    const testUserId = 'test-user-123'
    
    console.log('1. Creating test audit logs for user...')
    
    // Create some test audit logs for the user
    const testAuditLogs = [
      {
        userId: testUserId,
        userName: 'Test User',
        action: 'login',
        targetType: 'user',
        targetId: testUserId,
        targetName: 'Test User',
        details: { loginTime: new Date() },
        schoolYearId: '2024-2025',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Browser',
        timestamp: new Date(),
        status: 'success'
      },
      {
        userId: testUserId,
        userName: 'Test User',
        action: 'profile_update',
        targetType: 'profile',
        targetId: 'profile-123',
        targetName: 'Test Profile',
        details: { field: 'name', oldValue: 'Old Name', newValue: 'New Name' },
        schoolYearId: '2024-2025',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Browser',
        timestamp: new Date(),
        status: 'success'
      }
    ]
    
    // Insert test audit logs
    for (const log of testAuditLogs) {
      await db.createAuditLog(log)
    }
    
    console.log(`✅ Created ${testAuditLogs.length} test audit logs for user ${testUserId}`)
    
    console.log('\n2. Verifying audit logs exist...')
    
    // Verify audit logs exist
    const existingLogs = await db.getAuditLogs('2024-2025', { userId: testUserId })
    console.log(`✅ Found ${existingLogs.length} audit logs for user ${testUserId}`)
    
    console.log('\n3. Testing audit log cleanup method...')
    
    // Test the deleteAuditLogsByUserId method directly
    const deletedCount = await db.deleteAuditLogsByUserId(testUserId)
    console.log(`✅ Deleted ${deletedCount} audit logs for user ${testUserId}`)
    
    console.log('\n4. Verifying audit logs are removed...')
    
    // Verify audit logs are gone
    const remainingLogs = await db.getAuditLogs('2024-2025', { userId: testUserId })
    console.log(`✅ Remaining audit logs for user ${testUserId}: ${remainingLogs.length}`)
    
    if (remainingLogs.length === 0) {
      console.log('\n🎉 SUCCESS: Audit log cleanup is working correctly!')
      console.log('   When a user is deleted, their audit logs are automatically removed.')
    } else {
      console.log('\n❌ FAILURE: Audit logs were not properly cleaned up.')
    }
    
    console.log('\n5. Testing user deletion with automatic audit log cleanup...')
    
    // Create a test user
    const testUser = {
      email: 'test@example.com',
      name: 'Test User',
      role: 'student',
      schoolYearId: '2024-2025',
      status: 'active'
    }
    
    const createdUser = await db.createUser(testUser)
    console.log(`✅ Created test user with ID: ${createdUser.id}`)
    
    // Create some audit logs for this user
    const userAuditLog = {
      userId: createdUser.id,
      userName: createdUser.name,
      action: 'user_created',
      targetType: 'user',
      targetId: createdUser.id,
      targetName: createdUser.name,
      details: { email: createdUser.email },
      schoolYearId: '2024-2025',
      ipAddress: '127.0.0.1',
      userAgent: 'Test Browser',
      timestamp: new Date(),
      status: 'success'
    }
    
    await db.createAuditLog(userAuditLog)
    console.log('✅ Created audit log for test user')
    
    // Verify audit log exists
    const userLogsBefore = await db.getAuditLogs('2024-2025', { userId: createdUser.id })
    console.log(`✅ Audit logs before deletion: ${userLogsBefore.length}`)
    
    // Delete the user (this should automatically delete audit logs)
    const deleteResult = await db.deleteUser(createdUser.id)
    console.log(`✅ User deletion result: ${deleteResult}`)
    
    // Verify audit logs are automatically cleaned up
    const userLogsAfter = await db.getAuditLogs('2024-2025', { userId: createdUser.id })
    console.log(`✅ Audit logs after deletion: ${userLogsAfter.length}`)
    
    if (userLogsAfter.length === 0) {
      console.log('\n🎉 SUCCESS: User deletion automatically cleans up audit logs!')
    } else {
      console.log('\n❌ FAILURE: User deletion did not clean up audit logs.')
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Run the test
testAuditLogCleanup()
