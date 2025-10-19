// Test script to test the Delete All notifications functionality
const testDeleteAllNotifications = async () => {
  try {
    console.log('🧪 Testing Delete All Notifications functionality...');
    console.log('');
    
    // Step 1: Create some test notifications first
    console.log('1️⃣ Creating test notifications...');
    const testNotifications = [
      {
        type: 'info',
        title: 'Test Notification 1',
        message: 'This is the first test notification',
        priority: 'medium',
        category: 'system'
      },
      {
        type: 'success',
        title: 'Test Notification 2',
        message: 'This is the second test notification',
        priority: 'high',
        category: 'profile'
      },
      {
        type: 'warning',
        title: 'Test Notification 3',
        message: 'This is the third test notification',
        priority: 'urgent',
        category: 'moderation'
      }
    ];

    for (let i = 0; i < testNotifications.length; i++) {
      const response = await fetch('http://localhost:3000/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testNotifications[i])
      });
      
      const result = await response.json();
      if (result.success) {
        console.log(`   ✅ Created notification ${i + 1}: ${testNotifications[i].title}`);
      } else {
        console.log(`   ❌ Failed to create notification ${i + 1}: ${result.error}`);
      }
    }

    console.log('');
    
    // Step 2: Fetch notifications to verify they exist
    console.log('2️⃣ Fetching notifications to verify they exist...');
    const fetchResponse = await fetch('http://localhost:3000/api/admin/notifications');
    const fetchResult = await fetchResponse.json();
    
    if (fetchResult.success) {
      console.log(`   ✅ Found ${fetchResult.data.length} notifications`);
      console.log(`   📊 Unread count: ${fetchResult.unreadCount}`);
      console.log(`   📊 Urgent count: ${fetchResult.urgentCount}`);
      
      if (fetchResult.data.length === 0) {
        console.log('   ⚠️  No notifications found. Creating more...');
        return;
      }
    } else {
      console.log('   ❌ Failed to fetch notifications:', fetchResult.error);
      return;
    }

    console.log('');
    
    // Step 3: Test the Delete All functionality
    console.log('3️⃣ Testing Delete All functionality...');
    const deleteAllResponse = await fetch('http://localhost:3000/api/admin/notifications', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'delete_all' })
    });
    
    const deleteAllResult = await deleteAllResponse.json();
    
    if (deleteAllResult.success) {
      console.log(`   ✅ Delete All successful!`);
      console.log(`   🗑️  Deleted ${deleteAllResult.deletedCount} notifications`);
    } else {
      console.log('   ❌ Delete All failed:', deleteAllResult.error);
      return;
    }

    console.log('');
    
    // Step 4: Verify all notifications are deleted
    console.log('4️⃣ Verifying all notifications are deleted...');
    const verifyResponse = await fetch('http://localhost:3000/api/admin/notifications');
    const verifyResult = await verifyResponse.json();
    
    if (verifyResult.success) {
      console.log(`   ✅ Verification complete!`);
      console.log(`   📊 Remaining notifications: ${verifyResult.data.length}`);
      console.log(`   📊 Unread count: ${verifyResult.unreadCount}`);
      console.log(`   📊 Urgent count: ${verifyResult.urgentCount}`);
      
      if (verifyResult.data.length === 0) {
        console.log('   🎉 SUCCESS: All notifications deleted successfully!');
      } else {
        console.log('   ⚠️  Some notifications still remain');
      }
    } else {
      console.log('   ❌ Failed to verify deletion:', verifyResult.error);
    }

    console.log('');
    console.log('🏁 Test completed!');
    
  } catch (error) {
    console.error('❌ Error testing Delete All functionality:', error);
  }
};

// Run the test
testDeleteAllNotifications();
