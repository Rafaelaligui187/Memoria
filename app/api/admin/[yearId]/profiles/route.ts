import { type NextRequest, NextResponse } from "next/server"

interface Profile {
  id: string
  userId: string
  type: "student" | "faculty" | "alumni" | "staff" | "utility"
  status: "draft" | "pending" | "approved" | "rejected"
  yearId: string
  data: Record<string, any>
  createdAt: string
  updatedAt: string
  submittedAt?: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

// Mock profiles data
const profiles: Profile[] = [
  {
    id: "1",
    userId: "1",
    type: "student",
    status: "pending",
    yearId: "2024-2025",
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@cctc.edu.ph",
      course: "BSIT",
      year: "4th Year",
      quote: "Dream big, work hard, stay focused.",
      ambition: "To become a successful software engineer",
      hobbies: ["Programming", "Gaming", "Reading"],
    },
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-08-15T00:00:00Z",
    submittedAt: "2024-08-15T00:00:00Z",
  },
  {
    id: "2",
    userId: "2",
    type: "faculty",
    status: "approved",
    yearId: "2024-2025",
    data: {
      firstName: "Maria",
      lastName: "Santos",
      email: "maria.santos@cctc.edu.ph",
      position: "Professor",
      department: "Information Technology",
      yearsOfService: 10,
      bio: "Dedicated educator with passion for technology",
    },
    createdAt: "2024-08-10T00:00:00Z",
    updatedAt: "2024-08-12T00:00:00Z",
    submittedAt: "2024-08-10T00:00:00Z",
    reviewedAt: "2024-08-12T00:00:00Z",
    reviewedBy: "admin",
  },
]

export async function GET(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const q = searchParams.get("q")

    let filteredProfiles = profiles.filter((profile) => profile.yearId === params.yearId)

    if (type && type !== "all") {
      filteredProfiles = filteredProfiles.filter((profile) => profile.type === type)
    }

    if (status && status !== "all") {
      filteredProfiles = filteredProfiles.filter((profile) => profile.status === status)
    }

    if (q) {
      const query = q.toLowerCase()
      filteredProfiles = filteredProfiles.filter((profile) =>
        JSON.stringify(profile.data).toLowerCase().includes(query),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredProfiles,
      total: filteredProfiles.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch profiles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const body = await request.json()
    const { userId, type, data, status = "draft" } = body

    if (!userId || !type || !data) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const newProfile: Profile = {
      id: Date.now().toString(),
      userId,
      type,
      status,
      yearId: params.yearId,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (status === "pending") {
      newProfile.submittedAt = new Date().toISOString()
    }

    profiles.push(newProfile)

    return NextResponse.json({
      success: true,
      data: newProfile,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create profile" }, { status: 500 })
  }
}
