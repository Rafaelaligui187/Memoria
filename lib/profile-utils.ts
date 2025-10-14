import { connectToDatabase } from './mongodb/connection'
import { ObjectId } from 'mongodb'

export interface ProfileOwnership {
  profileId: string
  ownedBy: string | ObjectId
  schoolYearId: string
  userType: string
  status: 'pending' | 'approved' | 'rejected'
}

/**
 * Get all profiles owned by a specific user
 */
export async function getProfilesByOwner(
  ownerUserId: string,
  schoolYearId?: string
): Promise<ProfileOwnership[]> {
  try {
    const db = await connectToDatabase()
    const yearbookCollection = db.collection("yearbook")

    // Convert userId to ObjectId
    let ownerObjectId
    try {
      ownerObjectId = new ObjectId(ownerUserId)
    } catch (error) {
      throw new Error('Invalid user ID format')
    }

    const query: any = { ownedBy: ownerObjectId }
    if (schoolYearId) {
      query.schoolYearId = schoolYearId
    }

    const profiles = await yearbookCollection.find(query).toArray()

    return profiles.map(profile => ({
      profileId: profile._id.toString(),
      ownedBy: profile.ownedBy instanceof ObjectId ? profile.ownedBy.toString() : profile.ownedBy,
      schoolYearId: profile.schoolYearId,
      userType: profile.userType,
      status: profile.status,
    }))
  } catch (error) {
    console.error('[v0] Error fetching profiles by owner:', error)
    throw error
  }
}

/**
 * Check if a user owns a specific profile
 */
export async function isProfileOwner(
  profileId: string,
  ownerUserId: string
): Promise<boolean> {
  try {
    const db = await connectToDatabase()
    const yearbookCollection = db.collection("yearbook")

    // Convert userId to ObjectId
    let ownerObjectId
    try {
      ownerObjectId = new ObjectId(ownerUserId)
    } catch (error) {
      return false
    }

    const profile = await yearbookCollection.findOne({
      _id: new ObjectId(profileId),
      ownedBy: ownerObjectId
    })

    return !!profile
  } catch (error) {
    console.error('[v0] Error checking profile ownership:', error)
    return false
  }
}

/**
 * Get profile ownership information
 */
export async function getProfileOwnership(profileId: string): Promise<ProfileOwnership | null> {
  try {
    const db = await connectToDatabase()
    const yearbookCollection = db.collection("yearbook")

    const profile = await yearbookCollection.findOne({
      _id: new ObjectId(profileId)
    })

    if (!profile) return null

    return {
      profileId: profile._id.toString(),
      ownedBy: profile.ownedBy instanceof ObjectId ? profile.ownedBy.toString() : profile.ownedBy,
      schoolYearId: profile.schoolYearId,
      userType: profile.userType,
      status: profile.status,
    }
  } catch (error) {
    console.error('[v0] Error getting profile ownership:', error)
    return null
  }
}

/**
 * Update profile ownership (admin function)
 */
export async function updateProfileOwnership(
  profileId: string,
  newOwnerUserId: string
): Promise<boolean> {
  try {
    const db = await connectToDatabase()
    const yearbookCollection = db.collection("yearbook")

    // Convert userId to ObjectId
    let newOwnerObjectId
    try {
      newOwnerObjectId = new ObjectId(newOwnerUserId)
    } catch (error) {
      throw new Error('Invalid user ID format')
    }

    const result = await yearbookCollection.updateOne(
      { _id: new ObjectId(profileId) },
      { 
        $set: { 
          ownedBy: newOwnerObjectId,
          updatedAt: new Date()
        }
      }
    )

    return result.modifiedCount > 0
  } catch (error) {
    console.error('[v0] Error updating profile ownership:', error)
    return false
  }
}
