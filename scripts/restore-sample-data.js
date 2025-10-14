// Sample Data Restoration Script
// This script creates sample data for testing
// Run with: node scripts/restore-sample-data.js

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';
const client = new MongoClient(MONGODB_URI);

async function restoreSampleData() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    
    // Create sample school year
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
    console.log('You can now test your application with this sample data.');
    
  } catch (error) {
    console.error('Error restoring sample data:', error);
  } finally {
    await client.close();
  }
}

restoreSampleData().catch(console.error);
