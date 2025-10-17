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
    
    let totalApprovedCount = 0
    let totalPendingCount = 0
    let totalRejectedCount = 0
    let totalMediaItems = 0
    let totalOpenReports = 0
    let schoolYearStats: any[] = []

    // Get all school year IDs for batch processing
    const schoolYearIds = schoolYears.map(year => year._id.toString())
    
    // Process all collections in parallel for better performance
    const collectionsToSearch = Object.values(YEARBOOK_COLLECTIONS).filter(
      collection => collection !== YEARBOOK_COLLECTIONS.SCHOOL_YEARS && 
                   collection !== YEARBOOK_COLLECTIONS.PAGES
    )
    
    // Create aggregation pipelines for each collection
    const aggregationPromises = collectionsToSearch.map(async (collectionName) => {
      const collection = db.collection(collectionName)
      
      // Use aggregation pipeline for better performance
      const pipeline = [
        {
          $match: {
            schoolYearId: { $in: schoolYearIds }
          }
        },
        {
          $group: {
            _id: {
              schoolYearId: "$schoolYearId",
              status: "$status"
            },
            count: { $sum: 1 },
            mediaCount: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $ne: ["$profileImage", null] },
                      { $gt: [{ $size: { $ifNull: ["$additionalPhotos", []] } }, 0] },
                      { $gt: [{ $size: { $ifNull: ["$documents", []] } }, 0] }
                    ]
                  },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]
      
      return collection.aggregate(pipeline).toArray()
    })
    
    // Execute all aggregations in parallel
    const aggregationResults = await Promise.all(aggregationPromises)
    
    // Process results and calculate totals
    const yearStatsMap = new Map()
    
    // Initialize year stats
    schoolYears.forEach(year => {
      const yearId = year._id.toString()
      yearStatsMap.set(yearId, {
        yearId,
        yearLabel: year.yearLabel,
        isActive: year.isActive,
        approvedCount: 0,
        pendingCount: 0,
        rejectedCount: 0,
        mediaItems: 0
      })
    })
    
    // Aggregate results from all collections
    aggregationResults.forEach((results, collectionIndex) => {
      results.forEach(result => {
        const { schoolYearId, status } = result._id
        const count = result.count
        const mediaCount = result.mediaCount
        
        const yearStats = yearStatsMap.get(schoolYearId)
        if (yearStats) {
          if (status === 'approved') {
            yearStats.approvedCount += count
            totalApprovedCount += count
          } else if (status === 'pending') {
            yearStats.pendingCount += count
            totalPendingCount += count
          } else if (status === 'rejected') {
            yearStats.rejectedCount += count
            totalRejectedCount += count
          }
          
          yearStats.mediaItems += mediaCount
          totalMediaItems += mediaCount
        }
      })
    })
    
    // Get open reports count in parallel
    try {
      const reportsCollection = db.collection('reports')
      const openReportsPipeline = [
        {
          $match: {
            schoolYearId: { $in: schoolYearIds },
            status: { $in: ['open', 'pending', 'in_progress'] }
          }
        },
        {
          $group: {
            _id: null,
            totalOpenReports: { $sum: 1 }
          }
        }
      ]
      
      const reportsResult = await reportsCollection.aggregate(openReportsPipeline).toArray()
      totalOpenReports = reportsResult[0]?.totalOpenReports || 0
    } catch (error) {
      console.log(`Reports collection not found or accessible, defaulting to 0`)
    }
    
    // Convert map to array and sort
    schoolYearStats = Array.from(yearStatsMap.values()).sort((a, b) => {
      return b.yearLabel.localeCompare(a.yearLabel)
    })

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
        schoolYearStats
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
