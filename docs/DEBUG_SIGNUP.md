# Debug Signup Issues

## Steps to Debug the Internal Server Error

### 1. Check Development Server Logs
Make sure your development server is running:
```bash
npm run dev
```

Look for console logs that start with `[v0]` in your terminal.

### 2. Test with Simple Data
Try signing up with this exact data:
- **School ID**: `TEST-001`
- **First Name**: `Test`
- **Last Name**: `User`
- **Email**: `test@example.com`
- **Password**: `password123`
- **Role**: `Student`

### 3. Check Browser Network Tab
1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Try to signup
4. Look for the `/api/auth` request
5. Check the response status and error message

### 4. Common Issues and Solutions

#### Issue 1: MongoDB Connection
**Error**: "Failed to connect to MongoDB"
**Solution**: Check your `.env.local` file has:
```
MONGODB_URI=mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria
```

#### Issue 2: Password Validation
**Error**: "Password does not meet requirements"
**Solution**: Use a password that's at least 8 characters long

#### Issue 3: Duplicate User
**Error**: "User with this email or school ID already exists"
**Solution**: Try with a different email or school ID

#### Issue 4: Missing Fields
**Error**: "All fields are required"
**Solution**: Make sure all form fields are filled

### 5. Server-Side Debugging
The API now includes detailed logging. Check your terminal for:
- `[v0] Signup attempt:` - Shows the data being sent
- `[v0] Hashing password...` - Password hashing process
- `[v0] User inserted successfully:` - Database insertion
- `[v0] Signup error:` - Any errors that occur

### 6. Test API Directly
You can test the API directly using curl:
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "signup",
    "schoolId": "TEST-002",
    "firstName": "Test",
    "lastName": "User",
    "email": "test2@example.com",
    "password": "password123",
    "userType": "student"
  }'
```

### 7. Check MongoDB Atlas
1. Go to your MongoDB Atlas dashboard
2. Check the `Memoria` database
3. Look in the `users` collection
4. See if new users are being created

### 8. Environment Variables
Make sure your `.env.local` file contains:
```env
MONGODB_URI=mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria
IMGBB_API_KEY=4b59f8977ddecb0dae921ba1d6a3654d
```

### 9. Restart Development Server
If you made changes to environment variables:
1. Stop the development server (Ctrl+C)
2. Run `npm run dev` again
3. Try signup again

### 10. Check for TypeScript Errors
Run the linter to check for any TypeScript errors:
```bash
npm run lint
```

## Expected Behavior
When signup is successful, you should see:
1. Console log: `[v0] User inserted successfully: [ObjectId]`
2. Success message in the UI
3. Redirect to dashboard
4. User data stored in MongoDB

## If Still Having Issues
1. Check the browser console for JavaScript errors
2. Check the terminal for server errors
3. Verify MongoDB connection is working
4. Try with different test data
5. Check if the development server is running on the correct port (3000)
