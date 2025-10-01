import { NextResponse } from "next/server"
import { connectDB } from "@/mongodb/connect"
import Yearbook from "@/mongodb/models/Yearbook"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    await connectDB()


    // check if user already has a yearbook entry////////
    const existing = await Yearbook.findOne({ ownedBy: body.ownedBy })
    if (existing) {
      return NextResponse.json(
        { success: false, message: "You already set up your profile." },
        { status: 400 }
      )
    }
    /////////////////////////////////////////////////



    const newProfile = new Yearbook(body)
    await newProfile.save()

    return NextResponse.json({ success: true, message: "Profile saved", profile: newProfile })
  } catch (err) {
    console.error("Yearbook save error:", err)
    return NextResponse.json({ success: false, message: "Failed to save profile" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectDB()
    const profiles = await Yearbook.find().populate("ownedBy", "firstName lastName email schoolId")
    return NextResponse.json({ success: true, profiles })
  } catch (err) {
    console.error("Yearbook fetch error:", err)
    return NextResponse.json({ success: false, message: "Failed to fetch profiles" }, { status: 500 })
  }
}
