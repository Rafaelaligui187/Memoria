// Test script to check yearbook API
const testYearbookAPI = async () => {
  const baseUrl = 'http://localhost:3000'
  const params = {
    department: 'Elementary',
    schoolYearId: '68e0f71e108ee73737d5a13c',
    status: 'approved',
    yearLevel: 'Grade 1',
    courseProgram: 'Elementary',
    blockSection: 'A'
  }

  const queryString = new URLSearchParams(params).toString()
  const url = `${baseUrl}/api/yearbook?${queryString}`

  console.log('🔍 Testing yearbook API...')
  console.log('URL:', url)
  console.log('')

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    const result = await response.json()
    
    console.log('Response Status:', response.status)
    console.log('Response Data:', JSON.stringify(result, null, 2))
    
    if (result.success && result.data) {
      console.log(`✅ Found ${result.data.length} profiles`)
      result.data.forEach((profile, index) => {
        console.log(`   ${index + 1}. ${profile.fullName}`)
        console.log(`      - Status: ${profile.status}`)
        console.log(`      - Department: ${profile.department}`)
        console.log(`      - Year Level: ${profile.yearLevel}`)
        console.log(`      - Block Section: ${profile.blockSection}`)
      })
    } else {
      console.log('❌ No profiles found or API error')
      console.log('Error:', result.error)
    }

  } catch (error) {
    console.error('❌ Error testing API:', error)
  }
}

// Run the test
testYearbookAPI()
