/**
 * Delete All User Accounts Across All School Years
 * 
 * This script will:
 * 1. Get all school years from the database
 * 2. Get all user accounts from the users collection
 * 3. Delete all profiles from all yearbook collections
 * 4. Delete all user accounts
 * 5. Clean up associated audit logs
 * 
 * WARNING: This is a destructive operation that will permanently delete
 * ALL user accounts and profiles across ALL school years!
 */

const { MongoClient, ObjectId } = require('mongodb')

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

async function getAllSchoolYears(db) {
  try {
    const collection = db.collection(YEARBOOK_COLLECTIONS.SCHOOL_YEARS)
    const schoolYears = await collection.find({}).sort({ startDate: -1 }).toArray()
    
    console.log(`📚 Found ${schoolYears.length} school years:`)
    schoolYears.forEach(year => {
      console.log(`   - ${year.yearLabel} (${year._id})`)
    })
    
    return schoolYears
  } catch (error) {
    console.error('❌ Error fetching school years:', error)
    throw error
  }
}

async function getAllUsers(db) {
  try {
    const collection = db.collection('users')
    const users = await collection.find({}).toArray()
    
    console.log(`👥 Found ${users.length} user accounts:`)
    users.forEach(user => {
      console.log(`   - ${user.firstName} ${user.lastName} (${user.email}) - ${user.userType}`)
    })
    
    return users
  } catch (error) {
    console.error('❌ Error fetching users:', error)
    throw error
  }
}

async function deleteAllProfiles(db, userIds) {
  console.log('\n🗑️  Deleting all profiles from yearbook collections...')
  
  const collectionsToClean = [
    YEARBOOK_COLLECTIONS.COLLEGE,
    YEARBOOK_COLLECTIONS.SENIOR_HIGH,
    YEARBOOK_COLLECTIONS.JUNIOR_HIGH,
    YEARBOOK_COLLECTIONS.ELEMENTARY,
    YEARBOOK_COLLECTIONS.ALUMNI,
    YEARBOOK_COLLECTIONS.FACULTY_STAFF
  ]
  
  let totalProfilesDeleted = 0
  
  for (const collectionName of collectionsToClean) {
    try {
      const collection = db.collection(collectionName)
      
      // Count profiles before deletion
      const profileCount = await collection.countDocuments({})
      
      if (profileCount > 0) {
        console.log(`   📄 ${collectionName}: ${profileCount} profiles found`)
        
        // Delete all profiles in this collection
        const deleteResult = await collection.deleteMany({})
        totalProfilesDeleted += deleteResult.deletedCount
        
        console.log(`   ✅ ${collectionName}: ${deleteResult.deletedCount} profiles deleted`)
      } else {
        console.log(`   📄 ${collectionName}: No profiles found`)
      }
    } catch (error) {
      console.error(`   ❌ Error deleting profiles from ${collectionName}:`, error.message)
    }
  }
  
  console.log(`\n📊 Total profiles deleted: ${totalProfilesDeleted}`)
  return totalProfilesDeleted
}

async function deleteAllUsers(db, users) {
  console.log('\n🗑️  Deleting all user accounts...')
  
  try {
    const collection = db.collection('users')
    
    // Delete all users
    const deleteResult = await collection.deleteMany({})
    
    console.log(`✅ Deleted ${deleteResult.deletedCount} user accounts`)
    return deleteResult.deletedCount
  } catch (error) {
    console.error('❌ Error deleting users:', error)
    throw error
  }
}

async function deleteAllAuditLogs(db) {
  console.log('\n🗑️  Deleting all audit logs...')
  
  try {
    const collection = db.collection('audit_logs')
    
    // Count audit logs before deletion
    const auditLogCount = await collection.countDocuments({})
    
    if (auditLogCount > 0) {
      console.log(`   📋 Found ${auditLogCount} audit log entries`)
      
      // Delete all audit logs
      const deleteResult = await collection.deleteMany({})
      
      console.log(`✅ Deleted ${deleteResult.deletedCount} audit log entries`)
      return deleteResult.deletedCount
    } else {
      console.log(`   📋 No audit log entries found`)
      return 0
    }
  } catch (error) {
    console.error('❌ Error deleting audit logs:', error)
    throw error
  }
}

async function main() {
  console.log('🚨 DESTRUCTIVE OPERATION: Delete All User Accounts Across All School Years')
  console.log('='.repeat(80))
  console.log('⚠️  WARNING: This will permanently delete:')
  console.log('   - ALL user accounts from the users collection')
  console.log('   - ALL profiles from ALL yearbook collections')
  console.log('   - ALL audit logs')
  console.log('   - ALL data across ALL school years')
  console.log('='.repeat(80))
  
  // Confirmation prompt
  const readline = require('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  const confirmation = await new Promise((resolve) => {
    rl.question('\n❓ Are you absolutely sure you want to delete ALL user accounts? Type "DELETE ALL" to confirm: ', resolve)
  })
  
  rl.close()
  
  if (confirmation !== 'DELETE ALL') {
    console.log('❌ Operation cancelled. No data was deleted.')
    process.exit(0)
  }
  
  console.log('\n🔥 Proceeding with deletion...')
  
  let db
  try {
    db = await connectToDatabase()
    
    // Step 1: Get all school years
    console.log('\n📚 Step 1: Fetching school years...')
    const schoolYears = await getAllSchoolYears(db)
    
    // Step 2: Get all users
    console.log('\n👥 Step 2: Fetching user accounts...')
    const users = await getAllUsers(db)
    
    if (users.length === 0) {
      console.log('ℹ️  No user accounts found. Nothing to delete.')
      return
    }
    
    // Step 3: Delete all profiles from yearbook collections
    console.log('\n📄 Step 3: Deleting profiles from yearbook collections...')
    const userIds = users.map(user => user._id)
    const profilesDeleted = await deleteAllProfiles(db, userIds)
    
    // Step 4: Delete all audit logs
    console.log('\n📋 Step 4: Deleting audit logs...')
    const auditLogsDeleted = await deleteAllAuditLogs(db)
    
    // Step 5: Delete all users
    console.log('\n👥 Step 5: Deleting user accounts...')
    const usersDeleted = await deleteAllUsers(db, users)
    
    // Summary
    console.log('\n🎉 DELETION COMPLETE!')
    console.log('='.repeat(50))
    console.log(`📚 School Years Processed: ${schoolYears.length}`)
    console.log(`📄 Profiles Deleted: ${profilesDeleted}`)
    console.log(`📋 Audit Logs Deleted: ${auditLogsDeleted}`)
    console.log(`👥 User Accounts Deleted: ${usersDeleted}`)
    console.log('='.repeat(50))
    
    console.log('\n✅ All user accounts and associated data have been permanently deleted.')
    console.log('🔄 The system is now clean and ready for fresh data.')
    
  } catch (error) {
    console.error('\n❌ Error during deletion process:', error)
    console.log('🔄 Some data may have been partially deleted. Check the logs above for details.')
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
