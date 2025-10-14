// Check for yearbook collection and other possible locations
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function findYearbookData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    
    // Check for yearbook collection (generic)
    const yearbookCollection = db.collection('yearbook');
    const yearbookCount = await yearbookCollection.countDocuments();
    console.log(`yearbook collection: ${yearbookCount} documents`);
    
    if (yearbookCount > 0) {
      // Check for BSED students
      const bsedCount = await yearbookCollection.countDocuments({ courseProgram: "BSED" });
      console.log(`BSED students in yearbook: ${bsedCount}`);
      
      if (bsedCount > 0) {
        const bsedDocs = await yearbookCollection.find({ courseProgram: "BSED" }).toArray();
        bsedDocs.forEach(doc => {
          console.log(`- ${doc.fullName} (${doc.email}) - Major field exists: ${doc.major !== undefined}`);
        });
      }
      
      // Check for Brian
      const brianDocs = await yearbookCollection.find({ fullName: { $regex: /Brian/i } }).toArray();
      console.log(`Brian documents in yearbook: ${brianDocs.length}`);
      
      if (brianDocs.length > 0) {
        brianDocs.forEach(doc => {
          console.log(`- ${doc.fullName} (${doc.email}) - Course: ${doc.courseProgram} - Major field exists: ${doc.major !== undefined}`);
        });
      }
    }
    
    // Check users collection for profile data
    const usersCollection = db.collection('users');
    const usersCount = await usersCollection.countDocuments();
    console.log(`\nusers collection: ${usersCount} documents`);
    
    if (usersCount > 0) {
      const sampleUser = await usersCollection.findOne();
      console.log('Sample user structure:');
      console.log(JSON.stringify(sampleUser, null, 2));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

findYearbookData();
