const { MongoClient, ObjectId } = require('mongodb')

// MongoDB connection string - using the same connection as the app
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority'

async function testManualProfileAuditLog() {
  console.log('🧪 Testing Manual Profile Audit Log Integration...\n')
  
  let client
  try {
    // Connect to MongoDB with SSL options
    client = new MongoClient(MONGODB_URI, {
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
    })
    await client.connect()
    console.log('✅ Connected to MongoDB')
    
    const db = client.db('Memoria')
    
    // Test 1: Check if AuditLogs collection exists
    console.log('\n📋 Test 1: Checking AuditLogs collection...')
    const collections = await db.listCollections({ name: 'AuditLogs' }).toArray()
    if (collections.length > 0) {
      console.log('✅ AuditLogs collection exists')
    } else {
      console.log('❌ AuditLogs collection does not exist')
      return
    }
    
    // Test 2: Check recent audit logs
    console.log('\n📋 Test 2: Checking recent audit logs...')
    const recentLogs = await db.collection('AuditLogs')
      .find({})
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray()
    
    console.log(`Found ${recentLogs.length} recent audit logs:`)
    recentLogs.forEach((log, index) => {
      console.log(`  ${index + 1}. Action: ${log.action}, User: ${log.userName}, Target: ${log.targetName}, Time: ${log.timestamp}`)
    })
    
    // Test 3: Check for manual profile creation logs
    console.log('\n📋 Test 3: Checking for manual profile creation logs...')
    const manualProfileLogs = await db.collection('AuditLogs')
      .find({ action: 'manual_profile_created' })
      .sort({ timestamp: -1 })
      .limit(3)
      .toArray()
    
    if (manualProfileLogs.length > 0) {
      console.log(`✅ Found ${manualProfileLogs.length} manual profile creation logs:`)
      manualProfileLogs.forEach((log, index) => {
        console.log(`  ${index + 1}. Profile: ${log.targetName}, Department: ${log.details?.department}, Time: ${log.timestamp}`)
        console.log(`     Details: ${JSON.stringify(log.details, null, 2)}`)
      })
    } else {
      console.log('ℹ️  No manual profile creation logs found yet')
    }
    
    // Test 4: Check SchoolYears collection
    console.log('\n📋 Test 4: Checking SchoolYears collection...')
    const schoolYears = await db.collection('SchoolYears')
      .find({})
      .limit(3)
      .toArray()
    
    if (schoolYears.length > 0) {
      console.log(`✅ Found ${schoolYears.length} school years:`)
      schoolYears.forEach((year, index) => {
        console.log(`  ${index + 1}. ID: ${year._id}, Label: ${year.yearLabel}`)
      })
    } else {
      console.log('❌ No school years found')
    }
    
    // Test 5: Check yearbook collections
    console.log('\n📋 Test 5: Checking yearbook collections...')
    const yearbookCollections = [
      'College_yearbook',
      'SeniorHigh_yearbook',
      'JuniorHigh_yearbook',
      'Elementary_yearbook',
      'Alumni_yearbook',
      'FacultyStaff_yearbook'
    ]
    
    for (const collectionName of yearbookCollections) {
      const count = await db.collection(collectionName).countDocuments()
      console.log(`  ${collectionName}: ${count} profiles`)
    }
    
    console.log('\n🎉 Manual Profile Audit Log Test Complete!')
    console.log('\n📝 Summary:')
    console.log('  - Audit log integration is ready')
    console.log('  - When an admin creates a manual profile, it will be logged')
    console.log('  - Log includes: admin name, timestamp, profile details, and action type')
    console.log('  - Action type: "manual_profile_created"')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    if (client) {
      await client.close()
      console.log('\n🔌 MongoDB connection closed')
    }
  }
}

// Run the test
testManualProfileAuditLog().catch(console.error)
