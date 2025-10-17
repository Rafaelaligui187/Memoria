# Notification Badge System

## Overview
The notification system displays a prominent red badge with the number of unread notifications next to the notification bell in the user header.

## Visual Features

### 🔔 **Notification Bell Badge**
- **Red Badge**: Shows unread count with red background
- **Animated**: Bounces and pulses to draw attention
- **Positioned**: Top-right corner of the bell icon
- **Size**: 20px x 20px with white border
- **Text**: Shows exact count (1-99) or "99+" for larger numbers

### 🎨 **Visual Enhancements**
- **Bell Icon**: Changes from static bell to animated ringing bell when unread notifications exist
- **Badge Animation**: Combines bounce and pulse animations
- **Color**: Bright red (#ef4444) with white text and border
- **Shadow**: Drop shadow for depth and visibility

### 📱 **Notification Panel**
- **Header Badge**: Additional badge in panel header showing "X unread"
- **Unread Indicators**: Blue left border and pulsing dot for unread items
- **Background**: Light blue background for unread notifications
- **Test Button**: Built-in test button to create test notifications

## How It Works

### 1. **Badge Display Logic**
```typescript
{unreadCount > 0 && (
  <Badge 
    variant="destructive" 
    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold bg-red-500 text-white border-2 border-white shadow-lg animate-bounce"
    style={{
      animation: 'bounce 1s infinite, pulse 2s infinite'
    }}
  >
    {unreadCount > 99 ? '99+' : unreadCount}
  </Badge>
)}
```

### 2. **Real-time Updates**
- Fetches notifications every 30 seconds
- Updates badge count automatically
- Shows/hides badge based on unread count

### 3. **Notification Sources**
- **Gallery Albums**: When admin adds new albums
- **School Years**: When admin creates new academic years
- **Strands/Courses/Sections**: When admin adds new content
- **Profile Approvals**: When admin approves user profiles
- **Message Replies**: When admin replies to user messages

## Testing the Badge

### **Method 1: Test Button**
1. Click the notification bell
2. Click the "Test" button in the panel footer
3. Badge should appear with count "1"

### **Method 2: Admin Actions**
1. Admin creates a new gallery album
2. All users should see notification badge
3. Badge shows number of unread notifications

### **Method 3: Profile Approval**
1. User submits profile for approval
2. Admin approves the profile
3. Only that specific user sees the notification badge

## Badge States

| **State** | **Badge** | **Bell Icon** | **Animation** |
|-----------|-----------|---------------|---------------|
| No notifications | Hidden | Static bell | None |
| 1-99 unread | Red badge with count | Ringing bell | Bounce + Pulse |
| 100+ unread | Red badge with "99+" | Ringing bell | Bounce + Pulse |

## Accessibility
- High contrast red badge for visibility
- Clear numerical indicators
- Smooth animations that don't cause seizures
- Keyboard accessible dropdown panel

## Browser Support
- Modern browsers with CSS animations support
- Tailwind CSS classes for consistent styling
- Responsive design for mobile and desktop
