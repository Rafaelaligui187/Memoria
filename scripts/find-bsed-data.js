// Find where BSED student data is actually stored
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function findBSEDData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Checking all collections for BSED data...\n');
    
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      
      console.log(`${collectionName}: ${count} documents`);
      
      if (count > 0) {
        // Check for BSED students
        const bsedCount = await collection.countDocuments({ courseProgram: "BSED" });
        if (bsedCount > 0) {
          console.log(`  -> Found ${bsedCount} BSED students!`);
          const bsedDocs = await collection.find({ courseProgram: "BSED" }).limit(3).toArray();
          bsedDocs.forEach(doc => {
            console.log(`  -> ${doc.fullName} (${doc.email}) - Major field exists: ${doc.major !== undefined}`);
          });
        }
        
        // Check for Brian specifically
        const brianCount = await collection.countDocuments({ fullName: { $regex: /Brian/i } });
        if (brianCount > 0) {
          console.log(`  -> Found ${brianCount} Brian documents!`);
          const brianDocs = await collection.find({ fullName: { $regex: /Brian/i } }).toArray();
          brianDocs.forEach(doc => {
            console.log(`  -> ${doc.fullName} (${doc.email}) - Course: ${doc.courseProgram} - Major field exists: ${doc.major !== undefined}`);
          });
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

findBSEDData();
