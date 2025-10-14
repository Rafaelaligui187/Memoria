// Check if there are any students with blocks E or F in the database
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function checkBlocksEF() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Check for students with blocks E or F
    console.log('Checking for students with blocks E or F...');
    
    const studentsEF = await collection.find({
      userType: 'student',
      blockSection: { $regex: /IT-[EF]|CS-[EF]|ED-[EF]|HM-[EF]|ENT-[EF]|PED-[EF]/ }
    }).toArray();
    
    console.log(`Found ${studentsEF.length} students with blocks E or F:`);
    
    studentsEF.forEach((student, index) => {
      console.log(`\n${index + 1}. Student:`);
      console.log('  _id:', student._id);
      console.log('  fullName:', student.fullName);
      console.log('  courseProgram:', student.courseProgram);
      console.log('  blockSection:', student.blockSection);
      console.log('  yearLevel:', student.yearLevel);
    });
    
    // Check all unique block sections in the database
    console.log('\n--- All Unique Block Sections in Database ---');
    const uniqueBlocks = await collection.distinct('blockSection', { userType: 'student' });
    console.log('Unique block sections:', uniqueBlocks.sort());
    
    // Check if any blocks E or F exist
    const hasBlocksEF = uniqueBlocks.some(block => 
      block.includes('-E') || block.includes('-F') || 
      block.includes('Block E') || block.includes('Block F')
    );
    
    console.log('\nHas blocks E or F:', hasBlocksEF);
    
    if (!hasBlocksEF) {
      console.log('\n📝 No students currently have blocks E or F in the database.');
      console.log('To add support for blocks E and F, we need to:');
      console.log('1. Update the BlockId type definition');
      console.log('2. Add block-e and block-f to the static data (if needed)');
      console.log('3. Update any validation logic');
    }
    
  } catch (error) {
    console.error('Error checking blocks E and F:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

checkBlocksEF();
