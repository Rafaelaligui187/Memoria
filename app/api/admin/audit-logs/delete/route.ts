import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const auditLogId = searchParams.get('id')

    if (!auditLogId) {
      return NextResponse.json({
        success: false,
        error: "Audit log ID is required"
      }, { status: 400 })
    }

    console.log("[Audit Logs] Deleting audit log:", auditLogId)

    const db = await connectToDatabase()
    
    // Validate that the audit log exists
    const existingLog = await db.collection('AuditLogs').findOne({
      _id: new ObjectId(auditLogId)
    })

    if (!existingLog) {
      return NextResponse.json({
        success: false,
        error: "Audit log not found"
      }, { status: 404 })
    }

    // Delete the audit log
    const result = await db.collection('AuditLogs').deleteOne({
      _id: new ObjectId(auditLogId)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        error: "Failed to delete audit log"
      }, { status: 500 })
    }

    console.log("[Audit Logs] Successfully deleted audit log:", auditLogId)

    return NextResponse.json({
      success: true,
      message: "Audit log deleted successfully",
      deletedId: auditLogId
    })

  } catch (error) {
    console.error("Error deleting audit log:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to delete audit log"
    }, { status: 500 })
  }
}

