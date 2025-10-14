import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { getSchoolYearLabels } from "@/lib/school-year-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const selectedYear = searchParams.get('selectedYear')
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    console.log("[Audit Logs] Fetching audit logs with params:", {
      selectedYear,
      action,
      userId,
      status,
      limit,
      offset
    })

    // Build query filter
    const filter: any = {}
    
    if (selectedYear) {
      filter.schoolYearId = selectedYear
      console.log("[Audit Logs] Filtering by schoolYearId:", selectedYear)
    }
    
    if (action) {
      filter.action = action
    }
    
    if (userId) {
      filter.userId = userId
    }
    
    if (status) {
      filter.status = status
    }

    console.log("[Audit Logs] Final filter:", filter)

    // Fetch audit logs from database
    const db = await connectToDatabase()
    
    // First, let's check if the collection exists and get a count
    const collectionExists = await db.listCollections({ name: 'AuditLogs' }).hasNext()
    console.log("[Audit Logs] Collection exists:", collectionExists)
    
    if (collectionExists) {
      const totalCount = await db.collection('AuditLogs').countDocuments()
      console.log("[Audit Logs] Total documents in collection:", totalCount)
      
      // Get all documents to see what's in there
      const allLogs = await db.collection('AuditLogs').find({}).toArray()
      console.log("[Audit Logs] All documents:", allLogs)
    }
    
    const auditLogs = await db.collection('AuditLogs').find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(offset)
      .toArray()

    console.log(`[Audit Logs] Found ${auditLogs.length} audit logs with filter`)

    // Get school year labels for all unique school year IDs
    const schoolYearIds = [...new Set(auditLogs.map(log => log.schoolYearId).filter(Boolean))]
    const schoolYearLabels = await getSchoolYearLabels(schoolYearIds)
    console.log("[Audit Logs] School year labels:", schoolYearLabels)

    // Transform the data to match the expected format
    const transformedLogs = auditLogs.map(log => ({
      id: log._id.toString(),
      timestamp: log.timestamp,
      userId: log.userId || 'unknown',
      userName: log.userName || 'Unknown User',
      action: log.action,
      targetType: log.targetType,
      targetId: log.targetId,
      targetName: log.targetName,
      details: log.details || {},
      schoolYearId: log.schoolYearId ? schoolYearLabels[log.schoolYearId] || log.schoolYearId : "—",
      userAgent: log.userAgent,
      status: log.status || 'success'
    }))

    return NextResponse.json({
      success: true,
      data: transformedLogs,
      total: auditLogs.length
    })

  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit logs" },
      { status: 500 }
    )
  }
}

// POST method removed - audit logs can only be created through proper admin actions
// Use the createAuditLog function from lib/audit-log-utils.ts instead
