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
  profilePhoto?: string
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
        name: `${user.firstName} ${user.lastName}`,
        initials: `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase(),
        email: user.email,
        userType: user.userType,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        profilePhoto: user.profilePhoto,
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
          name: `${newUser.firstName} ${newUser.lastName}`,
          initials: `${newUser.firstName.charAt(0)}${newUser.lastName.charAt(0)}`.toUpperCase(),
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

    // Change password
    if (action === "change-password") {
      const { currentPassword, newPassword, userId } = body

      if (!currentPassword || !newPassword || !userId) {
        return NextResponse.json({
          success: false,
          message: "Current password, new password, and user ID are required"
        }, { status: 400 })
      }

      // Validate new password
      const passwordValidation = validatePassword(newPassword)
      if (!passwordValidation.isValid) {
        return NextResponse.json({
          success: false,
          message: "Password validation failed",
          errors: passwordValidation.errors
        }, { status: 400 })
      }

      const db = await connectToDatabase()
      const usersCollection = db.collection("users")

      // Find user by ID
      const user = await usersCollection.findOne({
        _id: new ObjectId(userId),
        isActive: true
      })

      if (!user) {
        return NextResponse.json({
          success: false,
          message: "User not found"
        }, { status: 404 })
      }

      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return NextResponse.json({
          success: false,
          message: "Current password is incorrect"
        }, { status: 400 })
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword)

      // Update password in database
      const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            password: hashedNewPassword,
            updatedAt: new Date()
          }
        }
      )

      // Verify the update was successful
      if (updateResult.modifiedCount === 0) {
        console.error("Password update failed - no documents modified")
        return NextResponse.json({
          success: false,
          message: "Failed to update password. Please try again."
        }, { status: 500 })
      }

      console.log(`Password successfully changed for user ${userId}`)
      return NextResponse.json({
        success: true,
        message: "Password changed successfully"
      })
    }

    // Update profile photo
    if (action === "update-profile-photo") {
      const { userId, profilePhoto } = body

      if (!userId || !profilePhoto) {
        return NextResponse.json({
          success: false,
          message: "User ID and profile photo URL are required"
        }, { status: 400 })
      }

      const db = await connectToDatabase()
      const usersCollection = db.collection("users")

      // Find user by ID
      const user = await usersCollection.findOne({
        _id: new ObjectId(userId),
        isActive: true
      })

      if (!user) {
        return NextResponse.json({
          success: false,
          message: "User not found"
        }, { status: 404 })
      }

      // Update profile photo in database
      const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            profilePhoto: profilePhoto,
            updatedAt: new Date()
          }
        }
      )

      // Verify the update was successful
      if (updateResult.modifiedCount === 0) {
        console.error("Profile photo update failed - no documents modified")
        return NextResponse.json({
          success: false,
          message: "Failed to update profile photo. Please try again."
        }, { status: 500 })
      }

      console.log(`Profile photo successfully updated for user ${userId}`)
      return NextResponse.json({
        success: true,
        message: "Profile photo updated successfully",
        profilePhoto: profilePhoto
      })
    }

    // Remove profile photo
    if (action === "remove-profile-photo") {
      const { userId } = body

      if (!userId) {
        return NextResponse.json({
          success: false,
          message: "User ID is required"
        }, { status: 400 })
      }

      const db = await connectToDatabase()
      const usersCollection = db.collection("users")

      // Find user by ID
      const user = await usersCollection.findOne({
        _id: new ObjectId(userId),
        isActive: true
      })

      if (!user) {
        return NextResponse.json({
          success: false,
          message: "User not found"
        }, { status: 404 })
      }

      // Remove profile photo from database
      const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $unset: { 
            profilePhoto: ""
          },
          $set: {
            updatedAt: new Date()
          }
        }
      )

      // Verify the update was successful
      if (updateResult.modifiedCount === 0) {
        console.error("Profile photo removal failed - no documents modified")
        return NextResponse.json({
          success: false,
          message: "Failed to remove profile photo. Please try again."
        }, { status: 500 })
      }

      console.log(`Profile photo successfully removed for user ${userId}`)
      return NextResponse.json({
        success: true,
        message: "Profile photo removed successfully"
      })
    }

    // Update user settings
    if (action === "update-user-settings") {
      const { userId, theme, emailNotifications, email } = body

      if (!userId) {
        return NextResponse.json({
          success: false,
          message: "User ID is required"
        }, { status: 400 })
      }

      const db = await connectToDatabase()
      const usersCollection = db.collection("users")

      // Find user by ID
      const user = await usersCollection.findOne({
        _id: new ObjectId(userId),
        isActive: true
      })

      if (!user) {
        return NextResponse.json({
          success: false,
          message: "User not found"
        }, { status: 404 })
      }

      // Prepare update object
      const updateData: any = {
        updatedAt: new Date()
      }

      if (email !== undefined) {
        updateData.email = email
      }

      if (emailNotifications !== undefined) {
        updateData.emailNotifications = emailNotifications
      }

      if (theme !== undefined) {
        updateData.theme = theme
      }

      // Update user settings in database
      const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: updateData
        }
      )

      // Verify the update was successful
      if (updateResult.modifiedCount === 0) {
        console.error("User settings update failed - no documents modified")
        return NextResponse.json({
          success: false,
          message: "Failed to update settings. Please try again."
        }, { status: 500 })
      }

      console.log(`User settings successfully updated for user ${userId}`)
      return NextResponse.json({
        success: true,
        message: "Settings updated successfully"
      })
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