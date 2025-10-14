import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { hashPassword, verifyPassword, validatePassword } from "@/lib/password-utils"
import { ObjectId } from "mongodb"

// User interface for MongoDB
interface User {
  _id?: ObjectId
  schoolId: string
  firstName: string
  lastName: string
  email: string
  password: string
  userType: "student" | "faculty" | "alumni" | "staff" | "admin"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

// Admin credentials for hardcoded admin access
const ADMIN_CREDENTIALS = [
  { email: "admin2045@cctc.edu.ph", password: "admin123" },
  { email: "admin@cctc.edu.ph", password: "admin123" },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, identifier, password, schoolId, firstName, lastName, email, userType } = body

    // Login
    if (action === "login") {
      // Check admin credentials first
      const isAdminCredentials = ADMIN_CREDENTIALS.some((admin) => {
        if (identifier.includes("@")) {
          return admin.email === identifier && admin.password === password
        } else {
          const adminUsername = admin.email.split("@")[0]
          return adminUsername === identifier && admin.password === password
        }
      })

      if (isAdminCredentials) {
        let loginEmail = identifier
        if (!identifier.includes("@")) {
          if (identifier === "admin2045") {
            loginEmail = "admin2045@cctc.edu.ph"
          } else if (identifier === "admin") {
            loginEmail = "admin@cctc.edu.ph"
          }
        }

        const adminUser = {
          id: "admin",
          schoolId: "ADMIN-001",
          firstName: "Admin",
          lastName: "User",
          email: loginEmail,
          userType: "admin",
          isActive: true,
        }

        return NextResponse.json({
          success: true,
          message: "Admin login successful",
          user: adminUser,
        })
      }

      // Regular user login
      const db = await connectToDatabase()
      const usersCollection = db.collection("users")

      // Find user by email or schoolId
      const user = await usersCollection.findOne({
        $or: [
          { email: identifier },
          { schoolId: identifier }
        ],
        isActive: true
      })

      if (!user) {
        return NextResponse.json({
          success: false,
          message: "User not found or account is inactive"
        }, { status: 401 })
      }

      // Verify password
      const isPasswordValid = await verifyPassword(password, user.password)
      if (!isPasswordValid) {
        return NextResponse.json({
          success: false,
          message: "Invalid password"
        }, { status: 401 })
      }

      // Update last login
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { lastLogin: new Date() } }
      )

      // Return user data (without password)
      const userData = {
        id: user._id.toString(),
        schoolId: user.schoolId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
      }

      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: userData,
      })
    }

    // Signup
    if (action === "signup") {
      try {
        console.log("[v0] Signup attempt:", { schoolId, firstName, lastName, email, userType })
        
        const db = await connectToDatabase()
        const usersCollection = db.collection("users")

        // Validate required fields
        if (!schoolId || !firstName || !lastName || !email || !password || !userType) {
          console.log("[v0] Missing required fields")
          return NextResponse.json({
            success: false,
            message: "All fields are required"
          }, { status: 400 })
        }

        // Validate password strength
        const passwordValidation = validatePassword(password)
        if (!passwordValidation.isValid) {
          console.log("[v0] Password validation failed:", passwordValidation.errors)
          return NextResponse.json({
            success: false,
            message: "Password does not meet requirements",
            errors: passwordValidation.errors
          }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await usersCollection.findOne({
          $or: [
            { email: email },
            { schoolId: schoolId }
          ]
        })

        if (existingUser) {
          console.log("[v0] User already exists")
          return NextResponse.json({
            success: false,
            message: "User with this email or school ID already exists"
          }, { status: 409 })
        }

        // Hash password
        console.log("[v0] Hashing password...")
        const hashedPassword = await hashPassword(password)
        console.log("[v0] Password hashed successfully")

        // Create new user
        const newUser: User = {
          schoolId,
          firstName,
          lastName,
          email,
          password: hashedPassword,
          userType: userType as "student" | "faculty" | "alumni" | "staff" | "admin",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        console.log("[v0] Inserting user into database...")
        const result = await usersCollection.insertOne(newUser)
        console.log("[v0] User inserted successfully:", result.insertedId)

        // Return user data (without password)
        const userData = {
          id: result.insertedId.toString(),
          schoolId: newUser.schoolId,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          userType: newUser.userType,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt,
        }

        return NextResponse.json({
          success: true,
          message: "Account created successfully",
          user: userData,
        })
      } catch (error) {
        console.error("[v0] Signup error:", error)
        return NextResponse.json({
          success: false,
          message: "Failed to create account. Please try again."
        }, { status: 500 })
      }
    }

    // Forgot password
    if (action === "forgot-password") {
      const db = await connectToDatabase()
      const usersCollection = db.collection("users")

      // Find user by email or schoolId
      const user = await usersCollection.findOne({
        $or: [
          { email: identifier },
          { schoolId: identifier }
        ],
        isActive: true
      })

      if (!user) {
        // Don't reveal if user exists or not for security
        return NextResponse.json({
          success: true,
          message: "If your email or school ID is registered, you will receive a password reset link"
        })
      }

      // TODO: Implement actual password reset functionality
      // For now, just return success message
      return NextResponse.json({
        success: true,
        message: "If your email or school ID is registered, you will receive a password reset link"
      })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 })
  }
}