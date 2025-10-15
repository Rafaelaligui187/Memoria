// Simple database collection setup for notifications
// This creates the notifications collection structure

const notificationsCollection = {
  name: 'notifications',
  indexes: [
    { read: 1 },
    { priority: 1 },
    { category: 1 },
    { timestamp: -1 },
    { read: 1, priority: 1 },
    { userId: 1, read: 1 },
    { schoolYearId: 1, timestamp: -1 },
    { id: 1 }
  ],
  sampleData: {
    id: 'notif_welcome_sample',
    type: 'info',
    title: 'Welcome to Memoria Admin',
    message: 'Your notification system is now active! You will receive notifications for profile submissions, album likes, and user reports.',
    timestamp: new Date(),
    read: false,
    priority: 'medium',
    category: 'system',
    actionUrl: '/admin',
    actionLabel: 'Go to Admin Dashboard',
    metadata: { isWelcome: true }
  }
};

console.log('✅ Notifications collection structure created');
console.log('📊 Collection:', notificationsCollection.name);
console.log('📊 Indexes:', notificationsCollection.indexes.length);
console.log('📊 Sample notification:', notificationsCollection.sampleData.title);

module.exports = notificationsCollection;

