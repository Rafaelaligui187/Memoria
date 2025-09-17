import { type NextRequest, NextResponse } from "next/server"

// Mock profiles data - same as in route.ts
const profiles = [
  {
    id: "1",
    userId: "1",
    type: "student" as const,
    status: "pending" as const,
    yearId: "2024-2025",
    data: {},
    createdAt: "2024-08-15T00:00:00Z",
    updatedAt: "2024-08-15T00:00:00Z",
  },
]

export async function POST(request: NextRequest, { params }: { params: { yearId: string; profileId: string } }) {
  try {
    const profileIndex = profiles.findIndex((p) => p.id === params.profileId && p.yearId === params.yearId)

    if (profileIndex === -1) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 })
    }

    const profile = profiles[profileIndex]

    if (profile.status !== "pending") {
      return NextResponse.json({ success: false, error: "Profile is not pending approval" }, { status: 400 })
    }

    profiles[profileIndex] = {
      ...profile,
      status: "approved" as const,
      reviewedAt: new Date().toISOString(),
      reviewedBy: "admin", // In real app, get from auth context
      updatedAt: new Date().toISOString(),
    }

    // TODO: Send notification to user about approval

    return NextResponse.json({
      success: true,
      data: profiles[profileIndex],
      message: "Profile approved successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to approve profile" }, { status: 500 })
  }
}
