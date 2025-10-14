// Test API endpoint for student profile using built-in fetch
async function testStudentProfileAPI() {
  try {
    console.log('Testing student profile API...');
    
    // Test with raf's ID
    const studentId = '68e26723e975ec87c5014c4c';
    const url = `http://localhost:3000/api/yearbook/${studentId}?department=College`;
    
    console.log('URL:', url);
    
    const response = await fetch(url);
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('✅ API is working correctly');
      console.log('Student name:', result.data.fullName);
      console.log('Course program:', result.data.courseProgram);
      console.log('Year level:', result.data.yearLevel);
      console.log('Block section:', result.data.blockSection);
    } else {
      console.log('❌ API returned error:', result.error);
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
  }
}

testStudentProfileAPI();