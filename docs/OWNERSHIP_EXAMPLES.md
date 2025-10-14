# Profile Ownership Examples

## 🎯 **What's New: `ownedBy` Field**

Every yearbook profile now includes an `ownedBy` field that identifies who created the profile. This makes it easy to:

- Track who submitted each profile
- Filter profiles by owner
- Manage profile permissions
- Transfer ownership if needed

## 📊 **Database Schema Update**

```typescript
{
  _id: ObjectId,
  schoolYearId: "2024-2025",
  userType: "student",
  ownedBy: "john@example.com", // 👈 NEW: Owner identification
  status: "pending",
  fullName: "John Doe",
  email: "john@example.com",
  // ... all other profile fields
}
```

## 🔍 **API Usage Examples**

### **1. Get All Profiles by Owner**
```javascript
// Get all profiles owned by john@example.com
const response = await fetch('/api/profiles?ownedBy=john@example.com')
const data = await response.json()
console.log('User profiles:', data.profiles)
```

### **2. Get Profiles by Owner and School Year**
```javascript
// Get profiles for specific school year and owner
const response = await fetch('/api/profiles?schoolYearId=2024-2025&ownedBy=john@example.com')
const data = await response.json()
console.log('User profiles for 2024-2025:', data.profiles)
```

### **3. Get All Pending Profiles by Owner**
```javascript
// Get pending profiles for a specific owner
const response = await fetch('/api/profiles?ownedBy=john@example.com&status=pending')
const data = await response.json()
console.log('Pending user profiles:', data.profiles)
```

## 🛠️ **Utility Functions Usage**

### **Get User's Profiles**
```typescript
import { getProfilesByOwner } from '@/lib/profile-utils'

// Get all profiles for a user
const userProfiles = await getProfilesByOwner('john@example.com')
console.log('User owns:', userProfiles.length, 'profiles')

// Get profiles for specific school year
const schoolYearProfiles = await getProfilesByOwner('john@example.com', '2024-2025')
```

### **Check Profile Ownership**
```typescript
import { isProfileOwner } from '@/lib/profile-utils'

// Check if user owns a specific profile
const ownsProfile = await isProfileOwner('profileId123', 'john@example.com')
if (ownsProfile) {
  console.log('User owns this profile')
} else {
  console.log('User does not own this profile')
}
```

### **Get Ownership Information**
```typescript
import { getProfileOwnership } from '@/lib/profile-utils'

// Get ownership details for a profile
const ownership = await getProfileOwnership('profileId123')
if (ownership) {
  console.log('Profile owner:', ownership.ownedBy)
  console.log('School year:', ownership.schoolYearId)
  console.log('Status:', ownership.status)
}
```

### **Transfer Ownership (Admin Only)**
```typescript
import { updateProfileOwnership } from '@/lib/profile-utils'

// Transfer profile to new owner (admin function)
const transferred = await updateProfileOwnership('profileId123', 'newowner@example.com')
if (transferred) {
  console.log('Ownership transferred successfully')
}
```

## 🎯 **Real-World Use Cases**

### **1. User Dashboard**
```typescript
// Show user their own profiles
const userEmail = 'john@example.com'
const userProfiles = await getProfilesByOwner(userEmail)
// Display: "You have 3 profiles: 2 approved, 1 pending"
```

### **2. Profile Management**
```typescript
// Check if user can edit a profile
const canEdit = await isProfileOwner(profileId, currentUserEmail)
if (canEdit) {
  // Allow editing
} else {
  // Show "You don't own this profile"
}
```

### **3. Admin Panel**
```typescript
// Get all profiles for admin review
const allProfiles = await fetch('/api/profiles?status=pending')
// Show: "15 profiles pending approval"
// Group by owner: "john@example.com: 3 profiles"
```

### **4. Profile Transfer**
```typescript
// Admin transfers profile to correct owner
await updateProfileOwnership('profileId123', 'correctowner@example.com')
// Profile now belongs to correct owner
```

## 📋 **What You'll See in MongoDB**

After creating a profile, you'll see:
```json
{
  "_id": "68de0ce67b7b23a3818cd4f4",
  "schoolYearId": "2024-2025",
  "userType": "student",
  "ownedBy": "john@example.com",
  "status": "pending",
  "fullName": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 🎉 **Benefits of Ownership System**

- ✅ **Clear Attribution** - Know who created each profile
- ✅ **Permission Control** - Users can only edit their own profiles
- ✅ **Admin Management** - Easy to manage and transfer profiles
- ✅ **Data Organization** - Filter and group profiles by owner
- ✅ **Audit Trail** - Track profile creation and ownership changes

Your yearbook system now has complete ownership management! 🚀
