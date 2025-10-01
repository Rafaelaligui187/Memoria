import { type NextRequest, NextResponse } from "next/server"

interface Section {
  id: string
  programId: string
  name: string
  yearLevel: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// This would normally come from the database
const sections: Section[] = [
  // STEM sections
  {
    id: "7",
    programId: "3",
    name: "STEM 1",
    yearLevel: "Grade 11",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "8",
    programId: "3",
    name: "STEM 2",
    yearLevel: "Grade 11",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "9",
    programId: "3",
    name: "STEM 1",
    yearLevel: "Grade 12",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "10",
    programId: "3",
    name: "STEM 2",
    yearLevel: "Grade 12",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // HUMSS sections
  {
    id: "11",
    programId: "4",
    name: "HUMSS 1",
    yearLevel: "Grade 11",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "12",
    programId: "4",
    name: "HUMSS 2",
    yearLevel: "Grade 11",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  // College sections
  {
    id: "13",
    programId: "8",
    name: "CS-A",
    yearLevel: "1st Year",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "14",
    programId: "8",
    name: "CS-B",
    yearLevel: "1st Year",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "15",
    programId: "8",
    name: "CS-A",
    yearLevel: "2nd Year",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "16",
    programId: "8",
    name: "CS-B",
    yearLevel: "2nd Year",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },

  {
    id: "17",
    programId: "9",
    name: "IT-A",
    yearLevel: "1st Year",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "18",
    programId: "9",
    name: "IT-B",
    yearLevel: "1st Year",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get("programId")
    const yearLevel = searchParams.get("yearLevel")

    let filteredSections = sections.filter((s) => s.isActive)

    if (programId) {
      filteredSections = filteredSections.filter((s) => s.programId === programId)
    }

    if (yearLevel) {
      filteredSections = filteredSections.filter((s) => s.yearLevel === yearLevel)
    }

    return NextResponse.json({
      success: true,
      data: filteredSections,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch sections" }, { status: 500 })
  }
}
