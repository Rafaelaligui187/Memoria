import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { YEARBOOK_COLLECTIONS, YearbookPageSchema } from '@/lib/yearbook-schemas'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria'

// GET /api/yearbook-pages - Get all yearbook pages for a school year
export async function GET(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection(YEARBOOK_COLLECTIONS.PAGES)
    
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')
    const pageType = searchParams.get('pageType')
    const department = searchParams.get('department')
    const section = searchParams.get('section')
    const isPublished = searchParams.get('isPublished')
    const isTemplate = searchParams.get('isTemplate')
    
    // Build query
    const query: any = {}
    
    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }
    
    if (pageType) {
      query.pageType = pageType
    }
    
    if (department) {
      query.department = department
    }
    
    if (section) {
      query.section = section
    }
    
    if (isPublished !== null) {
      query.isPublished = isPublished === 'true'
    }
    
    if (isTemplate !== null) {
      query.isTemplate = isTemplate === 'true'
    }
    
    // Get pages
    const pages = await collection
      .find(query)
      .sort({ pageNumber: 1, createdAt: 1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      data: pages,
      count: pages.length
    })
    
  } catch (error) {
    console.error('Error fetching yearbook pages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch yearbook pages' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// POST /api/yearbook-pages - Create a new yearbook page
export async function POST(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection(YEARBOOK_COLLECTIONS.PAGES)
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['schoolYearId', 'schoolYear', 'pageType', 'pageTitle', 'createdBy']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Create page document
    const pageData: YearbookPageSchema = {
      schoolYearId: body.schoolYearId,
      schoolYear: body.schoolYear,
      pageType: body.pageType,
      pageTitle: body.pageTitle,
      pageNumber: body.pageNumber || null,
      content: {
        text: body.content?.text || '',
        images: body.content?.images || [],
        layout: body.content?.layout || 'single-column',
        customLayout: body.content?.customLayout || null
      },
      department: body.department || null,
      section: body.section || null,
      courseProgram: body.courseProgram || null,
      yearLevel: body.yearLevel || null,
      blockSection: body.blockSection || null,
      createdBy: body.createdBy,
      lastModifiedBy: body.lastModifiedBy || null,
      isPublished: body.isPublished || false,
      isTemplate: body.isTemplate || false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Insert the page
    const result = await collection.insertOne(pageData)
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...pageData },
      message: 'Yearbook page created successfully'
    })
    
  } catch (error) {
    console.error('Error creating yearbook page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create yearbook page' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
