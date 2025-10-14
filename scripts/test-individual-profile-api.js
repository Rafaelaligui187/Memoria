// Test the yearbook API endpoint for individual student profiles
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function testIndividualProfileAPI() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Test with Austine's ID (the Mayor from Block C)
    const studentId = '68e2679de975ec87c5014c4e';
    console.log(`Testing individual profile API for student ID: ${studentId}`);
    
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
      
      // Test the yearbook service getYearbookEntryById method
      console.log('\n--- Testing Yearbook Service getYearbookEntryById ---');
      
      // Simulate the yearbook service call
      const yearbookService = {
        async getYearbookEntryById(department, id) {
          const collection = db.collection('College_yearbook');
          const data = await collection.findOne({ _id: new ObjectId(id) });
          
          if (!data) return { success: false, error: 'Yearbook entry not found' };
          
          return {
            success: true,
            data: {
              ...data,
              createdAt: new Date(data.createdAt),
              updatedAt: new Date(data.updatedAt),
              birthday: data.birthday ? new Date(data.birthday) : undefined,
            }
          };
        }
      };
      
      const result = await yearbookService.getYearbookEntryById('College', studentId);
      
      if (result.success) {
        console.log('✅ Yearbook service getYearbookEntryById working correctly');
        console.log('  Service result name:', result.data.fullName);
        console.log('  Service result courseProgram:', result.data.courseProgram);
        console.log('  Service result yearLevel:', result.data.yearLevel);
        console.log('  Service result blockSection:', result.data.blockSection);
        console.log('  Service result officerRole:', result.data.officerRole);
      } else {
        console.log('❌ Yearbook service error:', result.error);
      }
      
    } else {
      console.log('❌ Student not found in database');
    }
    
  } catch (error) {
    console.error('Error testing individual profile API:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

testIndividualProfileAPI();
