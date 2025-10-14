import { NextRequest, NextResponse } from 'next/server'
import { yearbookService } from '@/lib/yearbook-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'

    let result

    if (activeOnly) {
      result = await yearbookService.getActiveSchoolYear()
    } else {
      result = await yearbookService.getSchoolYears()
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in school years API:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}