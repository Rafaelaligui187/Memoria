import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { schoolId, firstName, lastName, email, password, role } = body

    if (!schoolId || !firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      )
    }

    // ✅ Normalize email
    const normalizedEmail = email.toLowerCase()

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("Memoria")

    // ✅ Role-based collection
    let collectionName = ""
    if (role === "student") collectionName = "Student"
    else if (role === "teacher") collectionName = "Teacher"
    else if (role === "alumni") collectionName = "Alumni"
    else
      return NextResponse.json(
        { success: false, message: "Invalid role" },
        { status: 400 }
      )

    const collection = db.collection(collectionName)

    // ✅ Check if School ID already exists across all collections
    const schoolIdExists =
      (await db.collection("Student").findOne({ schoolId })) ||
      (await db.collection("Teacher").findOne({ schoolId })) ||
      (await db.collection("Alumni").findOne({ schoolId }))

    if (schoolIdExists) {
      return NextResponse.json(
        { success: false, message: "School ID already exists" },
        { status: 400 }
      )
    }

    // ✅ Check if email already exists (only in current role collection)
    const emailExists = await collection.findOne({ email: normalizedEmail })
    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      )
    }

    // ✅ Insert new user (plain password, NOT hashed)
    const newUser = {
      schoolId,
      firstName,
      lastName,
      email: normalizedEmail,
      password, // ⚠️ plain text
      role,
      createdAt: new Date(),
    }

    const result = await collection.insertOne(newUser)

    return NextResponse.json({
      success: true,
      user: { id: result.insertedId, ...newUser, password: undefined },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
