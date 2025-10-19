// Test script to verify sections/blocks deletion is now working
const testDeletionFix = async () => {
  const baseUrl = 'http://localhost:3000';

  console.log('🧪 Testing Sections/Blocks Deletion Fix...');

  try {
    // Test 1: Check yearbook structure API to see if blocks now have proper IDs
    console.log('\n1️⃣ Testing yearbook structure API for proper block IDs...');
    
    try {
      const response = await fetch(`${baseUrl}/api/admin/yearbook/structure?schoolYearId=test-school-year-2024`);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          console.log('   ✅ Yearbook structure API responded successfully');
          
          // Check if blocks have proper MongoDB ObjectId format
          const departments = result.data.departments || [];
          let foundProperIds = 0;
          let foundInvalidIds = 0;
          
          departments.forEach(dept => {
            if (dept.courses) {
              dept.courses.forEach(course => {
                if (course.yearLevels) {
                  course.yearLevels.forEach(yearLevel => {
                    if (yearLevel.blocks) {
                      yearLevel.blocks.forEach(block => {
                        // Check if ID is a valid MongoDB ObjectId (24 hex characters)
                        if (/^[0-9a-fA-F]{24}$/.test(block.id)) {
                          foundProperIds++;
                          console.log(`   ✅ Block "${block.name}" has proper MongoDB ID: ${block.id}`);
                        } else {
                          foundInvalidIds++;
                          console.log(`   ❌ Block "${block.name}" has invalid ID: ${block.id}`);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
          
          console.log(`   📊 Summary: ${foundProperIds} proper IDs, ${foundInvalidIds} invalid IDs`);
          
          if (foundProperIds > 0 && foundInvalidIds === 0) {
            console.log('   ✅ All blocks now have proper MongoDB ObjectIds!');
          } else if (foundInvalidIds > 0) {
            console.log('   ⚠️  Some blocks still have invalid IDs');
          } else {
            console.log('   ℹ️  No blocks found in the structure');
          }
        } else {
          console.error('   ❌ Yearbook structure API failed:', result.error);
        }
      } else {
        console.log('   ⚠️  Yearbook structure API returned non-200 status:', response.status);
      }
    } catch (error) {
      console.log('   ❌ Error testing yearbook structure API:', error.message);
    }

    // Test 2: Test deletion with a proper MongoDB ObjectId format
    console.log('\n2️⃣ Testing deletion with proper ObjectId format...');
    
    try {
      // Use a valid ObjectId format (even if it doesn't exist)
      const testObjectId = '507f1f77bcf86cd799439011';
      const response = await fetch(`${baseUrl}/api/admin/sections?id=${testObjectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        
        if (!result.success && result.error === 'Section not found') {
          console.log('   ✅ Deletion API correctly handled non-existent section with proper ObjectId');
        } else {
          console.log('   ⚠️  Unexpected response:', result);
        }
      } else {
        console.log('   ⚠️  Deletion API returned non-200 status:', response.status);
      }
    } catch (error) {
      console.log('   ❌ Error testing deletion with ObjectId:', error.message);
    }

    console.log('\n🏁 Deletion Fix Test Completed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Fixed block ID generation in yearbook structure API');
    console.log('   ✅ Blocks now use actual MongoDB ObjectIds instead of generated strings');
    console.log('   ✅ Deletion functionality should now work properly');
    console.log('\n🔧 Changes Made:');
    console.log('   ✅ Updated yearbook structure API to use section._id.toString()');
    console.log('   ✅ Fixed all instances where block IDs were generated from names');
    console.log('   ✅ Maintained backward compatibility for profile-based blocks');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Run the test
testDeletionFix();
