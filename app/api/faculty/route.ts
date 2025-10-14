import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')
    const department = searchParams.get('department')
    const hierarchy = searchParams.get('hierarchy')

    console.log('[Faculty API] Fetching faculty profiles:', { schoolYearId, department, hierarchy })

    const db = await connectToDatabase()
    const facultyCollection = db.collection("FacultyStaff_yearbook")

    // Build query
    const query: any = {
      status: "approved", // Only show approved profiles
      $or: [
        { userType: "faculty" },
        { userType: "staff" },
        { userType: "utility" }
      ]
    }

    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }

    if (department && department !== "All") {
      if (department === "Faculty") {
        query.userType = "faculty"
      } else if (department === "Staff") {
        query.userType = "staff"
      } else if (department === "Utility") {
        query.userType = "utility"
      } else {
        query.department = department
      }
    }

    if (hierarchy) {
      query.hierarchy = hierarchy
    }

    console.log('[Faculty API] Query:', query)

    const facultyProfiles = await facultyCollection.find(query).toArray()

    console.log('[Faculty API] Found profiles:', facultyProfiles.length)

    // Transform the data to match the expected format
    const transformedProfiles = facultyProfiles.map((profile, index) => ({
      id: profile._id.toString(),
      name: profile.fullName || profile.name || "Unknown",
      position: profile.position || "Position Not Set",
      department: profile.departmentAssigned || profile.department || "Department Not Set",
      hierarchy: profile.hierarchy || profile.userType || "faculty",
      schoolYear: profile.schoolYear || profile.schoolYearId || "Unknown", // Use schoolYear label first, fallback to ID
      schoolYearId: profile.schoolYearId || "Unknown", // Keep the ID as well
      yearsOfService: profile.yearsOfService || 0,
      email: profile.email || "",
      office: profile.officeAssigned || profile.office || "Office Not Set",
      image: profile.profilePicture || "/placeholder-user.jpg",
      bio: profile.bio || profile.messageToStudents || "",
      featured: profile.featured || false,
      achievements: profile.achievements || [],
      additionalRoles: profile.additionalRoles || [],
      // Additional fields for compatibility
      fullName: profile.fullName || profile.name,
      nickname: profile.nickname || "",
      age: profile.age || 0,
      birthday: profile.birthday || "",
      address: profile.address || "",
      phone: profile.phone || "",
      sayingMotto: profile.sayingMotto || "",
      socialMediaFacebook: profile.socialMediaFacebook || "",
      socialMediaInstagram: profile.socialMediaInstagram || "",
      socialMediaTwitter: profile.socialMediaTwitter || "",
      messageToStudents: profile.messageToStudents || "",
      courses: profile.courses || "",
      // Metadata
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      isManualProfile: profile.isManualProfile || false,
      createdByAdmin: profile.createdByAdmin || false
    }))

    return NextResponse.json({
      success: true,
      data: transformedProfiles,
      count: transformedProfiles.length
    })

  } catch (error) {
    console.error('[Faculty API] Error fetching faculty profiles:', error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch faculty profiles",
      data: []
    }, { status: 500 })
  }
}
