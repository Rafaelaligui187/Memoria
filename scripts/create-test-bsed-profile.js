// Test script to create a BSED student profile with major
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function createTestBSEDProfile() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Create a test BSED student profile with major
    const testProfile = {
      _id: new ObjectId(),
      schoolYearId: "68e0f71e108ee73737d5a13c",
      schoolYear: "2025-2026",
      userType: "student",
      ownedBy: new ObjectId("68e0f773108ee73737d5a13e"), // Use existing user ID
      status: "pending",
      
      // Basic Info
      fullName: "Test BSED Student",
      nickname: "Test",
      age: "20",
      gender: "Male",
      birthday: "2005-01-01",
      address: "Test Address",
      email: "testbsed@example.com",
      phone: "1234567890",
      profilePicture: "https://example.com/test.jpg",
      
      // Academic Info
      department: "College",
      yearLevel: "1st Year",
      courseProgram: "BSED",
      major: "English", // This is the key field we're testing
      blockSection: "BSED-A",
      
      // Additional Info
      fatherGuardianName: "Test Father",
      motherGuardianName: "Test Mother",
      sayingMotto: "Test motto",
      dreamJob: "Teacher",
      officerRole: "None",
      bio: "Test bio",
      hobbies: ["Reading", "Teaching"],
      honors: ["Honor Student"],
      achievements: ["Academic Excellence"],
      
      // Social Media
      socialMediaFacebook: "test.facebook",
      socialMediaInstagram: "test.instagram",
      socialMediaTwitter: "test.twitter",
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert the test profile
    const result = await collection.insertOne(testProfile);
    console.log('Test BSED profile created with ID:', result.insertedId);
    
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

createTestBSEDProfile();
