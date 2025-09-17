import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Student from "@/models/Student"
import Teacher from "@/models/Teacher"
import Alumni from "@/models/Alumni"

const MONGODB_URI = process.env.MONGODB_URI as string

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI)
  }
}

export async function POST(req: Request) {
  try {
    const { action, email, password } = await req.json()
    await connectDB()

    if (action === "login") {
      // 🔍 Check all collections
      let user =
        (await Student.findOne({ email: email.toLowerCase() })) ||
        (await Teacher.findOne({ email: email.toLowerCase() })) ||
        (await Alumni.findOne({ email: email.toLowerCase() }))

      if (!user) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 401 }
        )
      }

      // plain password check (since you’re not hashing for now)
      if (user.password !== password) {
        return NextResponse.json(
          { success: false, message: "Invalid password" },
          { status: 401 }
        )
      }

      // ✅ Return user data with role
      return NextResponse.json({
        success: true,
        user: {
          id: user._id,
          schoolId: user.schoolId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role || "unknown", // fallback in case role isn't stored
        },
      })
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
