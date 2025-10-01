import { type NextRequest, NextResponse } from "next/server"

interface Program {
  id: string
  departmentId: string
  name: string
  code: string
  yearLevels: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// This would normally come from the database
const programs: Program[] = [
  // Senior High programs
  {
    id: "3",
    departmentId: "3",
    name: "STEM",
    code: "STEM",
    yearLevels: ["Grade 11", "Grade 12"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    departmentId: "3",
    name: "HUMSS",
    code: "HUMSS",
    yearLevels: ["Grade 11", "Grade 12"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  // College programs
  {
    id: "8",
    departmentId: "4",
    name: "BS Computer Science",
    code: "BSCS",
    yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "9",
    departmentId: "4",
    name: "BS Information Technology",
    code: "BSIT",
    yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get("departmentId")

    let filteredPrograms = programs.filter((p) => p.isActive)

    if (departmentId) {
      filteredPrograms = filteredPrograms.filter((p) => p.departmentId === departmentId)
    }

    return NextResponse.json({
      success: true,
      data: filteredPrograms,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch programs" }, { status: 500 })
  }
}
