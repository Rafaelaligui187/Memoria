# Profile Submission to MongoDB Yearbook Collection

## ✅ **What's Now Working:**

### 🎯 **Profile Data Storage**
- **Collection**: `yearbook` in MongoDB
- **Database**: `Memoria`
- **Status**: All profiles start as "pending" for admin approval
- **Data Structure**: Complete profile information with role-specific fields

### 📋 **Profile Data Structure**
```typescript
{
  _id: ObjectId,
  schoolYearId: string,
  userType: "student" | "faculty" | "alumni" | "staff",
  ownedBy: string, // Email of the profile owner
  status: "pending" | "approved" | "rejected",
  
  // Basic Info (all roles)
  fullName: string,
  nickname: string,
  age: string,
  gender: string,
  birthday: string,
  address: string,
  email: string,
  phone: string,
  
  // Yearbook Info
  profilePicture: string,
  sayingMotto: string,
  
  // Student-specific fields
  fatherGuardianName?: string,
  motherGuardianName?: string,
  department?: string,
  yearLevel?: string,
  courseProgram?: string,
  blockSection?: string,
  dreamJob?: string,
  socialMediaFacebook?: string,
  socialMediaInstagram?: string,
  socialMediaTwitter?: string,
  hobbies?: string,
  honors?: string,
  officerRole?: string, // Now dropdown: Mayor, Vice Mayor, etc.
  
  // Faculty-specific fields
  position?: string,
  departmentAssigned?: string,
  yearsOfService?: string,
  messageToStudents?: string,
  courses?: string,
  additionalRoles?: string,
  
  // Staff-specific fields
  officeAssigned?: string,
  
  // Alumni-specific fields
  graduationYear?: string,
  currentProfession?: string,
  currentCompany?: string,
  currentLocation?: string,
  achievements?: string,
  activities?: string,
  
  // Additional fields
  bio: string,
  achievements: string[], // Array of achievements
  
  // Metadata
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 **How It Works:**

### 1. **User Fills Out Profile Form**
- Selects role (student, faculty, alumni, staff)
- Fills in all required fields
- Uploads profile picture (stored on IMGBB)
- Selects officer role from dropdown (if student)

### 2. **Form Validation**
- Client-side validation for required fields
- Password validation (8+ characters)
- Email format validation
- File upload validation

### 3. **Data Submission**
- Form data is sent to `/api/profiles` endpoint
- Data is stored in MongoDB `yearbook` collection
- Status is set to "pending" for admin approval
- Success/error messages are shown to user

### 4. **Admin Approval Process**
- All profiles start as "pending"
- Admin can approve/reject profiles
- Approved profiles appear in yearbook
- Rejected profiles can be resubmitted

## 🔧 **API Endpoints:**

### **POST /api/profiles**
Creates a new profile in the yearbook collection
```json
{
  "schoolYearId": "2024-2025",
  "userType": "student",
  "profileData": {
    "fullName": "John Doe",
    "email": "john@example.com",
    // ... all other profile fields
  }
}
```

### **GET /api/profiles**
Fetches profiles with optional filters
```
GET /api/profiles?schoolYearId=2024-2025&userType=student&status=pending
GET /api/profiles?ownedBy=john@example.com
GET /api/profiles?schoolYearId=2024-2025&ownedBy=john@example.com
```

## 📊 **Database Collections:**

### **`users` Collection**
- User authentication data
- Login credentials
- Account information

### **`yearbook` Collection**
- Profile data for yearbook
- Role-specific information
- Approval status
- Images and media

## 🎯 **Testing the Profile Submission:**

1. **Go to Profile Setup Form**
2. **Fill out all required fields**
3. **Upload a profile picture**
4. **Select officer role (if student)**
5. **Submit the form**
6. **Check MongoDB Atlas** - Look in `yearbook` collection
7. **Verify data is stored** with "pending" status

## 🔍 **What to Look For:**

### **Success Logs:**
```
[v0] Profile creation attempt: { schoolYearId: '2024-2025', userType: 'student' }
[v0] Inserting profile into yearbook collection...
[v0] Profile inserted successfully: [ObjectId]
```

### **MongoDB Atlas:**
- Go to your MongoDB Atlas dashboard
- Check the `Memoria` database
- Look in the `yearbook` collection
- You should see the profile data with `status: "pending"`

## 👤 **Profile Ownership Management:**

### **Ownership Features:**
- ✅ **`ownedBy` Field** - Each profile is linked to its owner's email
- ✅ **Owner Identification** - Easy to identify who created each profile
- ✅ **Profile Filtering** - Get profiles by owner email
- ✅ **Ownership Validation** - Check if user owns a specific profile
- ✅ **Admin Management** - Admins can transfer ownership if needed

### **Utility Functions:**
```typescript
// Get all profiles owned by a user
const userProfiles = await getProfilesByOwner('john@example.com')

// Check if user owns a profile
const isOwner = await isProfileOwner('profileId', 'john@example.com')

// Get ownership information
const ownership = await getProfileOwnership('profileId')

// Transfer ownership (admin only)
const transferred = await updateProfileOwnership('profileId', 'newowner@example.com')
```

## 🎉 **Features Working:**

- ✅ **Profile Form Submission** - All data stored in MongoDB
- ✅ **Role-Specific Fields** - Different fields for each user type
- ✅ **Image Upload** - Profile pictures stored on IMGBB
- ✅ **Officer Role Dropdown** - Mayor, Vice Mayor, Secretary, etc.
- ✅ **Data Validation** - Client and server-side validation
- ✅ **Error Handling** - Comprehensive error messages
- ✅ **Admin Approval** - All profiles start as pending
- ✅ **Profile Ownership** - Each profile linked to its owner

Your profile submission system is now fully integrated with MongoDB and includes ownership management! 🚀
