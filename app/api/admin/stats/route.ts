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
    const collectionsToSearch = Object.values(YEARBOOK_COLLECTIONS)

    let totalApprovedCount = 0
    let totalPendingCount = 0
    let totalMediaItems = 0
    let totalOpenReports = 0
    let recentApprovals = []

    // Get counts from all collections for the specific school year
    for (const collectionName of collectionsToSearch) {
      const collection = db.collection(collectionName)
      
      // Count approved profiles
      const approvedCount = await collection.countDocuments({
        schoolYearId: schoolYearId,
        status: "approved"
      })
      
      // Count pending profiles
      const pendingCount = await collection.countDocuments({
        schoolYearId: schoolYearId,
        status: "pending"
      })
      
      totalApprovedCount += approvedCount
      totalPendingCount += pendingCount

      // Count media items (photos, videos, documents)
      const mediaCount = await collection.countDocuments({
        schoolYearId: schoolYearId,
        $or: [
          { profileImage: { $exists: true, $ne: null } },
          { additionalPhotos: { $exists: true, $ne: [] } },
          { documents: { $exists: true, $ne: [] } }
        ]
      })
      totalMediaItems += mediaCount

      // Get recent approvals for activity feed
      const recentApproved = await collection.find({
        schoolYearId: schoolYearId,
        status: "approved"
      })
      .sort({ reviewedAt: -1 })
      .limit(5)
      .toArray()

      recentApprovals.push(...recentApproved)
    }

    // Sort all recent approvals by reviewedAt
    recentApprovals.sort((a, b) => new Date(b.reviewedAt || 0).getTime() - new Date(a.reviewedAt || 0).getTime())

    // Get pending approvals for quick review
    const pendingApprovals = []
    for (const collectionName of collectionsToSearch) {
      const collection = db.collection(collectionName)
      
      const pending = await collection.find({
        schoolYearId: schoolYearId,
        status: "pending"
      })
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

    return NextResponse.json({
      success: true,
      data: {
        totalApprovedCount,
        totalPendingCount,
        totalMediaItems,
        totalOpenReports,
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
