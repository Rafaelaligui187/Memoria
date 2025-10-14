import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { YEARBOOK_COLLECTIONS } from '@/lib/yearbook-schemas'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria'

// GET /api/yearbook-pages/templates - Get all template pages
export async function GET(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection(YEARBOOK_COLLECTIONS.PAGES)
    
    const { searchParams } = new URL(request.url)
    const pageType = searchParams.get('pageType')
    
    // Build query for templates
    const query: any = { isTemplate: true }
    
    if (pageType) {
      query.pageType = pageType
    }
    
    // Get template pages
    const templates = await collection
      .find(query)
      .sort({ pageType: 1, pageNumber: 1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length
    })
    
  } catch (error) {
    console.error('Error fetching template pages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch template pages' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// POST /api/yearbook-pages/templates - Create pages from template
export async function POST(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection(YEARBOOK_COLLECTIONS.PAGES)
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.schoolYearId || !body.schoolYear || !body.createdBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: schoolYearId, schoolYear, createdBy' },
        { status: 400 }
      )
    }
    
    // Get template pages
    const templateQuery: any = { isTemplate: true }
    if (body.pageType) {
      templateQuery.pageType = body.pageType
    }
    
    const templates = await collection.find(templateQuery).toArray()
    
    if (templates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No templates found' },
        { status: 404 }
      )
    }
    
    // Create pages from templates
    const pagesToInsert = templates.map(template => ({
      schoolYearId: body.schoolYearId,
      schoolYear: body.schoolYear,
      pageType: template.pageType,
      pageTitle: template.pageTitle,
      pageNumber: template.pageNumber,
      content: template.content,
      department: body.department || template.department,
      section: body.section || template.section,
      courseProgram: body.courseProgram || template.courseProgram,
      yearLevel: body.yearLevel || template.yearLevel,
      blockSection: body.blockSection || template.blockSection,
      createdBy: body.createdBy,
      lastModifiedBy: body.createdBy,
      isPublished: false,
      isTemplate: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }))
    
    // Insert the pages
    const result = await collection.insertMany(pagesToInsert)
    
    return NextResponse.json({
      success: true,
      data: { insertedCount: result.insertedCount },
      message: `Created ${result.insertedCount} pages from templates`
    })
    
  } catch (error) {
    console.error('Error creating pages from templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create pages from templates' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
