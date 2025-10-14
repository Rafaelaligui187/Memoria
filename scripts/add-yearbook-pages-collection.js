// Add Yearbook Pages Collection Script
// Run with: node add-yearbook-pages-collection.js

const { MongoClient } = require('mongodb');

// MongoDB connection string - Update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';

async function addYearbookPagesCollection() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('Memoria');
    
    // Check if YearbookPages collection already exists
    const collections = await db.listCollections({ name: 'YearbookPages' }).toArray();
    
    if (collections.length > 0) {
      console.log('⚠️  YearbookPages collection already exists');
      return;
    }
    
    console.log('📄 Creating YearbookPages collection...');
    
    // Create the YearbookPages collection
    await db.createCollection('YearbookPages');
    console.log('✅ YearbookPages collection created successfully');
    
    // Create indexes for better performance
    console.log('🔍 Creating indexes...');
    
    const indexes = [
      // Basic indexes
      { schoolYearId: 1 },
      { schoolYear: 1 },
      { pageType: 1 },
      { pageNumber: 1 },
      { isPublished: 1 },
      { isTemplate: 1 },
      { createdBy: 1 },
      
      // Compound indexes for common queries
      { schoolYearId: 1, pageType: 1 },
      { schoolYearId: 1, pageNumber: 1 },
      { schoolYearId: 1, isPublished: 1 },
      { schoolYearId: 1, department: 1 },
      { schoolYearId: 1, section: 1 },
      
      // Text search index for page content
      { pageTitle: 'text', 'content.text': 'text' },
      
      // Timestamp indexes
      { createdAt: 1 },
      { updatedAt: 1 }
    ];
    
    for (const index of indexes) {
      try {
        await db.collection('YearbookPages').createIndex(index);
        console.log(`✅ Created index: ${JSON.stringify(index)}`);
      } catch (error) {
        console.log(`⚠️  Index creation failed for ${JSON.stringify(index)}: ${error.message}`);
      }
    }
    
    console.log('🎉 YearbookPages collection setup completed successfully!');
    
    // Insert sample template pages
    console.log('📝 Creating sample template pages...');
    
    const samplePages = [
      {
        schoolYearId: 'template',
        schoolYear: 'Template',
        pageType: 'cover',
        pageTitle: 'Yearbook Cover Template',
        pageNumber: 1,
        content: {
          text: 'Welcome to our yearbook!',
          images: [],
          layout: 'single-column'
        },
        createdBy: 'system',
        isPublished: false,
        isTemplate: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolYearId: 'template',
        schoolYear: 'Template',
        pageType: 'dedication',
        pageTitle: 'Dedication Page Template',
        pageNumber: 2,
        content: {
          text: 'This yearbook is dedicated to...',
          images: [],
          layout: 'single-column'
        },
        createdBy: 'system',
        isPublished: false,
        isTemplate: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolYearId: 'template',
        schoolYear: 'Template',
        pageType: 'table-of-contents',
        pageTitle: 'Table of Contents Template',
        pageNumber: 3,
        content: {
          text: 'Table of Contents\n\n1. Dedication\n2. Administration\n3. Faculty & Staff\n4. Students\n5. Activities\n6. Memories',
          images: [],
          layout: 'single-column'
        },
        createdBy: 'system',
        isPublished: false,
        isTemplate: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolYearId: 'template',
        schoolYear: 'Template',
        pageType: 'department',
        pageTitle: 'Department Page Template',
        pageNumber: 4,
        content: {
          text: 'Department Name\n\nDescription of the department...',
          images: [],
          layout: 'two-column'
        },
        department: 'College',
        createdBy: 'system',
        isPublished: false,
        isTemplate: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolYearId: 'template',
        schoolYear: 'Template',
        pageType: 'activities',
        pageTitle: 'Activities Page Template',
        pageNumber: 5,
        content: {
          text: 'School Activities\n\nDescription of various activities...',
          images: [],
          layout: 'grid'
        },
        createdBy: 'system',
        isPublished: false,
        isTemplate: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolYearId: 'template',
        schoolYear: 'Template',
        pageType: 'memories',
        pageTitle: 'Memories Page Template',
        pageNumber: 6,
        content: {
          text: 'Memories\n\nSpecial moments and memories...',
          images: [],
          layout: 'grid'
        },
        createdBy: 'system',
        isPublished: false,
        isTemplate: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        schoolYearId: 'template',
        schoolYear: 'Template',
        pageType: 'back-cover',
        pageTitle: 'Back Cover Template',
        pageNumber: 7,
        content: {
          text: 'Thank you for being part of our journey!',
          images: [],
          layout: 'single-column'
        },
        createdBy: 'system',
        isPublished: false,
        isTemplate: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const result = await db.collection('YearbookPages').insertMany(samplePages);
    console.log(`✅ Inserted ${result.insertedCount} sample template pages`);
    
    console.log('\n🎯 YearbookPages Collection Summary:');
    console.log('   - Collection Name: YearbookPages');
    console.log('   - Indexes Created: ' + indexes.length);
    console.log('   - Sample Templates: ' + samplePages.length);
    console.log('   - Ready for yearbook page management!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
addYearbookPagesCollection().catch(console.error);
