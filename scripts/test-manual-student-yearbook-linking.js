// Test script to verify manual student profile creation and yearbook collection linking
const testManualStudentProfileCreation = async () => {
  console.log("🧪 Testing Manual Student Profile Creation and Yearbook Collection Linking")
  console.log("=" * 80)

  // Test data for different departments
  const testProfiles = [
    {
      department: "College",
      userType: "student",
      profileData: {
        fullName: "John College Student",
        nickname: "Johnny",
        age: 20,
        gender: "Male",
        birthday: "2004-01-15",
        address: "123 College St, Manila",
        email: "john.college@test.com",
        phone: "09123456789",
        profilePicture: "https://via.placeholder.com/150",
        sayingMotto: "Education is the key to success",
        fatherGuardianName: "Robert College",
        motherGuardianName: "Maria College",
        department: "College",
        yearLevel: "2nd Year",
        courseProgram: "BS Information Technology",
        major: "",
        blockSection: "IT-B",
        dreamJob: "Software Engineer",
        socialMediaFacebook: "john.college",
        socialMediaInstagram: "@johncollege",
        socialMediaTwitter: "@johncollege",
        hobbies: "Programming, Gaming",
        honors: "Dean's List",
        officerRole: "Class President",
        ambition: "To become a successful tech entrepreneur"
      }
    },
    {
      department: "Senior High",
      userType: "student", 
      profileData: {
        fullName: "Jane Senior High Student",
        nickname: "Janey",
        age: 17,
        gender: "Female",
        birthday: "2007-03-20",
        address: "456 Senior High Ave, Quezon City",
        email: "jane.senior@test.com",
        phone: "09123456790",
        profilePicture: "https://via.placeholder.com/150",
        sayingMotto: "Dream big, work hard",
        fatherGuardianName: "Michael Senior",
        motherGuardianName: "Sarah Senior",
        department: "Senior High",
        yearLevel: "Grade 12",
        courseProgram: "STEM",
        major: "",
        blockSection: "STEM 3",
        dreamJob: "Doctor",
        socialMediaFacebook: "jane.senior",
        socialMediaInstagram: "@janesenior",
        socialMediaTwitter: "@janesenior",
        hobbies: "Science experiments, Reading",
        honors: "Science Fair Winner",
        officerRole: "Science Club President",
        ambition: "To become a medical doctor"
      }
    },
    {
      department: "Junior High",
      userType: "student",
      profileData: {
        fullName: "Bob Junior High Student",
        nickname: "Bobby",
        age: 14,
        gender: "Male",
        birthday: "2010-07-10",
        address: "789 Junior High Blvd, Makati",
        email: "bob.junior@test.com",
        phone: "09123456791",
        profilePicture: "https://via.placeholder.com/150",
        sayingMotto: "Learning never stops",
        fatherGuardianName: "David Junior",
        motherGuardianName: "Lisa Junior",
        department: "Junior High",
        yearLevel: "Grade 9",
        courseProgram: "Junior High",
        major: "",
        blockSection: "Section B",
        dreamJob: "Teacher",
        socialMediaFacebook: "bob.junior",
        socialMediaInstagram: "@bobjunior",
        socialMediaTwitter: "@bobjunior",
        hobbies: "Sports, Music",
        honors: "Athletic Award",
        officerRole: "Sports Captain",
        ambition: "To become a PE teacher"
      }
    },
    {
      department: "Elementary",
      userType: "student",
      profileData: {
        fullName: "Alice Elementary Student",
        nickname: "Ally",
        age: 10,
        gender: "Female",
        birthday: "2014-11-05",
        address: "321 Elementary Rd, Pasig",
        email: "alice.elementary@test.com",
        phone: "09123456792",
        profilePicture: "https://via.placeholder.com/150",
        sayingMotto: "Be kind and curious",
        fatherGuardianName: "Tom Elementary",
        motherGuardianName: "Anna Elementary",
        department: "Elementary",
        yearLevel: "Grade 5",
        courseProgram: "Elementary",
        major: "",
        blockSection: "Section C",
        dreamJob: "Artist",
        socialMediaFacebook: "alice.elementary",
        socialMediaInstagram: "@aliceelementary",
        socialMediaTwitter: "@aliceelementary",
        hobbies: "Drawing, Dancing",
        honors: "Art Contest Winner",
        officerRole: "Art Club Member",
        ambition: "To become a famous artist"
      }
    },
    {
      department: "Graduate School",
      userType: "student",
      profileData: {
        fullName: "Dr. Graduate Student",
        nickname: "Grad",
        age: 28,
        gender: "Male",
        birthday: "1996-09-12",
        address: "654 Graduate St, Taguig",
        email: "dr.graduate@test.com",
        phone: "09123456793",
        profilePicture: "https://via.placeholder.com/150",
        sayingMotto: "Knowledge is power",
        fatherGuardianName: "Professor Graduate",
        motherGuardianName: "Dr. Graduate",
        department: "Graduate School",
        yearLevel: "Master's",
        courseProgram: "Master of Science in Computer Science",
        major: "",
        blockSection: "MSCS-A",
        dreamJob: "Research Scientist",
        socialMediaFacebook: "dr.graduate",
        socialMediaInstagram: "@drgraduate",
        socialMediaTwitter: "@drgraduate",
        hobbies: "Research, Writing",
        honors: "Academic Excellence",
        officerRole: "Research Assistant",
        ambition: "To contribute to scientific knowledge"
      }
    }
  ]

  // Test school year ID (using the first active school year)
  const schoolYearId = "68e0f71e108ee73737d5a13c" // 2025-2026

  console.log(`📚 Testing with School Year ID: ${schoolYearId}`)
  console.log(`📚 Expected School Year Label: 2025–2026`)
  console.log()

  // Test each department
  for (const testProfile of testProfiles) {
    console.log(`🎯 Testing ${testProfile.department} Student Profile Creation`)
    console.log(`   Student: ${testProfile.profileData.fullName}`)
    console.log(`   Department: ${testProfile.department}`)
    console.log(`   Course/Program: ${testProfile.profileData.courseProgram}`)
    console.log(`   Year Level: ${testProfile.profileData.yearLevel}`)
    console.log(`   Block/Section: ${testProfile.profileData.blockSection}`)

    try {
      const response = await fetch(`http://localhost:3000/api/admin/${schoolYearId}/profiles/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType: testProfile.userType,
          profileData: testProfile.profileData
        })
      })

      const result = await response.json()

      if (result.success) {
        console.log(`   ✅ Profile created successfully!`)
        console.log(`   📋 Profile ID: ${result.profileId}`)
        console.log(`   👤 User ID: ${result.userId}`)
        console.log(`   📊 Expected Collection: ${getExpectedCollection(testProfile.department)}`)
        console.log(`   🏷️  Status: approved (automatic)`)
        console.log(`   📅 School Year: 2025–2026 (automatic)`)
      } else {
        console.log(`   ❌ Profile creation failed: ${result.message}`)
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }

    console.log()
  }

  console.log("🔍 Verification Steps:")
  console.log("1. Check MongoDB collections:")
  console.log("   - College_yearbook: Should contain John College Student")
  console.log("   - SeniorHigh_yearbook: Should contain Jane Senior High Student")
  console.log("   - JuniorHigh_yearbook: Should contain Bob Junior High Student")
  console.log("   - Elementary_yearbook: Should contain Alice Elementary Student")
  console.log("   - College_yearbook: Should contain Dr. Graduate Student (Graduate School)")
  console.log()
  console.log("2. Verify profile properties:")
  console.log("   - schoolYearId: Should be '68e0f71e108ee73737d5a13c'")
  console.log("   - schoolYear: Should be '2025–2026'")
  console.log("   - status: Should be 'approved'")
  console.log("   - profileStatus: Should be 'approved'")
  console.log("   - isManualProfile: Should be true")
  console.log("   - createdByAdmin: Should be true")
  console.log()
  console.log("3. Check yearbook display:")
  console.log("   - Profiles should appear instantly in respective yearbook sections")
  console.log("   - No approval process required")
  console.log("   - School year should display correctly")
  console.log()
  console.log("🎉 Test completed! Check the results above.")
}

// Helper function to get expected collection name
const getExpectedCollection = (department) => {
  const collectionMap = {
    "College": "College_yearbook",
    "Senior High": "SeniorHigh_yearbook",
    "Junior High": "JuniorHigh_yearbook", 
    "Elementary": "Elementary_yearbook",
    "Graduate School": "College_yearbook" // Graduate students go to College yearbook
  }
  return collectionMap[department] || "College_yearbook"
}

// Run the test
testManualStudentProfileCreation().catch(console.error)
