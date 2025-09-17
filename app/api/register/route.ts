import { NextResponse } from "next/server"
import mongoose from "mongoose"
import User from "@/models/User"

const MONGODB_URI = process.env.MONGODB_URI as string
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI)
}

export async function POST(req: Request) {
  try {
    const { schoolId, firstName, lastName, email, password } = await req.json()

    // check if schoolId or email already exists
    const existingUser = await User.findOne({
      $or: [{ schoolId }, { email }],
    })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email or School ID already registered" },
        { status: 400 }
      )
    }

    const user = new User({
      schoolId,
      firstName,
      lastName,
      email,
      password, // plain text
    })
    await user.save()

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        schoolId: user.schoolId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Register API error:", error)
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}
