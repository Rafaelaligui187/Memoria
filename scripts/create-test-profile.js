/**
 * Script to create a test profile for testing the approval workflow
 */

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function createTestProfile() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db();
    
    // Get the active school year
    const activeSchoolYear = await db.collection('SchoolYears').findOne({ isActive: true });
    if (!activeSchoolYear) {
      console.log('❌ No active school year found');
      return;
    }
    
    console.log(`📅 Using school year: ${activeSchoolYear.yearLabel}`);
    
    // Create a test college student profile
    console.log('\n📝 Creating test college student profile...');
    
    const testProfile = {
      schoolYearId: activeSchoolYear._id.toString(),
      schoolYear: activeSchoolYear.yearLabel,
      userType: 'student',
      department: 'College',
      fullName: 'Test Student Profile',
      email: 'test.student@example.com',
      courseProgram: 'BSIT',
      yearLevel: '4th Year',
      blockSection: 'A',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      // Add some additional fields
      nickname: 'Test',
      age: 20,
      gender: 'Male',
      phone: '09123456789',
      sayingMotto: 'Test motto for testing',
      dreamJob: 'Software Developer',
      bio: 'This is a test profile for testing the approval workflow'
    };
    
    const result = await db.collection('College_yearbook').insertOne(testProfile);
    const profileId = result.insertedId.toString();
    
    console.log(`✅ Created test profile with ID: ${profileId}`);
    console.log(`📝 Profile name: ${testProfile.fullName}`);
    console.log(`📧 Email: ${testProfile.email}`);
    console.log(`🎓 Course: ${testProfile.courseProgram}`);
    console.log(`📊 Status: ${testProfile.status}`);
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Go to your admin dashboard');
    console.log('2. Navigate to the profile approval section');
    console.log('3. You should see "Test Student Profile" in the pending list');
    console.log('4. Approve the profile');
    console.log('5. Check the audit logs section - you should see a new audit log entry');
    
    console.log('\n📋 Profile Details for Reference:');
    console.log(`   Profile ID: ${profileId}`);
    console.log(`   School Year ID: ${activeSchoolYear._id}`);
    console.log(`   Collection: College_yearbook`);
    
  } catch (error) {
    console.error('❌ Error creating test profile:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
createTestProfile().catch(console.error);
