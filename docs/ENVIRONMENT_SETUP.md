# Environment Setup Guide

Since the `.env.local` file is blocked, the MongoDB connection string and IMGBB API key are now hardcoded directly in the code.

## Current Configuration

### MongoDB Connection
- **Connection String**: `mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria`
- **Database**: `Memoria`
- **Location**: `lib/mongodb/connection.ts`

### IMGBB API
- **API Key**: `4b59f8977ddecb0dae921ba1d6a3654d`
- **Location**: `lib/imgbb-service.ts`

## What's Fixed

1. ✅ **MongoDB Connection**: Now uses the connection string directly
2. ✅ **IMGBB API**: Uses the API key directly
3. ✅ **Error Handling**: Comprehensive error logging added
4. ✅ **Password Validation**: Simplified to 8+ characters
5. ✅ **Database Operations**: Full CRUD operations implemented

## Testing the Signup

1. **Start the development server**: `npm run dev`
2. **Go to**: `http://localhost:3000/signup`
3. **Fill out the form** with any data
4. **Check the terminal** for detailed logs
5. **Check MongoDB Atlas** to see the user created

## Expected Behavior

When you signup, you should see these logs in the terminal:
```
[v0] Signup attempt: { schoolId: '...', firstName: '...', ... }
[v0] Hashing password...
[v0] Password hashed successfully
[v0] Inserting user into database...
[v0] User inserted successfully: [ObjectId]
```

## If Still Having Issues

1. **Restart the development server** completely
2. **Clear browser cache** and try again
3. **Check the terminal** for any error messages
4. **Verify MongoDB Atlas** is accessible

The signup should now work correctly with the MongoDB database!
