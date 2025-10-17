import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { YEARBOOK_COLLECTIONS } from "@/lib/yearbook-schemas"

// Function to determine the correct collection based on user type and department
function getCollectionName(userType: string, department?: string): string {
  switch (userType) {
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

interface AdvisoryProfile {
  id: string
  userId: string
  schoolYearId: string
  status: "draft" | "pending" | "approved" | "rejected"
  userType: string
  
  // Basic Information
  firstName: string
  middleName?: string
  lastName: string
  suffix?: string
  birthday: string
  address: string
  email: string
  phone: string
  profilePhoto?: string
  
  // Professional Information
  position: string
  departmentAssigned: string
  customDepartmentAssigned?: string
  yearsOfService?: number
  courses?: string
  additionalRoles?: string
  messageToStudents?: string
  
  // Academic Information
  academicDepartment: string
  academicYearLevels: string[]
  academicCourseProgram: string
  academicSections: string[]
  
  // Additional Information
  bio?: string
  
  // Social Media
  socialMediaFacebook?: string
  socialMediaInstagram?: string
  socialMediaTwitter?: string
  
  // Yearbook Information
  sayingMotto?: string
  achievements: string[]
  
  // Metadata
  createdAt: Date
  updatedAt: Date
  submittedAt?: Date
  reviewedAt?: Date
  reviewedBy?: string
  rejectionReason?: string
}

export async function GET(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const q = searchParams.get("q")

    // Get advisory profiles from database
    const profiles = await db.getProfiles(params.yearId, "advisory")
    
    let filteredProfiles = profiles

    if (status && status !== "all") {
      filteredProfiles = filteredProfiles.filter((profile: any) => profile.status === status)
    }

    if (q) {
      const query = q.toLowerCase()
      filteredProfiles = filteredProfiles.filter((profile: any) =>
        JSON.stringify(profile).toLowerCase().includes(query)
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredProfiles,
      total: filteredProfiles.length,
    })
  } catch (error) {
    console.error("Error fetching advisory profiles:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch advisory profiles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const body = await request.json()
    const { userId, ...profileData } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 })
    }

    // Required fields validation
    const requiredFields = [
      "firstName",
      "lastName",
      "birthday",
      "address",
      "email",
      "phone",
      "position",
      "departmentAssigned",
      "yearsOfService",
      "messageToStudents",
      "academicDepartment",
      "academicYearLevels",
      "academicCourseProgram",
      "academicSections",
    ]

    const missingFields = requiredFields.filter((field) => 
      !profileData[field] || 
      (Array.isArray(profileData[field]) && profileData[field].length === 0) ||
      profileData[field].toString().trim() === ""
    )

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Email validation
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 }
      )
    }

    // Create advisory profile
    const advisoryProfile: AdvisoryProfile = {
      id: "", // Will be set by database
      userId,
      schoolYearId: params.yearId,
      status: profileData.status || "draft",
      userType: "advisory", // Ensure userType is set for admin filtering
      ...profileData,
      achievements: profileData.achievements || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (advisoryProfile.status === "pending") {
      advisoryProfile.submittedAt = new Date()
    }

    // Save to database
    const createdProfile = await db.createProfile("advisory", advisoryProfile)

    // Create yearbook entries if profile is approved or pending
    if (advisoryProfile.status === "approved" || advisoryProfile.status === "pending") {
      try {
        // Parse academic assignments
        const academicYearLevels = typeof advisoryProfile.academicYearLevels === 'string' 
          ? JSON.parse(advisoryProfile.academicYearLevels) 
          : advisoryProfile.academicYearLevels || []
        
        const academicSections = typeof advisoryProfile.academicSections === 'string' 
          ? JSON.parse(advisoryProfile.academicSections) 
          : advisoryProfile.academicSections || []
        
        if (academicYearLevels.length > 0) {
          const db = await connectToDatabase()
          // Get the department-specific collection
          const departmentCollectionName = getCollectionName("student", advisoryProfile.academicDepartment)
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
                    schoolYearId: advisoryProfile.schoolYearId,
                    schoolYear: advisoryProfile.schoolYear,
                    status: advisoryProfile.status,
                    fullName: advisoryProfile.fullName || `${advisoryProfile.firstName} ${advisoryProfile.lastName}`,
                    nickname: advisoryProfile.nickname,
                    age: advisoryProfile.age,
                    gender: advisoryProfile.gender,
                    birthday: advisoryProfile.birthday,
                    address: advisoryProfile.address,
                    email: advisoryProfile.email,
                    phone: advisoryProfile.phone,
                    profilePicture: advisoryProfile.profilePicture,
                    sayingMotto: advisoryProfile.sayingMotto,
                    bio: advisoryProfile.bio,
                    achievements: advisoryProfile.achievements || [],
                    
                    // Academic assignment information
                    department: advisoryProfile.academicDepartment,
                    yearLevel: yearLevel,
                    courseProgram: advisoryProfile.academicCourseProgram || advisoryProfile.academicDepartment,
                    blockSection: sectionName,
                    
                    // Advisory-specific information
                    position: advisoryProfile.position,
                    departmentAssigned: advisoryProfile.departmentAssigned,
                    yearsOfService: advisoryProfile.yearsOfService,
                    messageToStudents: advisoryProfile.messageToStudents,
                    courses: advisoryProfile.courses,
                    additionalRoles: advisoryProfile.additionalRoles,
                    
                    // Mark as advisory entry
                    isAdvisoryEntry: true,
                    originalAdvisoryId: createdProfile._id,
                    userType: "advisory",
                    
                    // Metadata
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }
                  
                  await departmentCollection.insertOne(advisoryYearbookEntry)
                  console.log(`[Advisory Creation] Created yearbook entry for ${advisoryProfile.academicDepartment} - ${yearLevel} - ${sectionName}`)
                }
              }
            } else {
              // If no specific sections, create a general entry for the year level
              const advisoryYearbookEntry = {
                // Basic profile information
                schoolYearId: advisoryProfile.schoolYearId,
                schoolYear: advisoryProfile.schoolYear,
                status: advisoryProfile.status,
                fullName: advisoryProfile.fullName || `${advisoryProfile.firstName} ${advisoryProfile.lastName}`,
                nickname: advisoryProfile.nickname,
                age: advisoryProfile.age,
                gender: advisoryProfile.gender,
                birthday: advisoryProfile.birthday,
                address: advisoryProfile.address,
                email: advisoryProfile.email,
                phone: advisoryProfile.phone,
                profilePicture: advisoryProfile.profilePicture,
                sayingMotto: advisoryProfile.sayingMotto,
                bio: advisoryProfile.bio,
                achievements: advisoryProfile.achievements || [],
                
                // Academic assignment information
                department: advisoryProfile.academicDepartment,
                yearLevel: yearLevel,
                courseProgram: advisoryProfile.academicCourseProgram || advisoryProfile.academicDepartment,
                
                // Advisory-specific information
                position: advisoryProfile.position,
                departmentAssigned: advisoryProfile.departmentAssigned,
                yearsOfService: advisoryProfile.yearsOfService,
                messageToStudents: advisoryProfile.messageToStudents,
                courses: advisoryProfile.courses,
                additionalRoles: advisoryProfile.additionalRoles,
                
                // Mark as advisory entry
                isAdvisoryEntry: true,
                originalAdvisoryId: createdProfile._id,
                userType: "advisory",
                
                // Metadata
                createdAt: new Date(),
                updatedAt: new Date(),
              }
              
              await departmentCollection.insertOne(advisoryYearbookEntry)
              console.log(`[Advisory Creation] Created general yearbook entry for ${advisoryProfile.academicDepartment} - ${yearLevel}`)
            }
          }
        }
      } catch (yearbookError) {
        console.error('Error creating yearbook entries for Advisory profile:', yearbookError)
        // Don't fail the creation if yearbook entry creation fails
      }
    }

    return NextResponse.json({
      success: true,
      data: createdProfile,
    })
  } catch (error) {
    console.error("Error creating advisory profile:", error)
    return NextResponse.json({ success: false, error: "Failed to create advisory profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing profile ID" }, { status: 400 })
    }

    // Update profile
    const updatedProfile = await db.updateProfile(id, "advisory", {
      ...updateData,
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      data: updatedProfile,
    })
  } catch (error) {
    console.error("Error updating advisory profile:", error)
    return NextResponse.json({ success: false, error: "Failed to update advisory profile" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing profile ID" }, { status: 400 })
    }

    // Delete profile
    const deleted = await db.deleteProfile(id, "advisory")

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Advisory profile deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting advisory profile:", error)
    return NextResponse.json({ success: false, error: "Failed to delete advisory profile" }, { status: 500 })
  }
}
