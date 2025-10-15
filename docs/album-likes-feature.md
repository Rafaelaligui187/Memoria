# Album Likes Feature Documentation

## Overview

The Album Likes feature allows users to like/unlike albums in the Gallery section. The system stores user preferences persistently in the database and maintains state across sessions.

## Features

- ✅ **Persistent Storage**: User likes are stored in MongoDB database
- ✅ **Session Persistence**: Likes persist across login/logout cycles
- ✅ **Real-time Updates**: Like counts update immediately
- ✅ **Visual Feedback**: Liked albums show with red styling
- ✅ **Authentication Required**: Only authenticated users can like albums
- ✅ **Duplicate Prevention**: Users can only like each album once
- ✅ **Global State Management**: Uses React Context for consistent state

## Database Schema

### Collection: `album_likes`

```javascript
{
  _id: ObjectId,
  id: string,           // Unique like ID
  userId: string,       // User who liked the album
  albumId: string,      // Album that was liked
  createdAt: string,   // ISO timestamp
  userEmail?: string,  // Optional user email
  userSchoolId?: string // Optional user school ID
}
```

### Indexes

- **Unique Compound Index**: `{ userId: 1, albumId: 1 }` - Prevents duplicate likes
- **Album Index**: `{ albumId: 1 }` - Fast album lookups
- **User Index**: `{ userId: 1 }` - Fast user lookups
- **Time Index**: `{ createdAt: 1 }` - Chronological queries

## API Endpoints

### GET `/api/gallery/likes`

**Query Parameters:**
- `albumId` - Get like status for specific album
- `albumIds` - Get like status for multiple albums (comma-separated)
- `userId` - Get likes for specific user (optional, defaults to current user)

**Response:**
```json
{
  "success": true,
  "data": {
    "albumId": "album_123",
    "totalLikes": 42,
    "isLikedByUser": true
  }
}
```

### POST `/api/gallery/likes`

**Body:**
```json
{
  "albumId": "album_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "like": { /* like object */ },
    "stats": {
      "albumId": "album_123",
      "totalLikes": 43,
      "isLikedByUser": true
    }
  }
}
```

### DELETE `/api/gallery/likes?albumId=album_123`

**Response:**
```json
{
  "success": true,
  "data": {
    "removed": true,
    "stats": {
      "albumId": "album_123",
      "totalLikes": 42,
      "isLikedByUser": false
    }
  }
}
```

## Components

### AlbumLikeButton

A reusable component for liking albums.

**Props:**
```typescript
interface AlbumLikeButtonProps {
  albumId: string
  initialLikeCount?: number
  initialIsLiked?: boolean
  className?: string
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  onLikeChange?: (isLiked: boolean, count: number) => void
}
```

**Usage:**
```tsx
<AlbumLikeButton
  albumId="album_123"
  size="lg"
  showCount={true}
  onLikeChange={(isLiked, count) => console.log(`Album ${isLiked ? 'liked' : 'unliked'}, count: ${count}`)}
/>
```

### AlbumLikeProvider

Context provider for global like state management.

**Usage:**
```tsx
import { AlbumLikeProvider } from '@/contexts/album-likes-context'

function App() {
  return (
    <AlbumLikeProvider>
      {/* Your app components */}
    </AlbumLikeProvider>
  )
}
```

### useAlbumLikes Hook

Hook for accessing like state and functions.

**Returns:**
```typescript
{
  likedAlbums: Set<string>           // Set of liked album IDs
  isLoading: boolean                // Loading state
  toggleLike: (albumId: string, isLiked: boolean) => void
  isAlbumLiked: (albumId: string) => boolean
  refreshLikes: () => Promise<void>
}
```

## Integration Points

### Gallery Page (`/gallery`)

- Like buttons added to each album card
- Shows like status without count (compact view)
- Integrated with existing album filtering and search

### Gallery Detail Page (`/gallery/[id]`)

- Large like button with count display
- Real-time like count updates
- Engagement metrics section shows actual like counts

### Authentication Integration

- Uses existing `getCurrentUser()` function
- Requires user authentication to like albums
- Automatically loads user likes on login
- Clears likes state on logout

## Visual Design

### Liked State
- **Color**: Red (`text-red-600`, `border-red-200`, `bg-red-50`)
- **Icon**: Filled heart (`fill-current`)
- **Hover**: Darker red background (`hover:bg-red-100`)

### Unliked State
- **Color**: Blue (`text-blue-600`, `border-blue-200`)
- **Icon**: Outline heart
- **Hover**: Light blue background (`hover:bg-blue-50`)

### Loading State
- **Icon**: Spinning loader (`animate-spin`)
- **Button**: Disabled during API calls

## Error Handling

- **Authentication Required**: Shows toast notification
- **Network Errors**: Displays error messages
- **Duplicate Likes**: Prevents duplicate likes via database constraints
- **API Failures**: Graceful fallback with user feedback

## Performance Optimizations

- **Database Indexes**: Optimized queries for fast lookups
- **Context State**: Prevents unnecessary API calls
- **Batch Operations**: Multiple album stats in single request
- **Lazy Loading**: Like counts loaded on demand

## Testing

### Database Tests
Run `node scripts/test-album-likes.js` to test:
- Like creation
- Like removal
- Like counting
- User like queries
- Duplicate prevention

### Manual Testing Checklist

1. **Authentication Flow**
   - [ ] Login required to like albums
   - [ ] Likes persist after logout/login
   - [ ] Logout clears like state

2. **Like Functionality**
   - [ ] Can like albums
   - [ ] Can unlike albums
   - [ ] Cannot like same album twice
   - [ ] Like counts update immediately

3. **Visual Feedback**
   - [ ] Liked albums show red styling
   - [ ] Unliked albums show blue styling
   - [ ] Loading states work correctly
   - [ ] Toast notifications appear

4. **Cross-Session Persistence**
   - [ ] Likes persist across browser sessions
   - [ ] Likes persist across different devices
   - [ ] Like counts are accurate after refresh

## Setup Instructions

1. **Database Initialization**
   ```bash
   node scripts/initialize-album-likes-collection.js
   ```

2. **Add Provider to Layout**
   ```tsx
   // app/layout.tsx
   import { AlbumLikeProvider } from '@/contexts/album-likes-context'
   
   <AlbumLikeProvider>
     {children}
   </AlbumLikeProvider>
   ```

3. **Use Components**
   ```tsx
   import { AlbumLikeButton } from '@/components/album-like-button'
   
   <AlbumLikeButton albumId={album.id} />
   ```

## Troubleshooting

### Common Issues

1. **Likes not persisting**
   - Check database connection
   - Verify user authentication
   - Check API endpoint responses

2. **Like counts not updating**
   - Check context provider setup
   - Verify API calls are successful
   - Check for JavaScript errors

3. **Duplicate likes**
   - Check database indexes
   - Verify unique constraints
   - Check API validation

### Debug Commands

```bash
# Test database functionality
node scripts/test-album-likes.js

# Check database indexes
node -e "
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria');
client.connect().then(async () => {
  const db = client.db('Memoria');
  const indexes = await db.collection('album_likes').indexes();
  console.log('Indexes:', indexes);
  await client.close();
});
"
```

## Future Enhancements

- **Like Notifications**: Notify album creators of new likes
- **Like Analytics**: Track most liked albums
- **Social Features**: Show who liked albums (with privacy controls)
- **Bulk Operations**: Like/unlike multiple albums at once
- **Export Likes**: Allow users to export their liked albums
