// Simple test to check if the API endpoint is accessible
const testAPIEndpoint = async () => {
  const url = 'http://localhost:3000/api/yearbook?department=Elementary&schoolYearId=68e0f71e108ee73737d5a13c&status=approved&yearLevel=Grade%201&courseProgram=Elementary&blockSection=A'
  
  console.log('🔍 Testing API endpoint...')
  console.log('URL:', url)
  console.log('')

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    })

    console.log('Response Status:', response.status)
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()))
    console.log('')

    if (response.ok) {
      const data = await response.json()
      console.log('Response Data:', JSON.stringify(data, null, 2))
      
      if (data.success && data.data && data.data.length > 0) {
        console.log(`\n✅ SUCCESS: Found ${data.data.length} profiles`)
        data.data.forEach((profile, index) => {
          console.log(`  ${index + 1}. ${profile.fullName}`)
        })
      } else {
        console.log('\n❌ No profiles found in API response')
      }
    } else {
      console.log('❌ API request failed')
      const errorText = await response.text()
      console.log('Error response:', errorText)
    }

  } catch (error) {
    console.error('❌ Error testing API:', error.message)
  }
}

// Run the test
testAPIEndpoint()
