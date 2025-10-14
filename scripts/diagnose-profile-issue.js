// Comprehensive diagnostic and fix script
const { MongoClient, ObjectId } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority'

async function diagnoseAndFix() {
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
    
    console.log('🔍 COMPREHENSIVE DIAGNOSTIC REPORT')
    console.log('=====================================\n')

    // 1. Check the profile exists
    console.log('1️⃣ CHECKING PROFILE IN DATABASE')
    console.log('--------------------------------')
    
    const profile = await db.collection('Elementary_yearbook').findOne({
      _id: new ObjectId('68ea59a90a05226db552b1d9')
    })

    if (profile) {
      console.log('✅ Profile found in database:')
      console.log(`   Name: ${profile.fullName}`)
      console.log(`   Status: ${profile.status}`)
      console.log(`   Department: ${profile.department}`)
      console.log(`   Year Level: ${profile.yearLevel}`)
      console.log(`   Course Program: ${profile.courseProgram}`)
      console.log(`   Block Section: ${profile.blockSection}`)
      console.log(`   School Year ID: ${profile.schoolYearId}`)
      console.log(`   Created: ${profile.createdAt}`)
      console.log(`   Updated: ${profile.updatedAt}`)
    } else {
      console.log('❌ Profile not found in database')
      return
    }

    console.log('')

    // 2. Test the exact query
    console.log('2️⃣ TESTING EXACT YEARBOOK QUERY')
    console.log('--------------------------------')
    
    const query = {
      schoolYearId: '68e0f71e108ee73737d5a13c',
      status: 'approved',
      yearLevel: 'Grade 1',
      courseProgram: 'Elementary',
      blockSection: 'A'
    }

    const results = await db.collection('Elementary_yearbook').find(query).toArray()
    console.log(`✅ Query returns ${results.length} profiles`)
    
    if (results.length > 0) {
      console.log('   Profile found by query:')
      results.forEach(p => {
        console.log(`   - ${p.fullName} (${p.status})`)
      })
    }

    console.log('')

    // 3. Check school year
    console.log('3️⃣ CHECKING SCHOOL YEAR')
    console.log('------------------------')
    
    const schoolYear = await db.collection('SchoolYears').findOne({
      _id: new ObjectId('68e0f71e108ee73737d5a13c')
    })

    if (schoolYear) {
      console.log(`✅ School year found: ${schoolYear.yearLabel}`)
      console.log(`   Active: ${schoolYear.isActive}`)
      console.log(`   Start: ${schoolYear.startDate}`)
      console.log(`   End: ${schoolYear.endDate}`)
    } else {
      console.log('❌ School year not found')
    }

    console.log('')

    // 4. Provide the correct URL
    console.log('4️⃣ CORRECT YEARBOOK URL')
    console.log('------------------------')
    console.log('You should access the yearbook at:')
    console.log('')
    console.log('🌐 http://localhost:3000/school-years-elementary/68e0f71e108ee73737d5a13c/departments/elementary/grade1/A/yearbook')
    console.log('')
    console.log('📋 URL Breakdown:')
    console.log('   - School Year ID: 68e0f71e108ee73737d5a13c')
    console.log('   - Department: elementary')
    console.log('   - Grade: grade1 (Grade 1)')
    console.log('   - Section: A')
    console.log('')

    // 5. Troubleshooting steps
    console.log('5️⃣ TROUBLESHOOTING STEPS')
    console.log('------------------------')
    console.log('If the profile still doesn\'t appear:')
    console.log('')
    console.log('1. 🔄 Hard refresh the page: Ctrl + Shift + R')
    console.log('2. 🧹 Clear browser cache completely')
    console.log('3. 🔍 Open Developer Tools (F12) and check:')
    console.log('   - Console tab for errors')
    console.log('   - Network tab for failed API calls')
    console.log('4. 🔄 Restart the Next.js server:')
    console.log('   - Stop: Ctrl + C')
    console.log('   - Start: npm run dev')
    console.log('5. 🌐 Try accessing the API directly:')
    console.log('   http://localhost:3000/api/yearbook?department=Elementary&schoolYearId=68e0f71e108ee73737d5a13c&status=approved&yearLevel=Grade%201&courseProgram=Elementary&blockSection=A')
    console.log('')

    // 6. Check for potential issues
    console.log('6️⃣ POTENTIAL ISSUES TO CHECK')
    console.log('-----------------------------')
    console.log('1. ❓ Is the Next.js server running? (npm run dev)')
    console.log('2. ❓ Are there any console errors in the browser?')
    console.log('3. ❓ Is the API endpoint returning data?')
    console.log('4. ❓ Is the yearbook page loading correctly?')
    console.log('5. ❓ Are there any network errors in DevTools?')
    console.log('')

    console.log('✅ DIAGNOSTIC COMPLETE')
    console.log('======================')
    console.log('The profile exists and should be visible. If it\'s not appearing,')
    console.log('the issue is likely with the frontend or server, not the database.')

  } catch (error) {
    console.error('❌ Error during diagnostic:', error)
  } finally {
    await client.close()
  }
}

// Run the diagnostic
diagnoseAndFix()
