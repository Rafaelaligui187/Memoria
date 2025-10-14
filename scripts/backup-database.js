// Database Backup Script
// This script creates backups of your MongoDB collections
// Run with: node scripts/backup-database.js

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria';
const client = new MongoClient(MONGODB_URI);

async function backupDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    
    // Create backup directory
    const backupDir = `backups/backup-${new Date().toISOString().split('T')[0]}`;
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    console.log(`Creating backup in: ${backupDir}`);
    
    // Backup each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = db.collection(collectionName);
      const documents = await collection.find({}).toArray();
      
      const backupFile = path.join(backupDir, `${collectionName}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(documents, null, 2));
      
      console.log(`✅ Backed up ${collectionName}: ${documents.length} documents`);
    }
    
    console.log(`\n✅ Backup completed successfully!`);
    console.log(`Backup location: ${backupDir}`);
    
  } catch (error) {
    console.error('Error creating backup:', error);
  } finally {
    await client.close();
  }
}

backupDatabase().catch(console.error);
