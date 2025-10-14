# MongoDB and IMGBB Integration Setup

This document explains the changes made to switch from Supabase to MongoDB and integrate IMGBB for image uploads.

## Changes Made

### 1. Database Migration
- **From**: Supabase PostgreSQL
- **To**: MongoDB Atlas
- **Connection**: `mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria`

### 2. Image Upload Service
- **From**: Supabase Storage
- **To**: IMGBB API
- **API Key**: `4b59f8977ddecb0dae921ba1d6a3654d`

## New Files Created

### Database Layer
- `lib/mongodb/connection.ts` - MongoDB connection utility
- `lib/mongodb-database.ts` - MongoDB database implementation
- `lib/database.ts` - Updated to use MongoDB instead of Supabase

### Image Upload Layer
- `lib/imgbb-service.ts` - IMGBB API integration
- `lib/image-upload-utils.ts` - Image processing utilities

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria

# IMGBB API Configuration
IMGBB_API_KEY=4b59f8977ddecb0dae921ba1d6a3654d

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Dependencies Added

```bash
npm install mongodb mongoose
```

## Database Collections

The following collections will be created in MongoDB:

- `school_years` - School year management
- `users` - User accounts
- `student_profiles` - Student profile data
- `faculty_profiles` - Faculty profile data
- `alumni_profiles` - Alumni profile data
- `staff_profiles` - Staff profile data
- `utility_profiles` - Utility staff profile data
- `albums` - Photo albums
- `photos` - Photo metadata
- `moderation_items` - Content moderation
- `reports` - User reports
- `notifications` - User notifications
- `audit_logs` - System audit logs
- `school_histories` - School history content
- `rejection_reasons` - Profile rejection reasons
- `email_queue` - Email queue management

## Image Upload Features

### IMGBB Integration
- Automatic image compression
- Multiple image upload support
- Thumbnail generation
- File type validation
- Size limit enforcement (5MB default)

### Image Processing
- Automatic compression with quality control
- Aspect ratio preservation
- Multiple format support (JPEG, PNG, GIF, WebP)
- Preview generation

## Usage Examples

### Upload Profile Image
```typescript
import { uploadProfileImage } from '@/lib/image-upload-utils'

const result = await uploadProfileImage(file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  quality: 0.8
})

if (result.success) {
  console.log('Image URL:', result.url)
  console.log('Thumbnail URL:', result.thumbnailUrl)
}
```

### Upload Gallery Images
```typescript
import { uploadMultipleImages } from '@/lib/image-upload-utils'

const results = await uploadMultipleImages(files)
const successfulUploads = results.filter(r => r.success)
```

### Database Operations
```typescript
import { db } from '@/lib/database'

// Create a profile
const profile = await db.createProfile('student', {
  fullName: 'John Doe',
  email: 'john@example.com',
  // ... other fields
})

// Get profiles
const profiles = await db.getProfiles('2024-2025', 'student')
```

## Migration Notes

### From Supabase to MongoDB
1. All database operations now use MongoDB collections
2. Object IDs are used instead of UUIDs
3. Date handling remains the same
4. All existing interfaces are preserved

### From Supabase Storage to IMGBB
1. Images are now stored on IMGBB servers
2. URLs are returned for both full-size and thumbnail images
3. Automatic compression is applied before upload
4. File validation is handled client-side

## Testing

To test the integration:

1. Set up environment variables
2. Start the development server: `npm run dev`
3. Try uploading an image in the profile setup form
4. Check MongoDB Atlas for data storage
5. Verify IMGBB URLs are working

## Troubleshooting

### MongoDB Connection Issues
- Verify the connection string is correct
- Check network access in MongoDB Atlas
- Ensure the database user has proper permissions

### IMGBB Upload Issues
- Verify the API key is correct
- Check file size limits (5MB default)
- Ensure file types are supported
- Check network connectivity

### Image Processing Issues
- Verify browser support for canvas operations
- Check file size before processing
- Ensure proper error handling in upload functions
