import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb/connection'
import { YEARBOOK_COLLECTIONS, ARSistersYearbookEntry } from '@/lib/yearbook-schemas'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection(YEARBOOK_COLLECTIONS.AR_SISTERS)
    
    const profileId = params.id

    if (!ObjectId.isValid(profileId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid profile ID' },
        { status: 400 }
      )
    }

    const profile = await collection.findOne({ _id: new ObjectId(profileId) })

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'AR Sisters profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error('Error fetching AR Sisters profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AR Sisters profile' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection(YEARBOOK_COLLECTIONS.AR_SISTERS)
    
    const profileId = params.id
    const body = await request.json()

    if (!ObjectId.isValid(profileId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid profile ID' },
        { status: 400 }
      )
    }

    // Check if profile exists
    const existingProfile = await collection.findOne({ _id: new ObjectId(profileId) })
    if (!existingProfile) {
      return NextResponse.json(
        { success: false, error: 'AR Sisters profile not found' },
        { status: 404 }
      )
    }

    // Update profile data
    const updateData: Partial<ARSistersYearbookEntry> = {
      ...body,
      // Process position field for custom position
      position: body.position === "Others" && body.customPosition ? body.customPosition : body.position,
      updatedAt: new Date()
    }

    // Handle date fields
    if (body.birthday) {
      updateData.birthday = new Date(body.birthday)
    }
    if (body.vowsDate) {
      updateData.vowsDate = new Date(body.vowsDate)
    }

    // Handle array fields
    if (body.additionalRoles) {
      updateData.additionalRoles = Array.isArray(body.additionalRoles) ? body.additionalRoles : body.additionalRoles.split(',').map((r: string) => r.trim())
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(profileId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'AR Sisters profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'AR Sisters profile updated successfully'
    })
  } catch (error) {
    console.error('Error updating AR Sisters profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update AR Sisters profile' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection(YEARBOOK_COLLECTIONS.AR_SISTERS)
    
    const profileId = params.id

    if (!ObjectId.isValid(profileId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid profile ID' },
        { status: 400 }
      )
    }

    const result = await collection.deleteOne({ _id: new ObjectId(profileId) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'AR Sisters profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'AR Sisters profile deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting AR Sisters profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete AR Sisters profile' },
      { status: 500 }
    )
  }
}
