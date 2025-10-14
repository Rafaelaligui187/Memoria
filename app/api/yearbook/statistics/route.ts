import { NextRequest, NextResponse } from 'next/server'
import { yearbookService } from '@/lib/yearbook-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')

    if (!schoolYearId) {
      return NextResponse.json({
        success: false,
        error: 'School year ID parameter is required'
      }, { status: 400 })
    }

    const result = await yearbookService.getYearbookStatistics(schoolYearId)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in yearbook statistics API:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
