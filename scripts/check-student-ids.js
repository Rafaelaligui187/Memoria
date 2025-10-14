// Check student IDs in database vs static data
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function checkStudentIds() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Get all students from database
    console.log('Fetching all students from College_yearbook collection...');
    const students = await collection.find({ userType: 'student' }).toArray();
    
    console.log(`Found ${students.length} students in database:`);
    
    students.forEach((student, index) => {
      console.log(`\n${index + 1}. Student:`);
      console.log('  _id:', student._id);
      console.log('  fullName:', student.fullName);
      console.log('  courseProgram:', student.courseProgram);
      console.log('  yearLevel:', student.yearLevel);
      console.log('  blockSection:', student.blockSection);
      console.log('  schoolYear:', student.schoolYear);
    });
    
    // Check for specific static data IDs
    const staticIds = ['s101', 's102', 's103', 's104', 's105', 's106', 's107', 's108', 's109', 's110'];
    console.log('\n--- Checking Static Data IDs ---');
    
    for (const staticId of staticIds) {
      const found = students.find(s => s._id?.toString() === staticId);
      if (found) {
        console.log(`✅ Found static ID "${staticId}": ${found.fullName}`);
      } else {
        console.log(`❌ Static ID "${staticId}" not found in database`);
      }
    }
    
    // Check for BSIT students specifically
    console.log('\n--- BSIT Students ---');
    const bsitStudents = students.filter(s => s.courseProgram?.includes('BSIT') || s.courseProgram?.includes('Information Technology'));
    console.log(`Found ${bsitStudents.length} BSIT students:`);
    
    bsitStudents.forEach((student, index) => {
      console.log(`\n${index + 1}. BSIT Student:`);
      console.log('  _id:', student._id);
      console.log('  fullName:', student.fullName);
      console.log('  yearLevel:', student.yearLevel);
      console.log('  blockSection:', student.blockSection);
    });
    
  } catch (error) {
    console.error('Error checking student IDs:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

checkStudentIds();
