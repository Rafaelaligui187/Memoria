import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { YEARBOOK_COLLECTIONS } from "@/lib/yearbook-schemas"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolYearId = searchParams.get("schoolYearId")

    if (!schoolYearId) {
      return NextResponse.json(
        { success: false, error: "School Year ID is required" },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const collectionsToSearch = [
      'College_yearbook',
      'SeniorHigh_yearbook', 
      'JuniorHigh_yearbook',
      'Elementary_yearbook',
      'Alumni_yearbook',
      'FacultyStaff_yearbook',
      'ARSisters_yearbook',
      'advisory_profiles'
    ]

    let totalApprovedCount = 0
    let totalPendingCount = 0
    let totalMediaItems = 0
    let totalOpenReports = 0
    let recentApprovals = []
    
    // User type counts
    const userTypeCounts = {
      students: 0,
      faculty: 0,
      staff: 0,
      alumni: 0,
      arSisters: 0,
      utility: 0,
      advisory: 0
    }

    // Get counts from all collections for the specific school year
    for (const collectionName of collectionsToSearch) {
      const collection = db.collection(collectionName)
      
      // Count approved profiles (for advisory: count yearbook entries, for others: count main profiles)
      const approvedQuery: any = {
        schoolYearId: schoolYearId,
        status: "approved"
      }
      
      // For advisory profiles: only count yearbook entries
      if (collectionName === 'advisory_profiles') {
        // Don't count advisory profiles themselves in stats
        approvedQuery._id = { $exists: false } // This will return 0
      } else {
        // For other collections: exclude faculty yearbook entries
        approvedQuery.$and = [
          { $or: [
            { isFacultyEntry: { $ne: true } },
            { isFacultyEntry: { $exists: false } }
          ]}
        ]
      }
      
      const approvedCount = await collection.countDocuments(approvedQuery)
      
      // Count pending profiles (for advisory: count yearbook entries, for others: count main profiles)
      const pendingQuery: any = {
        schoolYearId: schoolYearId,
        status: "pending"
      }
      
      // For advisory profiles: only count yearbook entries
      if (collectionName === 'advisory_profiles') {
        // Don't count advisory profiles themselves in stats
        pendingQuery._id = { $exists: false } // This will return 0
      } else {
        // For other collections: exclude faculty yearbook entries, but include advisory yearbook entries
        pendingQuery.$and = [
          { $or: [
            { isFacultyEntry: { $ne: true } },
            { isFacultyEntry: { $exists: false } }
          ]}
        ]
      }
      
      const pendingCount = await collection.countDocuments(pendingQuery)
      
      totalApprovedCount += approvedCount
      totalPendingCount += pendingCount
      
      // Count by user type for approved profiles
      const userTypeQuery: any = {
        schoolYearId: schoolYearId,
        status: "approved"
      }
      
      // For advisory profiles: only count yearbook entries
      if (collectionName === 'advisory_profiles') {
        // Don't count advisory profiles themselves in stats
        userTypeQuery._id = { $exists: false } // This will return 0
      } else {
        // For other collections: exclude faculty yearbook entries
        userTypeQuery.$and = [
          { $or: [
            { isFacultyEntry: { $ne: true } },
            { isFacultyEntry: { $exists: false } }
          ]}
        ]
      }
      
      // Debug: Let's see what profiles we're actually finding
      const sampleProfiles = await collection.find(userTypeQuery).limit(3).toArray()
      console.log(`[Admin Stats] Sample profiles from ${collectionName}:`, sampleProfiles.map(p => ({
        fullName: p.fullName,
        userType: p.userType,
        status: p.status,
        department: p.department,
        schoolYearId: p.schoolYearId
      })))
      
      // Count by actual userType field for ALL collections
      // Handle both singular and plural forms
      const userTypeMappings = [
        { query: ['student', 'students'], target: 'students' },
        { query: ['faculty'], target: 'faculty' },
        { query: ['staff'], target: 'staff' },
        { query: ['utility'], target: 'utility' },
        { query: ['alumni'], target: 'alumni' },
        { query: ['ar-sisters', 'arSisters'], target: 'arSisters' },
        { query: ['advisory'], target: 'advisory' }
      ]
      
      for (const mapping of userTypeMappings) {
        const { query: userTypeValues, target: targetKey } = mapping
        
        // Create query that matches any of the userType values
        const specificQuery = { 
          ...userTypeQuery, 
          userType: { $in: userTypeValues }
        }
        
        const count = await collection.countDocuments(specificQuery)
        
        if (count > 0) {
          console.log(`[Admin Stats] ${collectionName} - ${targetKey} (${userTypeValues.join('/')}): ${count} profiles`)
        }
        
        // Add to the appropriate count
        userTypeCounts[targetKey as keyof typeof userTypeCounts] += count
      }

      // Count media items (photos, videos, documents) - excluding duplicate entries
      const mediaQuery: any = {
        schoolYearId: schoolYearId,
        $or: [
          { profileImage: { $exists: true, $ne: null } },
          { additionalPhotos: { $exists: true, $ne: [] } },
          { documents: { $exists: true, $ne: [] } }
        ]
      }
      
      // For advisory profiles: only count yearbook entries
      if (collectionName === 'advisory_profiles') {
        // Don't count advisory profiles themselves in stats
        mediaQuery._id = { $exists: false } // This will return 0
      } else {
        // For other collections: exclude faculty yearbook entries
        mediaQuery.$and = [
          { $or: [
            { isFacultyEntry: { $ne: true } },
            { isFacultyEntry: { $exists: false } }
          ]}
        ]
      }
      
      const mediaCount = await collection.countDocuments(mediaQuery)
      totalMediaItems += mediaCount

      // Get recent approvals for activity feed (excluding duplicate entries)
      const recentQuery: any = {
        schoolYearId: schoolYearId,
        status: "approved"
      }
      
      // For advisory profiles: only count yearbook entries
      if (collectionName === 'advisory_profiles') {
        // Don't count advisory profiles themselves in stats
        recentQuery._id = { $exists: false } // This will return 0
      } else {
        // For other collections: exclude faculty yearbook entries
        recentQuery.$and = [
          { $or: [
            { isFacultyEntry: { $ne: true } },
            { isFacultyEntry: { $exists: false } }
          ]}
        ]
      }
      
      const recentApproved = await collection.find(recentQuery)
      .sort({ reviewedAt: -1 })
      .limit(5)
      .toArray()

      recentApprovals.push(...recentApproved)
    }

    // Sort all recent approvals by reviewedAt
    recentApprovals.sort((a, b) => new Date(b.reviewedAt || 0).getTime() - new Date(a.reviewedAt || 0).getTime())

    // Get pending approvals for quick review (excluding duplicate entries)
    const pendingApprovals = []
    for (const collectionName of collectionsToSearch) {
      const collection = db.collection(collectionName)
      
      const pendingQuery: any = {
        schoolYearId: schoolYearId,
        status: "pending"
      }
      
      // For advisory profiles: only count yearbook entries
      if (collectionName === 'advisory_profiles') {
        // Don't count advisory profiles themselves in stats
        pendingQuery._id = { $exists: false } // This will return 0
      } else {
        // For other collections: exclude faculty yearbook entries, but include advisory yearbook entries
        pendingQuery.$and = [
          { $or: [
            { isFacultyEntry: { $ne: true } },
            { isFacultyEntry: { $exists: false } }
          ]}
        ]
      }
      
      const pending = await collection.find(pendingQuery)
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

      pendingApprovals.push(...pending)
    }

    // Sort all pending approvals by createdAt
    pendingApprovals.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())

    // Get open reports count (reports that haven't been resolved)
    try {
      const reportsCollection = db.collection('reports')
      totalOpenReports = await reportsCollection.countDocuments({
        schoolYearId: schoolYearId,
        status: { $in: ['new', 'in_progress'] }
      })
    } catch (error) {
      console.log('Reports collection not found or accessible, defaulting to 0')
      totalOpenReports = 0
    }

    console.log(`[Admin Stats] Final userTypeCounts:`, userTypeCounts)
    console.log(`[Admin Stats] Total approved count:`, totalApprovedCount)

    return NextResponse.json({
      success: true,
      data: {
        totalApprovedCount,
        totalPendingCount,
        totalMediaItems,
        totalOpenReports,
        userTypeCounts,
        pendingApprovals: pendingApprovals.slice(0, 10), // Limit to 10 most recent
        recentApprovals: recentApprovals.slice(0, 5) // Show 5 most recent
      }
    })

  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
}
