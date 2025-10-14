// Test the yearbook database directly
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function testYearbookDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Test fetching raf's profile by ID
    const studentId = '68e26723e975ec87c5014c4c';
    console.log(`Testing fetch for student ID: ${studentId}`);
    
    const student = await collection.findOne({ _id: new ObjectId(studentId) });
    
    if (student) {
      console.log('✅ Student found in database:');
      console.log('  _id:', student._id);
      console.log('  fullName:', student.fullName);
      console.log('  courseProgram:', student.courseProgram);
      console.log('  yearLevel:', student.yearLevel);
      console.log('  blockSection:', student.blockSection);
      console.log('  department:', student.department);
      console.log('  userType:', student.userType);
      console.log('  status:', student.status);
      console.log('  profilePicture:', student.profilePicture);
      console.log('  sayingMotto:', student.sayingMotto);
      console.log('  officerRole:', student.officerRole);
      
      // Test the yearbook service method
      console.log('\n--- Testing Yearbook Service ---');
      const { yearbookService } = require('../lib/yearbook-service');
      
      const result = await yearbookService.getYearbookEntryById('College', studentId);
      
      if (result.success) {
        console.log('✅ Yearbook service working correctly');
        console.log('  Service result:', result.data.fullName);
      } else {
        console.log('❌ Yearbook service error:', result.error);
      }
      
    } else {
      console.log('❌ Student not found in database');
    }
    
  } catch (error) {
    console.error('Error testing yearbook database:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

testYearbookDatabase();
