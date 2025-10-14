import { NextRequest, NextResponse } from 'next/server'
import { yearbookService } from '@/lib/yearbook-service'
import { Department } from '@/lib/yearbook-schemas'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department') as Department

    if (!department) {
      return NextResponse.json({
        success: false,
        error: 'Department parameter is required'
      }, { status: 400 })
    }

    const result = await yearbookService.getYearbookEntryById(department, params.id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in yearbook GET by ID API:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { department, data } = body

    if (!department || !data) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: department, data'
      }, { status: 400 })
    }

    const result = await yearbookService.updateYearbookEntry({
      department,
      id: params.id,
      data
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in yearbook PUT API:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department') as Department

    if (!department) {
      return NextResponse.json({
        success: false,
        error: 'Department parameter is required'
      }, { status: 400 })
    }

    const result = await yearbookService.deleteYearbookEntry(department, params.id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in yearbook DELETE API:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
