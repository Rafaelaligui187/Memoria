import { type NextRequest, NextResponse } from "next/server"

interface Department {
  id: string
  name: string
  type: "elementary" | "junior_high" | "senior_high" | "college" | "graduate"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

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

interface Section {
  id: string
  programId: string
  name: string
  yearLevel: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Mock data for departments, programs, and sections
const departments: Department[] = [
  {
    id: "1",
    name: "Elementary",
    type: "elementary",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Junior High",
    type: "junior_high",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Senior High",
    type: "senior_high",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "College",
    type: "college",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Graduate School",
    type: "graduate",
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

const programs: Program[] = [
  // Elementary programs
  {
    id: "1",
    departmentId: "1",
    name: "Elementary",
    code: "ELEM",
    yearLevels: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  // Junior High programs
  {
    id: "2",
    departmentId: "2",
    name: "Junior High",
    code: "JHS",
    yearLevels: ["Grade 7", "Grade 8", "Grade 9", "Grade 10"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
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
  {
    id: "5",
    departmentId: "3",
    name: "ABM",
    code: "ABM",
    yearLevels: ["Grade 11", "Grade 12"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "7",
    departmentId: "3",
    name: "TVL",
    code: "TVL",
    yearLevels: ["Grade 11", "Grade 12"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "8",
    departmentId: "3",
    name: "HE",
    code: "HE",
    yearLevels: ["Grade 11", "Grade 12"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "9",
    departmentId: "3",
    name: "ICT",
    code: "ICT",
    yearLevels: ["Grade 11", "Grade 12"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  // College programs
  {
    id: "10",
    departmentId: "4",
    name: "BS Information Technology",
    code: "BSIT",
    yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "10",
    departmentId: "4",
    name: "BS Engineering",
    code: "BSE",
    yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "11",
    departmentId: "4",
    name: "BS Business Administration",
    code: "BSBA",
    yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "12",
    departmentId: "4",
    name: "BS Education",
    code: "BSED",
    yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "13",
    departmentId: "4",
    name: "BS Psychology",
    code: "BSPSY",
    yearLevels: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  // Graduate programs
  {
    id: "14",
    departmentId: "5",
    name: "Master of Science in Computer Science",
    code: "MSCS",
    yearLevels: ["Master's"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "15",
    departmentId: "5",
    name: "Master of Business Administration",
    code: "MBA",
    yearLevels: ["Master's"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "16",
    departmentId: "5",
    name: "Doctor of Philosophy",
    code: "PHD",
    yearLevels: ["Doctorate"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
]

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
    const includePrograms = searchParams.get("includePrograms") === "true"
    const includeSections = searchParams.get("includeSections") === "true"

    const result: any = {
      success: true,
      data: departments.filter((d) => d.isActive),
    }

    if (includePrograms) {
      result.programs = programs.filter((p) => p.isActive)
    }

    if (includeSections) {
      result.sections = sections.filter((s) => s.isActive)
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch departments" }, { status: 500 })
  }
}
