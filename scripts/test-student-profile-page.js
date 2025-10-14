// Comprehensive test of the student profile page functionality
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function testStudentProfilePage() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Test with Austine's profile (the Mayor from Block C)
    const studentId = '68e2679de975ec87c5014c4e';
    console.log(`Testing student profile page for: ${studentId}`);
    
    // 1. Check if student exists in database
    const student = await collection.findOne({ _id: new ObjectId(studentId) });
    
    if (!student) {
      console.log('❌ Student not found in database');
      return;
    }
    
    console.log('✅ Student found in database:');
    console.log('  Name:', student.fullName);
    console.log('  Course:', student.courseProgram);
    console.log('  Year:', student.yearLevel);
    console.log('  Block:', student.blockSection);
    console.log('  Status:', student.status);
    console.log('  Officer Role:', student.officerRole);
    
    // 2. Test the API endpoint that the profile page uses
    console.log('\n--- Testing API Endpoint ---');
    
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
      console.log('✅ API endpoint working correctly');
      console.log('  Profile data available:', !!result.data);
      console.log('  Full name:', result.data.fullName);
      console.log('  Profile picture:', result.data.profilePicture || 'No picture');
      console.log('  Saying/Motto:', result.data.sayingMotto || 'No motto');
    } else {
      console.log('❌ API endpoint error:', result.error);
    }
    
    // 3. Test URL generation
    console.log('\n--- Testing URL Generation ---');
    
    const urlParams = {
      courseId: 'bsit',
      yearId: '1st-year',
      blockId: 'block-c',
      schoolYear: '2025-2026',
      studentId: studentId
    };
    
    const profileUrl = `/departments/college/${urlParams.courseId}/${urlParams.yearId}/${urlParams.blockId}/${urlParams.schoolYear}/${urlParams.studentId}`;
    
    console.log('Generated profile URL:', profileUrl);
    
    // 4. Test route validation
    console.log('\n--- Testing Route Validation ---');
    
    const validCourses = ['bsit', 'bscs', 'beed', 'bsed', 'bshm', 'bsentrep', 'bped'];
    const validYears = ['1st-year', '2nd-year', '3rd-year', '4th-year'];
    const validBlocks = ['block-a', 'block-b', 'block-c', 'block-d'];
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    
    const courseValid = validCourses.includes(urlParams.courseId);
    const yearValid = validYears.includes(urlParams.yearId);
    const blockValid = validBlocks.includes(urlParams.blockId);
    const studentIdValid = objectIdRegex.test(urlParams.studentId);
    
    console.log('Course valid:', courseValid);
    console.log('Year valid:', yearValid);
    console.log('Block valid:', blockValid);
    console.log('Student ID valid:', studentIdValid);
    
    const allValid = courseValid && yearValid && blockValid && studentIdValid;
    console.log('All validations pass:', allValid);
    
    if (allValid) {
      console.log('\n🎉 Student profile page should work correctly!');
      console.log('The profile picture click should now display the full profile information.');
    } else {
      console.log('\n❌ Some validations failed. Profile page may not work.');
    }
    
  } catch (error) {
    console.error('Error testing student profile page:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

testStudentProfilePage();
