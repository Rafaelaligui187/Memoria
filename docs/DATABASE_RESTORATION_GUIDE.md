# Database Collections Restoration Guide

## 🏫 Memoria Database Collections

Based on the codebase analysis, here are all the required MongoDB collections that need to be restored:

### 📚 **Yearbook Collections**

#### **1. College_yearbook**
- **Purpose**: Stores college student and faculty profiles
- **Fields**: Complete profile data including personal info, academic info, achievements, etc.

#### **2. SeniorHigh_yearbook**
- **Purpose**: Stores senior high school student and faculty profiles
- **Fields**: Complete profile data for senior high department

#### **3. JuniorHigh_yearbook**
- **Purpose**: Stores junior high school student and faculty profiles
- **Fields**: Complete profile data for junior high department

#### **4. Elementary_yearbook**
- **Purpose**: Stores elementary school student and faculty profiles
- **Fields**: Complete profile data for elementary department

#### **5. Alumni_yearbook**
- **Purpose**: Stores alumni profiles
- **Fields**: Alumni-specific data including graduation year, current work, etc.

#### **6. FacultyStaff_yearbook**
- **Purpose**: Stores faculty and staff profiles
- **Fields**: Professional information, courses, achievements, etc.

### 🗓️ **System Collections**

#### **7. SchoolYears**
- **Purpose**: Manages school year periods
- **Fields**: yearLabel, startDate, endDate, isActive, etc.

#### **8. users**
- **Purpose**: User authentication and management
- **Fields**: email, password, role, permissions, etc.

#### **9. notifications**
- **Purpose**: System notifications
- **Fields**: message, type, recipient, status, etc.

#### **10. reports**
- **Purpose**: User reports and moderation
- **Fields**: reportType, description, status, etc.

## 🔧 **Collection Schemas**

### **Yearbook Entry Schema**
```javascript
{
  _id: ObjectId,
  schoolYearId: String,
  schoolYear: String, // e.g., "2025-2026"
  status: "pending" | "approved" | "rejected" | "archived",
  previousProfileId: ObjectId, // For profile updates
  
  // Personal Info
  fullName: String,
  nickname: String,
  age: Number,
  gender: String,
  birthday: Date,
  address: String,
  email: String,
  phone: String,
  profilePicture: String,
  
  // Family Info
  fatherGuardianName: String,
  motherGuardianName: String,
  
  // Academic/Professional Info
  department: String,
  yearLevel: String,
  courseProgram: String,
  blockSection: String,
  graduationYear: String,
  position: String,
  departmentAssigned: String,
  officeAssigned: String,
  yearsOfService: Number,
  
  // Career Info (Alumni)
  currentProfession: String,
  currentCompany: String,
  currentLocation: String,
  
  // Additional Info
  dreamJob: String,
  sayingMotto: String,
  messageToStudents: String,
  
  // Social Media
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    tiktok: String
  },
  
  // Yearbook Info
  achievements: [String],
  activities: [String],
  hobbies: [String],
  honors: [String],
  officerRole: String,
  bio: String,
  legacy: String,
  contribution: String,
  advice: String,
  
  // User Management
  userType: "student" | "faculty" | "alumni" | "staff",
  ownedBy: ObjectId, // User ID
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date,
  reviewedAt: Date,
  reviewedBy: String,
  archivedAt: Date,
  archivedBy: String
}
```

