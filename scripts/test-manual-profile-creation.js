// Test script for manual profile creation
const testManualProfileCreation = async () => {
  const testData = {
    userType: "student",
    profileData: {
      fullName: "Test Student",
      nickname: "Test",
      age: 18,
      gender: "Male",
      birthday: "2006-01-01",
      address: "123 Test Street, Test City",
      email: "test.student@cctc.edu.ph",
      phone: "09123456789",
      sayingMotto: "Test motto for manual profile",
      department: "College",
      yearLevel: "1st Year",
      courseProgram: "BS Computer Science",
      blockSection: "CS-A",
      dreamJob: "Software Engineer",
      fatherGuardianName: "Test Father",
      motherGuardianName: "Test Mother",
      bio: "This is a test manual profile",
      socialMediaFacebook: "@teststudent",
      socialMediaInstagram: "@teststudent",
      socialMediaTwitter: "@teststudent"
    }
  }

  try {
    console.log("Testing manual profile creation...")
    console.log("Test data:", testData)
    
    const response = await fetch('/api/admin/2024-2025/profiles/manual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    const result = await response.json()
    console.log("Response status:", response.status)
    console.log("Response data:", result)

    if (result.success) {
      console.log("✅ Manual profile creation test PASSED")
      console.log("Profile ID:", result.profileId)
      console.log("User ID:", result.userId)
    } else {
      console.log("❌ Manual profile creation test FAILED")
      console.log("Error:", result.message || result.error)
    }
  } catch (error) {
    console.log("❌ Manual profile creation test FAILED with error:")
    console.error(error)
  }
}

// Run the test
testManualProfileCreation()
