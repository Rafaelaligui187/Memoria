// Test script to verify manual profile creation
const testManualProfileCreation = async () => {
  try {
    console.log('Testing manual profile creation...')
    
    // Test data for a faculty profile
    const testProfileData = {
      userType: 'faculty',
      profileData: {
        fullName: 'Test Faculty Member',
        age: 35,
        gender: 'Female',
        birthday: '1989-01-01',
        address: 'Test Address',
        email: 'test.faculty@consolatrix.edu.ph',
        sayingMotto: 'Education is the key to success',
        position: 'Assistant Professor',
        departmentAssigned: 'Computer Science',
        yearsOfService: 5,
        messageToStudents: 'Keep learning and growing!',
        profilePicture: '',
        bio: 'A dedicated educator passionate about teaching.',
        courses: 'Programming, Database Management',
        additionalRoles: 'Student Advisor'
      }
    }

    const response = await fetch('/api/admin/2024-2025/profiles/manual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProfileData),
    })

    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Manual profile creation successful!')
      console.log('Profile ID:', result.profileId)
      console.log('User ID:', result.userId)
      
      // Test fetching the created profile
      const fetchResponse = await fetch('/api/faculty?schoolYearId=2024-2025')
      const fetchResult = await fetchResponse.json()
      
      if (fetchResult.success) {
        console.log('✅ Faculty API fetch successful!')
        console.log('Found', fetchResult.data.length, 'faculty profiles')
        
        const createdProfile = fetchResult.data.find(p => p.name === 'Test Faculty Member')
        if (createdProfile) {
          console.log('✅ Created profile found in faculty list!')
          console.log('Profile details:', {
            id: createdProfile.id,
            name: createdProfile.name,
            position: createdProfile.position,
            department: createdProfile.department,
            isManualProfile: createdProfile.isManualProfile
          })
        } else {
          console.log('❌ Created profile not found in faculty list')
        }
      } else {
        console.log('❌ Faculty API fetch failed:', fetchResult.error)
      }
    } else {
      console.log('❌ Manual profile creation failed:', result.error)
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testManualProfileCreation()
