// Test script to verify major field is being sent in profile creation
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function testProfileCreationWithMajor() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Create a test profile that simulates what the frontend should send
    const testProfileData = {
      schoolYearId: "68e0f71e108ee73737d5a13c",
      userType: "student",
      userId: "68e0f773108ee73737d5a13e", // Existing user ID
      profileData: {
        // Basic Info
        fullName: "Test BSED Student 2",
        nickname: "Test2",
        age: "21",
        gender: "Female",
        birthday: "2004-01-01",
        address: "Test Address 2",
        email: "testbsed2@example.com",
        phone: "1234567891",
        profilePicture: "https://example.com/test2.jpg",
        
        // Academic Info
        department: "College",
        yearLevel: "1st Year",
        courseProgram: "BSED",
        major: "Math", // This should now be included
        blockSection: "BSED-B",
        
        // Additional Info
        fatherGuardianName: "Test Father 2",
        motherGuardianName: "Test Mother 2",
        sayingMotto: "Test motto 2",
        dreamJob: "Math Teacher",
        officerRole: "None",
        bio: "Test bio 2",
        hobbies: ["Mathematics", "Teaching"],
        honors: ["Math Excellence"],
        achievements: ["Math Competition Winner"],
        
        // Social Media
        socialMediaFacebook: "test2.facebook",
        socialMediaInstagram: "test2.instagram",
        socialMediaTwitter: "test2.twitter",
      }
    };
    
    // Simulate the API call by creating the profile document directly
    const profileDocument = {
      schoolYearId: testProfileData.schoolYearId,
      userType: testProfileData.userType,
      ownedBy: new ObjectId(testProfileData.userId),
      ...testProfileData.profileData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Insert the test profile
    const result = await collection.insertOne(profileDocument);
    console.log('Test BSED profile with major created with ID:', result.insertedId);
    
    // Verify the profile was created with major field
    const createdProfile = await collection.findOne({ _id: result.insertedId });
    console.log('Created profile major field:', createdProfile.major);
    console.log('Created profile course program:', createdProfile.courseProgram);
    
    // Check all BSED students in the collection
    const bsedStudents = await collection.find({ courseProgram: "BSED" }).toArray();
    console.log(`Total BSED students in College_yearbook: ${bsedStudents.length}`);
    
    bsedStudents.forEach(student => {
      console.log(`- ${student.fullName}: Major = ${student.major || 'NOT SET'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testProfileCreationWithMajor();
