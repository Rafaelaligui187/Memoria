// Test yearbook API with corrected school year format
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function testCorrectedYearbookAPI() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Test with corrected school year format (en-dash instead of hyphen)
    const testParams = {
      department: 'College',
      schoolYearId: '2025–2026', // Using en-dash to match database
      status: 'approved',
      yearLevel: '1st Year',
      courseProgram: 'BS Information Technology',
      blockSection: 'IT-C' // Block C
    };
    
    console.log('Testing with corrected parameters:', testParams);
    
    // Build the query
    const query = {
      userType: 'student',
      department: testParams.department,
      schoolYear: testParams.schoolYearId, // This should now match
      status: testParams.status,
      yearLevel: testParams.yearLevel,
      courseProgram: testParams.courseProgram,
      blockSection: testParams.blockSection
    };
    
    console.log('MongoDB query:', JSON.stringify(query, null, 2));
    
    const students = await collection.find(query).toArray();
    
    console.log(`\nFound ${students.length} students matching the query:`);
    
    students.forEach((student, index) => {
      console.log(`\n${index + 1}. Student:`);
      console.log('  _id:', student._id);
      console.log('  fullName:', student.fullName);
      console.log('  courseProgram:', student.courseProgram);
      console.log('  yearLevel:', student.yearLevel);
      console.log('  blockSection:', student.blockSection);
      console.log('  schoolYear:', student.schoolYear);
      console.log('  status:', student.status);
      console.log('  officerRole:', student.officerRole);
    });
    
    // Test all block sections
    console.log('\n--- Testing All Block Sections ---');
    
    const blockSections = ['IT-A', 'IT-B', 'IT-C'];
    
    for (const blockSection of blockSections) {
      const blockQuery = { ...query, blockSection };
      const blockStudents = await collection.find(blockQuery).toArray();
      console.log(`\nBlock ${blockSection}: ${blockStudents.length} students`);
      
      blockStudents.forEach(student => {
        console.log(`  - ${student.fullName} (${student.officerRole || 'Regular Student'})`);
      });
    }
    
  } catch (error) {
    console.error('Error testing corrected yearbook API:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

testCorrectedYearbookAPI();
