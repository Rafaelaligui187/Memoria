import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { YEARBOOK_COLLECTIONS } from "@/lib/yearbook-schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')

    console.log('[Faculty Departments API] Fetching unique departments:', { schoolYearId })

    const db = await connectToDatabase()
    
    // Fetch from Faculty & Staff collection
    const facultyCollection = db.collection("FacultyStaff_yearbook")

    // Build query for Faculty & Staff
    const query: any = {
      status: "approved", // Only show approved profiles
      userType: { $in: ["faculty", "staff", "utility"] }, // Only include these user types
      isAdvisoryEntry: { $ne: true }, // Explicitly exclude Advisory entries
      department: { $exists: true, $ne: null, $ne: "" } // Only include profiles with department
    }

    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }

    console.log('[Faculty Departments API] Faculty & Staff Query:', query)

    // Get unique departments from faculty profiles
    const departments = await facultyCollection.distinct("department", query)
    
    // Filter out null, undefined, and empty string values
    const validDepartments = departments.filter(dept => 
      dept && typeof dept === 'string' && dept.trim() !== ''
    )

    // Check if there are any faculty with 15+ years of experience
    const masterTeacherQuery = {
      ...query,
      $expr: {
        $gte: [{ $toInt: { $ifNull: ["$yearsOfService", 0] } }, 15]
      }
    }
    
    const masterTeachersExist = await facultyCollection.countDocuments(masterTeacherQuery)
    
    // Add "Master Teacher" department if faculty with 15+ years exist
    if (masterTeachersExist > 0) {
      validDepartments.push("Master Teacher")
    }

    // Sort departments alphabetically
    const sortedDepartments = validDepartments.sort((a, b) => a.localeCompare(b))

    console.log('[Faculty Departments API] Found departments:', sortedDepartments)
    console.log('[Faculty Departments API] Master Teachers (15+ years):', masterTeachersExist)

    return NextResponse.json({
      success: true,
      data: sortedDepartments
    })

  } catch (error) {
    console.error('[Faculty Departments API] Error:', error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch departments" },
      { status: 500 }
    )
  }
}
