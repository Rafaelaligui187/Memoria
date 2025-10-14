const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

const seedData = [
  {
    label: "2024–2025",
    status: "active",
    startDate: "2024-08-01",
    endDate: "2025-07-31",
    profileCount: 0,
    albumCount: 0,
    pendingCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    label: "2023–2024",
    status: "archived",
    startDate: "2023-08-01",
    endDate: "2024-07-31",
    profileCount: 0,
    albumCount: 0,
    pendingCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    label: "2022–2023",
    status: "archived",
    startDate: "2022-08-01",
    endDate: "2023-07-31",
    profileCount: 0,
    albumCount: 0,
    pendingCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seedSchoolYears() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('Memoria');
    const collection = db.collection('school_years');
    
    // Check if collection already has data
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Collection already has ${existingCount} documents. Skipping seed.`);
      return;
    }
    
    // Insert seed data
    const result = await collection.insertMany(seedData);
    console.log(`Successfully inserted ${result.insertedCount} school years`);
    
    // Create indexes for better performance
    await collection.createIndex({ label: 1 }, { unique: true });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ startDate: -1 });
    
    console.log('Indexes created successfully');
    
  } catch (error) {
    console.error('Error seeding school years:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedSchoolYears().catch(console.error);
