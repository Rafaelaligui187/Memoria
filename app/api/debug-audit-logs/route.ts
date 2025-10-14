import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"

export async function GET(request: NextRequest) {
  try {
    console.log("[Debug] Starting database debug...")
    
    const db = await connectToDatabase()
    console.log("[Debug] Database connected successfully")
    
    // Check if AuditLogs collection exists
    const collections = await db.listCollections().toArray()
    console.log("[Debug] Available collections:", collections.map(c => c.name))
    
    const auditLogsExists = collections.some(c => c.name === 'AuditLogs')
    console.log("[Debug] AuditLogs collection exists:", auditLogsExists)
    
    if (auditLogsExists) {
      // Get count of documents
      const count = await db.collection('AuditLogs').countDocuments()
      console.log("[Debug] Total audit logs:", count)
      
      // Get all documents
      const allLogs = await db.collection('AuditLogs').find({}).toArray()
      console.log("[Debug] All audit logs:", allLogs)
      
      return NextResponse.json({
        success: true,
        data: {
          collectionExists: auditLogsExists,
          totalCount: count,
          logs: allLogs
        }
      })
    } else {
      return NextResponse.json({
        success: true,
        data: {
          collectionExists: false,
          message: "AuditLogs collection does not exist"
        }
      })
    }
    
  } catch (error) {
    console.error("[Debug] Error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
