import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"
import { DEPARTMENT_TO_COLLECTION, YEARBOOK_COLLECTIONS } from "@/lib/yearbook-schemas"

// Function to determine the correct collection based on user type and department
function getCollectionName(userType: string, department?: string): string {
  // Map user types to departments for collection selection
  switch (userType) {
    case 'alumni':
      return YEARBOOK_COLLECTIONS.ALUMNI
    case 'faculty':
    case 'staff':
    case 'utility':
      return YEARBOOK_COLLECTIONS.FACULTY_STAFF
    case 'student':
      // For students, we need the department to determine collection
      if (department) {
        // Map department names to collection names
        const departmentMappings: Record<string, string> = {
          'College': YEARBOOK_COLLECTIONS.COLLEGE,
          'Senior High': YEARBOOK_COLLECTIONS.SENIOR_HIGH,
          'Junior High': YEARBOOK_COLLECTIONS.JUNIOR_HIGH,
          'Elementary': YEARBOOK_COLLECTIONS.ELEMENTARY,
        }
        return departmentMappings[department] || YEARBOOK_COLLECTIONS.COLLEGE // Default to College if unknown
      }
      return YEARBOOK_COLLECTIONS.COLLEGE // Default to College if no department specified
    default:
      throw new Error(`Unknown user type: ${userType}`)
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ownedBy = searchParams.get('ownedBy')

    if (!ownedBy) {
      return NextResponse.json({
        success: false,
        message: "User ID (ownedBy) is required"
      }, { status: 400 })
    }

    console.log("[v0] Fetching profiles for user:", ownedBy)

    const db = await connectToDatabase()
    
    // Search across all collections to find profiles owned by this user
    const collectionsToSearch = Object.values(YEARBOOK_COLLECTIONS)
    let allProfiles: any[] = []
    
    for (const collectionName of collectionsToSearch) {
      const collection = db.collection(collectionName)
      const profiles = await collection.find({
        ownedBy: new ObjectId(ownedBy)
      }).toArray()
      
      // Add collection name to each profile for identification
      const profilesWithCollection = profiles.map(profile => ({
        ...profile,
        id: profile._id.toString(),
        collectionName
      }))
      
      allProfiles = allProfiles.concat(profilesWithCollection)
    }

    console.log("[v0] Found profiles:", allProfiles.length)

    return NextResponse.json({
      success: true,
      profiles: allProfiles
    })

  } catch (error) {
    console.error("[v0] Profile fetching error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to fetch profiles. Please try again."
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      schoolYearId, 
      userType, 
      profileData,
      userId // Add userId to the request body
    } = body

    console.log("[v0] Profile creation attempt:", { schoolYearId, userType, userId })
    console.log("[v0] Profile data received:", { 
      profilePicture: profileData.profilePicture,
      hasProfilePicture: !!profileData.profilePicture,
      profileDataKeys: Object.keys(profileData),
      department: profileData.department
    })

    // Determine the correct collection based on user type and department
    const collectionName = getCollectionName(userType, profileData.department)
    console.log("[v0] Using collection:", collectionName)

    const db = await connectToDatabase()
    const yearbookCollection = db.collection(collectionName)

    // Validate required fields
    if (!schoolYearId || !userType || !profileData || !userId) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({
        success: false,
        message: "School year ID, user type, profile data, and user ID are required"
      }, { status: 400 })
    }

    // Validate that userId is a valid ObjectId
    let userObjectId
    try {
      userObjectId = new ObjectId(userId)
    } catch (error) {
      console.log("[v0] Invalid user ID format")
      return NextResponse.json({
        success: false,
        message: "Invalid user ID format"
      }, { status: 400 })
    }

    // Check if user already has a profile for this school year
    const existingProfile = await yearbookCollection.findOne({
      ownedBy: userObjectId,
      schoolYearId: schoolYearId
    })

    if (existingProfile) {
      console.log("[v0] Found existing profile:", {
        profileId: existingProfile._id,
        status: existingProfile.status,
        createdAt: existingProfile.createdAt
      })

      // If user has an approved profile, create a new pending version
      if (existingProfile.status === "approved") {
        console.log("[v0] User has approved profile, creating new pending version")
        
        // Create new profile document with updated data
        const newProfileDocument = {
          schoolYearId,
          userType,
          ownedBy: userObjectId,
          ...profileData,
          status: "pending", // New version starts as pending
          previousProfileId: existingProfile._id, // Reference to the approved version
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        const result = await yearbookCollection.insertOne(newProfileDocument)
        
        return NextResponse.json({
          success: true,
          message: "Profile updated successfully and submitted for admin approval",
          profileId: result.insertedId.toString(),
          isUpdate: true,
          previousProfileId: existingProfile._id.toString()
        })
      } 
      // If user has a pending profile, update it instead of creating duplicate
      else if (existingProfile.status === "pending") {
        console.log("[v0] User has pending profile, updating existing one")
        
        const updateResult = await yearbookCollection.updateOne(
          { _id: existingProfile._id },
          {
            $set: {
              ...profileData,
              updatedAt: new Date(),
            }
          }
        )

        if (updateResult.modifiedCount === 0) {
          return NextResponse.json({
            success: false,
            message: "Failed to update existing profile"
          }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          message: "Profile updated successfully and submitted for admin approval",
          profileId: existingProfile._id.toString(),
          isUpdate: true
        })
      }
      // If user has a rejected profile, update it to pending status
      else if (existingProfile.status === "rejected") {
        console.log("[v0] User has rejected profile, updating to pending status")
        
        const updateResult = await yearbookCollection.updateOne(
          { _id: existingProfile._id },
          {
            $set: {
              ...profileData,
              status: "pending", // Change status back to pending
              updatedAt: new Date(),
              // Clear rejection-related fields
              $unset: {
                rejectionReason: "",
                reviewedAt: "",
                reviewedBy: ""
              }
            }
          }
        )

        if (updateResult.modifiedCount === 0) {
          return NextResponse.json({
            success: false,
            message: "Failed to update rejected profile"
          }, { status: 500 })
        }

        // Create notification for profile resubmission
        try {
          const notificationsCollection = db.collection('notifications')
          
          const notificationData = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "approval",
            title: "Profile Resubmitted",
            message: `${profileData.fullName || "Unknown User"} has resubmitted their profile for review for ${schoolYearId}`,
            priority: "high",
            category: "profile",
            actionUrl: `/admin/profiles?profileId=${existingProfile._id.toString()}&schoolYearId=${schoolYearId}`,
            actionLabel: "Review Profile",
            metadata: { 
              profileId: existingProfile._id.toString(), 
              userName: profileData.fullName || "Unknown User", 
              schoolYearId: schoolYearId,
              userType: userType,
              isResubmission: true
            },
            timestamp: new Date(),
            read: false,
          }
          
          await notificationsCollection.insertOne(notificationData)
          
        } catch (notificationError) {
          console.error('Error creating profile resubmission notification:', notificationError)
          // Don't fail the profile update if notification fails
        }

        return NextResponse.json({
          success: true,
          message: "Profile updated successfully and submitted for admin approval",
          profileId: existingProfile._id.toString(),
          isUpdate: true
        })
      }
    }

    // No existing profile found, create new one
    console.log("[v0] No existing profile found, creating new one")
    const profileDocument = {
      schoolYearId,
      userType,
      ownedBy: userObjectId,
      ...profileData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("[v0] Inserting new profile into yearbook collection...")
    const result = await yearbookCollection.insertOne(profileDocument)
    console.log("[v0] Profile inserted successfully:", result.insertedId)

    // Create notification for new profile submission
    try {
      const notificationsCollection = db.collection('notifications')
      
      const notificationData = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "approval",
        title: "New Profile Submission",
        message: `${profileData.fullName || "Unknown User"} has submitted a new profile for review for ${schoolYearId}`,
        priority: "high",
        category: "profile",
        actionUrl: `/admin/profiles?profileId=${result.insertedId.toString()}&schoolYearId=${schoolYearId}`,
        actionLabel: "Review Profile",
        metadata: { 
          profileId: result.insertedId.toString(), 
          userName: profileData.fullName || "Unknown User", 
          schoolYearId: schoolYearId,
          userType: userType
        },
        timestamp: new Date(),
        read: false,
      }
      
      await notificationsCollection.insertOne(notificationData)
      
    } catch (notificationError) {
      console.error('Error creating profile notification:', notificationError)
      // Don't fail the profile creation if notification fails
    }

    return NextResponse.json({
      success: true,
      message: "Profile created successfully and submitted for admin approval",
      profileId: result.insertedId.toString(),
    })

  } catch (error) {
    console.error("[v0] Profile creation error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to create profile. Please try again."
    }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')
    const schoolYearId = searchParams.get('schoolYearId')

    if (!profileId || !schoolYearId) {
      return NextResponse.json({
        success: false,
        message: "Profile ID and School Year ID are required"
      }, { status: 400 })
    }

    console.log("[v0] Deleting profile:", { profileId, schoolYearId })

    const db = await connectToDatabase()
    
    // Search across all collections to find the profile
    const collectionsToSearch = Object.values(YEARBOOK_COLLECTIONS)
    let deletedProfile = null
    let foundCollection = null
    
    for (const collectionName of collectionsToSearch) {
      const collection = db.collection(collectionName)
      const profile = await collection.findOne({
        _id: new ObjectId(profileId),
        schoolYearId: schoolYearId
      })
      
      if (profile) {
        // Delete the profile
        const deleteResult = await collection.deleteOne({
          _id: new ObjectId(profileId),
          schoolYearId: schoolYearId
        })
        
        if (deleteResult.deletedCount > 0) {
          deletedProfile = profile
          foundCollection = collectionName
          break
        }
      }
    }

    if (!deletedProfile) {
      return NextResponse.json({
        success: false,
        message: "Profile not found"
      }, { status: 404 })
    }

    console.log("[v0] Profile deleted successfully from collection:", foundCollection)

    // Also delete audit logs for this user
    try {
      const userId = deletedProfile.ownedBy?.toString()
      if (userId) {
        const auditLogsDeleted = await db.collection('audit_logs').deleteMany({ userId })
        console.log(`[v0] Deleted ${auditLogsDeleted.deletedCount} audit logs for user ${userId}`)
      }
    } catch (auditError) {
      console.error("[v0] Error deleting audit logs:", auditError)
      // Don't fail the profile deletion if audit log cleanup fails
    }

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully",
      profileId: profileId
    })

  } catch (error) {
    console.error("[v0] Profile deletion error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to delete profile. Please try again."
    }, { status: 500 })
  }
}
