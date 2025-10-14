import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import { YEARBOOK_COLLECTIONS } from "@/lib/yearbook-schemas"

export async function GET() {
  try {
    console.log("[Overall Stats] Fetching overall statistics across all school years")

    const db = await connectToDatabase()
    
    // Get all school years
    const schoolYearsCollection = db.collection(YEARBOOK_COLLECTIONS.SCHOOL_YEARS)
    const schoolYears = await schoolYearsCollection.find({}).toArray()
    
    console.log("[Overall Stats] Found school years:", schoolYears.length)
    console.log("[Overall Stats] School years data:", schoolYears.map(year => ({
      id: year._id.toString(),
      label: year.yearLabel,
      isActive: year.isActive
    })))
    
    let totalApprovedCount = 0
    let totalPendingCount = 0
    let totalRejectedCount = 0
    let totalMediaItems = 0
    let totalOpenReports = 0
    let schoolYearStats: any[] = []

    // Process each school year
    for (const schoolYear of schoolYears) {
      const schoolYearId = schoolYear._id.toString()
      
      let yearApprovedCount = 0
      let yearPendingCount = 0
      let yearRejectedCount = 0
      let yearMediaItems = 0

      // Count profiles across all collections for this school year
      const collectionsToSearch = Object.values(YEARBOOK_COLLECTIONS)
      
      for (const collectionName of collectionsToSearch) {
        const collection = db.collection(collectionName)
        
        // Count profiles by status
        const approvedCount = await collection.countDocuments({
          schoolYearId: schoolYearId,
          status: "approved"
        })
        
        const pendingCount = await collection.countDocuments({
          schoolYearId: schoolYearId,
          status: "pending"
        })
        
        const rejectedCount = await collection.countDocuments({
          schoolYearId: schoolYearId,
          status: "rejected"
        })

        yearApprovedCount += approvedCount
        yearPendingCount += pendingCount
        yearRejectedCount += rejectedCount

        // Count media items (photos, videos, documents)
        const mediaCount = await collection.countDocuments({
          schoolYearId: schoolYearId,
          $or: [
            { profileImage: { $exists: true, $ne: null } },
            { additionalPhotos: { $exists: true, $ne: [] } },
            { documents: { $exists: true, $ne: [] } }
          ]
        })
        yearMediaItems += mediaCount
      }

      // Get open reports count for this school year
      try {
        const reportsCollection = db.collection('reports')
        const openReportsCount = await reportsCollection.countDocuments({
          schoolYearId: schoolYearId,
          status: { $in: ['open', 'pending', 'in_progress'] }
        })
        totalOpenReports += openReportsCount
      } catch (error) {
        console.log(`Reports collection not found or accessible for year ${schoolYearId}, defaulting to 0`)
      }

      // Add to totals
      totalApprovedCount += yearApprovedCount
      totalPendingCount += yearPendingCount
      totalRejectedCount += yearRejectedCount
      totalMediaItems += yearMediaItems

      // Store per-year stats
      schoolYearStats.push({
        yearId: schoolYearId,
        yearLabel: schoolYear.yearLabel,
        isActive: schoolYear.isActive,
        approvedCount: yearApprovedCount,
        pendingCount: yearPendingCount,
        rejectedCount: yearRejectedCount,
        mediaItems: yearMediaItems
      })
    }

    console.log("[Overall Stats] Statistics calculated:", {
      totalApprovedCount,
      totalPendingCount,
      totalRejectedCount,
      totalMediaItems,
      totalOpenReports,
      schoolYearsCount: schoolYears.length
    })

    return NextResponse.json({
      success: true,
      data: {
        totalApprovedCount,
        totalPendingCount,
        totalRejectedCount,
        totalMediaItems,
        totalOpenReports,
        totalSchoolYears: schoolYears.length,
        schoolYearStats: schoolYearStats.sort((a, b) => {
          // Sort by year label descending (newest first)
          return b.yearLabel.localeCompare(a.yearLabel)
        })
      }
    })

  } catch (error) {
    console.error("[Overall Stats] Error fetching overall statistics:", error)
    return NextResponse.json({
      success: false,
      message: "Failed to fetch overall statistics. Please try again."
    }, { status: 500 })
  }
}
