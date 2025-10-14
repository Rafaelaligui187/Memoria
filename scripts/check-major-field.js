// Check if major field exists in MongoDB documents
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function checkMajorField() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Check if major field exists in any document
    const documentsWithMajor = await collection.find({ major: { $exists: true } }).toArray();
    console.log(`Documents with major field: ${documentsWithMajor.length}`);
    
    // Check Brian Juntong's specific document
    const brianDoc = await collection.findOne({ fullName: "Brian Juntong" });
    if (brianDoc) {
      console.log('Brian Juntong document found:');
      console.log('Has major field:', brianDoc.major !== undefined);
      console.log('Major value:', brianDoc.major);
      console.log('Course Program:', brianDoc.courseProgram);
    } else {
      console.log('Brian Juntong document not found');
    }
    
    // Check all BSED students
    const bsedStudents = await collection.find({ courseProgram: "BSED" }).toArray();
    console.log(`Total BSED students: ${bsedStudents.length}`);
    
    for (const student of bsedStudents) {
      console.log(`Student: ${student.fullName}, Has major: ${student.major !== undefined}, Major value: ${student.major}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkMajorField();
