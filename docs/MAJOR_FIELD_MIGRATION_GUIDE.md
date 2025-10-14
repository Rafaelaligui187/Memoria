# Major Field Migration Guide

This guide explains how to add the `major` field to your database to support BSED major selection.

## 🎯 **What This Migration Does**

- Adds `major` field to all profile tables/collections
- Updates existing BSED students to have an empty major field
- Ensures new BSED profiles can store their selected major

## 📋 **Migration Scripts Created**

### 1. **SQL Migration (PostgreSQL/Supabase)**
- `scripts/add-major-field-migration.sql` - For local PostgreSQL
- `scripts/add-major-field-supabase-migration.sql` - For Supabase

### 2. **MongoDB Migration**
- `scripts/add-major-field-mongodb-migration.js` - For MongoDB collections

## 🚀 **How to Run the Migrations**

### **For Supabase (Recommended)**

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor

2. **Run the Migration**
   ```sql
   -- Copy and paste the contents of scripts/add-major-field-supabase-migration.sql
   -- Then click "Run" to execute
   ```

### **For MongoDB**

1. **Install MongoDB Driver** (if not already installed)
   ```bash
   npm install mongodb
   ```

2. **Run the Migration Script**
   ```bash
   node scripts/add-major-field-mongodb-migration.js
   ```

### **For Local PostgreSQL**

1. **Connect to your PostgreSQL database**
2. **Run the Migration**
   ```bash
   psql -d your_database_name -f scripts/add-major-field-migration.sql
   ```

## ✅ **Verification Steps**

### **Check if Migration Worked**

1. **For Supabase/PostgreSQL:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'student_profiles' 
   AND column_name = 'major';
   ```

2. **For MongoDB:**
   ```javascript
   // Check if major field exists in documents
   db.College_yearbook.findOne({courseProgram: "BSED"})
   ```

## 🔄 **What Happens After Migration**

### **For Existing BSED Students:**
- Major field will be empty (`''`)
- They can update their profile to select a major
- Admin approval system will show "Major in: [Selected Major]"

### **For New BSED Students:**
- Major dropdown will appear when they select BSED
- Major selection will be required
- Profile will be saved with major information

## 🎯 **Expected Results**

After running the migration:

1. ✅ **Database Schema**: `major` field exists in all profile tables/collections
2. ✅ **Profile Forms**: BSED students see majors dropdown (English, Math, Science)
3. ✅ **Admin Approval**: Shows "Major in: [Major Name]" for BSED students
4. ✅ **Profile Display**: Major information appears in all profile views

## 🚨 **Important Notes**

- **Backup First**: Always backup your database before running migrations
- **Test Environment**: Run migrations in a test environment first
- **Existing Data**: Existing BSED students will have empty major fields until they update their profiles
- **No Data Loss**: This migration only adds fields, it doesn't modify existing data

## 🔧 **Troubleshooting**

### **If Migration Fails:**

1. **Check Database Connection**: Ensure you can connect to your database
2. **Check Permissions**: Ensure you have ALTER TABLE permissions
3. **Check Field Exists**: The field might already exist (check for errors about duplicate columns)

### **If Major Field Still Doesn't Appear:**

1. **Clear Browser Cache**: Hard refresh your browser (Ctrl+F5)
2. **Restart Application**: Restart your Next.js development server
3. **Check Console**: Look for any JavaScript errors in browser console
4. **Verify Migration**: Confirm the migration actually ran successfully

## 📞 **Need Help?**

If you encounter issues:
1. Check the migration script output for errors
2. Verify your database connection
3. Ensure you have the correct permissions
4. Check that the field was actually added to the database
