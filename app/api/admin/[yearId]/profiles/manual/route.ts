import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"
import { createAuditLog, getClientInfo } from "@/lib/audit-log-utils"
import { emitProfileCreated } from "@/lib/profile-events"

interface ManualProfileData {
  // Basic Info (all roles)
  fullName: string
  nickname?: string
  age: number
  gender: string
  birthday: string
  address: string
  email: string
  phone?: string

  // Yearbook Info (all roles)
  profilePicture?: string
  sayingMotto: string

  // Student fields
  fatherGuardianName?: string
  motherGuardianName?: string
  department: string
  yearLevel?: string
  courseProgram?: string
  blockSection?: string
  dreamJob?: string
  socialMediaFacebook?: string
  socialMediaInstagram?: string
  socialMediaTwitter?: string

  // Faculty fields
  position?: string
  departmentAssigned?: string
  yearsOfService?: number
  messageToStudents?: string

  // Staff fields (includes maintenance)
  officeAssigned?: string

  // Alumni fields
  graduationYear?: string
  currentProfession?: string
  currentCompany?: string
  currentLocation?: string

  // Additional personal fields
  bio?: string

  // Student-specific additional fields
  hobbies?: string
  honors?: string
  officerRole?: string

  // Faculty-specific additional fields
  courses?: string
  additionalRoles?: string

  // Alumni-specific additional fields
  achievements?: string
  activities?: string

  // Legacy fields for backward compatibility
  quote?: string
  ambition?: string
}

function getCollectionName(userType: string, department?: string): string {
  // Use the correct yearbook collection names from the schema
  if (userType === "student" && department) {
    const departmentMap: Record<string, string> = {
      "College": "College_yearbook",
      "Senior High": "SeniorHigh_yearbook", 
      "Junior High": "JuniorHigh_yearbook",
      "Elementary": "Elementary_yearbook",
      "Graduate School": "College_yearbook" // Graduate students go to College yearbook
    }
    return departmentMap[department] || "College_yearbook"
  }

  // For faculty, staff, and utility, use the FacultyStaff_yearbook collection
  if (userType === "faculty" || userType === "staff" || userType === "utility") {
    return "FacultyStaff_yearbook"
  }

  // For alumni, use the Alumni_yearbook collection
  if (userType === "alumni") {
    return "Alumni_yearbook"
  }

  // Default fallback
  return "College_yearbook"
}

