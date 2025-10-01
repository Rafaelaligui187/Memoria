import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get("filter") || "all"
    const unreadOnly = searchParams.get("unread") === "true"

    const db = getDatabase()
    let notifications = db.notifications.filter((n) => n.yearId === params.yearId)

    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read)
    }

    if (filter !== "all") {
      notifications = notifications.filter((n) => n.category === filter)
    }

    // Sort by timestamp, newest first
    notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    })
  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch notifications",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const { type, title, message, priority, category, actionUrl, actionLabel, metadata } = await request.json()

    const db = getDatabase()
    const notification = {
      id: `notification_${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      priority: priority || "medium",
      category: category || "general",
      yearId: params.yearId,
      actionUrl,
      actionLabel,
      metadata,
    }

    db.notifications.push(notification)

    // Log the notification creation
    db.auditLogs.push({
      id: `audit_${Date.now()}`,
      action: "notification_created",
      entityType: "notification",
      entityId: notification.id,
      userId: "system",
      timestamp: new Date().toISOString(),
      details: {
        type,
        title,
        category,
        priority,
      },
    })

    return NextResponse.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error("Notification creation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create notification",
      },
      { status: 500 },
    )
  }
}
