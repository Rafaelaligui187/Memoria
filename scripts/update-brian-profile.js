// Update Brian Juntong's profile to include major field
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function updateBrianProfile() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('College_yearbook');
    
    // Find Brian Juntong's profile
    const brianProfile = await collection.findOne({ fullName: "Brian Juntong" });
    
    if (brianProfile) {
      console.log('Found Brian Juntong profile:', brianProfile._id);
      console.log('Current course program:', brianProfile.courseProgram);
      console.log('Current major field:', brianProfile.major);
      
      // Update the profile to include major field
      const updateResult = await collection.updateOne(
        { _id: brianProfile._id },
        { 
          $set: { 
            major: "English", // Set a default major for BSED
            updatedAt: new Date()
          } 
        }
      );
      
      if (updateResult.modifiedCount > 0) {
        console.log('Successfully updated Brian Juntong profile with major field');
        
        // Verify the update
        const updatedProfile = await collection.findOne({ _id: brianProfile._id });
        console.log('Updated profile major field:', updatedProfile.major);
      } else {
        console.log('Failed to update Brian Juntong profile');
      }
    } else {
      console.log('Brian Juntong profile not found');
    }
    
    // Check all BSED students again
    const bsedStudents = await collection.find({ courseProgram: "BSED" }).toArray();
    console.log(`\nTotal BSED students in College_yearbook: ${bsedStudents.length}`);
    
    bsedStudents.forEach(student => {
      console.log(`- ${student.fullName}: Major = ${student.major || 'NOT SET'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateBrianProfile();
