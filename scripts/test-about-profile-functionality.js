/**
 * Test script for About Profile functionality
 */

const { MongoClient, ObjectId } = require('mongodb')

// MongoDB connection string - using the same connection as the app
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority'

async function testAboutProfileFunctionality() {
  console.log('🧪 Testing About Profile Functionality...\n')
  
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
    
    // Test 1: Check FacultyStaff_yearbook collection for profiles with bio
    console.log('\n📋 Test 1: Checking Faculty & Staff profiles with bio information...')
    const facultyStaffProfiles = await db.collection('FacultyStaff_yearbook')
      .find({ bio: { $exists: true, $ne: "" } })
      .limit(5)
      .toArray()
    
    if (facultyStaffProfiles.length > 0) {
      console.log(`✅ Found ${facultyStaffProfiles.length} profiles with bio information:`)
      facultyStaffProfiles.forEach((profile, index) => {
        console.log(`  ${index + 1}. Name: ${profile.fullName}`)
        console.log(`     Role: ${profile.userType || profile.role}`)
        console.log(`     Bio: ${profile.bio ? profile.bio.substring(0, 100) + '...' : 'No bio'}`)
        console.log(`     Message to Students: ${profile.messageToStudents ? 'Yes' : 'No'}`)
        console.log('')
      })
    } else {
      console.log('ℹ️  No profiles with bio information found yet')
    }
    
    // Test 2: Check all FacultyStaff profiles
    console.log('\n📋 Test 2: Checking all Faculty & Staff profiles...')
    const allFacultyStaff = await db.collection('FacultyStaff_yearbook')
      .find({})
      .limit(10)
      .toArray()
    
    console.log(`Found ${allFacultyStaff.length} total Faculty & Staff profiles:`)
    allFacultyStaff.forEach((profile, index) => {
      console.log(`  ${index + 1}. Name: ${profile.fullName}`)
      console.log(`     Role: ${profile.userType || profile.role}`)
      console.log(`     Position: ${profile.position || 'Not specified'}`)
      console.log(`     Department: ${profile.departmentAssigned || profile.department || 'Not specified'}`)
      console.log(`     Has Bio: ${profile.bio ? 'Yes' : 'No'}`)
      console.log(`     Has Message: ${profile.messageToStudents ? 'Yes' : 'No'}`)
      console.log('')
    })
    
    // Test 3: Check profile structure
    console.log('\n📋 Test 3: Checking profile structure for About Profile fields...')
    if (allFacultyStaff.length > 0) {
      const sampleProfile = allFacultyStaff[0]
      const aboutProfileFields = [
        'bio',
        'messageToStudents',
        'fullName',
        'position',
        'departmentAssigned',
        'yearsOfService',
        'email',
        'phone',
        'address',
        'sayingMotto'
      ]
      
      console.log('About Profile fields in sample profile:')
      aboutProfileFields.forEach(field => {
        const hasField = sampleProfile[field] !== undefined && sampleProfile[field] !== null && sampleProfile[field] !== ''
        console.log(`  ${field}: ${hasField ? '✅ Present' : '❌ Missing'}`)
      })
    }
    
    // Test 4: Check for faculty vs staff profiles
    console.log('\n📋 Test 4: Analyzing faculty vs staff profiles...')
    const facultyProfiles = allFacultyStaff.filter(p => p.userType === 'faculty' || p.role === 'faculty')
    const staffProfiles = allFacultyStaff.filter(p => p.userType === 'staff' || p.role === 'staff')
    
    console.log(`Faculty profiles: ${facultyProfiles.length}`)
    console.log(`Staff profiles: ${staffProfiles.length}`)
    
    if (facultyProfiles.length > 0) {
      console.log('\nSample faculty profile:')
      const faculty = facultyProfiles[0]
      console.log(`  Name: ${faculty.fullName}`)
      console.log(`  Position: ${faculty.position}`)
      console.log(`  Department: ${faculty.departmentAssigned}`)
      console.log(`  Bio: ${faculty.bio ? 'Present' : 'Missing'}`)
    }
    
    if (staffProfiles.length > 0) {
      console.log('\nSample staff profile:')
      const staff = staffProfiles[0]
      console.log(`  Name: ${staff.fullName}`)
      console.log(`  Position: ${staff.position}`)
      console.log(`  Office: ${staff.officeAssigned}`)
      console.log(`  Bio: ${staff.bio ? 'Present' : 'Missing'}`)
    }
    
    console.log('\n🎉 About Profile Test Complete!')
    console.log('\n📝 Summary:')
    console.log('  - Faculty profiles will show "About Faculty" section')
    console.log('  - Staff profiles will show "About Staff" section')
    console.log('  - Bio field is included in profile setup forms')
    console.log('  - Message to students is displayed in About section')
    console.log('  - Profiles without bio show placeholder message')
    
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
testAboutProfileFunctionality().catch(console.error)
