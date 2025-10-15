import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"
import { createAuditLog, getClientInfo } from "@/lib/audit-log-utils"

// PUT /api/reports/[id] - Update report status and admin reply
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, adminReply, assignedTo } = body

    if (!params.id) {
      return NextResponse.json({
        success: false,
        error: 'Report ID is required'
      }, { status: 400 })
    }

    const db = await connectToDatabase()
    const reportsCollection = db.collection('reports')

    const updateData: any = {
      updatedAt: new Date()
    }

    if (status) {
      updateData.status = status
      if (status === 'resolved') {
        updateData.resolvedAt = new Date().toISOString()
      }
    }

    if (adminReply) {
      updateData.adminReply = adminReply
    }

    if (assignedTo) {
      updateData.assignedTo = assignedTo
    }

    const result = await reportsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Report not found'
      }, { status: 404 })
    }

    // Get the updated report for audit logging
    const updatedReport = await reportsCollection.findOne({ _id: new ObjectId(params.id) })

    // Create audit log for report update
    try {
      const clientInfo = getClientInfo(request)
      const actionType = status === 'resolved' ? 'report_resolved' : 'report_updated'
      
      await createAuditLog({
        userId: "admin",
        userName: "Admin",
        action: actionType,
        targetType: "report",
        targetId: params.id,
        targetName: updatedReport?.subject || 'Report',
        details: {
          reportId: params.id,
          originalStatus: updatedReport?.status,
          newStatus: status,
          adminReply: adminReply,
          assignedTo: assignedTo,
          category: updatedReport?.category,
          priority: updatedReport?.priority,
          userName: updatedReport?.userName,
          userEmail: updatedReport?.userEmail
        },
        schoolYearId: updatedReport?.schoolYearId,
        userAgent: clientInfo.userAgent,
        status: "success"
      })
    } catch (auditError) {
      console.error('[Reports API] Failed to create audit log for update:', auditError)
      // Don't fail the report update if audit logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'Report updated successfully'
    })

  } catch (error) {
    console.error('Error updating report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update report' },
      { status: 500 }
    )
  }
}

// DELETE /api/reports/[id] - Delete a report
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json({
        success: false,
        error: 'Report ID is required'
      }, { status: 400 })
    }

    const db = await connectToDatabase()
    const reportsCollection = db.collection('reports')

    // Get the report before deleting for audit logging
    const reportToDelete = await reportsCollection.findOne({ _id: new ObjectId(params.id) })
    if (!reportToDelete) {
      return NextResponse.json({
        success: false,
        error: 'Report not found'
      }, { status: 404 })
    }

    const result = await reportsCollection.deleteOne({
      _id: new ObjectId(params.id)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Report not found'
      }, { status: 404 })
    }

    // Create audit log for report deletion
    try {
      const clientInfo = getClientInfo(request)
      await createAuditLog({
        userId: "admin",
        userName: "Admin",
        action: "report_deleted",
        targetType: "report",
        targetId: params.id,
        targetName: reportToDelete.subject,
        details: {
          deletedReportData: {
            subject: reportToDelete.subject,
            category: reportToDelete.category,
            priority: reportToDelete.priority,
            status: reportToDelete.status,
            userName: reportToDelete.userName,
            userEmail: reportToDelete.userEmail,
            description: reportToDelete.description,
            submittedAt: reportToDelete.submittedAt
          }
        },
        schoolYearId: reportToDelete.schoolYearId,
        userAgent: clientInfo.userAgent,
        status: "success"
      })
    } catch (auditError) {
      console.error('[Reports API] Failed to create audit log for deletion:', auditError)
      // Don't fail the report deletion if audit logging fails
    }

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete report' },
      { status: 500 }
    )
  }
}
