import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { YEARBOOK_COLLECTIONS } from "@/lib/yearbook-schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')
    const department = searchParams.get('department')
    const hierarchy = searchParams.get('hierarchy')

    console.log('[Faculty API] Fetching faculty profiles:', { schoolYearId, department, hierarchy })

    const db = await connectToDatabase()
    
    // Fetch from Faculty & Staff collection
    const facultyCollection = db.collection("FacultyStaff_yearbook")

    // Build query for Faculty & Staff
    const query: any = {
      status: "approved", // Only show approved profiles
      userType: { $in: ["faculty", "staff", "utility"] }, // Only include these user types
      isAdvisoryEntry: { $ne: true } // Explicitly exclude Advisory entries
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
      } else if (department === "AR Sisters") {
        // For AR Sisters filter, we'll handle this separately
        query.userType = "nonexistent" // This will return no results from faculty collection
      } else {
        query.department = department
      }
    }

    if (hierarchy) {
      query.hierarchy = hierarchy
    }

    console.log('[Faculty API] Faculty & Staff Query:', query)

    const facultyProfiles = await facultyCollection.find(query).toArray()
    
    // Debug: Log all profiles to see if any Advisory profiles are in Faculty & Staff collection
    const allFacultyProfiles = await facultyCollection.find({ schoolYearId }).toArray()
    console.log('[Faculty API] Debug - All profiles in Faculty & Staff collection:', allFacultyProfiles.map(p => ({
      name: p.fullName,
      userType: p.userType,
      isAdvisoryEntry: p.isAdvisoryEntry
    })))

    // Fetch AR Sisters profiles
    const arSistersCollection = db.collection(YEARBOOK_COLLECTIONS.AR_SISTERS)
    const arSistersQuery: any = { status: "approved" }
    
    if (schoolYearId) {
      arSistersQuery.schoolYearId = schoolYearId
    }

    // Handle department filter for AR Sisters
    if (department === "AR Sisters") {
      // Only fetch AR Sisters when AR Sisters filter is selected
      // No additional query constraints needed
    } else if (department && department !== "All") {
      // For any specific department filter (Faculty, Staff, Utility, etc.), don't fetch AR Sisters
      arSistersQuery.userType = "nonexistent" // This will return no results
    }
    // If department is "All", fetch all AR Sisters (default behavior)

    console.log('[Faculty API] AR Sisters Query:', arSistersQuery)

    const arSistersProfiles = await arSistersCollection.find(arSistersQuery).toArray()

    console.log('[Faculty API] Found Faculty & Staff profiles:', facultyProfiles.length)
    console.log('[Faculty API] Found AR Sisters profiles:', arSistersProfiles.length)

    // Helper function to determine hierarchy based on position
    const getHierarchyFromPosition = (position: string, isARSister: boolean) => {
      if (!position) return "faculty"
      
      const pos = position.toLowerCase()
      
      // AR Sisters hierarchy
      if (isARSister) {
        if (pos.includes("directress") || pos.includes("superior")) return "directress"
        if (pos.includes("sister")) return "superior"
      }
      
      // Department hierarchy
      if (pos.includes("department head") || pos.includes("head")) return "department_head"
      if (pos.includes("office head")) return "office_head"
      if (pos.includes("teacher") || pos.includes("instructor") || pos.includes("professor")) return "faculty"
      if (pos.includes("staff")) return "staff"
      if (pos.includes("utility") || pos.includes("maintenance")) return "utility"
      
      return "faculty" // Default fallback
    }

    // Transform the data to match the expected format
    const transformedProfiles = facultyProfiles.map((profile, index) => ({
      id: profile._id.toString(),
      name: profile.fullName || profile.name || "Unknown",
      position: profile.position || "Position Not Set",
      department: profile.departmentAssigned || profile.department || "Department Not Set",
      hierarchy: getHierarchyFromPosition(profile.position, profile.isARSister || false),
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
      isARSister: profile.isARSister || false, // Add AR sister identification
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

    // Transform AR Sisters profiles to match Faculty & Staff format
    const transformedARSisters = arSistersProfiles.map((profile, index) => ({
      id: profile._id.toString(),
      name: profile.fullName || "Unknown",
      position: profile.position === "Others" && profile.customPosition ? profile.customPosition : profile.position || "Position Not Set",
      department: profile.departmentAssigned || "AR Sisters",
      hierarchy: getHierarchyFromPosition(profile.position, true), // Always true for AR Sisters
      schoolYear: profile.schoolYear || profile.schoolYearId || "Unknown",
      schoolYearId: profile.schoolYearId || "Unknown",
      yearsOfService: profile.yearsOfService || 0,
      email: profile.email || "",
      office: profile.departmentAssigned || "AR Sisters",
      image: profile.profilePicture || "/placeholder-user.jpg",
      bio: profile.bio || profile.messageToStudents || "",
      featured: false,
      achievements: profile.achievements || [],
      additionalRoles: profile.additionalRoles || [],
      isARSister: true, // Mark as AR Sister
      // Additional fields for compatibility
      fullName: profile.fullName,
      nickname: profile.nickname || "",
      age: profile.age || 0,
      birthday: profile.birthday || "",
      address: profile.address || "",
      phone: profile.phone || "",
      sayingMotto: profile.sayingMotto || "",
      socialMediaFacebook: profile.socialMedia?.facebook || "",
      socialMediaInstagram: profile.socialMedia?.instagram || "",
      socialMediaTwitter: profile.socialMedia?.twitter || "",
      messageToStudents: profile.messageToStudents || "",
      courses: "", // AR Sisters don't have courses field
      // AR Sisters specific fields
      userType: "ar-sisters",
      religiousOrder: profile.religiousOrder || "",
      vowsDate: profile.vowsDate || "",
      specialization: profile.specialization || "",
      education: profile.education || "",
      publications: profile.publications || "",
      research: profile.research || "",
      classesHandled: profile.classesHandled || "",
      dreamJob: profile.dreamJob || "",
      // Metadata
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      isManualProfile: false,
      createdByAdmin: profile.createdByAdmin || false
    }))

    // Combine Faculty & Staff with AR Sisters based on department filter
    let allProfiles: any[] = []
    
    if (department === "AR Sisters") {
      // Only return AR Sisters profiles
      allProfiles = [...transformedARSisters]
    } else if (department && department !== "All") {
      // For specific department filters (Faculty, Staff, Utility), only return Faculty & Staff profiles
      allProfiles = [...transformedProfiles]
    } else {
      // For "All" filter, return both Faculty & Staff and AR Sisters profiles
      allProfiles = [...transformedProfiles, ...transformedARSisters]
    }

    console.log('[Faculty API] Combined profiles:', allProfiles.length)
    console.log('[Faculty API] AR Sisters transformed:', transformedARSisters.length)

    return NextResponse.json({
      success: true,
      data: allProfiles,
      count: allProfiles.length
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
