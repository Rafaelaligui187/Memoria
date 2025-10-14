// Database Restoration Script
// This script helps restore MongoDB collections
// Run with: node scripts/restore-database.js

const { MongoClient } = require('mongodb');

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';
const client = new MongoClient(MONGODB_URI);

// Collections that should exist in your yearbook system
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

async function checkCollections() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    const existingCollections = collections.map(col => col.name);
    
    console.log('\n=== EXISTING COLLECTIONS ===');
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
    
  } catch (error) {
    console.error('Error checking collections:', error);
  } finally {
    await client.close();
  }
}

async function createMissingCollections() {
  try {
    await client.connect();
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
    console.error('Error creating collections:', error);
  } finally {
    await client.close();
  }
}

// Main function
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'check':
      await checkCollections();
      break;
    case 'create':
      await createMissingCollections();
      break;
    default:
      console.log('Usage:');
      console.log('  node scripts/restore-database.js check   - Check existing collections');
      console.log('  node scripts/restore-database.js create  - Create missing collections');
      break;
  }
}

main().catch(console.error);
