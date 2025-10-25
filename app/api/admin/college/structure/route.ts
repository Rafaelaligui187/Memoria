import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { COLLEGE_YEAR_LEVEL_NAMES } from "@/lib/college-year-levels"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')
    const courseId = searchParams.get('courseId')

    if (!schoolYearId) {
      return NextResponse.json({
        success: false,
        error: 'School year ID is required'
      }, { status: 400 })
    }

    // Add caching headers for better performance
    const headers = new Headers()
    headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600') // 5 min cache, 10 min stale

    const db = await connectToDatabase()
    
    // Only fetch College-specific data
    const collegeCollection = db.collection('College_yearbook')
    
    // Get approved College profiles for this school year
    const profiles = await collegeCollection.find({
      schoolYearId: schoolYearId,
      status: 'approved'
    }).toArray()

    // Get courses for College department
    const coursesCollection = db.collection('courses')
    const courses = await coursesCollection.find({
      schoolYearId: schoolYearId,
      department: 'college',
      isActive: true
    }).toArray()

    // Get course majors
    const courseMajorsCollection = db.collection('course-majors')
    const courseMajors = await courseMajorsCollection.find({
      schoolYearId: schoolYearId,
      isActive: true
    }).toArray()

    // Get College blocks from sections collection
    const sectionsCollection = db.collection('sections')
    const collegeBlocks = await sectionsCollection.find({
      department: 'college',
      schoolYearId: schoolYearId,
      isActive: true
    }).toArray()

    console.log(`[College Structure] Found ${collegeBlocks.length} College blocks in sections collection`)

    // Process courses with year levels and blocks
    const processedCourses = courses.map(course => {
      // Get majors for this course
      const courseMajorsForThisCourse = courseMajors.filter(cm => 
        cm.courseId.toString() === course._id.toString()
      )

      // Get profiles for this course
      const courseProfiles = profiles.filter(profile => 
        profile.courseProgram === course.name
      )

      // Get blocks for this course from sections collection
      const courseBlocks = collegeBlocks.filter(block => 
        block.courseId === course._id.toString()
      )

      if (courseMajorsForThisCourse.length > 0) {
        // Course has majors - organize by major
        const majorMap = new Map()
        
        courseMajorsForThisCourse.forEach(courseMajor => {
          if (!majorMap.has(courseMajor.majorName)) {
            majorMap.set(courseMajor.majorName, new Map())
          }
          const yearMap = majorMap.get(courseMajor.majorName)
          
          COLLEGE_YEAR_LEVEL_NAMES.forEach(yearLevel => {
            if (!yearMap.has(yearLevel)) {
              yearMap.set(yearLevel, new Map())
            }
            
            // Get blocks for this major and year level from sections collection
            const majorBlocks = courseBlocks.filter(block => 
              block.majorName === courseMajor.majorName && 
              block.grade === yearLevel
            )
            
            // Get profiles for this major and year level
            const yearProfiles = courseProfiles.filter(profile => 
              profile.major === courseMajor.majorName && 
              profile.yearLevel === yearLevel
            )
            
            // Process each block from database
            majorBlocks.forEach(block => {
              const blockProfiles = yearProfiles.filter(profile => 
                profile.blockSection === block.name
              )
              
              const students = blockProfiles.filter(profile => !profile.officerRole)
              const officers = blockProfiles.filter(profile => profile.officerRole)
              
              yearMap.get(yearLevel).set(block.name, {
                students: students,
                officers: officers
              })
            })
          })
        })

        // Convert to structure using real blocks from database
        const majors = Array.from(majorMap.entries()).map(([majorName, yearMap]) => ({
          id: majorName.toLowerCase().replace(/\s+/g, '-'),
          name: majorName,
          yearLevels: COLLEGE_YEAR_LEVEL_NAMES.map(yearLevel => {
            const blockMap = yearMap.get(yearLevel) || new Map()
            
            // Get blocks for this year level from database
            const yearBlocks = courseBlocks.filter(block => 
              block.majorName === majorName && 
              block.grade === yearLevel
            )
            
            return {
              id: yearLevel.toLowerCase().replace(/\s+/g, '-'),
              level: yearLevel,
              blocks: yearBlocks.map(block => {
                const blockData = blockMap.get(block.name) || { students: [], officers: [] }
                return {
                  id: block._id.toString(),
                  name: block.name,
                  studentCount: blockData.students.length,
                  officerCount: blockData.officers.length,
                  students: blockData.students,
                  officers: blockData.officers
                }
              })
            }
          })
        }))

        return {
          id: course._id.toString(),
          name: course.name,
          majorType: 'has-major',
          majors: majors,
          yearLevels: []
        }
      } else {
        // Course has no majors - direct year levels
        const yearMap = new Map()
        
        COLLEGE_YEAR_LEVEL_NAMES.forEach(yearLevel => {
          if (!yearMap.has(yearLevel)) {
            yearMap.set(yearLevel, new Map())
          }
          
          // Get blocks for this year level from sections collection
          const yearBlocks = courseBlocks.filter(block => 
            block.grade === yearLevel
          )
          
          // Get profiles for this year level
          const yearProfiles = courseProfiles.filter(profile => 
            profile.yearLevel === yearLevel
          )
          
          // Process each block from database
          yearBlocks.forEach(block => {
            const blockProfiles = yearProfiles.filter(profile => 
              profile.blockSection === block.name
            )
            
            const students = blockProfiles.filter(profile => !profile.officerRole)
            const officers = blockProfiles.filter(profile => profile.officerRole)
            
            yearMap.get(yearLevel).set(block.name, {
              students: students,
              officers: officers
            })
          })
        })

        // Convert to structure using real blocks from database
        const yearLevels = COLLEGE_YEAR_LEVEL_NAMES.map(yearLevel => {
          const blockMap = yearMap.get(yearLevel) || new Map()
          
          // Get blocks for this year level from database
          const yearBlocks = courseBlocks.filter(block => 
            block.grade === yearLevel
          )
          
          return {
            id: yearLevel.toLowerCase().replace(/\s+/g, '-'),
            level: yearLevel,
            blocks: yearBlocks.map(block => {
              const blockData = blockMap.get(block.name) || { students: [], officers: [] }
              return {
                id: block._id.toString(),
                name: block.name,
                studentCount: blockData.students.length,
                officerCount: blockData.officers.length,
                students: blockData.students,
                officers: blockData.officers
              }
            })
          }
        })

        return {
          id: course._id.toString(),
          name: course.name,
          majorType: 'no-major',
          majors: [],
          yearLevels: yearLevels
        }
      }
    })

    // If specific course requested, return only that course
    if (courseId) {
      // Try to find course by ID first, then by name (uppercase)
      const specificCourse = processedCourses.find(course => 
        course.id === courseId || course.name.toUpperCase() === courseId.toUpperCase()
      )
      
      // If course not found in database, create a fallback course with real blocks from database
      if (!specificCourse) {
        // Get blocks for this course from sections collection (even if course doesn't exist)
        // Try to find by courseId first, then by course name
        const courseBlocks = collegeBlocks.filter(block => 
          block.courseId === courseId || 
          block.courseName?.toUpperCase() === courseId.toUpperCase() ||
          block.courseName?.toUpperCase() === courseId.toUpperCase().replace('-', ' ')
        )
        
        // Check if this course has majors based on sections
        const hasMajors = courseBlocks.some(block => block.majorName && block.majorName !== 'No major')
        
        if (hasMajors) {
          // Course has majors - organize by major
          const majorMap = new Map()
          
          // Get unique majors from blocks
          const uniqueMajors = [...new Set(courseBlocks
            .filter(block => block.majorName && block.majorName !== 'No major')
            .map(block => block.majorName)
          )]
          
          uniqueMajors.forEach(majorName => {
            majorMap.set(majorName, new Map())
            
            COLLEGE_YEAR_LEVEL_NAMES.forEach(yearLevel => {
              const yearBlocks = courseBlocks.filter(block => 
                block.majorName === majorName && 
                block.grade === yearLevel
              )
              
              majorMap.get(majorName).set(yearLevel, yearBlocks.map(block => ({
                id: block._id.toString(),
                name: block.name,
                studentCount: 0,
                officerCount: 0,
                students: [],
                officers: []
              })))
            })
          })
          
          const majors = Array.from(majorMap.entries()).map(([majorName, yearMap]) => ({
            id: majorName.toLowerCase().replace(/\s+/g, '-'),
            name: majorName,
            yearLevels: COLLEGE_YEAR_LEVEL_NAMES.map(yearLevel => ({
              id: yearLevel.toLowerCase().replace(/\s+/g, '-'),
              level: yearLevel,
              blocks: yearMap.get(yearLevel) || []
            }))
          }))
          
          const fallbackCourse = {
            id: courseId,
            name: courseId.toUpperCase().replace('-', ' '),
            majorType: 'has-major',
            majors: majors,
            yearLevels: []
          }
          
          return NextResponse.json({
            success: true,
            data: fallbackCourse
          }, { headers })
        } else {
          // Course has no majors - direct year levels
          const fallbackCourse = {
            id: courseId,
            name: courseId.toUpperCase().replace('-', ' '),
            majorType: 'no-major',
            majors: [],
            yearLevels: COLLEGE_YEAR_LEVEL_NAMES.map(yearLevel => {
              // Get blocks for this year level from database
              const yearBlocks = courseBlocks.filter(block => 
                block.grade === yearLevel
              )
              
              return {
                id: yearLevel.toLowerCase().replace(/\s+/g, '-'),
                level: yearLevel,
                blocks: yearBlocks.map(block => ({
                  id: block._id.toString(),
                  name: block.name,
                  studentCount: 0,
                  officerCount: 0,
                  students: [],
                  officers: []
                }))
              }
            })
          }
          
          return NextResponse.json({
            success: true,
            data: fallbackCourse
          }, { headers })
        }
      }
      
      return NextResponse.json({
        success: true,
        data: specificCourse
      }, { headers })
    }

    return NextResponse.json({
      success: true,
      data: {
        courses: processedCourses
      }
    }, { headers })

  } catch (error) {
    console.error('Error fetching college structure:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch college structure'
    }, { status: 500 })
  }
}
