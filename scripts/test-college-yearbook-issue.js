// Test script to debug the college yearbook courseId issue
const testCollegeYearbookIssue = async () => {
  const baseUrl = 'http://localhost:3003'; // Using the port from terminal

  console.log('🧪 Testing College Yearbook CourseId Issue...');

  try {
    // Test 1: Check what courses are available
    console.log('\n1️⃣ Testing courses API...');
    
    try {
      const response = await fetch(`${baseUrl}/api/admin/courses?department=college&schoolYearId=test-school-year-2024`);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          console.log('   ✅ Courses API responded successfully');
          console.log('   📊 Available courses:', result.data.map(c => ({ _id: c._id, name: c.name, schoolYearId: c.schoolYearId })));
          
          if (result.data.length === 0) {
            console.log('   ⚠️  No courses found for schoolYearId: test-school-year-2024');
            console.log('   💡 This might be why the yearbook page is failing');
          } else {
            console.log('   ✅ Found courses, testing yearbook page access...');
            
            // Test 2: Try to access yearbook page with first course
            const firstCourse = result.data[0];
            console.log(`\n2️⃣ Testing yearbook page with course: ${firstCourse.name} (${firstCourse._id})`);
            
            const yearbookUrl = `${baseUrl}/school-years-college/test-school-year-2024/departments/college/${firstCourse._id}/1st-year/block-a/yearbook`;
            console.log('   🔗 Yearbook URL:', yearbookUrl);
            
            try {
              const yearbookResponse = await fetch(yearbookUrl);
              console.log('   📡 Yearbook page response status:', yearbookResponse.status);
              
              if (yearbookResponse.ok) {
                console.log('   ✅ Yearbook page loaded successfully');
              } else {
                console.log('   ❌ Yearbook page failed to load');
                const text = await yearbookResponse.text();
                console.log('   📄 Response text (first 200 chars):', text.substring(0, 200));
              }
            } catch (error) {
              console.log('   ❌ Error accessing yearbook page:', error.message);
            }
          }
        } else {
          console.error('   ❌ Courses API failed:', result.error);
        }
      } else {
        console.log('   ⚠️  Courses API returned non-200 status:', response.status);
        const text = await response.text();
        console.log('   📄 Response text (first 200 chars):', text.substring(0, 200));
      }
    } catch (error) {
      console.log('   ❌ Error testing courses API:', error.message);
    }

    // Test 3: Check if we can create a test course
    console.log('\n3️⃣ Testing course creation...');
    
    try {
      const testCourse = {
        name: 'Bachelor of Science in Computer Science',
        fullName: 'Bachelor of Science in Computer Science',
        majorType: 'no-major',
        description: 'A comprehensive computer science program',
        tagline: 'Build the future with code',
        department: 'college',
        schoolYearId: 'test-school-year-2024',
        schoolYear: '2024-2025',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const createResponse = await fetch(`${baseUrl}/api/admin/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCourse)
      });

      if (createResponse.ok) {
        const createResult = await createResponse.json();
        if (createResult.success) {
          console.log('   ✅ Test course created successfully:', createResult.data._id);
          
          // Now test the yearbook page with this course
          const yearbookUrl = `${baseUrl}/school-years-college/test-school-year-2024/departments/college/${createResult.data._id}/1st-year/block-a/yearbook`;
          console.log('   🔗 Testing yearbook with created course:', yearbookUrl);
          
          try {
            const yearbookResponse = await fetch(yearbookUrl);
            console.log('   📡 Yearbook response status:', yearbookResponse.status);
            
            if (yearbookResponse.ok) {
              console.log('   ✅ Yearbook page works with created course!');
            } else {
              console.log('   ❌ Yearbook page still fails');
            }
          } catch (error) {
            console.log('   ❌ Error testing yearbook with created course:', error.message);
          }
        } else {
          console.error('   ❌ Failed to create test course:', createResult.error);
        }
      } else {
        console.log('   ⚠️  Course creation returned non-200 status:', createResponse.status);
      }
    } catch (error) {
      console.log('   ❌ Error testing course creation:', error.message);
    }

    console.log('\n🏁 College Yearbook CourseId Test Completed!');
    console.log('\n📋 Possible Issues:');
    console.log('   🔍 No courses exist for the school year');
    console.log('   🔍 Course ID in URL is malformed');
    console.log('   🔍 School year ID is incorrect');
    console.log('   🔍 Database connection issues');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Run the test
testCollegeYearbookIssue();
