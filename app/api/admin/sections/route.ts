import { NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria'

interface Section {
  _id?: string
  department: 'elementary' | 'junior-high' | 'senior-high' | 'college'
  grade: string
  name: string
  schoolYearId: string
  schoolYear: string
  strandId?: string // For Senior High sections
  strandName?: string // For Senior High sections
  courseId?: string // For College blocks
  courseName?: string // For College blocks
  majorName?: string // For College blocks with majors
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// GET /api/admin/sections - Get all sections for a department and school year
export async function GET(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('sections')
    
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const schoolYearId = searchParams.get('schoolYearId')
    const grade = searchParams.get('grade')
    const strandId = searchParams.get('strandId')
    const strandName = searchParams.get('strandName')
    
    // Build query
    const query: any = {}
    
    if (department) {
      query.department = department
    }
    
    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }
    
    if (grade) {
      query.grade = grade
    }
    
    if (strandId) {
      query.strandId = strandId
    }
    
    if (strandName) {
      query.strandName = strandName
    }
    
    // Get sections
    const sections = await collection
      .find(query)
      .sort({ grade: 1, name: 1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      data: sections,
      count: sections.length
    })
    
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sections' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// POST /api/admin/sections - Create a new section
export async function POST(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('sections')
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['department', 'grade', 'name', 'schoolYearId', 'schoolYear']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // For Senior High, validate strand fields
    if (body.department === 'senior-high') {
      if (!body.strandId || !body.strandName) {
        return NextResponse.json(
          { success: false, error: 'Strand ID and name are required for Senior High sections' },
          { status: 400 }
        )
      }
    }
    
    // For College, validate course fields
    if (body.department === 'college') {
      if (!body.courseId || !body.courseName) {
        return NextResponse.json(
          { success: false, error: 'Course ID and name are required for College blocks' },
          { status: 400 }
        )
      }
    }
    
    // Check if section already exists
    const existingQuery: any = {
      department: body.department,
      grade: body.grade,
      name: body.name,
      schoolYearId: body.schoolYearId
    }
    
    // For Senior High, include strand in uniqueness check
    if (body.department === 'senior-high') {
      existingQuery.strandId = body.strandId
    }
    
    // For College, include course and major in uniqueness check
    if (body.department === 'college') {
      existingQuery.courseId = body.courseId
      if (body.majorName) {
        existingQuery.majorName = body.majorName
      }
    }
    
    const existingSection = await collection.findOne(existingQuery)
    
    if (existingSection) {
      return NextResponse.json(
        { success: false, error: 'Section already exists for this grade and school year' },
        { status: 409 }
      )
    }
    
    // Create section document
    const sectionData: Section = {
      department: body.department,
      grade: body.grade,
      name: body.name,
      schoolYearId: body.schoolYearId,
      schoolYear: body.schoolYear,
      strandId: body.strandId || undefined,
      strandName: body.strandName || undefined,
      courseId: body.courseId || undefined,
      courseName: body.courseName || undefined,
      majorName: body.majorName || undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Insert the section
    const result = await collection.insertOne(sectionData)
    
    console.log('[Sections API] Created section:', { _id: result.insertedId, ...sectionData })
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...sectionData },
      message: 'Section created successfully'
    })
    
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create section' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// PUT /api/admin/sections - Update a section
export async function PUT(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('sections')
    
    const body = await request.json()
    
    if (!body._id) {
      return NextResponse.json(
        { success: false, error: 'Section ID is required' },
        { status: 400 }
      )
    }
    
    // Update section
    const updateData = {
      ...body,
      updatedAt: new Date()
    }
    
    delete updateData._id
    
    const result = await collection.updateOne(
      { _id: body._id },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Section updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update section' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// DELETE /api/admin/sections - Delete a section
export async function DELETE(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('sections')
    
    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('id')
    
    if (!sectionId) {
      return NextResponse.json(
        { success: false, error: 'Section ID is required' },
        { status: 400 }
      )
    }
    
    // Delete section
    const result = await collection.deleteOne({ _id: new ObjectId(sectionId) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Section deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete section' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}