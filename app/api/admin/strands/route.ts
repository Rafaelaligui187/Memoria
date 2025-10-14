import { NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority"

interface Strand {
  _id?: string
  name: string
  fullName: string
  description?: string
  tagline?: string
  department: string
  schoolYearId: string
  schoolYear: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// GET /api/admin/strands - Get all strands for a department and school year
export async function GET(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('strands')
    
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const schoolYearId = searchParams.get('schoolYearId')
    
    // Build query
    const query: any = {}
    
    if (department) {
      query.department = department
    }
    
    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }
    
    // Get strands
    const strands = await collection
      .find(query)
      .sort({ name: 1 })
      .toArray()
    
    return NextResponse.json({
      success: true,
      data: strands,
      count: strands.length
    })
    
  } catch (error) {
    console.error('Error fetching strands:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch strands' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// POST /api/admin/strands - Create a new strand
export async function POST(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('strands')
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'fullName', 'department', 'schoolYearId', 'schoolYear']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Check if strand already exists
    const existingStrand = await collection.findOne({
      name: body.name,
      department: body.department,
      schoolYearId: body.schoolYearId
    })
    
    if (existingStrand) {
      return NextResponse.json(
        { success: false, error: 'Strand already exists for this department and school year' },
        { status: 409 }
      )
    }
    
    // Create strand document
    const strandData: Strand = {
      name: body.name,
      fullName: body.fullName,
      description: body.description || '',
      tagline: body.tagline || '',
      department: body.department,
      schoolYearId: body.schoolYearId,
      schoolYear: body.schoolYear,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Insert the strand
    const result = await collection.insertOne(strandData)
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...strandData },
      message: 'Strand created successfully'
    })
    
  } catch (error) {
    console.error('Error creating strand:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create strand' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// PUT /api/admin/strands - Update a strand
export async function PUT(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('strands')
    
    const body = await request.json()
    
    if (!body._id) {
      return NextResponse.json(
        { success: false, error: 'Strand ID is required' },
        { status: 400 }
      )
    }
    
    // Update strand
    const updateData = {
      ...body,
      updatedAt: new Date()
    }
    
    const result = await collection.updateOne(
      { _id: body._id },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Strand not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Strand updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating strand:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update strand' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// DELETE /api/admin/strands - Delete a strand
export async function DELETE(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('strands')
    
    const { searchParams } = new URL(request.url)
    const strandId = searchParams.get('id')
    
    if (!strandId) {
      return NextResponse.json(
        { success: false, error: 'Strand ID is required' },
        { status: 400 }
      )
    }
    
    // Delete strand
    const result = await collection.deleteOne({ _id: new ObjectId(strandId) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Strand not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Strand deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting strand:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete strand' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
