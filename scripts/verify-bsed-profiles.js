// Verify BSED student profiles and major field in database
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function verifyBSEDProfiles() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Find all BSED students
    console.log('Searching for BSED student profiles...');
    const bsedStudents = await collection.find({ courseProgram: "BSED" }).toArray();
    
    console.log(`Found ${bsedStudents.length} BSED students:`);
    
    bsedStudents.forEach((student, index) => {
      console.log(`\n${index + 1}. Student Profile:`);
      console.log('  _id:', student._id);
      console.log('  fullName:', student.fullName);
      console.log('  courseProgram:', student.courseProgram);
      console.log('  major:', student.major);
      console.log('  department:', student.department);
      console.log('  yearLevel:', student.yearLevel);
      console.log('  blockSection:', student.blockSection);
      
      if (student.major) {
        console.log('  ✅ Major field is present and has a value');
      } else {
        console.log('  ⚠️ Major field is missing or empty');
      }
    });
    
    // Summary
    const studentsWithMajor = bsedStudents.filter(s => s.major);
    console.log(`\n--- Summary ---`);
    console.log(`Total BSED students: ${bsedStudents.length}`);
    console.log(`Students with major field: ${studentsWithMajor.length}`);
    console.log(`Students missing major field: ${bsedStudents.length - studentsWithMajor.length}`);
    
  } catch (error) {
    console.error('Error verifying BSED profiles:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

verifyBSEDProfiles();
