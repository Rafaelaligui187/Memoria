const { MongoClient } = require('mongodb');

// MongoDB connection string
const uri = 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function seedYearbookCollections() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    
    // Create SchoolYears collection with sample data
    const schoolYearsCollection = db.collection('SchoolYears');
    
    // Clear existing data
    await schoolYearsCollection.deleteMany({});
    
    // Insert sample school years
    const schoolYears = [
      {
        yearLabel: '2025-2026',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2026-07-31'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        yearLabel: '2024-2025',
        startDate: new Date('2024-08-01'),
        endDate: new Date('2025-07-31'),
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        yearLabel: '2023-2024',
        startDate: new Date('2023-08-01'),
        endDate: new Date('2024-07-31'),
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    await schoolYearsCollection.insertMany(schoolYears);
    console.log('✓ SchoolYears collection seeded');
    
    // Get the active school year ID for sample data
    const activeSchoolYear = await schoolYearsCollection.findOne({ isActive: true });
    const activeSchoolYearId = activeSchoolYear._id.toString();
    
    // Create yearbook collections with sample data
    const yearbookCollections = [
      'College_yearbook',
      'SeniorHigh_yearbook',
      'JuniorHigh_yearbook',
      'Elementary_yearbook',
      'Alumni_yearbook',
      'FacultyStaff_yearbook'
    ];
    
    for (const collectionName of yearbookCollections) {
      const collection = db.collection(collectionName);
      
      // Clear existing data
      await collection.deleteMany({});
      
      // Create indexes for better performance
      await collection.createIndex({ schoolYearId: 1 });
      await collection.createIndex({ fullName: 1 });
      await collection.createIndex({ email: 1 });
      await collection.createIndex({ status: 1 });
      await collection.createIndex({ department: 1 });
      await collection.createIndex({ yearLevel: 1 });
      await collection.createIndex({ courseProgram: 1 });
      await collection.createIndex({ blockSection: 1 });
      
      console.log(`✓ ${collectionName} collection created with indexes`);
    }
    
    // Add sample data for each collection
    await addSampleCollegeData(db, activeSchoolYearId);
    await addSampleSeniorHighData(db, activeSchoolYearId);
    await addSampleJuniorHighData(db, activeSchoolYearId);
    await addSampleElementaryData(db, activeSchoolYearId);
    await addSampleAlumniData(db, activeSchoolYearId);
    await addSampleFacultyStaffData(db, activeSchoolYearId);
    
    console.log('✓ All yearbook collections seeded successfully');
    
  } catch (error) {
    console.error('Error seeding yearbook collections:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

async function addSampleCollegeData(db, schoolYearId) {
  const collection = db.collection('College_yearbook');
  
  const sampleData = [
    {
      schoolYearId,
      status: 'approved',
      fullName: 'John Michael Santos',
      nickname: 'JM',
      age: 20,
      gender: 'Male',
      birthday: new Date('2004-05-15'),
      address: '123 Main St, Quezon City',
      email: 'john.santos@example.com',
      phone: '+63 912 345 6789',
      profilePicture: 'https://via.placeholder.com/300x300',
      fatherGuardianName: 'Michael Santos',
      motherGuardianName: 'Maria Santos',
      department: 'College',
      yearLevel: '3rd Year',
      courseProgram: 'BSIT',
      blockSection: 'Block A',
      sayingMotto: 'Success is not final, failure is not fatal',
      dreamJob: 'Software Engineer',
      officerRole: 'Class President',
      bio: 'Passionate about technology and innovation.',
      hobbies: ['Programming', 'Gaming', 'Reading'],
      honors: ['Dean\'s Lister', 'Best in Programming'],
      achievements: ['Hackathon Winner 2024', 'Student Leader Award'],
      socialMedia: {
        facebook: 'https://facebook.com/john.santos',
        instagram: 'https://instagram.com/john.santos',
        linkedin: 'https://linkedin.com/in/john.santos'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      schoolYearId,
      status: 'pending',
      fullName: 'Maria Cristina Garcia',
      nickname: 'Cristina',
      age: 19,
      gender: 'Female',
      birthday: new Date('2005-03-22'),
      address: '456 Oak Ave, Makati City',
      email: 'maria.garcia@example.com',
      phone: '+63 923 456 7890',
      department: 'College',
      yearLevel: '2nd Year',
      courseProgram: 'BSCS',
      blockSection: 'Block B',
      sayingMotto: 'Dream big, work hard',
      dreamJob: 'Data Scientist',
      bio: 'Love working with data and analytics.',
      hobbies: ['Data Analysis', 'Photography', 'Cooking'],
      honors: ['Academic Excellence'],
      achievements: ['Research Paper Published'],
      socialMedia: {
        instagram: 'https://instagram.com/cristina.garcia',
        linkedin: 'https://linkedin.com/in/cristina.garcia'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await collection.insertMany(sampleData);
  console.log('✓ College yearbook sample data added');
}

async function addSampleSeniorHighData(db, schoolYearId) {
  const collection = db.collection('SeniorHigh_yearbook');
  
  const sampleData = [
    {
      schoolYearId,
      status: 'approved',
      fullName: 'Carlos Miguel Rodriguez',
      nickname: 'Carlos',
      age: 17,
      gender: 'Male',
      birthday: new Date('2007-08-10'),
      address: '789 Pine St, Taguig City',
      email: 'carlos.rodriguez@example.com',
      phone: '+63 934 567 8901',
      department: 'Senior High',
      yearLevel: 'Grade 12',
      courseProgram: 'STEM',
      blockSection: 'STEM-A',
      sayingMotto: 'Science is the key to the future',
      dreamJob: 'Engineer',
      officerRole: 'Vice President',
      bio: 'Interested in science and mathematics.',
      hobbies: ['Robotics', 'Mathematics', 'Sports'],
      honors: ['Valedictorian', 'Science Fair Winner'],
      achievements: ['Robotics Competition Champion'],
      socialMedia: {
        facebook: 'https://facebook.com/carlos.rodriguez',
        instagram: 'https://instagram.com/carlos.rodriguez'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await collection.insertMany(sampleData);
  console.log('✓ Senior High yearbook sample data added');
}

async function addSampleJuniorHighData(db, schoolYearId) {
  const collection = db.collection('JuniorHigh_yearbook');
  
  const sampleData = [
    {
      schoolYearId,
      status: 'approved',
      fullName: 'Ana Sofia Martinez',
      nickname: 'Ana',
      age: 15,
      gender: 'Female',
      birthday: new Date('2009-12-05'),
      address: '321 Elm St, Pasig City',
      email: 'ana.martinez@example.com',
      phone: '+63 945 678 9012',
      department: 'Junior High',
      yearLevel: 'Grade 9',
      blockSection: '9-A',
      sayingMotto: 'Learning never stops',
      dreamJob: 'Teacher',
      bio: 'Passionate about education and helping others.',
      hobbies: ['Reading', 'Art', 'Music'],
      honors: ['Honor Student'],
      achievements: ['Art Competition Winner'],
      socialMedia: {
        instagram: 'https://instagram.com/ana.martinez'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await collection.insertMany(sampleData);
  console.log('✓ Junior High yearbook sample data added');
}

async function addSampleElementaryData(db, schoolYearId) {
  const collection = db.collection('Elementary_yearbook');
  
  const sampleData = [
    {
      schoolYearId,
      status: 'approved',
      fullName: 'Luis Fernando Cruz',
      nickname: 'Luis',
      age: 11,
      gender: 'Male',
      birthday: new Date('2013-06-18'),
      address: '654 Maple St, Mandaluyong City',
      email: 'luis.cruz@example.com',
      phone: '+63 956 789 0123',
      department: 'Elementary',
      yearLevel: 'Grade 5',
      blockSection: '5-A',
      sayingMotto: 'Be kind and helpful',
      dreamJob: 'Doctor',
      bio: 'Loves science and helping people.',
      hobbies: ['Science Experiments', 'Drawing', 'Sports'],
      honors: ['Best in Science'],
      achievements: ['Science Fair Participant'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await collection.insertMany(sampleData);
  console.log('✓ Elementary yearbook sample data added');
}

async function addSampleAlumniData(db, schoolYearId) {
  const collection = db.collection('Alumni_yearbook');
  
  const sampleData = [
    {
      schoolYearId,
      status: 'approved',
      fullName: 'Roberto Alejandro Lopez',
      nickname: 'Roberto',
      age: 25,
      gender: 'Male',
      birthday: new Date('1999-04-12'),
      address: '987 Cedar St, Manila',
      email: 'roberto.lopez@example.com',
      phone: '+63 967 890 1234',
      department: 'Alumni',
      courseProgram: 'BSIT',
      graduationYear: '2021',
      currentJobTitle: 'Senior Software Developer',
      currentEmployer: 'Tech Solutions Inc.',
      currentLocation: 'Makati City',
      sayingMotto: 'Never stop learning',
      dreamJob: 'Tech Entrepreneur',
      bio: 'Alumni who found success in the tech industry.',
      hobbies: ['Coding', 'Entrepreneurship', 'Mentoring'],
      honors: ['Cum Laude'],
      achievements: ['Company Employee of the Year', 'Tech Innovation Award'],
      socialMedia: {
        linkedin: 'https://linkedin.com/in/roberto.lopez',
        twitter: 'https://twitter.com/roberto.lopez'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await collection.insertMany(sampleData);
  console.log('✓ Alumni yearbook sample data added');
}

async function addSampleFacultyStaffData(db, schoolYearId) {
  const collection = db.collection('FacultyStaff_yearbook');
  
  const sampleData = [
    {
      schoolYearId,
      status: 'approved',
      fullName: 'Dr. Patricia Ann Reyes',
      nickname: 'Dr. Pat',
      age: 45,
      gender: 'Female',
      birthday: new Date('1979-09-30'),
      address: '147 Birch St, Quezon City',
      email: 'patricia.reyes@example.com',
      phone: '+63 978 901 2345',
      department: 'Faculty & Staff',
      position: 'Program Head - BSIT',
      yearsOfService: 15,
      office: 'IT Department Office',
      courses: ['Programming', 'Database Management', 'Software Engineering'],
      additionalRoles: ['Research Coordinator', 'Student Affairs Advisor'],
      sayingMotto: 'Education is the foundation of success',
      dreamJob: 'Educational Consultant',
      bio: 'Dedicated educator with passion for technology and student development.',
      hobbies: ['Research', 'Reading', 'Travel'],
      honors: ['Outstanding Faculty Award', 'Research Excellence Award'],
      achievements: ['Published 20+ Research Papers', 'International Conference Speaker'],
      socialMedia: {
        linkedin: 'https://linkedin.com/in/patricia.reyes',
        facebook: 'https://facebook.com/patricia.reyes'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      schoolYearId,
      status: 'approved',
      fullName: 'Mr. Eduardo Manuel Torres',
      nickname: 'Sir Ed',
      age: 38,
      gender: 'Male',
      birthday: new Date('1986-01-15'),
      address: '258 Spruce St, Marikina City',
      email: 'eduardo.torres@example.com',
      phone: '+63 989 012 3456',
      department: 'Faculty & Staff',
      position: 'IT Support Specialist',
      yearsOfService: 8,
      office: 'IT Support Office',
      additionalRoles: ['Network Administrator', 'Hardware Maintenance'],
      sayingMotto: 'Technology serves education',
      dreamJob: 'IT Director',
      bio: 'Technical support professional ensuring smooth technology operations.',
      hobbies: ['Technology', 'Gaming', 'Photography'],
      honors: ['Employee of the Year'],
      achievements: ['System Optimization Award', 'Zero Downtime Achievement'],
      socialMedia: {
        linkedin: 'https://linkedin.com/in/eduardo.torres'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await collection.insertMany(sampleData);
  console.log('✓ Faculty & Staff yearbook sample data added');
}

// Run the seeding function
seedYearbookCollections().catch(console.error);
