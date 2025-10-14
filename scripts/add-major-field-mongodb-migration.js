// MongoDB migration script to add major field to existing profiles
// This script adds the major field to existing BSED student profiles

const { MongoClient } = require('mongodb');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function addMajorFieldToExistingProfiles() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    
    // List of collections to update
    const collections = [
      'College_yearbook',
      'SeniorHigh_yearbook', 
      'JuniorHigh_yearbook',
      'Elementary_yearbook',
      'FacultyStaff_yearbook',
      'Alumni_yearbook'
    ];
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      
      // Add major field to all documents that don't have it
      const result = await collection.updateMany(
        { major: { $exists: false } },
        { $set: { major: '' } }
      );
      
      console.log(`Updated ${result.modifiedCount} documents in ${collectionName}`);
      
      // Specifically update BSED students to have empty major field
      const bsedResult = await collection.updateMany(
        { 
          courseProgram: 'BSED',
          major: { $in: [null, ''] }
        },
        { $set: { major: '' } }
      );
      
      console.log(`Updated ${bsedResult.modifiedCount} BSED students in ${collectionName}`);
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

// Run the migration
addMajorFieldToExistingProfiles();
