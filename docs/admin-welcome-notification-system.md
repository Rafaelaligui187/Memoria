# Admin Welcome Notification System

## Overview

This implementation ensures that the "Welcome to Memoria Admin" notification appears only after admin login and behaves according to the following rules:

1. **Appears after login**: The welcome notification is created only when an admin logs in
2. **Persists until deleted**: Once created, the notification remains visible until the admin explicitly deletes it
3. **Doesn't reappear on refresh**: After deletion, refreshing the page won't bring the notification back
4. **Reappears after logout/login**: The notification will only reappear after the admin logs out and logs back in

## Implementation Details

### 1. Admin Session Tracking (`lib/admin-session-tracker.ts`)

The `AdminSessionTracker` class manages admin login/logout sessions and tracks welcome notification state:

- **`trackAdminLogin(adminEmail)`**: Records when an admin logs in
- **`trackAdminLogout(adminEmail)`**: Records when an admin logs out
- **`shouldShowWelcomeNotification(adminEmail)`**: Determines if welcome notification should be shown
- **`markWelcomeNotificationShown(adminEmail)`**: Marks notification as shown for current session
- **`markWelcomeNotificationDeleted(adminEmail)`**: Marks notification as deleted for current session

### 2. API Endpoints

#### Login/Logout Tracking
- **`POST /api/admin/track-login`**: Tracks admin login events
- **`POST /api/admin/track-logout`**: Tracks admin logout events

#### Notification Management
- **`GET /api/admin/notifications`**: Enhanced to check session state and create welcome notifications
- **`PATCH /api/admin/notifications`**: Enhanced to track welcome notification deletion

### 3. Authentication Integration

The `AuthContext` has been updated to:
- Track admin login sessions when `loginAdmin()` is called
- Track admin logout sessions when `logout()` is called
- Pass admin email to notification fetching

### 4. Notification Center Integration

The `NotificationCenter` component now:
- Passes admin email when fetching notifications
- Ensures welcome notifications are created based on session state

## Database Schema

### Admin Sessions Collection (`admin_sessions`)

```javascript
{
  id: string,                    // Unique session ID
  adminEmail: string,            // Admin email address
  loginTime: Date,               // When admin logged in
  logoutTime?: Date,             // When admin logged out (if applicable)
  sessionId: string,             // Unique session identifier
  isActive: boolean,             // Whether session is currently active
  welcomeNotificationShown: boolean,    // Whether welcome notification was shown
  welcomeNotificationDeleted: boolean    // Whether welcome notification was deleted
}
```

### Notifications Collection (`notifications`)

Welcome notifications now include:
```javascript
{
  // ... standard notification fields
  metadata: {
    isWelcome: true,
    adminEmail: string           // Admin email for session tracking
  }
}
```

## Flow Diagram

```
Admin Login
    ↓
Track Login Session
    ↓
Check if Welcome Notification Should Show
    ↓
Create Welcome Notification (if needed)
    ↓
Mark Notification as Shown
    ↓
Admin Sees Welcome Notification
    ↓
Admin Deletes Notification
    ↓
Mark Notification as Deleted
    ↓
Refresh Page → No Welcome Notification
    ↓
Admin Logout
    ↓
Track Logout Session
    ↓
Admin Login Again
    ↓
New Session → Welcome Notification Reappears
```

## Testing the Implementation

To test the complete flow:

1. **Login as admin** → Welcome notification should appear
2. **Delete the welcome notification** → Notification disappears
3. **Refresh the page** → Welcome notification should NOT reappear
4. **Logout** → Session is tracked as ended
5. **Login again** → Welcome notification should reappear (new session)

## Key Features

- **Session-based**: Each admin login creates a new session
- **Persistent**: Notifications persist until explicitly deleted
- **Non-intrusive**: Doesn't interfere with other notification types
- **Scalable**: Supports multiple admin users independently
- **Reliable**: Uses database transactions for consistency

## Error Handling

- Session tracking failures don't prevent login/logout
- Notification creation failures are logged but don't break the flow
- Database connection issues are handled gracefully
- Missing admin email is handled with fallback behavior

## Future Enhancements

- Add notification preferences per admin
- Implement notification expiration dates
- Add notification categories and filtering
- Support for notification templates
- Real-time notification updates via WebSocket
