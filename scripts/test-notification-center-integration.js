// Test script to verify the notification center is working properly
const testNotificationCenter = async () => {
  try {
    console.log('🧪 Testing Notification Center Integration...');
    console.log('');
    
    // Step 1: Create multiple test notifications
    console.log('1️⃣ Creating test notifications...');
    const testNotifications = [
      {
        type: 'info',
        title: 'Welcome Notification',
        message: 'This is a welcome notification for testing',
        priority: 'medium',
        category: 'system'
      },
      {
        type: 'success',
        title: 'Profile Approved',
        message: 'A student profile has been approved',
        priority: 'high',
        category: 'profile'
      },
      {
        type: 'warning',
        title: 'Urgent Action Required',
        message: 'Please review pending submissions',
        priority: 'urgent',
        category: 'moderation'
      },
      {
        type: 'error',
        title: 'System Error',
        message: 'There was an issue with the system',
        priority: 'high',
        category: 'system'
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
      
      console.log('   📋 Notification details:');
      fetchResult.data.forEach((notification, index) => {
        console.log(`      ${index + 1}. ${notification.title} (${notification.priority})`);
      });
      
      if (fetchResult.data.length === 0) {
        console.log('   ⚠️  No notifications found. The Delete All button will not appear.');
        return;
      }
    } else {
      console.log('   ❌ Failed to fetch notifications:', fetchResult.error);
      return;
    }

    console.log('');
    console.log('3️⃣ Instructions for testing the Delete All button:');
    console.log('   📱 Open your browser and go to: http://localhost:3000/admin');
    console.log('   🔐 Login as admin (admin@cctc.edu.ph / admin123)');
    console.log('   🔔 Look for the notification bell icon in the top-right of the sidebar');
    console.log('   🖱️  Click the bell icon to open the notification dropdown');
    console.log('   👀 You should see a "Delete All" button next to "Mark all read"');
    console.log('   🗑️  Click "Delete All" and confirm the action');
    console.log('   ✅ All notifications should be deleted');
    console.log('');
    console.log('4️⃣ If the button is not visible:');
    console.log('   🔍 Check browser console for any errors');
    console.log('   🔄 Try refreshing the page');
    console.log('   🧹 Clear browser cache');
    console.log('   📊 Verify notifications exist by running this script again');
    console.log('');
    console.log('🏁 Test setup complete!');
    
  } catch (error) {
    console.error('❌ Error setting up notification center test:', error);
  }
};

// Run the test
testNotificationCenter();
