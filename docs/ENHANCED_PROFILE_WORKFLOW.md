# Enhanced Profile Workflow Documentation

## Overview

This document describes the enhanced profile submission and approval workflow that ensures data accuracy and prevents duplicates when users edit their previously approved forms.

## 🔄 **Enhanced Workflow Implementation**

### **1. Profile Status Management**

#### **Status Transitions:**
- **New Submission** → `pending`
- **Admin Approval** → `approved`
- **Admin Rejection** → `rejected`
- **User Edit (Approved)** → `pending` (new version created)
- **User Edit (Rejected)** → `pending` (same profile updated)
- **User Edit (Pending)** → `pending` (same profile updated)

#### **Key Behaviors:**
- ✅ **Approved profiles are locked** - Users cannot edit them directly
- ✅ **Rejected profiles become editable** - Users can fix issues and resubmit
- ✅ **Pending profiles can be updated** - Users can modify before approval
- ✅ **Status automatically changes to "Pending"** when editing approved profiles

### **2. Data Integrity & Duplicate Prevention**

#### **When User Edits Approved Profile:**
1. **New Pending Version Created** - System creates a new profile with `status: "pending"`
2. **Previous Profile Referenced** - New profile includes `previousProfileId` field
3. **Old Data Preserved** - Original approved profile remains until new one is approved
4. **Automatic Cleanup** - When new profile is approved, old data is completely deleted

#### **When User Edits Rejected Profile:**
1. **Same Profile Updated** - System updates the existing rejected profile
2. **Status Reset to Pending** - `status` changes from `rejected` to `pending`
3. **Rejection Data Cleared** - `rejectionReason`, `reviewedAt`, `reviewedBy` fields removed
4. **No Duplicates Created** - Single profile maintained throughout the process

#### **When User Edits Pending Profile:**
1. **Same Profile Updated** - System updates the existing pending profile
2. **Status Remains Pending** - No status change needed
3. **Data Overwritten** - New data replaces old data in the same document

### **3. Admin Approval Process**

#### **Approval Actions:**
1. **Profile Approval** - Admin approves pending profile
2. **Status Update** - Profile status changes to `approved`
3. **Previous Data Cleanup** - If `previousProfileId` exists, old approved profile is deleted
4. **Duplicate Cleanup** - Any other pending/rejected profiles for same user/year are deleted
5. **Data Accuracy Maintained** - Only one approved profile per user per school year

#### **Cleanup Logic:**
```javascript
// Delete previous approved profile
if (foundProfile.previousProfileId) {
  await collection.deleteOne({ _id: foundProfile.previousProfileId })
}

// Clean up any duplicate profiles
await collection.deleteMany({
  ownedBy: foundProfile.ownedBy,
  schoolYearId: yearId,
  _id: { $ne: currentProfileId },
  status: { $in: ["pending", "rejected"] }
})
```

### **4. Database Collections & Data Flow**

#### **Collections Used:**
- `Alumni_yearbook` - Alumni profiles
- `FacultyStaff_yearbook` - Faculty and staff profiles  
- `College_yearbook` - College department students
- `SeniorHigh_yearbook` - Senior High students
- `JuniorHigh_yearbook` - Junior High students
- `Elementary_yearbook` - Elementary students

#### **Data Flow:**
1. **User Submission** → Appropriate collection with `status: "pending"`
2. **Admin Review** → Profile visible in admin panel
3. **Admin Approval** → Status changes to `approved`, old data deleted
4. **Admin Rejection** → Status changes to `rejected`, user can edit
5. **User Edit** → New pending version or updated existing profile

### **5. Error Handling & Logging**

#### **Comprehensive Logging:**
- Profile creation attempts
- Status changes
- Data cleanup operations
- Error conditions
- Duplicate detection

#### **Error Recovery:**
- Failed deletions don't prevent approvals
- Cleanup errors are logged but don't fail operations
- Database operations are atomic where possible

### **6. User Experience**

#### **Profile Management:**
- Users see all their submissions with real-time status
- Clear visual indicators for profile status
- Edit buttons only available for pending/rejected profiles
- Approved profiles show "Cannot Edit" message

#### **Status Indicators:**
- 🟡 **Pending** - "Awaiting Admin Review"
- ✅ **Approved** - "Approved" (locked)
- ❌ **Rejected** - "Rejected - Click to Edit"

### **7. Admin Panel Integration**

#### **Account Management:**
- Real-time profile status display
- Approve/Reject actions
- Profile data review
- Collection information
- Submission timestamps

#### **Approval Actions:**
- **Approve** - Changes status to approved, cleans up old data
- **Reject** - Changes status to rejected, allows user to edit
- **View** - Shows full profile data for review

## 🔧 **Technical Implementation**

### **API Endpoints:**

#### **Profile Submission** (`POST /api/profiles`)
- Handles new submissions and updates
- Manages status transitions
- Prevents duplicate creation
- References previous profiles when needed

#### **Profile Approval** (`POST /api/admin/[yearId]/profiles/[profileId]/approve`)
- Approves pending profiles
- Deletes old approved data
- Cleans up duplicates
- Updates status and metadata

### **Database Schema:**
```javascript
{
  _id: ObjectId,
  schoolYearId: string,
  userType: string,
  ownedBy: ObjectId,
  status: "pending" | "approved" | "rejected",
  previousProfileId?: ObjectId, // Reference to replaced profile
  createdAt: Date,
  updatedAt: Date,
  reviewedAt?: Date,
  reviewedBy?: string,
  rejectionReason?: string,
  // ... profile data fields
}
```

## ✅ **Benefits of Enhanced Workflow**

1. **Data Accuracy** - Only one approved profile per user per school year
2. **No Duplicates** - Automatic cleanup prevents duplicate entries
3. **Clear Status Management** - Users always know their profile status
4. **Admin Efficiency** - Streamlined approval process with automatic cleanup
5. **User Experience** - Clear feedback and intuitive editing process
6. **Data Integrity** - Old data is properly removed when replaced
7. **Audit Trail** - Comprehensive logging for troubleshooting

## 🚀 **Future Enhancements**

- **Notification System** - Email/SMS notifications for status changes
- **Bulk Operations** - Admin ability to approve/reject multiple profiles
- **Version History** - Optional retention of previous versions for audit
- **Advanced Filtering** - Enhanced admin panel filtering capabilities
- **Export Functionality** - Export approved profiles for yearbook generation
