# Department-Specific Collection Mapping

## Overview

The system now automatically stores user profile data in the correct database collection based on their role and department selection, replacing the generic `yearbook` collection approach.

## Collection Mapping Logic

### Role-to-Collection Mapping:

1. **Alumni**: Always stored in `Alumni_yearbook` collection
2. **Faculty/Staff**: Always stored in `FacultyStaff_yearbook` collection  
3. **Students**: Collection determined by department selection:
   - College Department → `College_yearbook`
   - Senior High Department → `SeniorHigh_yearbook`
   - Junior High Department → `JuniorHigh_yearbook`
   - Elementary Department → `Elementary_yearbook`

## Implementation Details

### API Changes (`/api/profiles`)

- **POST Endpoint**: Now determines the correct collection based on `userType` and `department` fields
- **GET Endpoint**: Searches across multiple collections based on query parameters
- **Collection Selection**: Uses `getCollectionName()` function to map roles/departments to collections

### Form Changes

#### Unified Profile Setup Form
- **Students**: Pass `department` field from form data
- **Faculty**: Maps `departmentAssigned` to `department` for collection mapping
- **Staff**: Sets `department` to `"Faculty & Staff"`
- **Alumni**: Sets `department` to `"Alumni"` (with fallback to form data)

### Data Structure

Each collection now stores:
```json
{
  "_id": "ObjectId",
  "schoolYearId": "68df4807b22e5f8df6da1dcc",
  "schoolYear": "2025-2026",
  "userType": "student|alumni|faculty|staff",
  "department": "College|Senior High|Junior High|Elementary|Faculty & Staff|Alumni",
  "ownedBy": "UserObjectId",
  "status": "pending|approved|rejected",
  // ... role-specific fields
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Database Collections

- ✅ `College_yearbook` - College students and faculty
- ✅ `SeniorHigh_yearbook` - Senior High students and faculty
- ✅ `JuniorHigh_yearbook` - Junior High students and faculty
- ✅ `Elementary_yearbook` - Elementary students and faculty
- ✅ `Alumni_yearbook` - All alumni
- ✅ `FacultyStaff_yearbook` - Faculty and staff
- ❌ `yearbook` - **NO LONGER USED** (can be removed)

## Testing

Use the `collection-mapping-test.js` script to verify the mapping logic works correctly for all user types and departments.

## Benefits

1. **Data Organization**: Each department's data is stored separately for better organization
2. **Performance**: Smaller collections mean faster queries
3. **Access Control**: Easier to implement department-specific permissions
4. **Maintenance**: Simpler to manage and backup department-specific data
5. **Reporting**: Department-specific analytics and reporting capabilities

## Migration Notes

- Existing data in the `yearbook` collection can be migrated to appropriate department collections
- The `yearbook` collection can be safely removed after migration
- All new profile submissions automatically go to the correct collections
