import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"
import { YEARBOOK_COLLECTIONS } from "@/lib/yearbook-schemas"
import { createAuditLog, getClientInfo } from "@/lib/audit-log-utils"
import { getSchoolYearLabel } from "@/lib/school-year-utils"
import { emitProfileApproved } from "@/lib/profile-events"

// Function to determine the correct collection based on user type and department
function getCollectionName(userType: string, department?: string): string {
  switch (userType) {
    case 'alumni':
      return YEARBOOK_COLLECTIONS.ALUMNI
    case 'faculty':
    case 'staff':
      return YEARBOOK_COLLECTIONS.FACULTY_STAFF
    case 'student':
      if (department) {
        const departmentMappings: Record<string, string> = {
          'College': YEARBOOK_COLLECTIONS.COLLEGE,
          'Senior High': YEARBOOK_COLLECTIONS.SENIOR_HIGH,
          'Junior High': YEARBOOK_COLLECTIONS.JUNIOR_HIGH,
          'Elementary': YEARBOOK_COLLECTIONS.ELEMENTARY,
        }
        return departmentMappings[department] || YEARBOOK_COLLECTIONS.COLLEGE
      }
      return YEARBOOK_COLLECTIONS.COLLEGE
    default:
      throw new Error(`Unknown user type: ${userType}`)
  }
}

export async function POST(request: NextRequest, { params }: { params: { yearId: string; profileId: string } }) {
  try {
    const { yearId, profileId } = params
    
    console.log('Approving profile:', { yearId, profileId })

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

    // Update the profile status to approved
    const updateResult = await db.collection(foundCollection!).updateOne(
      { _id: new ObjectId(profileId)},
      { 
        $set: { 
          status: "approved",
          reviewedAt: new Date(),
          reviewedBy: "admin", // In real app, get from auth context
          updatedAt: new Date(),
        }
      }
    )

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ success: false, error: "Failed to update profile status" }, { status: 500 })
    }

    // If this is an update to an existing approved profile, delete the previous version
    if (foundProfile.previousProfileId) {
      console.log('Deleting previous approved profile:', foundProfile.previousProfileId)
      
      try {
        // Delete the previous approved profile completely to prevent duplicates
        const deleteResult = await db.collection(foundCollection!).deleteOne({
          _id: foundProfile.previousProfileId
        })
        
        if (deleteResult.deletedCount > 0) {
          console.log('Successfully deleted previous profile:', foundProfile.previousProfileId)
        } else {
          console.log('Previous profile not found or already deleted:', foundProfile.previousProfileId)
        }
      } catch (deleteError) {
        console.error('Error deleting previous profile:', deleteError)
        // Don't fail the approval if deletion fails, but log the error
      }
    }

    // Clean up any other profiles for the same user and school year to prevent duplicates
    try {
      const cleanupResult = await db.collection(foundCollection!).deleteMany({
        ownedBy: foundProfile.ownedBy,
        schoolYearId: yearId,
        _id: { $ne: new ObjectId(profileId) }, // Don't delete the current profile
        status: { $in: ["pending", "rejected"] } // Only delete pending/rejected duplicates
      })
      
      if (cleanupResult.deletedCount > 0) {
        console.log(`Cleaned up ${cleanupResult.deletedCount} duplicate profiles for user ${foundProfile.ownedBy}`)
      }
    } catch (cleanupError) {
      console.error('Error cleaning up duplicate profiles:', cleanupError)
      // Don't fail the approval if cleanup fails
    }

    // Send notification to user about approval (TODO: implement notification system)
    console.log('Profile approved successfully:', profileId)

    // Create audit log for the approval action
    const clientInfo = getClientInfo(request)
    const schoolYearLabel = await getSchoolYearLabel(yearId)
    
    console.log("[Profile Approval] Creating audit log with data:", {
      userId: "admin",
      userName: "Admin User",
      action: "profile_approved",
      targetType: "student_profile",
      targetId: profileId,
      targetName: foundProfile.fullName || foundProfile.name || "Unknown Profile",
      schoolYearId: schoolYearLabel
    })
    
    const auditResult = await createAuditLog({
      userId: "admin", // TODO: Get from auth context
      userName: "Admin User", // TODO: Get from auth context
      action: "profile_approved",
      targetType: "student_profile",
      targetId: profileId,
      targetName: foundProfile.fullName || foundProfile.name || "Unknown Profile",
      details: {
        previousStatus: "pending",
        newStatus: "approved",
        department: foundProfile.department,
        userType: foundProfile.userType,
        collection: foundCollection
      },
      schoolYearId: schoolYearLabel,
      status: "success"
    })

    console.log("[Profile Approval] Audit log creation result:", auditResult)
    if (!auditResult.success) {
      console.error('Failed to create audit log for profile approval:', auditResult.error)
    }

    // Emit profile approved event for real-time updates
    try {
      emitProfileApproved(
        profileId,
        yearId,
        foundProfile.department || foundProfile.userType,
        foundProfile.userType,
        foundProfile
      )
      console.log("[Profile Approval] Profile approved event emitted")
    } catch (eventError) {
      console.error("[Profile Approval] Failed to emit profile approved event:", eventError)
    }

    return NextResponse.json({
      success: true,
      message: "Profile approved successfully",
    })
  } catch (error) {
    console.error('Error approving profile:', error)
    return NextResponse.json({ success: false, error: "Failed to approve profile" }, { status: 500 })
  }
}
