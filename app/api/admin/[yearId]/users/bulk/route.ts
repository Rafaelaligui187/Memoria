import { type NextRequest, NextResponse } from "next/server"
import { db, createAuditLog } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const body = await request.json()
    const { action, userIds, data } = body
    const adminUserId = request.headers.get("x-admin-user-id") || "unknown"

    if (!action || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ success: false, error: "Invalid request data" }, { status: 400 })
    }

    const results = []
    let successCount = 0
    let failureCount = 0

    switch (action) {
      case "activate":
        for (const userId of userIds) {
          try {
            await db.updateUser(userId, { status: "active" })
            successCount++
            results.push({ userId, success: true })
          } catch (error) {
            failureCount++
            results.push({ userId, success: false, error: error.message })
          }
        }
        break

      case "deactivate":
        for (const userId of userIds) {
          try {
            await db.updateUser(userId, { status: "inactive" })
            successCount++
            results.push({ userId, success: true })
          } catch (error) {
            failureCount++
            results.push({ userId, success: false, error: error.message })
          }
        }
        break

      case "change_role":
        if (!data?.role) {
          return NextResponse.json({ success: false, error: "Role is required for role change" }, { status: 400 })
        }
        for (const userId of userIds) {
          try {
            await db.updateUser(userId, { role: data.role })
            successCount++
            results.push({ userId, success: true })
          } catch (error) {
            failureCount++
            results.push({ userId, success: false, error: error.message })
          }
        }
        break

      case "delete":
        for (const userId of userIds) {
          try {
            await db.deleteUser(userId)
            successCount++
            results.push({ userId, success: true })
          } catch (error) {
            failureCount++
            results.push({ userId, success: false, error: error.message })
          }
        }
        break

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    // Create audit log for bulk operation
    await createAuditLog(
      adminUserId,
      `bulk_${action}`,
      "users",
      undefined,
      {
        userIds,
        action,
        successCount,
        failureCount,
        data,
      },
      params.yearId,
    )

    return NextResponse.json({
      success: true,
      data: {
        successCount,
        failureCount,
        results,
      },
    })
  } catch (error) {
    console.error("Bulk operation failed:", error)
    return NextResponse.json({ success: false, error: "Bulk operation failed" }, { status: 500 })
  }
}
