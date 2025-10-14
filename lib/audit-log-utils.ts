import { connectToDatabase } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"

export interface AuditLogData {
  userId: string
  userName: string
  action: string
  targetType?: string
  targetId?: string
  targetName?: string
  details?: Record<string, any>
  schoolYearId?: string
  userAgent?: string
  status?: "success" | "failed" | "warning"
}

export async function createAuditLog(auditData: AuditLogData) {
  try {
    console.log("[Audit Log Utils] Starting audit log creation with data:", auditData)
    
    // Validate that this is a legitimate admin action on a profile
    const allowedActions = [
      'profile_approved',
      'profile_rejected',
      'profile_deleted',
      'user_deleted',
      'user_created',
      'user_updated',
      'user_activated',
      'user_deactivated',
      'bulk_profile_approved',
      'bulk_profile_rejected',
      'bulk_user_deleted',
      'manual_profile_created'
    ]
    
    // Only allow specific admin actions
    if (!allowedActions.includes(auditData.action)) {
      console.warn(`[Audit Log Utils] Skipping audit log creation - action '${auditData.action}' is not allowed`)
      return {
        success: false,
        error: "Action not allowed for audit logging"
      }
    }
    
    // Validate that this is an admin action (not user action)
    if (auditData.userId !== "admin" && !auditData.userName?.includes("Admin")) {
      console.warn(`[Audit Log Utils] Skipping audit log creation - user '${auditData.userId}' is not an admin`)
      return {
        success: false,
        error: "Only admin actions are logged"
      }
    }
    
    // For profile actions, validate that the profile exists (except for manual profile creation)
    if (auditData.action.startsWith('profile_') && auditData.action !== 'manual_profile_created') {
      const { connectToDatabase } = await import('@/lib/mongodb/connection')
      const db = await connectToDatabase()
      
      // Check if the target profile actually exists
      const collectionsToCheck = [
        'College_yearbook',
        'SeniorHigh_yearbook', 
        'JuniorHigh_yearbook',
        'Elementary_yearbook',
        'Alumni_yearbook',
        'FacultyStaff_yearbook'
      ]
      
      let profileExists = false
      
      for (const collectionName of collectionsToCheck) {
        const collection = db.collection(collectionName)
        // Try both schoolYearId and schoolYearLabel since the audit log might use either
        const profile = await collection.findOne({
          _id: new ObjectId(auditData.targetId),
          $or: [
            { schoolYearId: auditData.schoolYearId },
            { schoolYear: auditData.schoolYearId }
          ]
        })
        
        if (profile) {
          profileExists = true
          console.log(`[Audit Log Utils] Found profile in collection ${collectionName}`)
          break
        }
      }
      
      if (!profileExists) {
        console.warn(`[Audit Log Utils] Skipping audit log creation - target profile ${auditData.targetId} does not exist`)
        return {
          success: false,
          error: "Target profile does not exist"
        }
      }
    }
    
    const db = await connectToDatabase()
    console.log("[Audit Log Utils] Database connected successfully")
    
    const auditLog = {
      ...auditData,
      timestamp: new Date(),
      status: auditData.status || 'success'
    }

    console.log("[Audit Log Utils] Prepared audit log document:", auditLog)

    const result = await db.collection('AuditLogs').insertOne(auditLog)
    
    console.log("[Audit Log] Created audit log:", {
      id: result.insertedId,
      action: auditData.action,
      userId: auditData.userId,
      userName: auditData.userName,
      targetName: auditData.targetName
    })

    return {
      success: true,
      id: result.insertedId.toString()
    }
  } catch (error) {
    console.error("[Audit Log] Error creating audit log:", error)
    return {
      success: false,
      error: "Failed to create audit log"
    }
  }
}

export function getClientInfo(request: Request) {
  const headers = request.headers
  return {
    ipAddress: headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown',
    userAgent: headers.get('user-agent') || 'unknown'
  }
}
