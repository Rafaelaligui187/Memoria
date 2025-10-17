import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { YEARBOOK_COLLECTIONS } from "@/lib/yearbook-schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')
    const status = searchParams.get('status')
    const department = searchParams.get('department')
    const userType = searchParams.get('userType')

    console.log('Fetching profiles for admin review:', { schoolYearId, status, department, userType })

    const db = await connectToDatabase()
    
    // Search across all collections including advisory profiles
    const collectionsToSearch = [...Object.values(YEARBOOK_COLLECTIONS), 'advisory_profiles']
    let allProfiles: any[] = []
    
    for (const collectionName of collectionsToSearch) {
      const collection = db.collection(collectionName)
      
      // Build query
      const query: any = {}
      if (schoolYearId) query.schoolYearId = schoolYearId
      if (status) query.status = status
      if (userType) query.userType = userType
      if (department) query.department = department
      
      const profiles = await collection.find(query).sort({ createdAt: -1 }).toArray()
      
      // Add collection info to each profile
      const profilesWithCollection = profiles.map(profile => ({
        ...profile,
        collection: collectionName,
        collectionDisplayName: getCollectionDisplayName(collectionName)
      }))
      
      allProfiles = allProfiles.concat(profilesWithCollection)
    }

    // Convert profiles to Account format for admin display
    const accounts = allProfiles.map(profile => ({
      id: profile._id.toString(),
      name: profile.fullName || `${profile.firstName} ${profile.lastName}`,
      email: profile.email,
      role: mapUserTypeToRole(profile.userType),
      department: profile.department || profile.departmentAssigned || profile.academicDepartment || 'Unknown',
      status: mapStatusToAccountStatus(profile.status),
      yearId: profile.schoolYearId,
      schoolYear: profile.schoolYear,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      profileStatus: profile.status,
      profileId: profile._id.toString(),
      collection: profile.collection,
      collectionDisplayName: profile.collectionDisplayName,
      rejectionReason: profile.rejectionReason,
      reviewedAt: profile.reviewedAt,
      reviewedBy: profile.reviewedBy,
      // Include relevant profile data
      ...profile
    }))

    return NextResponse.json({
      success: true,
      accounts,
      total: accounts.length
    })

  } catch (error) {
    console.error('Error fetching admin profiles:', error)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch profiles",
      message: "An error occurred while fetching profile data"
    }, { status: 500 })
  }
}

// Helper function to map user type to display role
function mapUserTypeToRole(userType: string): "Student" | "Faculty" | "Alumni" | "Staff" | "Utility" | "Advisory" {
  switch (userType) {
    case 'student':
      return "Student"
    case 'faculty':
      return "Faculty"
    case 'alumni':
      return "Alumni"
    case 'staff':
      return "Staff"
    case 'utility':
      return "Utility"
    case 'advisory':
      return "Advisory"
    default:
      return "Student"
  }
}

// Helper function to map profile status to account status
function mapStatusToAccountStatus(profileStatus: string): "Active" | "Inactive" | "Pending" {
  switch (profileStatus) {
    case 'approved':
      return "Active"
    case 'rejected':
      return "Inactive"
    case 'pending':
      return "Pending"
    default:
      return "Pending"
  }
}

// Helper function to get collection display name
function getCollectionDisplayName(collectionName: string): string {
  switch (collectionName) {
    case YEARBOOK_COLLECTIONS.COLLEGE:
      return 'College'
    case YEARBOOK_COLLECTIONS.SENIOR_HIGH:
      return 'Senior High'
    case YEARBOOK_COLLECTIONS.JUNIOR_HIGH:
      return 'Junior High'
    case YEARBOOK_COLLECTIONS.ELEMENTARY:
      return 'Elementary'
    case YEARBOOK_COLLECTIONS.ALUMNI:
      return 'Alumni'
    case YEARBOOK_COLLECTIONS.FACULTY_STAFF:
      return 'Faculty & Staff'
    case YEARBOOK_COLLECTIONS.AR_SISTERS:
      return 'AR Sisters'
    case 'advisory_profiles':
      return 'Advisory'
    default:
      return collectionName
  }
}
