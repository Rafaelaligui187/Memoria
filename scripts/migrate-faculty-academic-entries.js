// Migration script to create academic yearbook entries for existing faculty profiles
// This script will find faculty profiles with academic assignments and create
// additional entries in department-specific collections for yearbook display

const { MongoClient } = require('mongodb');

const YEARBOOK_COLLECTIONS = {
  COLLEGE: 'College_yearbook',
  SENIOR_HIGH: 'SeniorHigh_yearbook',
  JUNIOR_HIGH: 'JuniorHigh_yearbook',
  ELEMENTARY: 'Elementary_yearbook',
  ALUMNI: 'Alumni_yearbook',
  FACULTY_STAFF: 'FacultyStaff_yearbook',
  AR_SISTERS: 'ARSisters_yearbook',
};

// Function to determine the correct collection based on department
function getCollectionName(department) {
  const departmentMappings = {
    'College': YEARBOOK_COLLECTIONS.COLLEGE,
    'Senior High': YEARBOOK_COLLECTIONS.SENIOR_HIGH,
    'Junior High': YEARBOOK_COLLECTIONS.JUNIOR_HIGH,
    'Elementary': YEARBOOK_COLLECTIONS.ELEMENTARY,
  };
  return departmentMappings[department] || YEARBOOK_COLLECTIONS.COLLEGE;
}

async function migrateFacultyAcademicEntries() {
  let client;
  
  try {
    console.log('🔧 Starting faculty academic entries migration...');
    
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/memoria';
    client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('memoria');
    const facultyCollection = db.collection(YEARBOOK_COLLECTIONS.FACULTY_STAFF);
    
    // Find faculty profiles with academic assignments
    const facultyWithAcademic = await facultyCollection.find({
      userType: 'faculty',
      academicDepartment: { $exists: true, $ne: null, $ne: '' },
      academicYearLevels: { $exists: true, $ne: null, $ne: [] }
    }).toArray();
    
    console.log(`📊 Found ${facultyWithAcademic.length} faculty profiles with academic assignments`);
    
    let totalEntriesCreated = 0;
    
    for (const faculty of facultyWithAcademic) {
      console.log(`\n👤 Processing faculty: ${faculty.fullName}`);
      console.log(`   Academic Department: ${faculty.academicDepartment}`);
      console.log(`   Year Levels: ${faculty.academicYearLevels?.join(', ')}`);
      console.log(`   Course Program: ${faculty.academicCourseProgram}`);
      console.log(`   Sections: ${faculty.academicSections?.join(', ')}`);
      
      try {
        // Get the department-specific collection
        const departmentCollectionName = getCollectionName(faculty.academicDepartment);
        const departmentCollection = db.collection(departmentCollectionName);
        
        // Create entries for each academic assignment
        for (const yearLevel of faculty.academicYearLevels) {
          // If faculty has specific sections assigned, create entries for each section
          if (faculty.academicSections?.length > 0) {
            for (const sectionKey of faculty.academicSections) {
              const [sectionName, sectionYearLevel] = sectionKey.split('-');
              
              // Only create entry if this section matches the current year level
              if (sectionYearLevel === yearLevel) {
                // Check if entry already exists
                const existingEntry = await departmentCollection.findOne({
                  originalFacultyId: faculty._id,
                  yearLevel: yearLevel,
                  blockSection: sectionName
                });
                
                if (!existingEntry) {
                  const facultyYearbookEntry = {
                    ...faculty,
                    // Override fields for yearbook display
                    department: faculty.academicDepartment,
                    yearLevel: yearLevel,
                    courseProgram: faculty.academicCourseProgram || faculty.academicDepartment,
                    blockSection: sectionName,
                    // Mark as faculty entry
                    isFacultyEntry: true,
                    originalFacultyId: faculty._id,
                    // Ensure it's approved if the main profile is approved
                    status: faculty.status || 'approved',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  };
                  
                  await departmentCollection.insertOne(facultyYearbookEntry);
                  console.log(`   ✅ Created entry for ${faculty.academicDepartment} - ${yearLevel} - ${sectionName}`);
                  totalEntriesCreated++;
                } else {
                  console.log(`   ⚠️  Entry already exists for ${faculty.academicDepartment} - ${yearLevel} - ${sectionName}`);
                }
              }
            }
          } else {
            // If no specific sections, create a general entry for the year level
            // Check if entry already exists
            const existingEntry = await departmentCollection.findOne({
              originalFacultyId: faculty._id,
              yearLevel: yearLevel,
              blockSection: 'All Sections'
            });
            
            if (!existingEntry) {
              const facultyYearbookEntry = {
                ...faculty,
                // Override fields for yearbook display
                department: faculty.academicDepartment,
                yearLevel: yearLevel,
                courseProgram: faculty.academicCourseProgram || faculty.academicDepartment,
                blockSection: 'All Sections', // Default for faculty without specific section assignment
                // Mark as faculty entry
                isFacultyEntry: true,
                originalFacultyId: faculty._id,
                // Ensure it's approved if the main profile is approved
                status: faculty.status || 'approved',
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              
              await departmentCollection.insertOne(facultyYearbookEntry);
              console.log(`   ✅ Created entry for ${faculty.academicDepartment} - ${yearLevel}`);
              totalEntriesCreated++;
            } else {
              console.log(`   ⚠️  Entry already exists for ${faculty.academicDepartment} - ${yearLevel}`);
            }
          }
        }
      } catch (error) {
        console.error(`   ❌ Error processing faculty ${faculty.fullName}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Migration completed!`);
    console.log(`📊 Total academic entries created: ${totalEntriesCreated}`);
    
  } catch (error) {
    console.error('❌ Migration error:', error.message);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Run migration
migrateFacultyAcademicEntries()
  .then(() => {
    console.log('✅ Faculty academic entries migration finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
