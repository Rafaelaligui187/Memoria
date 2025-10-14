import { NextRequest, NextResponse } from 'next/server'
import { yearbookService } from '@/lib/yearbook-service'
import { Department } from '@/lib/yearbook-schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { department, entries, updates } = body

    if (!department) {
      return NextResponse.json({
        success: false,
        error: 'Department parameter is required'
      }, { status: 400 })
    }

    let result

    if (entries) {
      // Bulk create entries
      result = await yearbookService.bulkCreateYearbookEntries(department, entries)
    } else if (updates) {
      // Bulk update entries
      result = await yearbookService.bulkUpdateYearbookEntries(department, updates)
    } else {
      return NextResponse.json({
        success: false,
        error: 'Either entries or updates parameter is required'
      }, { status: 400 })
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })

  } catch (error) {
    console.error('Error in yearbook bulk API:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
