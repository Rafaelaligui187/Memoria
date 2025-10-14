import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"
import { YEARBOOK_COLLECTIONS } from "@/lib/yearbook-schemas"
import { createAuditLog, getClientInfo } from "@/lib/audit-log-utils"
import { getSchoolYearLabel } from "@/lib/school-year-utils"

export async function POST(request: NextRequest, { params }: { params: { yearId: string; profileId: string } }) {
  try {
    const body = await request.json()
    const { reasons, customReason } = body
    const { yearId, profileId } = params

    if (!reasons || reasons.length === 0) {
      return NextResponse.json({ success: false, error: "At least one rejection reason is required" }, { status: 400 })
    }

    console.log('Rejecting profile:', { yearId, profileId, reasons, customReason })

    const db = await connectToDatabase()
    
    // Find the profile across all possible collections
    const collectionsToSearch = Object.values(YEARBOOK_COLLECTIONS)
    let foundProfile = null
    let foundCollection = null
    
    for (const collectionName of collectionsToSearch) {
      const collection = db.collection(collectionName)
      const profile = await collection.findOne({
        _id: new ObjectId(profileId),
        schoolYearId: yearId
      })
      
      if (profile) {
        foundProfile = profile
        foundCollection = collectionName
        break
      }
    }

    if (!foundProfile) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 })
    }

    if (foundProfile.status !== "pending") {
      return NextResponse.json({ success: false, error: "Profile is not pending approval" }, { status: 400 })
    }

    const rejectionReason = [...reasons, customReason].filter(Boolean).join("; ")

    // Update the profile status to rejected
    const updateResult = await db.collection(foundCollection).updateOne(
      { _id: new ObjectId(profileId)},
      { 
        $set: { 
          status: "rejected",
          rejectionReason,
          reviewedAt: new Date(),
          reviewedBy: "admin", // In real app, get from auth context
          updatedAt: new Date(),
        }
      }
    )

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ success: false, error: "Failed to update profile status" }, { status: 500 })
    }

    // Send notification to user about rejection with reasons (TODO: implement notification system)
    console.log('Profile rejected successfully:', { profileId, rejectionReason })

    // Create audit log for the rejection action
    const clientInfo = getClientInfo(request)
    const schoolYearLabel = await getSchoolYearLabel(yearId)
    
    const auditResult = await createAuditLog({
      userId: "admin", // TODO: Get from auth context
      userName: "Admin User", // TODO: Get from auth context
      action: "profile_rejected",
      targetType: "student_profile",
      targetId: profileId,
      targetName: foundProfile.fullName || foundProfile.name || "Unknown Profile",
      details: {
        previousStatus: "pending",
        newStatus: "rejected",
        rejectionReason,
        reasons,
        customReason,
        department: foundProfile.department,
        userType: foundProfile.userType,
        collection: foundCollection
      },
      schoolYearId: schoolYearLabel,
      status: "success"
    })

    if (!auditResult.success) {
      console.error('Failed to create audit log for profile rejection:', auditResult.error)
    }

    return NextResponse.json({
      success: true,
      message: "Profile rejected successfully",
    })
  } catch (error) {
    console.error('Error rejecting profile:', error)
    return NextResponse.json({ success: false, error: "Failed to reject profile" }, { status: 500 })
  }
}