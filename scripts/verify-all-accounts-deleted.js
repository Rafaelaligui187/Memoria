/**
 * Verification Script: Confirm All User Accounts Deleted
 * 
 * This script verifies that all user accounts and associated data
 * have been successfully deleted from the database.
 */

const { MongoClient } = require('mongodb')

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority'

// Yearbook collections that store user profiles
const YEARBOOK_COLLECTIONS = {
  COLLEGE: 'College_yearbook',
  SENIOR_HIGH: 'SeniorHigh_yearbook',
  JUNIOR_HIGH: 'JuniorHigh_yearbook',
  ELEMENTARY: 'Elementary_yearbook',
  ALUMNI: 'Alumni_yearbook',
  FACULTY_STAFF: 'FacultyStaff_yearbook',
  SCHOOL_YEARS: 'SchoolYears'
}

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI, {
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
    return client.db('Memoria')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

async function verifyDeletion(db) {
  console.log('🔍 Verifying deletion results...\n')
  
  let allClean = true
  
  // Check users collection
  console.log('👥 Checking users collection...')
  try {
    const usersCollection = db.collection('users')
    const userCount = await usersCollection.countDocuments({})
    
    if (userCount === 0) {
      console.log('   ✅ Users collection is empty (0 users)')
    } else {
      console.log(`   ❌ Users collection still contains ${userCount} users`)
      allClean = false
    }
  } catch (error) {
    console.log('   ❌ Error checking users collection:', error.message)
    allClean = false
  }
  
  // Check yearbook collections
  console.log('\n📄 Checking yearbook collections...')
  const collectionsToCheck = [
    YEARBOOK_COLLECTIONS.COLLEGE,
    YEARBOOK_COLLECTIONS.SENIOR_HIGH,
    YEARBOOK_COLLECTIONS.JUNIOR_HIGH,
    YEARBOOK_COLLECTIONS.ELEMENTARY,
    YEARBOOK_COLLECTIONS.ALUMNI,
    YEARBOOK_COLLECTIONS.FACULTY_STAFF
  ]
  
  let totalProfilesRemaining = 0
  
  for (const collectionName of collectionsToCheck) {
    try {
      const collection = db.collection(collectionName)
      const profileCount = await collection.countDocuments({})
      
      if (profileCount === 0) {
        console.log(`   ✅ ${collectionName}: Empty (0 profiles)`)
      } else {
        console.log(`   ❌ ${collectionName}: ${profileCount} profiles remaining`)
        totalProfilesRemaining += profileCount
        allClean = false
      }
    } catch (error) {
      console.log(`   ❌ Error checking ${collectionName}:`, error.message)
      allClean = false
    }
  }
  
  // Check audit logs
  console.log('\n📋 Checking audit logs...')
  try {
    const auditLogsCollection = db.collection('audit_logs')
    const auditLogCount = await auditLogsCollection.countDocuments({})
    
    if (auditLogCount === 0) {
      console.log('   ✅ Audit logs collection is empty (0 logs)')
    } else {
      console.log(`   ❌ Audit logs collection still contains ${auditLogCount} entries`)
      allClean = false
    }
  } catch (error) {
    console.log('   ❌ Error checking audit logs:', error.message)
    allClean = false
  }
  
  // Check school years (should remain)
  console.log('\n📚 Checking school years...')
  try {
    const schoolYearsCollection = db.collection(YEARBOOK_COLLECTIONS.SCHOOL_YEARS)
    const schoolYearCount = await schoolYearsCollection.countDocuments({})
    
    if (schoolYearCount > 0) {
      console.log(`   ✅ School years collection contains ${schoolYearCount} school years (should remain)`)
    } else {
      console.log('   ⚠️  School years collection is empty (may need to be recreated)')
    }
  } catch (error) {
    console.log('   ❌ Error checking school years:', error.message)
    allClean = false
  }
  
  // Summary
  console.log('\n📊 Verification Summary:')
  console.log('='.repeat(50))
  
  if (allClean) {
    console.log('🎉 SUCCESS: All user data has been successfully deleted!')
    console.log('✅ Users collection: Empty')
    console.log('✅ All yearbook collections: Empty')
    console.log('✅ Audit logs: Empty')
    console.log('✅ System is clean and ready for fresh data')
  } else {
    console.log('⚠️  PARTIAL SUCCESS: Some data may still remain')
    console.log(`❌ Total profiles remaining: ${totalProfilesRemaining}`)
    console.log('🔄 You may need to run the deletion script again')
  }
  
  console.log('='.repeat(50))
  
  return allClean
}

async function main() {
  console.log('🔍 User Account Deletion Verification')
  console.log('='.repeat(50))
  
  let db
  try {
    db = await connectToDatabase()
    const isClean = await verifyDeletion(db)
    
    if (isClean) {
      console.log('\n🎯 VERIFICATION COMPLETE: All user accounts successfully deleted!')
    } else {
      console.log('\n⚠️  VERIFICATION COMPLETE: Some data may still remain')
    }
    
  } catch (error) {
    console.error('\n❌ Error during verification:', error)
  } finally {
    if (db) {
      await db.client.close()
      console.log('\n🔌 Database connection closed')
    }
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { main }
