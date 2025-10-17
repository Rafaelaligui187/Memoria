import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"

export async function DELETE(request: NextRequest) {
  try {
    console.log("[Audit Logs] Deleting all audit logs...")

    const db = await connectToDatabase()
    
    // Get count of audit logs before deletion
    const totalCount = await db.collection('AuditLogs').countDocuments()
    console.log("[Audit Logs] Total audit logs to delete:", totalCount)

    if (totalCount === 0) {
      return NextResponse.json({
        success: true,
        message: "No audit logs to delete",
        deletedCount: 0
      })
    }

    // Delete all audit logs
    const result = await db.collection('AuditLogs').deleteMany({})

    console.log("[Audit Logs] Delete operation result:", result)

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        error: "Failed to delete audit logs"
      }, { status: 500 })
    }

    console.log("[Audit Logs] Successfully deleted all audit logs:", result.deletedCount)

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} audit logs`,
      deletedCount: result.deletedCount
    })

  } catch (error) {
    console.error("[Audit Logs] Error deleting all audit logs:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to delete all audit logs"
    }, { status: 500 })
  }
}
