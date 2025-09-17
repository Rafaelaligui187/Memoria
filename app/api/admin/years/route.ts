import { type NextRequest, NextResponse } from "next/server"

interface SchoolYear {
  id: string
  label: string
  status: "active" | "archived" | "draft"
  startDate: string
  endDate: string
  profileCount?: number
  albumCount?: number
  pendingCount?: number
  createdAt: string
  updatedAt: string
}

// Mock data - replace with actual database
const schoolYears: SchoolYear[] = [
  {
    id: "2024-2025",
    label: "2024–2025",
    status: "active",
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
    status: "archived",
    startDate: "2023-08-01",
    endDate: "2024-07-31",
    profileCount: 1156,
    albumCount: 22,
    pendingCount: 0,
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: schoolYears,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch school years" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { yearLabel, startDate, endDate, status = "draft" } = body

    if (!yearLabel || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if year already exists
    const existingYear = schoolYears.find((year) => year.label === yearLabel)
    if (existingYear) {
      return NextResponse.json({ success: false, error: "School year already exists" }, { status: 409 })
    }

    const newYear: SchoolYear = {
      id: yearLabel.replace("–", "-"),
      label: yearLabel,
      status,
      startDate,
      endDate,
      profileCount: 0,
      albumCount: 0,
      pendingCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    schoolYears.push(newYear)

    return NextResponse.json({
      success: true,
      data: newYear,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create school year" }, { status: 500 })
  }
}
