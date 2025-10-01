import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/mongodb/connect"
import User from "@/mongodb/models/User"
import Yearbook from "@/mongodb/models/Yearbook"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, identifier, password, schoolId, firstName, lastName, email, role } = body

    await connectDB()

    // 🔹 LOGIN
    if (action === "login") {
      const user = await User.findOne({
        $or: [{ email: identifier }, { schoolId: identifier }],
      })

      if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (password !== user.password) {
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
      }

      // build display fields PARA MO FETCH ANG NAMES SULOD SA DBMongo
      const fullName = `${user.firstName} ${user.lastName}`
      const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()

      return NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          schoolId: user.schoolId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`, // 👈 Full name Fetch
          initials: `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase(), // 👈 Initials Fetch
        },
      })
    }

    // 🔹 SIGNUP
    if (action === "signup") {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 })
      }
      
      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = new User({
        schoolId,
        firstName,
        lastName,
        email,
        password,
        role: role || "student",
      })

      await newUser.save()

      // build display fields PARA MO FETCH ANG NAMES SULOD SA DBMongo
      const fullName = `${newUser.firstName} ${newUser.lastName}`
      const initials = `${newUser.firstName.charAt(0)}${newUser.lastName.charAt(0)}`.toUpperCase()

      return NextResponse.json({
        success: true,
        message: "Account created successfully",
        user: {
          id: newUser._id,
          schoolId: newUser.schoolId,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.role,
        },
      })
    }

    // 🔹 FORGOT PASSWORD (placeholder)
    if (action === "forgot-password") {
      return NextResponse.json({
        success: true,
        message: "If your email or school ID is registered, you will receive a reset link",
      })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
  
  
}
