import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority"

interface CourseMajor {
  _id?: ObjectId
  courseId: ObjectId
  courseName: string
  majorName: string
  schoolYearId: string
  schoolYear: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// GET /api/admin/course-majors - Get all course majors
export async function GET(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('course-majors')
    
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const schoolYearId = searchParams.get('schoolYearId')
    
    console.log('Fetching course majors with params:', { courseId, schoolYearId })
    
    // Build query
    const query: any = { isActive: true }
    if (courseId) {
      query.courseId = new ObjectId(courseId)
    }
    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }
    
    console.log('MongoDB query:', query)
    
    const majors = await collection.find(query).sort({ createdAt: -1 }).toArray()
    
    console.log('Found course majors:', majors.length, majors.map(m => ({ majorName: m.majorName, courseName: m.courseName })))
    
    return NextResponse.json({
      success: true,
      data: majors
    })
    
  } catch (error) {
    console.error('Error fetching course majors:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course majors' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// POST /api/admin/course-majors - Create a new course major
export async function POST(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('course-majors')
    
    const body = await request.json()
    const { courseId, courseName, majorName, schoolYearId, schoolYear } = body
    
    console.log('Creating course major with data:', { courseId, courseName, majorName, schoolYearId, schoolYear })
    
    if (!courseId || !courseName || !majorName || !schoolYearId) {
      console.log('Missing required fields:', { courseId, courseName, majorName, schoolYearId })
      return NextResponse.json(
        { success: false, error: 'Course ID, course name, major name, and school year ID are required' },
        { status: 400 }
      )
    }
    
    // Check if major already exists for this course and school year
    const existingMajor = await collection.findOne({
      courseId: new ObjectId(courseId),
      majorName: majorName.trim(),
      schoolYearId: schoolYearId,
      isActive: true
    })
    
    if (existingMajor) {
      return NextResponse.json(
        { success: false, error: 'Major already exists for this course' },
        { status: 409 }
      )
    }
    
    const courseMajor: CourseMajor = {
      courseId: new ObjectId(courseId),
      courseName: courseName.trim(),
      majorName: majorName.trim(),
      schoolYearId,
      schoolYear: schoolYear || schoolYearId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await collection.insertOne(courseMajor)
    
    console.log('Course major inserted successfully:', result.insertedId)
    
    return NextResponse.json({
      success: true,
      message: 'Course major created successfully',
      data: { _id: result.insertedId, ...courseMajor }
    })
    
  } catch (error) {
    console.error('Error creating course major:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create course major' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// PUT /api/admin/course-majors - Update a course major
export async function PUT(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('course-majors')
    
    const body = await request.json()
    const { id, majorName } = body
    
    console.log('Updating course major with data:', { id, majorName })
    
    if (!id || !majorName) {
      return NextResponse.json(
        { success: false, error: 'Major ID and major name are required' },
        { status: 400 }
      )
    }
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          majorName: majorName.trim(),
          updatedAt: new Date()
        }
      }
    )
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Course major not found or not updated' },
        { status: 404 }
      )
    }
    
    console.log('Course major updated successfully:', id)
    
    return NextResponse.json({
      success: true,
      message: 'Course major updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating course major:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update course major' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// DELETE /api/admin/course-majors - Delete a course major
export async function DELETE(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('course-majors')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    console.log('Deleting course major with ID:', id)
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Major ID is required' },
        { status: 400 }
      )
    }
    
    // Soft delete by setting isActive to false
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date()
        }
      }
    )
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Course major not found' },
        { status: 404 }
      )
    }
    
    console.log('Course major deleted successfully:', id)
    
    return NextResponse.json({
      success: true,
      message: 'Course major deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting course major:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete course major' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
