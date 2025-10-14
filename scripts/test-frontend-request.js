// Test script to simulate frontend yearbook page request
const { MongoClient, ObjectId } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority'

async function testFrontendRequest() {
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
    
    console.log('🔍 Testing frontend yearbook page request...\n')

    // Simulate the exact parameters from the Elementary yearbook page
    const params = {
      schoolYearId: '68e0f71e108ee73737d5a13c',
      gradeId: 'grade1',
      sectionId: 'A'
    }

    console.log('Page parameters:', JSON.stringify(params, null, 2))
    console.log('')

    // Simulate the grade and section data lookup
    const grades = {
      grade1: { name: "Grade 1" },
      grade2: { name: "Grade 2" },
      grade3: { name: "Grade 3" },
      grade4: { name: "Grade 4" },
      grade5: { name: "Grade 5" },
      grade6: { name: "Grade 6" }
    }

    const sections = {
      A: { name: "A" },
      B: { name: "B" },
      C: { name: "C" },
      D: { name: "D" }
    }

    const grade = grades[params.gradeId]
    const section = sections[params.sectionId]

    console.log('Grade:', grade)
    console.log('Section:', section)
    console.log('')

    if (!grade || !section) {
      console.log('❌ Invalid grade or section')
      return
    }

    // Simulate the API call that the frontend would make
    const queryParams = new URLSearchParams({
      department: 'Elementary',
      schoolYearId: params.schoolYearId,
      status: 'approved',
      yearLevel: grade.name,
      courseProgram: 'Elementary',
      blockSection: section.name
    })

    console.log('API Query Parameters:', queryParams.toString())
    console.log('')

    // Test the database query directly
    const collection = db.collection('Elementary_yearbook')
    const query = {
      schoolYearId: params.schoolYearId,
      status: 'approved',
      yearLevel: grade.name,
      courseProgram: 'Elementary',
      blockSection: section.name
    }

    console.log('Database Query:', JSON.stringify(query, null, 2))
    console.log('')

    const profiles = await collection.find(query).toArray()
    
    console.log(`Found ${profiles.length} profiles`)
    
    if (profiles.length > 0) {
      console.log('\nProfiles found:')
      profiles.forEach((profile, index) => {
        console.log(`  ${index + 1}. ${profile.fullName}`)
        console.log(`     - Status: ${profile.status}`)
        console.log(`     - Department: ${profile.department}`)
        console.log(`     - Year Level: ${profile.yearLevel}`)
        console.log(`     - Course Program: ${profile.courseProgram}`)
        console.log(`     - Block Section: ${profile.blockSection}`)
        console.log(`     - Profile Picture: ${profile.profilePicture}`)
      })
      
      // Transform to Person format like the frontend would
      const transformedPeople = profiles.map((profile) => ({
        id: profile._id.toString(),
        name: profile.fullName,
        nickname: profile.nickname,
        image: profile.profilePicture || '/placeholder.svg',
        quote: profile.sayingMotto || '',
        honors: profile.honors,
        role: profile.userType === 'student' ? 'student' : 'faculty',
        department: profile.department,
        position: profile.userType === 'faculty' ? 'Adviser' : undefined,
        yearsOfService: profile.userType === 'faculty' ? 1 : undefined,
        officerRole: profile.userType === 'student' ? profile.officerRole : undefined,
      }))
      
      console.log('\n✅ Frontend would receive:')
      console.log(JSON.stringify(transformedPeople, null, 2))
    } else {
      console.log('❌ No profiles found for this yearbook page')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await client.close()
  }
}

// Run the test
testFrontendRequest()
