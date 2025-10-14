// Debug MongoDB database to see what's actually there
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function debugDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(col => console.log(`- ${col.name}`));
    
    // Check College_yearbook collection
    const collegeCollection = db.collection('College_yearbook');
    const collegeCount = await collegeCollection.countDocuments();
    console.log(`\nCollege_yearbook documents: ${collegeCount}`);
    
    if (collegeCount > 0) {
      const sampleDoc = await collegeCollection.findOne();
      console.log('Sample document structure:');
      console.log(JSON.stringify(sampleDoc, null, 2));
    }
    
    // Check for any documents with courseProgram BSED
    const bsedDocs = await collegeCollection.find({ courseProgram: "BSED" }).toArray();
    console.log(`\nBSED documents found: ${bsedDocs.length}`);
    
    // Check for any documents with fullName Brian
    const brianDocs = await collegeCollection.find({ fullName: { $regex: /Brian/i } }).toArray();
    console.log(`Brian documents found: ${brianDocs.length}`);
    
    if (brianDocs.length > 0) {
      console.log('Brian documents:');
      brianDocs.forEach(doc => {
        console.log(`- Name: ${doc.fullName}, Course: ${doc.courseProgram}, Has major: ${doc.major !== undefined}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

debugDatabase();
