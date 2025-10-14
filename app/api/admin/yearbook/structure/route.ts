import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { YEARBOOK_COLLECTIONS } from "@/lib/yearbook-schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')

    if (!schoolYearId) {
      return NextResponse.json({
        success: false,
        error: 'School year ID is required'
      }, { status: 400 })
    }

    const db = await connectToDatabase()
    
    // Fetch actual profiles from database for each department
    const departments = [
      {
        id: "elementary",
        name: "Elementary",
        type: "elementary",
        collection: YEARBOOK_COLLECTIONS.ELEMENTARY
      },
      {
        id: "junior-high", 
        name: "Junior High",
        type: "junior-high",
        collection: YEARBOOK_COLLECTIONS.JUNIOR_HIGH
      },
      {
        id: "senior-high",
        name: "Senior High", 
        type: "senior-high",
        collection: YEARBOOK_COLLECTIONS.SENIOR_HIGH
      },
      {
        id: "college",
        name: "College",
        type: "college", 
        collection: YEARBOOK_COLLECTIONS.COLLEGE
      }
    ]

    // Get sections from database for Elementary and Junior High
    const sectionsCollection = db.collection('sections')
    const sections = await sectionsCollection.find({
      schoolYearId: schoolYearId,
      isActive: true
    }).toArray()

    const structure = {
      departments: await Promise.all(departments.map(async (dept) => {
        const collection = db.collection(dept.collection)
        
        // Get all approved profiles for this department and school year
        const profiles = await collection.find({
          schoolYearId: schoolYearId,
          status: 'approved'
        }).toArray()

        // For Elementary and Junior High, use sections from database with hardcoded year levels
        if (dept.type === 'elementary' || dept.type === 'junior-high') {
          const departmentSections = sections.filter(section => section.department === dept.type)
          
          // Hardcoded year levels for each department
          const yearLevels = dept.type === 'elementary' 
            ? ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']
            : ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10']
          
          // Group sections by grade
          const gradeMap = new Map()
          
          departmentSections.forEach(section => {
            if (!gradeMap.has(section.grade)) {
              gradeMap.set(section.grade, [])
            }
            gradeMap.get(section.grade).push(section)
          })

          // Create structure with sections for all year levels (even if no sections exist)
          const courses = [{
            id: `${dept.type}-education`,
            name: `${dept.name} Education`,
            yearLevels: yearLevels.map(grade => {
              const sectionList = gradeMap.get(grade) || []
              
              return {
                id: grade.toLowerCase().replace(/\s+/g, '-'),
                level: grade,
                blocks: sectionList.map(section => {
                  // Find profiles for this section
                  const sectionProfiles = profiles.filter(profile => 
                    profile.yearLevel === section.grade && 
                    profile.blockSection === section.name
                  )

                  const students = sectionProfiles.map(profile => ({
                    id: profile._id.toString(),
                    name: profile.fullName || 'Unknown',
                    image: profile.profilePicture,
                    quote: profile.sayingMotto,
                    honors: profile.honors,
                    isOfficer: !!profile.officerRole,
                    officerPosition: profile.officerRole
                  }))

                  const officers = sectionProfiles
                    .filter(profile => profile.officerRole)
                    .map(profile => ({
                      id: profile._id.toString(),
                      name: profile.fullName || 'Unknown',
                      position: profile.officerRole,
                      image: profile.profilePicture,
                      quote: profile.sayingMotto
                    }))

                  return {
                    id: section.name.toLowerCase().replace(/\s+/g, '-'),
                    name: section.name,
                    studentCount: students.length,
                    officerCount: officers.length,
                    students: students,
                    officers: officers
                  }
                })
              }
            })
          }]

          return {
            id: dept.id,
            name: dept.name,
            type: dept.type,
            courses: courses
          }
        }

        // For Senior High, fetch dynamic strands and sections
        if (dept.type === 'senior-high') {
          const strandsCollection = db.collection('strands')
          const strands = await strandsCollection.find({
            schoolYearId: schoolYearId,
            department: 'senior-high',
            isActive: true
          }).toArray()

          const seniorHighSections = sections.filter(section => section.department === 'senior-high')
          
          // Group sections by strand name (since sections store strand name, not ObjectId)
          const strandMap = new Map()
          seniorHighSections.forEach(section => {
            if (!strandMap.has(section.strandName)) {
              strandMap.set(section.strandName, new Map())
            }
            const gradeMap = strandMap.get(section.strandName)
            if (!gradeMap.has(section.grade)) {
              gradeMap.set(section.grade, [])
            }
            gradeMap.get(section.grade).push(section)
          })

          const strandCourses = strands.map(strand => {
            const strandSections = strandMap.get(strand.name) || new Map()
            
            return {
              id: strand._id.toString(),
              name: strand.name,
              fullName: strand.fullName,
              description: strand.description,
              tagline: strand.tagline,
              yearLevels: ['Grade 11', 'Grade 12'].map(grade => {
                const sectionList = strandSections.get(grade) || []
                
                return {
                  id: grade.toLowerCase().replace(/\s+/g, '-'),
                  level: grade,
                  blocks: sectionList.map(section => {
                    // Find profiles for this section
                    const sectionProfiles = profiles.filter(profile => 
                      profile.yearLevel === section.grade && 
                      profile.blockSection === section.name &&
                      profile.courseProgram === strand.name
                    )

                    const students = sectionProfiles.map(profile => ({
                      id: profile._id.toString(),
                      name: profile.fullName || 'Unknown',
                      image: profile.profilePicture,
                      quote: profile.sayingMotto,
                      honors: profile.honors,
                      isOfficer: !!profile.officerRole,
                      officerPosition: profile.officerRole
                    }))

                    const officers = sectionProfiles
                      .filter(profile => profile.officerRole)
                      .map(profile => ({
                        id: profile._id.toString(),
                        name: profile.fullName || 'Unknown',
                        position: profile.officerRole,
                        image: profile.profilePicture,
                        quote: profile.sayingMotto
                      }))

                    return {
                      id: section.name.toLowerCase().replace(/\s+/g, '-'),
                      name: `${strand.name} ${section.name}`, // Format as "STRAND SECTION"
                      studentCount: students.length,
                      officerCount: officers.length,
                      students: students,
                      officers: officers
                    }
                  })
                }
              })
            }
          })

          return {
            id: dept.id,
            name: dept.name,
            type: dept.type,
            courses: strandCourses
          }
        }

        // For College department, use sections collection for blocks
        if (dept.type === 'college') {
          // Fetch actual courses from database to get MongoDB _id
          const coursesCollection = db.collection('courses')
          const dbCourses = await coursesCollection.find({ 
            department: dept.type,
            schoolYearId: schoolYearId 
          }).toArray()
          
          console.log(`[Yearbook Structure] Department: ${dept.type}, Found ${dbCourses.length} courses in database`)
          console.log(`[Yearbook Structure] Courses:`, dbCourses.map(c => ({ name: c.name, _id: c._id, majorType: c.majorType })))
          
          // Fetch course majors from the new collection
          const courseMajorsCollection = db.collection('course-majors')
          const courseMajors = await courseMajorsCollection.find({
            schoolYearId: schoolYearId,
            isActive: true
          }).toArray()
          
          console.log('Found course majors:', courseMajors.length)
          
          // Fetch blocks from sections collection for College
          const collegeBlocks = sections.filter(section => section.department === 'college')
          
          // Group blocks by course and year level
          const courseBlockMap = new Map()
          collegeBlocks.forEach(block => {
            if (!courseBlockMap.has(block.courseName)) {
              courseBlockMap.set(block.courseName, new Map())
            }
            const yearMap = courseBlockMap.get(block.courseName)
            if (!yearMap.has(block.grade)) {
              yearMap.set(block.grade, [])
            }
            yearMap.get(block.grade).push(block)
          })
          
          // If we have actual courses in the database, use those with blocks from sections
          if (dbCourses.length > 0) {
            const courses = dbCourses.map(course => {
              // Define predefined year levels for College courses
              const predefinedYearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year']
              
              // Get majors for this course from the course-majors collection
              const courseMajorsForThisCourse = courseMajors.filter(cm => 
                cm.courseId.toString() === course._id.toString()
              )
              
              // If course has majorType "has-major", organize by major first
              if (course.majorType === 'has-major' && courseMajorsForThisCourse.length > 0) {
                // Group profiles by major, year level, and block
                const majorMap = new Map()
                
                profiles.forEach(profile => {
                  if (profile.courseProgram === course.name) {
                    const majorKey = profile.major || 'No Major'
                    const yearKey = profile.yearLevel || 'Unknown'
                    const blockKey = profile.blockSection || 'Unknown'
                    
                    if (!majorMap.has(majorKey)) {
                      majorMap.set(majorKey, new Map())
                    }
                    
                    const yearMap = majorMap.get(majorKey)
                    if (!yearMap.has(yearKey)) {
                      yearMap.set(yearKey, new Map())
                    }
                    
                    const blockMap = yearMap.get(yearKey)
                    if (!blockMap.has(blockKey)) {
                      blockMap.set(blockKey, {
                        students: [],
                        officers: []
                      })
                    }
                    
                    const block = blockMap.get(blockKey)
                    
                    // Add to students list
                    block.students.push({
                      id: profile._id.toString(),
                      name: profile.fullName || 'Unknown',
                      image: profile.profilePicture,
                      quote: profile.sayingMotto,
                      honors: profile.honors,
                      isOfficer: !!profile.officerRole,
                      officerPosition: profile.officerRole
                    })
                    
                    // Add to officers if they have an officer role
                    if (profile.officerRole) {
                      block.officers.push({
                        id: profile._id.toString(),
                        name: profile.fullName || 'Unknown',
                        position: profile.officerRole,
                        image: profile.profilePicture,
                        quote: profile.sayingMotto
                      })
                    }
                  }
                })

                // Generate majors with year levels
                const majors = courseMajorsForThisCourse.map(courseMajor => {
                  const yearMap = majorMap.get(courseMajor.majorName) || new Map()
                  
                  const yearLevels = predefinedYearLevels.map(yearLevel => {
                    const existingBlocks = yearMap.get(yearLevel) || new Map()
                    
                    // Get blocks from sections collection for this major and year level
                    const sectionBlocks = collegeBlocks.filter(block => 
                      block.courseName === course.name && 
                      block.grade === yearLevel &&
                      block.majorName === courseMajor.majorName
                    )
                    
                    console.log(`[Yearbook Structure] Course: ${course.name}, Major: ${courseMajor.majorName}, Year: ${yearLevel}`)
                    console.log(`[Yearbook Structure] Found ${sectionBlocks.length} section blocks:`, sectionBlocks.map(b => ({ name: b.name, majorName: b.majorName })))
                    
                    // Combine existing blocks from profiles with blocks from sections
                    const allBlocks = new Map()
                    
                    // Add blocks from profiles
                    existingBlocks.forEach((block, blockName) => {
                      allBlocks.set(blockName, block)
                    })
                    
                    // Add blocks from sections (if not already present)
                    sectionBlocks.forEach(sectionBlock => {
                      if (!allBlocks.has(sectionBlock.name)) {
                        allBlocks.set(sectionBlock.name, {
                          students: [],
                          officers: []
                        })
                      }
                    })
                    
                    return {
                      id: yearLevel.toLowerCase().replace(/\s+/g, '-'),
                      level: yearLevel,
                      blocks: Array.from(allBlocks.entries()).map(([blockName, block]) => ({
                        id: blockName.toLowerCase().replace(/\s+/g, '-'),
                        name: blockName,
                        studentCount: block.students.length,
                        officerCount: block.officers.length,
                        students: block.students,
                        officers: block.officers
                      }))
                    }
                  })

                  return {
                    id: courseMajor.majorName.toLowerCase().replace(/\s+/g, '-'),
                    name: courseMajor.majorName,
                    yearLevels: yearLevels
                  }
                })

                console.log(`[Yearbook Structure] Course ${course.name} with majorType "${course.majorType}" has ${majors.length} majors`)
                
                return {
                  id: course._id.toString(),
                  name: course.name,
                  majorType: course.majorType,
                  majors: majors,
                  yearLevels: [] // Always empty for courses with majorType "has-major"
                }
              } else {
                // Original logic for courses without majors
                // Get blocks for this course
                const courseBlocks = courseBlockMap.get(course.name) || new Map()
                
                // Generate year levels with blocks from database
                const yearLevels = predefinedYearLevels.map(yearLevel => {
                  const blockList = courseBlocks.get(yearLevel) || []
                  
                  return {
                    id: yearLevel.toLowerCase().replace(/\s+/g, '-'),
                    level: yearLevel,
                    blocks: blockList.map(block => {
                      // Find profiles for this block
                      const blockProfiles = profiles.filter(profile => 
                        profile.courseProgram === course.name &&
                        profile.yearLevel === block.grade && 
                        profile.blockSection === block.name
                      )

                      const students = blockProfiles.map(profile => ({
                        id: profile._id.toString(),
                        name: profile.fullName || 'Unknown',
                        image: profile.profilePicture,
                        quote: profile.sayingMotto,
                        honors: profile.honors,
                        isOfficer: !!profile.officerRole,
                        officerPosition: profile.officerRole
                      }))

                      const officers = blockProfiles
                        .filter(profile => profile.officerRole)
                        .map(profile => ({
                          id: profile._id.toString(),
                          name: profile.fullName || 'Unknown',
                          position: profile.officerRole,
                          image: profile.profilePicture,
                          quote: profile.sayingMotto
                        }))

                      return {
                        id: block.name.toLowerCase().replace(/\s+/g, '-'),
                        name: block.name,
                        studentCount: students.length,
                        officerCount: officers.length,
                        students: students,
                        officers: officers
                      }
                    })
                  }
                })

                console.log(`[Yearbook Structure] Course ${course.name} with majorType "${course.majorType}" has ${yearLevels.length} year levels`)
                
                return {
                  id: course._id.toString(),
                  name: course.name,
                  majorType: course.majorType,
                  majors: [],
                  yearLevels: yearLevels
                }
              }
            })

            return {
              id: dept.id,
              name: dept.name,
              type: dept.type,
              courses: courses
            }
          }

          // If no courses in database, return empty courses array (no hardcoded fallback)
          return {
            id: dept.id,
            name: dept.name,
            type: dept.type,
            courses: []
          }
        }

        // For other departments, use existing logic
        // Group profiles by course/program, year level, and block/section
        const courseMap = new Map()
        
        profiles.forEach(profile => {
          const courseKey = profile.courseProgram || profile.department || 'General'
          const yearKey = profile.yearLevel || 'Unknown'
          const blockKey = profile.blockSection || 'Unknown'
          
          if (!courseMap.has(courseKey)) {
            courseMap.set(courseKey, new Map())
          }
          
          const yearMap = courseMap.get(courseKey)
          if (!yearMap.has(yearKey)) {
            yearMap.set(yearKey, new Map())
          }
          
          const blockMap = yearMap.get(yearKey)
          if (!blockMap.has(blockKey)) {
            blockMap.set(blockKey, {
              students: [],
              officers: []
            })
          }
          
          const block = blockMap.get(blockKey)
          
          // Add to students list
          block.students.push({
            id: profile._id.toString(),
            name: profile.fullName || 'Unknown',
            image: profile.profilePicture,
            quote: profile.sayingMotto,
            honors: profile.honors,
            isOfficer: !!profile.officerRole,
            officerPosition: profile.officerRole
          })
          
          // Add to officers if they have an officer role
          if (profile.officerRole) {
            block.officers.push({
              id: profile._id.toString(),
              name: profile.fullName || 'Unknown',
              position: profile.officerRole,
              image: profile.profilePicture,
              quote: profile.sayingMotto
            })
          }
        })

        // Fetch actual courses from database to get MongoDB _id
        const coursesCollection = db.collection('courses')
        const dbCourses = await coursesCollection.find({ 
          department: dept.type,
          schoolYearId: schoolYearId 
        }).toArray()
        
        console.log(`[Yearbook Structure] Department: ${dept.type}, Found ${dbCourses.length} courses in database`)
        console.log(`[Yearbook Structure] Courses:`, dbCourses.map(c => ({ name: c.name, _id: c._id })))
        
        // Create a map of course names to MongoDB _id
        const courseIdMap = new Map()
        dbCourses.forEach(course => {
          courseIdMap.set(course.name, course._id.toString())
        })

        // If we have actual courses in the database, use those instead of profile-based mapping
        if (dbCourses.length > 0) {
          // Fetch course majors from the new collection
          const courseMajorsCollection = db.collection('course-majors')
          const courseMajors = await courseMajorsCollection.find({
            schoolYearId: schoolYearId,
            isActive: true
          }).toArray()
          
          console.log('Found course majors:', courseMajors.length)
          
          const courses = dbCourses.map(course => {
            // Define predefined year levels for College courses
            const predefinedYearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year']
            
            // Find profiles for this course
            const courseProfiles = profiles.filter(profile => 
              profile.courseProgram === course.name
            )
            
            // Get majors for this course from the course-majors collection
            const courseMajorsForThisCourse = courseMajors.filter(cm => 
              cm.courseId.toString() === course._id.toString()
            )
            
            // If course has majorType "has-major", organize by major first
            if (course.majorType === 'has-major' && courseMajorsForThisCourse.length > 0) {
              // Group profiles by major, year level, and block
              const majorMap = new Map()
              
              courseProfiles.forEach(profile => {
                const majorKey = profile.major || 'No Major'
                const yearKey = profile.yearLevel || 'Unknown'
                const blockKey = profile.blockSection || 'Unknown'
                
                if (!majorMap.has(majorKey)) {
                  majorMap.set(majorKey, new Map())
                }
                
                const yearMap = majorMap.get(majorKey)
                if (!yearMap.has(yearKey)) {
                  yearMap.set(yearKey, new Map())
                }
                
                const blockMap = yearMap.get(yearKey)
                if (!blockMap.has(blockKey)) {
                  blockMap.set(blockKey, {
                    students: [],
                    officers: []
                  })
                }
                
                const block = blockMap.get(blockKey)
                
                // Add to students list
                block.students.push({
                  id: profile._id.toString(),
                  name: profile.fullName || 'Unknown',
                  image: profile.profilePicture,
                  quote: profile.sayingMotto,
                  honors: profile.honors,
                  isOfficer: !!profile.officerRole,
                  officerPosition: profile.officerRole
                })
                
                // Add to officers if they have an officer role
                if (profile.officerRole) {
                  block.officers.push({
                    id: profile._id.toString(),
                    name: profile.fullName || 'Unknown',
                    position: profile.officerRole,
                    image: profile.profilePicture,
                    quote: profile.sayingMotto
                  })
                }
              })

              // Generate majors with year levels
              const majors = courseMajorsForThisCourse.map(courseMajor => {
                const yearMap = majorMap.get(courseMajor.majorName) || new Map()
                
                const yearLevels = predefinedYearLevels.map(yearLevel => {
                  const existingBlocks = yearMap.get(yearLevel) || new Map()
                  
                  return {
                    id: yearLevel.toLowerCase().replace(/\s+/g, '-'),
                    level: yearLevel,
                    blocks: Array.from(existingBlocks.entries()).map(([blockName, block]) => ({
                      id: blockName.toLowerCase().replace(/\s+/g, '-'),
                      name: blockName,
                      studentCount: block.students.length,
                      officerCount: block.officers.length,
                      students: block.students,
                      officers: block.officers
                    }))
                  }
                })

                return {
                  id: courseMajor.majorName.toLowerCase().replace(/\s+/g, '-'),
                  name: courseMajor.majorName,
                  yearLevels: yearLevels
                }
              })

              console.log(`[Yearbook Structure] Course ${course.name} with majorType "${course.majorType}" has ${majors.length} majors`)
              
              return {
                id: course._id.toString(),
                name: course.name,
                majorType: course.majorType,
                majors: majors,
                yearLevels: [] // Always empty for courses with majorType "has-major"
              }
            } else {
              // Original logic for courses without majors
              const yearMap = new Map()
              courseProfiles.forEach(profile => {
                const yearKey = profile.yearLevel || 'Unknown'
                const blockKey = profile.blockSection || 'Unknown'
                
                if (!yearMap.has(yearKey)) {
                  yearMap.set(yearKey, new Map())
                }
                
                const blockMap = yearMap.get(yearKey)
                if (!blockMap.has(blockKey)) {
                  blockMap.set(blockKey, {
                    students: [],
                    officers: []
                  })
                }
                
                const block = blockMap.get(blockKey)
                
                // Add to students list
                block.students.push({
                  id: profile._id.toString(),
                  name: profile.fullName || 'Unknown',
                  image: profile.profilePicture,
                  quote: profile.sayingMotto,
                  honors: profile.honors,
                  isOfficer: !!profile.officerRole,
                  officerPosition: profile.officerRole
                })
                
                // Add to officers if they have an officer role
                if (profile.officerRole) {
                  block.officers.push({
                    id: profile._id.toString(),
                    name: profile.fullName || 'Unknown',
                    position: profile.officerRole,
                    image: profile.profilePicture,
                    quote: profile.sayingMotto
                  })
                }
              })

              // Generate year levels with predefined structure
              const yearLevels = predefinedYearLevels.map(yearLevel => {
                const existingBlocks = yearMap.get(yearLevel) || new Map()
                
                return {
                  id: yearLevel.toLowerCase().replace(/\s+/g, '-'),
                  level: yearLevel,
                  blocks: Array.from(existingBlocks.entries()).map(([blockName, block]) => ({
                    id: blockName.toLowerCase().replace(/\s+/g, '-'),
                    name: blockName,
                    studentCount: block.students.length,
                    officerCount: block.officers.length,
                    students: block.students,
                    officers: block.officers
                  }))
                }
              })

              console.log(`[Yearbook Structure] Course ${course.name} with majorType "${course.majorType}" has ${yearLevels.length} year levels`)
              
              return {
                id: course._id.toString(),
                name: course.name,
                majorType: course.majorType,
                majors: [],
                yearLevels: yearLevels
              }
            }
          })

          return {
            id: dept.id,
            name: dept.name,
            type: dept.type,
            courses: courses
          }
        }

        // If no courses in database, return empty courses array (no hardcoded fallback)
        return {
          id: dept.id,
          name: dept.name,
          type: dept.type,
          courses: []
        }
      }))
    }

    return NextResponse.json({
      success: true,
      data: structure
    })

  } catch (error) {
    console.error('Error fetching yearbook structure:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch yearbook structure'
    }, { status: 500 })
  }
}
