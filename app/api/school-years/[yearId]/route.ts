import { NextRequest, NextResponse } from 'next/server'
import { yearbookService } from '@/lib/yearbook-service'

export async function GET(
  request: NextRequest,
  { params }: { params: { yearId: string } }
) {
  try {
    const { yearId } = params

    if (!yearId) {
      return NextResponse.json({
        success: false,
        error: 'School year ID is required'
      }, { status: 400 })
    }

    // Get all school years and find the one with matching ID
    const result = await yearbookService.getSchoolYears()
    
    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    // Find the school year with matching ID
    const schoolYear = result.data?.find((year: any) => 
      year._id?.toString() === yearId || year._id === yearId
    )

    if (!schoolYear) {
      return NextResponse.json({
        success: false,
        error: 'School year not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: schoolYear
    })

  } catch (error) {
    console.error('Error fetching school year:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
