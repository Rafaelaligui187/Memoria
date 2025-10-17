import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb/connection'
import { YEARBOOK_COLLECTIONS, ARSistersYearbookEntry } from '@/lib/yearbook-schemas'

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection(YEARBOOK_COLLECTIONS.AR_SISTERS)
    
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get('schoolYearId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    // Build query
    const query: any = {}
    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }
    if (status) {
      query.status = status
    }

    // Get AR Sisters profiles
    const profiles = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Get total count for pagination
    const totalCount = await collection.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: {
        profiles,
        pagination: {
          total: totalCount,
          limit,
          skip,
          hasMore: skip + limit < totalCount
        }
      }
    })
  } catch (error) {
    console.error('Error fetching AR Sisters profiles:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AR Sisters profiles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection(YEARBOOK_COLLECTIONS.AR_SISTERS)
    
    const body = await request.json()
    const {
      schoolYearId,
      schoolYear,
      userType = 'ar-sisters',
      profileData,
      isAdminEdit = false
    } = body

    // Validate required fields
    if (!schoolYearId || !schoolYear || !profileData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create AR Sisters profile entry
    const arSistersProfile: ARSistersYearbookEntry = {
      schoolYearId,
      schoolYear,
      status: isAdminEdit ? 'approved' : 'pending', // Admin edits are auto-approved
      userType: 'ar-sisters',
      ownedBy: profileData.email,
      
      // Personal Info
      fullName: profileData.fullName,
      nickname: profileData.nickname,
      age: profileData.age,
      gender: profileData.gender,
      birthday: profileData.birthday ? new Date(profileData.birthday) : undefined,
      address: profileData.address,
      email: profileData.email,
      phone: profileData.phone,
      profilePicture: profileData.profilePicture,
      
      // Religious & Professional Info
      department: 'AR Sisters',
      position: profileData.position === "Others" && profileData.customPosition ? profileData.customPosition : profileData.position,
      customPosition: profileData.customPosition || "",
      yearsOfService: profileData.yearsOfService,
      departmentAssigned: profileData.departmentAssigned,
      vowsDate: profileData.vowsDate ? new Date(profileData.vowsDate) : undefined,
      specialization: profileData.specialization,
      education: profileData.education,
      additionalRoles: profileData.additionalRoles ? profileData.additionalRoles.split(',').map((r: string) => r.trim()) : [],
      messageToStudents: profileData.messageToStudents,
      publications: profileData.publications,
      research: profileData.research,
      classesHandled: profileData.classesHandled,
      
      // Yearbook Info
      sayingMotto: profileData.sayingMotto,
      dreamJob: profileData.dreamJob,
      bio: profileData.bio,
      achievements: profileData.achievements || [],
      
      // Social Media
      socialMedia: {
        facebook: profileData.socialMediaFacebook,
        instagram: profileData.socialMediaInstagram,
        twitter: profileData.socialMediaTwitter,
      },
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Check if profile already exists for this user and school year
    const existingProfile = await collection.findOne({
      ownedBy: profileData.email,
      schoolYearId: schoolYearId
    })

    if (existingProfile) {
      console.log("[AR Sisters API] Found existing profile, replacing it")
      
      // Replace the existing profile entirely
      const updateResult = await collection.updateOne(
        { _id: existingProfile._id },
        {
          $set: {
            ...arSistersProfile,
            status: isAdminEdit ? 'approved' : 'pending', // Admin edits are auto-approved
            updatedAt: new Date(),
          }
        }
      )

      if (updateResult.modifiedCount === 0) {
        return NextResponse.json(
          { success: false, error: 'Failed to update existing AR Sisters profile' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: isAdminEdit 
          ? 'AR Sisters profile updated successfully and approved automatically' 
          : 'AR Sisters profile updated successfully',
        profileId: existingProfile._id.toString(),
        isUpdate: true
      })
    }

    // No existing profile found, create new one
    console.log("[AR Sisters API] No existing profile found, creating new one")
    
    // Insert the profile
    const result = await collection.insertOne(arSistersProfile)

    return NextResponse.json({
      success: true,
      message: isAdminEdit 
        ? 'AR Sisters profile created successfully and approved automatically' 
        : 'AR Sisters profile created successfully',
      profileId: result.insertedId
    })
  } catch (error) {
    console.error('Error creating AR Sisters profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create AR Sisters profile' },
      { status: 500 }
    )
  }
}
