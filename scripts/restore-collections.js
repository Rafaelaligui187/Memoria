// Database Collections Restoration Script
// Run with: node restore-collections.js

const { MongoClient } = require('mongodb');

// MongoDB connection string - Update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

// Required collections for Memoria yearbook system
const REQUIRED_COLLECTIONS = [
  // Yearbook Collections
  'College_yearbook',
  'SeniorHigh_yearbook', 
  'JuniorHigh_yearbook',
  'Elementary_yearbook',
  'Alumni_yearbook',
  'FacultyStaff_yearbook',
  'YearbookPages',
  
  // System Collections
  'SchoolYears',
  'users',
  'notifications',
  'reports'
];

// Indexes to create for better performance
const COLLECTION_INDEXES = {
  'College_yearbook': [
    { schoolYearId: 1 },
    { fullName: 1 },
    { email: 1 },
    { status: 1 },
    { department: 1 },
    { yearLevel: 1 },
    { courseProgram: 1 },
    { blockSection: 1 },
    { ownedBy: 1 }
  ],
  'SeniorHigh_yearbook': [
    { schoolYearId: 1 },
    { fullName: 1 },
    { email: 1 },
    { status: 1 },
    { department: 1 },
    { yearLevel: 1 },
    { courseProgram: 1 },
    { blockSection: 1 },
    { ownedBy: 1 }
  ],
  'JuniorHigh_yearbook': [
    { schoolYearId: 1 },
    { fullName: 1 },
    { email: 1 },
    { status: 1 },
    { department: 1 },
    { yearLevel: 1 },
    { blockSection: 1 },
    { ownedBy: 1 }
  ],
  'Elementary_yearbook': [
    { schoolYearId: 1 },
    { fullName: 1 },
    { email: 1 },
    { status: 1 },
    { department: 1 },
    { yearLevel: 1 },
    { blockSection: 1 },
    { ownedBy: 1 }
  ],
  'Alumni_yearbook': [
    { schoolYearId: 1 },
    { fullName: 1 },
    { email: 1 },
    { status: 1 },
    { department: 1 },
    { graduationYear: 1 },
    { ownedBy: 1 }
  ],
  'FacultyStaff_yearbook': [
    { schoolYearId: 1 },
    { fullName: 1 },
    { email: 1 },
    { status: 1 },
    { department: 1 },
    { position: 1 },
    { ownedBy: 1 }
  ],
  'YearbookPages': [
    { schoolYearId: 1 },
    { schoolYear: 1 },
    { pageType: 1 },
    { pageNumber: 1 },
    { isPublished: 1 },
    { isTemplate: 1 },
    { createdBy: 1 },
    { schoolYearId: 1, pageType: 1 },
    { schoolYearId: 1, pageNumber: 1 },
    { schoolYearId: 1, isPublished: 1 },
    { schoolYearId: 1, department: 1 },
    { schoolYearId: 1, section: 1 },
    { pageTitle: 'text', 'content.text': 'text' },
    { createdAt: 1 },
    { updatedAt: 1 }
  ],
  'SchoolYears': [
    { yearLabel: 1 },
    { isActive: 1 },
    { startDate: 1 },
    { endDate: 1 }
  ],
  'users': [
    { email: 1 },
    { role: 1 },
    { createdAt: 1 }
  ],
  'notifications': [
    { recipient: 1 },
    { status: 1 },
    { createdAt: 1 }
  ],
  'reports': [
    { reportType: 1 },
    { status: 1 },
    { createdAt: 1 }
  ]
};

async function checkCollections() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collections = await db.listCollections().toArray();
    const existingCollections = collections.map(col => col.name);
    
    console.log('\n📊 EXISTING COLLECTIONS:');
    existingCollections.forEach(col => {
      if (REQUIRED_COLLECTIONS.includes(col)) {
        console.log(`✅ ${col}`);
      } else {
        console.log(`ℹ️  ${col} (additional)`);
      }
    });
    
    console.log('\n❌ MISSING COLLECTIONS:');
    const missingCollections = REQUIRED_COLLECTIONS.filter(col => !existingCollections.includes(col));
    missingCollections.forEach(col => console.log(`❌ ${col}`));
    
    if (missingCollections.length === 0) {
      console.log('\n🎉 All required collections exist!');
    } else {
      console.log(`\n⚠️  ${missingCollections.length} collections are missing`);
    }
    
    // Check data counts
    console.log('\n📈 DATA COUNTS:');
    for (const collectionName of existingCollections) {
      if (REQUIRED_COLLECTIONS.includes(collectionName)) {
        const count = await db.collection(collectionName).countDocuments();
        console.log(`${collectionName}: ${count} documents`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking collections:', error.message);
  } finally {
    await client.close();
  }
}

async function createMissingCollections() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    console.log('🔧 Creating missing collections...');
    
    const db = client.db('Memoria');
    const collections = await db.listCollections().toArray();
    const existingCollections = collections.map(col => col.name);
    
    for (const collectionName of REQUIRED_COLLECTIONS) {
      if (!existingCollections.includes(collectionName)) {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
        
        // Create indexes for the collection
        if (COLLECTION_INDEXES[collectionName]) {
          for (const index of COLLECTION_INDEXES[collectionName]) {
            try {
              await db.collection(collectionName).createIndex(index);
              console.log(`  📊 Created index: ${JSON.stringify(index)}`);
            } catch (indexError) {
              console.log(`  ⚠️  Index creation failed: ${indexError.message}`);
            }
          }
        }
      } else {
        console.log(`ℹ️  Collection already exists: ${collectionName}`);
      }
    }
    
    console.log('\n🎉 Collection restoration completed!');
    
  } catch (error) {
    console.error('❌ Error creating collections:', error.message);
  } finally {
    await client.close();
  }
}

async function addSampleSchoolYear() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    console.log('📅 Adding sample school year...');
    
    const db = client.db('Memoria');
    const schoolYearsCollection = db.collection('SchoolYears');
    
    // Check if school year already exists
    const existingYear = await schoolYearsCollection.findOne({ yearLabel: '2025-2026' });
    if (existingYear) {
      console.log('ℹ️  School year 2025-2026 already exists');
      return;
    }
    
    // Add sample school year
    const sampleSchoolYear = {
      yearLabel: '2025-2026',
      startDate: new Date('2025-08-01'),
      endDate: new Date('2026-07-31'),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await schoolYearsCollection.insertOne(sampleSchoolYear);
    console.log('✅ Added sample school year: 2025-2026');
    
  } catch (error) {
    console.error('❌ Error adding sample school year:', error.message);
  } finally {
    await client.close();
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  
  console.log('🏫 Memoria Database Collections Restoration Tool');
  console.log('================================================');
  
  switch (command) {
    case 'check':
      await checkCollections();
      break;
    case 'create':
      await createMissingCollections();
      break;
    case 'sample':
      await addSampleSchoolYear();
      break;
    case 'all':
      await createMissingCollections();
      await addSampleSchoolYear();
      await checkCollections();
      break;
    default:
      console.log('Usage:');
      console.log('  node restore-collections.js check   - Check existing collections');
      console.log('  node restore-collections.js create  - Create missing collections');
      console.log('  node restore-collections.js sample   - Add sample school year');
      console.log('  node restore-collections.js all     - Do everything');
      break;
  }
}

main().catch(console.error);
