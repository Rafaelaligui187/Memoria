import { type NextRequest, NextResponse } from "next/server"
import { yearbookService } from "@/lib/yearbook-service"

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

    return NextResponse.json({
      success: true,
      message: "School year deleted successfully",
    })
  } catch (error) {
    console.error("Failed to delete school year:", error)
    return NextResponse.json({ success: false, error: "Failed to delete school year" }, { status: 500 })
  }
}
