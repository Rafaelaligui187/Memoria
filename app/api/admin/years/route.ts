import { type NextRequest, NextResponse } from "next/server"
import { yearbookService } from "@/lib/yearbook-service"
import { createAuditLog, getClientInfo } from "@/lib/audit-log-utils"

interface SchoolYear {
  id: string
  label: string
  status: "active" | "archived" | "draft"
  startDate: string
  endDate: string
  profileCount?: number
  albumCount?: number
  pendingCount?: number
  createdAt: string
  updatedAt: string
}

export async function GET() {
  try {
    const result = await yearbookService.getSchoolYears()
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    // Transform yearbook API response to admin interface format
    const transformedYears = result.data?.map((year) => ({
      id: year._id?.toString() || '',
      label: year.yearLabel,
      status: year.isActive ? 'active' : 'archived',
      startDate: year.startDate.toISOString(),
      endDate: year.endDate.toISOString(),
      profileCount: 0, // TODO: Calculate from yearbook entries
      albumCount: 0, // TODO: Calculate from albums
      pendingCount: 0, // TODO: Calculate from pending entries
      createdAt: year.createdAt.toISOString(),
      updatedAt: year.updatedAt.toISOString(),
    })) || []
    
    return NextResponse.json({
      success: true,
      data: transformedYears,
    })
  } catch (error) {
    console.error("Failed to fetch school years:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch school years" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { yearLabel, startDate, endDate, status = "draft" } = body

    if (!yearLabel || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create school year using yearbook service
    const result = await yearbookService.createSchoolYear({
      yearLabel,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: status === 'active'
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    // Transform to admin interface format
    const newYear: SchoolYear = {
      id: result.data._id?.toString() || '',
      label: result.data.yearLabel,
      status: result.data.isActive ? 'active' : 'archived',
      startDate: result.data.startDate.toISOString(),
      endDate: result.data.endDate.toISOString(),
      profileCount: 0,
      albumCount: 0,
      pendingCount: 0,
      createdAt: result.data.createdAt.toISOString(),
      updatedAt: result.data.updatedAt.toISOString(),
    }

    // Also dispatch the event with yearbook format for profile management
    console.log('School year created successfully:', newYear)

    // Create audit log for school year creation
    try {
      const clientInfo = getClientInfo(request)
      await createAuditLog({
        userId: "admin",
        userName: "Admin",
        action: "school_year_created",
        targetType: "school_year",
        targetId: newYear.id,
        targetName: newYear.label,
        details: {
          yearLabel: newYear.label,
          startDate: newYear.startDate,
          endDate: newYear.endDate,
          status: newYear.status,
          isActive: newYear.status === 'active'
        },
        schoolYearId: newYear.id,
        userAgent: clientInfo.userAgent,
        status: "success"
      })
    } catch (auditError) {
      console.error('[School Years API] Failed to create audit log for creation:', auditError)
      // Don't fail the school year creation if audit logging fails
    }

    return NextResponse.json({
      success: true,
      data: newYear,
    })
  } catch (error) {
    console.error("Failed to create school year:", error)
    return NextResponse.json({ success: false, error: "Failed to create school year" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, yearLabel, startDate, endDate, status } = body

    if (!id || !yearLabel || !startDate || !endDate || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Update school year using yearbook service
    const result = await yearbookService.updateSchoolYear(id, {
      yearLabel,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isActive: status === 'active'
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    // Transform to admin interface format
    const updatedYear: SchoolYear = {
      id: result.data._id?.toString() || '',
      label: result.data.yearLabel,
      status: result.data.isActive ? 'active' : 'archived',
      startDate: result.data.startDate.toISOString(),
      endDate: result.data.endDate.toISOString(),
      profileCount: 0,
      albumCount: 0,
      pendingCount: 0,
      createdAt: result.data.createdAt.toISOString(),
      updatedAt: result.data.updatedAt.toISOString(),
    }

    // Create audit log for school year update
    try {
      const clientInfo = getClientInfo(request)
      await createAuditLog({
        userId: "admin",
        userName: "Admin",
        action: "school_year_updated",
        targetType: "school_year",
        targetId: updatedYear.id,
        targetName: updatedYear.label,
        details: {
          originalData: {
            yearLabel: body.yearLabel,
            startDate: body.startDate,
            endDate: body.endDate,
            status: body.status
          },
          updatedData: {
            yearLabel: updatedYear.label,
            startDate: updatedYear.startDate,
            endDate: updatedYear.endDate,
            status: updatedYear.status
          },
          changes: Object.keys(body)
        },
        schoolYearId: updatedYear.id,
        userAgent: clientInfo.userAgent,
        status: "success"
      })
    } catch (auditError) {
      console.error('[School Years API] Failed to create audit log for update:', auditError)
      // Don't fail the school year update if audit logging fails
    }

    return NextResponse.json({
      success: true,
      data: updatedYear,
    })
  } catch (error) {
    console.error("Failed to update school year:", error)
    return NextResponse.json({ success: false, error: "Failed to update school year" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: "School year ID is required" }, { status: 400 })
    }

    // Check if the year exists and is not active
    const yearResult = await yearbookService.getSchoolYears()
    if (!yearResult.success) {
      return NextResponse.json({ success: false, error: yearResult.error }, { status: 500 })
    }

    const yearToDelete = yearResult.data?.find(year => year._id?.toString() === id)
    if (!yearToDelete) {
      return NextResponse.json({ success: false, error: "School year not found" }, { status: 404 })
    }

    if (yearToDelete.isActive) {
      return NextResponse.json({ 
        success: false, 
        error: "Cannot delete the active school year. Please set another year as active first." 
      }, { status: 400 })
    }

    // Delete school year using yearbook service
    const result = await yearbookService.deleteSchoolYear(id)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    // Create audit log for school year deletion
    try {
      const clientInfo = getClientInfo(request)
      await createAuditLog({
        userId: "admin",
        userName: "Admin",
        action: "school_year_deleted",
        targetType: "school_year",
        targetId: id,
        targetName: yearToDelete.yearLabel,
        details: {
          deletedYearData: {
            yearLabel: yearToDelete.yearLabel,
            startDate: yearToDelete.startDate,
            endDate: yearToDelete.endDate,
            isActive: yearToDelete.isActive,
            createdAt: yearToDelete.createdAt
          }
        },
        schoolYearId: id,
        userAgent: clientInfo.userAgent,
        status: "success"
      })
    } catch (auditError) {
      console.error('[School Years API] Failed to create audit log for deletion:', auditError)
      // Don't fail the school year deletion if audit logging fails
    }

    return NextResponse.json({
      success: true,
      message: "School year deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete school year:", error)
    return NextResponse.json({ success: false, error: "Failed to delete school year" }, { status: 500 })
  }
}
