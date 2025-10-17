import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"
import { YEARBOOK_COLLECTIONS } from "@/lib/yearbook-schemas"
import { createAuditLog, getClientInfo } from "@/lib/audit-log-utils"
import { getSchoolYearLabel } from "@/lib/school-year-utils"
import { emitProfileApproved } from "@/lib/profile-events"
import { adminNotificationService } from "@/lib/admin-notification-service"

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
    
    // Find the profile across all possible collections including advisory profiles
    const collectionsToSearch = [...Object.values(YEARBOOK_COLLECTIONS), 'advisory_profiles']
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

    // Create yearbook entries for Advisory profiles
    if (foundCollection === 'advisory_profiles' && foundProfile.userType === 'advisory') {
      console.log('Creating yearbook entries for approved Advisory profile:', profileId)
      
      try {
        // Parse academic assignments
        const academicYearLevels = typeof foundProfile.academicYearLevels === 'string' 
          ? JSON.parse(foundProfile.academicYearLevels) 
          : foundProfile.academicYearLevels || []
        
        const academicSections = typeof foundProfile.academicSections === 'string' 
          ? JSON.parse(foundProfile.academicSections) 
          : foundProfile.academicSections || []
        
        if (academicYearLevels.length > 0) {
          // Get the department-specific collection
          const departmentCollectionName = getCollectionName("student", foundProfile.academicDepartment)
          const departmentCollection = db.collection(departmentCollectionName)
          
          // Create entries for each academic assignment
          for (const yearLevel of academicYearLevels) {
            // If advisory has specific sections assigned, create entries for each section
            if (academicSections.length > 0) {
              for (const sectionKey of academicSections) {
                const [sectionName, sectionYearLevel] = sectionKey.split('-')
                
                // Only create entry if this section matches the current year level
                if (sectionYearLevel === yearLevel) {
                  const advisoryYearbookEntry = {
                    // Basic profile information
                    schoolYearId: foundProfile.schoolYearId,
                    schoolYear: foundProfile.schoolYear,
                    status: "approved", // Approved advisory profiles appear in yearbook
                    fullName: foundProfile.fullName || `${foundProfile.firstName} ${foundProfile.lastName}`,
                    nickname: foundProfile.nickname,
                    age: foundProfile.age,
                    gender: foundProfile.gender,
                    birthday: foundProfile.birthday,
                    address: foundProfile.address,
                    email: foundProfile.email,
                    phone: foundProfile.phone,
                    profilePicture: foundProfile.profilePicture,
                    sayingMotto: foundProfile.sayingMotto,
                    bio: foundProfile.bio,
                    achievements: foundProfile.achievements || [],
                    
                    // Academic assignment information
                    department: foundProfile.academicDepartment,
                    yearLevel: yearLevel,
                    courseProgram: foundProfile.academicCourseProgram || foundProfile.academicDepartment,
                    blockSection: sectionName,
                    
                    // Advisory-specific information
                    position: foundProfile.position,
                    departmentAssigned: foundProfile.departmentAssigned,
                    yearsOfService: foundProfile.yearsOfService,
                    messageToStudents: foundProfile.messageToStudents,
                    courses: foundProfile.courses,
                    additionalRoles: foundProfile.additionalRoles,
                    
                    // Mark as advisory entry
                    isAdvisoryEntry: true,
                    originalAdvisoryId: new ObjectId(profileId),
                    userType: "advisory",
                    
                    // Metadata
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    reviewedAt: new Date(),
                    reviewedBy: "admin"
                  }
                  
                  await departmentCollection.insertOne(advisoryYearbookEntry)
                  console.log(`[Advisory Approval] Created yearbook entry for ${foundProfile.academicDepartment} - ${yearLevel} - ${sectionName}`)
                }
              }
            } else {
              // If no specific sections, create a general entry for the year level
              const advisoryYearbookEntry = {
                // Basic profile information
                schoolYearId: foundProfile.schoolYearId,
                schoolYear: foundProfile.schoolYear,
                status: "approved",
                fullName: foundProfile.fullName || `${foundProfile.firstName} ${foundProfile.lastName}`,
                nickname: foundProfile.nickname,
                age: foundProfile.age,
                gender: foundProfile.gender,
                birthday: foundProfile.birthday,
                address: foundProfile.address,
                email: foundProfile.email,
                phone: foundProfile.phone,
                profilePicture: foundProfile.profilePicture,
                sayingMotto: foundProfile.sayingMotto,
                bio: foundProfile.bio,
                achievements: foundProfile.achievements || [],
                
                // Academic assignment information
                department: foundProfile.academicDepartment,
                yearLevel: yearLevel,
                courseProgram: foundProfile.academicCourseProgram || foundProfile.academicDepartment,
                
                // Advisory-specific information
                position: foundProfile.position,
                departmentAssigned: foundProfile.departmentAssigned,
                yearsOfService: foundProfile.yearsOfService,
                messageToStudents: foundProfile.messageToStudents,
                courses: foundProfile.courses,
                additionalRoles: foundProfile.additionalRoles,
                
                // Mark as advisory entry
                isAdvisoryEntry: true,
                originalAdvisoryId: new ObjectId(profileId),
                userType: "advisory",
                
                // Metadata
                createdAt: new Date(),
                updatedAt: new Date(),
                reviewedAt: new Date(),
                reviewedBy: "admin"
              }
              
              await departmentCollection.insertOne(advisoryYearbookEntry)
              console.log(`[Advisory Approval] Created general yearbook entry for ${foundProfile.academicDepartment} - ${yearLevel}`)
            }
          }
        }
      } catch (yearbookError) {
        console.error('Error creating yearbook entries for Advisory profile:', yearbookError)
        // Don't fail the approval if yearbook entry creation fails
      }
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

    // Create notification for the user about profile approval
    try {
      await adminNotificationService.notifyProfileApproval(foundProfile.ownedBy?.toString() || "", {
        fullName: foundProfile.fullName || foundProfile.name || "Unknown Profile",
        userType: foundProfile.userType,
        department: foundProfile.department,
        schoolYear: yearId
      })
      console.log("[Profile Approval] Notification created for profile approval")
    } catch (notificationError) {
      console.error("[Profile Approval] Failed to create notification:", notificationError)
      // Don't fail the profile approval if notification fails
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
