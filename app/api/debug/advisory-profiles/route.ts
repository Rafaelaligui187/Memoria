import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb/connection'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')
    
    console.log('🔍 Debug Advisory Profiles API called')
    
    const db = await connectToDatabase()
    
    // Advisory profiles are now stored directly in department-specific collections
    // Check department collections for advisory profiles
    const departmentCollections = [
      'Elementary_yearbook',
      'JuniorHigh_yearbook', 
      'SeniorHigh_yearbook',
      'College_yearbook'
    ]
    
    const advisoryProfiles: any[] = []
    
    for (const collectionName of departmentCollections) {
      const collection = db.collection(collectionName)
      const profiles = await collection.find({
        userType: 'advisory',
        ...(schoolYearId && { schoolYearId })
      }).toArray()
      
      console.log(`Found ${profiles.length} advisory profiles in ${collectionName}`)
      
      advisoryProfiles.push(...profiles.map(profile => ({
        ...profile,
        collection: collectionName
      })))
    }
    
    return NextResponse.json({
      success: true,
      data: {
        advisoryProfiles: advisoryProfiles.map(profile => ({
          _id: profile._id,
          fullName: profile.fullName,
          schoolYearId: profile.schoolYearId,
          department: profile.department,
          yearLevel: profile.yearLevel,
          courseProgram: profile.courseProgram,
          blockSection: profile.blockSection,
          academicDepartment: profile.academicDepartment,
          academicYearLevel: profile.academicYearLevel,
          academicSection: profile.academicSection,
          academicCourseProgram: profile.academicCourseProgram,
          status: profile.status,
          profileCreationMethod: profile.profileCreationMethod,
          createdAt: profile.createdAt,
          collection: profile.collection
        })),
        departmentSummary: {
          Elementary: advisoryProfiles.filter(p => p.department === 'Elementary').length,
          'Junior High': advisoryProfiles.filter(p => p.department === 'Junior High').length,
          'Senior High': advisoryProfiles.filter(p => p.department === 'Senior High').length,
          College: advisoryProfiles.filter(p => p.department === 'College').length
        },
        note: 'Advisory profiles are now stored directly in department-specific yearbook collections'
      }
    })
    
  } catch (error) {
    console.error('❌ Error in debug advisory profiles API:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
