// Detailed debug script to test the exact yearbook query
const { MongoClient, ObjectId } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority'

async function debugYearbookQuery() {
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
    
    console.log('🔍 Testing exact yearbook query...\n')

    // Test the exact query that the yearbook API would use
    const collection = db.collection('Elementary_yearbook')
    
    const query = {
      schoolYearId: '68e0f71e108ee73737d5a13c',
      status: 'approved',
      yearLevel: 'Grade 1',
      courseProgram: 'Elementary',
      blockSection: 'A'
    }

    console.log('Query:', JSON.stringify(query, null, 2))
    console.log('')

    const results = await collection.find(query).toArray()
    
    console.log(`Found ${results.length} profiles matching the query`)
    
    if (results.length > 0) {
      results.forEach((profile, index) => {
        console.log(`\nProfile ${index + 1}:`)
        console.log(`  Name: ${profile.fullName}`)
        console.log(`  Status: ${profile.status}`)
        console.log(`  Department: ${profile.department}`)
        console.log(`  School Year ID: ${profile.schoolYearId}`)
        console.log(`  Year Level: ${profile.yearLevel}`)
        console.log(`  Course Program: ${profile.courseProgram}`)
        console.log(`  Block Section: ${profile.blockSection}`)
        console.log(`  Created: ${profile.createdAt}`)
        console.log(`  Updated: ${profile.updatedAt}`)
      })
    } else {
      console.log('❌ No profiles found with the exact query')
      
      // Let's check what profiles exist with similar criteria
      console.log('\n🔍 Checking profiles with partial matches...')
      
      // Check by school year only
      const bySchoolYear = await collection.find({ schoolYearId: '68e0f71e108ee73737d5a13c' }).toArray()
      console.log(`\nProfiles for school year 68e0f71e108ee73737d5a13c: ${bySchoolYear.length}`)
      
      // Check by status only
      const byStatus = await collection.find({ status: 'approved' }).toArray()
      console.log(`Approved profiles: ${byStatus.length}`)
      
      // Check by year level only
      const byYearLevel = await collection.find({ yearLevel: 'Grade 1' }).toArray()
      console.log(`Grade 1 profiles: ${byYearLevel.length}`)
      
      // Check by block section only
      const byBlockSection = await collection.find({ blockSection: 'A' }).toArray()
      console.log(`Section A profiles: ${byBlockSection.length}`)
      
      // Show the actual profile data to see what fields exist
      if (bySchoolYear.length > 0) {
        console.log('\n📋 Actual profile data:')
        const profile = bySchoolYear[0]
        console.log(JSON.stringify(profile, null, 2))
      }
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

// Run the debug script
debugYearbookQuery()
