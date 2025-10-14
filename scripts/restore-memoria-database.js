// Memoria Database Restoration Script
// This script restores your Memoria yearbook database
// Run with: node scripts/restore-memoria-database.js

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';
const client = new MongoClient(MONGODB_URI);

// Collections that should exist in your Memoria yearbook system
const REQUIRED_COLLECTIONS = [
  'College_yearbook',
  'SeniorHigh_yearbook', 
  'JuniorHigh_yearbook',
  'Elementary_yearbook',
  'Alumni_yearbook',
  'FacultyStaff_yearbook',
  'SchoolYears',
  'notifications',
  'reports'
];

async function checkMemoriaDatabase() {
  try {
    await client.connect();
    console.log('✅ Connected to Memoria database');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    const existingCollections = collections.map(col => col.name);
    
    console.log('\n=== EXISTING COLLECTIONS IN MEMORIA ===');
    existingCollections.forEach(col => console.log(`✅ ${col}`));
    
    console.log('\n=== MISSING COLLECTIONS ===');
    const missingCollections = REQUIRED_COLLECTIONS.filter(col => !existingCollections.includes(col));
    missingCollections.forEach(col => console.log(`❌ ${col}`));
    
    if (missingCollections.length === 0) {
      console.log('\n✅ All required collections exist!');
    } else {
      console.log(`\n⚠️  ${missingCollections.length} collections are missing`);
    }
    
    // Check data counts
    console.log('\n=== DATA COUNTS ===');
    for (const collectionName of existingCollections) {
      if (REQUIRED_COLLECTIONS.includes(collectionName)) {
        const count = await db.collection(collectionName).countDocuments();
        console.log(`${collectionName}: ${count} documents`);
      }
    }
    
    // Check for school years specifically
    const schoolYears = await db.collection('SchoolYears').find({}).toArray();
    console.log('\n=== SCHOOL YEARS ===');
    if (schoolYears.length > 0) {
      schoolYears.forEach(year => {
        console.log(`📅 ${year.yearLabel} (${year.isActive ? 'Active' : 'Inactive'})`);
      });
    } else {
      console.log('❌ No school years found');
    }
    
  } catch (error) {
    console.error('❌ Error checking Memoria database:', error);
  } finally {
    await client.close();
  }
}

async function createMissingCollections() {
  try {
    await client.connect();
    console.log('✅ Connected to Memoria database');
    console.log('Creating missing collections...');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    const existingCollections = collections.map(col => col.name);
    
    for (const collectionName of REQUIRED_COLLECTIONS) {
      if (!existingCollections.includes(collectionName)) {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      }
    }
    
    console.log('\n✅ All collections created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating collections:', error);
  } finally {
    await client.close();
  }
}

async function restoreMemoriaSampleData() {
  try {
    await client.connect();
    console.log('✅ Connected to Memoria database');
    console.log('Restoring sample data...');
    
    const db = client.db();
    
    // Create sample school year for 2024-2025
    const schoolYearId = new ObjectId();
    await db.collection('SchoolYears').insertOne({
      _id: schoolYearId,
      yearLabel: '2024-2025',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2025-05-31'),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Created sample school year: 2024-2025');
    
    // Create sample college student
    await db.collection('College_yearbook').insertOne({
      schoolYearId: schoolYearId.toString(),
      userType: 'student',
      department: 'College',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      studentId: '2024-001',
      course: 'BSIT',
      yearLevel: '4th Year',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Created sample college student');
    
    // Create sample senior high student
    await db.collection('SeniorHigh_yearbook').insertOne({
      schoolYearId: schoolYearId.toString(),
      userType: 'student',
      department: 'Senior High',
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
      studentId: '2024-002',
      gradeLevel: 'Grade 12',
      strand: 'STEM',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Created sample senior high student');
    
    // Create sample faculty
    await db.collection('FacultyStaff_yearbook').insertOne({
      schoolYearId: schoolYearId.toString(),
      userType: 'faculty',
      department: 'Faculty & Staff',
      fullName: 'Dr. Maria Garcia',
      email: 'maria.garcia@example.com',
      employeeId: 'EMP-001',
      position: 'Professor',
      department: 'Computer Science',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Created sample faculty member');
    
    // Create sample alumni
    await db.collection('Alumni_yearbook').insertOne({
      schoolYearId: schoolYearId.toString(),
      userType: 'alumni',
      department: 'Alumni',
      fullName: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      graduationYear: '2020',
      course: 'BSIT',
      currentJob: 'Software Developer',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Created sample alumni');
    
    console.log('\n✅ Sample data restored successfully!');
    console.log('You can now test your Memoria application with this sample data.');
    
  } catch (error) {
    console.error('❌ Error restoring sample data:', error);
  } finally {
    await client.close();
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  
  console.log('🏫 Memoria Database Restoration Tool');
  console.log('=====================================');
  
  switch (command) {
    case 'check':
      await checkMemoriaDatabase();
      break;
    case 'create':
      await createMissingCollections();
      break;
    case 'sample':
      await restoreMemoriaSampleData();
      break;
    default:
      console.log('Usage:');
      console.log('  node scripts/restore-memoria-database.js check   - Check existing collections');
      console.log('  node scripts/restore-memoria-database.js create  - Create missing collections');
      console.log('  node scripts/restore-memoria-database.js sample   - Restore sample data');
      break;
  }
}

main().catch(console.error);
