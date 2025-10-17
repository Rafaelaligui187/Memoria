import { NextRequest, NextResponse } from "next/server"
import { yearbookService } from "@/lib/yearbook-service"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Student ID is required" },
        { status: 400 }
      )
    }

    console.log("[API] Fetching student profile for ID:", id)

    // Try to find in Senior High collection first
    try {
      const result = await yearbookService.getYearbookEntryById("Senior High", id)
      if (result.success && result.data) {
        console.log("[API] Found student in Senior High:", result.data.fullName)
        
        // Transform data for Staff and Utility profiles to prioritize officeAssigned
        let transformedData = result.data
        
        if (result.data.userType === "staff" || result.data.userType === "utility") {
          // For Staff and Utility profiles, prioritize officeAssigned over department
          transformedData = {
            ...result.data,
            // Override department display with officeAssigned for Staff/Utility
            departmentDisplay: result.data.officeAssigned || result.data.office || result.data.departmentAssigned || result.data.department,
            // Keep original department for reference
            originalDepartment: result.data.department,
            // Add hierarchy for proper display logic
            hierarchy: result.data.hierarchy || result.data.userType
          }
        }
        
        return NextResponse.json({
          success: true,
          data: transformedData
        })
      }
    } catch (error) {
      console.log("[API] Senior High search failed:", error)
    }

    // Try other departments if not found in Senior High
    const departments = ["College", "Junior High", "Elementary", "Alumni", "Faculty & Staff", "AR Sisters"]
    
    for (const department of departments) {
      try {
        const result = await yearbookService.getYearbookEntryById(department as any, id)
        if (result.success && result.data) {
          console.log(`[API] Found student in ${department}:`, result.data.fullName)
          
          // Transform data for Staff and Utility profiles to prioritize officeAssigned
          let transformedData = result.data
          
          if (department === "Faculty & Staff" && (result.data.userType === "staff" || result.data.userType === "utility")) {
            // For Staff and Utility profiles, prioritize officeAssigned over department
            transformedData = {
              ...result.data,
              // Override department display with officeAssigned for Staff/Utility
              departmentDisplay: result.data.officeAssigned || result.data.office || result.data.departmentAssigned || result.data.department,
              // Keep original department for reference
              originalDepartment: result.data.department,
              // Add hierarchy for proper display logic
              hierarchy: result.data.hierarchy || result.data.userType
            }
          }
          
          return NextResponse.json({
            success: true,
            data: transformedData
          })
        }
      } catch (error) {
        console.log(`[API] ${department} search failed:`, error)
      }
    }

    console.log("[API] No student profile found for ID:", id)
    return NextResponse.json(
      { success: false, error: "Student profile not found" },
      { status: 404 }
    )

  } catch (error) {
    console.error("Error fetching student profile:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
