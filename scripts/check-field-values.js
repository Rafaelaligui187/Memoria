// Check actual field values in the database
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function checkActualFieldValues() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Get all students to see actual field values
    const students = await collection.find({ userType: 'student' }).toArray();
    
    console.log(`Found ${students.length} students. Checking field values:`);
    
    students.forEach((student, index) => {
      console.log(`\n${index + 1}. Student: ${student.fullName}`);
      console.log('  _id:', student._id);
      console.log('  userType:', student.userType);
      console.log('  department:', student.department);
      console.log('  schoolYear:', student.schoolYear);
      console.log('  status:', student.status);
      console.log('  yearLevel:', student.yearLevel);
      console.log('  courseProgram:', student.courseProgram);
      console.log('  blockSection:', student.blockSection);
      console.log('  officerRole:', student.officerRole);
      
      // Check if there are any other relevant fields
      const relevantFields = ['schoolYearId', 'academicYear', 'year', 'block', 'section'];
      relevantFields.forEach(field => {
        if (student[field] !== undefined) {
          console.log(`  ${field}:`, student[field]);
        }
      });
    });
    
    // Check what unique values exist for each field
    console.log('\n--- Unique Field Values ---');
    
    const fields = ['department', 'schoolYear', 'status', 'yearLevel', 'courseProgram', 'blockSection'];
    
    for (const field of fields) {
      const uniqueValues = await collection.distinct(field, { userType: 'student' });
      console.log(`\n${field}:`, uniqueValues);
    }
    
  } catch (error) {
    console.error('Error checking field values:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

checkActualFieldValues();
