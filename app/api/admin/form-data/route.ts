import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority"

// GET /api/admin/form-data - Get dynamic form data for a specific school year
export async function GET(request: NextRequest) {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')
    const department = searchParams.get('department')
    const program = searchParams.get('program') // course/strand name
    const yearLevel = searchParams.get('yearLevel')
    const major = searchParams.get('major') // major name for College courses
    
    if (!schoolYearId) {
      return NextResponse.json(
        { success: false, error: 'School year ID is required' },
        { status: 400 }
      )
    }
    
    console.log('Fetching form data for school year:', schoolYearId)
    
    // Fetch courses for College department
    const coursesCollection = db.collection('courses')
    const courses = await coursesCollection.find({ 
      schoolYearId: schoolYearId,
      department: 'college'
    }).toArray()
    
    // Fetch course majors from the new collection
    const courseMajorsCollection = db.collection('course-majors')
    const courseMajors = await courseMajorsCollection.find({
      schoolYearId: schoolYearId,
      isActive: true
    }).toArray()
    
    // Fetch strands for Senior High department
    const strandsCollection = db.collection('strands')
    const strands = await strandsCollection.find({ 
      schoolYearId: schoolYearId,
      department: 'senior-high'
    }).toArray()
    
    // Fetch sections/blocks for all departments
    const sectionsCollection = db.collection('sections')
    const sections = await sectionsCollection.find({ 
      schoolYearId: schoolYearId
    }).toArray()
    
    console.log('Found courses:', courses.length)
    console.log('Found strands:', strands.length)
    console.log('Found sections:', sections.length)
    
    // If specific filtering is requested (for dynamic section/block filtering)
    if (department && program && yearLevel) {
      let filteredSections = []
      
      if (department === 'College') {
        // Filter College blocks by course, year level, and major (if specified)
        filteredSections = sections.filter(s => {
          const matchesCourse = s.department === 'college' && s.courseName === program && s.grade === yearLevel
          if (major) {
            return matchesCourse && s.majorName === major
          }
          return matchesCourse
        }).map(s => s.name)
      } else if (department === 'Senior High') {
        // Filter Senior High sections by strand and grade
        filteredSections = sections.filter(s => 
          s.department === 'senior-high' && 
          s.strandName === program && 
          s.grade === yearLevel
        ).map(s => s.name)
      } else if (department === 'Elementary' || department === 'Junior High') {
        // Filter Elementary/Junior High sections by grade
        const deptKey = department === 'Elementary' ? 'elementary' : 'junior-high'
        filteredSections = sections.filter(s => 
          s.department === deptKey && 
          s.grade === yearLevel
        ).map(s => s.name)
      }

      console.log(`Filtered sections for ${department} - ${program} - ${yearLevel}${major ? ` - ${major}` : ''}:`, filteredSections)
      
      return NextResponse.json({
        success: true,
        data: {
          sections: filteredSections
        }
      })
    }
    
    // Organize data by department (initial load)
    const formData = {
      departments: {
        'Elementary': {
          yearLevels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
          programs: ['Elementary'],
          sections: sections
            .filter(s => s.department === 'elementary')
            .map(s => s.name)
        },
        'Junior High': {
          yearLevels: ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'],
          programs: ['Junior High'],
          sections: sections
            .filter(s => s.department === 'junior-high')
            .map(s => s.name)
        },
        'Senior High': {
          yearLevels: ['Grade 11', 'Grade 12'],
          programs: strands.map(s => s.name),
          sections: sections
            .filter(s => s.department === 'senior-high')
            .map(s => s.name)
        },
        'College': {
          yearLevels: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
          programs: courses.map(c => c.name),
          sections: sections
            .filter(s => s.department === 'college')
            .map(s => s.name)
        }
      },
      // Additional data for specific programs
      programDetails: {
        // College course details
        ...courses.reduce((acc, course) => {
          // Get majors for this course from the course-majors collection
          const courseMajorsForThisCourse = courseMajors.filter(cm => 
            cm.courseId.toString() === course._id.toString()
          ).map(cm => cm.majorName)
          
          acc[course.name] = {
            majorType: course.majorType || 'no-major',
            majors: courseMajorsForThisCourse,
            tagline: course.tagline || '',
            description: course.description || ''
          }
          return acc
        }, {} as any),
        
        // Senior High strand details
        ...strands.reduce((acc, strand) => {
          acc[strand.name] = {
            tagline: strand.tagline || '',
            description: strand.description || ''
          }
          return acc
        }, {} as any)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: formData
    })
    
  } catch (error) {
    console.error('Error fetching form data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch form data' },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
