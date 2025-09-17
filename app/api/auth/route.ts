import { NextResponse } from "next/server"

// This is a simple mock authentication API
// In a real application, you would use a proper authentication system
// like NextAuth.js, Auth0, or a custom solution with a database

// Mock user database
const users = [
  {
    id: "1",
    schoolId: "2023-00001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    password: "password123", // In a real app, this would be hashed
    userType: "student",
  },
  {
    id: "2",
    schoolId: "ADMIN-001",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    userType: "admin",
  },
]

// Update the login handling in the POST function to properly authenticate users
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, identifier, password, schoolId, firstName, lastName, email, userType } = body

    // Login
    if (action === "login") {
      // For demo purposes, accept any credentials
      // In a real app, you would validate against a database
      const isEmail = identifier && identifier.includes("@")

      const mockUser = {
        id: "1",
        schoolId: isEmail ? "2023-00001" : identifier,
        firstName: "John",
        lastName: "Doe",
        email: isEmail ? identifier : "student@example.com",
        userType: "student",
      }

      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: mockUser,
      })
    }

    // Signup
    if (action === "signup") {
      // For demo purposes, always succeed
      // In a real app, you would check if user exists and save to database
      const newUser = {
        id: Math.floor(Math.random() * 1000).toString(),
        schoolId,
        firstName,
        lastName,
        email,
        userType,
      }

      return NextResponse.json({
        success: true,
        message: "Account created successfully",
        user: newUser,
      })
    }

    // Forgot password
    if (action === "forgot-password") {
      // For demo purposes, always succeed
      return NextResponse.json({
        success: true,
        message: "If your email or school ID is registered, you will receive a password reset link",
      })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
