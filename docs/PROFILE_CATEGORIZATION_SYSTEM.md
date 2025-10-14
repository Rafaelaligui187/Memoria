# Complete Profile Categorization & Yearbook Display System

## ✅ **System Overview**

The system ensures that when users submit their profiles through the form, they are automatically categorized and displayed in the correct yearbook section based on their selected strand, year level, and section. This applies across all strands (STEM, ABM, HUMSS, TVL, GAS, Arts and Design) and all year levels and sections.

## 🔄 **Complete Workflow**

### **1. Profile Submission Process**

#### **Form Data Collection:**
- **Department**: "Senior High" (automatically set for Senior High students)
- **Year Level**: "Grade 11" or "Grade 12" (user selects)
- **Course Program**: "STEM", "ABM", "HUMSS", "TVL", "GAS", "Arts" (user selects)
- **Block Section**: "STEM 1", "STEM 2", "ABM 1", "HUMSS 3", etc. (user selects from dropdown)
- **School Year ID**: Current active school year (automatically assigned)

#### **Form Validation:**
- ✅ All required fields validated before submission
- ✅ Section dropdown populated based on selected course program
- ✅ Email format validation
- ✅ Age validation (1-100)
- ✅ Required fields: fullName, department, yearLevel, courseProgram, blockSection

#### **Data Submission:**
```typescript
const profileData = {
  // Basic Info
  fullName: formData.fullName,
  department: formData.department, // "Senior High"
  yearLevel: formData.yearLevel, // "Grade 11" or "Grade 12"
  courseProgram: formData.courseProgram, // "STEM", "ABM", etc.
  blockSection: formData.blockSection, // "STEM 1", "ABM 2", etc.
  schoolYearId: schoolYearId, // MongoDB ObjectId
  
  // Additional categorization fields
  status: "pending", // All profiles start as pending
  userType: "student",
  
  // ... other profile data
}
```

### **2. Database Storage**

#### **Collection Mapping:**
- **Senior High Students** → `SeniorHigh_yearbook` collection
- **College Students** → `College_yearbook` collection
- **Faculty & Staff** → `FacultyStaff_yearbook` collection
- **Alumni** → `Alumni_yearbook` collection

#### **Data Structure:**
```typescript
{
  _id: ObjectId,
  schoolYearId: string,
  department: "Senior High",
  yearLevel: "Grade 11",
  courseProgram: "STEM",
  blockSection: "STEM 1",
  status: "pending" | "approved" | "rejected",
  fullName: string,
  // ... other profile fields
}
```

### **3. Admin Approval Process**

#### **Profile Review:**
- Admin accesses Account Management panel
- Views all pending profiles across all collections
- Each profile shows: department, year level, course program, section
- Admin can approve or reject with reasons

#### **Approval Action:**
```typescript
// When admin approves a profile
await db.collection("SeniorHigh_yearbook").updateOne(
  { _id: new ObjectId(profileId) },
  { 
    $set: { 
      status: "approved",
      reviewedAt: new Date(),
      reviewedBy: "admin"
    }
  }
)
```

### **4. Yearbook Display System**

#### **URL Structure:**
```
/departments/senior-high/{strandId}/{yearId}/{sectionId}/{schoolYear}
```

**Example:** `/departments/senior-high/stem/grade-11/section-1/68e0f71e108ee73737d5a13c`

#### **Section Name Mapping:**
```typescript
// URL: /departments/senior-high/stem/grade-11/section-1/...
const strandId = "stem" // Maps to "STEM"
const sectionId = "section-1" // Maps to "STEM 1"
const sectionNameForFilter = `${strand.name} ${sectionId.split('-')[1]}`
// Result: "STEM 1"
```

#### **API Query:**
```typescript
const queryParams = new URLSearchParams({
  department: 'Senior High',
  schoolYearId: schoolYear,
  status: 'approved',
  yearLevel: year.name, // "Grade 11"
  courseProgram: strand.name, // "STEM"
  blockSection: sectionNameForFilter // "STEM 1"
})

// Fetches: /api/yearbook?department=Senior%20High&schoolYearId=...&status=approved&yearLevel=Grade%2011&courseProgram=STEM&blockSection=STEM%201
```

