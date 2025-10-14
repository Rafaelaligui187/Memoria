// Debug script to check recent profiles in the database
const { MongoClient, ObjectId } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority'

async function debugProfileIssue() {
  const client = new MongoClient(MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    tlsAllowInvalidHostnames: true,
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
  })

  try {
    await client.connect()
    const db = client.db('Memoria')
    
    console.log('🔍 Checking recent profiles in all collections...\n')

    // Check all yearbook collections
    const collections = [
      'College_yearbook',
      'SeniorHigh_yearbook', 
      'JuniorHigh_yearbook',
      'Elementary_yearbook',
      'Alumni_yearbook',
      'FacultyStaff_yearbook'
    ]

    for (const collectionName of collections) {
      console.log(`📁 Checking collection: ${collectionName}`)
      const collection = db.collection(collectionName)
      
      // Get recent profiles (last 10)
      const recentProfiles = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .toArray()

      console.log(`   Found ${recentProfiles.length} profiles`)
      
      if (recentProfiles.length > 0) {
        console.log('   Recent profiles:')
        recentProfiles.forEach((profile, index) => {
          console.log(`   ${index + 1}. ${profile.fullName || profile.name || 'Unknown'}`)
          console.log(`      - ID: ${profile._id}`)
          console.log(`      - Status: ${profile.status}`)
          console.log(`      - User Type: ${profile.userType}`)
          console.log(`      - Department: ${profile.department}`)
          console.log(`      - School Year ID: ${profile.schoolYearId}`)
          console.log(`      - Created: ${profile.createdAt}`)
          console.log(`      - Updated: ${profile.updatedAt}`)
          if (profile.yearLevel) console.log(`      - Year Level: ${profile.yearLevel}`)
          if (profile.courseProgram) console.log(`      - Course Program: ${profile.courseProgram}`)
          if (profile.blockSection) console.log(`      - Block Section: ${profile.blockSection}`)
          console.log('')
        })
      }
      console.log('')
    }

    // Check for approved profiles specifically
    console.log('✅ Checking for approved profiles...\n')
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName)
      const approvedProfiles = await collection
        .find({ status: 'approved' })
        .sort({ updatedAt: -1 })
        .limit(5)
        .toArray()

      if (approvedProfiles.length > 0) {
        console.log(`📁 ${collectionName} - Approved profiles:`)
        approvedProfiles.forEach((profile, index) => {
          console.log(`   ${index + 1}. ${profile.fullName || profile.name || 'Unknown'}`)
          console.log(`      - Status: ${profile.status}`)
          console.log(`      - Department: ${profile.department}`)
          console.log(`      - School Year ID: ${profile.schoolYearId}`)
          console.log(`      - Updated: ${profile.updatedAt}`)
          console.log('')
        })
      }
    }

    // Check school years
    console.log('📅 Checking school years...\n')
    const schoolYearsCollection = db.collection('SchoolYears')
    const schoolYears = await schoolYearsCollection.find({}).toArray()
    
    schoolYears.forEach(sy => {
      console.log(`   - ${sy.yearLabel} (ID: ${sy._id}) - Active: ${sy.isActive}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

// Run the debug script
debugProfileIssue()
