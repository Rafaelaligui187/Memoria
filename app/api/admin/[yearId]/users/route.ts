import { type NextRequest, NextResponse } from "next/server"

interface User {
  id: string
  name: string
  email: string
  role: "Student" | "Faculty" | "Alumni" | "Staff" | "Utility"
  department: string
  status: "Active" | "Inactive" | "Pending"
  yearId: string
  createdAt: string
  lastLogin?: string
  // Role-specific fields
  studentId?: string
  grade?: string
  course?: string
  strand?: string
  position?: string
  graduationYear?: string
  employeeId?: string
}

// Mock data - replace with actual database
const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@cctc.edu.ph",
    role: "Student",
    department: "College",
    course: "BSIT",
    studentId: "2024-001",
    status: "Active",
    yearId: "2024-2025",
    createdAt: "2024-08-15T00:00:00Z",
    lastLogin: "2024-08-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Dr. Maria Santos",
    email: "maria.santos@cctc.edu.ph",
    role: "Faculty",
    department: "College",
    position: "Professor",
    employeeId: "FAC-001",
    status: "Active",
    yearId: "2024-2025",
    createdAt: "2024-08-10T00:00:00Z",
    lastLogin: "2024-08-15T09:45:00Z",
  },
]

export async function GET(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const status = searchParams.get("status")
    const q = searchParams.get("q")

    let filteredUsers = users.filter((user) => user.yearId === params.yearId)

    if (role && role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    if (status && status !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.status === status)
    }

    if (q) {
      const query = q.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredUsers,
      total: filteredUsers.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const body = await request.json()
    const { name, email, role, department, status = "Active", ...roleSpecificFields } = body

    if (!name || !email || !role) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 409 })
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      department: department || "",
      status,
      yearId: params.yearId,
      createdAt: new Date().toISOString(),
      ...roleSpecificFields,
    }

    users.push(newUser)

    return NextResponse.json({
      success: true,
      data: newUser,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}
