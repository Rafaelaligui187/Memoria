// Test script to create a notification
const testNotification = async () => {
  try {
    console.log('🧪 Testing notification creation...');
    
    const response = await fetch('http://localhost:3000/api/admin/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test notification to verify the database is working!',
        priority: 'medium',
        category: 'system',
        actionUrl: '/admin',
        actionLabel: 'View Admin',
        metadata: {
          test: true,
          timestamp: new Date().toISOString()
        }
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Test notification created successfully!');
      console.log('📝 Notification ID:', result.data.id);
      
      // Now test fetching notifications
      const fetchResponse = await fetch('http://localhost:3000/api/admin/notifications');
      const fetchResult = await fetchResponse.json();
      
      if (fetchResult.success) {
        console.log('✅ Notifications fetched successfully!');
        console.log('📊 Total notifications:', fetchResult.data.length);
        console.log('📊 Unread count:', fetchResult.unreadCount);
        console.log('📊 Urgent count:', fetchResult.urgentCount);
      } else {
        console.log('❌ Failed to fetch notifications:', fetchResult.error);
      }
    } else {
      console.log('❌ Failed to create test notification:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing notification system:', error);
  }
};

// Run the test
testNotification();
