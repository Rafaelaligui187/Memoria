import { NextRequest, NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://aliguirafael:group8@cluster0.ofoka.mongodb.net/Memoria?retryWrites=true&w=majority"

// Cache for form data to avoid repeated database calls
const formDataCache = new Map<string, { data: any, timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// GET /api/admin/form-data - Get dynamic form data for a specific school year
export async function GET(request: NextRequest) {
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
  
  // Check cache first
  const cacheKey = `${schoolYearId}-${department || 'all'}-${program || 'all'}-${yearLevel || 'all'}-${major || 'all'}`
  const cached = formDataCache.get(cacheKey)
  
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    console.log('Returning cached form data for:', schoolYearId)
    return NextResponse.json({
      success: true,
      data: cached.data
    })
  }
  
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db('Memoria')
    
    console.log('Fetching form data for school year:', schoolYearId)
    
    // Execute all database queries in parallel for better performance
    const [courses, courseMajors, strands, sections] = await Promise.all([
      // Fetch courses for College department
      db.collection('courses').find({ 
        schoolYearId: schoolYearId,
        department: 'college'
      }).toArray(),
      
      // Fetch course majors from the new collection
      db.collection('course-majors').find({
        schoolYearId: schoolYearId,
        isActive: true
      }).toArray(),
      
      // Fetch strands for Senior High department
      db.collection('strands').find({ 
        schoolYearId: schoolYearId,
        department: 'senior-high'
      }).toArray(),
      
      // Fetch sections/blocks for all departments
      db.collection('sections').find({ 
        schoolYearId: schoolYearId
      }).toArray()
    ])
    
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
      
      const responseData = {
        sections: filteredSections
      }
      
      // Cache the filtered result
      formDataCache.set(cacheKey, { data: responseData, timestamp: Date.now() })
      
      return NextResponse.json({
        success: true,
        data: responseData
      })
    }
    
    // Pre-process course majors for faster lookup
    const courseMajorsMap = new Map()
    courseMajors.forEach(cm => {
      const courseId = cm.courseId.toString()
      if (!courseMajorsMap.has(courseId)) {
        courseMajorsMap.set(courseId, [])
      }
      courseMajorsMap.get(courseId).push(cm.majorName)
    })
    
    // Organize data by department (initial load) - optimized processing
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
      // Additional data for specific programs - optimized processing
      programDetails: {
        // College course details - using pre-processed map for better performance
        ...courses.reduce((acc, course) => {
          const courseId = course._id.toString()
          const courseMajorsForThisCourse = courseMajorsMap.get(courseId) || []
          
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
    
    // Cache the full result
    formDataCache.set(cacheKey, { data: formData, timestamp: Date.now() })
    
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
