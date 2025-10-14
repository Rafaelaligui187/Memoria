// Test script to verify admin approval system displays major field
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function testAdminApprovalMajorDisplay() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Find Brian Juntong's profile
    const brianProfile = await collection.findOne({ fullName: "Brian Juntong" });
    
    if (brianProfile) {
      console.log('Brian Juntong profile found:');
      console.log('  _id:', brianProfile._id);
      console.log('  fullName:', brianProfile.fullName);
      console.log('  courseProgram:', brianProfile.courseProgram);
      console.log('  major:', brianProfile.major);
      console.log('  department:', brianProfile.department);
      console.log('  yearLevel:', brianProfile.yearLevel);
      console.log('  blockSection:', brianProfile.blockSection);
      
      // Simulate what the admin approval system should display
      console.log('\n--- Admin Approval System Display ---');
      console.log('Department:', brianProfile.department);
      console.log('Year Level:', brianProfile.yearLevel);
      console.log('Course/Program:', brianProfile.courseProgram);
      
      if (brianProfile.courseProgram === "BSED" && brianProfile.major) {
        console.log('Major: Major in:', brianProfile.major);
        console.log('✅ Major field should now be displayed in admin approval system!');
      } else {
        console.log('❌ Major field will not be displayed');
      }
      
      console.log('Block/Section:', brianProfile.blockSection);
      
    } else {
      console.log('❌ Brian Juntong profile not found');
    }
    
    // Check all BSED students
    const bsedStudents = await collection.find({ courseProgram: "BSED" }).toArray();
    console.log(`\nTotal BSED students: ${bsedStudents.length}`);
    
    bsedStudents.forEach(student => {
      console.log(`- ${student.fullName}: Major = ${student.major || 'NOT SET'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

testAdminApprovalMajorDisplay();
