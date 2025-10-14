import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

// Mock data - same as in route.ts
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@cctc.edu.ph",
    role: "Student" as const,
    department: "College",
    course: "BSIT",
    studentId: "2024-001",
    status: "Active" as const,
    yearId: "2024-2025",
    createdAt: "2024-08-15T00:00:00Z",
    lastLogin: "2024-08-15T10:30:00Z",
  },
]

export async function GET(request: NextRequest, { params }: { params: { yearId: string; userId: string } }) {
  try {
    const user = users.find((u) => u.id === params.userId && u.yearId === params.yearId)

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { yearId: string; userId: string } }) {
  try {
    const body = await request.json()
    const userIndex = users.findIndex((u) => u.id === params.userId && u.yearId === params.yearId)

    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const updatedUser = {
      ...users[userIndex],
      ...body,
      id: params.userId, // Prevent ID changes
      yearId: params.yearId, // Prevent year changes
    }

    users[userIndex] = updatedUser

    return NextResponse.json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { yearId: string; userId: string } }) {
  try {
    const userIndex = users.findIndex((u) => u.id === params.userId && u.yearId === params.yearId)

    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    const deletedUser = users.splice(userIndex, 1)[0]

    // Also delete audit logs for this user
    try {
      const auditLogsDeleted = await db.deleteAuditLogsByUserId(params.userId)
      console.log(`[Admin API] Deleted user ${params.userId} and ${auditLogsDeleted} associated audit logs`)
    } catch (auditError) {
      console.error(`[Admin API] Error deleting audit logs for user ${params.userId}:`, auditError)
      // Don't fail user deletion if audit log cleanup fails
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
  }
}