export async function POST(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const body = await request.json()
    const { userType, profileData } = body

    console.log("[Manual Profile] Creation attempt:", { schoolYearId: params.yearId, userType })
    console.log("[Manual Profile] Profile data received:", { 
      profilePicture: profileData.profilePicture,
      hasProfilePicture: !!profileData.profilePicture,
      profileDataKeys: Object.keys(profileData),
      department: profileData.department
    })

    // Fetch school year data to get the label
    const db = await connectToDatabase()
    const schoolYearsCollection = db.collection("SchoolYears")
    const schoolYearDoc = await schoolYearsCollection.findOne({ _id: new ObjectId(params.yearId) })
    
    if (!schoolYearDoc) {
      console.log("[Manual Profile] School year not found:", params.yearId)
      return NextResponse.json({
        success: false,
        message: "School year not found"
      }, { status: 404 })
    }

    const schoolYearLabel = schoolYearDoc.yearLabel
    console.log("[Manual Profile] School year label:", schoolYearLabel)

    // Determine the correct collection based on user type and department
    const collectionName = getCollectionName(userType, profileData.department)
    console.log("[Manual Profile] Using collection:", collectionName)

    const yearbookCollection = db.collection(collectionName)

    // Validate required fields
    if (!params.yearId || !userType || !profileData) {
      console.log("[Manual Profile] Missing required fields")
      return NextResponse.json({
        success: false,
        message: "School year ID, user type, and profile data are required"
      }, { status: 400 })
    }

    // Validate required fields based on user type
    const requiredFields = {
      student: [
        "fullName",
        "age",
        "gender",
        "birthday",
        "address",
        "email",
        "sayingMotto",
        "department",
        "yearLevel",
        "courseProgram",
        "blockSection",
        "dreamJob",
        "fatherGuardianName",
        "motherGuardianName",
      ],
      alumni: [
        "fullName",
        "age",
        "gender",
        "birthday",
        "address",
        "email",
        "sayingMotto",
        "department",
        "courseProgram",
        "graduationYear",
      ],
      faculty: [
        "fullName",
        "age",
        "gender",
        "birthday",
        "address",
        "email",
        "sayingMotto",
        "position",
        "departmentAssigned",
        "yearsOfService",
        "messageToStudents",
      ],
      staff: [
        "fullName",
        "age",
        "gender",
        "birthday",
        "address",
        "email",
        "sayingMotto",
        "position",
        "officeAssigned",
        "yearsOfService",
      ],
      utility: [
        "fullName",
        "age",
        "gender",
        "birthday",
        "address",
        "email",
        "sayingMotto",
        "position",
        "officeAssigned",
        "yearsOfService",
      ],
    }

    const required = requiredFields[userType as keyof typeof requiredFields] || []
    const missingFields = required.filter((field) => !profileData[field] || profileData[field].toString().trim() === "")

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Validate age
    if (profileData.age && (isNaN(Number(profileData.age)) || Number(profileData.age) < 1 || Number(profileData.age) > 100)) {
      return NextResponse.json(
        {
          success: false,
          error: "Age must be a valid number between 1 and 100",
        },
        { status: 400 },
      )
    }

    // Validate email
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    // Create a temporary user ID for manual profiles
    const tempUserId = new ObjectId()

    // Prepare profile document
    const profileDocument = {
      // Core fields
      ownedBy: tempUserId,
      schoolYearId: params.yearId,
      schoolYear: schoolYearLabel, // Add the human-readable school year label
      userType: userType,
      profileStatus: "approved", // Manual profiles are automatically approved
      status: "approved", // Also set status for yearbook compatibility
      createdAt: new Date(),
      updatedAt: new Date(),
      submittedAt: new Date(),
      reviewedAt: new Date(),
      reviewedBy: "admin",
      
      // Profile data
      ...profileData,
      
      // Ensure profile picture is properly set
      profilePicture: profileData.profilePicture || "",
      
      // Legacy compatibility fields
      name: profileData.fullName,
      role: userType,
      department: profileData.department || profileData.departmentAssigned || "",
      
      // Additional metadata for manual profiles
      isManualProfile: true,
      createdByAdmin: true,
    }

    console.log("[Manual Profile] Inserting profile document:", {
      ownedBy: profileDocument.ownedBy,
      schoolYearId: profileDocument.schoolYearId,
      schoolYear: profileDocument.schoolYear,
      userType: profileDocument.userType,
      profileStatus: profileDocument.profileStatus,
      isManualProfile: profileDocument.isManualProfile
    })

    // Insert the profile
    const result = await yearbookCollection.insertOne(profileDocument)

    if (!result.insertedId) {
      console.log("[Manual Profile] Failed to insert profile")
      return NextResponse.json({
        success: false,
        message: "Failed to create profile"
      }, { status: 500 })
    }

    console.log("[Manual Profile] Profile inserted successfully:", result.insertedId)

    // Create audit log for manual profile creation
    try {
      const clientInfo = getClientInfo(request)
      const auditResult = await createAuditLog({
        userId: "admin",
        userName: "Admin",
        action: "manual_profile_created",
        targetType: "profile",
        targetId: result.insertedId.toString(),
        targetName: profileData.fullName,
        schoolYearId: params.yearId,
        details: {
          userType: userType,
          department: profileData.department || profileData.departmentAssigned || "",
          schoolYear: schoolYearLabel,
          profileData: {
            fullName: profileData.fullName,
            email: profileData.email,
            age: profileData.age,
            gender: profileData.gender,
            department: profileData.department || profileData.departmentAssigned || "",
            courseProgram: profileData.courseProgram || "",
            yearLevel: profileData.yearLevel || "",
            blockSection: profileData.blockSection || "",
            position: profileData.position || "",
            graduationYear: profileData.graduationYear || "",
            currentProfession: profileData.currentProfession || "",
            officeAssigned: profileData.officeAssigned || ""
          }
        },
        userAgent: clientInfo.userAgent,
        status: "success"
      })

      if (auditResult.success) {
        console.log("[Manual Profile] Audit log created successfully:", auditResult.id)
      } else {
        console.warn("[Manual Profile] Failed to create audit log:", auditResult.error)
      }
    } catch (auditError) {
      console.error("[Manual Profile] Audit log creation error:", auditError)
      // Don't fail the profile creation if audit log fails
    }

    // Emit profile created event for real-time updates
    try {
      emitProfileCreated(
        result.insertedId.toString(),
        params.yearId,
        profileData.department || profileData.departmentAssigned || userType,
        userType,
        profileDocument
      )
      console.log("[Manual Profile] Profile created event emitted")
    } catch (eventError) {
      console.error("[Manual Profile] Failed to emit profile created event:", eventError)
    }

    return NextResponse.json({
      success: true,
      message: "Manual profile created successfully",
      profileId: result.insertedId.toString(),
      userId: tempUserId.toString(),
    })

  } catch (error) {
    console.error("[Manual Profile] Profile creation error:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to create manual profile. Please try again."
    }, { status: 500 })
  }
}