### **School Year Schema**
```javascript
{
  _id: ObjectId,
  yearLabel: String, // e.g., "2025-2026"
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### **User Schema**
```javascript
{
  _id: ObjectId,
  email: String,
  password: String, // Hashed
  role: String,
  permissions: [String],
  profile: {
    firstName: String,
    lastName: String,
    avatar: String
  },
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

## 🚀 **Restoration Methods**

### **Method 1: Using MongoDB Compass (Recommended)**
1. Open MongoDB Compass
2. Connect to your MongoDB cluster
3. Navigate to the `Memoria` database
4. Create each collection manually:
   - Right-click → Create Collection
   - Name: `College_yearbook`, `SeniorHigh_yearbook`, etc.
   - Create indexes as needed

### **Method 2: Using MongoDB Shell**
```javascript
// Connect to MongoDB
use Memoria

// Create yearbook collections
db.createCollection("College_yearbook")
db.createCollection("SeniorHigh_yearbook")
db.createCollection("JuniorHigh_yearbook")
db.createCollection("Elementary_yearbook")
db.createCollection("Alumni_yearbook")
db.createCollection("FacultyStaff_yearbook")

// Create system collections
db.createCollection("SchoolYears")
db.createCollection("users")
db.createCollection("notifications")
db.createCollection("reports")

// Create indexes for better performance
db.College_yearbook.createIndex({ schoolYearId: 1 })
db.College_yearbook.createIndex({ fullName: 1 })
db.College_yearbook.createIndex({ email: 1 })
db.College_yearbook.createIndex({ status: 1 })
db.College_yearbook.createIndex({ department: 1 })
db.College_yearbook.createIndex({ yearLevel: 1 })
db.College_yearbook.createIndex({ courseProgram: 1 })
db.College_yearbook.createIndex({ blockSection: 1 })

// Repeat for other yearbook collections...
```

### **Method 3: Using Node.js Script**
```javascript
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'your-mongodb-connection-string';
const client = new MongoClient(MONGODB_URI);

async function restoreCollections() {
  try {
    await client.connect();
    const db = client.db('Memoria');
    
    const collections = [
      'College_yearbook',
      'SeniorHigh_yearbook',
      'JuniorHigh_yearbook',
      'Elementary_yearbook',
      'Alumni_yearbook',
      'FacultyStaff_yearbook',
      'SchoolYears',
      'users',
      'notifications',
      'reports'
    ];
    
    for (const collectionName of collections) {
      await db.createCollection(collectionName);
      console.log(`✅ Created collection: ${collectionName}`);
    }
    
    console.log('✅ All collections restored successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

restoreCollections();
```

## 📊 **Sample Data**

### **School Year Sample**
```javascript
{
  _id: ObjectId(),
  yearLabel: "2025-2026",
  startDate: new Date("2025-08-01"),
  endDate: new Date("2026-07-31"),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### **Student Profile Sample**
```javascript
{
  _id: ObjectId(),
  schoolYearId: "school-year-object-id",
  schoolYear: "2025-2026",
  status: "approved",
  userType: "student",
  department: "College",
  yearLevel: "4th Year",
  courseProgram: "Bachelor of Science in Information Technology",
  blockSection: "Block D",
  fullName: "Austine Kiño Cañete Martinez",
  nickname: "Kin-Kin",
  age: 21,
  email: "austine@example.com",
  profilePicture: "profile-picture-url",
  sayingMotto: "Excellence through perseverance",
  fatherGuardianName: "Father Name",
  motherGuardianName: "Mother Name",
  officerRole: "Mayor",
  achievements: ["Dean's Lister", "Best in Programming"],
  hobbies: ["Programming", "Gaming"],
  socialMedia: {
    facebook: "facebook-url",
    instagram: "instagram-url"
  },
  ownedBy: ObjectId("user-id"),
  createdAt: new Date(),
  updatedAt: new Date()
}
```

## ⚠️ **Important Notes**

1. **Connection Issues**: If you're experiencing MongoDB connection issues, check:
   - Network connectivity
   - MongoDB Atlas IP whitelist
   - Connection string validity
   - SSL/TLS settings

2. **Indexes**: Create indexes for better performance:
   - `schoolYearId`
   - `fullName`
   - `email`
   - `status`
   - `department`
   - `yearLevel`
   - `courseProgram`
   - `blockSection`

3. **Data Validation**: Ensure all required fields are present:
   - `schoolYearId` (references SchoolYears collection)
   - `fullName` (required)
   - `email` (required)
   - `userType` (required)
   - `status` (required)

4. **Permissions**: Make sure your MongoDB user has:
   - Read/Write access to the `Memoria` database
   - Collection creation permissions
   - Index creation permissions

## 🔍 **Verification**

After restoration, verify collections exist:
```javascript
use Memoria
show collections
```

Check collection counts:
```javascript
db.College_yearbook.countDocuments()
db.SeniorHigh_yearbook.countDocuments()
db.SchoolYears.countDocuments()
```

This guide provides everything needed to restore all the database collections for the Memoria yearbook system!