#### **Database Query:**
```typescript
// In yearbook-database.ts
const query = { 
  schoolYearId, 
  department: "Senior High",
  yearLevel: "Grade 11",
  courseProgram: "STEM",
  blockSection: "STEM 1",
  status: "approved"
}

const profiles = await collection.find(query).toArray()
```

## 🎯 **Key Features**

### **Automatic Categorization:**
- ✅ Profiles automatically stored in correct collection based on department
- ✅ Section names exactly match between form and yearbook display
- ✅ All categorization fields preserved through approval process

### **Cross-Strand Support:**
- ✅ **STEM**: STEM 1, STEM 2, STEM 3, STEM 4, STEM 5
- ✅ **ABM**: ABM 1, ABM 2, ABM 3, ABM 4, ABM 5
- ✅ **HUMSS**: HUMSS 1, HUMSS 2, HUMSS 3, HUMSS 4, HUMSS 5
- ✅ **TVL**: TVL 1, TVL 2, TVL 3, TVL 4, TVL 5
- ✅ **GAS**: GAS 1, GAS 2, GAS 3, GAS 4, GAS 5
- ✅ **Arts**: Arts 1, Arts 2, Arts 3, Arts 4, Arts 5

### **Year Level Support:**
- ✅ **Grade 11**: All strands and sections
- ✅ **Grade 12**: All strands and sections

### **Real-Time Updates:**
- ✅ Approved profiles immediately appear in yearbook
- ✅ Status changes reflected in user profile management
- ✅ No manual intervention required

## 🔍 **Debugging & Monitoring**

### **Console Logging:**
```typescript
// Form submission
console.log("[Form] Profile submitted:", {
  department: "Senior High",
  yearLevel: "Grade 11",
  courseProgram: "STEM",
  blockSection: "STEM 1"
})

// Yearbook display
console.log("[Yearbook] Section mapping:", {
  strandId: "stem",
  sectionId: "section-1",
  sectionNameForFilter: "STEM 1"
})

// API query
console.log("[Yearbook] Query details:", {
  department: 'Senior High',
  yearLevel: 'Grade 11',
  courseProgram: 'STEM',
  blockSection: 'STEM 1'
})
```

### **Error Handling:**
- ✅ Form validation prevents invalid submissions
- ✅ API error handling with fallback to static data
- ✅ Comprehensive error messages for debugging

## 📊 **Data Flow Diagram**

```
User Form Submission
        ↓
   Validation Check
        ↓
   Database Storage (SeniorHigh_yearbook)
        ↓
   Admin Review Panel
        ↓
   Admin Approval/Rejection
        ↓
   Status Update (approved/rejected)
        ↓
   Yearbook Display (if approved)
```

## ✅ **Verification Checklist**

### **Form Submission:**
- [ ] User selects correct department (Senior High)
- [ ] User selects correct year level (Grade 11/12)
- [ ] User selects correct course program (STEM/ABM/HUMSS/TVL/GAS/Arts)
- [ ] User selects correct section (STEM 1, ABM 2, etc.)
- [ ] All required fields validated
- [ ] Profile stored in correct collection

### **Admin Approval:**
- [ ] Profile appears in admin panel
- [ ] All categorization fields visible
- [ ] Admin can approve/reject
- [ ] Status updated correctly

### **Yearbook Display:**
- [ ] Approved profiles appear in correct section
- [ ] Section name mapping works correctly
- [ ] All profile data displayed properly
- [ ] Profile links work correctly

## 🚀 **Result**

The system ensures that:
1. **Every submitted profile** is automatically categorized by strand, year level, and section
2. **Admin approval** maintains all categorization information
3. **Yearbook display** shows profiles in the correct sections
4. **No manual intervention** required for categorization
5. **Works across all strands** and sections seamlessly

This creates a seamless experience where users submit their profiles once, admins approve them, and they automatically appear in the correct yearbook section without any additional configuration.
