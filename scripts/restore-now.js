// Direct Database Restoration Script
// This script directly adds all missing collections and sample data
// Run with: node restore-now.js

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function restoreEverything() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🚀 Starting direct database restoration...');
    await client.connect();
    console.log('✅ Connected to Memoria database');
    
    const db = client.db();
    
    // 1. Create all missing collections
    console.log('\n📁 Creating collections...');
    const collections = [
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
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Created: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) {
          console.log(`✅ Already exists: ${collectionName}`);
        } else {
          console.log(`⚠️  Error with ${collectionName}: ${error.message}`);
        }
      }
    }
    
    // 2. Add sample school year
    console.log('\n📅 Adding school year...');
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
    console.log('✅ Added school year: 2024-2025');
    
    // 3. Add sample profiles
    console.log('\n👥 Adding sample profiles...');
    
    // College student
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
    console.log('✅ Added college student');
    
    // Senior High student
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
    console.log('✅ Added senior high student');
    
    // Faculty
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
    console.log('✅ Added faculty member');
    
    // Alumni
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
    console.log('✅ Added alumni');
    
    // Junior High student
    await db.collection('JuniorHigh_yearbook').insertOne({
      schoolYearId: schoolYearId.toString(),
      userType: 'student',
      department: 'Junior High',
      fullName: 'Mike Wilson',
      email: 'mike.wilson@example.com',
      studentId: '2024-003',
      gradeLevel: 'Grade 9',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Added junior high student');
    
    // Elementary student
    await db.collection('Elementary_yearbook').insertOne({
      schoolYearId: schoolYearId.toString(),
      userType: 'student',
      department: 'Elementary',
      fullName: 'Sarah Brown',
      email: 'sarah.brown@example.com',
      studentId: '2024-004',
      gradeLevel: 'Grade 6',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Added elementary student');
    
    // 4. Add sample notification
    await db.collection('notifications').insertOne({
      id: 'sample_notification_1',
      type: 'info',
      title: 'Welcome to Memoria',
      message: 'Your yearbook system is ready!',
      timestamp: new Date(),
      read: false,
      priority: 'medium',
      category: 'system',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Added sample notification');
    
    console.log('\n🎉 DATABASE RESTORATION COMPLETE!');
    console.log('=====================================');
    console.log('✅ All collections created');
    console.log('✅ Sample school year added');
    console.log('✅ Sample profiles added');
    console.log('✅ Sample notification added');
    console.log('\n🚀 Your Memoria database is now ready!');
    
  } catch (error) {
    console.error('❌ Error during restoration:', error);
  } finally {
    await client.close();
  }
}

restoreEverything().catch(console.error);
