import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb/connection'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const DEPARTMENT_TO_COLLECTION = {
  'College': 'College_yearbook',
  'Senior High': 'SeniorHigh_yearbook',
  'Junior High': 'JuniorHigh_yearbook',
  'Elementary': 'Elementary_yearbook',
  'Alumni': 'Alumni_yearbook',
  'Faculty & Staff': 'FacultyStaff_yearbook',
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Yearbook API called')
    
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const schoolYearId = searchParams.get('schoolYearId')
    const status = searchParams.get('status')
    const yearLevel = searchParams.get('yearLevel')
    const courseProgram = searchParams.get('courseProgram')
    const blockSection = searchParams.get('blockSection')
    const search = searchParams.get('search')

    console.log('Parameters:', { department, schoolYearId, status, yearLevel, courseProgram, blockSection, search })

    if (!department) {
      return NextResponse.json({
        success: false,
        error: 'Department parameter is required'
      }, { status: 400 })
    }

    if (!schoolYearId) {
      return NextResponse.json({
        success: false,
        error: 'School year ID parameter is required'
      }, { status: 400 })
    }

    // Check if department is valid
    if (!(department in DEPARTMENT_TO_COLLECTION)) {
      return NextResponse.json({
        success: false,
        error: `Invalid department: ${department}`
      }, { status: 400 })
    }

    console.log('✅ Department validation passed')

    // Connect to database
    const db = await connectToDatabase()
    console.log('✅ Database connection successful')

    // Get collection
    const collectionName = DEPARTMENT_TO_COLLECTION[department as keyof typeof DEPARTMENT_TO_COLLECTION]
    const collection = db.collection(collectionName)
    console.log(`✅ Collection "${collectionName}" accessed`)

    // Build query
    const filters: any = { schoolYearId }
    if (status) filters.status = status
    if (yearLevel) filters.yearLevel = yearLevel
    if (courseProgram) filters.courseProgram = courseProgram
    if (blockSection) {
      // Handle different block section formats
      if (department === 'College') {
        // For College, the database stores "Block A", "Block B", etc.
        // but the API might receive "A", "B", etc.
        if (blockSection.length === 1) {
          filters.blockSection = `Block ${blockSection}`
        } else {
          filters.blockSection = blockSection
        }
      } else {
        filters.blockSection = blockSection
      }
    }

    console.log('Query filters:', filters)

    // Execute query
    const data = await collection.find(filters).toArray()
    console.log(`✅ Query executed - found ${data.length} results`)

    // Transform data
    const transformedData = data.map((row) => ({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      birthday: row.birthday ? new Date(row.birthday) : undefined,
    }))

    console.log('✅ Data transformation completed')

    return NextResponse.json({
      success: true,
      data: transformedData,
      total: transformedData.length,
      message: `Found ${transformedData.length} entries in ${department}`
    })

  } catch (error) {
    console.error('❌ Error in yearbook GET API:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { department, schoolYearId, data } = body

    if (!department || !schoolYearId || !data) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: department, schoolYearId, data'
      }, { status: 400 })
    }

    const result = await yearbookService.createYearbookEntry({
      department,
      schoolYearId,
      data
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })

  } catch (error) {
    console.error('Error in yearbook POST API:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
