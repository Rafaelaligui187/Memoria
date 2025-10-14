import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const { itemIds, action, reason, reviewedBy } = await request.json()

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No items specified",
        },
        { status: 400 },
      )
    }

    const db = getDatabase()
    const results = []

    for (const itemId of itemIds) {
      try {
        // Find item in moderation queue
        const itemIndex = db.moderationQueue.findIndex((item) => item.id === itemId)

        if (itemIndex === -1) {
          results.push({
            itemId,
            success: false,
            error: "Item not found",
          })
          continue
        }

        const item = db.moderationQueue[itemIndex]

        // Apply action
        switch (action) {
          case "approve":
            item.status = "approved"
            break
          case "reject":
            item.status = "rejected"
            item.rejectionReason = reason
            break
          case "escalate":
            item.status = "escalated"
            item.escalationLevel = (item.escalationLevel || 0) + 1
            break
          default:
            results.push({
              itemId,
              success: false,
              error: "Invalid action",
            })
            continue
        }

        // Update metadata
        item.reviewedAt = new Date().toISOString()
        item.reviewedBy = reviewedBy || "Admin User"

        // Log audit trail
        db.auditLogs.push({
          id: `audit_${Date.now()}_${itemId}`,
          action: `bulk_${action}`,
          entityType: "moderation_item",
          entityId: itemId,
          userId: reviewedBy || "admin",
          timestamp: new Date().toISOString(),
          details: {
            bulkAction: true,
            reason: reason || null,
            previousStatus: item.status,
          },
        })

        results.push({
          itemId,
          success: true,
          newStatus: item.status,
        })
      } catch (error) {
        results.push({
          itemId,
          success: false,
          error: "Processing failed",
        })
      }
    }

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: itemIds.length,
        successful: successCount,
        failed: failureCount,
      },
    })
  } catch (error) {
    console.error("Bulk action error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Bulk action failed",
      },
      { status: 500 },
    )
  }
}
