// Simple test script to verify sections/blocks deletion API endpoints
const testDeletionAPI = async () => {
  const baseUrl = 'http://localhost:3000'; // Try default port first

  console.log('🧪 Testing Sections/Blocks Deletion API...');

  try {
    // Test 1: Check if sections API is accessible
    console.log('\n1️⃣ Testing sections API accessibility...');
    
    try {
      const response = await fetch(`${baseUrl}/api/admin/sections?schoolYearId=test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('   📡 Response status:', response.status);
      console.log('   📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const result = await response.json();
        console.log('   ✅ Sections API is accessible');
        console.log('   📊 Response:', result);
      } else {
        console.log('   ⚠️  Sections API returned non-200 status:', response.status);
        const text = await response.text();
        console.log('   📄 Response text:', text.substring(0, 200));
      }
    } catch (error) {
      console.log('   ❌ Error accessing sections API:', error.message);
    }

    // Test 2: Test deletion with invalid ID
    console.log('\n2️⃣ Testing deletion with invalid ID...');
    
    try {
      const response = await fetch(`${baseUrl}/api/admin/sections?id=invalid-id`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('   📡 Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('   📊 Response:', result);
        
        if (!result.success) {
          console.log('   ✅ Correctly handled invalid ID');
        } else {
          console.log('   ❌ Unexpected success for invalid ID');
        }
      } else {
        console.log('   ⚠️  Deletion API returned non-200 status:', response.status);
        const text = await response.text();
        console.log('   📄 Response text:', text.substring(0, 200));
      }
    } catch (error) {
      console.log('   ❌ Error testing deletion:', error.message);
    }

    // Test 3: Test deletion without ID parameter
    console.log('\n3️⃣ Testing deletion without ID parameter...');
    
    try {
      const response = await fetch(`${baseUrl}/api/admin/sections`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('   📡 Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('   📊 Response:', result);
        
        if (!result.success && result.error === 'Section ID is required') {
          console.log('   ✅ Correctly handled missing ID parameter');
        } else {
          console.log('   ❌ Unexpected response for missing ID');
        }
      } else {
        console.log('   ⚠️  Deletion API returned non-200 status:', response.status);
        const text = await response.text();
        console.log('   📄 Response text:', text.substring(0, 200));
      }
    } catch (error) {
      console.log('   ❌ Error testing deletion without ID:', error.message);
    }

    console.log('\n🏁 API Deletion Test Completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Run the test
testDeletionAPI();
