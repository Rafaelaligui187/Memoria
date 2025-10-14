import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { YEARBOOK_COLLECTIONS, YearbookPageSchema } from '@/lib/yearbook-schemas'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria'

// GET /api/yearbook-pages/[id] - Get a specific yearbook page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection(YEARBOOK_COLLECTIONS.PAGES)
    
    const pageId = params.id
    
    // Validate ObjectId
    if (!ObjectId.isValid(pageId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid page ID' },
        { status: 400 }
      )
    }
    
    const page = await collection.findOne({ _id: new ObjectId(pageId) })
    
    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: page
    })
    
  } catch (error) {
    console.error('Error fetching yearbook page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch yearbook page' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// PUT /api/yearbook-pages/[id] - Update a specific yearbook page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection(YEARBOOK_COLLECTIONS.PAGES)
    
    const pageId = params.id
    
    // Validate ObjectId
    if (!ObjectId.isValid(pageId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid page ID' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    
    // Check if page exists
    const existingPage = await collection.findOne({ _id: new ObjectId(pageId) })
    if (!existingPage) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
    
    // Prepare update data
    const updateData: Partial<YearbookPageSchema> = {
      updatedAt: new Date()
    }
    
    // Update fields if provided
    if (body.pageTitle !== undefined) updateData.pageTitle = body.pageTitle
    if (body.pageNumber !== undefined) updateData.pageNumber = body.pageNumber
    if (body.pageType !== undefined) updateData.pageType = body.pageType
    if (body.content !== undefined) updateData.content = body.content
    if (body.department !== undefined) updateData.department = body.department
    if (body.section !== undefined) updateData.section = body.section
    if (body.courseProgram !== undefined) updateData.courseProgram = body.courseProgram
    if (body.yearLevel !== undefined) updateData.yearLevel = body.yearLevel
    if (body.blockSection !== undefined) updateData.blockSection = body.blockSection
    if (body.lastModifiedBy !== undefined) updateData.lastModifiedBy = body.lastModifiedBy
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished
    if (body.isTemplate !== undefined) updateData.isTemplate = body.isTemplate
    
    // Update the page
    const result = await collection.updateOne(
      { _id: new ObjectId(pageId) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
    
    // Get updated page
    const updatedPage = await collection.findOne({ _id: new ObjectId(pageId) })
    
    return NextResponse.json({
      success: true,
      data: updatedPage,
      message: 'Yearbook page updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating yearbook page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update yearbook page' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// DELETE /api/yearbook-pages/[id] - Delete a specific yearbook page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection(YEARBOOK_COLLECTIONS.PAGES)
    
    const pageId = params.id
    
    // Validate ObjectId
    if (!ObjectId.isValid(pageId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid page ID' },
        { status: 400 }
      )
    }
    
    // Check if page exists
    const existingPage = await collection.findOne({ _id: new ObjectId(pageId) })
    if (!existingPage) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
    
    // Delete the page
    const result = await collection.deleteOne({ _id: new ObjectId(pageId) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Yearbook page deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting yearbook page:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete yearbook page' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
