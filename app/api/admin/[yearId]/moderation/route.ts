import { type NextRequest, NextResponse } from "next/server"

interface ModerationItem {
  id: string
  type: "profile" | "album" | "photo" | "report" | "content"
  title: string
  description: string
  submittedBy: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  submittedAt: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "pending" | "in_review" | "approved" | "rejected"
  yearId: string
  metadata: Record<string, any>
  rejectionReason?: string
  reviewedAt?: string
  reviewedBy?: string
}

// Mock moderation items
const moderationItems: ModerationItem[] = [
  {
    id: "1",
    type: "profile",
    title: "Student Profile Submission",
    description: "John Doe submitted his student profile for approval",
    submittedBy: {
      id: "user1",
      name: "John Doe",
      email: "john.doe@cctc.edu.ph",
    },
    submittedAt: "2024-08-15T10:30:00Z",
    priority: "medium",
    status: "pending",
    yearId: "2024-2025",
    metadata: {
      role: "Student",
      department: "College",
      contentType: "BSIT Profile",
    },
  },
]

export async function GET(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const q = searchParams.get("q")

    let filteredItems = moderationItems.filter((item) => item.yearId === params.yearId)

    if (type && type !== "all") {
      filteredItems = filteredItems.filter((item) => item.type === type)
    }

    if (status && status !== "all") {
      filteredItems = filteredItems.filter((item) => item.status === status)
    }

    if (priority && priority !== "all") {
      filteredItems = filteredItems.filter((item) => item.priority === priority)
    }

    if (q) {
      const query = q.toLowerCase()
      filteredItems = filteredItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.submittedBy.name.toLowerCase().includes(query),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredItems,
      total: filteredItems.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch moderation items" }, { status: 500 })
  }
}
