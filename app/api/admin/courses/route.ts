import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority"

interface Course {
  _id?: ObjectId
  name: string
  fullName?: string
  majorType?: string // "no-major" or "has-major"
  majors?: string[] // Array of specific majors when majorType is "has-major"
  description?: string
  tagline?: string
  department: string
  schoolYearId: string
  schoolYear: string
  createdAt: Date
  updatedAt: Date
}

// GET /api/admin/courses - Get all courses
export async function GET(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('courses')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const department = searchParams.get('department')
    const schoolYearId = searchParams.get('schoolYearId')
    
    console.log('Fetching courses with params:', { id, department, schoolYearId })
    
    // If ID is provided, fetch single course
    if (id) {
      try {
        const course = await collection.findOne({ _id: new ObjectId(id) })
        console.log('Found course by ID:', course)
        
        if (!course) {
          return NextResponse.json(
            { success: false, error: 'Course not found' },
            { status: 404 }
          )
        }
        
        return NextResponse.json({
          success: true,
          data: course
        })
      } catch (error) {
        console.error('Error fetching course by ID:', error)
        return NextResponse.json(
          { success: false, error: 'Invalid course ID' },
          { status: 400 }
        )
      }
    }
    
    // Build query for multiple courses
    const query: any = {}
    if (department) {
      query.department = department
    }
    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }
    
    console.log('MongoDB query:', query)
    
    const courses = await collection.find(query).sort({ createdAt: -1 }).toArray()
    
    // Ensure all courses have majorType field (migration for existing courses)
    const coursesToUpdate = courses.filter(course => !course.majorType)
    if (coursesToUpdate.length > 0) {
      console.log(`Found ${coursesToUpdate.length} courses without majorType, updating...`)
      await collection.updateMany(
        { majorType: { $exists: false } },
        { $set: { majorType: 'no-major' } }
      )
      // Refetch courses after update
      const updatedCourses = await collection.find(query).sort({ createdAt: -1 }).toArray()
      console.log('Found courses after migration:', updatedCourses.length, updatedCourses.map(c => ({ name: c.name, majorType: c.majorType, _id: c._id })))
      return NextResponse.json({
        success: true,
        data: updatedCourses
      })
    }
    
    console.log('Found courses:', courses.length, courses.map(c => ({ name: c.name, majorType: c.majorType, _id: c._id })))
    
    return NextResponse.json({
      success: true,
      data: courses
    })
    
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// POST /api/admin/courses - Create a new course
export async function POST(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('courses')
    
    const body = await request.json()
    const { name, fullName, majorType, description, tagline, department, schoolYearId, schoolYear } = body
    
    console.log('Creating course with data:', { name, fullName, majorType, description, tagline, department, schoolYearId, schoolYear })
    
    if (!name || !department || !schoolYearId) {
      console.log('Missing required fields:', { name, department, schoolYearId })
      return NextResponse.json(
        { success: false, error: 'Course name, department, and school year ID are required' },
        { status: 400 }
      )
    }
    
    const course: Course = {
      name,
      fullName: fullName || name,
      majorType: majorType || 'no-major',
      majors: majorType === 'has-major' ? [] : undefined,
      description: description || '',
      tagline: tagline || '',
      department,
      schoolYearId,
      schoolYear: schoolYear || schoolYearId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await collection.insertOne(course)
    
    console.log('Course inserted successfully:', result.insertedId)
    
    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      data: { _id: result.insertedId, ...course }
    })
    
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// PUT /api/admin/courses - Update a course
export async function PUT(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('courses')
    
    const body = await request.json()
    const { _id, name, fullName, description, tagline } = body
    
    if (!_id) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      )
    }
    
    const updateData: any = {
      updatedAt: new Date()
    }
    
    if (name) updateData.name = name
    if (fullName) updateData.fullName = fullName
    if (description !== undefined) updateData.description = description
    if (tagline !== undefined) updateData.tagline = tagline
    
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Course updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

// DELETE /api/admin/courses - Delete a course
export async function DELETE(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    const collection = db.collection('courses')
    
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('id')
    
    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      )
    }
    
    // Delete course
    const result = await collection.deleteOne({ _id: new ObjectId(courseId) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
