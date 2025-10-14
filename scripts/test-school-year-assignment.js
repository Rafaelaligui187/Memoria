// Test script to verify school year assignment in manual profile creation
const testSchoolYearAssignment = async () => {
  try {
    console.log('Testing school year assignment in manual profile creation...')
    
    // First, let's get the available school years
    console.log('\n1. Fetching available school years...')
    const schoolYearsResponse = await fetch('/api/school-years')
    const schoolYearsResult = await schoolYearsResponse.json()
    
    if (schoolYearsResult.success && schoolYearsResult.data.length > 0) {
      console.log('✅ Available school years:', schoolYearsResult.data.map(year => ({
        id: year._id,
        label: year.yearLabel,
        isActive: year.isActive
      })))
      
      // Use the first active school year, or first available if none is active
      const activeYear = schoolYearsResult.data.find(year => year.isActive) || schoolYearsResult.data[0]
      const testSchoolYearId = activeYear._id
      const testSchoolYearLabel = activeYear.yearLabel
      
      console.log(`\n2. Using school year: ${testSchoolYearLabel} (ID: ${testSchoolYearId})`)
      
      // Test data for a faculty profile
      const testProfileData = {
        userType: 'faculty',
        profileData: {
          fullName: 'Test Faculty Member - School Year Test',
          age: 35,
          gender: 'Female',
          birthday: '1989-01-01',
          address: 'Test Address',
          email: 'test.faculty.schoolyear@consolatrix.edu.ph',
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

      console.log('\n3. Creating manual profile...')
      const response = await fetch(`/api/admin/${testSchoolYearId}/profiles/manual`, {
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
        console.log('\n4. Fetching faculty profiles to verify school year assignment...')
        const fetchResponse = await fetch(`/api/faculty?schoolYearId=${testSchoolYearId}`)
        const fetchResult = await fetchResponse.json()
        
        if (fetchResult.success) {
          console.log('✅ Faculty API fetch successful!')
          console.log('Found', fetchResult.data.length, 'faculty profiles')
          
          const createdProfile = fetchResult.data.find(p => p.name === 'Test Faculty Member - School Year Test')
          if (createdProfile) {
            console.log('✅ Created profile found in faculty list!')
            console.log('Profile school year details:', {
              schoolYear: createdProfile.schoolYear,
              schoolYearId: createdProfile.schoolYearId,
              expectedSchoolYear: testSchoolYearLabel,
              expectedSchoolYearId: testSchoolYearId,
              schoolYearMatch: createdProfile.schoolYear === testSchoolYearLabel,
              schoolYearIdMatch: createdProfile.schoolYearId === testSchoolYearId
            })
            
            if (createdProfile.schoolYear === testSchoolYearLabel && createdProfile.schoolYearId === testSchoolYearId) {
              console.log('🎉 SUCCESS: School year assignment is working correctly!')
              console.log('   - School Year Label:', createdProfile.schoolYear)
              console.log('   - School Year ID:', createdProfile.schoolYearId)
              console.log('   - Profile will display correctly across all sections')
            } else {
              console.log('❌ ERROR: School year assignment mismatch!')
              console.log('   Expected:', testSchoolYearLabel, '(ID:', testSchoolYearId, ')')
              console.log('   Got:', createdProfile.schoolYear, '(ID:', createdProfile.schoolYearId, ')')
            }
          } else {
            console.log('❌ Created profile not found in faculty list')
          }
        } else {
          console.log('❌ Faculty API fetch failed:', fetchResult.error)
        }
      } else {
        console.log('❌ Manual profile creation failed:', result.error)
      }
    } else {
      console.log('❌ Failed to fetch school years:', schoolYearsResult.error)
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testSchoolYearAssignment()
