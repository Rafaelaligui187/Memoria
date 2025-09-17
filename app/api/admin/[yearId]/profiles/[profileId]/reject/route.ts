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
    const body = await request.json()
    const { reasons, customReason } = body

    if (!reasons || reasons.length === 0) {
      return NextResponse.json({ success: false, error: "At least one rejection reason is required" }, { status: 400 })
    }

    const profileIndex = profiles.findIndex((p) => p.id === params.profileId && p.yearId === params.yearId)

    if (profileIndex === -1) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 })
    }

    const profile = profiles[profileIndex]

    if (profile.status !== "pending") {
      return NextResponse.json({ success: false, error: "Profile is not pending approval" }, { status: 400 })
    }

    const rejectionReason = [...reasons, customReason].filter(Boolean).join("; ")

    profiles[profileIndex] = {
      ...profile,
      status: "rejected" as const,
      rejectionReason,
      reviewedAt: new Date().toISOString(),
      reviewedBy: "admin", // In real app, get from auth context
      updatedAt: new Date().toISOString(),
    }

    // TODO: Send notification to user about rejection with reasons

    return NextResponse.json({
      success: true,
      data: profiles[profileIndex],
      message: "Profile rejected successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to reject profile" }, { status: 500 })
  }
}
