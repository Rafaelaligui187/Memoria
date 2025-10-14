import { type NextRequest, NextResponse } from "next/server"

// Mock data - same as in route.ts
const schoolYears = [
  {
    id: "2024-2025",
    label: "2024–2025",
    status: "active" as const,
    startDate: "2024-08-01",
    endDate: "2025-07-31",
    profileCount: 1248,
    albumCount: 15,
    pendingCount: 3,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2023-2024",
    label: "2023–2024",
    status: "archived" as const,
    startDate: "2023-08-01",
    endDate: "2024-07-31",
    profileCount: 1156,
    albumCount: 22,
    pendingCount: 0,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
]

export async function GET(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const year = schoolYears.find((y) => y.id === params.yearId)

    if (!year) {
      return NextResponse.json({ success: false, error: "School year not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: year,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch school year" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const body = await request.json()
    const yearIndex = schoolYears.findIndex((y) => y.id === params.yearId)

    if (yearIndex === -1) {
      return NextResponse.json({ success: false, error: "School year not found" }, { status: 404 })
    }

    const updatedYear = {
      ...schoolYears[yearIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    schoolYears[yearIndex] = updatedYear

    return NextResponse.json({
      success: true,
      data: updatedYear,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update school year" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const yearIndex = schoolYears.findIndex((y) => y.id === params.yearId)

    if (yearIndex === -1) {
      return NextResponse.json({ success: false, error: "School year not found" }, { status: 404 })
    }

    const year = schoolYears[yearIndex]

    // Prevent deletion of active year
    if (year.status === "active") {
      return NextResponse.json({ success: false, error: "Cannot delete active school year" }, { status: 400 })
    }

    schoolYears.splice(yearIndex, 1)

    return NextResponse.json({
      success: true,
      message: "School year deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete school year" }, { status: 500 })
  }
}
